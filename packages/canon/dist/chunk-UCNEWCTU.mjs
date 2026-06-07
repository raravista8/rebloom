import { PdWebNav } from './chunk-HVIXZDRN.mjs';
import { PD_FRESH, PD_LIKED, PD_FLOWER_FILTERS, PdMetroPicker, Ic, Card } from './chunk-EKGKIXGF.mjs';
import React from 'react';
import { jsxs, jsx } from 'react/jsx-runtime';

var PdCatalog = (function() {
  const Ic2 = Ic, Card2 = Card;
  const FRESH = PD_FRESH || [], LIKED = PD_LIKED || [];
  const BASE = [...FRESH, ...LIKED];
  const DISTRICTS = ["\u041F\u0430\u0442\u0440\u0438\u043A\u0438", "\u0425\u0430\u043C\u043E\u0432\u043D\u0438\u043A\u0438", "\u0410\u0440\u0431\u0430\u0442", "\u0421\u043E\u043A\u043E\u043B", "\u0422\u0432\u0435\u0440\u0441\u043A\u043E\u0439", "\u041F\u0440\u0435\u0441\u043D\u044F", "\u042F\u043A\u0438\u043C\u0430\u043D\u043A\u0430", "\u0417\u0430\u043C\u043E\u0441\u043A\u0432\u043E\u0440\u0435\u0447\u044C\u0435", "\u041E\u0441\u0442\u043E\u0436\u0435\u043D\u043A\u0430", "\u0422\u0430\u0433\u0430\u043D\u043A\u0430"];
  const VAR_METRO = ["\u0422\u0432\u0435\u0440\u0441\u043A\u0430\u044F", "\u041A\u0443\u0440\u0441\u043A\u0430\u044F", "\u0411\u0435\u043B\u043E\u0440\u0443\u0441\u0441\u043A\u0430\u044F", "\u0427\u0438\u0441\u0442\u044B\u0435 \u043F\u0440\u0443\u0434\u044B", "\u041E\u043A\u0442\u044F\u0431\u0440\u044C\u0441\u043A\u0430\u044F", "\u0422\u0430\u0433\u0430\u043D\u0441\u043A\u0430\u044F", "\u041A\u0438\u0442\u0430\u0439-\u0433\u043E\u0440\u043E\u0434", "\u0426\u0432\u0435\u0442\u043D\u043E\u0439 \u0431\u0443\u043B\u044C\u0432\u0430\u0440", "\u041F\u043E\u043B\u044F\u043D\u043A\u0430", "\u0421\u043C\u043E\u043B\u0435\u043D\u0441\u043A\u0430\u044F"];
  const VAR_FLOWER = ["\u0420\u043E\u0437\u044B", "\u0422\u044E\u043B\u044C\u043F\u0430\u043D\u044B", "\u0425\u0440\u0438\u0437\u0430\u043D\u0442\u0435\u043C\u044B", "\u0413\u043E\u0440\u0442\u0435\u043D\u0437\u0438\u044F", "\u041F\u0438\u043E\u043D\u044B", "\u042D\u0443\u0441\u0442\u043E\u043C\u0430", "\u0410\u043B\u044C\u0441\u0442\u0440\u043E\u043C\u0435\u0440\u0438\u044F", "\u0420\u0430\u043D\u0443\u043D\u043A\u0443\u043B\u044E\u0441\u044B"];
  const FRESHES = ["today", "d1_2", "d3_plus"];
  const ALL = [];
  BASE.forEach((d, i) => ALL.push({ ...d, _id: "a" + i }));
  BASE.forEach((d, i) => ALL.push({
    ...d,
    _id: "b" + i,
    price: Math.round(d.price * (i % 2 ? 1.4 : 0.8) / 10) * 10,
    fresh: FRESHES[(i + 1) % 3],
    district: DISTRICTS[(i + 3) % DISTRICTS.length],
    metro: VAR_METRO[(i + 2) % VAR_METRO.length],
    flowers: [VAR_FLOWER[i % VAR_FLOWER.length]],
    likes: Math.max(3, (d.likes || 20) - 7 + i % 5 * 4),
    seller: { ...d.seller, r: Math.min(5, Math.max(4.3, (d.seller.r || 4.7) - 0.2 + i % 3 * 0.15)) }
  }));
  const PRICE = { any: () => true, lt1k: (p) => p < 1e3, "1k2k": (p) => p >= 1e3 && p <= 2e3, gt2k: (p) => p > 2e3 };
  const RATING = { any: () => true, "45": (r) => r >= 4.5, "48": (r) => r >= 4.8, "5": (r) => r >= 5 };
  const FLOWER_OPTS = (PD_FLOWER_FILTERS || []).map((f) => [f, f]);
  const FILTERS = {
    price: { label: "\u0426\u0435\u043D\u0430", opts: [["lt1k", "\u0434\u043E 1 000 \u20BD"], ["1k2k", "1 000\u20132 000 \u20BD"], ["gt2k", "2 000 \u20BD+"]] },
    fresh: { label: "\u0421\u0432\u0435\u0436\u0435\u0441\u0442\u044C", opts: [["today", "\u0421\u0432\u0435\u0436\u0438\u0439"], ["d1_2", "1\u20132 \u0434\u043D\u044F"], ["d3_plus", "3+ \u0434\u043D\u044F"]] },
    flower: { label: "\u0422\u0438\u043F \u0446\u0432\u0435\u0442\u043E\u0432", opts: FLOWER_OPTS },
    rating: { label: "\u0420\u0435\u0439\u0442\u0438\u043D\u0433 \u043F\u0440\u043E\u0434\u0430\u0432\u0446\u0430", opts: [["45", "4,5+"], ["48", "4,8+"], ["5", "5,0"]] },
    size: { label: "\u0420\u0430\u0437\u043C\u0435\u0440 \u0431\u0443\u043A\u0435\u0442\u0430", opts: [["S", "S \xB7 \u0434\u043E 7"], ["M", "M \xB7 7\u201315"], ["L", "L \xB7 15\u201325"], ["XL", "XL \xB7 25+"]] }
  };
  const SORTS = [["fresh", "\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0441\u0432\u0435\u0436\u0438\u0435"], ["cheap", "\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0434\u0435\u0448\u0435\u0432\u043B\u0435"], ["exp", "\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0434\u043E\u0440\u043E\u0436\u0435"], ["rating", "\u041F\u043E \u0440\u0435\u0439\u0442\u0438\u043D\u0433\u0443"]];
  const FRESH_RANK = { today: 0, d1_2: 1, d3_plus: 2 };
  const ico = (Fn, cls) => Fn ? Fn({ className: cls, fill: "none", stroke: "currentColor" }) : null;
  const Sliders = (p) => /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", ...p, fill: "none", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round", children: [
    /* @__PURE__ */ jsx("path", { d: "M4 7h16M4 12h16M4 17h16" }),
    /* @__PURE__ */ jsx("circle", { cx: "9", cy: "7", r: "2.3", fill: "currentColor", stroke: "none" }),
    /* @__PURE__ */ jsx("circle", { cx: "15", cy: "12", r: "2.3", fill: "currentColor", stroke: "none" }),
    /* @__PURE__ */ jsx("circle", { cx: "8", cy: "17", r: "2.3", fill: "currentColor", stroke: "none" })
  ] });
  const ChevD = (p) => /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", ...p, fill: "none", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx("path", { d: "m6 9 6 6 6-6" }) });
  const CloseX = (p) => /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", ...p, fill: "none", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx("path", { d: "m6 6 12 12M18 6 6 18" }) });
  function SortDropdown({ sort, setSort }) {
    const [open, setOpen] = React.useState(false);
    const ref = React.useRef(null);
    React.useEffect(() => {
      if (!open) return;
      const o = (e) => {
        if (ref.current && !ref.current.contains(e.target)) setOpen(false);
      };
      document.addEventListener("mousedown", o);
      return () => document.removeEventListener("mousedown", o);
    }, [open]);
    const cur = SORTS.find(([v]) => v === sort);
    return /* @__PURE__ */ jsxs("div", { className: "pdc-sortdd" + (open ? " open" : ""), ref, children: [
      /* @__PURE__ */ jsxs("button", { type: "button", className: "pdc-sortdd-btn", onClick: () => setOpen((o) => !o), children: [
        /* @__PURE__ */ jsx("span", { className: "l", children: "\u0421\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u043A\u0430:" }),
        /* @__PURE__ */ jsx("span", { className: "v", children: cur ? cur[1] : "" }),
        /* @__PURE__ */ jsx(ChevD, { className: "chev pd-i16" })
      ] }),
      open && /* @__PURE__ */ jsx("div", { className: "pdc-sortdd-menu", children: SORTS.map(([v, l]) => /* @__PURE__ */ jsx("button", { type: "button", className: "pdc-sortdd-row" + (sort === v ? " on" : ""), onClick: () => {
        setSort(v);
        setOpen(false);
      }, children: l }, v)) })
    ] });
  }
  const Header = () => /* @__PURE__ */ jsx(PdWebNav, { active: "\u041A\u0430\u0442\u0430\u043B\u043E\u0433" });
  return function PdCatalog2({ platform = "desktop" }) {
    const desk = platform === "desktop";
    const MetroPicker = PdMetroPicker;
    const [f, setF] = React.useState({ price: "any", fresh: "any", flower: "any", rating: "any", size: "any" });
    const [metros, setMetros] = React.useState([]);
    const [sort, setSort] = React.useState("fresh");
    const [shown, setShown] = React.useState(desk ? 16 : 10);
    const [sheet, setSheet] = React.useState(false);
    const filtered = React.useMemo(() => {
      let r = ALL.filter(
        (d) => PRICE[f.price](d.price) && (f.fresh === "any" || d.fresh === f.fresh) && (f.flower === "any" || (d.flowers || []).includes(f.flower)) && RATING[f.rating](d.seller.r) && (f.size === "any" || d.size === f.size) && (metros.length === 0 || metros.includes(d.metro))
      );
      r = r.slice().sort((a, b) => {
        if (sort === "cheap") return a.price - b.price;
        if (sort === "exp") return b.price - a.price;
        if (sort === "rating") return b.seller.r - a.seller.r;
        return FRESH_RANK[a.fresh] - FRESH_RANK[b.fresh] || b.likes - a.likes;
      });
      return r;
    }, [f, sort, metros]);
    const set = (k, v) => {
      setF((s) => ({ ...s, [k]: v }));
      setShown(desk ? 16 : 10);
    };
    const toggleMetro = (s) => {
      setMetros((m) => s === null ? [] : m.includes(s) ? m.filter((x) => x !== s) : [...m, s]);
      setShown(desk ? 16 : 10);
    };
    const reset = () => {
      setF({ price: "any", fresh: "any", flower: "any", rating: "any", size: "any" });
      setMetros([]);
      setSort("fresh");
    };
    const active = Object.values(f).filter((v) => v !== "any").length + metros.length;
    const chip = (k, val, lab, isStar) => /* @__PURE__ */ jsxs("button", { className: "pdc-fchip" + (f[k] === val ? " on" : ""), onClick: () => set(k, f[k] === val ? "any" : val), children: [
      isStar && /\d/.test(lab) ? /* @__PURE__ */ jsx("span", { className: "st", children: "\u2605" }) : null,
      lab
    ] }, val);
    return /* @__PURE__ */ jsxs("div", { className: "pd-root pd-web pdc" + (desk ? " pdc--desk" : ""), "data-pd-theme": "a", children: [
      /* @__PURE__ */ jsx(Header, { desk }),
      /* @__PURE__ */ jsxs("main", { className: "pd-scroll pdw-scroll", children: [
        /* @__PURE__ */ jsxs("div", { className: "pdc-head", children: [
          /* @__PURE__ */ jsxs("p", { className: "pdc-crumbs", children: [
            /* @__PURE__ */ jsx("a", { href: "\u041F\u0435\u0440\u0435\u0434\u0430\u0440\u0438\u043C \xB7 \u041B\u0435\u043D\u0434\u0438\u043D\u0433 peredarim.ru.html", children: "\u0413\u043B\u0430\u0432\u043D\u0430\u044F" }),
            " \xB7 \u041A\u0430\u0442\u0430\u043B\u043E\u0433 \xB7 \u041C\u043E\u0441\u043A\u0432\u0430"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "pdc-titlerow", children: [
            /* @__PURE__ */ jsx("h1", { className: "pdc-title", children: "\u0421\u0432\u0435\u0436\u0438\u0435 \u0431\u0443\u043A\u0435\u0442\u044B \u0432 \u041C\u043E\u0441\u043A\u0432\u0435" }),
            /* @__PURE__ */ jsxs("span", { className: "pdc-count", children: [
              /* @__PURE__ */ jsx("span", { className: "d" }),
              filtered.length,
              " \u0431\u0443\u043A\u0435\u0442\u043E\u0432",
              active ? ` \xB7 \u0444\u0438\u043B\u044C\u0442\u0440\u043E\u0432: ${active}` : ""
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pdc-body", children: [
          /* @__PURE__ */ jsxs("aside", { className: "pdc-side", children: [
            /* @__PURE__ */ jsxs("div", { className: "pdc-fblock", children: [
              /* @__PURE__ */ jsx("h4", { children: "\u041C\u0435\u0442\u0440\u043E" }),
              /* @__PURE__ */ jsx(MetroPicker, { cityKey: "msk", multi: true, values: metros, onToggle: toggleMetro, placeholder: "\u041B\u044E\u0431\u044B\u0435 \u0441\u0442\u0430\u043D\u0446\u0438\u0438" }),
              metros.length > 0 && /* @__PURE__ */ jsx("div", { className: "pdc-metrotags", children: metros.map((m) => /* @__PURE__ */ jsxs("button", { className: "pdc-metrotag", onClick: () => toggleMetro(m), children: [
                "\u043C. ",
                m,
                /* @__PURE__ */ jsx(CloseX, { className: "pd-i12" })
              ] }, m)) })
            ] }),
            Object.entries(FILTERS).map(([k, g]) => /* @__PURE__ */ jsxs("div", { className: "pdc-fblock", children: [
              /* @__PURE__ */ jsx("h4", { children: g.label }),
              /* @__PURE__ */ jsx("div", { className: "pdc-fopts", children: g.opts.map(([val, lab]) => chip(k, val, lab, k === "rating")) })
            ] }, k)),
            /* @__PURE__ */ jsx("button", { className: "pdc-reset", onClick: reset, children: "\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u0444\u0438\u043B\u044C\u0442\u0440\u044B" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "pdc-main", children: [
            /* @__PURE__ */ jsxs("div", { className: "pdc-mbar", children: [
              /* @__PURE__ */ jsxs("button", { className: "pdc-mchip pdc-mchip--filters", onClick: () => setSheet(true), children: [
                /* @__PURE__ */ jsx(Sliders, { className: "pd-i16" }),
                "\u0424\u0438\u043B\u044C\u0442\u0440\u044B",
                active ? ` \xB7 ${active}` : ""
              ] }),
              /* @__PURE__ */ jsxs("button", { className: "pdc-mchip" + (metros.length ? " on" : ""), onClick: () => setSheet(true), children: [
                ico(Ic2.pin, "pd-i14"),
                metros.length ? metros.length === 1 ? `\u043C. ${metros[0]}` : `\u041C\u0435\u0442\u0440\u043E \xB7 ${metros.length}` : "\u041C\u0435\u0442\u0440\u043E"
              ] }),
              FILTERS.price.opts.slice(1).map(([v, l]) => /* @__PURE__ */ jsx("button", { className: "pdc-mchip" + (f.price === v ? " on" : ""), onClick: () => set("price", f.price === v ? "any" : v), children: l }, v)),
              /* @__PURE__ */ jsx("button", { className: "pdc-mchip" + (f.fresh === "today" ? " on" : ""), onClick: () => set("fresh", f.fresh === "today" ? "any" : "today"), children: "\u0421\u0432\u0435\u0436\u0438\u0439" }),
              ["\u0420\u043E\u0437\u044B", "\u041F\u0438\u043E\u043D\u044B", "\u0422\u044E\u043B\u044C\u043F\u0430\u043D\u044B"].map((fl) => /* @__PURE__ */ jsx("button", { className: "pdc-mchip" + (f.flower === fl ? " on" : ""), onClick: () => set("flower", f.flower === fl ? "any" : fl), children: fl }, fl)),
              /* @__PURE__ */ jsx("button", { className: "pdc-mchip" + (f.rating === "48" ? " on" : ""), onClick: () => set("rating", f.rating === "48" ? "any" : "48"), children: "\u2605 4,8+" })
            ] }),
            sheet && /* @__PURE__ */ jsxs("div", { className: "pdc-panel", children: [
              /* @__PURE__ */ jsxs("div", { className: "pdc-panel-head", children: [
                /* @__PURE__ */ jsx("span", { children: "\u0412\u0441\u0435 \u0444\u0438\u043B\u044C\u0442\u0440\u044B" }),
                /* @__PURE__ */ jsx("button", { className: "pdc-panel-x", onClick: () => setSheet(false), "aria-label": "\u0421\u0432\u0435\u0440\u043D\u0443\u0442\u044C", children: /* @__PURE__ */ jsx(CloseX, { className: "pd-i18" }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "pdc-panel-grp", children: [
                /* @__PURE__ */ jsx("h4", { children: "\u041C\u0435\u0442\u0440\u043E" }),
                /* @__PURE__ */ jsx(MetroPicker, { cityKey: "msk", multi: true, values: metros, onToggle: toggleMetro, placeholder: "\u041B\u044E\u0431\u044B\u0435 \u0441\u0442\u0430\u043D\u0446\u0438\u0438" }),
                metros.length > 0 && /* @__PURE__ */ jsx("div", { className: "pdc-metrotags", children: metros.map((m) => /* @__PURE__ */ jsxs("button", { className: "pdc-metrotag", onClick: () => toggleMetro(m), children: [
                  "\u043C. ",
                  m,
                  /* @__PURE__ */ jsx(CloseX, { className: "pd-i12" })
                ] }, m)) })
              ] }),
              Object.entries(FILTERS).map(([k, g]) => /* @__PURE__ */ jsxs("div", { className: "pdc-panel-grp", children: [
                /* @__PURE__ */ jsx("h4", { children: g.label }),
                /* @__PURE__ */ jsx("div", { className: "pdc-fopts", children: g.opts.map(([val, lab]) => chip(k, val, lab, k === "rating")) })
              ] }, k)),
              /* @__PURE__ */ jsxs("div", { className: "pdc-panel-foot", children: [
                /* @__PURE__ */ jsxs("button", { className: "pdc-sheet-reset", onClick: reset, children: [
                  "\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C",
                  active ? ` (${active})` : ""
                ] }),
                /* @__PURE__ */ jsxs("button", { className: "pdc-sheet-apply", onClick: () => setSheet(false), children: [
                  "\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C ",
                  filtered.length,
                  " \u0431\u0443\u043A\u0435\u0442\u043E\u0432"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "pdc-toolbar", children: [
              /* @__PURE__ */ jsxs("span", { className: "pdc-count", style: { fontSize: 13 }, children: [
                filtered.length,
                " \u0431\u0443\u043A\u0435\u0442\u043E\u0432"
              ] }),
              /* @__PURE__ */ jsx(SortDropdown, { sort, setSort }),
              /* @__PURE__ */ jsxs("div", { className: "pdc-sort pdc-sort--desk", children: [
                /* @__PURE__ */ jsx("span", { className: "l", children: "\u0421\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u043A\u0430:" }),
                /* @__PURE__ */ jsx("div", { className: "pdc-sortsel", children: SORTS.map(([v, l]) => /* @__PURE__ */ jsx("button", { className: "pdc-sortbtn" + (sort === v ? " on" : ""), onClick: () => setSort(v), children: l }, v)) })
              ] })
            ] }),
            filtered.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "pdc-empty", children: [
              /* @__PURE__ */ jsx("b", { children: "\u041D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043D\u0430\u0448\u043B\u043E\u0441\u044C" }),
              "\u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0441\u043C\u044F\u0433\u0447\u0438\u0442\u044C \u0444\u0438\u043B\u044C\u0442\u0440\u044B, \u043D\u0430\u043F\u0440\u0438\u043C\u0435\u0440 \u0440\u0430\u0441\u0448\u0438\u0440\u0438\u0442\u044C \u0446\u0435\u043D\u0443 \u0438\u043B\u0438 \u0441\u0432\u0435\u0436\u0435\u0441\u0442\u044C."
            ] }) : /* @__PURE__ */ jsx("div", { className: "pdc-grid", children: filtered.slice(0, shown).map((d) => /* @__PURE__ */ jsx("div", { className: "pd-rise", children: /* @__PURE__ */ jsx(Card2, { d, variant: "grid" }) }, d._id)) }),
            shown < filtered.length && /* @__PURE__ */ jsx("div", { className: "pdc-loadmore", children: /* @__PURE__ */ jsx("button", { onClick: () => setShown((n) => n + (desk ? 12 : 8)), children: "\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u0435\u0449\u0451" }) })
          ] })
        ] })
      ] })
    ] });
  };
})();

export { PdCatalog };
