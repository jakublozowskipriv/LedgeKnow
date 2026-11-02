import { useEffect, useState } from 'preact/hooks';
import { PageHeader, Section } from '../components/bits';
import { getSubscription, isIOS, isStandalone, pushSupported, subscribe, testLocalNotification, unsubscribe, VAPID_PUBLIC_KEY } from '../lib/push';

export function Notifications() {
  const [sub, setSub] = useState<PushSubscription | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const supported = pushSupported();
  const standalone = isStandalone();
  const ios = isIOS();

  useEffect(() => {
    getSubscription().then(setSub).catch(() => undefined);
  }, []);

  const enable = async () => {
    setErr(null);
    try {
      setSub(await subscribe());
    } catch (e) {
      setErr((e as Error).message);
    }
  };

  const json = sub ? JSON.stringify(sub.toJSON()) : '';
  const copy = async () => {
    await navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div class="page">
      <PageHeader title="Powiadomienia" subtitle="Porcja wiedzy w losowych momentach dnia" backTo="/ja" />

      {ios && !standalone && (
        <div class="callout warn">
          <strong>Krok 0 na iPhonie:</strong> powiadomienia działają tylko z aplikacji dodanej do ekranu głównego. W Safari stuknij <em>Udostępnij</em> →{' '}
          <em>Do ekranu początkowego</em>, a potem otwórz LedgeKnow z ikony i wróć tutaj.
        </div>
      )}

      {!supported && !ios && <div class="callout warn">Ta przeglądarka nie obsługuje powiadomień push.</div>}

      <Section title="1. Włącz powiadomienia na tym telefonie">
        {!VAPID_PUBLIC_KEY && (
          <div class="callout">
            Aplikacja nie ma jeszcze klucza VAPID. Dodaj w repozytorium zmienną <code>VITE_VAPID_PUBLIC_KEY</code> (Settings → Secrets and variables → Actions →
            Variables) i przebuduj stronę. Instrukcja jest w README.
          </div>
        )}
        <div class="row gap wrap">
          {sub ? (
            <button class="btn btn-ghost" onClick={() => unsubscribe().then(() => setSub(null))}>
              Wyłącz
            </button>
          ) : (
            <button class="btn glow" onClick={enable} disabled={!supported || !VAPID_PUBLIC_KEY}>
              Włącz powiadomienia
            </button>
          )}
          <button class="btn btn-ghost" onClick={() => testLocalNotification().catch((e) => setErr((e as Error).message))} disabled={!supported}>
            Wyślij test
          </button>
        </div>
        {err && <p class="hint danger">{err}</p>}
      </Section>

      {sub && (
        <Section title="2. Przekaż subskrypcję do GitHuba">
          <p class="section-desc">
            LedgeKnow nie ma serwera – powiadomienia wysyła automat w GitHub Actions. Skopiuj poniższy tekst i wklej go jako sekret <code>PUSH_SUBSCRIPTION</code> w
            repozytorium (Settings → Secrets and variables → Actions → New repository secret). Robisz to tylko raz.
          </p>
          <textarea class="input code" readOnly rows={5} value={json} />
          <button class="btn wide" onClick={copy}>
            {copied ? 'Skopiowano ✔' : 'Kopiuj subskrypcję'}
          </button>
        </Section>
      )}

      <Section title="Jak to działa?">
        <p class="section-desc">
          Co ~2 godziny w ciągu dnia automat „rzuca kostką” i średnio ~3 razy dziennie wysyła ci powiadomienie z hakiem jednej z kart – w losowych momentach,
          tak jak lubisz czytać. Stuknięcie otwiera kartę.
        </p>
      </Section>
    </div>
  );
}
