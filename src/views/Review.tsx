import { useMemo, useState } from 'preact/hooks';
import { getCards } from '../lib/data';
import { useAppState, recordReview, INTERVAL_DAYS } from '../lib/store';
import { dueReviews } from '../lib/algo';
import { cardHref } from '../lib/router';
import { Quiz, Recall } from '../components/Quiz';
import { CategoryChip, Empty, PageHeader } from '../components/bits';

/**
 * Powtórki rozłożone w czasie: przeczytane karty wracają po 1, 3, 7, 16, 35… dniach.
 * Dobrze → dłuższa przerwa. Źle → od nowa.
 */
export function Review() {
  const s = useAppState();
  const { cards } = getCards();
  // Kolejka ustalana raz na wejście, żeby nie skakała po każdej odpowiedzi.
  const queue = useMemo(() => dueReviews(cards, s).map((c) => c.id), [cards.length]);
  const [pos, setPos] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState({ ok: 0, bad: 0 });

  const totalRead = Object.values(s.progress).filter((p) => p.readAt).length;
  const upcoming = Object.values(s.progress)
    .filter((p) => p.srs && p.srs.due > Date.now())
    .sort((a, b) => a.srs!.due - b.srs!.due)[0];

  if (!queue.length || pos >= queue.length) {
    return (
      <div class="page">
        <PageHeader title="Powtórki" subtitle="Żeby wiedza nie wyparowała" />
        {pos > 0 ? (
          <div class="done-box">
            <div class="done-emoji">🌅</div>
            <h2>Sesja skończona!</h2>
            <p>
              Dobrze: <strong>{score.ok}</strong> · Do powtórki: <strong>{score.bad}</strong>
            </p>
          </div>
        ) : (
          <Empty>
            {totalRead === 0
              ? 'Najpierw przeczytaj kilka kart – po dniu wrócą tu jako krótkie pytania.'
              : 'Nic do powtórki na teraz. 🎉'}
          </Empty>
        )}
        {upcoming && <p class="hint center">Następna powtórka: {new Date(upcoming.srs!.due).toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' })}</p>}
        <div class="explainer">
          <h3>Jak to działa?</h3>
          <p>
            Każda przeczytana karta trafia do kolejki. Wraca po {INTERVAL_DAYS.slice(0, 5).join(', ')}… dniach. Za każdym razem, gdy pamiętasz, przerwa się wydłuża. To
            tzw. <em>spaced repetition</em> – jedna z najlepiej zbadanych technik zapamiętywania.
          </p>
        </div>
      </div>
    );
  }

  const card = getCards().byId.get(queue[pos])!;
  const srs = s.progress[card.id]?.srs;
  // Na zmianę: quiz wielokrotnego wyboru albo aktywne przypominanie.
  const mode = (srs?.reviews ?? 0) % 2 === 0 ? 'quiz' : 'recall';

  const grade = (ok: boolean) => {
    recordReview(card.id, ok);
    setScore((x) => ({ ok: x.ok + (ok ? 1 : 0), bad: x.bad + (ok ? 0 : 1) }));
    setAnswered(true);
  };
  const next = () => {
    setAnswered(false);
    setPos((p) => p + 1);
  };

  return (
    <div class="page">
      <PageHeader title="Powtórki" subtitle={`${pos + 1} z ${queue.length}`} />
      <div class="progress">
        <div class="progress-bar" style={{ width: `${(pos / queue.length) * 100}%` }} />
      </div>
      <div class="review-card" key={card.id + pos}>
        <div class="tile-meta">
          <CategoryChip card={card} />
        </div>
        <a class="review-title" href={cardHref(card.id)}>
          {card.title}
        </a>
        {mode === 'quiz' ? <Quiz card={card} seed={srs?.reviews ?? 0} onAnswer={grade} /> : <Recall card={card} onGrade={grade} />}
      </div>
      {answered && (
        <button class="btn wide glow" onClick={next}>
          {pos + 1 < queue.length ? 'Dalej →' : 'Zakończ'}
        </button>
      )}
    </div>
  );
}
