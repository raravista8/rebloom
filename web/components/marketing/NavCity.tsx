'use client';
// Header city selector (canon 0.6.2 §0.2 — ported, web does the real wiring).
// DESKTOP: anchored popover under «📍 Москва ▾» — the 10 launch cities with counts +
// a checkmark on the active one, second-click/outside-click/Esc to close, pick →
// persist (cookie) + route to /[slug]. MOBILE (<1024): the trigger is a plain link to
// the full-screen /city list (canon keeps the popover desktop-only).
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useIsDesktop from '@/lib/useIsDesktop';
import { GEO_CITIES } from '@/lib/geoCities';

type IP = { className?: string };
const sv = (p: IP) => ({ ...p, fill: 'none', stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, viewBox: '0 0 24 24' });
const Pin = (p: IP) => <svg {...sv(p)}><path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg>;
const Chev = (p: IP) => <svg {...sv(p)}><path d="m6 9 6 6 6-6" /></svg>;
const Check = (p: IP) => <svg {...sv(p)} strokeWidth={2.2}><path d="m5 12.5 4.5 4.5L19 7" /></svg>;

export default function NavCity({ initialSlug = 'moskva' }: { initialSlug?: string }) {
  const desktop = useIsDesktop();
  const [open, setOpen] = useState(false);
  const [slug, setSlug] = useState(initialSlug);
  const wrapRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const current = GEO_CITIES.find((c) => c.id === slug) ?? GEO_CITIES[0];

  // MOBILE: full-screen list lives at /city — keep the trigger a link.
  if (!desktop) {
    return (
      <Link href="/city" className="pdl-nav-city" style={{ textDecoration: 'none' }}>
        <Pin className="pin" />{current.nom}<Chev />
      </Link>
    );
  }

  const pick = (s: string) => {
    setSlug(s);
    setOpen(false);
    document.cookie = `pd_city=${s}; path=/; max-age=31536000; samesite=lax`;
    router.push(`/${s}`);
  };

  return (
    <div className="pdl-citywrap" ref={wrapRef}>
      <button
        className={'pdl-nav-city' + (open ? ' open' : '')}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <Pin className="pin" />{current.nom}<Chev className={'chev' + (open ? ' up' : '')} />
      </button>
      {open && (
        <div className="pdl-citymenu" role="dialog" aria-label="Выбор города">
          <div className="pdl-citymenu-list">
            {GEO_CITIES.map((c) => (
              <button
                key={c.id}
                className={'pdl-cityrow' + (c.id === slug ? ' on' : '')}
                onClick={() => pick(c.id)}
              >
                <span className="pin"><Pin /></span>
                <span className="nm">{c.nom}</span>
                <span className="ct">{c.count}</span>
                {c.id === slug && <span className="ck"><Check /></span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
