// @rebloom/canon · catalog/catalog.jsx
// Converted from design source pd-catalog.jsx (single source of truth — edited ONLY by Claude Design).
//
// canon 0.9.1: PdCatalog теперь ПРЕЗЕНТАЦИОННЫЙ (data-driven) — он НЕ фетчит и НЕ
// генерит данные, всё приходит пропсами, чтобы web/ мог импортить его напрямую на
// живом /catalog (а не транскрибировать .pdc-* разметку поверх своих данных).
//
// Контракт пропсов PdCatalog:
//   platform   'desktop' | 'web'                         — хром платформы
//   items      Card[]                                    — карточки текущей выдачи (страница)
//   state      'loading'|'loaded'|'empty'|'no-results'|'loading-more'|'end'|'error'|'offline'
//   total      number                                    — счётчик «Показать N букетов»
//   filters    { metro:string[], flowers:string[], size, freshness, rating, priceMin, priceMax, sort }
//   onFiltersChange(next)                                — компонент НЕ держит истину фильтров
//   stations   {id,name,lines:[{name,color}]}[]          — живой список метро (web: /api/geo/metro)
//   flowers    {id,label}[]                              — типы цветов (enum)
//   city,cityLoc + onCityChange                          — город (имен. / предл.)
//   onLoadMore()                                         — догрузка (курсор)
//   onCardClick(d) / cardHref(d)                         — переход на карточку (web: /l/{id})
//   onRetry()                                            — для error / offline
//   header                                               — slot: своя auth-aware шапка (иначе PdWebNav)
//
// filters.metro / filters.flowers хранят СТАБИЛЬНЫЕ id (а не RU-имена); пикер показывает имя.
// Демо-обёртка PdCatalogDemo (ниже) генерит данные и держит состояние — ею пользуются
// reference-витрины. В web/ её роль играет реальный CatalogRoute (фетч + URL-состояние).
import React from "react";
import "../styles/canon.css";
import { PdCard, PdIc, PD_FRESH, PD_LIKED, PD_FLOWER_FILTERS, PD_METRO, PD_METRO_LINES } from "../feed/feed";
import { PdMetroPicker } from "../primitives/kit";
import { PdWebNav } from "../primitives/web-nav";

