// Single site footer (canon `.pdl-foot*` classes, composed in web/ — the canon
// PdLandingFooter ships dead `href="#"` links we can't edit in src). EVERY link here
// resolves to a real route. Used on the home landing directly, and on the canon SEO
// pages via <SiteFooterStandalone/> (which hides the baked canon footer — see
// globals.css `.pds .pdl-foot`).
import Link from 'next/link';
import { GEO_CITIES } from '@/lib/geoCities';

const PETAL = 'M50 50C38 41 36 21 50 10C64 21 62 41 50 50Z';
function Mark({ size = 26, center = '#E8A93B' }: { size?: number; center?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label="Передарим" style={{ display: 'block', flex: 'none' }}>
      {[0, 72, 144, 216, 288].map((a) => (
        <path key={a} d={PETAL} fill="currentColor" transform={`rotate(${a} 50 50)`} />
      ))}
      <circle cx="50" cy="50" r="8" fill={center} />
    </svg>
  );
}

// Only links with a real destination. Columns that had no page (О сервисе, Выплаты,
// Самозанятым, Возврат и споры, Поддержка…) are dropped, not stubbed.
const COLS: { h: string; links: { label: string; href: string }[] }[] = [
  {
    h: 'Покупателям',
    links: [
      { label: 'Свежие букеты рядом', href: '/' },
      { label: 'Безопасная сделка', href: '/bezopasnaya-sdelka' },
    ],
  },
  {
    h: 'Продавцам',
    links: [
      { label: 'Опубликовать букет', href: '/sell' },
      { label: 'Блог', href: '/blog' },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="pdl-foot">
      <div className="pdl-in">
        <div className="pdl-foot-top">
          <div className="pdl-foot-brand">
            <span className="pdl-foot-mark">
              <Mark size={26} />
              <span className="w">Передарим</span>
            </span>
            <p className="pdl-foot-tag">
              Сервис передаривания свежих букетов. Дарим цветам вторую жизнь и продаём их в 2–3 раза дешевле магазина.
            </p>
          </div>
          <div className="pdl-foot-cols">
            {COLS.map((c) => (
              <div className="pdl-foot-col" key={c.h}>
                <h4>{c.h}</h4>
                <ul>
                  {c.links.map((l) => (
                    <li key={l.href + l.label}>
                      <Link href={l.href}>{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="pdl-foot-col">
              <h4>Города</h4>
              <ul>
                {GEO_CITIES.map((c) => (
                  <li key={c.id}>
                    <Link href={`/${c.id}`}>{c.nom}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="pdl-foot-legal">
          <div className="links">
            <Link href="/legal/terms">Пользовательское соглашение</Link>
            <Link href="/legal/privacy">Политика конфиденциальности</Link>
          </div>
          <p>© 2026 «Передарим». Сервис не является цветочным магазином и не продаёт новые букеты. Обработка персональных данных по 152-ФЗ.</p>
        </div>
      </div>
    </footer>
  );
}

// For the canon SEO pages: render outside the canon `.pd-root`, wrapped so the
// `.pdl-foot*` styles + theme tokens apply (the baked canon footer is hidden via CSS).
export function SiteFooterStandalone() {
  return (
    <div className="pd-root pd-web pdl" data-pd-theme="a">
      <SiteFooter />
    </div>
  );
}
