import type { Card, CategoryId } from '../shared/schema';
import { isoWeek } from './dates';

export interface Theme {
  id: string;
  name: string;
  desc: string;
  tags: string[];
  categories?: CategoryId[];
}

/** Tygodnie tematyczne – rotują co tydzień. Karta pasuje, jeśli ma któryś z tagów lub kategorii. */
export const THEMES: Theme[] = [
  { id: 'paradoksy', name: 'Tydzień paradoksów', desc: 'Rzeczy, które „nie mają prawa” działać – a działają.', tags: ['paradoks', 'intuicja'] },
  { id: 'umysl', name: 'Tydzień umysłu', desc: 'Jak mózg nas oszukuje, zapamiętuje i decyduje.', tags: ['umysł', 'pamięć', 'percepcja'], categories: ['psychologia'] },
  { id: 'swiaty', name: 'Tydzień światotwórcy', desc: 'Wiedza, z której zbudujesz wiarygodny fikcyjny świat.', tags: ['worldbuilding'], categories: ['swiatotworstwo'] },
  { id: 'niewiadome', name: 'Tydzień niewiadomych', desc: 'Pytania, na które nauka jeszcze nie zna odpowiedzi.', tags: ['nierozwiązane'] },
  { id: 'systemy', name: 'Tydzień systemów', desc: 'Zachęty, skutki uboczne i to, jak proste reguły tworzą chaos.', tags: ['systemy', 'zachęty'], categories: ['ekonomia', 'modele'] },
  { id: 'skala', name: 'Tydzień skali', desc: 'Liczby za duże i za małe dla intuicji.', tags: ['skala', 'liczby', 'prawdopodobieństwo'] },
  { id: 'kultura', name: 'Tydzień kultury', desc: 'Triki i mechanizmy stojące za filmem, muzyką i opowieściami.', tags: ['film', 'muzyka', 'opowieści'], categories: ['popkultura', 'sztuka'] },
];

export function currentTheme(d = new Date()): Theme {
  return THEMES[isoWeek(d) % THEMES.length];
}

export function inTheme(card: Card, theme: Theme): boolean {
  return card.tags.some((t) => theme.tags.includes(t)) || !!theme.categories?.includes(card.category);
}
