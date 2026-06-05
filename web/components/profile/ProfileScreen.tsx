'use client';
// Профиль продавца — GET /api/users/{id} (FR-041). Header + rating + reviews +
// active listings. Mirrors canon's Profile. (Backend currently returns
// active_listings: [] and reviews carry author_id only — no reviewer name yet.)
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { PdStars, PdNotice, PdAvatar } from '@/components/canon';
import { IconShield, IconFlag, IconInfo } from '@/components/icons';
import ScreenChrome from '@/components/shell/ScreenChrome';
import BouquetCard from '@/components/feed/BouquetCard';
import { api, ApiError } from '@/lib/api';
import { formatDate } from '@/lib/format';
import type { ProfileResponse } from '@/lib/types';

function plural(n: number, one: string, few: string, many: string) {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return few;
  return many;
}

export default function ProfileScreen({ id }: { id: string }) {
  const [data, setData] = useState<ProfileResponse | null>(null);
  const [phase, setPhase] = useState<'loading' | 'loaded' | 'not_found' | 'error'>('loading');

  const load = useCallback(async () => {
    setPhase('loading');
    try {
      setData(await api.get<ProfileResponse>(`/users/${id}`));
      setPhase('loaded');
    } catch (e) {
      setPhase(e instanceof ApiError && e.code === 'not_found' ? 'not_found' : 'error');
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  const action = (
    <Link href={`/u/${id}/report`} className="pd-iconbtn" aria-label="Пожаловаться">
      <IconFlag className="pd-i20" />
    </Link>
  );

  if (phase === 'loading') {
    return (
      <ScreenChrome title="Профиль" action={action}>
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="pd-sk" style={{ height: 80 }} />
          <div className="pd-sk" style={{ height: 56 }} />
          <div className="pd-sk" style={{ height: 80 }} />
        </div>
      </ScreenChrome>
    );
  }
  if (phase === 'not_found' || !data) {
    return (
      <ScreenChrome title="Профиль" action={action}>
        <div style={{ padding: '48px 20px' }}>
          <PdNotice kind="info" icon={IconInfo}>{phase === 'error' ? 'Не удалось загрузить профиль.' : 'Профиль не найден.'}</PdNotice>
          {phase === 'error' && <div style={{ marginTop: 16, textAlign: 'center' }}><button className="pd-link" onClick={load}>Повторить</button></div>}
        </div>
      </ScreenChrome>
    );
  }

  const { user, reviews, active_listings } = data;
  const trusted = user.seller_rating >= 4.5 && user.deals_count >= 5;

  return (
    <ScreenChrome title="Профиль" action={action}>
      <div className="pd-prof">
        <PdAvatar seller={{ n: user.display_name }} size={64} />
        <div>
          <h2>{user.display_name}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
            <PdStars value={Math.round(user.seller_rating)} />
            <b style={{ fontSize: 14 }}>{user.seller_rating.toFixed(1)}</b>
            <span style={{ color: 'var(--pd-muted)', fontSize: 13 }}>
              · {user.deals_count} {plural(user.deals_count, 'сделка', 'сделки', 'сделок')}
            </span>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 16px' }}>
        <PdNotice kind="ok" icon={IconShield}>
          {trusted ? 'Проверенный продавец. ' : ''}Оплата при встрече — вы платите продавцу, только когда забрали букет.
        </PdNotice>
      </div>

      {active_listings.length > 0 && (
        <>
          <div className="pd-sechead">
            <div>
              <h2 className="pd-sectitle">Активные объявления</h2>
              <p className="pd-secsub">{active_listings.length} {plural(active_listings.length, 'букет', 'букета', 'букетов')}</p>
            </div>
          </div>
          <div className="pd-grid">
            {active_listings.map((l) => (
              <div className="pd-rise" key={l.id}>
                <BouquetCard listing={l} variant="grid" />
              </div>
            ))}
          </div>
        </>
      )}

      <div className="pd-sechead">
        <div>
          <h2 className="pd-sectitle">Отзывы</h2>
          <p className="pd-secsub">
            {reviews.length} {plural(reviews.length, 'отзыв', 'отзыва', 'отзывов')}
            {reviews.length > 0 && ` · ${user.seller_rating.toFixed(1)} ★`}
          </p>
        </div>
      </div>
      {reviews.length === 0 ? (
        <p style={{ padding: '8px 16px 16px', color: 'var(--pd-muted)', fontSize: 13.5 }}>Отзывов пока нет.</p>
      ) : (
        <div>
          {reviews.map((rv) => (
            <div className="pd-review" key={rv.id}>
              <div className="hd">
                <PdAvatar seller={{ n: 'П' }} size={28} />
                <span className="nm">Покупатель</span>
                <PdStars value={rv.score} />
                <span className="tm">{formatDate(rv.created_at)}</span>
              </div>
              <p>{rv.text}</p>
            </div>
          ))}
        </div>
      )}
      <div style={{ height: 20 }} />
    </ScreenChrome>
  );
}