const PdCatalog = (function () {
  const PRICE_BUCKETS = [
    { id: 'lt1k', label: 'до 1 000 ₽', min: null, max: 1000 },
    { id: '1k2k', label: '1 000–2 000 ₽', min: 1000, max: 2000 },
    { id: 'gt2k', label: '2 000 ₽+', min: 2000, max: null },
  ];
  const FRESH_OPTS  = [['today', 'Свежий'], ['d1_2', '1–2 дня'], ['d3_plus', '3+ дня']];
  const RATING_OPTS = [['45', '4,5+'], ['48', '4,8+'], ['5', '5,0']];
  const SIZE_OPTS   = [['S', 'S · до 7'], ['M', 'M · 7–15'], ['L', 'L · 15–25'], ['XL', 'XL · 25+']];
  const SORTS = [['fresh', 'Сначала свежие'], ['cheap', 'Сначала дешевле'], ['exp', 'Сначала дороже'], ['rating', 'По рейтингу']];

  const Sliders = (p) => <svg viewBox="0 0 24 24" {...p} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16"/><circle cx="9" cy="7" r="2.3" fill="currentColor" stroke="none"/><circle cx="15" cy="12" r="2.3" fill="currentColor" stroke="none"/><circle cx="8" cy="17" r="2.3" fill="currentColor" stroke="none"/></svg>;
  const ChevD  = (p) => <svg viewBox="0 0 24 24" {...p} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>;
  const CloseX = (p) => <svg viewBox="0 0 24 24" {...p} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="m6 6 12 12M18 6 6 18"/></svg>;
  const ico = (Fn, cls) => Fn ? Fn({ className: cls, fill: 'none', stroke: 'currentColor' }) : null;

  function SortDropdown({ sort, setSort }) {
    const [open, setOpen] = React.useState(false);
    const ref = React.useRef(null);
    React.useEffect(() => {
      if (!open) return;
      const o = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
      document.addEventListener('mousedown', o);
      return () => document.removeEventListener('mousedown', o);
    }, [open]);
    const cur = SORTS.find(([v]) => v === sort);
    return (
      <div className={'pdc-sortdd' + (open ? ' open' : '')} ref={ref}>
        <button type="button" className="pdc-sortdd-btn" onClick={() => setOpen((o) => !o)}>
          <span className="l">Сортировка:</span><span className="v">{cur ? cur[1] : ''}</span><ChevD className="chev pd-i16" />
        </button>
        {open && (
          <div className="pdc-sortdd-menu">
            {SORTS.map(([v, l]) => <button key={v} type="button" className={'pdc-sortdd-row' + (sort === v ? ' on' : '')} onClick={() => { setSort(v); setOpen(false); }}>{l}</button>)}
          </div>
        )}
      </div>
    );
  }

  return function PdCatalog({
    platform = 'desktop',
    items = [],
    state = 'loaded',
    total = 0,
    filters = { metro: [], flowers: [], size: null, freshness: null, rating: null, priceMin: null, priceMax: null, sort: 'fresh' },
    onFiltersChange,
    stations = [],
    flowers = [],
    city = 'Москва',
    cityLoc = 'Москве',
    onCityChange,
    onLoadMore,
    onCardClick,
    cardHref,
    onLike,
    renderCard,
    onRetry,
    header,
  }) {
    const desk = platform === 'desktop';
    const Card = PdCard, Ic = PdIc, MetroPicker = PdMetroPicker;
    const [sheet, setSheet] = React.useState(false);

    const f = filters;
    const patch = (p) => onFiltersChange && onFiltersChange({ ...f, ...p });

    // ── переключатели фильтров (наружу через onFiltersChange) ──
    const single = (key, val) => patch({ [key]: f[key] === val ? null : val });
    const togglePrice = (b) => {
      const on = f.priceMin === b.min && f.priceMax === b.max;
      patch({ priceMin: on ? null : b.min, priceMax: on ? null : b.max });
    };
    const priceOn = (b) => f.priceMin === b.min && f.priceMax === b.max;
    const toggleFlower = (id) => patch({ flowers: f.flowers.includes(id) ? f.flowers.filter((x) => x !== id) : [...f.flowers, id] });
    const toggleMetro = (id) => patch({ metro: id === null ? [] : (f.metro.includes(id) ? f.metro.filter((x) => x !== id) : [...f.metro, id]) });
    const reset = () => onFiltersChange && onFiltersChange({ metro: [], flowers: [], size: null, freshness: null, rating: null, priceMin: null, priceMax: null, sort: 'fresh' });

    const active = f.metro.length + f.flowers.length + (f.size ? 1 : 0) + (f.freshness ? 1 : 0) + (f.rating ? 1 : 0) + ((f.priceMin != null || f.priceMax != null) ? 1 : 0);
    const stationName = (id) => { const s = stations.find((x) => x.id === id); return s ? s.name : id; };
    const flowerLabel = (id) => { const x = flowers.find((y) => y.id === id); return x ? x.label : id; };

    // ── чипы ──
    const ssChip = (key, val, lab, star) => (
      <button key={val} className={'pdc-fchip' + (f[key] === val ? ' on' : '')} onClick={() => single(key, val)}>
        {star && /\d/.test(lab) ? <span className="st">★</span> : null}{lab}
      </button>
    );
    const priceChip = (b) => <button key={b.id} className={'pdc-fchip' + (priceOn(b) ? ' on' : '')} onClick={() => togglePrice(b)}>{b.label}</button>;
    const flowerChip = (x) => <button key={x.id} className={'pdc-fchip' + (f.flowers.includes(x.id) ? ' on' : '')} onClick={() => toggleFlower(x.id)}>{x.label}</button>;

    // ── группы фильтров (общие для сайдбара и моб. панели) ──
    const MetroGroup = ({ tag = 'h4' }) => (
      <React.Fragment>
        {React.createElement(tag, null, 'Метро')}
        <MetroPicker options={stations} idMode multi values={f.metro} onToggle={toggleMetro} placeholder="Любые станции" />
        {f.metro.length > 0 && <div className="pdc-metrotags">{f.metro.map((m) => <button key={m} className="pdc-metrotag" onClick={() => toggleMetro(m)}>м. {stationName(m)}<CloseX className="pd-i12" /></button>)}</div>}
      </React.Fragment>
    );
    const groups = (cls) => (
      <React.Fragment>
        <div className={cls}><h4>Цена</h4><div className="pdc-fopts">{PRICE_BUCKETS.map(priceChip)}</div></div>
        <div className={cls}><h4>Свежесть</h4><div className="pdc-fopts">{FRESH_OPTS.map(([v, l]) => ssChip('freshness', v, l))}</div></div>
        <div className={cls}><h4>Тип цветов</h4><div className="pdc-fopts">{flowers.map(flowerChip)}</div></div>
        <div className={cls}><h4>Рейтинг продавца</h4><div className="pdc-fopts">{RATING_OPTS.map(([v, l]) => ssChip('rating', v, l, true))}</div></div>
        <div className={cls}><h4>Размер букета</h4><div className="pdc-fopts">{SIZE_OPTS.map(([v, l]) => ssChip('size', v, l))}</div></div>
      </React.Fragment>
    );

    // ── карточка: renderCard-prop (web подставляет свой BouquetCard целиком) или
    //   дефолтная PdCard (data-driven: полный URL фото + onLike наружу) с переходом.
    const renderOne = (d) => {
      if (renderCard) return renderCard(d);
      const card = <Card d={d} variant="grid" onLike={onLike} />;
      if (cardHref) return <a className="pdc-cardlink" href={cardHref(d)}>{card}</a>;
      if (onCardClick) return <div className="pdc-cardlink" role="link" tabIndex={0} onClick={() => onCardClick(d)}>{card}</div>;
      return card;
    };

    // ── сортировка cheap/exp/rating — клиентски по уже выданным items (бэкенд-лента
    //   знает только секции fresh/liked). fresh/default — порядок как пришёл сверху.
    const ordered = React.useMemo(() => {
      if (f.sort === 'cheap') return items.slice().sort((a, b) => a.price - b.price);
      if (f.sort === 'exp')   return items.slice().sort((a, b) => b.price - a.price);
      if (f.sort === 'rating') return items.slice().sort((a, b) => ((b.seller && b.seller.r) || 0) - ((a.seller && a.seller.r) || 0));
      return items;
    }, [items, f.sort]);

    // ── тело коллекции по state (INTERACTION_STATES §4) ──
    const hasMore = items.length < total;
    const skelN = desk ? 8 : 6;
    const Collection = () => {
      if (state === 'loading') return <div className="pdc-grid">{Array.from({ length: skelN }).map((_, i) => <div className="pdc-skel" key={i} aria-hidden="true" />)}</div>;
      if (state === 'error' || state === 'offline') return (
        <div className="pdc-state">
          <span className="pdc-state-ico">{state === 'offline' ? ico(Ic.pin, 'pd-i24') : '!'}</span>
          <b>{state === 'offline' ? 'Нет соединения' : 'Не удалось загрузить'}</b>
          <span className="pdc-state-sub">{state === 'offline' ? 'Проверьте интернет — и попробуйте снова.' : 'Что-то пошло не так на нашей стороне.'}</span>
          <button className="pdc-state-btn" onClick={onRetry}>Повторить</button>
        </div>
      );
      if (state === 'empty') return (
        <div className="pdc-state"><b>Пока нет букетов</b><span className="pdc-state-sub">В {cityLoc} сейчас нет свежих букетов. Загляните чуть позже — их добавляют каждый день.</span></div>
      );
      if (state === 'no-results' || items.length === 0) return (
        <div className="pdc-empty"><b>Ничего не нашлось</b>Попробуйте смягчить фильтры — например, расширить цену или свежесть.{active ? <div className="pdc-empty-act"><button className="pdc-reset" onClick={reset}>Сбросить фильтры</button></div> : null}</div>
      );
      return (
        <React.Fragment>
          <div className="pdc-grid">{ordered.map((d) => <div className="pd-rise" key={d._id || d.id}>{renderOne(d)}</div>)}</div>
          {state === 'loading-more' && <div className="pdc-morestate"><span className="pdc-spin" />Загружаем ещё…</div>}
          {state === 'end' && <div className="pdc-end"><span />Показали все букеты по вашему запросу</div>}
          {state === 'loaded' && hasMore && <div className="pdc-loadmore"><button onClick={onLoadMore}>Показать ещё</button></div>}
        </React.Fragment>
      );
    };

    const busy = state === 'loading' || state === 'error' || state === 'offline' || state === 'empty';

    return (
      <div className={'pd-root pd-web pdc' + (desk ? ' pdc--desk' : '')} data-pd-theme="a">
        {header || <PdWebNav active="Каталог" city={city} cityLoc={cityLoc} />}
        <main className="pd-scroll pdw-scroll">
          <div className="pdc-head">
            <p className="pdc-crumbs"><a href="Передарим · Лендинг peredarim.ru.html">Главная</a> · Каталог · {city}</p>
            <div className="pdc-titlerow">
              <h1 className="pdc-title">Свежие букеты в {cityLoc}</h1>
              <span className="pdc-count"><span className="d" />{state === 'loading' ? 'Загрузка…' : `${total} букетов`}{active && !busy ? ` · фильтров: ${active}` : ''}</span>
            </div>
          </div>

          <div className="pdc-body">
            {/* sidebar (desktop) */}
            <aside className="pdc-side">
              <div className="pdc-fblock"><MetroGroup /></div>
              <div className="pdc-fblock"><h4>Цена</h4><div className="pdc-fopts">{PRICE_BUCKETS.map(priceChip)}</div></div>
              <div className="pdc-fblock"><h4>Свежесть</h4><div className="pdc-fopts">{FRESH_OPTS.map(([v, l]) => ssChip('freshness', v, l))}</div></div>
              <div className="pdc-fblock"><h4>Тип цветов</h4><div className="pdc-fopts">{flowers.map(flowerChip)}</div></div>
              <div className="pdc-fblock"><h4>Рейтинг продавца</h4><div className="pdc-fopts">{RATING_OPTS.map(([v, l]) => ssChip('rating', v, l, true))}</div></div>
              <div className="pdc-fblock"><h4>Размер букета</h4><div className="pdc-fopts">{SIZE_OPTS.map(([v, l]) => ssChip('size', v, l))}</div></div>
              <button className="pdc-reset" onClick={reset}>Сбросить фильтры</button>
            </aside>

            <div className="pdc-main">
              {/* mobile filter chips */}
              <div className="pdc-mbar">
                <button className="pdc-mchip pdc-mchip--filters" onClick={() => setSheet(true)}><Sliders className="pd-i16" />Фильтры{active ? ` · ${active}` : ''}</button>
                <button className={'pdc-mchip' + (f.metro.length ? ' on' : '')} onClick={() => setSheet(true)}>{ico(Ic.pin, 'pd-i14')}{f.metro.length ? (f.metro.length === 1 ? `м. ${stationName(f.metro[0])}` : `Метро · ${f.metro.length}`) : 'Метро'}</button>
                {PRICE_BUCKETS.slice(1).map((b) => <button key={b.id} className={'pdc-mchip' + (priceOn(b) ? ' on' : '')} onClick={() => togglePrice(b)}>{b.label}</button>)}
                <button className={'pdc-mchip' + (f.freshness === 'today' ? ' on' : '')} onClick={() => single('freshness', 'today')}>Свежий</button>
                {flowers.slice(0, 3).map((x) => <button key={x.id} className={'pdc-mchip' + (f.flowers.includes(x.id) ? ' on' : '')} onClick={() => toggleFlower(x.id)}>{x.label}</button>)}
                <button className={'pdc-mchip' + (f.rating === '48' ? ' on' : '')} onClick={() => single('rating', '48')}>★ 4,8+</button>
              </div>

              {/* мобильная панель фильтров */}
              {sheet && (
                <div className="pdc-panel">
                  <div className="pdc-panel-head">
                    <span>Все фильтры</span>
                    <button className="pdc-panel-x" onClick={() => setSheet(false)} aria-label="Свернуть"><CloseX className="pd-i18" /></button>
                  </div>
                  <div className="pdc-panel-grp"><MetroGroup /></div>
                  {groups('pdc-panel-grp')}
                  <div className="pdc-panel-foot">
                    <button className="pdc-sheet-reset" onClick={reset}>Сбросить{active ? ` (${active})` : ''}</button>
                    <button className="pdc-sheet-apply" onClick={() => setSheet(false)}>Показать {total} букетов</button>
                  </div>
                </div>
              )}

              <div className="pdc-toolbar">
                <span className="pdc-count" style={{ fontSize: 13 }}>{total} букетов</span>
                <SortDropdown sort={f.sort} setSort={(v) => patch({ sort: v })} />
                <div className="pdc-sort pdc-sort--desk">
                  <span className="l">Сортировка:</span>
                  <div className="pdc-sortsel">
                    {SORTS.map(([v, l]) => <button key={v} className={'pdc-sortbtn' + (f.sort === v ? ' on' : '')} onClick={() => patch({ sort: v })}>{l}</button>)}
                  </div>
                </div>
              </div>

              <Collection />
            </div>
          </div>
        </main>
      </div>
    );
  };
})();

