import { useState } from 'preact/hooks';
import { getCards } from '../lib/data';
import { useAppState, deleteCollection, createCollection } from '../lib/store';
import { streak } from '../lib/dates';
import { go } from '../lib/router';
import { CATEGORIES } from '../shared/categories';
import { CATEGORY_IDS } from '../shared/constants';
import { CardTile, Empty, PageHeader, Section } from '../components/bits';
import { Glyph } from '../components/Glyph';

export function Me() {
  const s = useAppState();
  const { cards } = getCards();
  const read = cards.filter((c) => s.progress[c.id]?.readAt);
  const wow = Object.values(s.progress).filter((p) => p.reaction === 'wow').length;
  const quizzes = Object.values(s.progress).filter((p) => p.quiz);
  const quizOk = quizzes.filter((p) => p.quiz!.correct).length;
  const mastered = Object.values(s.progress).filter((p) => (p.srs?.step ?? 0) >= 3).length;

  const perCat = CATEGORY_IDS.map((id) => ({
    id,
    total: cards.filter((c) => c.category === id).length,
    read: read.filter((c) => c.category === id).length,
  })).filter((x) => x.total > 0);
  const maxTotal = Math.max(1, ...perCat.map((x) => x.total));

  return (
    <div class="page">
      <PageHeader title="Twoja wiedza" subtitle="Wszystko zapisane lokalnie na tym telefonie" />

      <div class="stats-grid">
        <Stat n={streak(s.days)} l="dni z rzędu" />
        <Stat n={read.length} l={`z ${cards.length} kart`} />
        <Stat n={mastered} l="utrwalonych" />
        <Stat n={wow} l="🤯 olśnień" />
        <Stat n={quizzes.length ? `${Math.round((quizOk / quizzes.length) * 100)}%` : '–'} l="trafność quizów" />
        <Stat n={s.days.length} l="dni nauki" />
      </div>

      <a class="map-cta" href="#/mapa">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="8" cy="10" r="3" /><circle cx="30" cy="8" r="3" /><circle cx="20" cy="22" r="4" /><circle cx="9" cy="32" r="3" /><circle cx="32" cy="30" r="3" />
          <path d="M10.5 12l7 8M27.5 10l-5 9M17 25l-6 5M23.5 24.5l6 4" />
        </svg>
        <div>
          <strong>Mapa wiedzy</strong>
          <span>Zobacz, jak łączą się poznane koncepty</span>
        </div>
        <span class="chev">→</span>
      </a>

      <Section title="Dziedziny">
        <div class="bars">
          {perCat.map((x) => {
            const cat = CATEGORIES[x.id];
            return (
              <a class="bar-row" href={`#/kategoria/${x.id}`}>
                <span class="bar-label">
                  <Glyph category={x.id} size={15} /> {cat.short}
                </span>
                <span class="bar-track">
                  <span class="bar-total" style={{ width: `${(x.total / maxTotal) * 100}%` }}>
                    <span class="bar-fill" style={{ width: `${x.total ? (x.read / x.total) * 100 : 0}%`, background: `linear-gradient(90deg, ${cat.colors[1]}, ${cat.colors[0]})` }} />
                  </span>
                </span>
                <span class="bar-n">
                  {x.read}/{x.total}
                </span>
              </a>
            );
          })}
        </div>
      </Section>

      <Collections />

      <div class="menu">
        <a class="menu-item" href="#/powiadomienia">🔔 Powiadomienia</a>
        <a class="menu-item" href="#/ustawienia">⚙️ Ustawienia i kopia zapasowa</a>
      </div>
    </div>
  );
}

function Stat({ n, l }: { n: number | string; l: string }) {
  return (
    <div class="stat">
      <span class="stat-n">{n}</span>
      <span class="stat-l">{l}</span>
    </div>
  );
}

function Collections() {
  const s = useAppState();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  return (
    <Section title="Kolekcje" action={<button class="link" onClick={() => setAdding((x) => !x)}>+ Nowa</button>}>
      {adding && (
        <form
          class="row gap-s mb"
          onSubmit={(e) => {
            e.preventDefault();
            if (name.trim()) {
              createCollection(name);
              setName('');
              setAdding(false);
            }
          }}
        >
          <input class="input grow" placeholder="Nazwa kolekcji" value={name} onInput={(e) => setName((e.target as HTMLInputElement).value)} />
          <button class="btn">Dodaj</button>
        </form>
      )}
      <div class="menu">
        {s.collections.map((c) => (
          <a class="menu-item" href={`#/kolekcja/${c.id}`}>
            <span class="grow">{c.id === 'zapisane' ? '🔖 ' : '📁 '}{c.name}</span>
            <span class="muted">{c.cardIds.length}</span>
          </a>
        ))}
      </div>
    </Section>
  );
}

export function CollectionPage({ id }: { id: string }) {
  const s = useAppState();
  const { byId } = getCards();
  const col = s.collections.find((c) => c.id === id);
  if (!col) return <Empty>Nie ma takiej kolekcji.</Empty>;
  const list = col.cardIds.map((x) => byId.get(x)).filter((c) => !!c);
  return (
    <div class="page">
      <PageHeader
        title={col.name}
        subtitle={`${list.length} kart`}
        backTo="/ja"
        right={
          id !== 'zapisane' && (
            <button
              class="link danger"
              onClick={() => {
                if (confirm(`Usunąć kolekcję „${col.name}”? Karty zostaną w aplikacji.`)) {
                  deleteCollection(id);
                  go('/ja');
                }
              }}
            >
              Usuń
            </button>
          )
        }
      />
      {list.length ? (
        <div class="list">
          {list.map((c) => (
            <CardTile card={c} compact />
          ))}
        </div>
      ) : (
        <Empty>Pusto. Dodawaj karty ikoną zakładki na karcie.</Empty>
      )}
    </div>
  );
}
