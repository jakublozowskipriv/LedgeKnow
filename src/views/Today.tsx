import { useEffect } from 'preact/hooks';
import { getCards } from '../lib/data';
import { useAppState, setDaily } from '../lib/store';
import { dueReviews, isFresh, pickDaily, visibleCards } from '../lib/algo';
import { greeting, monthDay, prettyToday, streak, todayKey } from '../lib/dates';
import { currentTheme, inTheme } from '../lib/themes';
import { cardHref } from '../lib/router';
import { Cover } from '../components/Cover';
import { CardTile, CategoryChip, FormatChip, Section } from '../components/bits';

export function Today() {
  const s = useAppState();
  const { cards, freshIds } = getCards();
  const daily = pickDaily(cards, s);
  const today = todayKey();

  useEffect(() => {
    if (daily && s.daily[today] !== daily.id) setDaily(today, daily.id);
  }, [daily?.id, today]);

  const due = dueReviews(cards, s);
  const visible = visibleCards(cards, s);
  const picks = visible.filter((c) => c.claudePick && !s.progress[c.id]?.readAt && c.id !== daily?.id).slice(0, 2);
  const md = monthDay();
  const onThisDay = visible.filter((c) => c.onThisDay === md);
  const theme = currentTheme();
  const themed = visible.filter((c) => inTheme(c, theme) && c.id !== daily?.id).sort((a, b) => Number(!!s.progress[a.id]?.readAt) - Number(!!s.progress[b.id]?.readAt)).slice(0, 3);
  const fresh = visible.filter((c) => (freshIds.has(c.id) || isFresh(c)) && !s.progress[c.id]?.readAt && c.id !== daily?.id).slice(0, 4);
  const st = streak(s.days);
  const readToday = Object.values(s.progress).filter((p) => p.readAt && new Date(p.readAt).toDateString() === new Date().toDateString()).length;
  const dailyRead = daily && !!s.progress[daily.id]?.readAt;

  return (
    <div class="page">
      <header class="hero-head">
        <div>
          <p class="eyebrow">{prettyToday()}</p>
          <h1 class="hero-title">{greeting()}</h1>
        </div>
        <div class="streak" title="Dni z rzędu">
          <span class="streak-n">{st}</span>
          <span class="streak-l">{st === 1 ? 'dzień' : 'dni'} z rzędu</span>
        </div>
      </header>

      {daily && (
        <a class={`daily ${dailyRead ? 'is-read' : ''}`} href={cardHref(daily.id)}>
          <div class="daily-label">{dailyRead ? '✓ Karta dnia przeczytana' : 'Karta dnia'}</div>
          <Cover card={daily} height={210} />
          <div class="daily-body">
            <div class="tile-meta">
              <CategoryChip card={daily} />
              <FormatChip card={daily} />
              <span class="chip chip-muted">{daily.minutes} min</span>
            </div>
            <h2 class="daily-title">{daily.title}</h2>
            <p class="daily-hook">{daily.hook}</p>
            <span class="btn glow">{dailyRead ? 'Przeczytaj ponownie' : 'Czytaj'}</span>
          </div>
        </a>
      )}

      <div class="stat-row">
        <a class="stat-card" href="#/powtorki">
          <span class="stat-n">{due.length}</span>
          <span class="stat-l">{due.length === 1 ? 'powtórka' : 'powtórek'} czeka</span>
        </a>
        <a class="stat-card" href="#/odkrywaj">
          <span class="stat-n">{readToday}</span>
          <span class="stat-l">przeczytane dziś</span>
        </a>
      </div>

      {onThisDay.length > 0 && (
        <Section title="Tego dnia w historii">
          <div class="list">
            {onThisDay.map((c) => (
              <CardTile card={c} compact />
            ))}
          </div>
        </Section>
      )}

      {fresh.length > 0 && (
        <Section title="Świeżo dodane" action={<a class="link" href="#/odkrywaj">Wszystkie →</a>}>
          <div class="hscroll">
            {fresh.map((c) => (
              <CardTile card={c} fresh />
            ))}
          </div>
        </Section>
      )}

      {picks.length > 0 && (
        <Section title="✦ Wybór Claude’a" action={<a class="link" href="#/claude">Więcej →</a>}>
          <div class="list">
            {picks.map((c) => (
              <CardTile card={c} compact />
            ))}
          </div>
        </Section>
      )}

      {themed.length > 0 && (
        <Section title={theme.name}>
          <p class="section-desc">{theme.desc}</p>
          <div class="list">
            {themed.map((c) => (
              <CardTile card={c} compact />
            ))}
          </div>
        </Section>
      )}

      <a class="btn wide btn-ghost" href="#/odkrywaj">
        Chcę więcej – przewijaj feed ↓
      </a>
    </div>
  );
}
