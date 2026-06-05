// @rebloom/canon · marketing/landing.jsx
// Converted from design source pd-land.jsx (single source of truth — edited ONLY by Claude Design).
import React from "react";
import "../styles/canon.css";
import { PdCard, PdIc, PD_FRESH, PD_LIKED } from "../feed/feed";
import { PdBtn } from "../primitives/kit";

// ── brand mark «Соцветие» — лепестки = currentColor (подхватывают тему), центр янтарный
const PETAL = 'M50 50C38 41 36 21 50 10C64 21 62 41 50 50Z';
const Mark = ({ size=22, center='#E8A93B', style, className, title='Передарим' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={title} style={{ display:'block', flex:'none', ...style }}>
    {[0,72,144,216,288].map((a)=><path key={a} d={PETAL} fill="currentColor" transform={`rotate(${a} 50 50)`}/>)}
    <circle cx="50" cy="50" r="8" fill={center}/>
  </svg>
);

// pd-land.jsx — маркетинговый лендинг «Передарим» (peredarim.ru).
// Двусторонний C2C-рынок: продавец — главный CTA, покупатель — сильный второй.
// Адаптив: platform = 'desktop' | 'web'(mobile). Exports: window.PdLanding

const PdLanding = (function () {
  const Ic = PdIc, Btn = PdBtn, Card = PdCard;
  const FRESH = PD_FRESH || [], LIKED = PD_LIKED || [];
  const HERO_IMG = 'img/1561181286-d3fee7d55364.jpg';

  const CITIES = [
    { id: 'msk', name: 'Москва', count: 128 },
    { id: 'spb', name: 'Санкт-Петербург', count: 86 },
    { id: 'kzn', name: 'Казань', count: 41 },
    { id: 'ekb', name: 'Екатеринбург', count: 33 },
    { id: 'nsk', name: 'Новосибирск', count: 27 },
  ];
  const CATALOG = [...FRESH.slice(0, 4), ...LIKED.slice(0, 4)].slice(0, 8);

  const G = {
    apple: <svg viewBox="0 0 24 24" width="34" height="34" fill="#fff"><path d="M16.4 12.6c0-2.2 1.8-3.3 1.9-3.3-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.6.8-3.3.8-.7 0-1.7-.8-2.8-.8-1.5 0-2.8.8-3.6 2.1-1.5 2.7-.4 6.6 1.1 8.8.7 1 1.5 2.2 2.6 2.2 1 0 1.4-.7 2.7-.7 1.2 0 1.6.7 2.7.6 1.1 0 1.8-1 2.5-2 .8-1.2 1.1-2.3 1.1-2.4-.1 0-2.1-.8-2.1-3.1zM14.3 6.1c.6-.7 1-1.7.9-2.7-.8 0-1.9.6-2.5 1.3-.5.6-1 1.6-.9 2.6.9.1 1.8-.5 2.5-1.2z"/></svg>,
    play: <svg viewBox="0 0 24 24" width="33" height="33"><path d="M4 3.5v17l9.5-8.5L4 3.5z" fill="#2BD27A"/><path d="M13.5 12 4 3.5l11.5 6.4L13.5 12z" fill="#FFC93A"/><path d="M13.5 12 4 20.5l11.5-6.4L13.5 12z" fill="#FF5A5F"/><path d="m15.5 9.9 4 2.1-4 2.2L13.5 12l2-2.1z" fill="#3B9DFF"/></svg>,
    rustore: <svg viewBox="0 0 24 24" width="34" height="34"><rect x="3" y="3" width="18" height="18" rx="5" fill="#0A6CFF"/><path d="M8 7.5h5.2c1.7 0 2.8 1 2.8 2.6 0 1.2-.7 2.1-1.8 2.4l2 4H14l-1.8-3.7H10V16.5H8v-9zm2 1.7v2.4h2.9c.7 0 1.1-.5 1.1-1.2 0-.7-.4-1.2-1.1-1.2H10z" fill="#fff"/></svg>,
    gallery: <svg viewBox="0 0 24 24" width="34" height="34"><circle cx="12" cy="12" r="9" fill="#E33B3B"/><path d="M9.2 8.5c0 2.3 1.2 4 2.8 4s2.8-1.7 2.8-4M8 13.8c.9 1.6 2.3 2.7 4 2.7s3.1-1.1 4-2.7" stroke="#fff" strokeWidth="1.4" fill="none" strokeLinecap="round"/></svg>,
  };
  const STORES = [
    { id: 'ios', glyph: G.apple, small: 'Загрузите в', name: 'App Store' },
    { id: 'play', glyph: G.play, small: 'Доступно в', name: 'Google Play' },
    { id: 'rustore', glyph: G.rustore, small: 'Установите из', name: 'RuStore' },
    { id: 'gallery', glyph: G.gallery, small: 'Откройте в', name: 'AppGallery' },
  ];

  // line icons
  const Leaf = (p) => <svg viewBox="0 0 24 24" {...p}><path d="M5 19c0-7 5-12 14-13 0 9-5 13-11 13-1.5 0-3 .5-3 .5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 19c2-4 5-6 9-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
  const Tag = (p) => <svg viewBox="0 0 24 24" {...p} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12 12 20l-8-8V4h8z"/><circle cx="8.5" cy="8.5" r="1.3" fill="currentColor" stroke="none"/></svg>;
  const Shield = (p) => <svg viewBox="0 0 24 24" {...p} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3 5 6v5c0 4.2 2.9 7.5 7 9 4.1-1.5 7-4.8 7-9V6z"/><path d="m9.2 12 1.9 1.9 3.7-3.7"/></svg>;
  const Pin = (p) => <svg viewBox="0 0 24 24" {...p} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>;
  const Search = (p) => <svg viewBox="0 0 24 24" {...p} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/></svg>;
  const Bell = (p) => <svg viewBox="0 0 24 24" {...p} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z"/><path d="M10 19a2 2 0 0 0 4 0"/></svg>;
  const Chev = (p) => <svg viewBox="0 0 24 24" {...p} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>;
  const Menu = (p) => <svg viewBox="0 0 24 24" {...p} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>;
  const Star = (p) => <svg viewBox="0 0 24 24" {...p} fill="currentColor"><path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.6 1-5.8L3.5 9.7l5.9-.9z"/></svg>;

  function CityChips({ cls }) {
    return (
      <div className={cls}>
        {CITIES.map((c, i) => (
          <button key={c.id} className={'pdl-citychip' + (i === 0 ? ' on' : '')}>{c.name}<span className="n">{c.count}</span></button>
        ))}
      </div>
    );
  }

  // ── HERO ───────────────────────────────────────────────────────────
  function Hero({ desk }) {
    const text = (
      <div className="pdl-herotext">
        <p className="pdl-kicker"><Leaf className="lf" />Вторая жизнь букетов</p>
        {/* H1 — ведём ОБЕ аудитории, выгода покупателя в заголовке, идея — в лиде */}
        <h1 className="pdl-h1">Свежие букеты <em>в 2–3 раза дешевле</em> цветочного магазина</h1>
        <p className="pdl-lead">Кому-то подарили цветы, а они ещё свежие. Вместо мусорного ведра букет находит новый дом. Вы передаёте свой букет дальше или забираете чужой за полцены.</p>
        <div className="pdl-cta">
          {/* главный CTA — продавец */}
          <Btn variant="primary" lg icon={Ic && Ic.plus}>Опубликовать букет</Btn>
          {/* сильный второй — покупатель */}
          <Btn variant="secondary" lg>Смотреть букеты</Btn>
        </div>
        <div className="pdl-trust">
          <span className="t"><Tag />В 2–3 раза дешевле</span>
          <span className="sep" />
          <span className="t"><Shield />Оплата при встрече</span>
          <span className="sep" />
          <span className="t"><Pin />Рядом с домом</span>
        </div>
      </div>
    );
    const vis = (
      <div className="pdl-herovis">
        <div className="pdl-herophoto">
          <img src={HERO_IMG} alt="Свежий букет тюльпанов" loading="lazy" />
          <span className="pdl-livecount"><span className="pdl-livedot" />128 свежих букетов сейчас</span>
          <div className="pdl-pricetag">
            <div><div className="old">2 490 ₽ в цветочной</div><div className="new">от 690 ₽</div></div>
            <div className="save"><b>−60%</b><span>дешевле</span></div>
          </div>
        </div>
      </div>
    );
    return (
      <section className="pdl-hero">
        <div className="pdl-hero-in">{text}{vis}</div>
      </section>
    );
  }

  // ── CATALOG ────────────────────────────────────────────────────────
  const C_POOL = [...FRESH, ...LIKED];
  const C_PRICE = { any: () => true, lt1k: (p) => p < 1000, '1k2k': (p) => p >= 1000 && p <= 2000, gt2k: (p) => p > 2000 };
  const C_RATING = { any: () => true, '45': (r) => r >= 4.5, '48': (r) => r >= 4.8, '5': (r) => r >= 5 };
  const FILTERS = {
    price: { label: 'Цена', opts: [['lt1k', 'до 1 000 ₽'], ['1k2k', '1 000–2 000 ₽'], ['gt2k', '2 000 ₽+']] },
    fresh: { label: 'Свежесть', opts: [['today', 'Сегодня'], ['d1_2', '1–2 дня']] },
    rating: { label: 'Рейтинг продавца', opts: [['45', '4,5+'], ['48', '4,8+'], ['5', '5,0']] },
  };
  function Catalog({ desk }) {
    const [sel, setSel] = React.useState({ price: 'any', fresh: 'any', rating: 'any' });
    const toggle = (k, v) => setSel((s) => ({ ...s, [k]: s[k] === v ? 'any' : v }));
    const reset = () => setSel({ price: 'any', fresh: 'any', rating: 'any' });
    const activeN = Object.values(sel).filter((v) => v !== 'any').length;
    const filtered = React.useMemo(() => C_POOL.filter((d) =>
      C_PRICE[sel.price](d.price) &&
      (sel.fresh === 'any' || d.fresh === sel.fresh) &&
      C_RATING[sel.rating](d.seller.r)
    ), [sel]);
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
            <CityChips cls="pdl-cities" />
            <span className="pdl-catcount"><span className="d" />{filtered.length} свежих букетов в Москве</span>
          </div>
          <div className="pdl-filters">
            {Object.entries(FILTERS).map(([k, g]) => (
              <div className="pdl-fgroup" key={k}>
                <span className="pdl-flabel">{g.label}</span>
                {g.opts.map(([val, lab]) => (
                  <button key={val} className={'pdl-fchip' + (sel[k] === val ? ' on' : '')} onClick={() => toggle(k, val)}>
                    {k === 'rating' && <span className="st">★</span>}{lab}
                  </button>
                ))}
              </div>
            ))}
            {activeN > 0 && <button className="pdl-freset" onClick={reset}>Сбросить{activeN > 1 ? ` (${activeN})` : ''}</button>}
          </div>
          {shown.length === 0 ? (
            <p className="pdl-catnote">По этим фильтрам ничего нет, смягчите цену или свежесть.</p>
          ) : (
            <div className="pdl-catgrid">
              {shown.map((d, i) => <div className="pd-rise" key={d.id || i}><Card d={d} variant="grid" /></div>)}
            </div>
          )}
          <div className="pdl-catall">
            <a href="Передарим · Каталог букетов.html">Весь каталог букетов<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
          </div>
        </div>
      </section>
    );
  }

  // ── HOW IT WORKS + ADVANTAGES ──────────────────────────────────────
  function How({ desk }) {
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
            <div className="pdl-step"><span className="pdl-seller-tag">продавец</span><div className="pdl-stepn">2</div><h3>Выставили за полцены</h3><p>Сфотографировали, указали свежесть и район. Публикация бесплатная.</p></div>
            <div className="pdl-step"><span className="pdl-seller-tag">покупатель</span><div className="pdl-stepn">3</div><h3>Кто-то рядом забрал</h3><p>Покупатель пишет, договаривается и забирает букет рядом с вами. Платит при встрече.</p></div>
          </div>

          <div className="pdl-vals">
            <div className="pdl-val"><div className="ic"><Tag /></div><div><b>В 2–3 раза дешевле</b><span>свежие букеты по-честному</span></div></div>
            <div className="pdl-val"><div className="ic g"><Shield /></div><div><b>Оплата при встрече</b><span>платите, когда забрали букет</span></div></div>
            <div className="pdl-val"><div className="ic gold"><Pin /></div><div><b>Рядом с домом</b><span>самовывоз у дома или метро</span></div></div>
          </div>
        </div>
      </section>
    );
  }

  // ── ESCROW ─────────────────────────────────────────────────────────
  function Escrow({ desk }) {
    const HeartHands = (p) => <svg viewBox="0 0 24 24" {...p} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20.3C12 20.3 3.4 14.9 3.4 8.7 3.4 6 5.5 4 8 4 9.8 4 11.3 5 12 6.3 12.7 5 14.2 4 16 4 18.5 4 20.6 6 20.6 8.7 20.6 14.9 12 20.3 12 20.3Z"/></svg>;
    return (
      <section className="pdl-sec pdl-escrow" id="safety">
        <div className="pdl-in">
          <div className="pdl-sechead l">
            <p className="pdl-kicker"><Shield style={{ width: 14, height: 14 }} />Безопасная сделка</p>
            <h2 className="pdl-h2">Покупатель ничего не платит вперёд — оплата при встрече</h2>
            <p className="pdl-sub">Главный страх в сделках между незнакомцами — обман. Поэтому деньги никуда не уходят заранее: вы платите, только когда увидели букет вживую.</p>
          </div>
          <div className="pdl-escrow-grid">
            <div className="pdl-eflow"><span className="en">1</span><div><h4>Написали и договорились</h4><p>Покупатель пишет продавцу в чате и договаривается о времени и месте встречи.</p></div></div>
            <div className="pdl-eflow"><span className="en">2</span><div><h4>Встретились и проверили</h4><p>Самовывоз рядом — у дома или метро. Покупатель видит букет вживую.</p></div></div>
            <div className="pdl-eflow"><span className="en">3</span><div><h4>Оплата при встрече</h4><p>Расплачиваетесь на месте, наличными или переводом продавцу. Никаких предоплат.</p></div></div>
          </div>
          <div className="pdl-esafe">
            <HeartHands />
            <p><b>Доверие — на отзывах.</b> Рейтинг и реальные отзывы показывают надёжных продавцов, а модерация убирает обманщиков. Что-то не так — можно пожаловаться.</p>
          </div>
        </div>
      </section>
    );
  }

  // ── OBJECTIONS ─────────────────────────────────────────────────────
  function Objections({ desk }) {
    return (
      <section className="pdl-sec alt" id="faq">
        <div className="pdl-in">
          <div className="pdl-sechead">
            <p className="pdl-kicker" style={{ justifyContent: 'center' }}><Leaf className="lf" />Честно о главном</p>
            <h2 className="pdl-h2">А вдруг…</h2>
          </div>
          <div className="pdl-obj">
            <div className="pdl-objc"><h3 className="pdl-objq"><span className="qm">?</span>…букет уже подвявший?</h3><p>У каждого букета стоит дата и метка свежести, а на фото видно состояние. Берёте только то, что куплено сегодня или вчера, и платите соответственно.</p></div>
            <div className="pdl-objc"><h3 className="pdl-objq"><span className="qm">?</span>…продавец не придёт на встречу?</h3><p>Вы ничего не платите вперёд: оплата только при встрече, когда увидели букет. Рейтинг и отзывы показывают надёжных продавцов.</p></div>
            <div className="pdl-objc"><h3 className="pdl-objq"><span className="qm">?</span>…неловко продавать подарок?</h3><p>Вы не выбрасываете и не наживаетесь. Вы отдаёте красивое тому, кому оно нужно, и возвращаете часть денег. Это бережно, а не стыдно.</p></div>
          </div>
        </div>
      </section>
    );
  }

  // ── APP ────────────────────────────────────────────────────────────
  function App({ desk }) {
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

  // ── FINAL CTA (split) ──────────────────────────────────────────────
  function Final({ desk }) {
    return (
      <section className="pdl-sec pdl-final">
        <div className="pdl-in">
          <div className="pdl-finalgrid">
            <div className="pdl-finalc seller">
              <span className="role">Вам подарили букет</span>
              <h3>Подарите ему вторую жизнь</h3>
              <p>Не выбрасывайте красивое и живое. Выставьте за минуту и верните часть денег, букет достанется кому-то рядом. Публикация бесплатная.</p>
              <Btn variant="onbrand" lg icon={Ic && Ic.plus}>Опубликовать букет</Btn>
            </div>
            <div className="pdl-finalc buyer">
              <span className="role">Нужны свежие цветы</span>
              <h3>Свежий букет за полцены</h3>
              <p>К свиданию, в подарок или просто себе домой: те же свежие цветы рядом с вами и в 2–3 раза дешевле магазина.</p>
              <Btn variant="primary" lg>Смотреть букеты в Москве</Btn>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ── FOOTER ─────────────────────────────────────────────────────────
  const FOOT_COLS = [
    { h: 'Сервис', links: ['О «Передариме»', 'Как это работает', 'Вторая жизнь букетов', 'Блог'] },
    { h: 'Покупателям', links: ['Свежие букеты рядом', 'Как проходит сделка', 'Самовывоз рядом'] },
    { h: 'Продавцам', links: ['Опубликовать букет', 'Правила публикации', 'Как продавать', 'Самозанятым'] },
    { h: 'Помощь', links: ['Поддержка', 'Вопросы и ответы', 'Безопасность', 'Связаться с нами'] },
  ];
  function Footer({ desk }) {
    return (
      <footer className="pdl-foot">
        <div className="pdl-in">
          <div className="pdl-foot-top">
            <div className="pdl-foot-brand">
              <span className="pdl-foot-mark"><Mark size={26} /><span className="w">Передарим</span></span>
              <p className="pdl-foot-tag">Сервис передаривания свежих букетов. Дарим цветам вторую жизнь и продаём их в 2–3 раза дешевле магазина.</p>
            </div>
            <div className="pdl-foot-cols">
              {FOOT_COLS.map((c) => (
                <div className="pdl-foot-col" key={c.h}><h4>{c.h}</h4><ul>{c.links.map((l) => <li key={l}><a href="#" onClick={(e) => e.preventDefault()}>{l}</a></li>)}</ul></div>
              ))}
            </div>
          </div>
          <div className="pdl-foot-legal">
            <div className="links">
              <a href="#" onClick={(e) => e.preventDefault()}>Пользовательское соглашение</a>
              <a href="#" onClick={(e) => e.preventDefault()}>Политика конфиденциальности</a>
              <a href="#" onClick={(e) => e.preventDefault()}>Согласие на обработку данных</a>
            </div>
            <p>© 2026 «Передарим». Сервис не является цветочным магазином и не продаёт новые букеты. Обработка персональных данных по 152-ФЗ.</p>
          </div>
        </div>
      </footer>
    );
  }

  // ── REVIEWS ────────────────────────────────────────────────────────
  const REVIEWS = [
    { q: 'Забрала пионы за 690 ₽ в соседнем дворе, в магазине такие же по 2 000. Свежие, простояли восемь дней.', n: 'Алина', city: 'Москва', role: 'buyer', c: '#CF5638' },
    { q: 'Подарили огромный букет на юбилей, а дома ставить некуда. Выставила за полцены, забрали через час. Приятно, что не выбросила.', n: 'Ольга', city: 'Санкт-Петербург', role: 'seller', c: '#5B8C68' },
    { q: 'Боялся развода, но договорились в чате, встретились у метро — заплатил, когда увидел букет. Всё честно.', n: 'Тимур', city: 'Казань', role: 'buyer', c: '#C98A1E' },
    { q: 'Опубликовать вышло реально за минуту с телефона. Покупатель забрал в тот же вечер.', n: 'Марина', city: 'Москва', role: 'seller', c: '#23201B' },
    { q: 'Взяла букет к свиданию за треть цены. Никто и не догадался, что он «передаренный».', n: 'Вера', city: 'Екатеринбург', role: 'buyer', c: '#5B8C68' },
    { q: 'Сначала было неловко продавать подарок. Но кому-то он по-настоящему пригодился, это куда приятнее мусорки.', n: 'Никита', city: 'Москва', role: 'seller', c: '#CF5638' },
  ];
  function Reviews({ desk }) {
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
                <span className="pdl-rev-stars">{[0,1,2,3,4].map(s => <Star key={s} />)}</span>
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

  // ── NAV (два состояния: гость / авторизован) ───────────────────────
  function Nav({ desk, auth }) {
    if (auth) {
      return (
        <header className="pdl-nav">
          <div className="pdl-nav-in">
            <span className="pdl-brand"><Mark size={24} />Передарим</span>
            <div className="pdl-nav-mid">
              <button className="pdl-nav-city"><Pin className="pin" />Москва<Chev /></button>
              <div className="pdl-nav-search"><Search /><span>Поиск свежих букетов в Москве</span></div>
            </div>
            <div className="pdl-navright">
              <button className="pdl-nav-icon" aria-label="Уведомления"><Bell /></button>
              <button className="pdl-nav-icon pdl-nav-fav" aria-label="Избранное"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20.3C12 20.3 3.4 14.9 3.4 8.7 3.4 6 5.5 4 8 4 9.8 4 11.3 5 12 6.3 12.7 5 14.2 4 16 4 18.5 4 20.6 6 20.6 8.7 20.6 14.9 12 20.3 12 20.3Z"/></svg></button>
              <button className="pdl-nav-ava" aria-label="Профиль">М</button>
              <span className="pdl-nav-cta"><Btn variant="primary" icon={Ic && Ic.plus}>Продать букет</Btn></span>
              <button className="pdl-nav-burger" aria-label="Меню"><Menu /></button>
            </div>
          </div>
        </header>
      );
    }
    // гость
    return (
      <header className="pdl-nav">
        <div className="pdl-nav-in">
          <span className="pdl-brand"><Mark size={24} />Передарим</span>
          <nav className="pdl-navlinks">
            <a href="Передарим · Каталог букетов.html">Каталог</a>
            <a href="#how">Как работает</a>
            <a href="#safety">Безопасность</a>
            <a href="#app">Приложение</a>
          </nav>
          <div className="pdl-navright">
            <button className="pdl-nav-login">Войти</button>
            <span className="pdl-nav-cta"><Btn variant="primary" icon={Ic && Ic.plus}>Опубликовать букет</Btn></span>
            <button className="pdl-nav-burger" aria-label="Меню"><Menu /></button>
          </div>
        </div>
      </header>
    );
  }

  // отдельная обёртка для превью хедера (гость / авторизован)
  function LandingNav({ auth = false, desk = true }) {
    return (
      <div className={'pd-root pd-web pdl' + (desk ? ' pdl--desk' : '')} data-pd-theme="a" style={{ minHeight: 0 }}>
        <Nav desk={desk} auth={auth} />
      </div>
    );
  }

  var PdLandingComp = function PdLanding({ platform = 'desktop', auth = false }) {
    const desk = platform === 'desktop';
    return (
      <div className={'pd-root pd-web pdl' + (desk ? ' pdl--desk' : '')} data-pd-theme="a">
        <Nav desk={desk} auth={auth} />
        <main className="pd-scroll pdw-scroll">
          <Hero desk={desk} />
          <Catalog desk={desk} />
          <How desk={desk} />
          <Reviews desk={desk} />
          <Escrow desk={desk} />
          <Objections desk={desk} />
          <App desk={desk} />
          <Final desk={desk} />
          <Footer desk={desk} />
        </main>
      </div>
    );
  };
  PdLandingComp._navComp = LandingNav;
  PdLandingComp._footComp = Footer;
  return PdLandingComp;
})();

const PdLandingNav = PdLanding._navComp;
const PdLandingFooter = PdLanding._footComp;
export { PdLanding, PdLandingNav, PdLandingFooter };
