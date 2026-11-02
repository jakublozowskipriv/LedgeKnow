/**
 * „Algorytm” – lokalny, prosty i przejrzysty:
 *  - nieprzeczytane > przeczytane,
 *  - reakcje 🤯/👍/😐 budują sympatię do kategorii i tagów,
 *  - nowe karty i karty z tematu tygodnia dostają premię,
 *  - odrobina losowości, żeby każdy dzień był inny,
 *  - dywersyfikacja: unikamy kilku kart z tej samej dziedziny pod rząd.
 */
import type { Card } from '../shared/schema';
import type { State } from './store';
import { currentTheme, inTheme } from './themes';
import { daysSince, todayKey } from './dates';

export function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const REACTION_WEIGHT = { wow: 3, like: 1, meh: -1.5 } as const;

export function affinities(cards: Card[], state: State) {
  const cat = new Map<string, number>();
  const tag = new Map<string, number>();
  const byId = new Map(cards.map((c) => [c.id, c]));
  for (const [id, p] of Object.entries(state.progress)) {
    const c = byId.get(id);
    if (!c) continue;
    const w = p.reaction ? REACTION_WEIGHT[p.reaction] : p.readAt ? 0.3 : 0;
    if (!w) continue;
    cat.set(c.category, (cat.get(c.category) ?? 0) + w);
    for (const t of c.tags) tag.set(t, (tag.get(t) ?? 0) + w);
  }
  return { cat, tag };
}

export function isFresh(card: Card) {
  return daysSince(card.added) <= 3;
}

export function visibleCards(cards: Card[], state: State): Card[] {
  const ex = new Set(state.settings.excluded);
  return cards.filter((c) => !ex.has(c.category));
}

export function scoreCards(cards: Card[], state: State, seed: number) {
  const { cat, tag } = affinities(cards, state);
  const theme = currentTheme();
  const rand = rng(seed);
  return visibleCards(cards, state).map((c) => {
    const p = state.progress[c.id];
    let s = 0;
    if (!p?.readAt) s += 12;
    if (p?.openedAt && !p.readAt) s -= 2; // otwarta i porzucona – trochę niżej
    s += Math.max(-4, Math.min(6, (cat.get(c.category) ?? 0) * 0.8));
    s += Math.max(-2, Math.min(3, c.tags.reduce((acc, t) => acc + (tag.get(t) ?? 0), 0) * 0.25));
    if (isFresh(c)) s += 4;
    if (inTheme(c, theme)) s += 2;
    s += rand() * 6;
    return { card: c, score: s };
  });
}

/** Kolejność feedu „Odkrywaj”. Seed zmienia się co sesję. */
export function rankFeed(cards: Card[], state: State, seed: number): Card[] {
  const pool = scoreCards(cards, state, seed).sort((a, b) => b.score - a.score);
  const out: Card[] = [];
  const recent: string[] = [];
  while (pool.length) {
    let idx = pool.findIndex((x) => !recent.includes(x.card.category));
    if (idx === -1) idx = 0;
    const [picked] = pool.splice(idx, 1);
    out.push(picked.card);
    recent.push(picked.card.category);
    if (recent.length > 2) recent.shift();
  }
  return out;
}

/** Karta dnia: deterministyczna dla danej daty, wybierana z nieprzeczytanych. */
export function pickDaily(cards: Card[], state: State): Card | undefined {
  const today = todayKey();
  const existing = state.daily[today];
  const byId = new Map(cards.map((c) => [c.id, c]));
  if (existing && byId.has(existing)) return byId.get(existing);
  const recentDaily = new Set(Object.values(state.daily));
  const ranked = scoreCards(cards, state, hashString(today))
    .filter((x) => !state.progress[x.card.id]?.readAt && !recentDaily.has(x.card.id))
    .sort((a, b) => b.score - a.score);
  return (ranked[0] ?? scoreCards(cards, state, hashString(today)).sort((a, b) => b.score - a.score)[0])?.card;
}

export function dueReviews(cards: Card[], state: State): Card[] {
  const now = Date.now();
  const byId = new Map(cards.map((c) => [c.id, c]));
  return Object.entries(state.progress)
    .filter(([id, p]) => p.srs && p.srs.due <= now && byId.has(id))
    .sort((a, b) => a[1].srs!.due - b[1].srs!.due)
    .map(([id]) => byId.get(id)!);
}

/** „Królicza nora”: powiązane karty, potem karty o wspólnych tagach, potem z tej samej kategorii. */
export function rabbitHole(card: Card, cards: Card[], state: State, limit = 4): Card[] {
  const byId = new Map(cards.map((c) => [c.id, c]));
  const out: Card[] = [];
  const add = (c?: Card) => {
    if (c && c.id !== card.id && !out.includes(c) && !state.settings.excluded.includes(c.category)) out.push(c);
  };
  card.related.forEach((id) => add(byId.get(id)));
  // karty, które same wskazują na tę kartę
  cards.filter((c) => c.related.includes(card.id)).forEach(add);
  const shared = cards
    .filter((c) => c.id !== card.id)
    .map((c) => ({ c, n: c.tags.filter((t) => card.tags.includes(t)).length }))
    .filter((x) => x.n > 0)
    .sort((a, b) => b.n - a.n);
  shared.forEach((x) => add(x.c));
  cards.filter((c) => c.category === card.category).forEach(add);
  // nieprzeczytane najpierw
  return out
    .sort((a, b) => Number(!!state.progress[a.id]?.readAt) - Number(!!state.progress[b.id]?.readAt))
    .slice(0, limit);
}

const strip = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ł/g, 'l');

export function search(cards: Card[], q: string): Card[] {
  const terms = strip(q).split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return cards
    .map((c) => {
      const hay = strip([c.title, c.hook, c.tags.join(' '), c.category].join(' '));
      const body = strip(c.normal.replace(/<[^>]+>/g, ' '));
      let score = 0;
      for (const t of terms) {
        if (hay.includes(t)) score += 3;
        else if (body.includes(t)) score += 1;
        else return null;
      }
      return { c, score };
    })
    .filter((x): x is { c: Card; score: number } => !!x)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.c);
}
