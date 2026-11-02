import type { ComponentChildren } from 'preact';
import type { Card } from '../shared/schema';
import { CATEGORIES, CONFIDENCE_LABELS, FORMAT_LABELS } from '../shared/categories';
import { cardHref, back } from '../lib/router';
import { Cover } from './Cover';
import { Glyph } from './Glyph';
import { useAppState } from '../lib/store';
import { isFresh } from '../lib/algo';

export function CategoryChip({ card }: { card: Pick<Card, 'category'> }) {
  const cat = CATEGORIES[card.category];
  return (
    <a class="chip" href={`#/kategoria/${cat.id}`} style={{ '--chip': cat.colors[0] }} onClick={(e) => e.stopPropagation()}>
      <Glyph category={cat.id} size={14} />
      {cat.short}
    </a>
  );
}

export function FormatChip({ card }: { card: Pick<Card, 'format'> }) {
  if (card.format === 'standard') return null;
  return <span class={`chip chip-format f-${card.format}`}>{FORMAT_LABELS[card.format]}</span>;
}

export function ConfidenceBadge({ card, long = false }: { card: Card; long?: boolean }) {
  const c = CONFIDENCE_LABELS[card.confidence];
  return (
    <div class={`confidence conf-${card.confidence}`}>
      <span class="conf-dot" />
      <span class="conf-label">{c.label}</span>
      {long && <p class="conf-desc">{card.confidenceNote ?? c.desc}</p>}
    </div>
  );
}

/** Kafelek karty na listach. */
export function CardTile({ card, compact = false, fresh }: { card: Card; compact?: boolean; fresh?: boolean }) {
  const s = useAppState();
  const read = !!s.progress[card.id]?.readAt;
  const showFresh = fresh ?? (isFresh(card) && !read);
  return (
    <a class={`tile ${compact ? 'tile-compact' : ''} ${read ? 'is-read' : ''}`} href={cardHref(card.id)}>
      <Cover card={card} height={compact ? 84 : 150} showGlyph={!compact} />
      <div class="tile-body">
        <div class="tile-meta">
          <CategoryChip card={card} />
          <FormatChip card={card} />
          {showFresh && <span class="chip chip-new">Nowe</span>}
          {read && <span class="tile-read" title="Przeczytane">✓</span>}
        </div>
        <h3 class="tile-title">{card.title}</h3>
        {!compact && <p class="tile-hook">{card.hook}</p>}
        <div class="tile-foot">{card.minutes} min czytania</div>
      </div>
    </a>
  );
}

export function PageHeader({ title, subtitle, backTo, right }: { title: ComponentChildren; subtitle?: ComponentChildren; backTo?: string; right?: ComponentChildren }) {
  return (
    <header class="page-header">
      {backTo !== undefined && (
        <button class="icon-btn" onClick={() => back(backTo)} aria-label="Wstecz">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M15 5l-7 7 7 7" /></svg>
        </button>
      )}
      <div class="page-header-text">
        <h1>{title}</h1>
        {subtitle && <p class="page-sub">{subtitle}</p>}
      </div>
      {right}
    </header>
  );
}

export function Section({ title, action, children }: { title: ComponentChildren; action?: ComponentChildren; children: ComponentChildren }) {
  return (
    <section class="section">
      <div class="section-head">
        <h2>{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function Empty({ children }: { children: ComponentChildren }) {
  return <div class="empty">{children}</div>;
}

export function Loading() {
  return (
    <div class="loading">
      <div class="loading-sun" />
      <p>Ładuję wiedzę…</p>
    </div>
  );
}
