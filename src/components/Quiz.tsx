import { useMemo, useState } from 'preact/hooks';
import type { Card } from '../shared/schema';
import { hashString, rng } from '../lib/algo';

/** Pytanie wielokrotnego wyboru. Opcje są tasowane (w powtórkach inaczej za każdym razem). */
export function Quiz({ card, seed = 0, onAnswer }: { card: Card; seed?: number; onAnswer?: (correct: boolean) => void }) {
  const order = useMemo(() => {
    const r = rng(hashString(card.id) + seed);
    const idx = card.quiz.options.map((_, i) => i);
    for (let i = idx.length - 1; i > 0; i--) {
      const j = Math.floor(r() * (i + 1));
      [idx[i], idx[j]] = [idx[j], idx[i]];
    }
    return idx;
  }, [card.id, seed]);
  const [picked, setPicked] = useState<number | null>(null);

  const choose = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    onAnswer?.(i === card.quiz.answer);
  };

  return (
    <div class="quiz">
      <p class="quiz-q">{card.quiz.question}</p>
      <div class="quiz-options">
        {order.map((i) => {
          const state =
            picked === null ? '' : i === card.quiz.answer ? 'correct' : i === picked ? 'wrong' : 'dim';
          return (
            <button class={`quiz-opt ${state}`} onClick={() => choose(i)} disabled={picked !== null}>
              {card.quiz.options[i]}
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <div class={`quiz-result ${picked === card.quiz.answer ? 'ok' : 'bad'}`}>
          <strong>{picked === card.quiz.answer ? 'Dokładnie tak! ' : 'Nie tym razem. '}</strong>
          {card.quiz.explanation}
        </div>
      )}
    </div>
  );
}

/** „Wyjaśnij to sam” – aktywne przypominanie: najpierw pomyśl, potem odsłoń. */
export function Recall({ card, onGrade }: { card: Card; onGrade?: (ok: boolean) => void }) {
  const [shown, setShown] = useState(false);
  const [graded, setGraded] = useState<boolean | null>(null);
  return (
    <div class="recall">
      <p class="recall-q">{card.recall.question}</p>
      {!shown ? (
        <>
          <p class="recall-hint">Spróbuj odpowiedzieć w myślach albo na głos – to najlepszy sposób na zapamiętanie.</p>
          <button class="btn btn-ghost" onClick={() => setShown(true)}>
            Odsłoń odpowiedź
          </button>
        </>
      ) : (
        <>
          <p class="recall-a">{card.recall.answer}</p>
          {onGrade && graded === null && (
            <div class="row gap">
              <button class="btn btn-ghost" onClick={() => (setGraded(false), onGrade(false))}>
                Nie pamiętam
              </button>
              <button class="btn" onClick={() => (setGraded(true), onGrade(true))}>
                Pamiętam!
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
