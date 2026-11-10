/**
 * Generator nowych kart wiedzy (Claude API + wyszukiwanie w sieci).
 *
 * Uruchamiany codziennie przez GitHub Actions (.github/workflows/generate.yml):
 *   ANTHROPIC_API_KEY=... npm run generate
 *
 * Zmienne środowiskowe (opcjonalne):
 *   LEDGEKNOW_CARDS   – ile kart w paczce (domyślnie 7, w tym 1 „Wybór Claude'a”)
 *   LEDGEKNOW_SPREAD_DAYS – na ile dni rozłożyć publikację kart z paczki (domyślnie 7;
 *                       0 = wszystkie od razu). Aplikacja pokazuje kartę dopiero od jej daty `added`.
 *   LEDGEKNOW_MODEL   – model (domyślnie claude-opus-5-5)
 *   LEDGEKNOW_EFFORT  – low | medium | high | xhigh | max (domyślnie high)
 *   LEDGEKNOW_DRY_RUN – "1" = pokaż plan i prompt, nie wołaj API
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import { CATEGORIES } from '../src/shared/categories';
import { CATEGORY_IDS, CONFIDENCE, FORMATS, frontmatterSchema, type CardFormat, type CategoryId } from '../src/shared/schema';
import { CARDS_DIR, ROOT, loadAllCards, parseCardFile, serializeCard } from './lib/cards';

const N = Math.max(1, Math.min(10, Number(process.env.LEDGEKNOW_CARDS || 7)));
const SPREAD_DAYS = Math.max(0, Math.min(14, Number(process.env.LEDGEKNOW_SPREAD_DAYS ?? 7)));
const MODEL = process.env.LEDGEKNOW_MODEL || 'claude-opus-5-5';
const EFFORT = (process.env.LEDGEKNOW_EFFORT || 'high') as 'low' | 'medium' | 'high' | 'xhigh' | 'max';
const DRY = process.env.LEDGEKNOW_DRY_RUN === '1';
const MAX_TURNS = 6 + 3 * N;

const today = new Date().toISOString().slice(0, 10);

/** Daty publikacji: karty z tygodniowej paczki „wychodzą” po jednej (mniej więcej) dziennie, w losowej kolejności. */
const releaseDates: string[] = (() => {
  const offsets = Array.from({ length: N }, (_, i) => (SPREAD_DAYS ? Math.floor((i * SPREAD_DAYS) / N) : 0));
  for (let i = offsets.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [offsets[i], offsets[j]] = [offsets[j], offsets[i]];
  }
  return offsets.map((d) => new Date(Date.now() + d * 86400000).toISOString().slice(0, 10));
})();

// ───────────── plan paczki ─────────────

interface Slot {
  n: number;
  category: CategoryId | 'dowolna';
  format: CardFormat;
  claudePick: boolean;
}

function pickWeighted<T>(items: T[], weight: (t: T) => number): T {
  const total = items.reduce((s, x) => s + weight(x), 0);
  let r = Math.random() * total;
  for (const x of items) {
    r -= weight(x);
    if (r <= 0) return x;
  }
  return items[items.length - 1];
}

function pickFormat(): CardFormat {
  const r = Math.random();
  if (r < 0.7) return 'standard';
  if (r < 0.8) return 'myth';
  if (r < 0.92) return 'open-question';
  return 'fermi';
}

function makePlan(counts: Map<string, number>): Slot[] {
  const slots: Slot[] = [];
  const used = new Set<string>();
  for (let i = 0; i < N - 1; i++) {
    // ulubione dziedziny mają większą wagę, a słabo pokryte dostają premię
    const cat = pickWeighted(
      CATEGORY_IDS.filter((c) => !used.has(c)),
      (c) => CATEGORIES[c].weight / Math.sqrt(1 + (counts.get(c) ?? 0)),
    );
    used.add(cat);
    slots.push({ n: i + 1, category: cat, format: pickFormat(), claudePick: false });
  }
  slots.push({ n: N, category: 'dowolna', format: pickFormat(), claudePick: true });
  return slots;
}

