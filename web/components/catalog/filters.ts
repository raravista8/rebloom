// Shared filter state + helpers for the catalog (/catalog) and in-app search (/search).
// Maps to /api/search params (API_CONTRACT §3): size · freshness · price band · metro[] ·
// flower[]. Sort is client-side (the API has no sort param). One source of truth so the
// two screens never drift on filter semantics/labels.
import type { Freshness, ListingCard, SearchParams, Size } from '@/lib/types';

export type PriceBand = 'any' | 'lt1k' | '1k2k' | 'gt2k';
export type SortKey = 'fresh' | 'cheap' | 'exp' | 'rating';

export interface Filters {
  size: Size | null;
  freshness: Freshness | null;
  price: PriceBand;
  metro: string[];
  flowers: string[];
}

export const EMPTY_FILTERS: Filters = { size: null, freshness: null, price: 'any', metro: [], flowers: [] };

// Labeled sizes (export-next §2/§9): S · до 7 / M · 7–15 / L · 15–25 / XL · 25+.
export const SIZE_OPTS: [Size, string][] = [
  ['S', 'S · до 7'],
  ['M', 'M · 7–15'],
  ['L', 'L · 15–25'],
  ['XL', 'XL · 25+'],
];
// Freshness labels (PD_FRESH_META): Свежий / 1–2 дня / 3+ дня (enum unchanged).
export const FRESH_OPTS: [Freshness, string][] = [
  ['today', 'Свежий'],
  ['d1_2', '1–2 дня'],
  ['d3_plus', '3+ дня'],
];
export const PRICE_OPTS: [PriceBand, string][] = [
  ['lt1k', 'до 1 000 ₽'],
  ['1k2k', '1 000–2 000 ₽'],
  ['gt2k', '2 000 ₽+'],
];
export const SORT_OPTS: [SortKey, string][] = [
  ['fresh', 'Сначала свежие'],
  ['cheap', 'Сначала дешевле'],
  ['exp', 'Сначала дороже'],
  ['rating', 'По рейтингу'],
];

export function priceBandToRange(p: PriceBand): { price_min?: number; price_max?: number } {
  // kopecks (API_CONTRACT money in kopecks).
  if (p === 'lt1k') return { price_max: 1000_00 - 1 };
  if (p === '1k2k') return { price_min: 1000_00, price_max: 2000_00 };
  if (p === 'gt2k') return { price_min: 2000_00 + 1 };
  return {};
}

export function activeCount(f: Filters): number {
  return (
    (f.size ? 1 : 0) + (f.freshness ? 1 : 0) + (f.price !== 'any' ? 1 : 0) + f.metro.length + f.flowers.length
  );
}

/** Build /api/search params from filters + a city + optional query. */
export function toSearchParams(cityId: string, q: string, f: Filters, limit = 20): SearchParams {
  return {
    city_id: cityId,
    ...(q.trim() ? { q: q.trim() } : {}),
    ...(f.size ? { size: f.size } : {}),
    ...(f.freshness ? { freshness: f.freshness } : {}),
    ...priceBandToRange(f.price),
    ...(f.metro.length ? { metro: f.metro } : {}),
    ...(f.flowers.length ? { flower: f.flowers } : {}),
    limit,
  };
}

const FRESH_RANK: Record<Freshness, number> = { today: 0, d1_2: 1, d3_plus: 2 };

/** Client-side sort of a fetched page (the API has no sort param). */
export function sortCards(items: ListingCard[], sort: SortKey): ListingCard[] {
  const r = items.slice();
  r.sort((a, b) => {
    if (sort === 'cheap') return a.price_kopecks - b.price_kopecks;
    if (sort === 'exp') return b.price_kopecks - a.price_kopecks;
    if (sort === 'rating') return (b.seller.seller_rating ?? 0) - (a.seller.seller_rating ?? 0);
    return (FRESH_RANK[a.freshness] - FRESH_RANK[b.freshness]) || b.like_count - a.like_count;
  });
  return r;
}
