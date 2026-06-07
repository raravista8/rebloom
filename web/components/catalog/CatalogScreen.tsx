'use client';
// Каталог букетов (/catalog) — PUBLIC, browse-first city catalog (≠ the search-first
// /search). canon 0.9.2 made PdCatalog fully consumable (data-driven + `renderCard`
// slot), so this is now the IMPORTED PdCatalog — no more hand-transcribed `.pdc-*`
// markup. Web keeps its own card via `renderCard` → <BouquetCard/> (real
// `photo_thumb_url` + the wired LikeButton → POST /like, guest→/login, metro label),
// identical to the home feed; canon's default PdCard/`onLike` are unused.
//
// Live data: grid from /api/feed (browse-first); switches to /api/search when a real
// (backend-filterable) filter is set. Cursor load-more + ALL collection states
// (INTERACTION_STATES §4): loading / loaded / empty / no-results / loading-more / end /
// error / offline. «Показать N» uses the live search `total`.
//
// Filter state is held in PdCatalog's own shape (it owns the filter UI now) and mapped
// to /api/search here. `rating` has no backend filter (kept inert — never sent, never
// switches to search); `cheap`/`exp`/`rating` are PdCatalog client-side sorts.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PdCatalog, type PdCatalogFilters, type PdCatalogState } from '@/components/canon';
import BouquetCard from '@/components/feed/BouquetCard';
import WebChrome from '@/components/shell/WebChrome';
import useIsDesktop from '@/lib/useIsDesktop';
import { ApiError } from '@/lib/api';
import { fetchFeed, fetchSearch } from '@/lib/feed';
import { useCityStations } from '@/lib/metro';
import { FLOWERS } from '@/lib/flowers';
import { getCityClient } from '@/lib/city-client';
import { cityName, cityPrepositional, DEFAULT_CITY } from '@/lib/cities';
import type { ListingCard, Paginated, SearchParams, Freshness, Size } from '@/lib/types';

const LIMIT = 24;

const EMPTY_FILTERS: PdCatalogFilters = {
  metro: [],
  flowers: [],
  size: null,
  freshness: null,
  rating: null,
  priceMin: null,
  priceMax: null,
  sort: 'fresh',
};

// canon price buckets are in RUBLES (priceMin/priceMax) → kopecks for /api/search.
function priceRangeKopecks(min: number | null, max: number | null): { price_min?: number; price_max?: number } {
  return {
    ...(min != null ? { price_min: min * 100 } : {}),
    ...(max != null ? { price_max: max * 100 - 1 } : {}),
  };
}

// Backend-filterable subset of the canon filters (excludes the inert `rating` + the
// client-side `sort`) → does any of these require switching from /api/feed to /api/search?
function isBackendFiltered(f: PdCatalogFilters): boolean {
  return (
    f.metro.length > 0 ||
    f.flowers.length > 0 ||
    f.size != null ||
    f.freshness != null ||
    f.priceMin != null ||
    f.priceMax != null
  );
}

function toSearchParams(cityId: string, f: PdCatalogFilters, cursor?: string): SearchParams {
  return {
    city_id: cityId,
    ...(f.size ? { size: f.size as Size } : {}),
    ...(f.freshness ? { freshness: f.freshness as Freshness } : {}),
    ...priceRangeKopecks(f.priceMin, f.priceMax),
    ...(f.metro.length ? { metro: f.metro } : {}),
    ...(f.flowers.length ? { flower: f.flowers } : {}),
    ...(cursor ? { cursor } : {}),
    limit: LIMIT,
  };
}

// The item PdCatalog renders: the full ListingCard (BouquetCard consumes it directly via
// `renderCard`) PLUS `price` (rubles) + `seller.r` so PdCatalog's client-side cheap/exp/
// rating sort orders correctly.
type CatalogItem = ListingCard & { price: number; seller: ListingCard['seller'] & { r: number | null } };

function toCatalogItem(l: ListingCard): CatalogItem {
  return { ...l, price: l.price_kopecks / 100, seller: { ...l.seller, r: l.seller.seller_rating } };
}

export default function CatalogScreen() {
  const isDesktop = useIsDesktop();
  const [city, setCity] = useState(DEFAULT_CITY);
  const [f, setF] = useState<PdCatalogFilters>(EMPTY_FILTERS);
  const [status, setStatus] = useState<Exclude<PdCatalogState, 'loading-more' | 'end'>>('loading');
  const [items, setItems] = useState<ListingCard[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  // guards a stale response from clobbering a newer query (filters change fast).
  const reqId = useRef(0);

  useEffect(() => setCity(getCityClient()), []);

  const stations = useCityStations(city);
  const filtered = isBackendFiltered(f);

  const fetchPage = useCallback(
    (cur?: string): Promise<Paginated<ListingCard>> =>
      filtered
        ? fetchSearch(toSearchParams(city, f, cur))
        : fetchFeed(city, 'fresh', { cursor: cur, limit: LIMIT }),
    [city, f, filtered],
  );

  const load = useCallback(async () => {
    const my = ++reqId.current;
    setStatus('loading');
    setItems([]);
    setCursor(null);
    try {
      const res = await fetchPage();
      if (my !== reqId.current) return; // superseded
      setItems(res.items);
      setCursor(res.next_cursor);
      setTotal(res.total ?? res.items.length);
      setStatus(res.items.length === 0 ? (filtered ? 'no-results' : 'empty') : 'loaded');
    } catch (e) {
      if (my !== reqId.current) return;
      setStatus(e instanceof ApiError && e.code === 'network' ? 'offline' : 'error');
    }
  }, [fetchPage, filtered]);

  useEffect(() => {
    void load();
  }, [load]);

  const loadMore = useCallback(async () => {
    if (!cursor || loadingMore) return;
    const my = reqId.current;
    setLoadingMore(true);
    try {
      const res = await fetchPage(cursor);
      if (my !== reqId.current) return;
      setItems((prev) => [...prev, ...res.items]);
      setCursor(res.next_cursor);
    } catch {
      // keep what we have; a failed load-more shouldn't blank the grid.
    } finally {
      if (my === reqId.current) setLoadingMore(false);
    }
  }, [cursor, loadingMore, fetchPage]);

  const onFiltersChange = useCallback((next: PdCatalogFilters) => setF(next), []);

  // canon-state derivation: load-more spinner / end-of-list overlay the base status.
  const state: PdCatalogState = loadingMore
    ? 'loading-more'
    : status === 'loaded' && !cursor && items.length > 0
      ? 'end'
      : status;

  const catalogItems = useMemo(() => items.map(toCatalogItem), [items]);
  // PdCatalog gates «Показать ещё» on `items.length < total`, not on a cursor. The browse
  // feed has no whole-city total → ensure total > items.length while a cursor remains so
  // load-more stays visible; the search `total` is the real count but a remaining cursor
  // still implies more (guard against an equal/stale total).
  const total_ = Math.max(filtered ? total : items.length, items.length + (cursor ? 1 : 0));

  return (
    <PdCatalog<CatalogItem>
      platform={isDesktop ? 'desktop' : 'web'}
      items={catalogItems}
      state={state}
      total={total_}
      filters={f}
      onFiltersChange={onFiltersChange}
      stations={stations}
      flowers={FLOWERS}
      city={cityName(city)}
      cityLoc={cityPrepositional(city)}
      onLoadMore={loadMore}
      onRetry={load}
      renderCard={(d) => <BouquetCard listing={d} variant="grid" />}
      header={<WebChrome cityId={city} />}
    />
  );
}
