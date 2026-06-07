// @rebloom/canon · primitives/web-nav.jsx
// Converted from design source pd-webnav.jsx (single source of truth — edited ONLY by Claude Design).
import React from "react";
import "../styles/canon.css";
import { PdIc, PdHeart } from "../feed/feed";
import { PdBtn } from "../primitives/kit";

// ── brand mark «Соцветие» — лепестки = currentColor (подхватывают тему), центр янтарный
const PETAL = 'M50 50C38 41 36 21 50 10C64 21 62 41 50 50Z';
const Mark = ({ size=22, center='#E8A93B', style, className, title='Передарим' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={title} style={{ display:'block', flex:'none', ...style }}>
    {[0,72,144,216,288].map((a)=><path key={a} d={PETAL} fill="currentColor" transform={`rotate(${a} 50 50)`}/>)}
    <circle cx="50" cy="50" r="8" fill={center}/>
  </svg>
);

// pd-webnav.jsx — ЕДИНАЯ веб-шапка «Передарим» (бар + бургер-меню/драйвер).
// Источник правды для всех web-поверхностей: лендинг, каталог, десктоп-экраны.
// Desktop: бренд · город · поиск · уведомления · избранное · аватар · CTA.
// Mobile: бренд · уведомления · аватар · бургер → выезжающий драйвер (профиль,
//   город, ссылки, CTA внизу). auth-aware: гость (authed=false) видит «Войти»
//   вместо избранного/аватара/драйвер-профиля.
// Exports: PdWebNav
// Props: { active, authed=true, city='Москва', cityLoc='Москве', user={n,r}, links, onPublish }
//   city — именительный (кнопка-город); cityLoc — предложный (плейсхолдер поиска «в Москве»).
//   web прокидывает cityPrepositional(city); по умолчанию — «Москве».

const PdWebNav = (function () {
  const Ic = PdIc, Btn = PdBtn, Heart = PdHeart;
  const ico = (Fn, cls) => Fn ? Fn({ className: cls, fill: 'none', stroke: 'currentColor' }) : null;

  const Bell  = (p) => <svg viewBox="0 0 24 24" {...p} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z"/><path d="M10 19a2 2 0 0 0 4 0"/></svg>;
  const Menu  = (p) => <svg viewBox="0 0 24 24" {...p} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>;
  const Close = (p) => <svg viewBox="0 0 24 24" {...p} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><path d="m6 6 12 12M18 6 6 18"/></svg>;
  const Star  = (p) => <svg viewBox="0 0 24 24" {...p} fill="currentColor" stroke="none"><path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.6 1-5.8L3.5 9.7l5.9-.9z"/></svg>;
  const ChevR = (p) => <svg viewBox="0 0 24 24" {...p} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="m9 6 6 6-6 6"/></svg>;
  const Shield= (p) => <svg viewBox="0 0 24 24" {...p} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z"/><path d="m9 12 2 2 4-4"/></svg>;
  const Phone = (p) => <svg viewBox="0 0 24 24" {...p} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/></svg>;

  const LANDING = 'Передарим · Лендинг peredarim.ru.html';
  const CATALOG = 'Передарим · Каталог букетов.html';
  const DEFAULT_LINKS = [
    { label: 'Каталог',          sub: 'Все свежие букеты Москвы',  href: CATALOG,         Icon: (p) => ico(Ic.search, 'pd-i20') },
    { label: 'Как работает',     sub: 'Передаривание за 1 день',   href: LANDING + '#how',  Icon: Shield },
    { label: 'Безопасная сделка',sub: 'Оплата при встрече',        href: LANDING + '#safe', Icon: (p) => ico(Ic.deals, 'pd-i20') },
    { label: 'Приложение',       sub: 'iOS и Android',             href: LANDING + '#app',  Icon: Phone },
  ];

  return function PdWebNav({ active, authed = true, city = 'Москва', cityLoc = 'Москве', user = { n: 'Мария', r: 4.9 }, links = DEFAULT_LINKS, onPublish }) {
    const [menu, setMenu] = React.useState(false);
    const close = () => setMenu(false);
    const initial = (user && user.n ? user.n[0] : 'М');
    return (
      <React.Fragment>
        <header className="pdl-nav">
          <div className="pdl-nav-in">
            <a href={LANDING} className="pdl-brand" style={{ textDecoration: 'none' }}><Mark size={24} />Передарим</a>
            <div className="pdl-nav-mid">
              <button className="pdl-nav-city">{ico(Ic.pin, 'pd-i16')}{city}{ico(Ic.chev, 'pd-i14')}</button>
              <div className="pdl-nav-search">{ico(Ic.search, 'pd-i18')}<span>Поиск свежих букетов в {cityLoc}</span></div>
            </div>
            <div className="pdl-navright">
              <button className="pdl-nav-icon" aria-label="Уведомления"><Bell /></button>
              {authed
                ? <React.Fragment>
                    <button className="pdl-nav-icon pdl-nav-fav" aria-label="Избранное"><Heart className="pd-i20" /></button>
                    <button className="pdl-nav-ava" aria-label="Профиль">{initial}</button>
                  </React.Fragment>
                : <a className="pdl-nav-login" href={LANDING + '#login'}>Войти</a>}
              <span className="pdl-nav-cta"><Btn variant="primary" icon={Ic && Ic.plus} onClick={onPublish}>Опубликовать букет</Btn></span>
              <button className="pdl-nav-burger" aria-label="Меню" aria-expanded={menu} onClick={() => setMenu(true)}><Menu /></button>
            </div>
          </div>
        </header>

        <div className={'pdl-drawer' + (menu ? ' open' : '')} aria-hidden={!menu}>
          <div className="pdl-drawer-scrim" onClick={close} />
          <aside className="pdl-drawer-panel" role="dialog" aria-modal="true" aria-label="Меню">
            <header className="pdl-drawer-top">
              <span className="pdl-brand"><Mark size={23} />Передарим</span>
              <button className="pdl-drawer-x" onClick={close} aria-label="Закрыть меню"><Close /></button>
            </header>
            <div className="pdl-drawer-body">
              {authed
                ? <a className="pdl-drawer-prof" href="#" onClick={(e) => { e.preventDefault(); close(); }}>
                    <span className="av">{initial}</span>
                    <span className="who"><b>{user.n}</b><span>Профиль и отзывы</span></span>
                    <span className="rt"><Star />{(user.r || 5).toFixed(1).replace('.', ',')}</span>
                    <ChevR className="go" />
                  </a>
                : <a className="pdl-drawer-prof pdl-drawer-login" href={LANDING + '#login'} onClick={close}>
                    <span className="av">{ico(Ic.user || Ic.deals, 'pd-i20')}</span>
                    <span className="who"><b>Войти или зарегистрироваться</b><span>Чтобы продавать и сохранять</span></span>
                    <ChevR className="go" />
                  </a>}
              <div className="pdl-drawer-city">
                <button className="head">
                  <span className="pin">{ico(Ic.pin, 'pd-i18')}</span>
                  <span className="tx"><b>{city}</b><span>свежие букеты рядом</span></span>
                  {ico(Ic.chev, 'chev pd-i18')}
                </button>
              </div>
              <nav className="pdl-drawer-nav">
                {links.map((l) => (
                  <a key={l.label} className={'pdl-drawer-row' + (active === l.label ? ' on' : '')} href={l.href} onClick={close}>
                    <span className="ic"><l.Icon /></span>
                    <span className="tx"><b>{l.label}</b><span>{l.sub}</span></span>
                    <ChevR className="go" />
                  </a>
                ))}
              </nav>
            </div>
            <footer className="pdl-drawer-foot">
              <Btn variant="primary" block lg icon={Ic && Ic.plus} onClick={() => { close(); onPublish && onPublish(); }}>Опубликовать букет</Btn>
            </footer>
          </aside>
        </div>
      </React.Fragment>
    );
  };
})();

export { PdWebNav };
