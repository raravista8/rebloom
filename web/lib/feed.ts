// Feed + search clients (API_CONTRACT §3). One place that builds /api/feed and
// /api/search URLs — `metro` and `flower` are REPEATABLE params (one `metro=`/`flower=`
// per value; OR within a group, AND across groups). `total` (search) is read off the
// paginated response for «Показать N букетов».
import { api } from '@/lib/api';
import type { ListingCard, Paginated, SearchParams } from '@/lib/types';

/** GET /api/feed — base city browse (one section). */
export function feedUrl(
  cityId: string,
  section: 'fresh' | 'liked',
  opts?: { cursor?: string; limit?: number },
): string {
  const p = new URLSearchParams({ city_id: cityId, section });
  if (opts?.cursor) p.set('cursor', opts.cursor);
  p.set('limit', String(opts?.limit ?? 12));
  return `/feed?${p.toString()}`;
}

/** Build the /api/search query string with repeatable metro/flower params. */
export function searchQuery(params: SearchParams): string {
  const p = new URLSearchParams();
  p.set('city_id', params.city_id);
  if (params.q?.trim()) p.set('q', params.q.trim());
  if (params.size) p.set('size', params.size);
  if (params.freshness) p.set('freshness', params.freshness);
  if (params.price_min != null) p.set('price_min', String(params.price_min));
  if (params.price_max != null) p.set('price_max', String(params.price_max));
  for (const m of params.metro ?? []) p.append('metro', m);
  for (const f of params.flower ?? []) p.append('flower', f);
  if (params.cursor) p.set('cursor', params.cursor);
  p.set('limit', String(params.limit ?? 20));
  return `/search?${p.toString()}`;
}

export const fetchFeed = (cityId: string, section: 'fresh' | 'liked', opts?: { cursor?: string; limit?: number }) =>
  api.get<Paginated<ListingCard>>(feedUrl(cityId, section, opts));

export const fetchSearch = (params: SearchParams) => api.get<Paginated<ListingCard>>(searchQuery(params));