// ───────────── narzędzie save_card ─────────────

const nullable = (schema: object) => ({ anyOf: [schema, { type: 'null' }] });

const SAVE_CARD_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: [
    'id', 'title', 'hook', 'category', 'format', 'tags', 'confidence', 'confidenceNote', 'sources', 'related',
    'quiz', 'recall', 'fermi', 'claudePickWhy', 'onThisDay', 'onThisDayNote', 'simple', 'normal', 'expert', 'deeper',
  ],
  properties: {
    id: { type: 'string', description: 'slug: małe litery a-z, cyfry i myślniki, bez polskich znaków, np. "efekt-kobry"' },
    title: { type: 'string' },
    hook: { type: 'string', description: '1–2 zdania, maks. 250 znaków' },
    category: { type: 'string', enum: [...CATEGORY_IDS] },
    format: { type: 'string', enum: [...FORMATS] },
    tags: { type: 'array', items: { type: 'string' }, description: '2–6 krótkich tagów małymi literami, po polsku' },
    confidence: { type: 'string', enum: [...CONFIDENCE] },
    confidenceNote: nullable({ type: 'string' }),
    sources: {
      type: 'array',
      description: '1–3 prawdziwe źródła znalezione w wyszukiwarce',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['title', 'url'],
        properties: { title: { type: 'string' }, url: { type: 'string' } },
      },
    },
    related: { type: 'array', items: { type: 'string' }, description: 'id 1–3 istniejących kart, z którymi temat się łączy' },
    quiz: {
      type: 'object',
      additionalProperties: false,
      required: ['question', 'options', 'answer', 'explanation'],
      properties: {
        question: { type: 'string' },
        options: { type: 'array', items: { type: 'string' }, description: 'dokładnie 4 odpowiedzi' },
        answer: { type: 'integer', description: 'indeks poprawnej odpowiedzi (0–3)' },
        explanation: { type: 'string' },
      },
    },
    recall: {
      type: 'object',
      additionalProperties: false,
      required: ['question', 'answer'],
      properties: { question: { type: 'string' }, answer: { type: 'string' } },
    },
    fermi: nullable({
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['step', 'value'],
        properties: { step: { type: 'string' }, value: { type: 'string' } },
      },
    }),
    claudePickWhy: nullable({ type: 'string' }),
    onThisDay: nullable({ type: 'string', description: 'MM-DD, tylko jeśli temat ma wyraźną rocznicę' }),
    onThisDayNote: nullable({ type: 'string' }),
    simple: { type: 'string', description: 'Markdown: sekcja „Prosto”' },
    normal: { type: 'string', description: 'Markdown: sekcja „Wyjaśnienie”' },
    expert: { type: 'string', description: 'Markdown: sekcja „Ekspert”' },
    deeper: { type: 'string', description: 'Markdown: sekcja „Głębiej”' },
  },
} as const;

const cardInput = z.object({
  id: z.string(),
  title: z.string(),
  hook: z.string(),
  category: z.enum(CATEGORY_IDS),
  format: z.enum(FORMATS),
  tags: z.array(z.string()),
  confidence: z.enum(CONFIDENCE),
  confidenceNote: z.string().nullable(),
  sources: z.array(z.object({ title: z.string(), url: z.string() })),
  related: z.array(z.string()),
  quiz: z.object({ question: z.string(), options: z.array(z.string()), answer: z.number().int(), explanation: z.string() }),
  recall: z.object({ question: z.string(), answer: z.string() }),
  fermi: z.array(z.object({ step: z.string(), value: z.string() })).nullable(),
  claudePickWhy: z.string().nullable(),
  onThisDay: z.string().nullable(),
  onThisDayNote: z.string().nullable(),
  simple: z.string(),
  normal: z.string(),
  expert: z.string(),
  deeper: z.string(),
});

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ł/g, 'l')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70);

const norm = (s: string) => slugify(s).replace(/-/g, '');

// ───────────── główna logika ─────────────

