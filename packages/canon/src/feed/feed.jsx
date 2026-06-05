// @rebloom/canon · feed/feed.jsx
// Converted from design source pd-feed.jsx (single source of truth — edited ONLY by Claude Design).
import React from "react";
import "../styles/canon.css";

// pd-feed.jsx — «Передарим» главная / витрина (home feed)
// One screen, themed via CSS vars on a .pd-root[data-pd-theme] wrapper.
// Exports: window.PdFeed  +  window.PD_THEMES (label metadata)

const PD_IMG = (id) => `img/${id}.jpg`;

// ── sample listings (faithful to API_CONTRACT listing_card) ──────────────
const PD_FRESH = [
  { id: 'f1', photo: '1561181286-d3fee7d55364', size: 'M', fresh: 'today', price: 990,  district: 'Патрики',       likes: 47,  liked: true,  seller: { n: 'Аня',    r: 4.9, av: 'w1' } },
  { id: 'f2', photo: '1563241527-3004b7be0ffd', size: 'L', fresh: 'today', price: 1290, district: 'Хамовники',     likes: 23,  liked: false, seller: { n: 'Марина', r: 4.8, av: 'w2' } },
  { id: 'f3', photo: '1567418938902-aa650a3eb346', size: 'S', fresh: 'today', price: 690,  district: 'Сокол',         likes: 12,  liked: false, seller: { n: 'Ольга',  r: 5.0 } },
  { id: 'f4', photo: '1572454591674-2739f30d8c40', size: 'M', fresh: 'today', price: 1100, district: 'Чистые пруды',  likes: 56,  liked: false, seller: { n: 'Соня',   r: 5.0, av: 'w3' } },
  { id: 'f5', photo: '1581938165093-050aeb5ef218', size: 'L', fresh: 'today', price: 1450, district: 'Арбат',         likes: 19,  liked: false, seller: { n: 'Вера',   r: 4.6 } },
];
const PD_LIKED = [
  { id: 'l1', photo: '1565695951564-007d8f297e48', size: 'XL', fresh: 'd1_2',   price: 1190, district: 'Тверской',     likes: 134, liked: true,  seller: { n: 'Катя',   r: 4.7, av: 'w4' }, ar: '4 / 5' },
  { id: 'l2', photo: '1582794543139-8ac9cb0f7b11', size: 'M',  fresh: 'today',  price: 850,  district: 'Замоскворечье', likes: 88,  liked: false, seller: { n: 'Лена',   r: 4.9, av: 'w5' }, ar: '1 / 1' },
  { id: 'l3', photo: '1531120364508-a6b656c3e78d', size: 'L',  fresh: 'd1_2',   price: 920,  district: 'Пресня',       likes: 71,  liked: true,  seller: { n: 'Юля',    r: 4.8, av: 'w6' }, ar: '1 / 1' },
  { id: 'l4', photo: '1583228858294-6745cb25969e', size: 'S',  fresh: 'd3_plus',price: 590,  district: 'Сокол',        likes: 56,  liked: false, seller: { n: 'Ольга',  r: 5.0 }, ar: '4 / 5' },
  { id: 'l5', photo: '1533616688419-b7a585564566', size: 'M',  fresh: 'today',  price: 1290, district: 'Патрики',      likes: 51,  liked: false, seller: { n: 'Аня',    r: 4.9, av: 'w1' }, ar: '1 / 1' },
  { id: 'l6', photo: '1604323990536-e5452c0507c1', size: 'L',  fresh: 'd1_2',   price: 760,  district: 'Хамовники',    likes: 39,  liked: false, seller: { n: 'Марина', r: 4.8, av: 'w2' }, ar: '4 / 5' },
];

const PD_FRESH_META = {
  today:   { label: 'Сегодня', dot: 'var(--pd-fresh)' },
  d1_2:    { label: '1–2 дня', dot: 'var(--pd-aging)' },
  d3_plus: { label: '3+ дня',  dot: 'var(--pd-old)'   },
};

const pdMoney = (rub) => rub.toLocaleString('ru-RU').replace(/,/g, ' ') + ' ₽';

