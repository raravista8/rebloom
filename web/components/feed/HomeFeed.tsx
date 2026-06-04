'use client';
// Главная / витрина — two city-scoped top sections («Самые свежие» rail + «Самые
// залайканные» grid) from /api/feed (FR-016). Mirrors canon's PdFeed layout with
// live data + the full collection lifecycle (INTERACTION_STATES §4): loading
// skeleton / loaded / empty / error / offline. (no-results belongs to search, not
// the home feed.)
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { PdSkelCard, PdEmpty, PdBtn } from '@/components/canon';
import TopBar from '@/components/shell/TopBar';
import BottomNav from '@/components/shell/BottomNav';
import BouquetCard from '@/components/feed/BouquetCard';
import { api, ApiError } from '@/lib/api';
import { cityPrepositional } from '@/lib/cities';
import type { ListingCard, Paginated } from '@/lib/types';

type Status = 'loading' | 'loaded' | 'empty' | 'error' | 'offline';

function feedUrl(cityId: string, section: 'fresh' | 'liked') {
  return `/feed?city_id=${encodeURIComponent(cityId)}&section=${section}&limit=12`;
}

// Local section header mirroring canon's .pd-sechead — canon's PdSectionHead forces
// `action` into a <button> with no handler, so we compose it to use a real Link.
function SectionHead({ title, sub, href }: { title: string; sub?: string; href?: string }) {
  return (
    <div className="pd-sechead">
      <div>
        <h2 className="pd-sectitle">{title}</h2>
        {sub && <p className="pd-secsub">{sub}</p>}
      </div>
      {href && (
        <Link href={href} className="pd-link">
          Все
        </Link>
      )}
    </div>
  );
}

function SkeletonRail({ variant }: { variant: 'rail' | 'grid' }) {
  const n = variant === 'rail' ? 4 : 6;
  return (
    <div className={variant === 'rail' ? 'pd-rail' : 'pd-grid'}>
      {Array.from({ length: n }, (_, i) => (
        <PdSkelCard key={i} />
      ))}
    </div>
  );
}

export default function HomeFeed({ cityId }: { cityId: string }) {
  const [status, setStatus] = useState<Status>('loading');
  const [fresh, setFresh] = useState<ListingCard[]>([]);
  const [liked, setLiked] = useState<ListingCard[]>([]);

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const [f, l] = await Promise.all([
        api.get<Paginated<ListingCard>>(feedUrl(cityId, 'fresh')),
        api.get<Paginated<ListingCard>>(feedUrl(cityId, 'liked')),
      ]);
      setFresh(f.items);
      setLiked(l.items);
      setStatus(f.items.length === 0 && l.items.length === 0 ? 'empty' : 'loaded');
    } catch (e) {
      setStatus(e instanceof ApiError && e.code === 'network' ? 'offline' : 'error');
    }
  }, [cityId]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="pd-root" data-pd-theme="a">
      <TopBar cityId={cityId} />
      <main className="pd-scroll">
        {status === 'loading' && (
          <>
            <section className="pd-section">
              <SectionHead title="Самые свежие" sub="Куплены сегодня, рядом с вами" />
              <SkeletonRail variant="rail" />
            </section>
            <section className="pd-section">
              <SectionHead title="Самые залайканные" sub={`Любимцы недели в ${cityPrepositional(cityId)}`} />
              <SkeletonRail variant="grid" />
            </section>
          </>
        )}

        {(status === 'error' || status === 'offline') && (
          <div className="pd-state" style={{ padding: '48px 20px' }}>
            <PdEmpty
              title={status === 'offline' ? 'Нет соединения' : 'Что-то пошло не так'}
              text={
                status === 'offline'
                  ? 'Проверьте интернет и попробуйте снова.'
                  : 'Не удалось загрузить ленту. Попробуйте ещё раз.'
              }
            >
              <PdBtn variant="primary" onClick={load}>
                Повторить
              </PdBtn>
            </PdEmpty>
          </div>
        )}

        {status === 'empty' && (
          <div className="pd-state" style={{ padding: '48px 20px' }}>
            <PdEmpty
              title="Здесь пока пусто"
              text={`В ${cityPrepositional(cityId)} ещё нет букетов. Будьте первым — опубликуйте свой.`}
            >
              <Link href="/sell">
                <PdBtn variant="primary">Опубликовать букет</PdBtn>
              </Link>
            </PdEmpty>
          </div>
        )}

        {status === 'loaded' && (
          <>
            {fresh.length > 0 && (
              <section className="pd-section">
                <SectionHead title="Самые свежие" sub="Куплены сегодня, рядом с вами" href="/search?section=fresh" />
                <div className="pd-rail">
                  {fresh.map((l) => (
                    <div className="pd-rise" key={l.id}>
                      <BouquetCard listing={l} variant="rail" />
                    </div>
                  ))}
                  <div className="pd-rail-end">
                    <span>
                      Листайте
                      <br />
                      дальше →
                    </span>
                  </div>
                </div>
              </section>
            )}

            {liked.length > 0 && (
              <section className="pd-section">
                <SectionHead title="Самые залайканные" sub={`Любимцы недели в ${cityPrepositional(cityId)}`} href="/search?section=liked" />
                <div className="pd-grid">
                  {liked.map((l) => (
                    <div className="pd-rise" key={l.id}>
                      <BouquetCard listing={l} variant="grid" />
                    </div>
                  ))}
                </div>
                <div className="pd-feed-end">Вы посмотрели свежие букеты</div>
              </section>
            )}
            <div style={{ height: 18 }} />
          </>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
