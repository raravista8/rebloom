// @rebloom/canon · marketing/seo.jsx
// Converted from design source pd-seo.jsx (single source of truth — edited ONLY by Claude Design).
import React from "react";
import "../styles/canon.css";
import { PdCard, PD_FRESH, PD_LIKED } from "../feed/feed";
import { PdBtn } from "../primitives/kit";
import { PdLandingFooter } from "./landing";

// pd-seo.jsx — SEO-страницы «Передарим»: гео-лендинг города, «Безопасная сделка», блог.
// Под ядро peredarim.ru: перехват «дешёвые/свежие цветы рядом», самовывоз-only, гео ×10.
// Адаптив: platform = 'desktop' | 'web'(mobile).
// Exports: PdGeoPage, PdSafeDeal, PdBlogIndex, PdBlogArticle, PdSeoMeta, PD_GEO_CITIES, nbsp

const Btn = PdBtn, Card = PdCard, Footer = PdLandingFooter;
const FRESH = PD_FRESH || [], LIKED = PD_LIKED || [];
// Канонические маршруты (web/). В Claude Design это были html-файлы превью.
const LAND = "/";
const CAT = "/catalog";

// ── brand mark «Соцветие» — лепестки = currentColor, центр янтарный
const PETAL = 'M50 50C38 41 36 21 50 10C64 21 62 41 50 50Z';
const Mark = ({ size = 22, center = '#E8A93B', style, className, title = 'Передарим' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={title} style={{ display: 'block', flex: 'none', ...style }}>
    {[0, 72, 144, 216, 288].map((a) => <path key={a} d={PETAL} fill="currentColor" transform={`rotate(${a} 50 50)`} />)}
    <circle cx="50" cy="50" r="8" fill={center} />
  </svg>
);

// ── nbsp() — SSR-safe типограф (анти-«висячие» предлоги). Чистая string→string,
// в отличие от клиентского DOM-обходчика. web/ применяет на сервере/билде.
// Склеивает короткие слова/предлоги/союзы с следующим словом неразрывным пробелом
// и приклеивает тире/среднюю точку к предыдущему слову. (См. SEO §4.1.)
const NBSP_SHORT = /(^|[\s(«"])([А-Яа-яЁёA-Za-z]{1,2}|без|для|под|над|при|про|или|что|как|так|чтобы|если|когда|после|перед|около|через|между|чем)\s+/g;
export function nbsp(s) {
  if (!s) return s;
  let out = String(s);
  for (let i = 0; i < 2; i++) out = out.replace(NBSP_SHORT, (_, a, w) => `${a}${w}\u00A0`);
  out = out.replace(/(\d)\s+(?=\S)/g, '$1\u00A0');        // числа не отрывать
  out = out.replace(/\s+([—–])/g, '\u00A0$1');             // тире не начинает строку
  out = out.replace(/\s+(·)/g, '\u00A0$1');                // средняя точка
  return out;
}

// ── icons (локальные, без внешних зависимостей) ───────────────────
const Leaf = (p) => <svg viewBox="0 0 24 24" {...p}><path d="M5 19c0-7 5-12 14-13 0 9-5 13-11 13-1.5 0-3 .5-3 .5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><path d="M5 19c2-4 5-6 9-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
const Tag = (p) => <svg viewBox="0 0 24 24" {...p} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12 12 20l-8-8V4h8z" /><circle cx="8.5" cy="8.5" r="1.3" fill="currentColor" stroke="none" /></svg>;
const Shield = (p) => <svg viewBox="0 0 24 24" {...p} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3 5 6v5c0 4.2 2.9 7.5 7 9 4.1-1.5 7-4.8 7-9V6z" /><path d="m9.2 12 1.9 1.9 3.7-3.7" /></svg>;
const Pin = (p) => <svg viewBox="0 0 24 24" {...p} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg>;
const Search = (p) => <svg viewBox="0 0 24 24" {...p} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.2-3.2" /></svg>;
const Chev = (p) => <svg viewBox="0 0 24 24" {...p} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>;
const Menu = (p) => <svg viewBox="0 0 24 24" {...p} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>;
const Plus = (p) => <svg viewBox="0 0 24 24" {...p} fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>;
const Arrow = (p) => <svg viewBox="0 0 24 24" {...p} fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
const HeartHands = (p) => <svg viewBox="0 0 24 24" {...p} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20.3C12 20.3 3.4 14.9 3.4 8.7 3.4 6 5.5 4 8 4 9.8 4 11.3 5 12 6.3 12.7 5 14.2 4 16 4 18.5 4 20.6 6 20.6 8.7 20.6 14.9 12 20.3 12 20.3Z" /></svg>;

// ── данные городов (склонения — это ДАННЫЕ, не алгоритм). web/ заменяет на свой справочник.
const CITIES_FULL = [
  { id: 'moskva', nom: 'Москва', loc: 'Москве', gen: 'Москвы', count: 128, metro: true,
    districts: [['Патриаршие', 14], ['Хамовники', 11], ['Арбат', 9], ['Тверской', 12], ['Пресня', 10], ['Якиманка', 7], ['Замоскворечье', 8], ['Чистые пруды', 7]] },
  { id: 'spb', nom: 'Санкт-Петербург', loc: 'Санкт-Петербурге', gen: 'Санкт-Петербурга', count: 86, metro: true,
    districts: [['Центральный', 12], ['Петроградка', 9], ['Васильевский остров', 8], ['Адмиралтейский', 7], ['Московский', 8], ['Приморский', 6], ['Невский', 7], ['Купчино', 5]] },
  { id: 'novosibirsk', nom: 'Новосибирск', loc: 'Новосибирске', gen: 'Новосибирска', count: 27, metro: true,
    districts: [['Центральный', 6], ['Академгородок', 4], ['Заельцовский', 3], ['Октябрьский', 4], ['Ленинский', 3], ['Железнодорожный', 3], ['Дзержинский', 2], ['Калининский', 2]] },
  { id: 'ekb', nom: 'Екатеринбург', loc: 'Екатеринбурге', gen: 'Екатеринбурга', count: 33, metro: true,
    districts: [['Центр', 7], ['Уралмаш', 4], ['Втузгородок', 3], ['Юго-Западный', 5], ['Пионерский', 4], ['Эльмаш', 3], ['Ботаника', 4], ['Автовокзал', 3]] },
  { id: 'kazan', nom: 'Казань', loc: 'Казани', gen: 'Казани', count: 41, metro: true,
    districts: [['Вахитовский', 8], ['Ново-Савиновский', 6], ['Советский', 5], ['Приволжский', 6], ['Кировский', 4], ['Московский', 4], ['Азино', 5], ['Авиастроительный', 3]] },
  { id: 'nn', nom: 'Нижний Новгород', loc: 'Нижнем Новгороде', gen: 'Нижнего Новгорода', count: 22, metro: true,
    districts: [['Нижегородский', 5], ['Канавинский', 3], ['Автозаводский', 4], ['Сормовский', 3], ['Советский', 3], ['Ленинский', 2], ['Приокский', 2]] },
  { id: 'chelyabinsk', nom: 'Челябинск', loc: 'Челябинске', gen: 'Челябинска', count: 18, metro: false,
    districts: [['Центральный', 4], ['Калининский', 3], ['Курчатовский', 3], ['Ленинский', 2], ['Советский', 2], ['Тракторозаводский', 2], ['Металлургический', 2]] },
  { id: 'krasnoyarsk', nom: 'Красноярск', loc: 'Красноярске', gen: 'Красноярска', count: 16, metro: false,
    districts: [['Центральный', 3], ['Советский', 3], ['Октябрьский', 3], ['Железнодорожный', 2], ['Свердловский', 2], ['Кировский', 2], ['Ленинский', 1]] },
  { id: 'samara', nom: 'Самара', loc: 'Самаре', gen: 'Самары', count: 19, metro: true,
    districts: [['Ленинский', 3], ['Самарский', 3], ['Октябрьский', 3], ['Промышленный', 4], ['Кировский', 2], ['Советский', 2], ['Железнодорожный', 2]] },
  { id: 'ufa', nom: 'Уфа', loc: 'Уфе', gen: 'Уфы', count: 14, metro: false,
    districts: [['Кировский', 3], ['Ленинский', 2], ['Октябрьский', 3], ['Советский', 2], ['Орджоникидзевский', 2], ['Калининский', 1], ['Дёма', 1]] },
];
const OCCASIONS = [
  'Розы недорого', 'Пионы недорого', 'Букет на день рождения', 'Букет на свидание', 'Букет в подарок', 'Цветы себе домой',
];

// ── shared guest nav ──────────────────────────────────────────────
function SeoNav({ cityNom = 'Москва', cityIn = 'Москве' }) {
  return (
    <header className="pdl-nav">
      <div className="pdl-nav-in">
        <a href={LAND} className="pdl-brand" style={{ textDecoration: 'none' }}><Mark size={24} />Передарим</a>
        <div className="pdl-nav-mid">
          <button className="pdl-nav-city"><Pin className="pin" style={{ width: 16, height: 16 }} />{cityNom}<Chev style={{ width: 14, height: 14 }} /></button>
          <div className="pdl-nav-search"><Search style={{ width: 18, height: 18 }} /><span>Поиск свежих букетов в {cityIn}</span></div>
        </div>
        <div className="pdl-navright">
          <button className="pdl-nav-login">Войти</button>
          <span className="pdl-nav-cta"><Btn variant="primary" icon={Plus}>Опубликовать букет</Btn></span>
          <button className="pdl-nav-burger" aria-label="Меню"><Menu /></button>
        </div>
      </div>
    </header>
  );
}

function Shell({ desk, cityNom = 'Москва', cityIn = 'Москве', children }) {
  return (
    <div className={'pd-root pd-web pds pdl' + (desk ? ' pds--desk pdl--desk' : '')} data-pd-theme="a">
      <SeoNav cityNom={cityNom} cityIn={cityIn} />
      <main className="pd-scroll pdw-scroll">
        {children}
        {Footer ? <Footer desk={desk} /> : null}
      </main>
    </div>
  );
}

// видимая «плашка» SEO-мета (превью контракта мета-данных внутри макета)
function PdSeoMeta({ url, title, description, h1, alt, label = 'SEO-мета страницы' }) {
  return (
    <div className="pds-metaplate">
      <span className="lbl">{label}</span>
      <dl>
        <dt>URL</dt><dd>{url}</dd>
        <dt>Title</dt><dd>{title}</dd>
        {description ? <><dt>Description</dt><dd>{description}</dd></> : null}
        {h1 ? <><dt>H1</dt><dd>{h1}</dd></> : null}
        {alt ? <><dt>alt фото</dt><dd>{alt}</dd></> : null}
      </dl>
    </div>
  );
}

// ── catalog data для гео-страницы (превью; web/ берёт реальные карточки города) ──
const POOL = [...FRESH, ...LIKED];
const FRESHES = ['today', 'd1_2', 'd3_plus'];
function makeItems(cityNom, districts) {
  return POOL.slice(0, 12).map((d, i) => ({
    ...d, _id: 'g' + i,
    price: Math.round((d.price * (i % 3 === 0 ? 0.78 : i % 3 === 1 ? 1 : 1.35)) / 10) * 10,
    fresh: i < 6 ? 'today' : FRESHES[(i + 1) % 3],
    district: cityNom + ' · ' + districts[i % districts.length][0],
  }));
}
const PRICE = { any: () => true, lt1k: (p) => p < 1000, '1k2k': (p) => p >= 1000 && p <= 2000, gt2k: (p) => p > 2000 };

function GeoCatalog({ cityNom = 'Москва', cityLoc = 'Москве', districts }) {
  const [price, setPrice] = React.useState('any');
  const [fresh, setFresh] = React.useState('any');
  const items = React.useMemo(() => makeItems(cityNom, districts), [cityNom, districts]);
  const shown = React.useMemo(() => items.filter((d) => PRICE[price](d.price) && (fresh === 'any' || d.fresh === fresh)), [items, price, fresh]);
  const Chip = ({ on, onClick, children }) => <button className={'pds-fchip' + (on ? ' on' : '')} onClick={onClick}>{children}</button>;
  return (
    <div>
      <div className="pds-catbar">
        <span className="pds-catcount"><span className="d" /><span>{`${shown.length} свежих букетов в ${cityLoc} сейчас`}</span></span>
      </div>
      <div className="pds-filters">
        <Chip on={price === 'lt1k'} onClick={() => setPrice(price === 'lt1k' ? 'any' : 'lt1k')}>до 1 000 ₽</Chip>
        <Chip on={price === '1k2k'} onClick={() => setPrice(price === '1k2k' ? 'any' : '1k2k')}>1 000–2 000 ₽</Chip>
        <Chip on={price === 'gt2k'} onClick={() => setPrice(price === 'gt2k' ? 'any' : 'gt2k')}>2 000 ₽+</Chip>
        <Chip on={fresh === 'today'} onClick={() => setFresh(fresh === 'today' ? 'any' : 'today')}>Сегодня</Chip>
        <Chip on={fresh === 'd1_2'} onClick={() => setFresh(fresh === 'd1_2' ? 'any' : 'd1_2')}>1–2 дня</Chip>
      </div>
      {shown.length === 0
        ? <p className="pds-catnote">По этим фильтрам сейчас ничего нет — смягчите цену или свежесть.</p>
        : <div className="pds-grid">{shown.map((d) => <div className="pd-rise" key={d._id}><Card d={d} variant="grid" /></div>)}</div>}
      <div className="pds-catall"><a href={CAT}>Весь каталог букетов в {cityLoc}<Arrow style={{ width: 18, height: 18 }} /></a></div>
    </div>
  );
}

// ── 1. ГЕО-СТРАНИЦА ГОРОДА ────────────────────────────────────────
function PdGeoPage({ platform = 'desktop', data = CITIES_FULL[0] }) {
  const desk = platform === 'desktop';
  const city = data.nom, cityLoc = data.loc, cityGen = data.gen, districts = data.districts, metro = data.metro;
  const nearMetro = metro ? ' или у метро' : '';
  const pickupShort = metro ? 'у дома или метро' : 'рядом с домом';
  return (
    <Shell desk={desk} cityNom={city} cityIn={cityLoc}>
      <section className="pds-top">
        <div className="pds-in">
          <p className="pds-crumbs"><a href={LAND}>Главная</a> · {city}</p>
          <p className="pds-eyebrow"><Leaf />{`Свежие букеты · ${city} · самовывоз`}</p>
          <h1 className="pds-h1">{`Дешёвые свежие букеты в\u00A0${cityLoc}\u00A0— `}<em>самовывоз рядом</em></h1>
          <p className="pds-intro">Те же свежие цветы, что и в магазине, только <b>в 2–3 раза дешевле</b>. {`Кому-то в\u00A0${cityLoc} подарили букет`} — он ещё живой, и человек отдаёт его за полцены вместо мусорки. Вы находите подходящий рядом с домом{nearMetro} и забираете сами. Без доставки и наценок — самовывоз в своём районе.</p>
          <div className="pds-trust">
            <span className="t"><Tag style={{ color: 'var(--pd-primary)' }} />В 2–3 раза дешевле</span>
            <span className="t"><Shield />Деньги под защитой эскроу</span>
            <span className="t"><Pin />Самовывоз {pickupShort}</span>
          </div>
        </div>
      </section>

      <section className="pds-sec">
        <div className="pds-in">
          <div className="pds-sechead">
            <h2 className="pds-h2">Свежие букеты рядом — прямо сейчас</h2>
            <p className="pds-h2-sub">Метка «Сегодня» значит, что букет куплен сегодня. Свежесть тает, поэтому лучшие разбирают за часы.</p>
          </div>
          <GeoCatalog cityNom={city} cityLoc={cityLoc} districts={districts} />
        </div>
      </section>

      <section className="pds-sec alt">
        <div className="pds-in">
          <div className="pds-sechead">
            <h2 className="pds-h2">Букеты по районам {cityGen}</h2>
            <p className="pds-h2-sub">Заберите букет в своём районе — рядом с домом{nearMetro}, без поездок через весь город.</p>
          </div>
          <div className="pds-links">
            {districts.map(([n, c]) => (
              <a className="pds-linkcard" key={n} href="#" onClick={(e) => e.preventDefault()}><b>{n}</b><span>{c}</span></a>
            ))}
          </div>
        </div>
      </section>

      <section className="pds-sec">
        <div className="pds-in">
          <div className="pds-sechead">
            <h2 className="pds-h2">Недорогие букеты под повод</h2>
            <p className="pds-h2-sub">К свиданию, на день рождения или просто себе — подберите свежий букет за полцены.</p>
          </div>
          <div className="pds-chips">
            {OCCASIONS.map((o) => <a className="pds-chip" key={o} href="#" onClick={(e) => e.preventDefault()}>{o}</a>)}
          </div>
        </div>
      </section>

      <section className="pds-sec alt">
        <div className="pds-in">
          <div className="pds-sechead">
            <h2 className="pds-h2">Почему так дешевле и безопасно</h2>
          </div>
          <div className="pds-faq">
            <div className="pds-faqitem"><h3 className="pds-faqq">Почему свежие букеты стоят в 2–3 раза дешевле?</h3><p className="pds-faqa">Это не магазин. Букет уже кому-то подарили, он постоял день и теперь не нужен хозяину. Человек отдаёт его за полцены, лишь бы цветы не выбросили. Вы платите за свежие цветы, а не за витрину и аренду.</p></div>
            <div className="pds-faqitem"><h3 className="pds-faqq">Цветы точно свежие?</h3><p className="pds-faqa">У каждого букета есть дата и метка свежести, а на фото видно состояние. Берите то, что куплено сегодня или вчера — и платите соответственно.</p></div>
            <div className="pds-faqitem"><h3 className="pds-faqq">Как забрать букет в {cityLoc}?</h3><p className="pds-faqa">Только самовывоз. После оплаты в чате сделки откроется район и точка встречи — обычно двор{metro ? ' или станция метро' : ' или район'} рядом с продавцом. Доставки нет, поэтому и цена честная.</p></div>
            <div className="pds-faqitem"><h3 className="pds-faqq">А если продавец обманет?</h3><p className="pds-faqa">Не сможет. Деньги замораживаются на счёте сервиса и уходят продавцу только после того, как вы забрали букет. Не забрали — вернём оплату. <a href="/bezopasnaya-sdelka" style={{ color: 'var(--pd-primary)', fontWeight: 600 }}>Как работает безопасная сделка →</a></p></div>
          </div>
        </div>
      </section>

      <section className="pds-sec">
        <div className="pds-in">
          <div className="pds-sechead">
            <h2 className="pds-h2">Свежие букеты в других городах</h2>
            <p className="pds-h2-sub">«Передарим» работает в 10 крупнейших городах России — выберите свой.</p>
          </div>
          <div className="pds-links">
            {CITIES_FULL.map((c) => (
              <a className={'pds-linkcard'} key={c.id} href={'/' + c.id} style={c.id === data.id ? { borderColor: 'var(--pd-primary)' } : null}><b>{c.nom}</b><span>{c.count}</span></a>
            ))}
          </div>
        </div>
      </section>
    </Shell>
  );
}

// ── 2. БЕЗОПАСНАЯ СДЕЛКА ──────────────────────────────────────────
function PdSafeDeal({ platform = 'desktop' }) {
  const desk = platform === 'desktop';
  return (
    <Shell desk={desk}>
      <section className="pds-top">
        <div className="pds-in">
          <p className="pds-crumbs"><a href={LAND}>Главная</a> · Безопасность · Безопасная сделка</p>
          <p className="pds-eyebrow"><Shield style={{ color: 'var(--pd-fresh)' }} />Безопасная сделка</p>
          <h1 className="pds-h1">Деньги придут продавцу <em>только после того, как вы забрали букет</em></h1>
          <p className="pds-intro">Главный страх при покупке у незнакомца — что заплатишь и останешься без букета. На «Передариме» это невозможно: деньги покупателя замораживаются на счёте сервиса и ждут, пока цветы не окажутся у него в руках. Это и есть безопасная сделка — эскроу.</p>
        </div>
      </section>

      <section className="pds-sec alt">
        <div className="pds-in">
          <div className="pds-sechead">
            <h2 className="pds-h2">Как проходит сделка</h2>
            <p className="pds-h2-sub">Три шага — деньги под защитой на каждом из них.</p>
          </div>
          <div className="pds-flow">
            <div className="pds-step"><span className="en">1</span><h4>Покупатель платит</h4><p>Деньги списываются и замораживаются на счёте сервиса, а не у продавца. Продавец видит, что оплата прошла, но получить её пока не может.</p></div>
            <div className="pds-step"><span className="en">2</span><h4>Забирает букет</h4><p>Самовывоз рядом — у дома или метро. Покупатель встречает продавца, видит, что цветы свежие, и забирает букет.</p></div>
            <div className="pds-step"><span className="en">3</span><h4>Деньги уходят продавцу</h4><p>Только после подтверждения получения, за вычетом 5% комиссии сервиса. До этого момента вся сумма под защитой.</p></div>
          </div>
          <div className="pds-safe">
            <HeartHands />
            <p><b>Если что-то пошло не так</b> — букет не отдали или он оказался не таким, как на фото, — деньги возвращаются покупателю. Спор решает поддержка «Передарима», а не продавец.</p>
          </div>
        </div>
      </section>

      <section className="pds-sec">
        <div className="pds-in">
          <div className="pds-prose">
            <h2 className="pds-h2" style={{ marginBottom: 16 }}>Что такое эскроу простыми словами</h2>
            <p>Эскроу — это «сейф» между покупателем и продавцом. Когда вы оплачиваете букет, деньги не уходят напрямую другому человеку. Они попадают на специальный счёт сервиса и просто лежат там замороженными.</p>
            <p>Продавец видит: оплата есть, можно отдавать букет. Но снять деньги он не может, пока вы не подтвердите, что всё получили. Так обе стороны защищены — продавец уверен в оплате, покупатель уверен, что не потеряет деньги.</p>
            <h3>Когда деньги уходят продавцу</h3>
            <ul>
              <li>Вы забрали букет и нажали «Подтвердить получение» в сделке.</li>
              <li>Либо прошёл срок ожидания и вы не открыли спор — сделка закрывается автоматически.</li>
            </ul>
            <h3>Когда деньги возвращаются вам</h3>
            <ul>
              <li>Продавец не вышел на встречу или не отдал букет.</li>
              <li>Букет оказался не таким, как в объявлении, — вы открываете спор с фото.</li>
              <li>Поддержка встаёт на вашу сторону по итогам разбора.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="pds-sec alt">
        <div className="pds-in">
          <div className="pds-sechead"><h2 className="pds-h2">Частые вопросы</h2></div>
          <div className="pds-faq">
            <div className="pds-faqitem"><h3 className="pds-faqq">Кто хранит мои деньги до сделки?</h3><p className="pds-faqa">Деньги лежат на номинальном счёте платёжного провайдера, а не на личной карте продавца. Сервис лишь даёт команду «отдать» или «вернуть» по итогам сделки.</p></div>
            <div className="pds-faqitem"><h3 className="pds-faqq">Сколько берёт сервис?</h3><p className="pds-faqa">5% с продажи и только когда букет продан. Публикация бесплатна. Для покупателя цена в объявлении — финальная.</p></div>
            <div className="pds-faqitem"><h3 className="pds-faqq">Что считается доказательством в споре?</h3><p className="pds-faqa">Фото букета при встрече, переписка в чате сделки и история статусов. Поэтому всё общение по сделке лучше вести внутри приложения.</p></div>
            <div className="pds-faqitem"><h3 className="pds-faqq">Можно ли договориться и оплатить мимо сервиса?</h3><p className="pds-faqa">Можно, но тогда защиты нет — это обычная передача денег незнакомцу. Эскроу работает, только если оплата прошла через «Передарим».</p></div>
          </div>
        </div>
      </section>

      <section className="pds-sec">
        <div className="pds-in">
          <div className="pds-cta">
            <div className="tx"><h3>Заберите свежий букет за полцены</h3><p>Свежие цветы рядом с вами, под защитой безопасной сделки. Самовывоз в своём районе.</p></div>
            <Btn variant="primary" lg icon={Arrow}>Смотреть букеты</Btn>
          </div>
        </div>
      </section>
    </Shell>
  );
}

// ── 3. БЛОГ ───────────────────────────────────────────────────────
const ARTICLES = [
  { id: 'kuda-det-buket', tag: 'Продавцу', img: '1567418938902-aa650a3eb346', title: 'Куда деть подаренный букет вместо мусорки', excerpt: 'Подарили цветы, а дома ставить некуда? Пять способов дать букету вторую жизнь — и вернуть часть денег.', read: '4 мин' },
  { id: 'cvety-posle-prazdnika', tag: 'Уход', img: '1581938165093-050aeb5ef218', title: 'Что делать с цветами после праздника', excerpt: 'Большой букет отжил своё на столе, но цветы ещё свежие. Как не выбросить красивое и кому оно нужно.', read: '5 мин' },
  { id: 'prodlit-zhizn-buketu', tag: 'Уход', img: '1561181286-d3fee7d55364', title: 'Как продлить жизнь срезанному букету', excerpt: 'Простые приёмы, от подрезки стеблей до воды и места: чтобы букет простоял на несколько дней дольше.', read: '6 мин' },
];

function PdBlogIndex({ platform = 'desktop' }) {
  const desk = platform === 'desktop';
  return (
    <Shell desk={desk}>
      <section className="pds-top">
        <div className="pds-in">
          <p className="pds-crumbs"><a href={LAND}>Главная</a> · Блог</p>
          <p className="pds-eyebrow"><Leaf />Блог «Передарима»</p>
          <h1 className="pds-h1">Что делать с букетом, который <em>уже подарили</em></h1>
          <p className="pds-intro">Короткие заметки для тех, кому подарили цветы: как продлить им жизнь, что сделать вместо мусорки и как отдать букет дальше за полцены.</p>
        </div>
      </section>
      <section className="pds-sec">
        <div className="pds-in">
          <div className="pds-blog-grid">
            {ARTICLES.map((a) => (
              <a className="pds-blogcard" key={a.id} href={'/blog/' + a.id}>
                <div className="ph"><img src={`img/${a.img}.jpg`} alt={a.title} loading="lazy" /></div>
                <div className="bd">
                  <span className="tag">{a.tag}</span>
                  <h3>{a.title}</h3>
                  <p>{a.excerpt}</p>
                  <span className="rd">Читать · {a.read}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
      <section className="pds-sec alt">
        <div className="pds-in">
          <div className="pds-cta">
            <div className="tx"><h3>Вам подарили букет?</h3><p>Не выбрасывайте красивое и живое. Выставьте за минуту — букет достанется кому-то рядом, а вы вернёте часть денег.</p></div>
            <Btn variant="primary" lg icon={Plus}>Опубликовать букет</Btn>
          </div>
        </div>
      </section>
    </Shell>
  );
}

// одна открытая статья (шаблон)
function PdBlogArticle({ platform = 'desktop', article = ARTICLES[0] }) {
  const desk = platform === 'desktop';
  const a = article;
  return (
    <Shell desk={desk}>
      <section className="pds-top">
        <div className="pds-in pds-art-head">
          <p className="pds-crumbs"><a href={LAND}>Главная</a> · <a href="/blog">Блог</a> · Подаренный букет</p>
          <p className="pds-eyebrow"><Leaf />{a.tag}</p>
          <h1 className="pds-h1" style={{ fontSize: desk ? 42 : 30 }}>Куда деть подаренный букет вместо мусорки</h1>
          <div className="pds-art-meta"><span>«Передарим»</span><span className="dot" /><span>5 июня 2026</span><span className="dot" /><span>{a.read} чтения</span></div>
        </div>
      </section>
      <section style={{ padding: '0 0 8px' }}>
        <div className="pds-in">
          <div className="pds-art-hero"><img src={`img/${a.img}.jpg`} alt="Свежий букет, который можно передать дальше" /></div>
        </div>
      </section>
      <section className="pds-sec" style={{ paddingTop: 8 }}>
        <div className="pds-in">
          <div className="pds-prose">
            <p>Большой букет на день рождения или 8 марта — это красиво ровно до того момента, когда дома заканчиваются вазы. Через день-два встаёт вопрос: цветы ещё свежие, а ставить их некуда. Выбрасывать живой букет жалко, но и держать вянущим тоже не вариант.</p>
            <p>Хорошая новость: у букета есть жизнь и после вашего праздника. Вот что с ним можно сделать.</p>
            <h3>1. Передать его дальше за полцены</h3>
            <p>Рядом всегда есть кто-то, кому нужны свежие цветы на свидание, в подарок или просто домой — но не за магазинные деньги. Выставьте букет на «Передариме»: пара фото, район и цена в полцены. Публикация бесплатна, сервис берёт 5% только когда букет продан. Вы возвращаете часть денег, а цветы достаются человеку поблизости.</p>
            <h3>2. Продлить ему жизнь</h3>
            <ul>
              <li>Подрежьте стебли под углом и смените воду.</li>
              <li>Уберите букет от батареи, фруктов и прямого солнца.</li>
              <li>Разберите большой букет на пару маленьких — так цветам просторнее.</li>
            </ul>
            <h3>3. Отдать тому, кому приятно</h3>
            <p>Соседка, коллега, пункт у дома — букет легко подарить дальше. Но если хочется вернуть часть денег и не искать самому, кому он нужен, проще выставить его в сервисе: покупатель найдётся сам и заберёт рядом.</p>
            <p><b>Главное — не в мусорку.</b> Живой букет может порадовать ещё одного человека. На «Передариме» это занимает минуту.</p>
          </div>
          <div className="pds-cta" style={{ marginTop: 34 }}>
            <div className="tx"><h3>Подарите букету вторую жизнь</h3><p>Выставьте за минуту с телефона. Самовывоз рядом — покупатель заберёт сам.</p></div>
            <Btn variant="primary" lg icon={Plus}>Опубликовать букет</Btn>
          </div>
        </div>
      </section>
    </Shell>
  );
}

export { PdGeoPage, PdSafeDeal, PdBlogIndex, PdBlogArticle, PdSeoMeta, CITIES_FULL as PD_GEO_CITIES };
