/**
 * Stan aplikacji trzymany lokalnie w telefonie (localStorage).
 * Brak kont – eksport/import w ustawieniach służy jako kopia zapasowa.
 */
import { useEffect, useState } from 'preact/hooks';
import type { CategoryId } from '../shared/schema';
import { todayKey } from './dates';

export type Reaction = 'wow' | 'like' | 'meh';
export type Level = 'simple' | 'normal' | 'expert';

export interface Srs {
  step: number;
  due: number;
  reviews: number;
  lapses: number;
}

export interface CardProgress {
  openedAt?: number;
  readAt?: number;
  reaction?: Reaction;
  quiz?: { correct: boolean; at: number };
  srs?: Srs;
}

export interface Collection {
  id: string;
  name: string;
  cardIds: string[];
}

export interface State {
  v: 1;
  progress: Record<string, CardProgress>;
  collections: Collection[];
  /** data (YYYY-MM-DD) → id karty dnia */
  daily: Record<string, string>;
  /** dni, w których przeczytano co najmniej jedną kartę */
  days: string[];
  settings: {
    level: Level;
    excluded: CategoryId[];
    ttsRate: number;
  };
  /** id kart znanych przy poprzedniej wizycie – do oznaczania „Nowe” */
  knownIds: string[];
  lastVersion?: string;
}

const KEY = 'ledgeknow:v1';

const initial = (): State => ({
  v: 1,
  progress: {},
  collections: [{ id: 'zapisane', name: 'Zapisane', cardIds: [] }],
  daily: {},
  days: [],
  settings: { level: 'normal', excluded: [], ttsRate: 1 },
  knownIds: [],
});

function load(): State {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initial();
    const parsed = JSON.parse(raw) as Partial<State>;
    const base = initial();
    return {
      ...base,
      ...parsed,
      settings: { ...base.settings, ...parsed.settings },
      collections: parsed.collections?.length ? parsed.collections : base.collections,
    };
  } catch {
    return initial();
  }
}

let state: State = load();
const listeners = new Set<() => void>();

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* tryb prywatny / brak miejsca – aplikacja działa dalej w pamięci */
  }
}

export function getState(): State {
  return state;
}

export function update(fn: (draft: State) => void) {
  const next = structuredClone(state);
  fn(next);
  state = next;
  persist();
  listeners.forEach((l) => l());
}

export function useAppState(): State {
  const [, force] = useState(0);
  useEffect(() => {
    const l = () => force((n) => n + 1);
    listeners.add(l);
    return () => void listeners.delete(l);
  }, []);
  return state;
}

// ───────────── akcje ─────────────

export const INTERVAL_DAYS = [1, 3, 7, 16, 35, 90, 180];
const DAY = 24 * 60 * 60 * 1000;

export function markOpened(id: string) {
  if (state.progress[id]?.openedAt) return;
  update((s) => {
    s.progress[id] = { ...s.progress[id], openedAt: Date.now() };
  });
}

export function markRead(id: string) {
  if (state.progress[id]?.readAt) return;
  update((s) => {
    const p = (s.progress[id] = { ...s.progress[id] });
    p.readAt = Date.now();
    p.srs ??= { step: 0, due: Date.now() + INTERVAL_DAYS[0] * DAY, reviews: 0, lapses: 0 };
    const today = todayKey();
    if (!s.days.includes(today)) s.days.push(today);
  });
}

export function setReaction(id: string, r: Reaction) {
  update((s) => {
    const p = (s.progress[id] = { ...s.progress[id] });
    p.reaction = p.reaction === r ? undefined : r;
  });
}

export function recordQuiz(id: string, correct: boolean) {
  update((s) => {
    const p = (s.progress[id] = { ...s.progress[id] });
    p.quiz = { correct, at: Date.now() };
  });
}

/** Wynik powtórki: dobrze → dłuższa przerwa, źle → od początku. */
export function recordReview(id: string, ok: boolean) {
  update((s) => {
    const p = (s.progress[id] = { ...s.progress[id] });
    const srs = p.srs ?? { step: 0, due: 0, reviews: 0, lapses: 0 };
    srs.reviews++;
    if (ok) srs.step = Math.min(srs.step + 1, INTERVAL_DAYS.length - 1);
    else {
      srs.step = 0;
      srs.lapses++;
    }
    srs.due = Date.now() + INTERVAL_DAYS[srs.step] * DAY;
    p.srs = srs;
  });
}

export function toggleInCollection(collectionId: string, cardId: string) {
  update((s) => {
    const c = s.collections.find((x) => x.id === collectionId);
    if (!c) return;
    c.cardIds = c.cardIds.includes(cardId)
      ? c.cardIds.filter((x) => x !== cardId)
      : [cardId, ...c.cardIds];
  });
}

export function createCollection(name: string): string {
  const id = `k-${Date.now().toString(36)}`;
  update((s) => {
    s.collections.push({ id, name: name.trim() || 'Bez nazwy', cardIds: [] });
  });
  return id;
}

export function deleteCollection(id: string) {
  if (id === 'zapisane') return;
  update((s) => {
    s.collections = s.collections.filter((c) => c.id !== id);
  });
}

export function setDaily(date: string, id: string) {
  update((s) => {
    s.daily[date] = id;
    // trzymamy tylko ostatnie ~60 dni
    const keys = Object.keys(s.daily).sort();
    for (const k of keys.slice(0, Math.max(0, keys.length - 60))) delete s.daily[k];
  });
}

export function exportState(): string {
  return JSON.stringify(state, null, 2);
}

export function importState(json: string) {
  const parsed = JSON.parse(json) as State;
  if (parsed?.v !== 1 || typeof parsed.progress !== 'object') throw new Error('To nie wygląda na kopię LedgeKnow.');
  update((s) => Object.assign(s, initial(), parsed));
}

export function resetState() {
  update((s) => Object.assign(s, initial()));
}

export function isRead(id: string) {
  return !!state.progress[id]?.readAt;
}
