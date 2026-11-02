/**
 * Wysyła powiadomienie push z jedną kartą (uruchamiane przez .github/workflows/notify.yml).
 *
 * Wymagane zmienne:
 *   PUSH_SUBSCRIPTION  – JSON subskrypcji skopiowany z aplikacji (Ja → Powiadomienia);
 *                        może być też tablica JSON albo kilka subskrypcji w osobnych liniach
 *   VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY – klucze z `npx web-push generate-vapid-keys`
 * Opcjonalne:
 *   VAPID_SUBJECT      – np. mailto:ty@example.com (domyślnie mailto:ledgeknow@example.com)
 */
import fs from 'node:fs';
import path from 'node:path';
import webpush from 'web-push';
import type { CardsBundle } from '../src/shared/schema';
import { ROOT } from './lib/cards';

function parseSubscriptions(raw: string): webpush.PushSubscription[] {
  const trimmed = raw.trim();
  if (trimmed.startsWith('[')) return JSON.parse(trimmed);
  return trimmed
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => JSON.parse(l));
}

async function main() {
  const { PUSH_SUBSCRIPTION, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY } = process.env;
  if (!PUSH_SUBSCRIPTION || !VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    console.log('Brak PUSH_SUBSCRIPTION / VAPID_* – pomijam (instrukcja w README).');
    return;
  }
  webpush.setVapidDetails(process.env.VAPID_SUBJECT || 'mailto:ledgeknow@example.com', VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

  const bundle = JSON.parse(fs.readFileSync(path.join(ROOT, 'public', 'data', 'cards.json'), 'utf8')) as CardsBundle;
  const cards = bundle.cards;
  if (!cards.length) return;

  // Połowa powiadomień promuje świeże karty (z ostatnich 3 dni), reszta – losowe z całej biblioteki.
  const cutoff = new Date(Date.now() - 3 * 86400000).toISOString().slice(0, 10);
  const fresh = cards.filter((c) => c.added >= cutoff);
  const pool = fresh.length && Math.random() < 0.5 ? fresh : cards;
  const card = pool[Math.floor(Math.random() * pool.length)];

  const payload = JSON.stringify({
    title: card.claudePick ? `✦ ${card.title}` : card.title,
    body: card.hook,
    url: `./#/karta/${card.id}`,
    tag: card.id,
  });

  let ok = 0;
  for (const sub of parseSubscriptions(PUSH_SUBSCRIPTION)) {
    try {
      await webpush.sendNotification(sub, payload, { TTL: 6 * 3600, urgency: 'normal' });
      ok++;
    } catch (e) {
      const err = e as { statusCode?: number; body?: string };
      if (err.statusCode === 404 || err.statusCode === 410) {
        console.error('Subskrypcja wygasła – włącz powiadomienia w aplikacji ponownie i zaktualizuj sekret PUSH_SUBSCRIPTION.');
      } else {
        console.error(`Błąd wysyłki (${err.statusCode ?? '?'}): ${err.body ?? e}`);
      }
    }
  }
  console.log(`Wysłano ${ok} powiadomień: „${card.title}”`);
  if (!ok) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