async function main() {
  const { cards, errors } = loadAllCards();
  if (errors.length) {
    console.error('Istniejące karty mają błędy – napraw je przed generowaniem:\n' + errors.join('\n'));
    process.exit(1);
  }
  const counts = new Map<string, number>();
  for (const c of cards) counts.set(c.category, (counts.get(c.category) ?? 0) + 1);
  const existingIds = new Set(cards.map((c) => c.id));
  const existingTitles = new Set(cards.map((c) => norm(c.title)));

  const plan = makePlan(counts);
  const system = fs.readFileSync(path.join(ROOT, 'scripts', 'prompts', 'style.md'), 'utf8');

  const catalog = cards
    .slice()
    .sort((a, b) => a.category.localeCompare(b.category))
    .map((c) => `- ${c.id} [${c.category}] ${c.title}`)
    .join('\n');

  const planText = plan
    .map((s) =>
      s.claudePick
        ? `${s.n}. **Wybór Claude'a** – dowolna dziedzina, którą sam uznasz za fascynującą. Sugerowany format: ${s.format}. Wypełnij claudePickWhy.`
        : `${s.n}. Dziedzina: **${s.category}** (${CATEGORIES[s.category as CategoryId].name} – ${CATEGORIES[s.category as CategoryId].brief}). Sugerowany format: ${s.format}. claudePickWhy = null.`,
    )
    .join('\n');

  const userPrompt = `Dziś jest ${today}. Przygotuj nową paczkę ${N} kart do LedgeKnow.

## Plan paczki
${planText}

Format jest sugestią – jeśli w danej dziedzinie lepiej pasuje inny, zmień go. Dziedziny trzymaj się jednak ściśle (poza „Wyborem Claude'a”).

## Karty, które już istnieją (nie powtarzaj tematów, możesz się do nich odwoływać w "related")
${catalog}

## Jak pracować
1. Dla każdej karty wybierz temat, który nie dubluje istniejących, i zweryfikuj fakty narzędziem web_search.
2. Zapisz każdą kartę osobnym wywołaniem narzędzia save_card. Jeśli narzędzie zwróci błąd, popraw kartę i zapisz ją ponownie.
3. Gdy zapiszesz wszystkie ${N} karty, zakończ krótkim podsumowaniem (jedno zdanie na kartę).`;

  console.log(`▶ Plan (${MODEL}, effort=${EFFORT}):\n${planText}\n`);
  if (DRY) {
    console.log('--- SYSTEM ---\n' + system + '\n--- USER ---\n' + userPrompt);
    return;
  }

  const client = new Anthropic();
  const messages: Anthropic.Beta.Messages.BetaMessageParam[] = [{ role: 'user', content: userPrompt }];
  const saved: string[] = [];
  let nudged = false;
  let jsonRetries = 0;
  const totals = { input: 0, cacheRead: 0, cacheWrite: 0, output: 0, searches: 0 };

  const tools: Anthropic.Beta.Messages.BetaToolUnion[] = [
    { type: 'web_search_20260209', name: 'web_search', max_uses: 6 * N },
    {
      name: 'save_card',
      description:
        'Zapisuje jedną gotową kartę wiedzy do biblioteki LedgeKnow. Wywołaj raz na kartę, po zweryfikowaniu faktów. Treść sekcji w Markdownie, bez nagłówków.',
      input_schema: SAVE_CARD_SCHEMA as unknown as Anthropic.Beta.Messages.BetaTool.InputSchema,
      strict: true,
      eager_input_streaming: true,
    },
  ];

  for (let turn = 0; turn < MAX_TURNS; turn++) {
    const stream = client.beta.messages.stream({
      model: MODEL,
      max_tokens: 64000,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      thinking: { type: 'adaptive' },
      output_config: { effort: EFFORT },
      // Automatyczne cache'owanie: każda tura pętli wysyła całą dotychczasową rozmowę
      // (z wynikami wyszukiwania), więc bez cache płacimy za nią wielokrotnie w pełnej cenie.
      cache_control: { type: 'ephemeral' },
      system,
      tools,
      messages,
    });
    let msg: Anthropic.Beta.Messages.BetaMessage;
    try {
      msg = await stream.finalMessage();
    } catch (e) {
      // Przy eager_input_streaming SDK może nie sparsować uciętego JSON-a narzędzia – ponawiamy turę.
      if (e instanceof Anthropic.AnthropicError && !(e instanceof Anthropic.APIError) && /parse tool parameter JSON/.test(e.message) && jsonRetries++ < 2) {
        console.warn('  ⟳ nieparsowalny JSON narzędzia – ponawiam turę');
        continue;
      }
      throw e;
    }
    messages.push({ role: 'assistant', content: msg.content as Anthropic.Beta.Messages.BetaContentBlockParam[] });
    const u = msg.usage;
    totals.input += u.input_tokens;
    totals.cacheRead += u.cache_read_input_tokens ?? 0;
    totals.cacheWrite += u.cache_creation_input_tokens ?? 0;
    totals.output += u.output_tokens;
    totals.searches += u.server_tool_use?.web_search_requests ?? 0;
    console.log(
      `  tura ${turn + 1}: stop_reason=${msg.stop_reason}, model=${msg.model}, in=${u.input_tokens}, cache_read=${u.cache_read_input_tokens ?? 0}, cache_write=${u.cache_creation_input_tokens ?? 0}, out=${u.output_tokens}`,
    );

    if (msg.stop_reason === 'refusal') {
      console.error('Model odmówił wykonania (refusal):', JSON.stringify(msg.stop_details));
      break;
    }
    if (msg.stop_reason === 'pause_turn') continue;

    const toolUses = msg.content.filter((b): b is Anthropic.Beta.Messages.BetaToolUseBlock => b.type === 'tool_use');
    if (toolUses.length) {
      const results: Anthropic.Beta.Messages.BetaToolResultBlockParam[] = toolUses.map((tu) => {
        if (tu.name !== 'save_card') return { type: 'tool_result', tool_use_id: tu.id, is_error: true, content: `Nieznane narzędzie ${tu.name}` };
        if (msg.stop_reason === 'max_tokens') {
          return { type: 'tool_result', tool_use_id: tu.id, is_error: true, content: 'Wywołanie zostało ucięte (max_tokens). Zapisz kartę ponownie, w całości.' };
        }
        try {
          const id = saveCard(tu.input, existingIds, existingTitles, releaseDates[saved.length] ?? today);
          saved.push(id);
          existingIds.add(id);
          console.log(`  ✔ zapisano ${id}`);
          return { type: 'tool_result', tool_use_id: tu.id, content: `Zapisano kartę jako ${id}. Zapisane dotąd: ${saved.length}/${N}.` };
        } catch (e) {
          console.warn(`  ✖ odrzucono kartę: ${(e as Error).message}`);
          return { type: 'tool_result', tool_use_id: tu.id, is_error: true, content: `Karta odrzucona: ${(e as Error).message}` };
        }
      });
      messages.push({ role: 'user', content: results });
      continue;
    }

    if (msg.stop_reason === 'max_tokens') {
      messages.push({ role: 'user', content: 'Kontynuuj od miejsca, w którym przerwałeś.' });
      continue;
    }

    // end_turn
    if (saved.length < N && !nudged) {
      nudged = true;
      messages.push({ role: 'user', content: `Zapisano ${saved.length} z ${N} kart. Dokończ brakujące karty narzędziem save_card.` });
      continue;
    }
    break;
  }

  // końcowa walidacja całej biblioteki
  const after = loadAllCards();
  if (after.errors.length) {
    console.error('Po generowaniu biblioteka ma błędy:\n' + after.errors.join('\n'));
    for (const id of saved) fs.rmSync(path.join(CARDS_DIR, `${id}.md`), { force: true });
    process.exit(1);
  }
  console.log(`\n✔ Gotowe: ${saved.length}/${N} nowych kart: ${saved.join(', ') || '—'}`);
  console.log(
    `  Tokeny: wejście ${totals.input}, z cache ${totals.cacheRead}, zapis do cache ${totals.cacheWrite}, wyjście ${totals.output}; wyszukiwań: ${totals.searches}`,
  );
  if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `saved=${saved.length}\nids=${saved.join(',')}\n`);
  if (!saved.length) process.exit(1);
}

