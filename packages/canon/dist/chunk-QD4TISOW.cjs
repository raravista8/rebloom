'use strict';

var chunkGT5S3QFQ_cjs = require('./chunk-GT5S3QFQ.cjs');
var React = require('react');
var jsxRuntime = require('react/jsx-runtime');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React__default = /*#__PURE__*/_interopDefault(React);

var PETAL = "M50 50C38 41 36 21 50 10C64 21 62 41 50 50Z";
var Mark = ({ size = 22, center = "#E8A93B", style, className, title = "\u041F\u0435\u0440\u0435\u0434\u0430\u0440\u0438\u043C" }) => /* @__PURE__ */ jsxRuntime.jsxs("svg", { className, width: size, height: size, viewBox: "0 0 100 100", role: "img", "aria-label": title, style: { display: "block", flex: "none", ...style }, children: [
  [0, 72, 144, 216, 288].map((a) => /* @__PURE__ */ jsxRuntime.jsx("path", { d: PETAL, fill: "currentColor", transform: `rotate(${a} 50 50)` }, a)),
  /* @__PURE__ */ jsxRuntime.jsx("circle", { cx: "50", cy: "50", r: "8", fill: center })
] });
var PdCatalog = (function() {
  const Ic2 = chunkGT5S3QFQ_cjs.Ic, Card2 = chunkGT5S3QFQ_cjs.Card, Btn = chunkGT5S3QFQ_cjs.PdBtn;
  const FRESH = chunkGT5S3QFQ_cjs.PD_FRESH || [], LIKED = chunkGT5S3QFQ_cjs.PD_LIKED || [];
  const BASE = [...FRESH, ...LIKED];
  const DISTRICTS = ["\u041F\u0430\u0442\u0440\u0438\u043A\u0438", "\u0425\u0430\u043C\u043E\u0432\u043D\u0438\u043A\u0438", "\u0410\u0440\u0431\u0430\u0442", "\u0421\u043E\u043A\u043E\u043B", "\u0422\u0432\u0435\u0440\u0441\u043A\u043E\u0439", "\u041F\u0440\u0435\u0441\u043D\u044F", "\u042F\u043A\u0438\u043C\u0430\u043D\u043A\u0430", "\u0417\u0430\u043C\u043E\u0441\u043A\u0432\u043E\u0440\u0435\u0447\u044C\u0435", "\u041E\u0441\u0442\u043E\u0436\u0435\u043D\u043A\u0430", "\u0422\u0430\u0433\u0430\u043D\u043A\u0430"];
  const FRESHES = ["today", "d1_2", "d3_plus"];
  const ALL = [];
  BASE.forEach((d, i) => ALL.push({ ...d, _id: "a" + i }));
  BASE.forEach((d, i) => ALL.push({
    ...d,
    _id: "b" + i,
    price: Math.round(d.price * (i % 2 ? 1.4 : 0.8) / 10) * 10,
    fresh: FRESHES[(i + 1) % 3],
    district: DISTRICTS[(i + 3) % DISTRICTS.length],
    likes: Math.max(3, (d.likes || 20) - 7 + i % 5 * 4),
    seller: { ...d.seller, r: Math.min(5, Math.max(4.3, (d.seller.r || 4.7) - 0.2 + i % 3 * 0.15)) }
  }));
  const PRICE = { any: () => true, lt1k: (p) => p < 1e3, "1k2k": (p) => p >= 1e3 && p <= 2e3, gt2k: (p) => p > 2e3 };
  const RATING = { any: () => true, "45": (r) => r >= 4.5, "48": (r) => r >= 4.8, "5": (r) => r >= 5 };
  const FILTERS = {
    price: { label: "\u0426\u0435\u043D\u0430", opts: [["lt1k", "\u0434\u043E 1 000 \u20BD"], ["1k2k", "1 000\u20132 000 \u20BD"], ["gt2k", "2 000 \u20BD+"]] },
    fresh: { label: "\u0421\u0432\u0435\u0436\u0435\u0441\u0442\u044C", opts: [["today", "\u0421\u0435\u0433\u043E\u0434\u043D\u044F"], ["d1_2", "1\u20132 \u0434\u043D\u044F"]] },
    rating: { label: "\u0420\u0435\u0439\u0442\u0438\u043D\u0433 \u043F\u0440\u043E\u0434\u0430\u0432\u0446\u0430", opts: [["45", "4,5+"], ["48", "4,8+"], ["5", "5,0"]] },
    size: { label: "\u0420\u0430\u0437\u043C\u0435\u0440", opts: [["S", "S"], ["M", "M"], ["L", "L"], ["XL", "XL"]] }
  };
  const SORTS = [["fresh", "\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0441\u0432\u0435\u0436\u0438\u0435"], ["cheap", "\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0434\u0435\u0448\u0435\u0432\u043B\u0435"], ["exp", "\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0434\u043E\u0440\u043E\u0436\u0435"], ["rating", "\u041F\u043E \u0440\u0435\u0439\u0442\u0438\u043D\u0433\u0443"]];
  const FRESH_RANK = { today: 0, d1_2: 1, d3_plus: 2 };
  const ico = (Fn, cls) => Fn ? Fn({ className: cls, fill: "none", stroke: "currentColor" }) : null;
  const Sliders = (p) => /* @__PURE__ */ jsxRuntime.jsxs("svg", { viewBox: "0 0 24 24", ...p, fill: "none", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round", children: [
    /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M4 7h16M4 12h16M4 17h16" }),
    /* @__PURE__ */ jsxRuntime.jsx("circle", { cx: "9", cy: "7", r: "2.3", fill: "currentColor", stroke: "none" }),
    /* @__PURE__ */ jsxRuntime.jsx("circle", { cx: "15", cy: "12", r: "2.3", fill: "currentColor", stroke: "none" }),
    /* @__PURE__ */ jsxRuntime.jsx("circle", { cx: "8", cy: "17", r: "2.3", fill: "currentColor", stroke: "none" })
  ] });
  function Header({ desk }) {
    const Bell = (p) => /* @__PURE__ */ jsxRuntime.jsxs("svg", { viewBox: "0 0 24 24", ...p, fill: "none", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round", strokeLinejoin: "round", children: [
      /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" }),
      /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M10 19a2 2 0 0 0 4 0" })
    ] });
    return /* @__PURE__ */ jsxRuntime.jsx("header", { className: "pdl-nav", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-nav-in", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("a", { href: "\u041F\u0435\u0440\u0435\u0434\u0430\u0440\u0438\u043C \xB7 \u041B\u0435\u043D\u0434\u0438\u043D\u0433 peredarim.ru.html", className: "pdl-brand", style: { textDecoration: "none" }, children: [
        /* @__PURE__ */ jsxRuntime.jsx(Mark, { size: 24 }),
        "\u041F\u0435\u0440\u0435\u0434\u0430\u0440\u0438\u043C"
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-nav-mid", children: [
        /* @__PURE__ */ jsxRuntime.jsxs("button", { className: "pdl-nav-city", children: [
          ico(Ic2.pin, "pd-i16"),
          "\u041C\u043E\u0441\u043A\u0432\u0430",
          ico(Ic2.chev, "pd-i14")
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-nav-search", children: [
          ico(Ic2.search, "pd-i18"),
          /* @__PURE__ */ jsxRuntime.jsx("span", { children: "\u041F\u043E\u0438\u0441\u043A \u0441\u0432\u0435\u0436\u0438\u0445 \u0431\u0443\u043A\u0435\u0442\u043E\u0432 \u0432 \u041C\u043E\u0441\u043A\u0432\u0435" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-navright", children: [
        /* @__PURE__ */ jsxRuntime.jsx("button", { className: "pdl-nav-icon pdc-notif", "aria-label": "\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F", children: /* @__PURE__ */ jsxRuntime.jsx(Bell, {}) }),
        /* @__PURE__ */ jsxRuntime.jsx(Btn, { variant: "primary", icon: Ic2 && Ic2.plus, children: "\u041F\u0440\u043E\u0434\u0430\u0442\u044C \u0431\u0443\u043A\u0435\u0442" })
      ] })
    ] }) });
  }
  return function PdCatalog2({ platform = "desktop" }) {
    const desk = platform === "desktop";
    const [f, setF] = React__default.default.useState({ price: "any", fresh: "any", rating: "any", size: "any" });
    const [sort, setSort] = React__default.default.useState("fresh");
    const [shown, setShown] = React__default.default.useState(desk ? 16 : 10);
    const filtered = React__default.default.useMemo(() => {
      let r = ALL.filter(
        (d) => PRICE[f.price](d.price) && (f.fresh === "any" || d.fresh === f.fresh) && RATING[f.rating](d.seller.r) && (f.size === "any" || d.size === f.size)
      );
      r = r.slice().sort((a, b) => {
        if (sort === "cheap") return a.price - b.price;
        if (sort === "exp") return b.price - a.price;
        if (sort === "rating") return b.seller.r - a.seller.r;
        return FRESH_RANK[a.fresh] - FRESH_RANK[b.fresh] || b.likes - a.likes;
      });
      return r;
    }, [f, sort]);
    const set = (k, v) => {
      setF((s) => ({ ...s, [k]: v }));
      setShown(desk ? 16 : 10);
    };
    const reset = () => {
      setF({ price: "any", fresh: "any", rating: "any", size: "any" });
      setSort("fresh");
    };
    const active = Object.values(f).filter((v) => v !== "any").length;
    const chip = (k, val, lab, isStar) => /* @__PURE__ */ jsxRuntime.jsxs("button", { className: "pdc-fchip" + (f[k] === val ? " on" : ""), onClick: () => set(k, f[k] === val ? "any" : val), children: [
      isStar && /\d/.test(lab) ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "st", children: "\u2605" }) : null,
      lab
    ] }, val);
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pd-root pd-web pdc" + (desk ? " pdc--desk" : ""), "data-pd-theme": "a", children: [
      /* @__PURE__ */ jsxRuntime.jsx(Header, { desk }),
      /* @__PURE__ */ jsxRuntime.jsxs("main", { className: "pd-scroll pdw-scroll", children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdc-head", children: [
          /* @__PURE__ */ jsxRuntime.jsxs("p", { className: "pdc-crumbs", children: [
            /* @__PURE__ */ jsxRuntime.jsx("a", { href: "\u041F\u0435\u0440\u0435\u0434\u0430\u0440\u0438\u043C \xB7 \u041B\u0435\u043D\u0434\u0438\u043D\u0433 peredarim.ru.html", children: "\u0413\u043B\u0430\u0432\u043D\u0430\u044F" }),
            " \xB7 \u041A\u0430\u0442\u0430\u043B\u043E\u0433 \xB7 \u041C\u043E\u0441\u043A\u0432\u0430"
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdc-titlerow", children: [
            /* @__PURE__ */ jsxRuntime.jsx("h1", { className: "pdc-title", children: "\u0421\u0432\u0435\u0436\u0438\u0435 \u0431\u0443\u043A\u0435\u0442\u044B \u0432 \u041C\u043E\u0441\u043A\u0432\u0435" }),
            /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "pdc-count", children: [
              /* @__PURE__ */ jsxRuntime.jsx("span", { className: "d" }),
              filtered.length,
              " \u0431\u0443\u043A\u0435\u0442\u043E\u0432",
              active ? ` \xB7 \u0444\u0438\u043B\u044C\u0442\u0440\u043E\u0432: ${active}` : ""
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdc-body", children: [
          /* @__PURE__ */ jsxRuntime.jsxs("aside", { className: "pdc-side", children: [
            Object.entries(FILTERS).map(([k, g]) => /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdc-fblock", children: [
              /* @__PURE__ */ jsxRuntime.jsx("h4", { children: g.label }),
              /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pdc-fopts", children: g.opts.map(([val, lab]) => chip(k, val, lab, k === "rating")) })
            ] }, k)),
            /* @__PURE__ */ jsxRuntime.jsx("button", { className: "pdc-reset", onClick: reset, children: "\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u0444\u0438\u043B\u044C\u0442\u0440\u044B" })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdc-main", children: [
            /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdc-mbar", children: [
              /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "pdc-mchip", children: [
                /* @__PURE__ */ jsxRuntime.jsx(Sliders, { className: "pd-i16" }),
                "\u0424\u0438\u043B\u044C\u0442\u0440\u044B",
                active ? ` \xB7 ${active}` : ""
              ] }),
              FILTERS.price.opts.slice(1).map(([v, l]) => /* @__PURE__ */ jsxRuntime.jsx("button", { className: "pdc-mchip" + (f.price === v ? " on" : ""), onClick: () => set("price", f.price === v ? "any" : v), children: l }, v)),
              /* @__PURE__ */ jsxRuntime.jsx("button", { className: "pdc-mchip" + (f.fresh === "today" ? " on" : ""), onClick: () => set("fresh", f.fresh === "today" ? "any" : "today"), children: "\u0421\u0435\u0433\u043E\u0434\u043D\u044F" }),
              /* @__PURE__ */ jsxRuntime.jsx("button", { className: "pdc-mchip" + (f.rating === "48" ? " on" : ""), onClick: () => set("rating", f.rating === "48" ? "any" : "48"), children: "\u2605 4,8+" })
            ] }),
            /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdc-toolbar", children: [
              /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "pdc-count", style: { fontSize: 13 }, children: [
                filtered.length,
                " \u0431\u0443\u043A\u0435\u0442\u043E\u0432"
              ] }),
              /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdc-sort", children: [
                /* @__PURE__ */ jsxRuntime.jsx("span", { className: "l", children: "\u0421\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u043A\u0430:" }),
                /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pdc-sortsel", children: SORTS.map(([v, l]) => /* @__PURE__ */ jsxRuntime.jsx("button", { className: "pdc-sortbtn" + (sort === v ? " on" : ""), onClick: () => setSort(v), children: l }, v)) })
              ] })
            ] }),
            filtered.length === 0 ? /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdc-empty", children: [
              /* @__PURE__ */ jsxRuntime.jsx("b", { children: "\u041D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043D\u0430\u0448\u043B\u043E\u0441\u044C" }),
              "\u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0441\u043C\u044F\u0433\u0447\u0438\u0442\u044C \u0444\u0438\u043B\u044C\u0442\u0440\u044B, \u043D\u0430\u043F\u0440\u0438\u043C\u0435\u0440 \u0440\u0430\u0441\u0448\u0438\u0440\u0438\u0442\u044C \u0446\u0435\u043D\u0443 \u0438\u043B\u0438 \u0441\u0432\u0435\u0436\u0435\u0441\u0442\u044C."
            ] }) : /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pdc-grid", children: filtered.slice(0, shown).map((d) => /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pd-rise", children: /* @__PURE__ */ jsxRuntime.jsx(Card2, { d, variant: "grid" }) }, d._id)) }),
            shown < filtered.length && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pdc-loadmore", children: /* @__PURE__ */ jsxRuntime.jsx("button", { onClick: () => setShown((n) => n + (desk ? 12 : 8)), children: "\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u0435\u0449\u0451" }) })
          ] })
        ] })
      ] })
    ] });
  };
})();

exports.PdCatalog = PdCatalog;
