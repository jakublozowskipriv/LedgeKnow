const pad = (n: number) => String(n).padStart(2, '0');

export function dateKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function todayKey(): string {
  return dateKey(new Date());
}

export function monthDay(d = new Date()): string {
  return `${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Numer tygodnia ISO – do rotacji „tematu tygodnia”. */
export function isoWeek(d = new Date()): number {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  return Math.ceil(((t.getTime() - yearStart.getTime()) / 86400000 + 1) / 7) + t.getUTCFullYear() * 53;
}

/** Ile dni z rzędu (kończąc dziś albo wczoraj) użytkownik coś przeczytał. */
export function streak(days: string[]): number {
  const set = new Set(days);
  const d = new Date();
  if (!set.has(dateKey(d))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (set.has(dateKey(d))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

export function daysSince(iso: string): number {
  const [y, m, dd] = iso.split('-').map(Number);
  const then = new Date(y, m - 1, dd).getTime();
  return Math.floor((Date.now() - then) / 86400000);
}

const MONTHS = ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'];
const WEEKDAYS = ['niedziela', 'poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota'];

export function prettyToday(d = new Date()): string {
  return `${WEEKDAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export function prettyMonthDay(md: string): string {
  const [m, d] = md.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]}`;
}

export function greeting(d = new Date()): string {
  const h = d.getHours();
  if (h < 5) return 'Nocna sesja?';
  if (h < 11) return 'Dzień dobry';
  if (h < 18) return 'Cześć';
  if (h < 22) return 'Dobry wieczór';
  return 'Późno, ale ciekawie';
}
