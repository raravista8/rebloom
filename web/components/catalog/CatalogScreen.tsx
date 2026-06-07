'use client';
// Каталог букетов (/catalog) — PUBLIC, browse-first city catalog (≠ the search-first
// /search). canon 0.9.1 made PdCatalog presentational (data-driven), so this is now a
// THIN wrapper: it keeps the live-data logic (feed for the base browse, search when
// filtered, cursor load-more, derived collection state, real `total`) and renders the
// imported <PdCatalog/> — no more hand-rolled `.pdc-*` markup (CANON_PACKAGE_TZ §10 ✓).
//
// Card shape: PdCatalog renders canon's own PdCard from a `d` prop, so we adapt the
// live ListingCard[] → canon's `d` shape (see toCanonCard). Caveat: canon's PdCard
// builds the image as `img/{photo}.jpg` and uses its own (unwired) like button — the
// real photo URL and the wired LikeButton/like POST do NOT pass through (canon's card
// is not itself data-driven for the photo, and PdCatalog exposes no card render-prop).
// Tracked for a canon follow-up; the rest (grid, filters, all 8 states, navigation) is
// the imported component.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PdCatalog, type PdCatalogCard, type PdCatalogFilters, type PdCatalogState } from '@/components/canon';
import WebChrome from '@/components/shell/WebChrome';
import { activeCount, toSearchParams, type Filters } from '@/components/catalog/filters';
import useIsDesktop from '@/lib/useIsDesktop';
import { ApiError } from '@/lib/api';
import { fetchFeed, fetchSearch } from '@/lib/feed';
import { useCityStations } from '@/lib/metro';
import { FLOWERS } from '@/lib/flowers';
import { getCityClient } from '@/lib/city-client';
import { cityName, cityPrepositional, DEFAULT_CITY } from '@/lib/cities';
import type { ListingCard, Paginated } from '@/lib/types';

const LIMIT = 24;
type Status = 'loading' | 'loaded' | 'empty' | 'no-results' | 'error' | 'offline';

// canon PdCatalog filters: { metro[], flowers[], size, freshness, rating, priceMin, priceMax, sort }.
// `rating` has NO backend filter (API_CONTRACT has no seller-rating filter) — kept inert
// (never sent to /api/search). `priceMin/Max` are kopecks (canon shows ₽ buckets);
// `sort` is client-cosmetic here → it drives the feed section (fresh/liked).
const EMPTY_CANON: PdCatalogFilters = { metro: [], flowers: [], size: null, freshness: null, rating: null, priceMin: null, priceMax: null, sort: 'fresh' };

// Live ListingCard → canon's PdCard `d` shape (feed.jsx). price is RUBLES (pdMoney),
// metro is a station NAME string, seller.r must be a number (canon calls r.toFixed(1)).
function toCanonCard(l: ListingCard, city: string): PdCatalogCard {
  return {
    id: l.id,
    photo: l.photo_thumb_url, // canon renders img/{photo}.jpg — real URL does not pass through
    size: l.size,
    fresh: l.freshness,
    price: Math.round(l.price_kopecks / 100),
    metro: l.metro?.name,
    district: cityName(l.city_id || city),
    likes: l.like_count,
    liked: l.liked,
    seller: { n: l.seller.display_name || 'Продавец', r: l.seller.seller_rating ?? 0 },
  };
}

// canon `priceMin/priceMax` (kopecks) → the shared Filters price band, so we reuse the
// one /api/search param builder (price band → price_min/price_max in kopecks).
function priceBand(min: number | null, max: number | null): Filters['price'] {
  if (min == null && max != null) return 'lt1k';
  if (min != null && max != null) return '1k2k';
  if (min != null && max == null) return 'gt2k';
  return 'any';
}
function toFilters(cf: PdCatalogFilters): Filters {
  return {
    size: cf.size as Filters['size'],
    freshness: cf.freshness as Filters['freshness'],
    price: priceBand(cf.priceMin, cf.priceMax),
    metro: cf.metro,
    flowers: cf.flowers,
  };
}

export default function CatalogScreen() {
  const isDesktop = useIsDesktop();
  const [city, setCity] = useState(DEFAULT_CITY);
  const [cf, setCf] = useState<PdCatalogFilters>(EMPTY_CANON);
  const [status, setStatus] = useState<Status>('loading');
  const [items, setItems] = useState<ListingCard[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [paged, setPaged] = useState(false); // true once the user has loaded a 2nd+ page
  // guards a stale response from clobbering a newer query (filters change fast).
  const reqId = useRef(0);

  useEffect(() => setCity(getCityClient()), []);

  const stations = useCityStations(city);
  const f = useMemo(() => toFilters(cf), [cf]);
  const filtered = activeCount(f) > 0;
  const section: 'fresh' | 'liked' = cf.sort === 'rating' ? 'liked' : 'fresh';

  const fetchPage = useCallback(
    (cur?: string): Promise<Paginated<ListingCard>> =>
      filtered
        ? fetchSearch({ ...toSearchParams(city, '', f, LIMIT), ...(cur ? { cursor: cur } : {}) })
        : fetchFeed(city, section, { cursor: cur, limit: LIMIT }),
    [city, f, filtered, section],
  );

  const load = useCallback(async () => {
    const my = ++reqId.current;
    setStatus('loading');
    setItems([]);
    setCursor(null);
    setPaged(false);
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
      setPaged(true);
    } catch {
      // keep what we have; a failed load-more shouldn't blank the grid.
    } finally {
      if (my === reqId.current) setLoadingMore(false);
    }
  }, [cursor, loadingMore, fetchPage]);

  // ── map the web lifecycle → PdCatalog's `state` enum + `total` (drives the load-more
  // button via canon's `items.length < total`). For browse there's no real total, so we
  // synthesize total = items + 1 while a cursor exists (button shows) and collapse to
  // `end` once paged to the last page. For search, `total` is the real backend count.
  const cards = useMemo(() => items.map((l) => toCanonCard(l, city)), [items, city]);
  let state: PdCatalogState;
  let canonTotal = total;
  if (status === 'loading') {
    state = 'loading';
  } else if (status === 'empty') {
    state = 'empty';
  } else if (status === 'no-results') {
    state = 'no-results';
  } else if (status === 'error' || status === 'offline') {
    state = status;
  } else if (loadingMore) {
    state = 'loading-more';
  } else if (cursor) {
    state = 'loaded';
    // ensure the «Показать ещё» button shows (canon needs items.length < total).
    canonTotal = filtered ? Math.max(total, items.length + 1) : items.length + 1;
  } else {
    // last page loaded: stop-marker once the user has paged, plain «loaded» otherwise.
    state = paged ? 'end' : 'loaded';
    canonTotal = filtered ? total : items.length;
  }

  const onFiltersChange = useCallback((next: PdCatalogFilters) => setCf(next), []);

  // The city control lives in the auth-aware header (WebChrome → /city); PdCatalog's own
  // city button is unused because we pass a custom `header` slot.
  return (
    <PdCatalog
      platform={isDesktop ? 'desktop' : 'web'}
      items={cards}
      state={state}
      total={canonTotal}
      filters={cf}
      onFiltersChange={onFiltersChange}
      stations={stations}
      flowers={[...FLOWERS]}
      city={cityName(city)}
      cityLoc={cityPrepositional(city)}
      onLoadMore={loadMore}
      cardHref={(d) => `/l/${d.id}`}
      onRetry={load}
      header={<WebChrome cityId={city} />}
    />
  );
}
