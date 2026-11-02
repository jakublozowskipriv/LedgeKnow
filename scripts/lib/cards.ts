import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { Marked, type Tokens } from 'marked';
import {
  frontmatterSchema,
  SECTION_HEADINGS,
  type Card,
  type CardFrontmatter,
  type SectionKey,
} from '../../src/shared/schema';

export const ROOT = path.resolve(import.meta.dirname, '..', '..');
export const CARDS_DIR = path.join(ROOT, 'content', 'cards');

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const marked = new Marked({
  gfm: true,
  renderer: {
    // Surowy HTML w treści (np. z generatora) zawsze escapujemy.
    html({ text }: Tokens.HTML | Tokens.Tag) {
      return escapeHtml(text);
    },
    link({ href, title, tokens }: Tokens.Link) {
      const inner = this.parser.parseInline(tokens);
      const safe = /^https?:\/\//.test(href) ? href : '#';
      const t = title ? ` title="${escapeHtml(title)}"` : '';
      return `<a href="${escapeHtml(safe)}"${t} target="_blank" rel="noopener noreferrer">${inner}</a>`;
    },
  },
});

export interface ParsedFile {
  meta: CardFrontmatter;
  sections: Record<SectionKey, string>;
}

/** Parsuje plik .md karty: frontmatter YAML + sekcje „## Prosto/Wyjaśnienie/Ekspert/Głębiej”. */
export function parseCardFile(raw: string, fileName: string): ParsedFile {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) throw new Error(`${fileName}: brak frontmattera (--- ... ---)`);
  let data: unknown;
  try {
    data = YAML.parse(m[1]);
  } catch (e) {
    throw new Error(`${fileName}: błędny YAML we frontmatterze – ${(e as Error).message}`);
  }
  const parsed = frontmatterSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(
      `${fileName}: błędny frontmatter:\n` +
        parsed.error.issues.map((i) => `  - ${i.path.join('.')}: ${i.message}`).join('\n'),
    );
  }
  const meta = parsed.data;
  if (meta.quiz.answer >= meta.quiz.options.length) {
    throw new Error(`${fileName}: quiz.answer poza zakresem opcji`);
  }
  if (meta.format === 'fermi' && !meta.fermi?.length) {
    throw new Error(`${fileName}: format fermi wymaga listy kroków "fermi"`);
  }

  const headingToKey = new Map<string, SectionKey>(
    Object.entries(SECTION_HEADINGS).map(([k, v]) => [v.toLowerCase(), k as SectionKey]),
  );
  const sections: Partial<Record<SectionKey, string>> = {};
  let current: SectionKey | null = null;
  const buf: string[] = [];
  const flush = () => {
    if (current) sections[current] = buf.join('\n').trim();
    buf.length = 0;
  };
  for (const line of m[2].split(/\r?\n/)) {
    const h = line.match(/^##\s+(.+?)\s*$/);
    if (h && headingToKey.has(h[1].toLowerCase())) {
      flush();
      current = headingToKey.get(h[1].toLowerCase())!;
      continue;
    }
    buf.push(line);
  }
  flush();
  for (const key of Object.keys(SECTION_HEADINGS) as SectionKey[]) {
    if (!sections[key]) throw new Error(`${fileName}: brak sekcji "## ${SECTION_HEADINGS[key]}"`);
  }
  return { meta, sections: sections as Record<SectionKey, string> };
}

const wordCount = (s: string) => s.split(/\s+/).filter(Boolean).length;

export function toCard({ meta, sections }: ParsedFile): Card {
  return {
    ...meta,
    simple: marked.parse(sections.simple, { async: false }),
    normal: marked.parse(sections.normal, { async: false }),
    expert: marked.parse(sections.expert, { async: false }),
    deeper: marked.parse(sections.deeper, { async: false }),
    minutes: Math.max(1, Math.ceil(wordCount(sections.normal + ' ' + sections.deeper) / 170)),
  };
}

export function loadAllCards(): { cards: Card[]; errors: string[] } {
  const files = fs.readdirSync(CARDS_DIR).filter((f) => f.endsWith('.md')).sort();
  const cards: Card[] = [];
  const errors: string[] = [];
  const seen = new Set<string>();
  for (const f of files) {
    try {
      const parsed = parseCardFile(fs.readFileSync(path.join(CARDS_DIR, f), 'utf8'), f);
      if (parsed.meta.id + '.md' !== f) errors.push(`${f}: nazwa pliku musi być równa id (${parsed.meta.id}.md)`);
      if (seen.has(parsed.meta.id)) errors.push(`${f}: zduplikowane id`);
      seen.add(parsed.meta.id);
      cards.push(toCard(parsed));
    } catch (e) {
      errors.push((e as Error).message);
    }
  }
  // Powiązania do nieistniejących kart po cichu usuwamy (generator może wskazać coś, czego jeszcze nie ma).
  for (const c of cards) c.related = c.related.filter((r) => seen.has(r) && r !== c.id);
  return { cards, errors };
}

/** Serializuje kartę z powrotem do formatu .md (używane przez generator). */
export function serializeCard(meta: CardFrontmatter, sections: Record<SectionKey, string>): string {
  const clean = Object.fromEntries(Object.entries(meta).filter(([, v]) => v !== undefined));
  const fm = YAML.stringify(clean, { lineWidth: 0 }).trim();
  const body = (Object.keys(SECTION_HEADINGS) as SectionKey[])
    .map((k) => `## ${SECTION_HEADINGS[k]}\n\n${sections[k].trim()}\n`)
    .join('\n');
  return `---\n${fm}\n---\n\n${body}`;
}
