'use client';
// Поиск + фильтры — GET /api/search (FR-016). Distinguishes idle (no query) /
// loading / results / no-results (query set, 0 items) / error / offline via the
// `applied` echo (INTERACTION_STATES §6/§7). Mirrors canon's search surface.
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PdEmpty, PdBtn, PdSkelCard, PdNotice } from '@/components/canon';
import { IconBack, IconSearch, IconX } from '@/components/icons';
import BouquetCard from '@/components/feed/BouquetCard';
import { api, ApiError } from '@/lib/api';
import { getCityClient } from '@/lib/city-client';
import { cityPrepositional } from '@/lib/cities';
import type { ListingCard, Paginated, Size } from '@/lib/types';

const SIZES: Size[] = ['S', 'M', 'L', 'XL'];
type Status = 'idle' | 'loading' | 'results' | 'no-results' | 'error' | 'offline';

export default function SearchScreen() {
  const router = useRouter();
  const [city, setCity] = useState('msk');
  const [q, setQ] = useState('');
  const [size, setSize] = useState<Size | undefined>();
  const [status, setStatus] = useState<Status>('idle');
  const [items, setItems] = useState<ListingCard[]>([]);

  useEffect(() => setCity(getCityClient()), []);

  const run = useCallback(
    async (query: string, sz: Size | undefined) => {
      if (!query.trim() && !sz) {
        setStatus('idle');
        setItems([]);
        return;
      }
      setStatus('loading');
      const params = new URLSearchParams({ city_id: city, limit: '20' });
      if (query.trim()) params.set('q', query.trim());
      if (sz) params.set('size', sz);
      try {
        const res = await api.get<Paginated<ListingCard>>(`/search?${params.toString()}`);
        setItems(res.items);
        setStatus(res.items.length === 0 ? 'no-results' : 'results');
      } catch (e) {
        setStatus(e instanceof ApiError && e.code === 'network' ? 'offline' : 'error');
      }
    },
    [city],
  );

  // debounce
  useEffect(() => {
    const t = setTimeout(() => void run(q, size), 350);
    return () => clearTimeout(t);
  }, [q, size, run]);

  const reset = () => {
    setQ('');
    setSize(undefined);
  };

  return (
    <div className="pd-root" data-pd-theme="a">
      <div className="pd-appbar" style={{ paddingTop: 'max(8px, env(safe-area-inset-top))' }}>
        <button className="pd-iconbtn" aria-label="Назад" onClick={() => router.back()}>
          <IconBack className="pd-i22" />
        </button>
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
      </div>

      <div className="pd-chiprow" style={{ padding: '12px 16px', borderBottom: '1px solid var(--pd-border)' }}>
        {SIZES.map((s) => (
          <button key={s} type="button" className={`pd-chip${size === s ? ' pd-chip--on' : ''}`} onClick={() => setSize(size === s ? undefined : s)}>
            Размер {s}
          </button>
        ))}
      </div>

      <main className="pd-scroll">
        {status === 'idle' && (
          <p style={{ textAlign: 'center', color: 'var(--pd-muted)', fontSize: 14, padding: '48px 24px' }}>
            Введите название букета или цветов — например «пионы» или «розы».
          </p>
        )}
        {status === 'loading' && (
          <div className="pd-grid">
            {Array.from({ length: 6 }, (_, i) => (
              <PdSkelCard key={i} />
            ))}
          </div>
        )}
        {status === 'results' && (
          <div className="pd-grid">
            {items.map((l) => (
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
              <button className="pd-link" onClick={() => void run(q, size)}>Повторить</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
