import { useMemo, useRef, useState } from 'preact/hooks';
import type { Card } from '../shared/schema';
import { CATEGORIES } from '../shared/categories';
import { CATEGORY_IDS } from '../shared/constants';
import { getCards } from '../lib/data';
import { useAppState } from '../lib/store';
import { hashString, rng } from '../lib/algo';
import { go } from '../lib/router';
import { PageHeader } from '../components/bits';

interface Node {
  id: string;
  card: Card;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

/** Krawędzie: jawne powiązania + 2 najbardziej podobne karty po tagach. */
function buildEdges(cards: Card[]): [string, string][] {
  const key = (a: string, b: string) => (a < b ? `${a}|${b}` : `${b}|${a}`);
  const set = new Set<string>();
  const ids = new Set(cards.map((c) => c.id));
  for (const c of cards) for (const r of c.related) if (ids.has(r)) set.add(key(c.id, r));
  for (const c of cards) {
    const sims = cards
      .filter((o) => o.id !== c.id)
      .map((o) => ({ o, n: o.tags.filter((t) => c.tags.includes(t)).length }))
      .filter((x) => x.n > 0)
      .sort((a, b) => b.n - a.n)
      .slice(0, 2);
    for (const s of sims) set.add(key(c.id, s.o.id));
  }
  return [...set].map((k) => k.split('|') as [string, string]);
}

function layout(cards: Card[], edges: [string, string][]): Map<string, Node> {
  const r = rng(hashString(cards.map((c) => c.id).join()));
  const catIndex = new Map(CATEGORY_IDS.map((id, i) => [id, i]));
  const anchor = (cat: string) => {
    const a = ((catIndex.get(cat as never) ?? 0) / CATEGORY_IDS.length) * Math.PI * 2;
    return { x: Math.cos(a) * 260, y: Math.sin(a) * 260 };
  };
  const nodes = new Map<string, Node>();
  for (const c of cards) {
    const a = anchor(c.category);
    nodes.set(c.id, { id: c.id, card: c, x: a.x + (r() - 0.5) * 80, y: a.y + (r() - 0.5) * 80, vx: 0, vy: 0 });
  }
  const list = [...nodes.values()];
  for (let it = 0; it < 260; it++) {
    const cool = 1 - it / 260;
    for (let i = 0; i < list.length; i++) {
      const a = list[i];
      for (let j = i + 1; j < list.length; j++) {
        const b = list[j];
        let dx = a.x - b.x;
        let dy = a.y - b.y;
        const d2 = Math.max(dx * dx + dy * dy, 25);
        const f = 1800 / d2;
        const d = Math.sqrt(d2);
        dx /= d;
        dy /= d;
        a.vx += dx * f;
        a.vy += dy * f;
        b.vx -= dx * f;
        b.vy -= dy * f;
      }
    }
    for (const [ia, ib] of edges) {
      const a = nodes.get(ia)!;
      const b = nodes.get(ib)!;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const d = Math.sqrt(dx * dx + dy * dy) || 1;
      const f = (d - 70) * 0.02;
      a.vx += (dx / d) * f;
      a.vy += (dy / d) * f;
      b.vx -= (dx / d) * f;
      b.vy -= (dy / d) * f;
    }
    for (const n of list) {
      const an = anchor(n.card.category);
      n.vx += (an.x - n.x) * 0.006;
      n.vy += (an.y - n.y) * 0.006;
      n.x += Math.max(-20, Math.min(20, n.vx)) * cool;
      n.y += Math.max(-20, Math.min(20, n.vy)) * cool;
      n.vx *= 0.6;
      n.vy *= 0.6;
    }
  }
  return nodes;
}

export function MapView() {
  const s = useAppState();
  const { cards } = getCards();
  const edges = useMemo(() => buildEdges(cards), [cards]);
  const nodes = useMemo(() => layout(cards, edges), [cards, edges]);
  const [selected, setSelected] = useState<string | null>(null);

  const read = new Set(cards.filter((c) => s.progress[c.id]?.readAt).map((c) => c.id));
  const frontier = new Set<string>();
  for (const [a, b] of edges) {
    if (read.has(a) && !read.has(b)) frontier.add(b);
    if (read.has(b) && !read.has(a)) frontier.add(a);
  }

  const xs = [...nodes.values()].map((n) => n.x);
  const ys = [...nodes.values()].map((n) => n.y);
  const pad = 60;
  const bounds = {
    x: Math.min(...xs, 0) - pad,
    y: Math.min(...ys, 0) - pad,
    w: Math.max(...xs, 0) - Math.min(...xs, 0) + pad * 2,
    h: Math.max(...ys, 0) - Math.min(...ys, 0) + pad * 2,
  };
  const [view, setView] = useState(bounds);
  const drag = useRef<{ x: number; y: number; vx: number; vy: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const zoom = (k: number) =>
    setView((v) => {
      const w = v.w * k;
      const h = v.h * k;
      return { x: v.x + (v.w - w) / 2, y: v.y + (v.h - h) / 2, w, h };
    });

  const onDown = (e: PointerEvent) => {
    drag.current = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y };
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
  };
  const onMove = (e: PointerEvent) => {
    if (!drag.current || !svgRef.current) return;
    const scale = view.w / svgRef.current.clientWidth;
    setView((v) => ({ ...v, x: drag.current!.vx - (e.clientX - drag.current!.x) * scale, y: drag.current!.vy - (e.clientY - drag.current!.y) * scale }));
  };
  const onUp = () => (drag.current = null);

  const sel = selected ? nodes.get(selected) : null;
  const presentCats = CATEGORY_IDS.filter((id) => cards.some((c) => c.category === id));

  return (
    <div class="page">
      <PageHeader title="Mapa wiedzy" subtitle={`${read.size} poznanych · ${frontier.size} na horyzoncie`} backTo="/ja" />
      <div class="map-box">
        <svg
          ref={svgRef}
          class="map"
          viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        >
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {edges.map(([a, b]) => {
            const na = nodes.get(a)!;
            const nb = nodes.get(b)!;
            const lit = read.has(a) && read.has(b);
            const half = read.has(a) || read.has(b);
            return <line x1={na.x} y1={na.y} x2={nb.x} y2={nb.y} class={`edge ${lit ? 'lit' : half ? 'half' : ''}`} />;
          })}
          {[...nodes.values()].map((n) => {
            const color = CATEGORIES[n.card.category].colors[0];
            const isRead = read.has(n.id);
            const isFront = frontier.has(n.id);
            return (
              <g
                class={`node ${isRead ? 'read' : isFront ? 'front' : 'dark'} ${selected === n.id ? 'sel' : ''}`}
                transform={`translate(${n.x} ${n.y})`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected(n.id);
                }}
              >
                <circle r={isRead ? 9 : 6} fill={isRead ? color : 'transparent'} stroke={color} stroke-width={isRead ? 0 : 1.5} filter={isRead ? 'url(#glow)' : undefined} />
                <circle r="16" fill="transparent" />
                {isRead && (
                  <text y="22" text-anchor="middle">
                    {n.card.title.length > 26 ? n.card.title.slice(0, 24) + '…' : n.card.title}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
        <div class="map-zoom">
          <button class="icon-btn glass" onClick={() => zoom(0.75)} aria-label="Przybliż">
            +
          </button>
          <button class="icon-btn glass" onClick={() => zoom(1.33)} aria-label="Oddal">
            −
          </button>
          <button class="icon-btn glass" onClick={() => setView(bounds)} aria-label="Dopasuj">
            ⤢
          </button>
        </div>
      </div>

      {sel && (
        <div class="map-sel">
          <div class="grow">
            <div class="muted small">{CATEGORIES[sel.card.category].short}{read.has(sel.id) ? ' · poznane' : frontier.has(sel.id) ? ' · na horyzoncie' : ''}</div>
            <strong>{sel.card.title}</strong>
          </div>
          <button class="btn" onClick={() => go(`/karta/${sel.id}`)}>
            Otwórz
          </button>
        </div>
      )}

      <div class="legend">
        <span>
          <i class="lg lg-read" /> poznane
        </span>
        <span>
          <i class="lg lg-front" /> na horyzoncie (powiązane z poznanymi)
        </span>
        <span>
          <i class="lg lg-dark" /> jeszcze nieodkryte
        </span>
      </div>
      <div class="legend">
        {presentCats.map((id) => (
          <span>
            <i class="lg" style={{ background: CATEGORIES[id].colors[0] }} /> {CATEGORIES[id].short}
          </span>
        ))}
      </div>
    </div>
  );
}
