/** Stałe bez zależności (bez zod) – bezpieczne do importu w aplikacji. */

export const CATEGORY_IDS = [
  'psychologia',
  'informatyka',
  'swiatotworstwo',
  'popkultura',
  'fizyka',
  'chemia',
  'kosmos',
  'biologia',
  'medycyna',
  'matematyka',
  'historia',
  'ekonomia',
  'jezyk',
  'filozofia',
  'modele',
  'ziemia',
  'sztuka',
] as const;

export type CategoryId = (typeof CATEGORY_IDS)[number];

export const FORMATS = ['standard', 'myth', 'open-question', 'fermi'] as const;
export type CardFormat = (typeof FORMATS)[number];

export const CONFIDENCE = ['established', 'mainstream', 'debated', 'speculative'] as const;
export type Confidence = (typeof CONFIDENCE)[number];

/** Sekcje treści w ciele pliku .md (nagłówki drugiego stopnia). */
export const SECTION_HEADINGS = {
  simple: 'Prosto',
  normal: 'Wyjaśnienie',
  expert: 'Ekspert',
  deeper: 'Głębiej',
} as const;

export type SectionKey = keyof typeof SECTION_HEADINGS;

