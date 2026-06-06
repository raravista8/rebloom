'use client';
// Главная = маркетинговый лендинг + ЖИВОЙ каталог с фильтрами (canon PdLanding,
// ./marketing). Composed from canon `.pdl-*` classes (allowed — we don't fork canon
// src) with live data wired into the catalog block (/api/feed) + real routes on every
// CTA. Responsive by canon @container queries (.pdl, 900px) — one markup, phone+desktop.
import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { PdBtn } from '@/components/canon';
import { IconPlus } from '@/components/icons';
import BouquetCard from '@/components/feed/BouquetCard';
import SiteFooter from '@/components/marketing/SiteFooter';
import NavCity from '@/components/marketing/NavCity';
import { api, ApiError } from '@/lib/api';
import { cityName } from '@/lib/cities';
import type { ListingCard, Paginated } from '@/lib/types';

/* ── «Соцветие» mark + line icons (presentation SVG, copied from canon source) ── */
const PETAL = 'M50 50C38 41 36 21 50 10C64 21 62 41 50 50Z';
const Mark = ({ size = 24, center = '#E8A93B' }: { size?: number; center?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label="Передарим" style={{ display: 'block', flex: 'none' }}>
    {[0, 72, 144, 216, 288].map((a) => <path key={a} d={PETAL} fill="currentColor" transform={`rotate(${a} 50 50)`} />)}
    <circle cx="50" cy="50" r="8" fill={center} />
  </svg>
);
type IP = { className?: string; style?: React.CSSProperties };
const S = (p: IP) => ({ ...p, fill: 'none', stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, viewBox: '0 0 24 24' });
const Leaf = (p: IP) => <svg {...p} viewBox="0 0 24 24"><path d="M5 19c0-7 5-12 14-13 0 9-5 13-11 13-1.5 0-3 .5-3 .5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><path d="M5 19c2-4 5-6 9-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
const Tag = (p: IP) => <svg {...S(p)}><path d="M20 12 12 20l-8-8V4h8z" /><circle cx="8.5" cy="8.5" r="1.3" fill="currentColor" stroke="none" /></svg>;
const Shield = (p: IP) => <svg {...S(p)}><path d="M12 3 5 6v5c0 4.2 2.9 7.5 7 9 4.1-1.5 7-4.8 7-9V6z" /><path d="m9.2 12 1.9 1.9 3.7-3.7" /></svg>;
const Search = (p: IP) => <svg {...S(p)}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.2-3.2" /></svg>;
const Bell = (p: IP) => <svg {...S(p)}><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" /><path d="M10 19a2 2 0 0 0 4 0" /></svg>;
const Menu = (p: IP) => <svg {...S(p)}><path d="M4 7h16M4 12h16M4 17h16" /></svg>;
const Star = (p: IP) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.6 1-5.8L3.5 9.7l5.9-.9z" /></svg>;
const HeartHands = (p: IP) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20.3C12 20.3 3.4 14.9 3.4 8.7 3.4 6 5.5 4 8 4 9.8 4 11.3 5 12 6.3 12.7 5 14.2 4 16 4 18.5 4 20.6 6 20.6 8.7 20.6 14.9 12 20.3 12 20.3Z" /></svg>;
const Arrow = () => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;

/* store badges */
const G = {
  apple: <svg viewBox="0 0 24 24" width="34" height="34" fill="#fff"><path d="M16.4 12.6c0-2.2 1.8-3.3 1.9-3.3-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.6.8-3.3.8-.7 0-1.7-.8-2.8-.8-1.5 0-2.8.8-3.6 2.1-1.5 2.7-.4 6.6 1.1 8.8.7 1 1.5 2.2 2.6 2.2 1 0 1.4-.7 2.7-.7 1.2 0 1.6.7 2.7.6 1.1 0 1.8-1 2.5-2 .8-1.2 1.1-2.3 1.1-2.4-.1 0-2.1-.8-2.1-3.1zM14.3 6.1c.6-.7 1-1.7.9-2.7-.8 0-1.9.6-2.5 1.3-.5.6-1 1.6-.9 2.6.9.1 1.8-.5 2.5-1.2z" /></svg>,
  play: <svg viewBox="0 0 24 24" width="33" height="33"><path d="M4 3.5v17l9.5-8.5L4 3.5z" fill="#2BD27A" /><path d="M13.5 12 4 3.5l11.5 6.4L13.5 12z" fill="#FFC93A" /><path d="M13.5 12 4 20.5l11.5-6.4L13.5 12z" fill="#FF5A5F" /><path d="m15.5 9.9 4 2.1-4 2.2L13.5 12l2-2.1z" fill="#3B9DFF" /></svg>,
  rustore: <svg viewBox="0 0 24 24" width="34" height="34"><rect x="3" y="3" width="18" height="18" rx="5" fill="#0A6CFF" /><path d="M8 7.5h5.2c1.7 0 2.8 1 2.8 2.6 0 1.2-.7 2.1-1.8 2.4l2 4H14l-1.8-3.7H10V16.5H8v-9zm2 1.7v2.4h2.9c.7 0 1.1-.5 1.1-1.2 0-.7-.4-1.2-1.1-1.2H10z" fill="#fff" /></svg>,
  gallery: <svg viewBox="0 0 24 24" width="34" height="34"><circle cx="12" cy="12" r="9" fill="#E33B3B" /><path d="M9.2 8.5c0 2.3 1.2 4 2.8 4s2.8-1.7 2.8-4M8 13.8c.9 1.6 2.3 2.7 4 2.7s3.1-1.1 4-2.7" stroke="#fff" strokeWidth="1.4" fill="none" strokeLinecap="round" /></svg>,
};
const STORES = [
  { id: 'ios', glyph: G.apple, small: 'Загрузите в', name: 'App Store' },
  { id: 'play', glyph: G.play, small: 'Доступно в', name: 'Google Play' },
  { id: 'rustore', glyph: G.rustore, small: 'Установите из', name: 'RuStore' },
  { id: 'gallery', glyph: G.gallery, small: 'Откройте в', name: 'AppGallery' },
];

/* ── NAV (guest) — real routes ── */
function Nav() {
  return (
    <header className="pdl-nav">
      <div className="pdl-nav-in">
        <Link href="/" className="pdl-brand" style={{ textDecoration: 'none', color: 'inherit' }}><Mark size={24} />Передарим</Link>
        <NavCity />
        <nav className="pdl-navlinks">
          <a href="#catalog">Каталог</a>
          <a href="#how">Как работает</a>
          <a href="#safety">Безопасность</a>
          <a href="#app">Приложение</a>
        </nav>
        <div className="pdl-navright">
          <Link href="/login" className="pdl-nav-login" style={{ textDecoration: 'none' }}>Войти</Link>
          <span className="pdl-nav-cta"><Link href="/sell" style={{ textDecoration: 'none' }}><PdBtn variant="primary" icon={IconPlus}>Опубликовать букет</PdBtn></Link></span>
          <Link href="/login" className="pdl-nav-burger" aria-label="Меню"><Menu /></Link>
        </div>
      </div>
    </header>
  );
}

/* ── HERO — canonical static hero (canon 0.6.2 §0.1). Static photo/price/count by
   design: a live-feed image rendered an empty card pre-launch (READ FIRST diagnosis). ── */
function Hero() {
  return (
    <section className="pdl-hero">
      <div className="pdl-hero-in">
        <div className="pdl-herotext">
          <p className="pdl-kicker"><Leaf className="lf" />Люди передаривают свои букеты</p>
          <h1 className="pdl-h1">Свежие букеты <em>напрямую от людей</em>, <span style={{ whiteSpace: 'nowrap' }}>в 2–3 раза</span> дешевле магазина</h1>
          <p className="pdl-lead"><b>Букет подарили, он порадовал и уже не нужен.</b> Вместо мусорки свежие цветы за полцены находят нового хозяина. Выставьте свой за минуту или заберите чужой.</p>
          <div className="pdl-cta">
            <Link href="/sell" style={{ textDecoration: 'none' }}><PdBtn variant="primary" lg icon={IconPlus}>Опубликовать букет</PdBtn></Link>
            <a href="#catalog" style={{ textDecoration: 'none' }}><PdBtn variant="secondary" lg>Смотреть букеты</PdBtn></a>
          </div>
          <div className="pdl-trust">
            <span className="t"><Tag />В 2–3 раза дешевле</span>
            <span className="sep" />
            <span className="t"><Shield />Оплата при встрече</span>
          </div>
        </div>
        <div className="pdl-herovis">
          <div className="pdl-herophoto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/hero-lacybird.png" alt="Свежий букет роз и гортензий" loading="lazy" />
            <span className="pdl-livecount"><span className="pdl-livedot" />128 букетов от людей рядом</span>
            <div className="pdl-pricetag">
              <div><div className="old">17 200 ₽ в цветочной</div><div className="new">от 4 500 ₽</div></div>
              <div className="save"><b>−74%</b><span>дешевле</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── CATALOG — LIVE data + working filters ── */
type Sel = { price: 'any' | 'lt1k' | '1k2k' | 'gt2k'; fresh: 'any' | 'today' | 'd1_2'; rating: 'any' | '45' | '48' | '5' };
const FILTERS = {
  price: { label: 'Цена', opts: [['lt1k', 'до 1 000 ₽'], ['1k2k', '1 000–2 000 ₽'], ['gt2k', '2 000 ₽+']] },
  fresh: { label: 'Свежесть', opts: [['today', 'Сегодня'], ['d1_2', '1–2 дня']] },
  rating: { label: 'Рейтинг продавца', opts: [['45', '4,5+'], ['48', '4,8+'], ['5', '5,0']] },
} as const;
const priceOk = (k: Sel['price'], kop: number) => {
  const r = kop / 100;
  return k === 'any' || (k === 'lt1k' ? r < 1000 : k === '1k2k' ? r >= 1000 && r <= 2000 : r > 2000);
};
const ratingOk = (k: Sel['rating'], v: number) => k === 'any' || (k === '45' ? v >= 4.5 : k === '48' ? v >= 4.8 : v >= 5);

function Catalog({ pool, status, cityId, reload }: { pool: ListingCard[]; status: 'loading' | 'ready' | 'error'; cityId: string; reload: () => void }) {
  const [sel, setSel] = useState<Sel>({ price: 'any', fresh: 'any', rating: 'any' });
  const toggle = (k: keyof Sel, v: string) => setSel((s) => ({ ...s, [k]: s[k] === v ? 'any' : (v as never) }));
  const reset = () => setSel({ price: 'any', fresh: 'any', rating: 'any' });
  const activeN = Object.values(sel).filter((v) => v !== 'any').length;
  const filtered = useMemo(
    () => pool.filter((d) => priceOk(sel.price, d.price_kopecks) && (sel.fresh === 'any' || d.freshness === sel.fresh) && ratingOk(sel.rating, d.seller.seller_rating)),
    [pool, sel],
  );
  const shown = filtered.slice(0, 8);
  return (
    <section className="pdl-sec alt" id="catalog">
      <div className="pdl-in">
        <div className="pdl-sechead l">
          <p className="pdl-kicker"><Leaf className="lf" />Живой каталог</p>
          <h2 className="pdl-h2">Свежие букеты рядом, прямо сейчас</h2>
          <p className="pdl-sub">Метка «Сегодня» значит, что букет куплен сегодня. Свежесть тает, поэтому лучшие разбирают за часы.</p>
        </div>
        <div className="pdl-catbar">
          <span className="pdl-catcount"><span className="d" />{filtered.length} свежих букетов в {cityName(cityId)}</span>
        </div>
        <div className="pdl-filters">
          {Object.entries(FILTERS).map(([k, g]) => (
            <div className="pdl-fgroup" key={k}>
              <span className="pdl-flabel">{g.label}</span>
              {g.opts.map(([val, lab]) => (
                <button key={val} className={'pdl-fchip' + (sel[k as keyof Sel] === val ? ' on' : '')} onClick={() => toggle(k as keyof Sel, val)}>
                  {k === 'rating' && <span className="st">★</span>}{lab}
                </button>
              ))}
            </div>
          ))}
          {activeN > 0 && <button className="pdl-freset" onClick={reset}>Сбросить{activeN > 1 ? ` (${activeN})` : ''}</button>}
        </div>
        {status === 'loading' ? (
          <div className="pdl-catgrid">{Array.from({ length: 8 }, (_, i) => <div key={i} className="pd-sk" style={{ height: 230, borderRadius: 16 }} />)}</div>
        ) : status === 'error' ? (
          <p className="pdl-catnote">Не удалось загрузить каталог. <button className="pd-link" onClick={reload}>Повторить</button></p>
        ) : shown.length === 0 ? (
          <p className="pdl-catnote">{pool.length === 0 ? `В ${cityName(cityId)} пока нет букетов — будьте первым.` : 'По этим фильтрам ничего нет, смягчите цену или свежесть.'}</p>
        ) : (
          <div className="pdl-catgrid">
            {shown.map((l) => <div className="pd-rise" key={l.id}><BouquetCard listing={l} variant="grid" /></div>)}
          </div>
        )}
        <div className="pdl-catall">
          <Link href="/search">Весь каталог букетов<Arrow /></Link>
        </div>
      </div>
    </section>
  );
}

/* ── static marketing sections (canon copy) ── */
function How() {
  return (
    <section className="pdl-sec" id="how">
      <div className="pdl-in">
        <div className="pdl-sechead">
          <p className="pdl-kicker" style={{ justifyContent: 'center' }}><Leaf className="lf" />Как это работает</p>
          <h2 className="pdl-h2">Три шага, и букет продолжает радовать</h2>
          <p className="pdl-sub">Путь продавца: выставить букет проще, чем кажется</p>
        </div>
        <div className="pdl-steps">
          <div className="pdl-step"><span className="pdl-seller-tag">продавец</span><div className="pdl-stepn">1</div><h3>Получили букет</h3><p>Вам подарили цветы, но дома их уже некуда ставить, а они ещё свежие и живые.</p></div>
          <div className="pdl-step"><span className="pdl-seller-tag">продавец</span><div className="pdl-stepn">2</div><h3>Выставили за полцены</h3><p>Сфотографировали, указали свежесть и район. Публикация бесплатна — площадка денег не удерживает.</p></div>
          <div className="pdl-step"><span className="pdl-seller-tag">покупатель</span><div className="pdl-stepn">3</div><h3>Кто-то рядом забрал</h3><p>Покупатель пишет, договаривается о встрече и забирает букет рядом с вами. Оплата — при встрече.</p></div>
        </div>
        <div className="pdl-vals">
          <div className="pdl-val"><div className="ic"><Tag /></div><div><b>В 2–3 раза дешевле</b><span>свежие букеты по-честному</span></div></div>
          <div className="pdl-val"><div className="ic g"><Shield /></div><div><b>Спокойная сделка</b><span>оплата при встрече, без предоплаты</span></div></div>
        </div>
      </div>
    </section>
  );
}
const REVIEWS = [
  { q: 'Забрала пионы за 690 ₽ в соседнем дворе, в магазине такие же по 2 000. Свежие, простояли восемь дней.', n: 'Алина', city: 'Москва', role: 'buyer', c: '#CF5638' },
  { q: 'Подарили огромный букет на юбилей, а дома ставить некуда. Выставила за полцены, забрали через час. Приятно, что не выбросила.', n: 'Ольга', city: 'Санкт-Петербург', role: 'seller', c: '#5B8C68' },
  { q: 'Боялся развода, но деньги списались и висели, пока я не забрал букет. Продавец отдал, всё честно.', n: 'Тимур', city: 'Казань', role: 'buyer', c: '#C98A1E' },
  { q: 'Опубликовать вышло реально за минуту с телефона. Выплата пришла на карту в тот же вечер.', n: 'Марина', city: 'Москва', role: 'seller', c: '#23201B' },
  { q: 'Взяла букет к свиданию за треть цены. Никто и не догадался, что он «передаренный».', n: 'Вера', city: 'Екатеринбург', role: 'buyer', c: '#5B8C68' },
  { q: 'Сначала было неловко продавать подарок. Но кому-то он по-настоящему пригодился, это куда приятнее мусорки.', n: 'Никита', city: 'Москва', role: 'seller', c: '#CF5638' },
];
function Reviews() {
  return (
    <section className="pdl-sec alt" id="reviews">
      <div className="pdl-in">
        <div className="pdl-sechead">
          <p className="pdl-kicker" style={{ justifyContent: 'center' }}><Leaf className="lf" />Отзывы</p>
          <h2 className="pdl-h2">Букеты находят новый дом каждый день</h2>
        </div>
        <div className="pdl-revs">
          {REVIEWS.map((r, i) => (
            <div className="pdl-rev" key={i}>
              <span className="pdl-rev-stars">{[0, 1, 2, 3, 4].map((s) => <Star key={s} />)}</span>
              <p className="pdl-rev-q">«{r.q}»</p>
              <div className="pdl-rev-who">
                <span className="pdl-rev-ava" style={{ background: r.c }}>{r.n[0]}</span>
                <div className="pdl-rev-meta"><b>{r.n}</b><span>{r.city}</span></div>
                <span className={'pdl-rev-role ' + r.role}>{r.role === 'seller' ? 'продавец' : 'покупатель'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
function Escrow() {
  return (
    <section className="pdl-sec pdl-escrow" id="safety">
      <div className="pdl-in">
        <div className="pdl-sechead l">
          <p className="pdl-kicker"><Shield style={{ width: 14, height: 14 }} />Спокойная сделка</p>
          <h2 className="pdl-h2">Вы платите только когда забрали букет — при встрече</h2>
          <p className="pdl-sub">Главный страх в сделках между незнакомцами — обман. Поэтому предоплаты нет: договариваетесь в чате и платите наличными или переводом прямо при встрече.</p>
        </div>
        <div className="pdl-escrow-grid">
          <div className="pdl-eflow"><span className="en">1</span><div><h4>Договорились в чате</h4><p>Покупатель пишет продавцу, договаривается о месте и времени самовывоза рядом.</p></div></div>
          <div className="pdl-eflow"><span className="en">2</span><div><h4>Встретились и забрали</h4><p>Самовывоз у дома или метро. Покупатель видит, что цветы свежие, и забирает букет.</p></div></div>
          <div className="pdl-eflow"><span className="en">3</span><div><h4>Оплата при встрече</h4><p>Наличными или переводом — напрямую продавцу, без предоплаты. Площадка денег не касается.</p></div></div>
        </div>
        <div className="pdl-esafe">
          <HeartHands />
          <p><b>Если что-то пошло не так</b> и букет не отдали или он оказался не таким, деньги возвращаются покупателю. Спор решает поддержка, а не продавец.</p>
        </div>
      </div>
    </section>
  );
}
function Objections() {
  return (
    <section className="pdl-sec alt" id="faq">
      <div className="pdl-in">
        <div className="pdl-sechead">
          <p className="pdl-kicker" style={{ justifyContent: 'center' }}><Leaf className="lf" />Честно о главном</p>
          <h2 className="pdl-h2">А вдруг…</h2>
        </div>
        <div className="pdl-obj">
          <div className="pdl-objc"><h3 className="pdl-objq"><span className="qm">?</span>…букет уже подвявший?</h3><p>У каждого букета стоит дата и метка свежести, а на фото видно состояние. Берёте только то, что куплено сегодня или вчера, и платите соответственно.</p></div>
          <div className="pdl-objc"><h3 className="pdl-objq"><span className="qm">?</span>…вдруг обманут с оплатой?</h3><p>Предоплаты нет. Вы платите наличными или переводом только при встрече — когда букет уже у вас в руках. Не подошёл, просто не платите.</p></div>
          <div className="pdl-objc"><h3 className="pdl-objq"><span className="qm">?</span>…неловко продавать подарок?</h3><p>Вы не выбрасываете и не наживаетесь. Вы отдаёте красивое тому, кому оно нужно, и возвращаете часть денег. Это бережно, а не стыдно.</p></div>
        </div>
      </div>
    </section>
  );
}
function AppSec() {
  return (
    <section className="pdl-sec pdl-app" id="app">
      <div className="pdl-in">
        <div className="pdl-app-in">
          <div>
            <p className="pdl-kicker"><Leaf className="lf" />Приложение</p>
            <h2 className="pdl-h2">Узнавайте о свежих букетах рядом первыми</h2>
            <p className="pdl-sub">Свежий букет по соседству живёт считанные часы. Включите push, и приложение сообщит, как только рядом появится подходящий, пока его не забрали.</p>
          </div>
          <div className="pdl-badges">
            {STORES.map((s) => (
              <a key={s.id} className="pdl-badge" href="#" onClick={(e) => e.preventDefault()}>
                <span className="glyph">{s.glyph}</span>
                <span className="txt"><small>{s.small}</small><b>{s.name}</b></span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
function Final() {
  return (
    <section className="pdl-sec pdl-final">
      <div className="pdl-in">
        <div className="pdl-finalgrid">
          <div className="pdl-finalc seller">
            <span className="role">Вам подарили букет</span>
            <h3>Подарите ему вторую жизнь</h3>
            <p>Не выбрасывайте красивое и живое. Выставьте за минуту и верните часть денег, букет достанется кому-то рядом. Публикация бесплатна, оплата — при встрече.</p>
            <Link href="/sell" style={{ textDecoration: 'none' }}><PdBtn variant="primary" lg icon={IconPlus}>Опубликовать букет</PdBtn></Link>
          </div>
          <div className="pdl-finalc buyer">
            <span className="role">Нужны свежие цветы</span>
            <h3>Свежий букет за полцены</h3>
            <p>К свиданию, в подарок или просто себе домой: те же свежие цветы рядом с вами и в 2–3 раза дешевле магазина.</p>
            <a href="#catalog" style={{ textDecoration: 'none' }}><PdBtn variant="secondary" lg>Смотреть букеты</PdBtn></a>
          </div>
        </div>
      </div>
    </section>
  );
}
// Footer extracted to the shared SiteFooter (real links only) — imported above.

export default function LandingHome({ cityId }: { cityId: string }) {
  const [pool, setPool] = useState<ListingCard[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const [f, l] = await Promise.all([
        api.get<Paginated<ListingCard>>(`/feed?city_id=${encodeURIComponent(cityId)}&section=fresh&limit=12`),
        api.get<Paginated<ListingCard>>(`/feed?city_id=${encodeURIComponent(cityId)}&section=liked&limit=12`),
      ]);
      const seen = new Set<string>();
      const merged = [...f.items, ...l.items].filter((x) => (seen.has(x.id) ? false : seen.add(x.id)));
      setPool(merged);
      setStatus('ready');
    } catch (e) {
      setStatus(e instanceof ApiError ? 'error' : 'error');
    }
  }, [cityId]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="pd-root pd-web pdl" data-pd-theme="a">
      <Nav />
      <main className="pd-scroll pdw-scroll">
        <Hero />
        <Catalog pool={pool} status={status} cityId={cityId} reload={load} />
        <How />
        <Reviews />
        <Escrow />
        <Objections />
        <AppSec />
        <Final />
        <SiteFooter />
      </main>
    </div>
  );
}
