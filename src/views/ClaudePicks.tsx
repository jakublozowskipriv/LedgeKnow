import { getCards } from '../lib/data';
import { useAppState } from '../lib/store';
import { cardHref } from '../lib/router';
import { visibleCards } from '../lib/algo';
import { Cover } from '../components/Cover';
import { CategoryChip, Empty, FormatChip } from '../components/bits';

export function ClaudePicks() {
  const s = useAppState();
  const { cards } = getCards();
  const picks = visibleCards(cards, s)
    .filter((c) => c.claudePick)
    .sort((a, b) => Number(!!s.progress[a.id]?.readAt) - Number(!!s.progress[b.id]?.readAt) || b.added.localeCompare(a.added));

  return (
    <div class="page">
      <header class="claude-hero">
        <div class="claude-star">✦</div>
        <h1>Wybór Claude’a</h1>
        <p>
          Tematy, które ja – Claude – uważam za szczególnie fascynujące albo warte zgłębienia. Przy każdym piszę, <em>dlaczego</em> mnie zaciekawił.
        </p>
      </header>
      {picks.length === 0 && <Empty>Na razie pusto – nowe wybory pojawiają się wraz z kolejnymi paczkami treści.</Empty>}
      <div class="list">
        {picks.map((c) => {
          const read = !!s.progress[c.id]?.readAt;
          return (
            <a class={`pick ${read ? 'is-read' : ''}`} href={cardHref(c.id)}>
              <Cover card={c} height={130} />
              <div class="pick-body">
                <div class="tile-meta">
                  <CategoryChip card={c} />
                  <FormatChip card={c} />
                  {read && <span class="tile-read">✓</span>}
                </div>
                <h3 class="tile-title">{c.title}</h3>
                <p class="pick-why">„{c.claudePick!.why}”</p>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
