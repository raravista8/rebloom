'use client';
// Поиск + фильтры — GET /api/search (FR-016). Distinguishes idle (no query, no filter) /
// loading / results / no-results / error / offline via the `applied` echo
// (INTERACTION_STATES §6/§7). canon 0.9.0: metro multiselect + flower-type filters; mobile
// «Фильтры» chip → inline «Все фильтры» panel with «Показать N» (live `total`); sort is a
// «Сортировка ▾» dropdown on mobile (segmented on desktop); sizes labelled S·до 7 / …
// RESPONSIVE: mobile keeps the search app-bar; desktop renders the shared header (WebChrome)
// + sidebar filters + wide grid.
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PdEmpty, PdBtn, PdSkelCard, PdNotice } from '@/components/canon';
import { IconBack, IconSearch, IconX } from '@/components/icons';
import BouquetCard from '@/components/feed/BouquetCard';
import WebChrome from '@/components/shell/WebChrome';
import { FiltersBarMobile, FiltersSidebar, SortControl } from '@/components/catalog/CatalogFilters';
import { EMPTY_FILTERS, activeCount, sortCards, toSearchParams, type Filters, type SortKey } from '@/components/catalog/filters';
import useIsDesktop from '@/lib/useIsDesktop';
import { ApiError } from '@/lib/api';
import { fetchSearch } from '@/lib/feed';
import { getCityClient } from '@/lib/city-client';
import { cityPrepositional } from '@/lib/cities';
import type { ListingCard } from '@/lib/types';

type Status = 'idle' | 'loading' | 'results' | 'no-results' | 'error' | 'offline';

