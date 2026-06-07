// @rebloom/canon · catalog/catalog.jsx
// Converted from design source pd-catalog.jsx (single source of truth — edited ONLY by Claude Design).
import React from "react";
import "../styles/canon.css";
import { PdCard, PdIc, PD_FRESH, PD_LIKED, PD_FLOWER_FILTERS } from "../feed/feed";
import { PdBtn, PdMetroPicker } from "../primitives/kit";
import { PdWebNav } from "../primitives/web-nav";

// ── brand mark «Соцветие» — лепестки = currentColor (подхватывают тему), центр янтарный
const PETAL = 'M50 50C38 41 36 21 50 10C64 21 62 41 50 50Z';
const Mark = ({ size=22, center='#E8A93B', style, className, title='Передарим' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={title} style={{ display:'block', flex:'none', ...style }}>
    {[0,72,144,216,288].map((a)=><path key={a} d={PETAL} fill="currentColor" transform={`rotate(${a} 50 50)`}/>)}
    <circle cx="50" cy="50" r="8" fill={center}/>
  </svg>
);

// pd-catalog.jsx — страница каталога букетов «Передарим» с рабочими фильтрами.
// Фильтры: цена, свежесть, рейтинг продавца, размер, район. Сортировка.
// Адаптив: platform = 'desktop' | 'web'. Exports: window.PdCatalog

const PdCatalog = (function () {
  const Ic = PdIc, Card = PdCard, Btn = PdBtn;
  const FRESH = PD_FRESH || [], LIKED = PD_LIKED || [];

  // расширенный набор данных каталога (дублируем с вариациями)
  const BASE = [...FRESH, ...LIKED];
  const DISTRICTS = ['Патрики', 'Хамовники', 'Арбат', 'Сокол', 'Тверской', 'Пресня', 'Якиманка', 'Замоскворечье', 'Остоженка', 'Таганка'];
  const VAR_METRO = ['Тверская', 'Курская', 'Белорусская', 'Чистые пруды', 'Октябрьская', 'Таганская', 'Китай-город', 'Цветной бульвар', 'Полянка', 'Смоленская'];
  const VAR_FLOWER = ['Розы', 'Тюльпаны', 'Хризантемы', 'Гортензия', 'Пионы', 'Эустома', 'Альстромерия', 'Ранункулюсы'];
  const FRESHES = ['today', 'd1_2', 'd3_plus'];
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
    seller: { ...d.seller, r: Math.min(5, Math.max(4.3, (d.seller.r || 4.7) - 0.2 + (i % 3) * 0.15)) },
  }));

  const PRICE = { any: () => true, lt1k: (p) => p < 1000, '1k2k': (p) => p >= 1000 && p <= 2000, gt2k: (p) => p > 2000 };
  const RATING = { any: () => true, '45': (r) => r >= 4.5, '48': (r) => r >= 4.8, '5': (r) => r >= 5 };

  const FLOWER_OPTS = (PD_FLOWER_FILTERS || []).map((f) => [f, f]);
  const FILTERS = {
    price: { label: 'Цена', opts: [['lt1k', 'до 1 000 ₽'], ['1k2k', '1 000–2 000 ₽'], ['gt2k', '2 000 ₽+']] },
    fresh: { label: 'Свежесть', opts: [['today', 'Свежий'], ['d1_2', '1–2 дня'], ['d3_plus', '3+ дня']] },
    flower: { label: 'Тип цветов', opts: FLOWER_OPTS },
    rating: { label: 'Рейтинг продавца', opts: [['45', '4,5+'], ['48', '4,8+'], ['5', '5,0']] },
    size: { label: 'Размер букета', opts: [['S', 'S · до 7'], ['M', 'M · 7–15'], ['L', 'L · 15–25'], ['XL', 'XL · 25+']] },
  };
  const SORTS = [['fresh', 'Сначала свежие'], ['cheap', 'Сначала дешевле'], ['exp', 'Сначала дороже'], ['rating', 'По рейтингу']];
  const FRESH_RANK = { today: 0, d1_2: 1, d3_plus: 2 };

  const ico = (Fn, cls) => Fn ? Fn({ className: cls, fill: 'none', stroke: 'currentColor' }) : null;
  const Sliders = (p) => <svg viewBox="0 0 24 24" {...p} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16"/><circle cx="9" cy="7" r="2.3" fill="currentColor" stroke="none"/><circle cx="15" cy="12" r="2.3" fill="currentColor" stroke="none"/><circle cx="8" cy="17" r="2.3" fill="currentColor" stroke="none"/></svg>;
  const ChevD = (p) => <svg viewBox="0 0 24 24" {...p} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>;
  const CloseX = (p) => <svg viewBox="0 0 24 24" {...p} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="m6 6 12 12M18 6 6 18"/></svg>;

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

  // единая веб-шапка (бар + бургер-драйвер) — общий компонент PdWebNav
  const Header = () => <PdWebNav active="Каталог" />;

  function Stars(r) {
    return <span className="st">★</span>;
  }

  return function PdCatalog({ platform = 'desktop' }) {
    const desk = platform === 'desktop';
    const MetroPicker = PdMetroPicker;
    const [f, setF] = React.useState({ price: 'any', fresh: 'any', flower: 'any', rating: 'any', size: 'any' });
    const [metros, setMetros] = React.useState([]);
    const [sort, setSort] = React.useState('fresh');
    const [shown, setShown] = React.useState(desk ? 16 : 10);
    const [sheet, setSheet] = React.useState(false);

    const filtered = React.useMemo(() => {
      let r = ALL.filter((d) =>
        PRICE[f.price](d.price) &&
        (f.fresh === 'any' || d.fresh === f.fresh) &&
        (f.flower === 'any' || (d.flowers || []).includes(f.flower)) &&
        RATING[f.rating](d.seller.r) &&
        (f.size === 'any' || d.size === f.size) &&
        (metros.length === 0 || metros.includes(d.metro))
      );
      r = r.slice().sort((a, b) => {
        if (sort === 'cheap') return a.price - b.price;
        if (sort === 'exp') return b.price - a.price;
        if (sort === 'rating') return b.seller.r - a.seller.r;
        return (FRESH_RANK[a.fresh] - FRESH_RANK[b.fresh]) || (b.likes - a.likes);
      });
      return r;
    }, [f, sort, metros]);

    const set = (k, v) => { setF((s) => ({ ...s, [k]: v })); setShown(desk ? 16 : 10); };
    const toggleMetro = (s) => { setMetros((m) => s === null ? [] : (m.includes(s) ? m.filter((x) => x !== s) : [...m, s])); setShown(desk ? 16 : 10); };
    const reset = () => { setF({ price: 'any', fresh: 'any', flower: 'any', rating: 'any', size: 'any' }); setMetros([]); setSort('fresh'); };
    const active = Object.values(f).filter((v) => v !== 'any').length + metros.length;

    const chip = (k, val, lab, isStar) => (
      <button key={val} className={'pdc-fchip' + (f[k] === val ? ' on' : '')} onClick={() => set(k, f[k] === val ? 'any' : val)}>
        {isStar && /\d/.test(lab) ? <span className="st">★</span> : null}{lab}
      </button>
    );

    return (
      <div className={'pd-root pd-web pdc' + (desk ? ' pdc--desk' : '')} data-pd-theme="a">
        <Header desk={desk} />
        <main className="pd-scroll pdw-scroll">
          <div className="pdc-head">
            <p className="pdc-crumbs"><a href="Передарим · Лендинг peredarim.ru.html">Главная</a> · Каталог · Москва</p>
            <div className="pdc-titlerow">
              <h1 className="pdc-title">Свежие букеты в Москве</h1>
              <span className="pdc-count"><span className="d" />{filtered.length} букетов{active ? ` · фильтров: ${active}` : ''}</span>
            </div>
          </div>

          <div className="pdc-body">
            {/* sidebar (desktop) */}
            <aside className="pdc-side">
              <div className="pdc-fblock">
                <h4>Метро</h4>
                <MetroPicker cityKey="msk" multi values={metros} onToggle={toggleMetro} placeholder="Любые станции" />
                {metros.length > 0 && <div className="pdc-metrotags">{metros.map((m) => <button key={m} className="pdc-metrotag" onClick={() => toggleMetro(m)}>м. {m}<CloseX className="pd-i12" /></button>)}</div>}
              </div>
              {Object.entries(FILTERS).map(([k, g]) => (
                <div className="pdc-fblock" key={k}>
                  <h4>{g.label}</h4>
                  <div className="pdc-fopts">{g.opts.map(([val, lab]) => chip(k, val, lab, k === 'rating'))}</div>
                </div>
              ))}
              <button className="pdc-reset" onClick={reset}>Сбросить фильтры</button>
            </aside>

            <div className="pdc-main">
              {/* mobile filter chips */}
              <div className="pdc-mbar">
                <button className="pdc-mchip pdc-mchip--filters" onClick={() => setSheet(true)}><Sliders className="pd-i16" />Фильтры{active ? ` · ${active}` : ''}</button>
                <button className={'pdc-mchip' + (metros.length ? ' on' : '')} onClick={() => setSheet(true)}>{ico(Ic.pin, 'pd-i14')}{metros.length ? (metros.length === 1 ? `м. ${metros[0]}` : `Метро · ${metros.length}`) : 'Метро'}</button>
                {FILTERS.price.opts.slice(1).map(([v, l]) => <button key={v} className={'pdc-mchip' + (f.price === v ? ' on' : '')} onClick={() => set('price', f.price === v ? 'any' : v)}>{l}</button>)}
                <button className={'pdc-mchip' + (f.fresh === 'today' ? ' on' : '')} onClick={() => set('fresh', f.fresh === 'today' ? 'any' : 'today')}>Свежий</button>
                {['Розы', 'Пионы', 'Тюльпаны'].map((fl) => <button key={fl} className={'pdc-mchip' + (f.flower === fl ? ' on' : '')} onClick={() => set('flower', f.flower === fl ? 'any' : fl)}>{fl}</button>)}
                <button className={'pdc-mchip' + (f.rating === '48' ? ' on' : '')} onClick={() => set('rating', f.rating === '48' ? 'any' : '48')}>★ 4,8+</button>
              </div>

              {/* мобильная панель фильтров (раскрывается из «Фильтры») */}
              {sheet && (
                <div className="pdc-panel">
                  <div className="pdc-panel-head">
                    <span>Все фильтры</span>
                    <button className="pdc-panel-x" onClick={() => setSheet(false)} aria-label="Свернуть"><CloseX className="pd-i18" /></button>
                  </div>
                  <div className="pdc-panel-grp">
                    <h4>Метро</h4>
                    <MetroPicker cityKey="msk" multi values={metros} onToggle={toggleMetro} placeholder="Любые станции" />
                    {metros.length > 0 && <div className="pdc-metrotags">{metros.map((m) => <button key={m} className="pdc-metrotag" onClick={() => toggleMetro(m)}>м. {m}<CloseX className="pd-i12" /></button>)}</div>}
                  </div>
                  {Object.entries(FILTERS).map(([k, g]) => (
                    <div className="pdc-panel-grp" key={k}>
                      <h4>{g.label}</h4>
                      <div className="pdc-fopts">{g.opts.map(([val, lab]) => chip(k, val, lab, k === 'rating'))}</div>
                    </div>
                  ))}
                  <div className="pdc-panel-foot">
                    <button className="pdc-sheet-reset" onClick={reset}>Сбросить{active ? ` (${active})` : ''}</button>
                    <button className="pdc-sheet-apply" onClick={() => setSheet(false)}>Показать {filtered.length} букетов</button>
                  </div>
                </div>
              )}

              <div className="pdc-toolbar">
                <span className="pdc-count" style={{ fontSize: 13 }}>{filtered.length} букетов</span>
                <SortDropdown sort={sort} setSort={setSort} />
                <div className="pdc-sort pdc-sort--desk">
                  <span className="l">Сортировка:</span>
                  <div className="pdc-sortsel">
                    {SORTS.map(([v, l]) => <button key={v} className={'pdc-sortbtn' + (sort === v ? ' on' : '')} onClick={() => setSort(v)}>{l}</button>)}
                  </div>
                </div>
              </div>

              {filtered.length === 0 ? (
                <div className="pdc-empty"><b>Ничего не нашлось</b>Попробуйте смягчить фильтры, например расширить цену или свежесть.</div>
              ) : (
                <div className="pdc-grid">
                  {filtered.slice(0, shown).map((d) => <div className="pd-rise" key={d._id}><Card d={d} variant="grid" /></div>)}
                </div>
              )}

              {shown < filtered.length && (
                <div className="pdc-loadmore"><button onClick={() => setShown((n) => n + (desk ? 12 : 8))}>Показать ещё</button></div>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  };
})();

export { PdCatalog };
