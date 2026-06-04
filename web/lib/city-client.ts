import { DEFAULT_CITY } from '@/lib/cities';

// Selected city persisted in a cookie so the feed (server) and search (client) agree.
export function getCityClient(): string {
  if (typeof document === 'undefined') return DEFAULT_CITY;
  const m = document.cookie.match(/(?:^|; )city=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : DEFAULT_CITY;
}

export function setCityClient(id: string): void {
  if (typeof document === 'undefined') return;
  document.cookie = `city=${encodeURIComponent(id)}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
}
