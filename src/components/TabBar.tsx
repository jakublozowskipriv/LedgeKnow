import type { JSX } from 'preact';

interface Tab {
  href: string;
  label: string;
  match: (p: string) => boolean;
  icon: JSX.Element;
  badge?: number;
}

const ic = (d: string) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);

export function TabBar({ path, reviewCount }: { path: string; reviewCount: number }) {
  const tabs: Tab[] = [
    { href: '#/', label: 'Dziś', match: (p) => p === '/', icon: ic('M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z') },
    { href: '#/odkrywaj', label: 'Odkrywaj', match: (p) => p.startsWith('/odkrywaj') || p.startsWith('/szukaj') || p.startsWith('/kategoria'), icon: ic('M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM15.5 8.5l-2 5-5 2 2-5z') },
    { href: '#/claude', label: 'Claude', match: (p) => p.startsWith('/claude'), icon: ic('M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z') },
    { href: '#/powtorki', label: 'Powtórki', match: (p) => p.startsWith('/powtorki'), icon: ic('M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3M18 3v4h-4M6 21v-4h4'), badge: reviewCount },
    { href: '#/ja', label: 'Ja', match: (p) => ['/ja', '/mapa', '/kolekcja', '/ustawienia', '/powiadomienia'].some((x) => p.startsWith(x)), icon: ic('M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0') },
  ];
  return (
    <nav class="tabbar" aria-label="Nawigacja">
      {tabs.map((t) => (
        <a href={t.href} class={`tab ${t.match(path) ? 'active' : ''}`}>
          <span class="tab-icon">
            {t.icon}
            {!!t.badge && <span class="tab-badge">{t.badge > 9 ? '9+' : t.badge}</span>}
          </span>
          <span class="tab-label">{t.label}</span>
        </a>
      ))}
    </nav>
  );
}
