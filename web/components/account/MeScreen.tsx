'use client';
// Профиль / аккаунт (own) — the «Профиль» bottom-nav tab. Fetches /api/me; account
// rows + logout + delete. Notification toggles + DSR delete live on their own
// settings sub-screens. (canon's SettingsHub uses unexported internals → composed
// from .pd-row here.)
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ComponentType } from 'react';
import { PdAvatar, PdStars, PdNotice } from '@/components/canon';
import { IconUser, IconBell, IconLogout, IconTrash, IconFwd, IconPin } from '@/components/icons';
import ScreenChrome from '@/components/shell/ScreenChrome';
import { api } from '@/lib/api';
import { cityName } from '@/lib/cities';
import type { User } from '@/lib/types';

function Row({ icon: Icon, title, href, onClick, danger, chev = true }: { icon: ComponentType<{ className?: string }>; title: string; href?: string; onClick?: () => void; danger?: boolean; chev?: boolean }) {
  const inner = (
    <div className="pd-row" style={{ cursor: 'pointer' }}>
      <span className="ring" style={danger ? { color: 'var(--pd-danger)' } : undefined}>
        <Icon className="pd-i20" />
      </span>
      <div className="mid">
        <div className="ttl" style={danger ? { color: 'var(--pd-danger)' } : undefined}>{title}</div>
      </div>
      {chev && <IconFwd className="pd-i18" style={{ color: 'var(--pd-faint)' }} />}
    </div>
  );
  if (href) return <Link href={href} style={{ textDecoration: 'none', color: 'inherit' }}>{inner}</Link>;
  return (
    <button type="button" onClick={onClick} style={{ all: 'unset', display: 'block', width: '100%' }}>
      {inner}
    </button>
  );
}

export default function MeScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [phase, setPhase] = useState<'loading' | 'ready' | 'anon'>('loading');

  useEffect(() => {
    let alive = true;
    api
      .get<User>('/me')
      .then((u) => {
        if (!alive) return;
        setUser(u);
        setPhase('ready');
      })
      .catch(() => alive && setPhase('anon'));
    return () => {
      alive = false;
    };
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      /* ignore */
    }
    router.replace('/login');
  }, [router]);

  if (phase === 'anon') {
    return (
      <ScreenChrome title="Профиль" back={false} tab>
        <div style={{ padding: '48px 20px', textAlign: 'center' }}>
          <PdNotice kind="info">Войдите, чтобы видеть свой профиль, сделки и объявления.</PdNotice>
          <div style={{ marginTop: 16 }}>
            <Link href="/login" className="pd-link">Войти</Link>
          </div>
        </div>
      </ScreenChrome>
    );
  }

  return (
    <ScreenChrome title="Профиль" back={false} tab>
      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px 16px' }}>
          <PdAvatar seller={{ n: user.display_name }} size={56} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 18 }}>{user.display_name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--pd-muted)', fontSize: 13, marginTop: 3 }}>
              <IconPin className="pd-i13" />
              {cityName(user.city_id)}
              <span style={{ margin: '0 2px' }}>·</span>
              <PdStars value={Math.round(user.seller_rating)} />
              <b style={{ color: 'var(--pd-text)' }}>{user.seller_rating.toFixed(1)}</b>
              <span>· {user.deals_count} сделок</span>
            </div>
          </div>
        </div>
      )}

      <div className="pd-list">
        {user && <Row icon={IconUser} title="Профиль продавца" href={`/u/${user.id}`} />}
        <Row icon={IconBell} title="Уведомления" href="/notifications" />
      </div>

      <div className="pd-list" style={{ marginTop: 12 }}>
        <Row icon={IconLogout} title="Выйти" onClick={logout} chev={false} />
        <Row icon={IconTrash} title="Удалить аккаунт" href="/settings/delete" danger chev={false} />
      </div>

      <p style={{ textAlign: 'center', color: 'var(--pd-faint)', fontSize: 12, marginTop: 18 }}>Передарим</p>
    </ScreenChrome>
  );
}
