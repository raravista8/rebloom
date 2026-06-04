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

export const POLICY_VERSION = '1.0';
