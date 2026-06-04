'use client';
// Уведомления — GET /api/notifications (FR-050). In-app inbox. Mirrors canon's
// Notifications (.pd-list/.pd-row). Tab screen (bottom nav).
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import type { ComponentType } from 'react';
import { PdEmpty, PdSkelCard, PdNotice } from '@/components/canon';
import { IconBell, IconCheck, IconHeartLine, IconStar, IconShield, IconInfo } from '@/components/icons';
import ScreenChrome from '@/components/shell/ScreenChrome';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/format';
import type { AppNotification, Paginated } from '@/lib/types';

function iconFor(kind: string): ComponentType<{ className?: string }> {
  if (kind.startsWith('deal')) return IconCheck;
  if (kind.startsWith('like')) return IconHeartLine;
  if (kind.startsWith('review')) return IconStar;
  if (kind.startsWith('moderation') || kind.startsWith('listing')) return IconShield;
  return IconBell;
}

function targetHref(n: AppNotification): string | null {
  const p = n.payload ?? {};
  if (typeof p.deal_id === 'string') return `/deal/${p.deal_id}`;
  if (typeof p.listing_id === 'string') return `/l/${p.listing_id}`;
  return null;
}

export default function NotificationsScreen() {
  const [items, setItems] = useState<AppNotification[]>([]);
  const [phase, setPhase] = useState<'loading' | 'list' | 'empty' | 'error'>('loading');

  const load = useCallback(async () => {
    setPhase('loading');
    try {
      const p = await api.get<Paginated<AppNotification>>('/notifications');
      setItems(p.items);
      setPhase(p.items.length === 0 ? 'empty' : 'list');
    } catch {
      setPhase('error');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <ScreenChrome title="Уведомления" back={false} tab>
      {phase === 'loading' && (
        <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {Array.from({ length: 4 }, (_, i) => (
            <PdSkelCard key={i} />
          ))}
        </div>
      )}
      {phase === 'empty' && (
        <PdEmpty glyph={IconBell} title="Пока тихо" text="Здесь появятся статусы сделок, лайки ваших букетов и новые отзывы." />
      )}
      {phase === 'error' && (
        <div style={{ padding: '40px 20px', textAlign: 'center' }}>
          <PdNotice kind="danger">Не удалось загрузить уведомления.</PdNotice>
          <div style={{ marginTop: 14 }}>
            <button className="pd-link" onClick={load}>Повторить</button>
          </div>
        </div>
      )}
      {phase === 'list' && (
        <div className="pd-list">
          {items.map((n) => {
            const Icon = iconFor(n.kind);
            const href = targetHref(n);
            const row = (
              <div className={`pd-row${n.read ? '' : ' unread'}`}>
                <span className="ring">
                  <Icon className="pd-i20" />
                </span>
                <div className="mid">
                  <div className="ttl">{n.title}</div>
                  <div className="sub">{n.body}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                  <span className="tm">{formatDate(n.created_at)}</span>
                  {!n.read && <span className="udot" />}
                </div>
              </div>
            );
            return href ? (
              <Link key={n.id} href={href} style={{ textDecoration: 'none', color: 'inherit' }}>
                {row}
              </Link>
            ) : (
              <div key={n.id}>{row}</div>
            );
          })}
        </div>
      )}
    </ScreenChrome>
  );
}
