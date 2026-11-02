import { useMemo } from 'preact/hooks';
import type { Card } from '../shared/schema';
import { CATEGORIES } from '../shared/categories';
import { hashString, rng } from '../lib/algo';
import { Glyph } from './Glyph';

let instance = 0;

/**
 * Proceduralna okładka w stylu vaporwave – każda karta ma własną, powtarzalną grafikę
 * (słońce z paskami, siatka perspektywiczna, góry / ocean / planeta), w kolorach kategorii.
 */
export function Cover({ card, height = 200, showGlyph = true }: { card: Pick<Card, 'id' | 'category'>; height?: number; showGlyph?: boolean }) {
  const uid = useMemo(() => `c${(instance++).toString(36)}`, []);
  const g = useMemo(() => build(card.id), [card.id]);
  const [c1, c2] = CATEGORIES[card.category].colors;
  const W = 400;
  const H = 250;
  const horizon = 165;

  return (
    <div class="cover" style={{ height: `${height}px` }}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" width="100%" height="100%" aria-hidden="true">
        <defs>
          <linearGradient id={`${uid}sky`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#0b0618" />
            <stop offset="0.6" stop-color={c2} stop-opacity="0.55" />
            <stop offset="1" stop-color={c1} stop-opacity="0.85" />
          </linearGradient>
          <linearGradient id={`${uid}sun`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#fffb96" />
            <stop offset="0.45" stop-color="#ff9e64" />
            <stop offset="1" stop-color={c1} />
          </linearGradient>
          <linearGradient id={`${uid}floor`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color={c1} stop-opacity="0.25" />
            <stop offset="1" stop-color="#0b0618" />
          </linearGradient>
          <mask id={`${uid}stripes`}>
            <rect x="0" y="0" width={W} height={H} fill="white" />
            {g.stripes.map((y, i) => (
              <rect x="0" y={g.sunY + y} width={W} height={2 + i * 1.3} fill="black" />
            ))}
          </mask>
          <clipPath id={`${uid}above`}>
            <rect x="0" y="0" width={W} height={horizon} />
          </clipPath>
        </defs>

        <rect width={W} height={H} fill={`url(#${uid}sky)`} />

        {g.stars.map(([x, y, r]) => (
          <circle cx={x} cy={y} r={r} fill="#fff" opacity={0.35 + r * 0.3} />
        ))}

        {g.variant === 2 ? (
          <g clip-path={`url(#${uid}above)`}>
            <circle cx={g.sunX} cy={g.sunY + 10} r={g.sunR * 0.85} fill={`url(#${uid}sun)`} mask={`url(#${uid}stripes)`} />
            <ellipse cx={g.sunX} cy={g.sunY + 10} rx={g.sunR * 1.5} ry={g.sunR * 0.28} fill="none" stroke="#05d9e8" stroke-width="2" opacity="0.8" transform={`rotate(-12 ${g.sunX} ${g.sunY + 10})`} />
          </g>
        ) : (
          <circle cx={g.sunX} cy={g.sunY} r={g.sunR} fill={`url(#${uid}sun)`} mask={`url(#${uid}stripes)`} clip-path={`url(#${uid}above)`} />
        )}

        {g.variant === 0 && (
          <polygon points={g.mountains} fill="#0b0618" fill-opacity="0.9" stroke="#05d9e8" stroke-width="1.2" stroke-opacity="0.8" />
        )}

        {/* podłoga */}
        <rect x="0" y={horizon} width={W} height={H - horizon} fill={`url(#${uid}floor)`} />
        <rect x="0" y={horizon} width={W} height={H - horizon} fill="#0b0618" opacity="0.55" />
        <g stroke={g.variant === 1 ? '#05d9e8' : '#ff2a6d'} stroke-width="1" opacity="0.75">
          <line x1="0" y1={horizon} x2={W} y2={horizon} stroke-width="1.6" />
          {g.hLines.map((y) => (
            <line x1="0" y1={y} x2={W} y2={y} />
          ))}
          {g.variant !== 1 &&
            g.vLines.map((x) => <line x1={W / 2 + (x - W / 2) * 0.06} y1={horizon} x2={x} y2={H} />)}
        </g>

        {/* pływający kształt */}
        <g transform={`translate(${g.shapeX} ${g.shapeY}) rotate(${g.shapeRot})`} fill="none" stroke="#fffb96" stroke-width="1.4" opacity="0.85">
          {g.shape === 0 && <polygon points="0,-16 14,10 -14,10" />}
          {g.shape === 1 && <circle r="11" />}
          {g.shape === 2 && (
            <>
              <rect x="-10" y="-10" width="14" height="14" />
              <rect x="-4" y="-16" width="14" height="14" />
              <path d="M-10 -10 L-4 -16 M4 -10 L10 -16 M4 4 L10 -2 M-10 4 L-4 -2" />
            </>
          )}
          {g.shape === 3 && <path d="M-12 0 Q-6 -10 0 0 T12 0" />}
        </g>
      </svg>
      {showGlyph && (
        <div class="cover-glyph">
          <Glyph category={card.category} size={22} />
        </div>
      )}
    </div>
  );
}

function build(id: string) {
  const r = rng(hashString(id));
  const W = 400;
  const H = 250;
  const horizon = 165;
  const variant = Math.floor(r() * 3);
  const sunR = 48 + r() * 30;
  const sunX = 110 + r() * 180;
  const sunY = horizon - sunR * (0.35 + r() * 0.35);
  const stripes = Array.from({ length: 6 }, (_, i) => sunR * 0.05 + i * (sunR * 0.17));
  const stars = Array.from({ length: 26 }, () => [r() * W, r() * horizon * 0.8, r() * 1.2 + 0.2] as const);
  const peaks: string[] = [`0,${horizon}`];
  let x = 0;
  while (x < W) {
    x += 25 + r() * 45;
    peaks.push(`${Math.min(x, W)},${horizon - 10 - r() * 55}`);
    x += 15 + r() * 25;
    peaks.push(`${Math.min(x, W)},${horizon - r() * 12}`);
  }
  peaks.push(`${W},${horizon}`);
  const hLines: number[] = [];
  let y = horizon;
  let step = 3;
  while (y < H) {
    y += step;
    step *= 1.35;
    hLines.push(y);
  }
  const vLines = Array.from({ length: 21 }, (_, i) => -W + (i * (3 * W)) / 20);
  const left = r() < 0.5;
  return {
    variant,
    sunR,
    sunX,
    sunY,
    stripes,
    stars,
    mountains: peaks.join(' '),
    hLines,
    vLines,
    shape: Math.floor(r() * 4),
    shapeX: left ? 40 + r() * 50 : 310 + r() * 50,
    shapeY: 78 + r() * 30,
    shapeRot: r() * 360,
  };
}
