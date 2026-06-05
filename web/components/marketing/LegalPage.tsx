// Shell for the legal documents (Terms / Privacy). Canon look via the standalone
// `.pds-*` classes (no `.pds` ancestor → SiteFooter stays visible). Server component.
import Link from 'next/link';
import SiteFooter from '@/components/marketing/SiteFooter';

const PETAL = 'M50 50C38 41 36 21 50 10C64 21 62 41 50 50Z';
function Mark({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label="Передарим" style={{ display: 'block', flex: 'none' }}>
      {[0, 72, 144, 216, 288].map((a) => (
        <path key={a} d={PETAL} fill="currentColor" transform={`rotate(${a} 50 50)`} />
      ))}
      <circle cx="50" cy="50" r="8" fill="#E8A93B" />
    </svg>
  );
}

export default function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <div className="pd-root pd-web pdl" data-pd-theme="a">
      <header className="pdl-nav">
        <div className="pdl-nav-in">
          <Link href="/" className="pdl-brand" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Mark size={24} />Передарим
          </Link>
        </div>
      </header>
      <main className="pd-scroll pdw-scroll">
        <section className="pds-top">
          <div className="pds-in">
            <p className="pds-crumbs"><Link href="/">Главная</Link> · Правовая информация</p>
            <h1 className="pds-h1">{title}</h1>
            <p className="pds-intro" style={{ fontSize: 15, opacity: 0.8 }}>
              Предварительная редакция, {updated}. Финальный текст готовится; по вопросам — <a href="mailto:hello@peredarim.ru" style={{ color: 'var(--pd-primary)', fontWeight: 600 }}>hello@peredarim.ru</a>.
            </p>
          </div>
        </section>
        <section className="pds-sec">
          <div className="pds-in">
            <div className="pds-prose">{children}</div>
          </div>
        </section>
        <SiteFooter />
      </main>
    </div>
  );
}