// ─────────────────────────────────────────────────────────────────────────────
// PdCatalogDemo — НЕканоническая демо-обёртка для reference-витрин: генерит данные,
// держит фильтры/пагинацию/состояние и кормит ими презентационный PdCatalog.
// В web/ роль обёртки играет реальный CatalogRoute (фетч + урл-состояние).
// ─────────────────────────────────────────────────────────────────────────────
const PdCatalogDemo = (function () {
  const FRESHES = ['today', 'd1_2', 'd3_plus'];
  const DISTRICTS = ['Патрики', 'Хамовники', 'Арбат', 'Сокол', 'Тверской', 'Пресня', 'Якиманка', 'Замоскворечье', 'Остоженка', 'Таганка'];
  const VAR_METRO = ['Тверская', 'Курская', 'Белорусская', 'Чистые пруды', 'Октябрьская', 'Таганская', 'Китай-город', 'Цветной бульвар', 'Полянка', 'Смоленская'];
  const VAR_FLOWER = ['Розы', 'Тюльпаны', 'Хризантемы', 'Гортензия', 'Пионы', 'Эустома', 'Альстромерия', 'Ранункулюсы'];
  const FRESH_RANK = { today: 0, d1_2: 1, d3_plus: 2 };

  function buildData() {
    const BASE = [...(PD_FRESH || []), ...(PD_LIKED || [])];
    const ALL = [];
    BASE.forEach((d, i) => ALL.push({ ...d, _id: 'a' + i }));
    BASE.forEach((d, i) => ALL.push({
      ...d, _id: 'b' + i,
      price: Math.round((d.price * (i % 2 ? 1.4 : 0.8)) / 10) * 10,
      fresh: FRESHES[(i + 1) % 3],
      district: DISTRICTS[(i + 3) % DISTRICTS.length],
      metro: VAR_METRO[(i + 2) % VAR_METRO.length],
      flowers: [VAR_FLOWER[i % VAR_FLOWER.length]],
      likes: Math.max(3, (d.likes || 20) - 7 + (i % 5) * 4),
      // каждый 6-й — новый продавец (рейтинга нет → карточка рисует «Новый»)
      seller: (i % 6 === 5)
        ? { n: d.seller.n, r: null }
        : { ...d.seller, r: Math.min(5, Math.max(4.3, (d.seller.r || 4.7) - 0.2 + (i % 3) * 0.15)) },
    }));
    return ALL;
  }
  // справочники — в web подаёт backend; в демо id == имя/лейбл (стабильно для прототипа)
  function buildStations() {
    const lines = PD_METRO_LINES || {};
    const msk = (PD_METRO && PD_METRO.msk) || [];
    return msk.map((s) => ({ id: s.n, name: s.n, lines: s.l.map((id) => ({ name: id, color: lines[id] || '#A1A2A3' })) }));
  }
  const buildFlowers = () => (PD_FLOWER_FILTERS || []).map((f) => ({ id: f, label: f }));

  const RATING_MIN = { '45': 4.5, '48': 4.8, '5': 5 };

  return function PdCatalogDemo({ platform = 'desktop', demoState, demoFilters }) {
    const desk = platform === 'desktop';
    const PAGE = desk ? 16 : 10, STEP = desk ? 12 : 8;
    const ALL = React.useMemo(buildData, []);
    const stations = React.useMemo(buildStations, []);
    const flowers = React.useMemo(buildFlowers, []);

    const [filters, setFilters] = React.useState(Object.assign(
      { metro: [], flowers: [], size: null, freshness: null, rating: null, priceMin: null, priceMax: null, sort: 'fresh' },
      demoFilters || {}
    ));
    const [shown, setShown] = React.useState(PAGE);
    const [expanded, setExpanded] = React.useState(false);
    const [phase, setPhase] = React.useState('loaded'); // 'loaded' | 'loading-more'
    const [recovered, setRecovered] = React.useState(false);

    const filtered = React.useMemo(() => {
      const f = filters;
      let r = ALL.filter((d) =>
        (f.priceMin == null || d.price >= f.priceMin) &&
        (f.priceMax == null || d.price < f.priceMax) &&
        (!f.freshness || d.fresh === f.freshness) &&
        (f.flowers.length === 0 || (d.flowers || []).some((fl) => f.flowers.includes(fl))) &&
        (!f.rating || d.seller.r >= RATING_MIN[f.rating]) &&
        (!f.size || d.size === f.size) &&
        (f.metro.length === 0 || f.metro.includes(d.metro))
      );
      r = r.slice().sort((a, b) => {
        if (f.sort === 'cheap') return a.price - b.price;
        if (f.sort === 'exp') return b.price - a.price;
        if (f.sort === 'rating') return ((b.seller && b.seller.r) || 0) - ((a.seller && a.seller.r) || 0);
        return (FRESH_RANK[a.fresh] - FRESH_RANK[b.fresh]) || (b.likes - a.likes);
      });
      return r;
    }, [ALL, filters]);

    const active = filters.metro.length + filters.flowers.length + (filters.size ? 1 : 0) + (filters.freshness ? 1 : 0) + (filters.rating ? 1 : 0) + ((filters.priceMin != null || filters.priceMax != null) ? 1 : 0);

    // вычисляем state коллекции
    let state = (demoState && !recovered) ? demoState : null;
    if (!state) {
      if (filtered.length === 0) state = active > 0 ? 'no-results' : 'empty';
      else if (phase === 'loading-more') state = 'loading-more';
      else if (shown >= filtered.length) state = expanded ? 'end' : 'loaded';
      else state = 'loaded';
    }
    const blank = state === 'loading' || state === 'empty' || state === 'no-results' || state === 'error' || state === 'offline';
    const items = blank ? [] : filtered.slice(0, shown);

    const onFiltersChange = (next) => { setFilters(next); setShown(PAGE); setExpanded(false); setPhase('loaded'); };
    const onLoadMore = () => { setPhase('loading-more'); setTimeout(() => { setShown((n) => n + STEP); setExpanded(true); setPhase('loaded'); }, 460); };
    const onRetry = () => setRecovered(true);

    return <PdCatalog
      platform={platform}
      items={items}
      state={state}
      total={blank ? 0 : filtered.length}
      filters={filters}
      onFiltersChange={onFiltersChange}
      stations={stations}
      flowers={flowers}
      onLoadMore={onLoadMore}
      onRetry={onRetry}
      cardHref={() => 'Передарим · Клиентские экраны.html'}
    />;
  };
})();

export { PdCatalog, PdCatalogDemo };