/** Waliduje dane z narzędzia, zapisuje plik .md i zwraca id. Rzuca błąd z czytelnym opisem dla modelu. */
function saveCard(raw: unknown, existingIds: Set<string>, existingTitles: Set<string>, added = today): string {
  const input = cardInput.parse(raw);
  const id = slugify(input.id || input.title);
  if (!id) throw new Error('Puste id.');
  if (existingIds.has(id)) throw new Error(`Karta o id "${id}" już istnieje – wybierz inny temat albo inne id.`);
  if (existingTitles.has(norm(input.title))) throw new Error('Karta o takim tytule już istnieje – wybierz inny temat.');
  if (input.quiz.options.length !== 4) throw new Error('Quiz musi mieć dokładnie 4 odpowiedzi.');
  if (input.quiz.answer < 0 || input.quiz.answer > 3) throw new Error('quiz.answer musi być w zakresie 0–3.');
  if (!input.sources.length) throw new Error('Podaj co najmniej jedno źródło z URL.');
  for (const s of input.sources) if (!/^https?:\/\/\S+\.\S+/.test(s.url)) throw new Error(`Nieprawidłowy URL źródła: ${s.url}`);
  if (input.format === 'fermi' && !input.fermi?.length) throw new Error('Format fermi wymaga listy kroków "fermi".');
  const words = input.normal.split(/\s+/).length;
  if (words < 120) throw new Error(`Sekcja „Wyjaśnienie” jest za krótka (${words} słów) – rozwiń ją do 180–300 słów.`);
  if (input.onThisDay && !/^\d{2}-\d{2}$/.test(input.onThisDay)) throw new Error('onThisDay musi mieć format MM-DD.');

  const meta = frontmatterSchema.parse({
    id,
    title: input.title.trim(),
    hook: input.hook.trim(),
    category: input.category,
    format: input.format,
    tags: input.tags.map((t) => t.toLowerCase().trim()).filter(Boolean).slice(0, 8),
    confidence: input.confidence,
    confidenceNote: input.confidenceNote ?? undefined,
    sources: input.sources.slice(0, 4),
    related: input.related.filter((r) => existingIds.has(r)).slice(0, 4),
    quiz: input.quiz,
    recall: input.recall,
    fermi: input.format === 'fermi' ? input.fermi ?? undefined : undefined,
    claudePick: input.claudePickWhy ? { why: input.claudePickWhy.trim() } : undefined,
    onThisDay: input.onThisDay ?? undefined,
    onThisDayNote: input.onThisDay ? input.onThisDayNote ?? undefined : undefined,
    added,
  });

  const strip = (s: string) => s.replace(/^\s*#{1,6}\s+.*$/gm, '').trim();
  const md = serializeCard(meta, {
    simple: strip(input.simple),
    normal: strip(input.normal),
    expert: strip(input.expert),
    deeper: strip(input.deeper),
  });
  // podwójne sprawdzenie: plik musi dać się sparsować tak samo jak ręcznie pisane karty
  parseCardFile(md, `${id}.md`);
  fs.writeFileSync(path.join(CARDS_DIR, `${id}.md`), md);
  return id;
}

export { saveCard };

const isMain = import.meta.url === pathToFileURL(process.argv[1] ?? '').href;
if (isMain) main().catch((e) => {
  if (e instanceof Anthropic.AuthenticationError) console.error('Błąd uwierzytelnienia – sprawdź sekret ANTHROPIC_API_KEY.');
  else if (e instanceof Anthropic.RateLimitError) console.error('Limit zapytań API – spróbuj później.');
  else if (e instanceof Anthropic.APIError) console.error(`Błąd API ${e.status}: ${e.message}`);
  else console.error(e);
  process.exit(1);
});
