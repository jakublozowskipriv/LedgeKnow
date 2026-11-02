/**
 * Jedno źródło prawdy o kształcie karty wiedzy.
 * Używane przez: skrypt budujący treści, generator (Claude API) i aplikację (typy).
 */
import { z } from 'zod';

import { CATEGORY_IDS, FORMATS, CONFIDENCE } from './constants';
export * from './constants';

/** Metadane z frontmattera pliku .md */
export const frontmatterSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, 'id: tylko małe litery, cyfry i myślniki'),
  title: z.string().min(3).max(120),
  hook: z.string().min(10).max(260),
  category: z.enum(CATEGORY_IDS),
  format: z.enum(FORMATS).default('standard'),
  tags: z.array(z.string()).min(1).max(8),
  confidence: z.enum(CONFIDENCE),
  confidenceNote: z.string().max(300).optional(),
  sources: z
    .array(z.object({ title: z.string(), url: z.string().url() }))
    .min(1),
  related: z.array(z.string()).default([]),
  quiz: z.object({
    question: z.string(),
    options: z.array(z.string()).min(3).max(5),
    answer: z.number().int().min(0),
    explanation: z.string(),
  }),
  recall: z.object({
    question: z.string(),
    answer: z.string(),
  }),
  fermi: z
    .array(z.object({ step: z.string(), value: z.string() }))
    .optional(),
  claudePick: z.object({ why: z.string() }).optional(),
  onThisDay: z
    .string()
    .regex(/^\d{2}-\d{2}$/, 'onThisDay w formacie MM-DD')
    .optional(),
  onThisDayNote: z.string().optional(),
  added: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export type CardFrontmatter = z.infer<typeof frontmatterSchema>;

/** Karta po zbudowaniu (to trafia do cards.json). Sekcje są już HTML-em. */
export interface Card extends CardFrontmatter {
  simple: string;
  normal: string;
  expert: string;
  deeper: string;
  /** szacowany czas czytania wersji „Wyjaśnienie” w minutach */
  minutes: number;
}

export interface CardsBundle {
  version: string;
  generatedAt: string;
  cards: Card[];
}
