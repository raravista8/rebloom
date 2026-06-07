'use client';
// Каталог букетов (/catalog) — PUBLIC, browse-first city catalog (≠ the search-first
// /search). Grid shown immediately from /api/feed; switches to /api/search when any
// filter is set (metro/flower/size/freshness/price). Cursor load-more + ALL collection
// states (INTERACTION_STATES §4): loading-skeleton / loaded / empty / no-results /
// loading-more / end-of-list / error / offline. «Показать N» uses the live search `total`.
//
// Note: canon's PdCatalog is a self-contained DEMO (its own data, no item/handler props),
// so it can't render live data — we re-compose its `.pdc-*` markup (header, sidebar,
// chip-bar + panel, sort, grid, load-more) with the live feed/search clients, the same
// compose-over-canon-CSS pattern the rest of web/ uses (CANON_PACKAGE_TZ §10).
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { PdSkelCard, PdBtn } from '@/components/canon';
import BouquetCard from '@/components/feed/BouquetCard';
import WebChrome from '@/components/shell/WebChrome';
import { FiltersBarMobile, FiltersSidebar, SortControl } from '@/components/catalog/CatalogFilters';
import { EMPTY_FILTERS, activeCount, sortCards, toSearchParams, type Filters, type SortKey } from '@/components/catalog/filters';
import useIsDesktop from '@/lib/useIsDesktop';
import { ApiError } from '@/lib/api';
import { fetchFeed, fetchSearch } from '@/lib/feed';
import { getCityClient } from '@/lib/city-client';
import { cityName, cityPrepositional, DEFAULT_CITY } from '@/lib/cities';
import type { ListingCard, Paginated } from '@/lib/types';

const LIMIT = 24;
type Status = 'loading' | 'loaded' | 'empty' | 'no-results' | 'error' | 'offline';

