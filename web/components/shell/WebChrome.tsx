'use client';
// Shared DESKTOP top header — canon's unified PdWebNav (the 0.9.0 source of truth for
// every web header: brand · city · search · bell · избранное · avatar · CTA + mobile
// burger→drawer). Used by the home витрина AND by ScreenChrome's desktop layout.
//
// MUST sit inside a `.pdl` container: PdWebNav's desktop controls (city/search/CTA/fav)
// are revealed by the `@container pdl (min-width:900px)` query, and its drawer is
// position:absolute against `.pdl`. The desktop roots all carry `pd-root pd-web pdl`.
//
// Auth-aware (the just-fixed bug — do not regress): `authed` comes from useMe();
// `authed === null` (loading) renders the GUEST header (PdWebNav guest = «Войти», no
// избранное/avatar), so a guest never flashes the logged-in toolbar.
//
// PdWebNav exposes only { active, authed, city, user, links, onPublish }. Its brand /
// «Войти» / nav-link anchors are canon-static (.html / #login); we map those to real
// Next routes with a click-capture adapter on the wrapper (no fork of canon src).
import { useEffect, useState, type MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { PdWebNav } from '@/components/canon';
import { getCityClient } from '@/lib/city-client';
import { cityName, cityPrepositional, DEFAULT_CITY } from '@/lib/cities';
import useMe from '@/lib/useMe';

// canon-static hrefs PdWebNav renders → real routes (kept in sync with web-nav.jsx).
const LANDING = 'Передарим · Лендинг peredarim.ru.html';
const CATALOG = 'Передарим · Каталог букетов.html';
const HREF_MAP: Record<string, string> = {
  [LANDING]: '/',
  [LANDING + '#login']: '/login',
  [LANDING + '#how']: '/#how',
  [LANDING + '#safe']: '/bezopasnaya-sdelka',
  [LANDING + '#app']: '/#app',
  [CATALOG]: '/catalog',
};

// Real nav links for the desktop bar + burger drawer (replace canon's .html defaults).
const NAV_LINKS = [
  { label: 'Каталог', sub: 'Все свежие букеты', href: '/catalog' },
  { label: 'Как работает', sub: 'Передаривание за 1 день', href: '/#how' },
  { label: 'Безопасная сделка', sub: 'Оплата при встрече', href: '/bezopasnaya-sdelka' },
  { label: 'Приложение', sub: 'iOS и Android', href: '/#app' },
];

export default function WebChrome({ cityId }: { cityId?: string }) {
  const router = useRouter();
  const { authed } = useMe();
  const [city, setCity] = useState(cityId ?? DEFAULT_CITY);

  useEffect(() => {
    if (!cityId) setCity(getCityClient());
  }, [cityId]);

  // PdWebNav's brand / «Войти» / nav anchors are canon-static (.html / #login) and its
  // city button + search field expose no handlers → route them through Next here (client
  // nav, no fork). Links we supplied already carry real hrefs → identity-passed.
  const onClickCapture = (e: MouseEvent<HTMLElement>) => {
    const t = e.target as HTMLElement;
    if (t.closest('.pdl-nav-city')) {
      e.preventDefault();
      router.push('/city');
      return;
    }
    if (t.closest('.pdl-nav-search')) {
      e.preventDefault();
      router.push('/search');
      return;
    }
    if (t.closest('.pdl-nav-icon[aria-label="Уведомления"]')) {
      e.preventDefault();
      router.push('/notifications');
      return;
    }
    if (t.closest('.pdl-nav-ava')) {
      e.preventDefault();
      router.push('/me');
      return;
    }
    const a = t.closest('a');
    if (!a) return;
    const raw = a.getAttribute('href');
    if (!raw || raw === '#') return;
    const dest = HREF_MAP[raw] ?? (raw.startsWith('/') || raw.startsWith('/#') ? raw : null);
    if (dest) {
      e.preventDefault();
      router.push(dest);
    }
  };

  const links = NAV_LINKS.map((l) => ({
    ...l,
    Icon: (p: { className?: string }) => <span {...p} />,
  }));

  return (
    <div onClickCapture={onClickCapture} style={{ display: 'contents' }}>
      <PdWebNav
        authed={authed === true}
        city={cityName(city)}
        cityLoc={cityPrepositional(city)}
        links={links}
        onPublish={() => router.push('/sell')}
      />
    </div>
  );
}
