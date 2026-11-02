/**
 * Sprawdza, czy linki do źródeł w kartach działają.
 *   npm run check-links            – wszystkie karty
 *   npm run check-links -- id1,id2 – tylko wybrane karty
 * Zwraca kod 1 tylko z flagą --strict (w CI jest informacyjny).
 */
import { loadAllCards } from './lib/cards';

const args = process.argv.slice(2);
const strict = args.includes('--strict');
const only = args.find((a) => !a.startsWith('--'))?.split(',').filter(Boolean);

const { cards } = loadAllCards();
const targets = cards.filter((c) => !only?.length || only.includes(c.id));
const entries = targets.flatMap((c) => c.sources.map((s) => ({ id: c.id, url: s.url })));

async function check(url: string): Promise<number> {
  const opts = { redirect: 'follow' as const, headers: { 'User-Agent': 'LedgeKnow-linkcheck/1.0 (+https://github.com)' }, signal: AbortSignal.timeout(20000) };
  try {
    let res = await fetch(url, { ...opts, method: 'HEAD' });
    if (res.status >= 400) res = await fetch(url, { ...opts, method: 'GET' });
    return res.status;
  } catch {
    return 0;
  }
}

const bad: string[] = [];
await Promise.all(
  entries.map(async ({ id, url }) => {
    const status = await check(url);
    // 403/429 często oznacza tylko blokadę botów (np. wydawcy czasopism) – raportujemy jako ostrzeżenie.
    if (status === 0 || status === 404 || status === 410 || status >= 500) bad.push(`✖ ${status} ${id}: ${url}`);
    else if (status >= 400) console.log(`⚠ ${status} ${id}: ${url}`);
  }),
);

console.log(`Sprawdzono ${entries.length} linków w ${targets.length} kartach.`);
if (bad.length) {
  console.log(bad.join('\n'));
  if (process.env.GITHUB_STEP_SUMMARY) {
    const fs = await import('node:fs');
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `### Niedziałające źródła\n\n${bad.map((b) => `- ${b}`).join('\n')}\n`);
  }
  if (strict) process.exit(1);
} else console.log('✔ Wszystkie linki odpowiadają.');