export default function CatalogScreen() {
  const isDesktop = useIsDesktop();
  const [city, setCity] = useState(DEFAULT_CITY);
  const [f, setF] = useState<Filters>(EMPTY_FILTERS);
  const [sort, setSort] = useState<SortKey>('fresh');
  const [status, setStatus] = useState<Status>('loading');
  const [items, setItems] = useState<ListingCard[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  // guards a stale response from clobbering a newer query (filters change fast).
  const reqId = useRef(0);

  useEffect(() => setCity(getCityClient()), []);

  const filtered = activeCount(f) > 0;

  const fetchPage = useCallback(
    (cur?: string): Promise<Paginated<ListingCard>> =>
      filtered
        ? fetchSearch({ ...toSearchParams(city, '', f, LIMIT), ...(cur ? { cursor: cur } : {}) })
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

  // filter mutators
  const set = useCallback(<K extends keyof Filters>(k: K, v: Filters[K]) => setF((s) => ({ ...s, [k]: v })), []);
  const toggleMetro = useCallback(
    (id: string | null) => setF((s) => ({ ...s, metro: id === null ? [] : s.metro.includes(id) ? s.metro.filter((x) => x !== id) : [...s.metro, id] })),
    [],
  );
  const toggleFlower = useCallback(
    (id: string) => setF((s) => ({ ...s, flowers: s.flowers.includes(id) ? s.flowers.filter((x) => x !== id) : [...s.flowers, id] })),
    [],
  );
  const reset = useCallback(() => setF(EMPTY_FILTERS), []);

  const sorted = useMemo(() => sortCards(items, sort), [items, sort]);
  const countLabel = filtered ? `${total} букетов` : `${items.length}${cursor ? '+' : ''} букетов`;

  const skeletons = (cls: string) => (
    <div className={cls}>
      {Array.from({ length: isDesktop ? 8 : 6 }, (_, i) => (
        <PdSkelCard key={i} />
      ))}
    </div>
  );

  const empty = (
    <div className="pdc-empty">
      <b>{filtered ? 'Ничего не нашлось' : 'Здесь пока пусто'}</b>
      {filtered
        ? 'Попробуйте смягчить фильтры — например расширить цену или свежесть.'
        : `В ${cityPrepositional(city)} ещё нет букетов. Будьте первым — опубликуйте свой.`}
      <div style={{ marginTop: 14 }}>
        {filtered ? (
          <PdBtn variant="secondary" onClick={reset}>Сбросить фильтры</PdBtn>
        ) : (
          <Link href="/sell"><PdBtn variant="primary">Опубликовать букет</PdBtn></Link>
        )}
      </div>
    </div>
  );

  const errorState = (
    <div className="pdc-empty">
      <b>{status === 'offline' ? 'Нет соединения' : 'Что-то пошло не так'}</b>
      {status === 'offline' ? 'Проверьте интернет и попробуйте снова.' : 'Не удалось загрузить каталог.'}
      <div style={{ marginTop: 14 }}>
        <PdBtn variant="primary" onClick={load}>Повторить</PdBtn>
      </div>
    </div>
  );

  const gridBody = (gridCls: string) => (
    <>
      {status === 'loading' && skeletons(gridCls)}
      {(status === 'empty' || status === 'no-results') && empty}
      {(status === 'error' || status === 'offline') && errorState}
      {status === 'loaded' && (
        <>
          <div className={gridCls}>
            {sorted.map((l) => (
              <div className="pd-rise" key={l.id}>
                <BouquetCard listing={l} variant="grid" />
              </div>
            ))}
          </div>
          {cursor ? (
            <div className="pdc-loadmore">
              <button onClick={loadMore} disabled={loadingMore}>
                {loadingMore ? 'Загружаем…' : 'Показать ещё'}
              </button>
            </div>
          ) : (
            <div className="pd-feed-end">Вы посмотрели все свежие букеты {cityName(city) === 'Москва' ? 'Москвы' : `в ${cityPrepositional(city)}`}</div>
          )}
        </>
      )}
    </>
  );

  const toolbar = (
    <div className="pdc-toolbar">
      <span className="pdc-count" style={{ fontSize: 13 }}>
        <span className="d" />
        {status === 'loaded' || status === 'no-results' ? countLabel : ''}
      </span>
      <SortControl sort={sort} setSort={setSort} />
    </div>
  );

  // ─────────── DESKTOP (≥1024px) — .pdl (PdWebNav) wrapping a .pdc body ───────────
  if (isDesktop) {
    return (
      <div className="pd-root pd-web pdl" data-pd-theme="a">
        <WebChrome cityId={city} />
        <main className="pd-scroll pdw-scroll">
          <div className="pdc pdc--desk">
            <div className="pdc-head">
              <p className="pdc-crumbs">
                <Link href="/">Главная</Link> · Каталог · {cityName(city)}
              </p>
              <div className="pdc-titlerow">
                <h1 className="pdc-title">Свежие букеты в {cityPrepositional(city)}</h1>
              </div>
            </div>
            <div className="pdc-body">
              <FiltersSidebar cityId={city} f={f} set={set} toggleMetro={toggleMetro} toggleFlower={toggleFlower} reset={reset} />
              <div className="pdc-main">
                {toolbar}
                {gridBody('pdc-grid')}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ─────────── MOBILE (<1024px) — .pdc container (chip bar + panel + dropdown) ───────────
  return (
    <div className="pd-root pdc" data-pd-theme="a">
      <div className="pdc-head">
        <div className="pdc-titlerow">
          <h1 className="pdc-title">Свежие букеты в {cityPrepositional(city)}</h1>
        </div>
      </div>
      <div className="pdc-main" style={{ padding: '0 16px 32px' }}>
        <FiltersBarMobile cityId={city} f={f} set={set} toggleMetro={toggleMetro} toggleFlower={toggleFlower} reset={reset} total={total} />
        {toolbar}
        {gridBody('pdc-grid')}
      </div>
    </div>
  );
}
