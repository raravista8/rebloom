'use client';
// Mobile burger drawer — canon 0.7.0 (BURGER_MENU.md), ported with real web wiring.
// Right sheet over a scrim; site menu (guest set — the public landing never shows the
// authed nav). Canon styles it `.pdl-drawer*` + position:absolute, containing it to the
// fixed-height device-frame `.pdl`. Web's landing is a SCROLLING document and `.pdl` has
// `container-type:inline-size` (a containing block for fixed AND absolute) that grows with
// content → an in-`.pdl` drawer mis-anchors when scrolled (footer falls off-screen). Fix:
// PORTAL to <body> (escapes the container) + position:fixed → viewport-anchored. Tokens +
// `.pdl-*` classes are global (layout.tsx imports theme.css + canon.css), so the portaled
// node is fully styled. State (`open`) lives in the nav; this only renders + closes.
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { PdBtn } from '@/components/canon';
import { IconPlus } from '@/components/icons';
import { GEO_CITIES } from '@/lib/geoCities';

type IP = { className?: string };
const sv = (p: IP) => ({ ...p, fill: 'none', stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, viewBox: '0 0 24 24' });
const PETAL = 'M50 50C38 41 36 21 50 10C64 21 62 41 50 50Z';
const Mark = ({ size = 23 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label="Передарим" style={{ display: 'block', flex: 'none' }}>
    {[0, 72, 144, 216, 288].map((a) => <path key={a} d={PETAL} fill="currentColor" transform={`rotate(${a} 50 50)`} />)}
    <circle cx="50" cy="50" r="8" fill="#E8A93B" />
  </svg>
);
const Pin = (p: IP) => <svg {...sv(p)}><path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg>;
const Chev = (p: IP) => <svg {...sv(p)}><path d="m6 9 6 6 6-6" /></svg>;
const Check = (p: IP) => <svg {...sv(p)} strokeWidth={2.2}><path d="m5 12.5 4.5 4.5L19 7" /></svg>;
const Close = (p: IP) => <svg {...sv(p)} strokeWidth={2}><path d="M6 6l12 12M18 6 6 18" /></svg>;
const ChevR = (p: IP) => <svg {...sv(p)} strokeWidth={2}><path d="m9 6 6 6-6 6" /></svg>;
const Grid = (p: IP) => <svg {...sv(p)}><rect x="4" y="4" width="7" height="7" rx="1.7" /><rect x="13" y="4" width="7" height="7" rx="1.7" /><rect x="4" y="13" width="7" height="7" rx="1.7" /><rect x="13" y="13" width="7" height="7" rx="1.7" /></svg>;
const Steps = (p: IP) => <svg {...sv(p)}><path d="M9 6h11M9 12h11M9 18h11" /><circle cx="4.5" cy="6" r="1.3" fill="currentColor" stroke="none" /><circle cx="4.5" cy="12" r="1.3" fill="currentColor" stroke="none" /><circle cx="4.5" cy="18" r="1.3" fill="currentColor" stroke="none" /></svg>;
const Shield = (p: IP) => <svg {...sv(p)}><path d="M12 3 5 6v5c0 4.2 2.9 7.5 7 9 4.1-1.5 7-4.8 7-9V6z" /><path d="m9.2 12 1.9 1.9 3.7-3.7" /></svg>;
const Phone = (p: IP) => <svg {...sv(p)}><rect x="7" y="2.5" width="10" height="19" rx="2.6" /><path d="M11 18.5h2" /></svg>;

// Guest site menu → real web routes (BURGER_MENU §6). Landing anchors are absolute so
// they work from any page (the burger also opens on /[city], /bezopasnaya-sdelka, …).
const LINKS = [
  { icon: Grid, label: 'Каталог букетов', sub: 'Свежие букеты рядом', href: '/catalog' },
  { icon: Steps, label: 'Как это работает', sub: 'Три простых шага', href: '/#how' },
  { icon: Shield, label: 'Безопасная сделка', sub: 'Оплата при встрече', href: '/bezopasnaya-sdelka' },
  { icon: Phone, label: 'Приложение', sub: 'iOS · Android · RuStore', href: '/#app' },
];

export default function MobileMenu({ open, onClose, initialCity = 'Москва' }: { open: boolean; onClose: () => void; initialCity?: string }) {
  const [mounted, setMounted] = useState(false);
  const [cityNom, setCityNom] = useState(initialCity);
  const [cityOpen, setCityOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!open) {
      setCityOpen(false);
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const t = setTimeout(() => closeRef.current?.focus(), 80);
    return () => {
      document.removeEventListener('keydown', onKey);
      clearTimeout(t);
    };
  }, [open, onClose]);

  if (!mounted) return null;
  const current = GEO_CITIES.find((c) => c.nom === cityNom) ?? GEO_CITIES[0];

  return createPortal(
    <div className={'pdl-drawer' + (open ? ' open' : '')} aria-hidden={!open} style={{ position: 'fixed' }}>
      <div className="pdl-drawer-scrim" onClick={onClose} />
      <aside className="pdl-drawer-panel" role="dialog" aria-modal="true" aria-label="Меню">
        <header className="pdl-drawer-top">
          <span className="pdl-brand"><Mark size={23} />Передарим</span>
          <button className="pdl-drawer-x" ref={closeRef} onClick={onClose} aria-label="Закрыть меню"><Close /></button>
        </header>

        <div className="pdl-drawer-body">
          <div className={'pdl-drawer-city' + (cityOpen ? ' on' : '')}>
            <button className="head" onClick={() => setCityOpen((o) => !o)} aria-expanded={cityOpen}>
              <span className="pin"><Pin /></span>
              <span className="tx"><b>{current.nom}</b><span>{current.count} свежих букетов рядом</span></span>
              <Chev className={'chev' + (cityOpen ? ' up' : '')} />
            </button>
            {cityOpen && (
              <div className="list">
                {GEO_CITIES.map((c) => (
                  <button key={c.id} className={'crow' + (c.nom === current.nom ? ' on' : '')} onClick={() => { setCityNom(c.nom); setCityOpen(false); }}>
                    <span className="nm">{c.nom}</span>
                    <span className="ct">{c.count}</span>
                    {c.nom === current.nom && <Check className="ck" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <nav className="pdl-drawer-nav">
            {LINKS.map((l) => {
              const Icon = l.icon;
              return (
                <Link key={l.label} className="pdl-drawer-row" href={l.href} onClick={onClose}>
                  <span className="ic"><Icon /></span>
                  <span className="tx"><b>{l.label}</b><span>{l.sub}</span></span>
                  <ChevR className="go" />
                </Link>
              );
            })}
          </nav>
        </div>

        <footer className="pdl-drawer-foot">
          <Link href="/sell" onClick={onClose} style={{ display: 'block', textDecoration: 'none' }}>
            <PdBtn variant="primary" block lg icon={IconPlus}>Опубликовать букет</PdBtn>
          </Link>
          <p className="pdl-drawer-note">Уже с нами? <Link href="/login" onClick={onClose} className="lnk">Войти</Link></p>
        </footer>
      </aside>
    </div>,
    document.body,
  );
}
