// UI formatting helpers. Money is kopecks (int) → ₽ (CLAUDE.md §4); RU locale.

/** 1234567 kopecks → "12 345 ₽" (thin-space grouping, no decimals for whole rubles). */
export function formatPriceKopecks(kopecks: number): string {
  const rub = Math.round(kopecks / 100);
  return rub.toLocaleString('ru-RU').replace(/,/g, ' ') + ' ₽';
}

/** Keep only digits; drop a leading 7/8 country prefix so we store the 10 national digits. */
export function phoneDigits(raw: string): string {
  let d = raw.replace(/\D/g, '');
  if (d.length > 10 && (d.startsWith('7') || d.startsWith('8'))) d = d.slice(1);
  return d.slice(0, 10);
}

/** 10 national digits → "999 124-58-03" (no +7 prefix; the field shows +7 separately). */
export function formatPhoneNational(digits: string): string {
  const d = phoneDigits(digits);
  const p = [d.slice(0, 3), d.slice(3, 6), d.slice(6, 8), d.slice(8, 10)].filter(Boolean);
  if (p.length <= 1) return p[0] ?? '';
  let out = p[0];
  if (p[1]) out += ' ' + p[1];
  if (p[2]) out += '-' + p[2];
  if (p[3]) out += '-' + p[3];
  return out;
}

/** 10 national digits → "+79991245803" for the API. */
export function phoneE164(digits: string): string {
  return '+7' + phoneDigits(digits);
}

/** ISO timestamp → "HH:MM" in MSK (UI is always MSK — CLAUDE.md §4). */
export function formatTime(iso: string): string {
  try {
    return new Intl.DateTimeFormat('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Moscow',
    }).format(new Date(iso));
  } catch {
    return '';
  }
}

/** ISO timestamp → "4 июня" (MSK). */
export function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', timeZone: 'Europe/Moscow' }).format(new Date(iso));
  } catch {
    return '';
  }
}

const MONTHS = ['месяц', 'месяца', 'месяцев'];
const YEARS = ['год', 'года', 'лет'];
function plur(n: number, forms: string[]): string {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return forms[0];
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return forms[1];
  return forms[2];
}

// «На площадке» tenure, relative to registration (canon desktop «10 месяцев на площадке»).
// Returns undefined for a missing/invalid/future date so callers can omit the row.
export function formatTenure(iso?: string): string | undefined {
  if (!iso) return undefined;
  const start = new Date(iso).getTime();
  if (Number.isNaN(start)) return undefined;
  const months = Math.floor((Date.now() - start) / (1000 * 60 * 60 * 24 * 30.44));
  if (months < 0) return undefined;
  if (months < 1) return 'меньше месяца на площадке';
  if (months < 12) return `${months} ${plur(months, MONTHS)} на площадке`;
  const years = Math.floor(months / 12);
  return `${years} ${plur(years, YEARS)} на площадке`;
}

export const POLICY_VERSION = '1.0';
