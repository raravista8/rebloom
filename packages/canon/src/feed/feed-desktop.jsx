// @rebloom/canon · feed/feed-desktop.jsx
// Converted from design source pd-feed-desktop.jsx (single source of truth — edited ONLY by Claude Design).
import React from "react";
import "../styles/canon.css";
import { PdCard, PdSectionHead, PdIc, PdHeart, PD_FRESH, PD_LIKED } from "../feed/feed";

// ── brand mark «Соцветие» — лепестки = currentColor (подхватывают тему), центр янтарный
const PETAL = 'M50 50C38 41 36 21 50 10C64 21 62 41 50 50Z';
const Mark = ({ size=22, center='#E8A93B', style, className, title='Передарим' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={title} style={{ display:'block', flex:'none', ...style }}>
    {[0,72,144,216,288].map((a)=><path key={a} d={PETAL} fill="currentColor" transform={`rotate(${a} 50 50)`}/>)}
    <circle cx="50" cy="50" r="8" fill={center}/>
  </svg>
);

// pd-feed-desktop.jsx — «Передарим» главная / витрина (DESKTOP web, адаптив)
// Reuses the shared themed pieces from pd-feed.jsx (PdCard etc.).
// Exports: PdFeedDesktop

function PdFeedDesktop({ theme = 'a' }) {
  const Card = PdCard, SectionHead = PdSectionHead, Ic = PdIc;
  const FRESH = PD_FRESH, LIKED = PD_LIKED;

  const Bell = (p) => <svg viewBox="0 0 24 24" {...p}><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z"/><path d="M10 19a2 2 0 0 0 4 0"/></svg>;
  const Heart = (p) => PdHeart({ className: p.className });

  return (
    <div className="pd-root pd-web" data-pd-theme={theme}>
      {/* top navigation */}
      <header className="pdw-nav">
        <div className="pdw-nav-in">
          <span className="pd-brand pdw-brand"><Mark size={24} />Передарим</span>

          <div className="pdw-navmid">
            <button className="pd-city pdw-city">
              <Ic.pin className="pd-i16" fill="none" stroke="currentColor" />
              Москва
              <Ic.chev className="pd-i14" fill="none" stroke="currentColor" />
            </button>
            <div className="pd-search pdw-search">
              <Ic.search className="pd-i18" fill="none" stroke="currentColor" />
              <span className="pd-search-ph">Поиск свежих букетов в Москве</span>
            </div>
          </div>

          <nav className="pdw-navright">
            <button className="pdw-iconbtn" aria-label="Уведомления"><Bell className="pd-i20" fill="none" stroke="currentColor" /></button>
            <button className="pdw-iconbtn" aria-label="Избранное"><Heart className="pd-i20" fill="none" stroke="currentColor" /></button>
            <span className="pdw-avatar" aria-hidden="true">М</span>
            <button className="pdw-cta"><Ic.plus className="pd-i18" fill="none" stroke="currentColor" />Опубликовать букет</button>
          </nav>
        </div>
      </header>

      <main className="pd-scroll pdw-scroll">
        <div className="pdw-wrap">
          <section className="pdw-section">
            <SectionHead title="Самые свежие" sub="Куплены сегодня, рядом с вами в Москве" action="Смотреть все" />
            <div className="pdw-grid">
              {FRESH.map((d) => (
                <div className="pd-rise" key={d.id}><Card d={d} variant="grid" /></div>
              ))}
            </div>
          </section>

          <section className="pdw-section">
            <SectionHead title="Самые залайканные" sub="Любимцы недели, больше всего ♥ за 7 дней" action="Смотреть все" />
            <div className="pdw-grid">
              {LIKED.map((d) => (
                <div className="pd-rise" key={d.id}><Card d={d} variant="grid" /></div>
              ))}
            </div>
            <div className="pd-feed-end">Вы посмотрели свежие букеты Москвы. Смените город, чтобы увидеть больше</div>
          </section>
        </div>
      </main>
    </div>
  );
}

export { PdFeedDesktop };
