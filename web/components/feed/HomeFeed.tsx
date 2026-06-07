'use client';
// Главная / витрина — two city-scoped sections («Самые свежие» + «Самые залайканные»)
// from /api/feed (FR-016). RESPONSIVE: on ≥lg a real desktop layout (canon .pd-web —
// top nav + wide multi-column grid); on phones the mobile screen (.pd-root + bottom
// nav). One fetch feeds both; CSS (Tailwind lg:) toggles which is visible. Full
// collection lifecycle (INTERACTION_STATES §4).
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { PdSkelCard, PdEmpty, PdBtn } from '@/components/canon';
import TopBar from '@/components/shell/TopBar';
import BottomNav from '@/components/shell/BottomNav';
import WebChrome from '@/components/shell/WebChrome';
import BouquetCard from '@/components/feed/BouquetCard';
import useIsDesktop from '@/lib/useIsDesktop';
import { api, ApiError } from '@/lib/api';
import { cityPrepositional } from '@/lib/cities';
import type { ListingCard, Paginated } from '@/lib/types';

type Status = 'loading' | 'loaded' | 'empty' | 'error' | 'offline';

const feedUrl = (cityId: string, section: 'fresh' | 'liked') =>
  `/feed?city_id=${encodeURIComponent(cityId)}&section=${section}&limit=12`;

function SectionHead({ title, sub, href }: { title: string; sub?: string; href?: string }) {
  return (
    <div className="pd-sechead">
      <div>
        <h2 className="pd-sectitle">{title}</h2>
        {sub && <p className="pd-secsub">{sub}</p>}
      </div>
      {href && <Link href={href} className="pd-link">Все</Link>}
    </div>
  );
}

function Grid({ items, cls }: { items: ListingCard[]; cls: string }) {
  return (
    <div className={cls}>
      {items.map((l) => (
        <div className="pd-rise" key={l.id}>
          <BouquetCard listing={l} variant="grid" />
        </div>
      ))}
    </div>
  );
}

function Skeletons({ n, cls }: { n: number; cls: string }) {
  return (
    <div className={cls}>
      {Array.from({ length: n }, (_, i) => (
        <PdSkelCard key={i} />
      ))}
    </div>
  );
}

function EmptyState({ cityId }: { cityId: string }) {
  return (
    <PdEmpty title="Здесь пока пусто" text={`В ${cityPrepositional(cityId)} ещё нет букетов. Будьте первым — опубликуйте свой.`}>
      <Link href="/sell"><PdBtn variant="primary">Опубликовать букет</PdBtn></Link>
    </PdEmpty>
  );
}

function ErrorState({ status, reload }: { status: Status; reload: () => void }) {
  return (
    <PdEmpty
      title={status === 'offline' ? 'Нет соединения' : 'Что-то пошло не так'}
      text={status === 'offline' ? 'Проверьте интернет и попробуйте снова.' : 'Не удалось загрузить ленту.'}
    >
      <PdBtn variant="primary" onClick={reload}>Повторить</PdBtn>
    </PdEmpty>
  );
}

export default function HomeFeed({ cityId }: { cityId: string }) {
  const isDesktop = useIsDesktop();
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

  const prep = cityPrepositional(cityId);

  return (
    <>
      {/* ─────────── DESKTOP (≥1024px) ─────────── */}
      {isDesktop && (
      <div className="pd-root pd-web pdl" data-pd-theme="a">
        <WebChrome cityId={cityId} />

        <main className="pd-scroll pdw-scroll">
          <div className="pdw-wrap">
            {status === 'loading' && (
              <>
                <section className="pdw-section">
                  <SectionHead title="Самые свежие" sub={`Куплены сегодня, рядом с вами в ${prep}`} />
                  <Skeletons n={5} cls="pdw-grid" />
                </section>
                <section className="pdw-section">
                  <SectionHead title="Самые залайканные" sub="Любимцы недели" />
                  <Skeletons n={5} cls="pdw-grid" />
                </section>
              </>
            )}
            {status === 'empty' && <div style={{ padding: '40px 0' }}><EmptyState cityId={cityId} /></div>}
            {(status === 'error' || status === 'offline') && <div style={{ padding: '40px 0' }}><ErrorState status={status} reload={load} /></div>}
            {status === 'loaded' && (
              <>
                {fresh.length > 0 && (
                  <section className="pdw-section">
                    <SectionHead title="Самые свежие" sub={`Куплены сегодня, рядом с вами в ${prep}`} href="/search?section=fresh" />
                    <Grid items={fresh} cls="pdw-grid" />
                  </section>
                )}
                {liked.length > 0 && (
                  <section className="pdw-section">
                    <SectionHead title="Самые залайканные" sub="Любимцы недели, больше всего ♥ за 7 дней" href="/search?section=liked" />
                    <Grid items={liked} cls="pdw-grid" />
                    <div className="pd-feed-end">Вы посмотрели свежие букеты. Смените город, чтобы увидеть больше</div>
                  </section>
                )}
              </>
            )}
          </div>
        </main>
      </div>
      )}

      {/* ─────────── MOBILE (<1024px) ─────────── */}
      {!isDesktop && (
        <div className="pd-root" data-pd-theme="a">
          <TopBar cityId={cityId} />
          <main className="pd-scroll">
            {status === 'loading' && (
              <>
                <section className="pd-section">
                  <SectionHead title="Самые свежие" sub="Куплены сегодня, рядом с вами" />
                  <Skeletons n={4} cls="pd-rail" />
                </section>
                <section className="pd-section">
                  <SectionHead title="Самые залайканные" sub={`Любимцы недели в ${prep}`} />
                  <Skeletons n={6} cls="pd-grid" />
                </section>
              </>
            )}
            {status === 'empty' && <div className="pd-state" style={{ padding: '48px 20px' }}><EmptyState cityId={cityId} /></div>}
            {(status === 'error' || status === 'offline') && <div className="pd-state" style={{ padding: '48px 20px' }}><ErrorState status={status} reload={load} /></div>}
            {status === 'loaded' && (
              <>
                {fresh.length > 0 && (
                  <section className="pd-section">
                    <SectionHead title="Самые свежие" sub="Куплены сегодня, рядом с вами" href="/search?section=fresh" />
                    <div className="pd-rail">
                      {fresh.map((l) => (
                        <div className="pd-rise" key={l.id}><BouquetCard listing={l} variant="rail" /></div>
                      ))}
                      <div className="pd-rail-end"><span>Листайте<br />дальше →</span></div>
                    </div>
                  </section>
                )}
                {liked.length > 0 && (
                  <section className="pd-section">
                    <SectionHead title="Самые залайканные" sub={`Любимцы недели в ${prep}`} href="/search?section=liked" />
                    <Grid items={liked} cls="pd-grid" />
                    <div className="pd-feed-end">Вы посмотрели свежие букеты</div>
                  </section>
                )}
                <div style={{ height: 18 }} />
              </>
            )}
          </main>
          <BottomNav />
        </div>
      )}
    </>
  );
}
