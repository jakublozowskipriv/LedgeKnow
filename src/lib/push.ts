/**
 * Powiadomienia push bez własnego serwera:
 * telefon tworzy „subskrypcję” → kopiujesz ją do sekretu GitHuba PUSH_SUBSCRIPTION →
 * workflow `notify.yml` kilka razy dziennie (losowo) wysyła powiadomienie z kartą.
 */
export const VAPID_PUBLIC_KEY = (import.meta.env.VITE_VAPID_PUBLIC_KEY as string | undefined) ?? '';

export const pushSupported = () => 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;

export const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;

export const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

function urlBase64ToUint8Array(base64: string): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const raw = atob((base64 + padding).replace(/-/g, '+').replace(/_/g, '/'));
  const out = new Uint8Array(new ArrayBuffer(raw.length));
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

export async function getSubscription(): Promise<PushSubscription | null> {
  if (!pushSupported()) return null;
  const reg = await navigator.serviceWorker.getRegistration();
  return (await reg?.pushManager.getSubscription()) ?? null;
}

export async function subscribe(): Promise<PushSubscription> {
  if (!VAPID_PUBLIC_KEY) throw new Error('Brak klucza VAPID – ustaw zmienną VITE_VAPID_PUBLIC_KEY (instrukcja w README).');
  const perm = await Notification.requestPermission();
  if (perm !== 'granted') throw new Error('Nie udzielono zgody na powiadomienia.');
  const reg = await navigator.serviceWorker.ready;
  const existing = await reg.pushManager.getSubscription();
  if (existing) return existing;
  return reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) });
}

export async function unsubscribe() {
  const sub = await getSubscription();
  await sub?.unsubscribe();
}

export async function testLocalNotification() {
  const perm = await Notification.requestPermission();
  if (perm !== 'granted') throw new Error('Nie udzielono zgody na powiadomienia.');
  const reg = await navigator.serviceWorker.ready;
  await reg.showNotification('LedgeKnow – test', {
    body: 'Tak będą wyglądać powiadomienia z nową porcją wiedzy 🌅',
    icon: 'icons/icon-192.png',
    data: { url: './' },
  });
}