// ── icons (lucide-ish line set) ──────────────────────────────────────────
const Ic = {
  home:   (p) => <svg viewBox="0 0 24 24" {...p}><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V20h14V9.5" /></svg>,
  search: (p) => <svg viewBox="0 0 24 24" {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.2-3.2" /></svg>,
  plus:   (p) => <svg viewBox="0 0 24 24" {...p}><path d="M12 5v14M5 12h14" /></svg>,
  deals:  (p) => <svg viewBox="0 0 24 24" {...p}><path d="M4 7h16v12H4z" /><path d="M9 7V5h6v2" /><path d="M4 12h16" /></svg>,
  user:   (p) => <svg viewBox="0 0 24 24" {...p}><circle cx="12" cy="8" r="4" /><path d="M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6" /></svg>,
  pin:    (p) => <svg viewBox="0 0 24 24" {...p}><path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg>,
  star:   (p) => <svg viewBox="0 0 24 24" {...p}><path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.6 1-5.8L3.5 9.7l5.9-.9z" /></svg>,
  chev:   (p) => <svg viewBox="0 0 24 24" {...p}><path d="m6 9 6 6 6-6" /></svg>,
  sliders:(p) => <svg viewBox="0 0 24 24" {...p}><path d="M4 7h16M4 12h16M4 17h16" /><circle cx="9" cy="7" r="2.2" fill="currentColor" stroke="none"/><circle cx="15" cy="12" r="2.2" fill="currentColor" stroke="none"/><circle cx="8" cy="17" r="2.2" fill="currentColor" stroke="none"/></svg>,
};
const Heart = ({ filled, className }) => (
  <svg viewBox="0 0 24 24" className={className}
    fill={filled ? 'var(--pd-like)' : 'none'} stroke={filled ? 'var(--pd-like)' : 'currentColor'}>
    <path d="M12 20.3C12 20.3 3.4 14.9 3.4 8.7 3.4 6 5.5 4 8 4 9.8 4 11.3 5 12 6.3 12.7 5 14.2 4 16 4 18.5 4 20.6 6 20.6 8.7 20.6 14.9 12 20.3 12 20.3Z" />
  </svg>
);

// ── freshness badge ──────────────────────────────────────────────────────
function Freshness({ kind }) {
  const m = PD_FRESH_META[kind];
  return (
    <span className="pd-fresh" data-kind={kind}>
      <span className="pd-fresh-dot" style={{ background: m.dot }} />
      {m.label}
    </span>
  );
}

// ── like button (optimistic toggle + spring pop) ──────────────────────────
function LikeBtn({ liked: init, count: c0, big }) {
  const [liked, setLiked] = React.useState(init);
  const [count, setCount] = React.useState(c0);
  const [pop, setPop] = React.useState(false);
  const toggle = (e) => {
    e.stopPropagation(); e.preventDefault();
    const next = !liked;
    setLiked(next); setCount((n) => n + (next ? 1 : -1));
    if (next) { setPop(true); setTimeout(() => setPop(false), 420); }
  };
  return (
    <button className={'pd-like-btn' + (big ? ' pd-like-btn--big' : '') + (pop ? ' pd-pop' : '')}
      aria-pressed={liked} aria-label={liked ? 'Убрать лайк' : 'Лайк'} onClick={toggle}>
      <Heart filled={liked} className="pd-like-heart" />
      <span className="pd-like-n" style={{ fontVariantNumeric: 'tabular-nums' }}>{count}</span>
    </button>
  );
}

// ── seller avatar (photo → letter fallback) ──────────────────────────────
function Avatar({ seller, size = 21 }) {
  const st = { width: size, height: size, fontSize: Math.round(size * 0.5) };
  return (
    <span className="pd-ava" style={st} aria-hidden="true">
      {seller.av ? <img src={'img/av/' + seller.av + '.jpg'} alt="" loading="lazy" /> : seller.n[0]}
    </span>
  );
}

// ── bouquet card ───────────────────────────────────────────────────────────
function Card({ d, variant }) {
  const ar = variant === 'rail' ? '3 / 4' : (d.ar || '1 / 1');
  return (
    <article className={'pd-card pd-card--' + variant} tabIndex={0}>
      <div className="pd-photo-wrap" style={{ aspectRatio: ar }}>
        <img className="pd-photo" src={PD_IMG(d.photo)} alt="Букет" loading="lazy" />
        <div className="pd-photo-top">
          <Freshness kind={d.fresh} />
          <LikeBtn liked={d.liked} count={d.likes} />
        </div>
      </div>
      <div className="pd-card-body">
        <div className="pd-price-row">
          <span className="pd-price">{pdMoney(d.price)}</span>
          <span className="pd-size">{d.size}</span>
        </div>
        <div className="pd-meta">
          <Ic.pin className="pd-i14" fill="none" stroke="currentColor" />
          <span className="pd-district">{d.district}</span>
        </div>
        <div className="pd-seller">
          <Avatar seller={d.seller} size={21} />
          <span className="pd-seller-n">{d.seller.n}</span>
          <span className="pd-rating"><Ic.star className="pd-i13 pd-star" /> {d.seller.r.toFixed(1)}</span>
        </div>
      </div>
    </article>
  );
}

// ── section header ─────────────────────────────────────────────────────────
function SectionHead({ title, sub, action }) {
  return (
    <div className="pd-sechead">
      <div>
        <h2 className="pd-sectitle">{title}</h2>
        {sub && <p className="pd-secsub">{sub}</p>}
      </div>
      {action && <button className="pd-link">{action}</button>}
    </div>
  );
}

// ── top app bar ──────────────────────────────────────────────────────────
function TopBar({ safeTop }) {
  return (
    <header className="pd-topbar" style={{ paddingTop: safeTop }}>
      <div className="pd-topbar-row">
        <span className="pd-brand">Передарим</span>
        <button className="pd-city">
          <Ic.pin className="pd-i16" fill="none" stroke="currentColor" />
          Москва
          <Ic.chev className="pd-i14" fill="none" stroke="currentColor" />
        </button>
      </div>
      <div className="pd-searchrow">
        <div className="pd-search">
          <Ic.search className="pd-i18" fill="none" stroke="currentColor" />
          <span className="pd-search-ph">Поиск букетов в Москве</span>
        </div>
        <button className="pd-filter" aria-label="Фильтры">
          <Ic.sliders className="pd-i20" fill="none" stroke="currentColor" />
        </button>
      </div>
    </header>
  );
}

// ── bottom nav ───────────────────────────────────────────────────────────
function BottomNav({ safeBottom }) {
  const tabs = [
    { k: 'home', label: 'Главная', icon: Ic.home, active: true },
    { k: 'search', label: 'Поиск', icon: Ic.search },
    { k: 'sell', label: 'Продать', icon: Ic.plus, fab: true },
    { k: 'deals', label: 'Сделки', icon: Ic.deals },
    { k: 'me', label: 'Профиль', icon: Ic.user },
  ];
  return (
    <nav className="pd-bottomnav" style={{ paddingBottom: safeBottom }}>
      {tabs.map((t) => t.fab ? (
        <button key={t.k} className="pd-tab pd-tab--fab" aria-label={t.label}>
          <span className="pd-fab"><t.icon className="pd-i24" fill="none" stroke="currentColor" /></span>
          <span className="pd-tab-l">{t.label}</span>
        </button>
      ) : (
        <button key={t.k} className={'pd-tab' + (t.active ? ' pd-tab--on' : '')} aria-current={t.active ? 'page' : undefined}>
          <t.icon className="pd-i24" fill="none" stroke="currentColor" />
          <span className="pd-tab-l">{t.label}</span>
        </button>
      ))}
    </nav>
  );
}

// ── full screen ────────────────────────────────────────────────────────────
function PdFeed({ theme = 'a', platform = 'ios' }) {
  const safeTop = platform === 'ios' ? 56 : platform === 'web' ? 8 : 10;
  const safeBottom = platform === 'ios' ? 22 : 8;
  return (
    <div className="pd-root" data-pd-theme={theme}>
      <TopBar safeTop={safeTop} />
      <main className="pd-scroll">
        <section className="pd-section">
          <SectionHead title="Самые свежие" sub="Куплены сегодня, рядом с вами" action="Все" />
          <div className="pd-rail">
            {PD_FRESH.map((d) => (
              <div className="pd-rise" key={d.id}>
                <Card d={d} variant="rail" />
              </div>
            ))}
            <div className="pd-rail-end">
              <span>Листайте<br />дальше →</span>
            </div>
          </div>
        </section>

        <section className="pd-section">
          <SectionHead title="Самые залайканные" sub="Любимцы недели в Москве" action="Все" />
          <div className="pd-grid">
            {PD_LIKED.map((d) => (
              <div className="pd-rise" key={d.id}>
                <Card d={d} variant="grid" />
              </div>
            ))}
          </div>
          <div className="pd-feed-end">Вы посмотрели свежие букеты Москвы</div>
        </section>
        <div style={{ height: 18 }} />
      </main>
      <BottomNav safeBottom={safeBottom} />
    </div>
  );
}


export const PD_THEMES = [
  { id: 'a', name: 'A · «Воздух»', sub: 'светлый минимал · Golos Text · терракота' },
  { id: 'b', name: 'B · «Тёплый»', sub: 'уютный · Lora + Nunito Sans · карамель' },
  { id: 'c', name: 'C · «Сад»',    sub: 'свежий tech · Manrope · ботаническая зелень' },
];

export {
  PdFeed,
  Card as PdCard,
  Avatar as PdAvatar,
  Freshness as PdFreshness,
  LikeBtn as PdLikeBtn,
  SectionHead as PdSectionHead,
  TopBar as PdTopBar,
  BottomNav as PdBottomNav,
  Ic as PdIc,
  Heart as PdHeart,
  pdMoney,
  PD_FRESH,
  PD_LIKED
};
