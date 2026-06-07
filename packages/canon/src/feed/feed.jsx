// @rebloom/canon · feed/feed.jsx
// Converted from design source pd-feed.jsx (single source of truth — edited ONLY by Claude Design).
import React from "react";
import "../styles/canon.css";

// ── brand mark «Соцветие» — лепестки = currentColor (подхватывают тему), центр янтарный
const PETAL = 'M50 50C38 41 36 21 50 10C64 21 62 41 50 50Z';
const Mark = ({ size=22, center='#E8A93B', style, className, title='Передарим' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={title} style={{ display:'block', flex:'none', ...style }}>
    {[0,72,144,216,288].map((a)=><path key={a} d={PETAL} fill="currentColor" transform={`rotate(${a} 50 50)`}/>)}
    <circle cx="50" cy="50" r="8" fill={center}/>
  </svg>
);

// pd-feed.jsx — «Передарим» главная / витрина (home feed)
// One screen, themed via CSS vars on a .pd-root[data-pd-theme] wrapper.
// Exports: PdFeed  +  PD_THEMES (label metadata)

const PD_IMG = (id) => `img/${id}.jpg`;

// ── sample listings (faithful to API_CONTRACT listing_card) ──────────────
const PD_FRESH = [
  { id: 'fr1', photo: '1567418938902-aa650a3eb346', roseLabel: '101 роза', size: 'XL', fresh: 'today', price: 3490, city: 'Москва', metro: 'Маяковская',  district: 'Патрики', flowers: ['Розы'], likes: 73, liked: true, seller: { n: 'Эльвира', r: 4.9, av: 'w4' } },
  { id: 'fr2', photo: '1563241527-3004b7be0ffd', roseLabel: '51 роза', size: 'XL', fresh: 'today', price: 1990, city: 'Москва', metro: 'Арбатская', district: 'Арбат', flowers: ['Розы'], likes: 58, liked: false, seller: { n: 'Карина', r: 4.8, av: 'w2' } },
  { id: 'f1', photo: '1561181286-d3fee7d55364', size: 'M', fresh: 'today', price: 990,  city: 'Москва', metro: 'Маяковская',    district: 'Патрики',       flowers: ['Пионовидные розы', 'Зелень и эвкалипт'], likes: 47,  liked: true,  seller: { n: 'Аня',    r: 4.9, av: 'w1' } },
  { id: 'f2', photo: '1563241527-3004b7be0ffd', size: 'L', fresh: 'today', price: 1290, city: 'Москва', metro: 'Парк культуры',  district: 'Хамовники',     flowers: ['Розы', 'Гортензия'], likes: 23,  liked: false, seller: { n: 'Марина', r: 4.8, av: 'w2' } },
  { id: 'f3', photo: '1567418938902-aa650a3eb346', size: 'S', fresh: 'today', price: 690,  city: 'Москва', metro: 'Сокол',         district: 'Сокол',         flowers: ['Тюльпаны'], likes: 12,  liked: false, seller: { n: 'Ольга',  r: 5.0 } },
  { id: 'f4', photo: '1572454591674-2739f30d8c40', size: 'M', fresh: 'today', price: 1100, city: 'Москва', metro: 'Чистые пруды',  district: 'Чистые пруды',  flowers: ['Пионы'], likes: 56,  liked: false, seller: { n: 'Соня',   r: 5.0, av: 'w3' } },
  { id: 'f5', photo: '1581938165093-050aeb5ef218', size: 'L', fresh: 'today', price: 1450, city: 'Москва', metro: 'Смоленская',     district: 'Арбат',         flowers: ['Гортензия', 'Эустома'], likes: 19,  liked: false, seller: { n: 'Вера',   r: 4.6 } },
  { id: 'f6', photo: '1565695951564-007d8f297e48', size: 'M', fresh: 'today', price: 880,  city: 'Москва', metro: 'Полянка',       district: 'Якиманка',      flowers: ['Ранункулюсы'], likes: 34,  liked: false, seller: { n: 'Ника',   r: 4.8 } },
];
const PD_LIKED = [
  { id: 'lr1', photo: '1567418938902-aa650a3eb346', roseLabel: '201 роза', size: 'XL', fresh: 'today', price: 6900, city: 'Москва', metro: 'Кропоткинская', district: 'Остоженка', flowers: ['Розы'], likes: 96, liked: true, seller: { n: 'Вероника', r: 5.0, av: 'w1' }, ar: '1 / 1' },
  { id: 'l1', photo: '1565695951564-007d8f297e48', size: 'XL', fresh: 'd1_2',   price: 1190, city: 'Москва', metro: 'Тверская',        district: 'Тверской',     flowers: ['Хризантемы'], likes: 134, liked: true,  seller: { n: 'Катя',   r: 4.7, av: 'w4' }, ar: '4 / 5' },
  { id: 'l2', photo: '1582794543139-8ac9cb0f7b11', size: 'M',  fresh: 'today',  price: 850,  city: 'Москва', metro: 'Новокузнецкая',   district: 'Замоскворечье', flowers: ['Тюльпаны'], likes: 88,  liked: false, seller: { n: 'Лена',   r: 4.9, av: 'w5' }, ar: '1 / 1' },
  { id: 'l3', photo: '1531120364508-a6b656c3e78d', size: 'L',  fresh: 'd1_2',   price: 920,  city: 'Москва', metro: 'Улица 1905 года', district: 'Пресня',       flowers: ['Альстромерия'], likes: 71,  liked: true,  seller: { n: 'Юля',    r: 4.8, av: 'w6' }, ar: '1 / 1' },
  { id: 'l4', photo: '1583228858294-6745cb25969e', size: 'S',  fresh: 'd3_plus',price: 590,  city: 'Москва', metro: 'Сокол',           district: 'Сокол',        flowers: ['Розы', 'Гортензия'], likes: 56,  liked: false, seller: { n: 'Ольга',  r: 5.0 }, ar: '4 / 5' },
  { id: 'l5', photo: '1533616688419-b7a585564566', size: 'M',  fresh: 'today',  price: 1290, city: 'Москва', metro: 'Маяковская',      district: 'Патрики',      flowers: ['Пионы'], likes: 51,  liked: false, seller: { n: 'Аня',    r: 4.9, av: 'w1' }, ar: '1 / 1' },
  { id: 'l6', photo: '1604323990536-e5452c0507c1', size: 'L',  fresh: 'd1_2',   price: 760,  city: 'Москва', metro: 'Фрунзенская',     district: 'Хамовники',    flowers: ['Герберы'], likes: 39,  liked: false, seller: { n: 'Марина', r: 4.8, av: 'w2' }, ar: '4 / 5' },
  { id: 'l7', photo: '1561181286-d3fee7d55364', size: 'M',  fresh: 'd1_2',   price: 690,  city: 'Москва', metro: 'Арбатская',       district: 'Арбат',        flowers: ['Полевые'], likes: 63,  liked: true,  seller: { n: 'Вера',   r: 4.6 }, ar: '1 / 1' },
];

// бейджи свежести = «когда букет подарили» (тег читается явно)
const PD_FRESH_META = {
  today:   { label: 'Свежий',                short: 'Свежий', dot: 'var(--pd-fresh)' },
  d1_2:    { label: '1–2 дня', short: '1–2 дня', dot: 'var(--pd-aging)' },
  d3_plus: { label: '3+ дня',  short: '3+ дня',  dot: 'var(--pd-old)'   },
};

// ── метро: официальные цвета линий + станции по городам ──────────────────
const PD_METRO_LINES = {
  '1':'#D9232E','2':'#48B85C','3':'#0078BF','4':'#19C1F3','5':'#894E35',
  '6':'#F58220','7':'#943D9F','8':'#FFCB31','9':'#A1A2A3','10':'#B3D445',
  '11':'#79CDCD','sp1':'#D6083B','sp2':'#0072BC','sp3':'#239B56','sp4':'#F08300','sp5':'#7E3F98',
};
const PD_METRO = {
  msk: [
    { n:'Охотный Ряд', l:['1'] }, { n:'Лубянка', l:['1'] }, { n:'Чистые пруды', l:['1'] },
    { n:'Кропоткинская', l:['1'] }, { n:'Комсомольская', l:['1','5'] }, { n:'Фрунзенская', l:['1'] },
    { n:'Парк культуры', l:['1','5'] },
    { n:'Тверская', l:['2'] }, { n:'Маяковская', l:['2'] }, { n:'Театральная', l:['2'] },
    { n:'Новокузнецкая', l:['2'] }, { n:'Белорусская', l:['2','5'] }, { n:'Сокол', l:['2'] }, { n:'Аэропорт', l:['2'] },
    { n:'Арбатская', l:['3'] }, { n:'Смоленская', l:['3'] }, { n:'Площадь Революции', l:['3'] }, { n:'Курская', l:['3','5'] },
    { n:'Киевская', l:['3','4','5'] },
    { n:'Краснопресненская', l:['5'] }, { n:'Добрынинская', l:['5'] }, { n:'Октябрьская', l:['5','6'] },
    { n:'Проспект Мира', l:['5','6'] },
    { n:'Третьяковская', l:['6','8'] }, { n:'Китай-город', l:['6','7'] }, { n:'Тургеневская', l:['6'] },
    { n:'Пушкинская', l:['7'] }, { n:'Кузнецкий мост', l:['7'] }, { n:'Баррикадная', l:['7'] }, { n:'Улица 1905 года', l:['7'] }, { n:'Таганская', l:['5','7'] },
    { n:'Марксистская', l:['8'] },
    { n:'Чеховская', l:['9'] }, { n:'Цветной бульвар', l:['9'] }, { n:'Полянка', l:['9'] },
    { n:'Трубная', l:['10'] }, { n:'Сретенский бульвар', l:['10'] }, { n:'Чкаловская', l:['10'] },
  ],
  spb: [
    { n:'Невский проспект', l:['sp2'] }, { n:'Гостиный двор', l:['sp3'] }, { n:'Площадь Восстания', l:['sp1'] },
    { n:'Маяковская', l:['sp3'] }, { n:'Сенная площадь', l:['sp2'] }, { n:'Адмиралтейская', l:['sp5'] },
    { n:'Василеостровская', l:['sp3'] }, { n:'Петроградская', l:['sp2'] }, { n:'Чернышевская', l:['sp1'] },
    { n:'Технологический институт', l:['sp1','sp2'] }, { n:'Спортивная', l:['sp5'] },
  ],
};
// города, где есть метро (для них показываем станцию вместо города)
const PD_CITY_METRO = { 'Москва':'msk', 'Санкт-Петербург':'spb', 'Казань':'kzn', 'Екатеринбург':'ekb', 'Новосибирск':'nsk', 'Нижний Новгород':'nn', 'Самара':'sam' };
// быстрый индекс «станция → линии» (по всем городам)
const PD_METRO_INDEX = {};
Object.values(PD_METRO).forEach((arr) => arr.forEach((s) => { if (!PD_METRO_INDEX[s.n]) PD_METRO_INDEX[s.n] = s.l; }));
const pdMetroLines = (station) => PD_METRO_INDEX[station] || [];

// типы цветов (как «по типу/составу» на цветочных сайтах)
const PD_FLOWERS = ['Розы','Пионовидные розы','Пионы','Тюльпаны','Гортензия','Хризантемы','Эустома','Ранункулюсы','Альстромерия','Лилии','Герберы','Ирисы','Орхидеи','Гвоздики','Полевые','Зелень и эвкалипт'];
// набор для фильтров — самые частые типы
const PD_FLOWER_FILTERS = ['Розы','Пионовидные розы','Пионы','Тюльпаны','Гортензия','Хризантемы','Эустома','Ранункулюсы','Альстромерия','Лилии','Полевые'];

// маркер линий метро (цветные кружки)
function MetroDots({ lines, size = 8 }) {
  const ls = (lines && lines.length ? lines : ['9']);
  return (
    <span className="pd-mdots" aria-hidden="true">
      {ls.slice(0, 3).map((l, i) => (
        <i key={i} style={{ background: PD_METRO_LINES[l] || '#A1A2A3', width: size, height: size }} />
      ))}
    </span>
  );
}
// метка станции метро: цветные кружки линий + «м. Станция»
function MetroLabel({ station, lines, className, dotSize }) {
  return (
    <span className={'pd-metro' + (className ? ' ' + className : '')}>
      <MetroDots lines={lines || pdMetroLines(station)} size={dotSize || 8} />
      <span className="pd-metro-n">м.&nbsp;{station}</span>
    </span>
  );
}

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
        {d.roseLabel && (
          <span style={{ position: 'absolute', left: 8, bottom: 8, background: 'rgba(35,32,27,.82)', color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '.01em', padding: '4px 9px', borderRadius: 999, backdropFilter: 'blur(4px)' }}>{d.roseLabel}</span>
        )}
      </div>
      <div className="pd-card-body">
        <div className="pd-price-row">
          <span className="pd-price">{pdMoney(d.price)}</span>
          <span className="pd-size">Размер {d.size}</span>
        </div>
        <div className="pd-meta">
          {d.metro
            ? <MetroLabel station={d.metro} dotSize={7} />
            : <><Ic.pin className="pd-i14" fill="none" stroke="currentColor" /><span className="pd-district">{d.district}</span></>}
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
        <span className="pd-brand"><Mark size={21} />Передарим</span>
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

const PD_THEMES = [
  { id: 'a', name: 'A · «Воздух»', sub: 'светлый минимал · Golos Text · терракота' },
  { id: 'b', name: 'B · «Тёплый»', sub: 'уютный · Lora + Nunito Sans · карамель' },
  { id: 'c', name: 'C · «Сад»',    sub: 'свежий tech · Manrope · ботаническая зелень' },
];

export {
  PdFeed,
  Card as PdCard, Avatar as PdAvatar, Freshness as PdFreshness, LikeBtn as PdLikeBtn,
  SectionHead as PdSectionHead, TopBar as PdTopBar, BottomNav as PdBottomNav,
  Ic as PdIc, Heart as PdHeart, pdMoney, PD_FRESH, PD_LIKED,
  MetroDots as PdMetroDots, MetroLabel as PdMetroLabel, pdMetroLines,
  PD_METRO, PD_METRO_LINES, PD_METRO_INDEX, PD_CITY_METRO,
  PD_FLOWERS, PD_FLOWER_FILTERS, PD_FRESH_META, PD_THEMES
};