export default function SearchScreen() {
  const router = useRouter();
  const isDesktop = useIsDesktop();
  const [city, setCity] = useState('msk');
  const [q, setQ] = useState('');
  const [f, setF] = useState<Filters>(EMPTY_FILTERS);
  const [sort, setSort] = useState<SortKey>('fresh');
  const [status, setStatus] = useState<Status>('idle');
  const [items, setItems] = useState<ListingCard[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => setCity(getCityClient()), []);

  const set = useCallback(<K extends keyof Filters>(k: K, v: Filters[K]) => setF((s) => ({ ...s, [k]: v })), []);
  const toggleMetro = useCallback(
    (id: string | null) => setF((s) => ({ ...s, metro: id === null ? [] : s.metro.includes(id) ? s.metro.filter((x) => x !== id) : [...s.metro, id] })),
    [],
  );
  const toggleFlower = useCallback(
    (id: string) => setF((s) => ({ ...s, flowers: s.flowers.includes(id) ? s.flowers.filter((x) => x !== id) : [...s.flowers, id] })),
    [],
  );
  const reset = useCallback(() => {
    setQ('');
    setF(EMPTY_FILTERS);
  }, []);

  const run = useCallback(
    async (query: string, filters: Filters) => {
      if (!query.trim() && activeCount(filters) === 0) {
        setStatus('idle');
        setItems([]);
        setTotal(0);
        return;
      }
      setStatus('loading');
      try {
        const res = await fetchSearch(toSearchParams(city, query, filters));
        setItems(res.items);
        setTotal(res.total ?? res.items.length);
        setStatus(res.items.length === 0 ? 'no-results' : 'results');
      } catch (e) {
        setStatus(e instanceof ApiError && e.code === 'network' ? 'offline' : 'error');
      }
    },
    [city],
  );

  // debounce
  useEffect(() => {
    const t = setTimeout(() => void run(q, f), 350);
    return () => clearTimeout(t);
  }, [q, f, run]);

  const sorted = useMemo(() => sortCards(items, sort), [items, sort]);

  const searchField = (
    <div className="pd-search" style={{ flex: 1 }}>
      <IconSearch className="pd-i18" />
      <input
        autoFocus
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={`Поиск букетов в ${cityPrepositional(city)}`}
        aria-label="Поиск"
        style={{ flex: 1, border: 0, background: 'transparent', outline: 'none', fontSize: 14, color: 'var(--pd-text)' }}
      />
      {q && (
        <button aria-label="Очистить" onClick={() => setQ('')} style={{ all: 'unset', cursor: 'pointer', color: 'var(--pd-muted)' }}>
          <IconX className="pd-i18" />
        </button>
      )}
    </div>
  );

  const grid = (gridCls: string) => (
    <>
      {status === 'idle' && (
        <p style={{ textAlign: 'center', color: 'var(--pd-muted)', fontSize: 14, padding: '48px 24px' }}>
          Введите название букета или цветов — например «пионы» или «розы», либо задайте фильтры.
        </p>
      )}
      {status === 'loading' && (
        <div className={gridCls}>
          {Array.from({ length: 6 }, (_, i) => (
            <PdSkelCard key={i} />
          ))}
        </div>
      )}
      {status === 'results' && (
        <div className={gridCls}>
          {sorted.map((l) => (
            <div className="pd-rise" key={l.id}>
              <BouquetCard listing={l} variant="grid" />
            </div>
          ))}
        </div>
      )}
      {status === 'no-results' && (
        <PdEmpty
          glyph={IconSearch}
          title="Ничего не нашлось"
          text={`По запросу${q.trim() ? ` «${q.trim()}»` : ''} в ${cityPrepositional(city)} с этими фильтрами пока нет букетов.`}
        >
          <PdBtn variant="primary" block onClick={reset}>Сбросить фильтры</PdBtn>
        </PdEmpty>
      )}
      {(status === 'error' || status === 'offline') && (
        <div style={{ padding: '40px 20px', textAlign: 'center' }}>
          <PdNotice kind="danger">{status === 'offline' ? 'Нет соединения. Проверьте интернет.' : 'Не удалось выполнить поиск.'}</PdNotice>
          <div style={{ marginTop: 14 }}>
            <button className="pd-link" onClick={() => void run(q, f)}>Повторить</button>
          </div>
        </div>
      )}
    </>
  );

  if (isDesktop) {
    // outer .pdl → PdWebNav (container query + drawer); inner .pdc → catalog body's
    // `@container pdc (min-width:900px)` reveal of the sidebar + segmented sort.
    return (
      <div className="pd-root pd-web pdl" data-pd-theme="a">
        <WebChrome cityId={city} />
        <main className="pd-scroll pdw-scroll">
          <div className="pdc pdc--desk">
            <div className="pdc-head">
              <h1 className="pdc-title">Поиск букетов</h1>
            </div>
            <div style={{ display: 'flex', gap: 10, maxWidth: 1280, margin: '0 auto 16px', padding: '0 32px' }}>{searchField}</div>
            <div className="pdc-body">
              <FiltersSidebar cityId={city} f={f} set={set} toggleMetro={toggleMetro} toggleFlower={toggleFlower} reset={reset} />
              <div className="pdc-main">
                <div className="pdc-toolbar">
                  <span className="pdc-count" style={{ fontSize: 13 }}>{status === 'results' ? `${total} букетов` : ''}</span>
                  <SortControl sort={sort} setSort={setSort} />
                </div>
                {grid('pdc-grid')}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="pd-root pdc" data-pd-theme="a">
      <div className="pd-appbar" style={{ paddingTop: 'max(8px, env(safe-area-inset-top))' }}>
        <button className="pd-iconbtn" aria-label="Назад" onClick={() => router.back()}>
          <IconBack className="pd-i22" />
        </button>
        {searchField}
      </div>

      <FiltersBarMobile cityId={city} f={f} set={set} toggleMetro={toggleMetro} toggleFlower={toggleFlower} reset={reset} total={total} />

      <div className="pdc-toolbar">
        <span className="pdc-count" style={{ fontSize: 13 }}>{status === 'results' ? `${total} букетов` : ''}</span>
        <SortControl sort={sort} setSort={setSort} />
      </div>

      <main className="pd-scroll">{grid('pd-grid')}</main>
    </div>
  );
}
