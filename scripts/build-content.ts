/**
 * Waliduje wszystkie karty z content/cards i buduje public/data/cards.json.
 * Uruchamiane automatycznie przed `dev` i `build`.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { loadAllCards, ROOT } from './lib/cards';
import type { CardsBundle } from '../src/shared/schema';

const { cards, errors } = loadAllCards();

if (errors.length) {
  console.error(`✖ Błędy w treściach (${errors.length}):\n` + errors.join('\n'));
  process.exit(1);
}

// Najnowsze karty na początku.
cards.sort((a, b) => b.added.localeCompare(a.added) || a.id.localeCompare(b.id));

const json = JSON.stringify(cards);
const bundle: CardsBundle = {
  version: crypto.createHash('sha1').update(json).digest('hex').slice(0, 10),
  generatedAt: new Date().toISOString(),
  cards,
};

const outDir = path.join(ROOT, 'public', 'data');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'cards.json'), JSON.stringify(bundle));

const byCat = new Map<string, number>();
for (const c of cards) byCat.set(c.category, (byCat.get(c.category) ?? 0) + 1);
console.log(
  `✔ ${cards.length} kart → public/data/cards.json (wersja ${bundle.version})\n  ` +
    [...byCat.entries()].map(([k, v]) => `${k}: ${v}`).join(', '),
);
