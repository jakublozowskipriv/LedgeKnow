import { useEffect, useRef, useState } from 'preact/hooks';
import type { Card } from '../shared/schema';
import { useAppState, markOpened, markRead, setReaction, recordQuiz, update, type Level, type Reaction } from '../lib/store';
import { getCards } from '../lib/data';
import { rabbitHole, rankFeed } from '../lib/algo';
import { back, go } from '../lib/router';
import { prettyMonthDay } from '../lib/dates';
import { shareCard } from '../lib/share';
import { htmlToText, speak, stopSpeaking, ttsSupported } from '../lib/tts';
import { Cover } from '../components/Cover';
import { CardTile, CategoryChip, ConfidenceBadge, Empty, FormatChip } from '../components/bits';
import { Quiz, Recall } from '../components/Quiz';
import { CollectionSheet } from '../components/CollectionSheet';

const LEVELS: { id: Level; label: string }[] = [
  { id: 'simple', label: 'Prosto' },
  { id: 'normal', label: 'Normalnie' },
  { id: 'expert', label: 'Ekspert' },
];

const REACTIONS: { id: Reaction; emoji: string; label: string }[] = [
  { id: 'wow', emoji: '🤯', label: 'Rozwaliło mi mózg' },
  { id: 'like', emoji: '👍', label: 'Ciekawe' },
  { id: 'meh', emoji: '😐', label: 'Nie moje' },
];

export function CardPage({ id }: { id: string }) {
  const { byId, cards } = getCards();
  const card = byId.get(id);
  if (!card) {
    return (
      <div class="page">
        <Empty>
          Nie znalazłem tej karty. <a href="#/">Wróć na start</a>
        </Empty>
      </div>
    );
  }
  return <CardContent key={card.id} card={card} cards={cards} />;
}

