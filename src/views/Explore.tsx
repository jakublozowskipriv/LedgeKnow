import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { getCards } from '../lib/data';
import { useAppState, toggleInCollection } from '../lib/store';
import { rankFeed, search, visibleCards, isFresh } from '../lib/algo';
import { cardHref, go } from '../lib/router';
import { CATEGORIES } from '../shared/categories';
import { CATEGORY_IDS, type CategoryId } from '../shared/constants';
import { Cover } from '../components/Cover';
import { CardTile, CategoryChip, Empty, FormatChip, PageHeader } from '../components/bits';
import { Glyph } from '../components/Glyph';

// Kolejność feedu jest stała w obrębie sesji, żeby powrót z karty nie mieszał listy.
const sessionSeed = Math.floor(Math.random() * 1e9);
let feedOrder: string[] | null = null;
let lastIndex = 0;

export function Explore() {
  const s = useAppState();
  const { cards } = getCards();
  const ref = useRef<HTMLDivElement>(null);

  const feed = useMemo(() => {
    const byId = new Map(cards.map((c) => [c.id, c]));
    const visible = new Set(visibleCards(cards, s).map((c) => c.id));
    if (!feedOrder || feedOrder.length !== visible.size || feedOrder.some((id) => !visible.has(id))) {
      feedOrder = rankFeed(cards, s, sessionSeed).map((c) => c.id);
    }
    return feedOrder.map((id) => byId.get(id)!).filter(Boolean);
  }, [cards, s.settings.excluded.join()]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.scrollTop = lastIndex * el.clientHeight;
    const on = () => {
      lastIndex = Math.round(el.scrollTop / el.clientHeight);
    };
    el.addEventListener('scroll', on, { passive: true });
    return () => el.removeEventListener('scroll', on);
  }, []);

  const saved = new Set(s.collections.find((c) => c.id === 'zapisane')?.cardIds ?? []);

  return (
    <div class="feed-wrap">
      <div class="feed-top">
        <span class="feed-title">Odkrywaj</span>
        <div class="row gap-s">
          <a class="icon-btn glass" href="#/szukaj" aria-label="Szukaj i kategorie">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
          </a>
        </div>
      </div>
      <div class="feed" ref={ref}>
        {feed.map((c, i) => {
          const read = !!s.progress[c.id]?.readAt;
          return (
            <section class="slide" key={c.id}>
              <div class="slide-card" onClick={() => go(`/karta/${c.id}`)}>
                <Cover card={c} height={300} />
                <div class="slide-body">
                  <div class="tile-meta">
                    <CategoryChip card={c} />
                    <FormatChip card={c} />
                    {c.claudePick && <span class="chip chip-claude">✦ Claude</span>}
                    {isFresh(c) && !read && <span class="chip chip-new">Nowe</span>}
                    {read && <span class="chip chip-muted">✓ przeczytane</span>}
                  </div>
                  <h2 class="slide-title">{c.title}</h2>
                  <p class="slide-hook">{c.hook}</p>
                  <div class="slide-actions">
                    <a class="btn glow" href={cardHref(c.id)} onClick={(e) => e.stopPropagation()}>
                      Czytaj · {c.minutes} min
                    </a>
                    <button
                      class={`icon-btn glass ${saved.has(c.id) ? 'on' : ''}`}
                      aria-label="Zapisz"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleInCollection('zapisane', c.id);
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill={saved.has(c.id) ? 'currentColor' : 'none'} stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M6 3h12v18l-6-4-6 4z" /></svg>
                    </button>
                  </div>
                </div>
              </div>
              {i === 0 && <div class="swipe-hint">przesuń w górę ↑</div>}
            </section>
          );
        })}
        <section class="slide slide-end">
          <div class="end-box">
            <div class="loading-sun" />
            <h2>To już wszystko… na razie</h2>
            <p>Nowe karty dochodzą codziennie. Zajrzyj do powtórek albo na mapę wiedzy.</p>
            <a class="btn" href="#/powtorki">Powtórki</a>
            <a class="btn btn-ghost" href="#/mapa">Mapa wiedzy</a>
          </div>
        </section>
      </div>
    </div>
  );
}

export function SearchPage() {
  const s = useAppState();
  const { cards } = getCards();
  const [q, setQ] = useState('');
  const results = q.trim() ? search(cards, q) : [];
  const counts = new Map<CategoryId, { all: number; read: number }>();
  for (const c of cards) {
    const x = counts.get(c.category) ?? { all: 0, read: 0 };
    x.all++;
    if (s.progress[c.id]?.readAt) x.read++;
    counts.set(c.category, x);
  }
  return (
    <div class="page">
      <PageHeader title="Szukaj" backTo="/odkrywaj" />
      <input class="input search" type="search" placeholder="np. pamięć, smoki, kryptografia…" value={q} onInput={(e) => setQ((e.target as HTMLInputElement).value)} autoFocus />
      {q.trim() ? (
        results.length ? (
          <div class="list">
            {results.map((c) => (
              <CardTile card={c} compact />
            ))}
          </div>
        ) : (
          <Empty>Nic nie znalazłem dla „{q}”. Może wkrótce – generator dorzuca nowe karty codziennie.</Empty>
        )
      ) : (
        <>
          <h2 class="h2">Dziedziny</h2>
          <div class="cat-grid">
            {CATEGORY_IDS.filter((id) => counts.has(id)).map((id) => {
              const cat = CATEGORIES[id];
              const n = counts.get(id)!;
              return (
                <a class="cat-tile" href={`#/kategoria/${id}`} style={{ '--c1': cat.colors[0], '--c2': cat.colors[1] }}>
                  <Glyph category={id} size={26} />
                  <span class="cat-name">{cat.short}</span>
                  <span class="cat-count">
                    {n.read}/{n.all}
                  </span>
                </a>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export function CategoryPage({ id }: { id: CategoryId }) {
  const s = useAppState();
  const { cards } = getCards();
  const cat = CATEGORIES[id];
  if (!cat) return <Empty>Nie ma takiej dziedziny.</Empty>;
  const list = cards.filter((c) => c.category === id).sort((a, b) => Number(!!s.progress[a.id]?.readAt) - Number(!!s.progress[b.id]?.readAt));
  const read = list.filter((c) => s.progress[c.id]?.readAt).length;
  return (
    <div class="page">
      <PageHeader title={cat.name} subtitle={`${read} z ${list.length} przeczytanych`} backTo="/szukaj" />
      <div class="list">
        {list.map((c) => (
          <CardTile card={c} compact />
        ))}
      </div>
    </div>
  );
}
