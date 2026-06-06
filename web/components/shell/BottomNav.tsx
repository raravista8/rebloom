'use client';
// Bottom tab bar — mirrors canon's .pd-bottomnav (canon's hardcodes active='home'
// with no links). Real Next navigation + active state by pathname. Shared across
// the main tab screens.
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ComponentType } from 'react';
import { IconHome, IconSearch, IconPlus, IconDeals, IconUser } from '@/components/icons';
import useMe from '@/lib/useMe';

type Tab = { href: string; label: string; Icon: ComponentType<{ className?: string }>; fab?: boolean };

const TABS: Tab[] = [
  { href: '/', label: 'Главная', Icon: IconHome },
  { href: '/search', label: 'Поиск', Icon: IconSearch },
  { href: '/sell', label: 'Продать', Icon: IconPlus, fab: true },
  { href: '/deals', label: 'Сделки', Icon: IconDeals },
  { href: '/me', label: 'Профиль', Icon: IconUser },
];

// Guest: the gated tabs (Сделки/Профиль) become a single «Войти» — a guest never sees
// the logged-in tabs. «Продать» stays (the middleware bounces it to /login). `authed
// === null` (loading) shows guest too, so a guest never flashes the logged-in nav.
const GUEST_TABS: Tab[] = [
  { href: '/', label: 'Главная', Icon: IconHome },
  { href: '/search', label: 'Поиск', Icon: IconSearch },
  { href: '/sell', label: 'Продать', Icon: IconPlus, fab: true },
  { href: '/login', label: 'Войти', Icon: IconUser },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { authed } = useMe();
  const tabs = authed ? TABS : GUEST_TABS;
  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <nav className="pd-bottomnav" style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}>
      {tabs.map((t) =>
        t.fab ? (
          <Link key={t.href} href={t.href} className="pd-tab pd-tab--fab" aria-label={t.label}>
            <span className="pd-fab">
              <t.Icon className="pd-i24" />
            </span>
            <span className="pd-tab-l">{t.label}</span>
          </Link>
        ) : (
          <Link
            key={t.href}
            href={t.href}
            className={`pd-tab${isActive(t.href) ? ' pd-tab--on' : ''}`}
            aria-current={isActive(t.href) ? 'page' : undefined}
          >
            <t.Icon className="pd-i24" />
            <span className="pd-tab-l">{t.label}</span>
          </Link>
        ),
      )}
    </nav>
  );
}