function CardContent({ card, cards }: { card: Card; cards: Card[] }) {
  const s = useAppState();
  const p = s.progress[card.id];
  const [level, setLevel] = useState<Level>(s.settings.level);
  const [speaking, setSpeaking] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const saved = s.collections.some((c) => c.cardIds.includes(card.id));

  useEffect(() => {
    markOpened(card.id);
    return () => stopSpeaking();
  }, [card.id]);

  // Kartę uznajemy za przeczytaną, gdy dotrzesz do końca wyjaśnienia.
  useEffect(() => {
    const el = endRef.current;
    if (!el || p?.readAt) return;
    // Zwykły listener scrolla zamiast IntersectionObserver – łapie też szybkie „przeskoczenie” końca tekstu.
    const check = () => {
      if (el.getBoundingClientRect().top < window.innerHeight) {
        markRead(card.id);
        removeEventListener('scroll', check);
      }
    };
    addEventListener('scroll', check, { passive: true });
    return () => removeEventListener('scroll', check);
  }, [card.id, p?.readAt]);

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const toggleSpeak = () => {
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
      return;
    }
    const body = level === 'simple' ? card.simple : level === 'expert' ? card.normal + card.expert : card.normal;
    speak(`${card.title}. ${card.hook}. ${htmlToText(body)}`, s.settings.ttsRate, () => setSpeaking(false));
    setSpeaking(true);
  };

  const onShare = async () => {
    try {
      const r = await shareCard(card);
      if (r === 'downloaded') flash('Grafika zapisana');
    } catch (e) {
      flash((e as Error).message);
    }
  };

  const chooseLevel = (l: Level) => {
    setLevel(l);
    update((st) => {
      st.settings.level = l;
    });
  };

  const holes = rabbitHole(card, cards, s);
  const nextRandom = () => {
    const ranked = rankFeed(cards, s, Date.now()).filter((c) => c.id !== card.id && !s.progress[c.id]?.readAt);
    const next = ranked[0] ?? rankFeed(cards, s, Date.now()).find((c) => c.id !== card.id);
    if (next) go(`/karta/${next.id}`);
  };

  return (
    <article class="card-page">
      <div class="card-topbar">
        <button class="icon-btn glass" onClick={() => back('/odkrywaj')} aria-label="Wstecz">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M15 5l-7 7 7 7" /></svg>
        </button>
        <div class="row gap-s">
          {ttsSupported() && (
            <button class={`icon-btn glass ${speaking ? 'on' : ''}`} onClick={toggleSpeak} aria-label={speaking ? 'Zatrzymaj czytanie' : 'Czytaj na głos'}>
              {speaking ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 9v6h4l5 4V5L8 9zM16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" /></svg>
              )}
            </button>
          )}
          <button class="icon-btn glass" onClick={onShare} aria-label="Udostępnij">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M7 8l5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" /></svg>
          </button>
          <button class={`icon-btn glass ${saved ? 'on' : ''}`} onClick={() => setSheet(true)} aria-label="Zapisz w kolekcji">
            <svg width="20" height="20" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M6 3h12v18l-6-4-6 4z" /></svg>
          </button>
        </div>
      </div>

      <Cover card={card} height={250} showGlyph={false} />

      <div class="card-inner">
        <div class="tile-meta">
          <CategoryChip card={card} />
          <FormatChip card={card} />
          <span class="chip chip-muted">{card.minutes} min</span>
        </div>
        <h1 class="card-title">{card.title}</h1>
        <p class="card-hook">{card.hook}</p>

        {card.claudePick && (
          <aside class="claude-note">
            <div class="claude-note-head">✦ Dlaczego Claude to wybrał</div>
            <p>{card.claudePick.why}</p>
          </aside>
        )}

        {card.onThisDay && (
          <aside class="day-note">
            <strong>{prettyMonthDay(card.onThisDay)}</strong> {card.onThisDayNote ?? ''}
          </aside>
        )}

        <div class="seg" role="tablist" aria-label="Poziom wyjaśnienia">
          {LEVELS.map((l) => (
            <button role="tab" aria-selected={level === l.id} class={level === l.id ? 'active' : ''} onClick={() => chooseLevel(l.id)}>
              {l.label}
            </button>
          ))}
        </div>

        {level === 'simple' ? (
          <div class="prose prose-simple" dangerouslySetInnerHTML={{ __html: card.simple }} />
        ) : (
          <div class="prose" dangerouslySetInnerHTML={{ __html: card.normal }} />
        )}

        {level === 'simple' && (
          <button class="btn btn-ghost wide" onClick={() => chooseLevel('normal')}>
            Pełne wyjaśnienie →
          </button>
        )}

        {level === 'expert' && (
          <div class="expert-box">
            <div class="box-label">Dla dociekliwych</div>
            <div class="prose" dangerouslySetInnerHTML={{ __html: card.expert }} />
          </div>
        )}

        {card.fermi && (
          <div class="fermi">
            <div class="box-label">Szacujemy krok po kroku</div>
            <ol>
              {card.fermi.map((f) => (
                <li>
                  <span>{f.step}</span>
                  <strong>{f.value}</strong>
                </li>
              ))}
            </ol>
          </div>
        )}

        <details class="deeper">
          <summary>Głębiej w króliczą norę</summary>
          <div class="prose" dangerouslySetInnerHTML={{ __html: card.deeper }} />
        </details>

        <div ref={endRef} />

        <div class="block">
          <div class="box-label">Na ile to pewne?</div>
          <ConfidenceBadge card={card} long />
          <div class="sources">
            <div class="box-label">Źródła</div>
            <ul>
              {card.sources.map((src) => (
                <li>
                  <a href={src.url} target="_blank" rel="noopener noreferrer">
                    {src.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div class="block">
          <div class="box-label">Jak ci się podobało?</div>
          <div class="reactions">
            {REACTIONS.map((r) => (
              <button class={`reaction ${p?.reaction === r.id ? 'on' : ''}`} onClick={() => setReaction(card.id, r.id)}>
                <span class="reaction-emoji">{r.emoji}</span>
                <span>{r.label}</span>
              </button>
            ))}
          </div>
          <p class="hint">Reakcje uczą aplikację, co lubisz – wszystko zostaje na twoim telefonie.</p>
        </div>

        <div class="block">
          <div class="box-label">Sprawdź się</div>
          <Quiz card={card} onAnswer={(ok) => (recordQuiz(card.id, ok), markRead(card.id))} />
        </div>

        <div class="block">
          <div class="box-label">Wyjaśnij to sam</div>
          <Recall card={card} />
        </div>

        {holes.length > 0 && (
          <div class="block">
            <div class="box-label">Królicza nora – co dalej?</div>
            <div class="list">
              {holes.map((c) => (
                <CardTile card={c} compact />
              ))}
            </div>
          </div>
        )}

        <button class="btn wide glow" onClick={nextRandom}>
          Losuj kolejną porcję wiedzy ✦
        </button>
        <a class="btn btn-ghost wide" href="#/">
          Wróć do „Dziś”
        </a>
      </div>

      {sheet && <CollectionSheet cardId={card.id} onClose={() => setSheet(false)} />}
      {toast && <div class="toast">{toast}</div>}
    </article>
  );
}

