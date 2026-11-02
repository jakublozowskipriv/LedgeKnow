import { useEffect, useState } from 'preact/hooks';
import type { Card, CardsBundle } from '../shared/schema';
import { getState, update } from './store';

interface DataState {
  status: 'loading' | 'ready' | 'error';
  cards: Card[];
  byId: Map<string, Card>;
  /** ile kart doszło od ostatniej wizyty */
  freshCount: number;
  freshIds: Set<string>;
  error?: string;
}

let data: DataState = { status: 'loading', cards: [], byId: new Map(), freshCount: 0, freshIds: new Set() };
const listeners = new Set<() => void>();
let started = false;

async function fetchCards() {
  try {
    const res = await fetch('./data/cards.json', { cache: 'no-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const bundle = (await res.json()) as CardsBundle;
    const s = getState();
    const known = new Set(s.knownIds);
    const firstVisit = known.size === 0;
    const freshIds = new Set(firstVisit ? [] : bundle.cards.filter((c) => !known.has(c.id)).map((c) => c.id));
    data = {
      status: 'ready',
      cards: bundle.cards,
      byId: new Map(bundle.cards.map((c) => [c.id, c])),
      freshCount: freshIds.size,
      freshIds,
    };
    if (s.lastVersion !== bundle.version) {
      update((st) => {
        st.knownIds = bundle.cards.map((c) => c.id);
        st.lastVersion = bundle.version;
      });
    }
  } catch (e) {
    data = { ...data, status: 'error', error: (e as Error).message };
  }
  listeners.forEach((l) => l());
}

export function useCards(): DataState {
  const [, force] = useState(0);
  useEffect(() => {
    const l = () => force((n) => n + 1);
    listeners.add(l);
    if (!started) {
      started = true;
      void fetchCards();
    }
    return () => void listeners.delete(l);
  }, []);
  return data;
}

export function getCards(): DataState {
  return data;
}
