import type { CategoryId } from '../shared/schema';

/** Proste liniowe ikony kategorii (siatka 24×24). */
const PATHS: Record<CategoryId, string> = {
  psychologia:
    'M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 1V5a2 2 0 0 0-3-1zM15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 1M9 9h2M13 13h2M9 15h1',
  informatyka:
    'M7 7h10v10H7zM10 10h4v4h-4zM9 3v4M15 3v4M9 17v4M15 17v4M3 9h4M3 15h4M17 9h4M17 15h4',
  swiatotworstwo:
    'M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2zM9 4v14M15 6v14M5 11l2 1M17 9l1 2',
  popkultura:
    'M4 8h16v11H4zM4 8l3-4M10 8l3-4M16 8l3-4M10 11.5v5l4.5-2.5z',
  fizyka:
    'M12 12m-1.5 0a1.5 1.5 0 1 0 3 0 1.5 1.5 0 1 0-3 0M12 3c4 0 4 18 0 18S8 3 12 3zM4.2 7.5c2-3.4 17.6 5.6 15.6 9S2.2 10.9 4.2 7.5zM4.2 16.5c-2-3.4 13.6-12.4 15.6-9s-13.6 12.4-15.6 9z',
  chemia: 'M9 3h6M10 3v6L4.5 18.5A1.6 1.6 0 0 0 6 21h12a1.6 1.6 0 0 0 1.5-2.5L14 9V3M7 15h10',
  kosmos:
    'M12 12m-5 0a5 5 0 1 0 10 0 5 5 0 1 0-10 0M3 15c2 2 16-3 18-7 .6-1.3-1.3-1.6-3.6-1.1M5.7 17.4C4 17.6 2.6 17.2 3 15',
  biologia: 'M5 19c0-8 5-14 15-15 0 10-6 15-14 15zM5 19l9-9M9 15H6M12 12V8',
  medycyna: 'M3 12h4l2-5 3 10 2-6 1.5 3H21',
  matematyka: 'M18 5H6l6 7-6 7h12M15 15h5M17.5 12.5v5',
  historia: 'M3 21h18M4 9h16M5 9l7-5 7 5M6 9v10M10 9v10M14 9v10M18 9v10',
  ekonomia: 'M12 12m-8 0a8 8 0 1 0 16 0 8 8 0 1 0-16 0M14.5 9a2.5 2 0 0 0-2.5-1.5c-1.5 0-2.5.8-2.5 2 0 2.8 5 1.7 5 4.5 0 1.2-1 2-2.5 2A2.5 2 0 0 1 9.5 15M12 6v1.5M12 16.5V18',
  jezyk: 'M4 5h16v11H11l-5 4v-4H4zM8 9h8M8 12h5',
  filozofia: 'M12 3a6 6 0 0 0-3.5 10.9V17h7v-3.1A6 6 0 0 0 12 3zM9.5 20h5M10 17v3M14 17v3M12 7v4',
  modele: 'M12 3l9 5-9 5-9-5zM3 13l9 5 9-5M3 17l9 5 9-5',
  ziemia: 'M12 12m-9 0a9 9 0 1 0 18 0 9 9 0 1 0-18 0M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18',
  sztuka: 'M9 18V5l11-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM20 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM9 9l11-2',
};

export function Glyph({ category, size = 20, stroke = 'currentColor' }: { category: CategoryId; size?: number; stroke?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} stroke-width={1.6} stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d={PATHS[category]} />
    </svg>
  );
}

export const GLYPH_PATHS = PATHS;
