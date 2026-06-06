'use strict';

var chunkGT5S3QFQ_cjs = require('./chunk-GT5S3QFQ.cjs');
var React2 = require('react');
var jsxRuntime = require('react/jsx-runtime');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React2__default = /*#__PURE__*/_interopDefault(React2);

var PETAL = "M50 50C38 41 36 21 50 10C64 21 62 41 50 50Z";
var Mark = ({ size = 22, center = "#E8A93B", style, className, title = "\u041F\u0435\u0440\u0435\u0434\u0430\u0440\u0438\u043C" }) => /* @__PURE__ */ jsxRuntime.jsxs("svg", { className, width: size, height: size, viewBox: "0 0 100 100", role: "img", "aria-label": title, style: { display: "block", flex: "none", ...style }, children: [
  [0, 72, 144, 216, 288].map((a) => /* @__PURE__ */ jsxRuntime.jsx("path", { d: PETAL, fill: "currentColor", transform: `rotate(${a} 50 50)` }, a)),
  /* @__PURE__ */ jsxRuntime.jsx("circle", { cx: "50", cy: "50", r: "8", fill: center })
] });
var PdLanding = (function() {
  const Ic2 = chunkGT5S3QFQ_cjs.Ic, Btn2 = chunkGT5S3QFQ_cjs.PdBtn, Card3 = chunkGT5S3QFQ_cjs.Card;
  const FRESH2 = chunkGT5S3QFQ_cjs.PD_FRESH || [], LIKED2 = chunkGT5S3QFQ_cjs.PD_LIKED || [];
  const HERO_IMG = "img/hero-lacybird.png";
  const CITIES = [
    { id: "msk", name: "\u041C\u043E\u0441\u043A\u0432\u0430", count: 128 },
    { id: "spb", name: "\u0421\u0430\u043D\u043A\u0442-\u041F\u0435\u0442\u0435\u0440\u0431\u0443\u0440\u0433", count: 86 },
    { id: "kzn", name: "\u041A\u0430\u0437\u0430\u043D\u044C", count: 41 },
    { id: "ekb", name: "\u0415\u043A\u0430\u0442\u0435\u0440\u0438\u043D\u0431\u0443\u0440\u0433", count: 33 },
    { id: "nsk", name: "\u041D\u043E\u0432\u043E\u0441\u0438\u0431\u0438\u0440\u0441\u043A", count: 27 }
  ];
  [...FRESH2.slice(0, 4), ...LIKED2.slice(0, 4)].slice(0, 8);
  const G = {
    apple: /* @__PURE__ */ jsxRuntime.jsx("svg", { viewBox: "0 0 24 24", width: "34", height: "34", fill: "#fff", children: /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M16.4 12.6c0-2.2 1.8-3.3 1.9-3.3-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.6.8-3.3.8-.7 0-1.7-.8-2.8-.8-1.5 0-2.8.8-3.6 2.1-1.5 2.7-.4 6.6 1.1 8.8.7 1 1.5 2.2 2.6 2.2 1 0 1.4-.7 2.7-.7 1.2 0 1.6.7 2.7.6 1.1 0 1.8-1 2.5-2 .8-1.2 1.1-2.3 1.1-2.4-.1 0-2.1-.8-2.1-3.1zM14.3 6.1c.6-.7 1-1.7.9-2.7-.8 0-1.9.6-2.5 1.3-.5.6-1 1.6-.9 2.6.9.1 1.8-.5 2.5-1.2z" }) }),
    play: /* @__PURE__ */ jsxRuntime.jsxs("svg", { viewBox: "0 0 24 24", width: "33", height: "33", children: [
      /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M4 3.5v17l9.5-8.5L4 3.5z", fill: "#2BD27A" }),
      /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M13.5 12 4 3.5l11.5 6.4L13.5 12z", fill: "#FFC93A" }),
      /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M13.5 12 4 20.5l11.5-6.4L13.5 12z", fill: "#FF5A5F" }),
      /* @__PURE__ */ jsxRuntime.jsx("path", { d: "m15.5 9.9 4 2.1-4 2.2L13.5 12l2-2.1z", fill: "#3B9DFF" })
    ] }),
    rustore: /* @__PURE__ */ jsxRuntime.jsxs("svg", { viewBox: "0 0 24 24", width: "34", height: "34", children: [
      /* @__PURE__ */ jsxRuntime.jsx("rect", { x: "3", y: "3", width: "18", height: "18", rx: "5", fill: "#0A6CFF" }),
      /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M8 7.5h5.2c1.7 0 2.8 1 2.8 2.6 0 1.2-.7 2.1-1.8 2.4l2 4H14l-1.8-3.7H10V16.5H8v-9zm2 1.7v2.4h2.9c.7 0 1.1-.5 1.1-1.2 0-.7-.4-1.2-1.1-1.2H10z", fill: "#fff" })
    ] }),
    gallery: /* @__PURE__ */ jsxRuntime.jsxs("svg", { viewBox: "0 0 24 24", width: "34", height: "34", children: [
      /* @__PURE__ */ jsxRuntime.jsx("circle", { cx: "12", cy: "12", r: "9", fill: "#E33B3B" }),
      /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M9.2 8.5c0 2.3 1.2 4 2.8 4s2.8-1.7 2.8-4M8 13.8c.9 1.6 2.3 2.7 4 2.7s3.1-1.1 4-2.7", stroke: "#fff", strokeWidth: "1.4", fill: "none", strokeLinecap: "round" })
    ] })
  };
  const STORES = [
    { id: "ios", glyph: G.apple, small: "\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u0435 \u0432", name: "App Store" },
    { id: "play", glyph: G.play, small: "\u0414\u043E\u0441\u0442\u0443\u043F\u043D\u043E \u0432", name: "Google Play" },
    { id: "rustore", glyph: G.rustore, small: "\u0423\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u0435 \u0438\u0437", name: "RuStore" },
    { id: "gallery", glyph: G.gallery, small: "\u041E\u0442\u043A\u0440\u043E\u0439\u0442\u0435 \u0432", name: "AppGallery" }
  ];
  const Leaf2 = (p) => /* @__PURE__ */ jsxRuntime.jsxs("svg", { viewBox: "0 0 24 24", ...p, children: [
    /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M5 19c0-7 5-12 14-13 0 9-5 13-11 13-1.5 0-3 .5-3 .5", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" }),
    /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M5 19c2-4 5-6 9-7", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round" })
  ] });
  const Tag2 = (p) => /* @__PURE__ */ jsxRuntime.jsxs("svg", { viewBox: "0 0 24 24", ...p, fill: "none", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M20 12 12 20l-8-8V4h8z" }),
    /* @__PURE__ */ jsxRuntime.jsx("circle", { cx: "8.5", cy: "8.5", r: "1.3", fill: "currentColor", stroke: "none" })
  ] });
  const Shield2 = (p) => /* @__PURE__ */ jsxRuntime.jsxs("svg", { viewBox: "0 0 24 24", ...p, fill: "none", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M12 3 5 6v5c0 4.2 2.9 7.5 7 9 4.1-1.5 7-4.8 7-9V6z" }),
    /* @__PURE__ */ jsxRuntime.jsx("path", { d: "m9.2 12 1.9 1.9 3.7-3.7" })
  ] });
  const Pin2 = (p) => /* @__PURE__ */ jsxRuntime.jsxs("svg", { viewBox: "0 0 24 24", ...p, fill: "none", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z" }),
    /* @__PURE__ */ jsxRuntime.jsx("circle", { cx: "12", cy: "10", r: "2.5" })
  ] });
  const Search2 = (p) => /* @__PURE__ */ jsxRuntime.jsxs("svg", { viewBox: "0 0 24 24", ...p, fill: "none", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntime.jsx("circle", { cx: "11", cy: "11", r: "7" }),
    /* @__PURE__ */ jsxRuntime.jsx("path", { d: "m20 20-3.2-3.2" })
  ] });
  const Bell = (p) => /* @__PURE__ */ jsxRuntime.jsxs("svg", { viewBox: "0 0 24 24", ...p, fill: "none", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" }),
    /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M10 19a2 2 0 0 0 4 0" })
  ] });
  const Chev2 = (p) => /* @__PURE__ */ jsxRuntime.jsx("svg", { viewBox: "0 0 24 24", ...p, fill: "none", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxRuntime.jsx("path", { d: "m6 9 6 6 6-6" }) });
  const Menu2 = (p) => /* @__PURE__ */ jsxRuntime.jsx("svg", { viewBox: "0 0 24 24", ...p, fill: "none", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M4 7h16M4 12h16M4 17h16" }) });
  const Star = (p) => /* @__PURE__ */ jsxRuntime.jsx("svg", { viewBox: "0 0 24 24", ...p, fill: "currentColor", children: /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.6 1-5.8L3.5 9.7l5.9-.9z" }) });
  function CityChips({ cls }) {
    return /* @__PURE__ */ jsxRuntime.jsx("div", { className: cls, children: CITIES.map((c, i) => /* @__PURE__ */ jsxRuntime.jsxs("button", { className: "pdl-citychip" + (i === 0 ? " on" : ""), children: [
      c.name,
      /* @__PURE__ */ jsxRuntime.jsx("span", { className: "n", children: c.count })
    ] }, c.id)) });
  }
  function Hero({ desk }) {
    const text = /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-herotext", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("p", { className: "pdl-kicker", children: [
        /* @__PURE__ */ jsxRuntime.jsx(Leaf2, { className: "lf" }),
        "\u041B\u044E\u0434\u0438 \u043F\u0435\u0440\u0435\u0434\u0430\u0440\u0438\u0432\u0430\u044E\u0442 \u0441\u0432\u043E\u0438 \u0431\u0443\u043A\u0435\u0442\u044B"
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("h1", { className: "pdl-h1", children: [
        "\u0421\u0432\u0435\u0436\u0438\u0435 \u0431\u0443\u043A\u0435\u0442\u044B ",
        /* @__PURE__ */ jsxRuntime.jsx("em", { children: "\u043D\u0430\u043F\u0440\u044F\u043C\u0443\u044E \u043E\u0442 \u043B\u044E\u0434\u0435\u0439" }),
        ", ",
        /* @__PURE__ */ jsxRuntime.jsx("span", { style: { whiteSpace: "nowrap" }, children: "\u0432 2\u20133 \u0440\u0430\u0437\u0430" }),
        " \u0434\u0435\u0448\u0435\u0432\u043B\u0435 \u043C\u0430\u0433\u0430\u0437\u0438\u043D\u0430"
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("p", { className: "pdl-lead", children: [
        /* @__PURE__ */ jsxRuntime.jsx("b", { children: "\u0411\u0443\u043A\u0435\u0442 \u043F\u043E\u0434\u0430\u0440\u0438\u043B\u0438, \u043E\u043D \u043F\u043E\u0440\u0430\u0434\u043E\u0432\u0430\u043B \u0438 \u0443\u0436\u0435 \u043D\u0435 \u043D\u0443\u0436\u0435\u043D." }),
        " \u0412\u043C\u0435\u0441\u0442\u043E \u043C\u0443\u0441\u043E\u0440\u043A\u0438 \u0441\u0432\u0435\u0436\u0438\u0435 \u0446\u0432\u0435\u0442\u044B \u0437\u0430 \u043F\u043E\u043B\u0446\u0435\u043D\u044B \u043D\u0430\u0445\u043E\u0434\u044F\u0442 \u043D\u043E\u0432\u043E\u0433\u043E \u0445\u043E\u0437\u044F\u0438\u043D\u0430. \u0412\u044B\u0441\u0442\u0430\u0432\u044C\u0442\u0435 \u0441\u0432\u043E\u0439 \u0437\u0430 \u043C\u0438\u043D\u0443\u0442\u0443 \u0438\u043B\u0438 \u0437\u0430\u0431\u0435\u0440\u0438\u0442\u0435 \u0447\u0443\u0436\u043E\u0439."
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-cta", children: [
        /* @__PURE__ */ jsxRuntime.jsx(Btn2, { variant: "primary", lg: true, icon: Ic2 && Ic2.plus, children: "\u041E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u0442\u044C \u0431\u0443\u043A\u0435\u0442" }),
        /* @__PURE__ */ jsxRuntime.jsx(Btn2, { variant: "secondary", lg: true, children: "\u0421\u043C\u043E\u0442\u0440\u0435\u0442\u044C \u0431\u0443\u043A\u0435\u0442\u044B" })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-trust", children: [
        /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "t", children: [
          /* @__PURE__ */ jsxRuntime.jsx(Tag2, {}),
          "\u0412 2\u20133 \u0440\u0430\u0437\u0430 \u0434\u0435\u0448\u0435\u0432\u043B\u0435"
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "sep" }),
        /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "t", children: [
          /* @__PURE__ */ jsxRuntime.jsx(Shield2, {}),
          "\u041E\u043F\u043B\u0430\u0442\u0430 \u043F\u0440\u0438 \u0432\u0441\u0442\u0440\u0435\u0447\u0435"
        ] })
      ] })
    ] });
    const vis = /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pdl-herovis", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-herophoto", children: [
      /* @__PURE__ */ jsxRuntime.jsx("img", { src: HERO_IMG, alt: "\u0421\u0432\u0435\u0436\u0438\u0439 \u0431\u0443\u043A\u0435\u0442 \u0440\u043E\u0437 \u0438 \u0433\u043E\u0440\u0442\u0435\u043D\u0437\u0438\u0439", loading: "lazy" }),
      /* @__PURE__ */ jsxRuntime.jsx("span", { className: "pdl-heroscrim", "aria-hidden": "true" }),
      /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "pdl-livecount", children: [
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "pdl-livedot" }),
        "128 \u0431\u0443\u043A\u0435\u0442\u043E\u0432 \u043E\u0442 \u043B\u044E\u0434\u0435\u0439 \u0440\u044F\u0434\u043E\u043C"
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-pricetag", children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "old", children: "17 200 \u20BD \u0432 \u0446\u0432\u0435\u0442\u043E\u0447\u043D\u043E\u0439" }),
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "new", children: "\u043E\u0442 4 500 \u20BD" })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "save", children: [
          /* @__PURE__ */ jsxRuntime.jsx("b", { children: "\u221274%" }),
          /* @__PURE__ */ jsxRuntime.jsx("span", { children: "\u0434\u0435\u0448\u0435\u0432\u043B\u0435" })
        ] })
      ] })
    ] }) });
    return /* @__PURE__ */ jsxRuntime.jsx("section", { className: "pdl-hero", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-hero-in", children: [
      text,
      vis
    ] }) });
  }
  const C_POOL = [...FRESH2, ...LIKED2];
  const C_PRICE = { any: () => true, lt1k: (p) => p < 1e3, "1k2k": (p) => p >= 1e3 && p <= 2e3, gt2k: (p) => p > 2e3 };
  const C_RATING = { any: () => true, "45": (r) => r >= 4.5, "48": (r) => r >= 4.8, "5": (r) => r >= 5 };
  const FILTERS = {
    price: { label: "\u0426\u0435\u043D\u0430", opts: [["lt1k", "\u0434\u043E 1 000 \u20BD"], ["1k2k", "1 000\u20132 000 \u20BD"], ["gt2k", "2 000 \u20BD+"]] },
    fresh: { label: "\u0421\u0432\u0435\u0436\u0435\u0441\u0442\u044C", opts: [["today", "\u0421\u0435\u0433\u043E\u0434\u043D\u044F"], ["d1_2", "1\u20132 \u0434\u043D\u044F"]] },
    rating: { label: "\u0420\u0435\u0439\u0442\u0438\u043D\u0433 \u043F\u0440\u043E\u0434\u0430\u0432\u0446\u0430", opts: [["45", "4,5+"], ["48", "4,8+"], ["5", "5,0"]] }
  };
  function Catalog({ desk }) {
    const [sel, setSel] = React2__default.default.useState({ price: "any", fresh: "any", rating: "any" });
    const toggle = (k, v) => setSel((s) => ({ ...s, [k]: s[k] === v ? "any" : v }));
    const reset = () => setSel({ price: "any", fresh: "any", rating: "any" });
    const activeN = Object.values(sel).filter((v) => v !== "any").length;
    const filtered = React2__default.default.useMemo(() => C_POOL.filter(
      (d) => C_PRICE[sel.price](d.price) && (sel.fresh === "any" || d.fresh === sel.fresh) && C_RATING[sel.rating](d.seller.r)
    ), [sel]);
    const shown = filtered.slice(0, 8);
    return /* @__PURE__ */ jsxRuntime.jsx("section", { className: "pdl-sec alt", id: "catalog", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-in", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-sechead l", children: [
        /* @__PURE__ */ jsxRuntime.jsxs("p", { className: "pdl-kicker", children: [
          /* @__PURE__ */ jsxRuntime.jsx(Leaf2, { className: "lf" }),
          "\u0416\u0438\u0432\u043E\u0439 \u043A\u0430\u0442\u0430\u043B\u043E\u0433"
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx("h2", { className: "pdl-h2", children: "\u0421\u0432\u0435\u0436\u0438\u0435 \u0431\u0443\u043A\u0435\u0442\u044B \u0440\u044F\u0434\u043E\u043C, \u043F\u0440\u044F\u043C\u043E \u0441\u0435\u0439\u0447\u0430\u0441" }),
        /* @__PURE__ */ jsxRuntime.jsx("p", { className: "pdl-sub", children: "\u041C\u0435\u0442\u043A\u0430 \xAB\u0421\u0435\u0433\u043E\u0434\u043D\u044F\xBB \u0437\u043D\u0430\u0447\u0438\u0442, \u0447\u0442\u043E \u0431\u0443\u043A\u0435\u0442 \u043A\u0443\u043F\u043B\u0435\u043D \u0441\u0435\u0433\u043E\u0434\u043D\u044F. \u0421\u0432\u0435\u0436\u0435\u0441\u0442\u044C \u0442\u0430\u0435\u0442, \u043F\u043E\u044D\u0442\u043E\u043C\u0443 \u043B\u0443\u0447\u0448\u0438\u0435 \u0440\u0430\u0437\u0431\u0438\u0440\u0430\u044E\u0442 \u0437\u0430 \u0447\u0430\u0441\u044B." })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-catbar", children: [
        /* @__PURE__ */ jsxRuntime.jsx(CityChips, { cls: "pdl-cities" }),
        /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "pdl-catcount", children: [
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "d" }),
          filtered.length,
          " \u0441\u0432\u0435\u0436\u0438\u0445 \u0431\u0443\u043A\u0435\u0442\u043E\u0432 \u0432 \u041C\u043E\u0441\u043A\u0432\u0435"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-filters", children: [
        Object.entries(FILTERS).map(([k, g]) => /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-fgroup", children: [
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "pdl-flabel", children: g.label }),
          g.opts.map(([val, lab]) => /* @__PURE__ */ jsxRuntime.jsxs("button", { className: "pdl-fchip" + (sel[k] === val ? " on" : ""), onClick: () => toggle(k, val), children: [
            k === "rating" && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "st", children: "\u2605" }),
            lab
          ] }, val))
        ] }, k)),
        activeN > 0 && /* @__PURE__ */ jsxRuntime.jsxs("button", { className: "pdl-freset", onClick: reset, children: [
          "\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C",
          activeN > 1 ? ` (${activeN})` : ""
        ] })
      ] }),
      shown.length === 0 ? /* @__PURE__ */ jsxRuntime.jsx("p", { className: "pdl-catnote", children: "\u041F\u043E \u044D\u0442\u0438\u043C \u0444\u0438\u043B\u044C\u0442\u0440\u0430\u043C \u043D\u0438\u0447\u0435\u0433\u043E \u043D\u0435\u0442, \u0441\u043C\u044F\u0433\u0447\u0438\u0442\u0435 \u0446\u0435\u043D\u0443 \u0438\u043B\u0438 \u0441\u0432\u0435\u0436\u0435\u0441\u0442\u044C." }) : /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pdl-catgrid", children: shown.map((d, i) => /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pd-rise", children: /* @__PURE__ */ jsxRuntime.jsx(Card3, { d, variant: "grid" }) }, d.id || i)) }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pdl-catall", children: /* @__PURE__ */ jsxRuntime.jsxs("a", { href: "\u041F\u0435\u0440\u0435\u0434\u0430\u0440\u0438\u043C \xB7 \u041A\u0430\u0442\u0430\u043B\u043E\u0433 \u0431\u0443\u043A\u0435\u0442\u043E\u0432.html", children: [
        "\u0412\u0435\u0441\u044C \u043A\u0430\u0442\u0430\u043B\u043E\u0433 \u0431\u0443\u043A\u0435\u0442\u043E\u0432",
        /* @__PURE__ */ jsxRuntime.jsx("svg", { viewBox: "0 0 24 24", width: "18", height: "18", fill: "none", stroke: "currentColor", strokeWidth: "2.1", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M5 12h14M13 6l6 6-6 6" }) })
      ] }) })
    ] }) });
  }
  function How({ desk }) {
    return /* @__PURE__ */ jsxRuntime.jsx("section", { className: "pdl-sec", id: "how", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-in", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-sechead", children: [
        /* @__PURE__ */ jsxRuntime.jsxs("p", { className: "pdl-kicker", style: { justifyContent: "center" }, children: [
          /* @__PURE__ */ jsxRuntime.jsx(Leaf2, { className: "lf" }),
          "\u041A\u0430\u043A \u044D\u0442\u043E \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442"
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx("h2", { className: "pdl-h2", children: "\u0422\u0440\u0438 \u0448\u0430\u0433\u0430, \u0438 \u0431\u0443\u043A\u0435\u0442 \u043F\u0440\u043E\u0434\u043E\u043B\u0436\u0430\u0435\u0442 \u0440\u0430\u0434\u043E\u0432\u0430\u0442\u044C" }),
        /* @__PURE__ */ jsxRuntime.jsx("p", { className: "pdl-sub", children: "\u041F\u0443\u0442\u044C \u043F\u0440\u043E\u0434\u0430\u0432\u0446\u0430: \u0432\u044B\u0441\u0442\u0430\u0432\u0438\u0442\u044C \u0431\u0443\u043A\u0435\u0442 \u043F\u0440\u043E\u0449\u0435, \u0447\u0435\u043C \u043A\u0430\u0436\u0435\u0442\u0441\u044F" })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-steps", children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-step", children: [
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "pdl-seller-tag", children: "\u043F\u0440\u043E\u0434\u0430\u0432\u0435\u0446" }),
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pdl-stepn", children: "1" }),
          /* @__PURE__ */ jsxRuntime.jsx("h3", { children: "\u041F\u043E\u043B\u0443\u0447\u0438\u043B\u0438 \u0431\u0443\u043A\u0435\u0442" }),
          /* @__PURE__ */ jsxRuntime.jsx("p", { children: "\u0412\u0430\u043C \u043F\u043E\u0434\u0430\u0440\u0438\u043B\u0438 \u0446\u0432\u0435\u0442\u044B, \u043D\u043E \u0434\u043E\u043C\u0430 \u0438\u0445 \u0443\u0436\u0435 \u043D\u0435\u043A\u0443\u0434\u0430 \u0441\u0442\u0430\u0432\u0438\u0442\u044C, \u0430 \u043E\u043D\u0438 \u0435\u0449\u0451 \u0441\u0432\u0435\u0436\u0438\u0435 \u0438 \u0436\u0438\u0432\u044B\u0435." })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-step", children: [
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "pdl-seller-tag", children: "\u043F\u0440\u043E\u0434\u0430\u0432\u0435\u0446" }),
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pdl-stepn", children: "2" }),
          /* @__PURE__ */ jsxRuntime.jsx("h3", { children: "\u0412\u044B\u0441\u0442\u0430\u0432\u0438\u043B\u0438 \u0437\u0430 \u043F\u043E\u043B\u0446\u0435\u043D\u044B" }),
          /* @__PURE__ */ jsxRuntime.jsx("p", { children: "\u0421\u0444\u043E\u0442\u043E\u0433\u0440\u0430\u0444\u0438\u0440\u043E\u0432\u0430\u043B\u0438, \u0443\u043A\u0430\u0437\u0430\u043B\u0438 \u0441\u0432\u0435\u0436\u0435\u0441\u0442\u044C \u0438 \u0440\u0430\u0439\u043E\u043D. \u041F\u0443\u0431\u043B\u0438\u043A\u0430\u0446\u0438\u044F \u0431\u0435\u0441\u043F\u043B\u0430\u0442\u043D\u0430\u044F." })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-step", children: [
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "pdl-seller-tag", children: "\u043F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u044C" }),
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pdl-stepn", children: "3" }),
          /* @__PURE__ */ jsxRuntime.jsx("h3", { children: "\u041A\u0442\u043E-\u0442\u043E \u0440\u044F\u0434\u043E\u043C \u0437\u0430\u0431\u0440\u0430\u043B" }),
          /* @__PURE__ */ jsxRuntime.jsx("p", { children: "\u041F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u044C \u043F\u0438\u0448\u0435\u0442, \u0434\u043E\u0433\u043E\u0432\u0430\u0440\u0438\u0432\u0430\u0435\u0442\u0441\u044F \u0438 \u0437\u0430\u0431\u0438\u0440\u0430\u0435\u0442 \u0431\u0443\u043A\u0435\u0442 \u0440\u044F\u0434\u043E\u043C \u0441 \u0432\u0430\u043C\u0438. \u041F\u043B\u0430\u0442\u0438\u0442 \u043F\u0440\u0438 \u0432\u0441\u0442\u0440\u0435\u0447\u0435." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-vals", children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-val", children: [
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "ic", children: /* @__PURE__ */ jsxRuntime.jsx(Tag2, {}) }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntime.jsx("b", { children: "\u0412 2\u20133 \u0440\u0430\u0437\u0430 \u0434\u0435\u0448\u0435\u0432\u043B\u0435" }),
            /* @__PURE__ */ jsxRuntime.jsx("span", { children: "\u0441\u0432\u0435\u0436\u0438\u0435 \u0431\u0443\u043A\u0435\u0442\u044B \u043F\u043E-\u0447\u0435\u0441\u0442\u043D\u043E\u043C\u0443" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-val", children: [
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "ic g", children: /* @__PURE__ */ jsxRuntime.jsx(Shield2, {}) }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntime.jsx("b", { children: "\u041E\u043F\u043B\u0430\u0442\u0430 \u043F\u0440\u0438 \u0432\u0441\u0442\u0440\u0435\u0447\u0435" }),
            /* @__PURE__ */ jsxRuntime.jsx("span", { children: "\u043F\u043B\u0430\u0442\u0438\u0442\u0435, \u043A\u043E\u0433\u0434\u0430 \u0437\u0430\u0431\u0440\u0430\u043B\u0438 \u0431\u0443\u043A\u0435\u0442" })
          ] })
        ] })
      ] })
    ] }) });
  }
  function Escrow({ desk }) {
    const HeartHands2 = (p) => /* @__PURE__ */ jsxRuntime.jsx("svg", { viewBox: "0 0 24 24", ...p, fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M12 20.3C12 20.3 3.4 14.9 3.4 8.7 3.4 6 5.5 4 8 4 9.8 4 11.3 5 12 6.3 12.7 5 14.2 4 16 4 18.5 4 20.6 6 20.6 8.7 20.6 14.9 12 20.3 12 20.3Z" }) });
    return /* @__PURE__ */ jsxRuntime.jsx("section", { className: "pdl-sec pdl-escrow", id: "safety", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-in", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-sechead l", children: [
        /* @__PURE__ */ jsxRuntime.jsxs("p", { className: "pdl-kicker", children: [
          /* @__PURE__ */ jsxRuntime.jsx(Shield2, { style: { width: 14, height: 14 } }),
          "\u0411\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u0430\u044F \u0441\u0434\u0435\u043B\u043A\u0430"
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx("h2", { className: "pdl-h2", children: "\u041F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u044C \u043D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043F\u043B\u0430\u0442\u0438\u0442 \u0432\u043F\u0435\u0440\u0451\u0434, \u043E\u043F\u043B\u0430\u0442\u0430 \u043F\u0440\u0438 \u0432\u0441\u0442\u0440\u0435\u0447\u0435" }),
        /* @__PURE__ */ jsxRuntime.jsx("p", { className: "pdl-sub", children: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0441\u0442\u0440\u0430\u0445 \u0432 \u0441\u0434\u0435\u043B\u043A\u0430\u0445 \u043C\u0435\u0436\u0434\u0443 \u043D\u0435\u0437\u043D\u0430\u043A\u043E\u043C\u0446\u0430\u043C\u0438 \u2014 \u043E\u0431\u043C\u0430\u043D. \u041F\u043E\u044D\u0442\u043E\u043C\u0443 \u0434\u0435\u043D\u044C\u0433\u0438 \u043D\u0438\u043A\u0443\u0434\u0430 \u043D\u0435 \u0443\u0445\u043E\u0434\u044F\u0442 \u0437\u0430\u0440\u0430\u043D\u0435\u0435: \u0432\u044B \u043F\u043B\u0430\u0442\u0438\u0442\u0435, \u0442\u043E\u043B\u044C\u043A\u043E \u043A\u043E\u0433\u0434\u0430 \u0443\u0432\u0438\u0434\u0435\u043B\u0438 \u0431\u0443\u043A\u0435\u0442 \u0432\u0436\u0438\u0432\u0443\u044E." })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-escrow-grid", children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-eflow", children: [
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "en", children: "1" }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntime.jsx("h4", { children: "\u041D\u0430\u043F\u0438\u0441\u0430\u043B\u0438 \u0438 \u0434\u043E\u0433\u043E\u0432\u043E\u0440\u0438\u043B\u0438\u0441\u044C" }),
            /* @__PURE__ */ jsxRuntime.jsx("p", { children: "\u041F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u044C \u043F\u0438\u0448\u0435\u0442 \u043F\u0440\u043E\u0434\u0430\u0432\u0446\u0443 \u0432 \u0447\u0430\u0442\u0435 \u0438 \u0434\u043E\u0433\u043E\u0432\u0430\u0440\u0438\u0432\u0430\u0435\u0442\u0441\u044F \u043E \u0432\u0440\u0435\u043C\u0435\u043D\u0438 \u0438 \u043C\u0435\u0441\u0442\u0435 \u0432\u0441\u0442\u0440\u0435\u0447\u0438." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-eflow", children: [
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "en", children: "2" }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntime.jsx("h4", { children: "\u0412\u0441\u0442\u0440\u0435\u0442\u0438\u043B\u0438\u0441\u044C \u0438 \u043F\u0440\u043E\u0432\u0435\u0440\u0438\u043B\u0438" }),
            /* @__PURE__ */ jsxRuntime.jsx("p", { children: "\u0421\u0430\u043C\u043E\u0432\u044B\u0432\u043E\u0437 \u0440\u044F\u0434\u043E\u043C, \u0443 \u0434\u043E\u043C\u0430 \u0438\u043B\u0438 \u043C\u0435\u0442\u0440\u043E. \u041F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u044C \u0432\u0438\u0434\u0438\u0442 \u0431\u0443\u043A\u0435\u0442 \u0432\u0436\u0438\u0432\u0443\u044E." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-eflow", children: [
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "en", children: "3" }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntime.jsx("h4", { children: "\u041E\u043F\u043B\u0430\u0442\u0430 \u043F\u0440\u0438 \u0432\u0441\u0442\u0440\u0435\u0447\u0435" }),
            /* @__PURE__ */ jsxRuntime.jsx("p", { children: "\u0420\u0430\u0441\u043F\u043B\u0430\u0447\u0438\u0432\u0430\u0435\u0442\u0435\u0441\u044C \u043D\u0430 \u043C\u0435\u0441\u0442\u0435, \u043D\u0430\u043B\u0438\u0447\u043D\u044B\u043C\u0438 \u0438\u043B\u0438 \u043F\u0435\u0440\u0435\u0432\u043E\u0434\u043E\u043C \u043F\u0440\u043E\u0434\u0430\u0432\u0446\u0443. \u041D\u0438\u043A\u0430\u043A\u0438\u0445 \u043F\u0440\u0435\u0434\u043E\u043F\u043B\u0430\u0442." })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-esafe", children: [
        /* @__PURE__ */ jsxRuntime.jsx(HeartHands2, {}),
        /* @__PURE__ */ jsxRuntime.jsxs("p", { children: [
          /* @__PURE__ */ jsxRuntime.jsx("b", { children: "\u0414\u043E\u0432\u0435\u0440\u0438\u0435 \u0434\u0435\u0440\u0436\u0438\u0442\u0441\u044F \u043D\u0430 \u043E\u0442\u0437\u044B\u0432\u0430\u0445." }),
          " \u0420\u0435\u0439\u0442\u0438\u043D\u0433 \u0438 \u0440\u0435\u0430\u043B\u044C\u043D\u044B\u0435 \u043E\u0442\u0437\u044B\u0432\u044B \u043F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u044E\u0442 \u043D\u0430\u0434\u0451\u0436\u043D\u044B\u0445 \u043F\u0440\u043E\u0434\u0430\u0432\u0446\u043E\u0432, \u0430 \u043C\u043E\u0434\u0435\u0440\u0430\u0446\u0438\u044F \u0443\u0431\u0438\u0440\u0430\u0435\u0442 \u043E\u0431\u043C\u0430\u043D\u0449\u0438\u043A\u043E\u0432. \u0415\u0441\u043B\u0438 \u0447\u0442\u043E-\u0442\u043E \u043D\u0435 \u0442\u0430\u043A, \u043C\u043E\u0436\u043D\u043E \u043F\u043E\u0436\u0430\u043B\u043E\u0432\u0430\u0442\u044C\u0441\u044F."
        ] })
      ] })
    ] }) });
  }
  function Objections({ desk }) {
    return /* @__PURE__ */ jsxRuntime.jsx("section", { className: "pdl-sec alt", id: "faq", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-in", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-sechead", children: [
        /* @__PURE__ */ jsxRuntime.jsxs("p", { className: "pdl-kicker", style: { justifyContent: "center" }, children: [
          /* @__PURE__ */ jsxRuntime.jsx(Leaf2, { className: "lf" }),
          "\u0427\u0435\u0441\u0442\u043D\u043E \u043E \u0433\u043B\u0430\u0432\u043D\u043E\u043C"
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx("h2", { className: "pdl-h2", children: "\u0410 \u0432\u0434\u0440\u0443\u0433\u2026" })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-obj", children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-objc", children: [
          /* @__PURE__ */ jsxRuntime.jsxs("h3", { className: "pdl-objq", children: [
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "qm", children: "?" }),
            "\u2026\u0431\u0443\u043A\u0435\u0442 \u0443\u0436\u0435 \u043F\u043E\u0434\u0432\u044F\u0432\u0448\u0438\u0439?"
          ] }),
          /* @__PURE__ */ jsxRuntime.jsx("p", { children: "\u0423 \u043A\u0430\u0436\u0434\u043E\u0433\u043E \u0431\u0443\u043A\u0435\u0442\u0430 \u0441\u0442\u043E\u0438\u0442 \u0434\u0430\u0442\u0430 \u0438 \u043C\u0435\u0442\u043A\u0430 \u0441\u0432\u0435\u0436\u0435\u0441\u0442\u0438, \u0430 \u043D\u0430 \u0444\u043E\u0442\u043E \u0432\u0438\u0434\u043D\u043E \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435. \u0411\u0435\u0440\u0451\u0442\u0435 \u0442\u043E\u043B\u044C\u043A\u043E \u0442\u043E, \u0447\u0442\u043E \u043A\u0443\u043F\u043B\u0435\u043D\u043E \u0441\u0435\u0433\u043E\u0434\u043D\u044F \u0438\u043B\u0438 \u0432\u0447\u0435\u0440\u0430, \u0438 \u043F\u043B\u0430\u0442\u0438\u0442\u0435 \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0435\u043D\u043D\u043E." })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-objc", children: [
          /* @__PURE__ */ jsxRuntime.jsxs("h3", { className: "pdl-objq", children: [
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "qm", children: "?" }),
            "\u2026\u043F\u0440\u043E\u0434\u0430\u0432\u0435\u0446 \u043D\u0435 \u043F\u0440\u0438\u0434\u0451\u0442 \u043D\u0430 \u0432\u0441\u0442\u0440\u0435\u0447\u0443?"
          ] }),
          /* @__PURE__ */ jsxRuntime.jsx("p", { children: "\u0412\u044B \u043D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043F\u043B\u0430\u0442\u0438\u0442\u0435 \u0432\u043F\u0435\u0440\u0451\u0434: \u043E\u043F\u043B\u0430\u0442\u0430 \u0442\u043E\u043B\u044C\u043A\u043E \u043F\u0440\u0438 \u0432\u0441\u0442\u0440\u0435\u0447\u0435, \u043A\u043E\u0433\u0434\u0430 \u0443\u0432\u0438\u0434\u0435\u043B\u0438 \u0431\u0443\u043A\u0435\u0442. \u0420\u0435\u0439\u0442\u0438\u043D\u0433 \u0438 \u043E\u0442\u0437\u044B\u0432\u044B \u043F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u044E\u0442 \u043D\u0430\u0434\u0451\u0436\u043D\u044B\u0445 \u043F\u0440\u043E\u0434\u0430\u0432\u0446\u043E\u0432." })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-objc", children: [
          /* @__PURE__ */ jsxRuntime.jsxs("h3", { className: "pdl-objq", children: [
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "qm", children: "?" }),
            "\u2026\u043D\u0435\u043B\u043E\u0432\u043A\u043E \u043F\u0440\u043E\u0434\u0430\u0432\u0430\u0442\u044C \u043F\u043E\u0434\u0430\u0440\u043E\u043A?"
          ] }),
          /* @__PURE__ */ jsxRuntime.jsx("p", { children: "\u0412\u044B \u043D\u0435 \u0432\u044B\u0431\u0440\u0430\u0441\u044B\u0432\u0430\u0435\u0442\u0435 \u0438 \u043D\u0435 \u043D\u0430\u0436\u0438\u0432\u0430\u0435\u0442\u0435\u0441\u044C. \u0412\u044B \u043E\u0442\u0434\u0430\u0451\u0442\u0435 \u043A\u0440\u0430\u0441\u0438\u0432\u043E\u0435 \u0442\u043E\u043C\u0443, \u043A\u043E\u043C\u0443 \u043E\u043D\u043E \u043D\u0443\u0436\u043D\u043E, \u0438 \u0432\u043E\u0437\u0432\u0440\u0430\u0449\u0430\u0435\u0442\u0435 \u0447\u0430\u0441\u0442\u044C \u0434\u0435\u043D\u0435\u0433. \u042D\u0442\u043E \u0431\u0435\u0440\u0435\u0436\u043D\u043E, \u0430 \u043D\u0435 \u0441\u0442\u044B\u0434\u043D\u043E." })
        ] })
      ] })
    ] }) });
  }
  function App({ desk }) {
    return /* @__PURE__ */ jsxRuntime.jsx("section", { className: "pdl-sec pdl-app", id: "app", children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pdl-in", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-app-in", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntime.jsxs("p", { className: "pdl-kicker", children: [
          /* @__PURE__ */ jsxRuntime.jsx(Leaf2, { className: "lf" }),
          "\u041F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435"
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx("h2", { className: "pdl-h2", children: "\u0423\u0437\u043D\u0430\u0432\u0430\u0439\u0442\u0435 \u043E \u0441\u0432\u0435\u0436\u0438\u0445 \u0431\u0443\u043A\u0435\u0442\u0430\u0445 \u0440\u044F\u0434\u043E\u043C \u043F\u0435\u0440\u0432\u044B\u043C\u0438" }),
        /* @__PURE__ */ jsxRuntime.jsx("p", { className: "pdl-sub", children: "\u0421\u0432\u0435\u0436\u0438\u0439 \u0431\u0443\u043A\u0435\u0442 \u043F\u043E \u0441\u043E\u0441\u0435\u0434\u0441\u0442\u0432\u0443 \u0436\u0438\u0432\u0451\u0442 \u0441\u0447\u0438\u0442\u0430\u043D\u043D\u044B\u0435 \u0447\u0430\u0441\u044B. \u0412\u043A\u043B\u044E\u0447\u0438\u0442\u0435 push, \u0438 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435 \u0441\u043E\u043E\u0431\u0449\u0438\u0442, \u043A\u0430\u043A \u0442\u043E\u043B\u044C\u043A\u043E \u0440\u044F\u0434\u043E\u043C \u043F\u043E\u044F\u0432\u0438\u0442\u0441\u044F \u043F\u043E\u0434\u0445\u043E\u0434\u044F\u0449\u0438\u0439, \u043F\u043E\u043A\u0430 \u0435\u0433\u043E \u043D\u0435 \u0437\u0430\u0431\u0440\u0430\u043B\u0438." })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pdl-badges", children: STORES.map((s) => /* @__PURE__ */ jsxRuntime.jsxs("a", { className: "pdl-badge", href: "#", onClick: (e) => e.preventDefault(), children: [
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "glyph", children: s.glyph }),
        /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "txt", children: [
          /* @__PURE__ */ jsxRuntime.jsx("small", { children: s.small }),
          /* @__PURE__ */ jsxRuntime.jsx("b", { children: s.name })
        ] })
      ] }, s.id)) })
    ] }) }) });
  }
  function Final({ desk }) {
    return /* @__PURE__ */ jsxRuntime.jsx("section", { className: "pdl-sec pdl-final", children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pdl-in", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-finalgrid", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-finalc seller", children: [
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "role", children: "\u0412\u0430\u043C \u043F\u043E\u0434\u0430\u0440\u0438\u043B\u0438 \u0431\u0443\u043A\u0435\u0442" }),
        /* @__PURE__ */ jsxRuntime.jsx("h3", { children: "\u041F\u043E\u0434\u0430\u0440\u0438\u0442\u0435 \u0435\u043C\u0443 \u0432\u0442\u043E\u0440\u0443\u044E \u0436\u0438\u0437\u043D\u044C" }),
        /* @__PURE__ */ jsxRuntime.jsx("p", { children: "\u041D\u0435 \u0432\u044B\u0431\u0440\u0430\u0441\u044B\u0432\u0430\u0439\u0442\u0435 \u043A\u0440\u0430\u0441\u0438\u0432\u043E\u0435 \u0438 \u0436\u0438\u0432\u043E\u0435. \u0412\u044B\u0441\u0442\u0430\u0432\u044C\u0442\u0435 \u0437\u0430 \u043C\u0438\u043D\u0443\u0442\u0443 \u0438 \u0432\u0435\u0440\u043D\u0438\u0442\u0435 \u0447\u0430\u0441\u0442\u044C \u0434\u0435\u043D\u0435\u0433, \u0431\u0443\u043A\u0435\u0442 \u0434\u043E\u0441\u0442\u0430\u043D\u0435\u0442\u0441\u044F \u043A\u043E\u043C\u0443-\u0442\u043E \u0440\u044F\u0434\u043E\u043C. \u041F\u0443\u0431\u043B\u0438\u043A\u0430\u0446\u0438\u044F \u0431\u0435\u0441\u043F\u043B\u0430\u0442\u043D\u0430\u044F." }),
        /* @__PURE__ */ jsxRuntime.jsx(Btn2, { variant: "onbrand", lg: true, icon: Ic2 && Ic2.plus, children: "\u041E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u0442\u044C \u0431\u0443\u043A\u0435\u0442" })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-finalc buyer", children: [
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "role", children: "\u041D\u0443\u0436\u043D\u044B \u0441\u0432\u0435\u0436\u0438\u0435 \u0446\u0432\u0435\u0442\u044B" }),
        /* @__PURE__ */ jsxRuntime.jsx("h3", { children: "\u0421\u0432\u0435\u0436\u0438\u0439 \u0431\u0443\u043A\u0435\u0442 \u0437\u0430 \u043F\u043E\u043B\u0446\u0435\u043D\u044B" }),
        /* @__PURE__ */ jsxRuntime.jsx("p", { children: "\u041A \u0441\u0432\u0438\u0434\u0430\u043D\u0438\u044E, \u0432 \u043F\u043E\u0434\u0430\u0440\u043E\u043A \u0438\u043B\u0438 \u043F\u0440\u043E\u0441\u0442\u043E \u0441\u0435\u0431\u0435 \u0434\u043E\u043C\u043E\u0439: \u0442\u0435 \u0436\u0435 \u0441\u0432\u0435\u0436\u0438\u0435 \u0446\u0432\u0435\u0442\u044B \u0440\u044F\u0434\u043E\u043C \u0441 \u0432\u0430\u043C\u0438 \u0438 \u0432 2\u20133 \u0440\u0430\u0437\u0430 \u0434\u0435\u0448\u0435\u0432\u043B\u0435 \u043C\u0430\u0433\u0430\u0437\u0438\u043D\u0430." }),
        /* @__PURE__ */ jsxRuntime.jsx(Btn2, { variant: "primary", lg: true, children: "\u0421\u043C\u043E\u0442\u0440\u0435\u0442\u044C \u0431\u0443\u043A\u0435\u0442\u044B \u0432 \u041C\u043E\u0441\u043A\u0432\u0435" })
      ] })
    ] }) }) });
  }
  const FOOT_COLS = [
    { h: "\u0421\u0435\u0440\u0432\u0438\u0441", links: ["\u041E \xAB\u041F\u0435\u0440\u0435\u0434\u0430\u0440\u0438\u043C\u0435\xBB", "\u041A\u0430\u043A \u044D\u0442\u043E \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442", "\u0412\u0442\u043E\u0440\u0430\u044F \u0436\u0438\u0437\u043D\u044C \u0431\u0443\u043A\u0435\u0442\u043E\u0432", "\u0411\u043B\u043E\u0433"] },
    { h: "\u041F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u044F\u043C", links: ["\u0421\u0432\u0435\u0436\u0438\u0435 \u0431\u0443\u043A\u0435\u0442\u044B \u0440\u044F\u0434\u043E\u043C", "\u041A\u0430\u043A \u043F\u0440\u043E\u0445\u043E\u0434\u0438\u0442 \u0441\u0434\u0435\u043B\u043A\u0430", "\u0421\u0430\u043C\u043E\u0432\u044B\u0432\u043E\u0437 \u0440\u044F\u0434\u043E\u043C"] },
    { h: "\u041F\u0440\u043E\u0434\u0430\u0432\u0446\u0430\u043C", links: ["\u041E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u0442\u044C \u0431\u0443\u043A\u0435\u0442", "\u041F\u0440\u0430\u0432\u0438\u043B\u0430 \u043F\u0443\u0431\u043B\u0438\u043A\u0430\u0446\u0438\u0438", "\u041A\u0430\u043A \u043F\u0440\u043E\u0434\u0430\u0432\u0430\u0442\u044C", "\u0421\u0430\u043C\u043E\u0437\u0430\u043D\u044F\u0442\u044B\u043C"] },
    { h: "\u041F\u043E\u043C\u043E\u0449\u044C", links: ["\u041F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0430", "\u0412\u043E\u043F\u0440\u043E\u0441\u044B \u0438 \u043E\u0442\u0432\u0435\u0442\u044B", "\u0411\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u043E\u0441\u0442\u044C", "\u0421\u0432\u044F\u0437\u0430\u0442\u044C\u0441\u044F \u0441 \u043D\u0430\u043C\u0438"] }
  ];
  function Footer2({ desk }) {
    return /* @__PURE__ */ jsxRuntime.jsx("footer", { className: "pdl-foot", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-in", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-foot-top", children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-foot-brand", children: [
          /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "pdl-foot-mark", children: [
            /* @__PURE__ */ jsxRuntime.jsx(Mark, { size: 26 }),
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "w", children: "\u041F\u0435\u0440\u0435\u0434\u0430\u0440\u0438\u043C" })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsx("p", { className: "pdl-foot-tag", children: "\u0421\u0435\u0440\u0432\u0438\u0441 \u043F\u0435\u0440\u0435\u0434\u0430\u0440\u0438\u0432\u0430\u043D\u0438\u044F \u0441\u0432\u0435\u0436\u0438\u0445 \u0431\u0443\u043A\u0435\u0442\u043E\u0432. \u0414\u0430\u0440\u0438\u043C \u0446\u0432\u0435\u0442\u0430\u043C \u0432\u0442\u043E\u0440\u0443\u044E \u0436\u0438\u0437\u043D\u044C \u0438 \u043F\u0440\u043E\u0434\u0430\u0451\u043C \u0438\u0445 \u0432 2\u20133 \u0440\u0430\u0437\u0430 \u0434\u0435\u0448\u0435\u0432\u043B\u0435 \u043C\u0430\u0433\u0430\u0437\u0438\u043D\u0430." })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pdl-foot-cols", children: FOOT_COLS.map((c) => /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-foot-col", children: [
          /* @__PURE__ */ jsxRuntime.jsx("h4", { children: c.h }),
          /* @__PURE__ */ jsxRuntime.jsx("ul", { children: c.links.map((l) => /* @__PURE__ */ jsxRuntime.jsx("li", { children: /* @__PURE__ */ jsxRuntime.jsx("a", { href: "#", onClick: (e) => e.preventDefault(), children: l }) }, l)) })
        ] }, c.h)) })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-foot-legal", children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "links", children: [
          /* @__PURE__ */ jsxRuntime.jsx("a", { href: "#", onClick: (e) => e.preventDefault(), children: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u0441\u043A\u043E\u0435 \u0441\u043E\u0433\u043B\u0430\u0448\u0435\u043D\u0438\u0435" }),
          /* @__PURE__ */ jsxRuntime.jsx("a", { href: "#", onClick: (e) => e.preventDefault(), children: "\u041F\u043E\u043B\u0438\u0442\u0438\u043A\u0430 \u043A\u043E\u043D\u0444\u0438\u0434\u0435\u043D\u0446\u0438\u0430\u043B\u044C\u043D\u043E\u0441\u0442\u0438" }),
          /* @__PURE__ */ jsxRuntime.jsx("a", { href: "#", onClick: (e) => e.preventDefault(), children: "\u0421\u043E\u0433\u043B\u0430\u0441\u0438\u0435 \u043D\u0430 \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u043A\u0443 \u0434\u0430\u043D\u043D\u044B\u0445" })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx("p", { children: "\xA9 2026 \xAB\u041F\u0435\u0440\u0435\u0434\u0430\u0440\u0438\u043C\xBB. \u0421\u0435\u0440\u0432\u0438\u0441 \u043D\u0435 \u044F\u0432\u043B\u044F\u0435\u0442\u0441\u044F \u0446\u0432\u0435\u0442\u043E\u0447\u043D\u044B\u043C \u043C\u0430\u0433\u0430\u0437\u0438\u043D\u043E\u043C \u0438 \u043D\u0435 \u043F\u0440\u043E\u0434\u0430\u0451\u0442 \u043D\u043E\u0432\u044B\u0435 \u0431\u0443\u043A\u0435\u0442\u044B. \u041E\u0431\u0440\u0430\u0431\u043E\u0442\u043A\u0430 \u043F\u0435\u0440\u0441\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0445 \u0434\u0430\u043D\u043D\u044B\u0445 \u043F\u043E 152-\u0424\u0417." })
      ] })
    ] }) });
  }
  const REVIEWS = [
    { q: "\u0417\u0430\u0431\u0440\u0430\u043B\u0430 \u043F\u0438\u043E\u043D\u044B \u0437\u0430 690 \u20BD \u0432 \u0441\u043E\u0441\u0435\u0434\u043D\u0435\u043C \u0434\u0432\u043E\u0440\u0435, \u0432 \u043C\u0430\u0433\u0430\u0437\u0438\u043D\u0435 \u0442\u0430\u043A\u0438\u0435 \u0436\u0435 \u043F\u043E 2 000. \u0421\u0432\u0435\u0436\u0438\u0435, \u043F\u0440\u043E\u0441\u0442\u043E\u044F\u043B\u0438 \u0432\u043E\u0441\u0435\u043C\u044C \u0434\u043D\u0435\u0439.", n: "\u0410\u043B\u0438\u043D\u0430", city: "\u041C\u043E\u0441\u043A\u0432\u0430", role: "buyer", c: "#CF5638" },
    { q: "\u041F\u043E\u0434\u0430\u0440\u0438\u043B\u0438 \u043E\u0433\u0440\u043E\u043C\u043D\u044B\u0439 \u0431\u0443\u043A\u0435\u0442 \u043D\u0430 \u044E\u0431\u0438\u043B\u0435\u0439, \u0430 \u0434\u043E\u043C\u0430 \u0441\u0442\u0430\u0432\u0438\u0442\u044C \u043D\u0435\u043A\u0443\u0434\u0430. \u0412\u044B\u0441\u0442\u0430\u0432\u0438\u043B\u0430 \u0437\u0430 \u043F\u043E\u043B\u0446\u0435\u043D\u044B, \u0437\u0430\u0431\u0440\u0430\u043B\u0438 \u0447\u0435\u0440\u0435\u0437 \u0447\u0430\u0441. \u041F\u0440\u0438\u044F\u0442\u043D\u043E, \u0447\u0442\u043E \u043D\u0435 \u0432\u044B\u0431\u0440\u043E\u0441\u0438\u043B\u0430.", n: "\u041E\u043B\u044C\u0433\u0430", city: "\u0421\u0430\u043D\u043A\u0442-\u041F\u0435\u0442\u0435\u0440\u0431\u0443\u0440\u0433", role: "seller", c: "#5B8C68" },
    { q: "\u0411\u043E\u044F\u043B\u0441\u044F \u0440\u0430\u0437\u0432\u043E\u0434\u0430, \u043D\u043E \u0434\u043E\u0433\u043E\u0432\u043E\u0440\u0438\u043B\u0438\u0441\u044C \u0432 \u0447\u0430\u0442\u0435, \u0432\u0441\u0442\u0440\u0435\u0442\u0438\u043B\u0438\u0441\u044C \u0443 \u043C\u0435\u0442\u0440\u043E, \u0437\u0430\u043F\u043B\u0430\u0442\u0438\u043B, \u043A\u043E\u0433\u0434\u0430 \u0443\u0432\u0438\u0434\u0435\u043B \u0431\u0443\u043A\u0435\u0442. \u0412\u0441\u0451 \u0447\u0435\u0441\u0442\u043D\u043E.", n: "\u0422\u0438\u043C\u0443\u0440", city: "\u041A\u0430\u0437\u0430\u043D\u044C", role: "buyer", c: "#C98A1E" },
    { q: "\u041E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u0442\u044C \u0432\u044B\u0448\u043B\u043E \u0440\u0435\u0430\u043B\u044C\u043D\u043E \u0437\u0430 \u043C\u0438\u043D\u0443\u0442\u0443 \u0441 \u0442\u0435\u043B\u0435\u0444\u043E\u043D\u0430. \u041F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u044C \u0437\u0430\u0431\u0440\u0430\u043B \u0432 \u0442\u043E\u0442 \u0436\u0435 \u0432\u0435\u0447\u0435\u0440.", n: "\u041C\u0430\u0440\u0438\u043D\u0430", city: "\u041C\u043E\u0441\u043A\u0432\u0430", role: "seller", c: "#23201B" },
    { q: "\u0412\u0437\u044F\u043B\u0430 \u0431\u0443\u043A\u0435\u0442 \u043A \u0441\u0432\u0438\u0434\u0430\u043D\u0438\u044E \u0437\u0430 \u0442\u0440\u0435\u0442\u044C \u0446\u0435\u043D\u044B. \u041D\u0438\u043A\u0442\u043E \u0438 \u043D\u0435 \u0434\u043E\u0433\u0430\u0434\u0430\u043B\u0441\u044F, \u0447\u0442\u043E \u043E\u043D \xAB\u043F\u0435\u0440\u0435\u0434\u0430\u0440\u0435\u043D\u043D\u044B\u0439\xBB.", n: "\u0412\u0435\u0440\u0430", city: "\u0415\u043A\u0430\u0442\u0435\u0440\u0438\u043D\u0431\u0443\u0440\u0433", role: "buyer", c: "#5B8C68" },
    { q: "\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0431\u044B\u043B\u043E \u043D\u0435\u043B\u043E\u0432\u043A\u043E \u043F\u0440\u043E\u0434\u0430\u0432\u0430\u0442\u044C \u043F\u043E\u0434\u0430\u0440\u043E\u043A. \u041D\u043E \u043A\u043E\u043C\u0443-\u0442\u043E \u043E\u043D \u043F\u043E-\u043D\u0430\u0441\u0442\u043E\u044F\u0449\u0435\u043C\u0443 \u043F\u0440\u0438\u0433\u043E\u0434\u0438\u043B\u0441\u044F, \u044D\u0442\u043E \u043A\u0443\u0434\u0430 \u043F\u0440\u0438\u044F\u0442\u043D\u0435\u0435 \u043C\u0443\u0441\u043E\u0440\u043A\u0438.", n: "\u041D\u0438\u043A\u0438\u0442\u0430", city: "\u041C\u043E\u0441\u043A\u0432\u0430", role: "seller", c: "#CF5638" }
  ];
  function Reviews({ desk }) {
    return /* @__PURE__ */ jsxRuntime.jsx("section", { className: "pdl-sec alt", id: "reviews", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-in", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-sechead", children: [
        /* @__PURE__ */ jsxRuntime.jsxs("p", { className: "pdl-kicker", style: { justifyContent: "center" }, children: [
          /* @__PURE__ */ jsxRuntime.jsx(Leaf2, { className: "lf" }),
          "\u041E\u0442\u0437\u044B\u0432\u044B"
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx("h2", { className: "pdl-h2", children: "\u0411\u0443\u043A\u0435\u0442\u044B \u043D\u0430\u0445\u043E\u0434\u044F\u0442 \u043D\u043E\u0432\u044B\u0439 \u0434\u043E\u043C \u043A\u0430\u0436\u0434\u044B\u0439 \u0434\u0435\u043D\u044C" })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pdl-revs", children: REVIEWS.map((r, i) => /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-rev", children: [
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "pdl-rev-stars", children: [0, 1, 2, 3, 4].map((s) => /* @__PURE__ */ jsxRuntime.jsx(Star, {}, s)) }),
        /* @__PURE__ */ jsxRuntime.jsxs("p", { className: "pdl-rev-q", children: [
          "\xAB",
          r.q,
          "\xBB"
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-rev-who", children: [
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "pdl-rev-ava", style: { background: r.c }, children: r.n[0] }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-rev-meta", children: [
            /* @__PURE__ */ jsxRuntime.jsx("b", { children: r.n }),
            /* @__PURE__ */ jsxRuntime.jsx("span", { children: r.city })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "pdl-rev-role " + r.role, children: r.role === "seller" ? "\u043F\u0440\u043E\u0434\u0430\u0432\u0435\u0446" : "\u043F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u044C" })
        ] })
      ] }, i)) })
    ] }) });
  }
  function Nav({ desk, auth }) {
    if (auth) {
      return /* @__PURE__ */ jsxRuntime.jsx("header", { className: "pdl-nav", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-nav-in", children: [
        /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "pdl-brand", children: [
          /* @__PURE__ */ jsxRuntime.jsx(Mark, { size: 24 }),
          "\u041F\u0435\u0440\u0435\u0434\u0430\u0440\u0438\u043C"
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-nav-mid", children: [
          /* @__PURE__ */ jsxRuntime.jsxs("button", { className: "pdl-nav-city", children: [
            /* @__PURE__ */ jsxRuntime.jsx(Pin2, { className: "pin" }),
            "\u041C\u043E\u0441\u043A\u0432\u0430",
            /* @__PURE__ */ jsxRuntime.jsx(Chev2, {})
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-nav-search", children: [
            /* @__PURE__ */ jsxRuntime.jsx(Search2, {}),
            /* @__PURE__ */ jsxRuntime.jsx("span", { children: "\u041F\u043E\u0438\u0441\u043A \u0441\u0432\u0435\u0436\u0438\u0445 \u0431\u0443\u043A\u0435\u0442\u043E\u0432 \u0432 \u041C\u043E\u0441\u043A\u0432\u0435" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-navright", children: [
          /* @__PURE__ */ jsxRuntime.jsx("button", { className: "pdl-nav-icon", "aria-label": "\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F", children: /* @__PURE__ */ jsxRuntime.jsx(Bell, {}) }),
          /* @__PURE__ */ jsxRuntime.jsx("button", { className: "pdl-nav-icon pdl-nav-fav", "aria-label": "\u0418\u0437\u0431\u0440\u0430\u043D\u043D\u043E\u0435", children: /* @__PURE__ */ jsxRuntime.jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M12 20.3C12 20.3 3.4 14.9 3.4 8.7 3.4 6 5.5 4 8 4 9.8 4 11.3 5 12 6.3 12.7 5 14.2 4 16 4 18.5 4 20.6 6 20.6 8.7 20.6 14.9 12 20.3 12 20.3Z" }) }) }),
          /* @__PURE__ */ jsxRuntime.jsx("button", { className: "pdl-nav-ava", "aria-label": "\u041F\u0440\u043E\u0444\u0438\u043B\u044C", children: "\u041C" }),
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "pdl-nav-cta", children: /* @__PURE__ */ jsxRuntime.jsx(Btn2, { variant: "primary", icon: Ic2 && Ic2.plus, children: "\u041F\u0440\u043E\u0434\u0430\u0442\u044C \u0431\u0443\u043A\u0435\u0442" }) }),
          /* @__PURE__ */ jsxRuntime.jsx("button", { className: "pdl-nav-burger", "aria-label": "\u041C\u0435\u043D\u044E", children: /* @__PURE__ */ jsxRuntime.jsx(Menu2, {}) })
        ] })
      ] }) });
    }
    return /* @__PURE__ */ jsxRuntime.jsx("header", { className: "pdl-nav", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-nav-in", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "pdl-brand", children: [
        /* @__PURE__ */ jsxRuntime.jsx(Mark, { size: 24 }),
        "\u041F\u0435\u0440\u0435\u0434\u0430\u0440\u0438\u043C"
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("nav", { className: "pdl-navlinks", children: [
        /* @__PURE__ */ jsxRuntime.jsx("a", { href: "\u041F\u0435\u0440\u0435\u0434\u0430\u0440\u0438\u043C \xB7 \u041A\u0430\u0442\u0430\u043B\u043E\u0433 \u0431\u0443\u043A\u0435\u0442\u043E\u0432.html", children: "\u041A\u0430\u0442\u0430\u043B\u043E\u0433" }),
        /* @__PURE__ */ jsxRuntime.jsx("a", { href: "#how", children: "\u041A\u0430\u043A \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442" }),
        /* @__PURE__ */ jsxRuntime.jsx("a", { href: "#safety", children: "\u0411\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u043E\u0441\u0442\u044C" }),
        /* @__PURE__ */ jsxRuntime.jsx("a", { href: "#app", children: "\u041F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435" })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-navright", children: [
        /* @__PURE__ */ jsxRuntime.jsxs("button", { className: "pdl-nav-city", onClick: (e) => e.preventDefault(), children: [
          /* @__PURE__ */ jsxRuntime.jsx(Pin2, { className: "pin" }),
          "\u041C\u043E\u0441\u043A\u0432\u0430",
          /* @__PURE__ */ jsxRuntime.jsx(Chev2, {})
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx("button", { className: "pdl-nav-login", children: "\u0412\u043E\u0439\u0442\u0438" }),
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "pdl-nav-cta", children: /* @__PURE__ */ jsxRuntime.jsx(Btn2, { variant: "primary", icon: Ic2 && Ic2.plus, children: "\u041E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u0442\u044C \u0431\u0443\u043A\u0435\u0442" }) }),
        /* @__PURE__ */ jsxRuntime.jsx("button", { className: "pdl-nav-burger", "aria-label": "\u041C\u0435\u043D\u044E", children: /* @__PURE__ */ jsxRuntime.jsx(Menu2, {}) })
      ] })
    ] }) });
  }
  function LandingNav({ auth = false, desk = true }) {
    return /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pd-root pd-web pdl" + (desk ? " pdl--desk" : ""), "data-pd-theme": "a", style: { minHeight: 0 }, children: /* @__PURE__ */ jsxRuntime.jsx(Nav, { desk, auth }) });
  }
  var PdLandingComp = function PdLanding2({ platform = "desktop", auth = false }) {
    const desk = platform === "desktop";
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pd-root pd-web pdl" + (desk ? " pdl--desk" : ""), "data-pd-theme": "a", children: [
      /* @__PURE__ */ jsxRuntime.jsx(Nav, { desk, auth }),
      /* @__PURE__ */ jsxRuntime.jsxs("main", { className: "pd-scroll pdw-scroll", children: [
        /* @__PURE__ */ jsxRuntime.jsx(Hero, { desk }),
        /* @__PURE__ */ jsxRuntime.jsx(Catalog, { desk }),
        /* @__PURE__ */ jsxRuntime.jsx(How, { desk }),
        /* @__PURE__ */ jsxRuntime.jsx(Reviews, { desk }),
        /* @__PURE__ */ jsxRuntime.jsx(Escrow, { desk }),
        /* @__PURE__ */ jsxRuntime.jsx(Objections, { desk }),
        /* @__PURE__ */ jsxRuntime.jsx(App, { desk }),
        /* @__PURE__ */ jsxRuntime.jsx(Final, { desk }),
        /* @__PURE__ */ jsxRuntime.jsx(Footer2, { desk })
      ] })
    ] });
  };
  PdLandingComp._navComp = LandingNav;
  PdLandingComp._footComp = Footer2;
  return PdLandingComp;
})();
var PdLandingNav = PdLanding._navComp;
var PdLandingFooter = PdLanding._footComp;
var Btn = chunkGT5S3QFQ_cjs.PdBtn;
var Card2 = chunkGT5S3QFQ_cjs.Card;
var Footer = PdLandingFooter;
var FRESH = chunkGT5S3QFQ_cjs.PD_FRESH || [];
var LIKED = chunkGT5S3QFQ_cjs.PD_LIKED || [];
var LAND = "/";
var CAT = "/catalog";
var PETAL2 = "M50 50C38 41 36 21 50 10C64 21 62 41 50 50Z";
var Mark2 = ({ size = 22, center = "#E8A93B", style, className, title = "\u041F\u0435\u0440\u0435\u0434\u0430\u0440\u0438\u043C" }) => /* @__PURE__ */ jsxRuntime.jsxs("svg", { className, width: size, height: size, viewBox: "0 0 100 100", role: "img", "aria-label": title, style: { display: "block", flex: "none", ...style }, children: [
  [0, 72, 144, 216, 288].map((a) => /* @__PURE__ */ jsxRuntime.jsx("path", { d: PETAL2, fill: "currentColor", transform: `rotate(${a} 50 50)` }, a)),
  /* @__PURE__ */ jsxRuntime.jsx("circle", { cx: "50", cy: "50", r: "8", fill: center })
] });
var NBSP_SHORT = /(^|[\s(«"])([А-Яа-яЁёA-Za-z]{1,2}|без|для|под|над|при|про|или|что|как|так|чтобы|если|когда|после|перед|около|через|между|чем)\s+/g;
function nbsp(s) {
  if (!s) return s;
  let out = String(s);
  for (let i = 0; i < 2; i++) out = out.replace(NBSP_SHORT, (_, a, w) => `${a}${w}\xA0`);
  out = out.replace(/(\d)\s+(?=\S)/g, "$1\xA0");
  out = out.replace(/\s+([—–])/g, "\xA0$1");
  out = out.replace(/\s+(·)/g, "\xA0$1");
  return out;
}
var Leaf = (p) => /* @__PURE__ */ jsxRuntime.jsxs("svg", { viewBox: "0 0 24 24", ...p, children: [
  /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M5 19c0-7 5-12 14-13 0 9-5 13-11 13-1.5 0-3 .5-3 .5", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" }),
  /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M5 19c2-4 5-6 9-7", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round" })
] });
var Tag = (p) => /* @__PURE__ */ jsxRuntime.jsxs("svg", { viewBox: "0 0 24 24", ...p, fill: "none", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M20 12 12 20l-8-8V4h8z" }),
  /* @__PURE__ */ jsxRuntime.jsx("circle", { cx: "8.5", cy: "8.5", r: "1.3", fill: "currentColor", stroke: "none" })
] });
var Shield = (p) => /* @__PURE__ */ jsxRuntime.jsxs("svg", { viewBox: "0 0 24 24", ...p, fill: "none", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M12 3 5 6v5c0 4.2 2.9 7.5 7 9 4.1-1.5 7-4.8 7-9V6z" }),
  /* @__PURE__ */ jsxRuntime.jsx("path", { d: "m9.2 12 1.9 1.9 3.7-3.7" })
] });
var Pin = (p) => /* @__PURE__ */ jsxRuntime.jsxs("svg", { viewBox: "0 0 24 24", ...p, fill: "none", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z" }),
  /* @__PURE__ */ jsxRuntime.jsx("circle", { cx: "12", cy: "10", r: "2.5" })
] });
var Search = (p) => /* @__PURE__ */ jsxRuntime.jsxs("svg", { viewBox: "0 0 24 24", ...p, fill: "none", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsxRuntime.jsx("circle", { cx: "11", cy: "11", r: "7" }),
  /* @__PURE__ */ jsxRuntime.jsx("path", { d: "m20 20-3.2-3.2" })
] });
var Chev = (p) => /* @__PURE__ */ jsxRuntime.jsx("svg", { viewBox: "0 0 24 24", ...p, fill: "none", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxRuntime.jsx("path", { d: "m6 9 6 6 6-6" }) });
var Menu = (p) => /* @__PURE__ */ jsxRuntime.jsx("svg", { viewBox: "0 0 24 24", ...p, fill: "none", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M4 7h16M4 12h16M4 17h16" }) });
var Plus = (p) => /* @__PURE__ */ jsxRuntime.jsx("svg", { viewBox: "0 0 24 24", ...p, fill: "none", stroke: "currentColor", strokeWidth: "2.1", strokeLinecap: "round", children: /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M12 5v14M5 12h14" }) });
var Arrow = (p) => /* @__PURE__ */ jsxRuntime.jsx("svg", { viewBox: "0 0 24 24", ...p, fill: "none", stroke: "currentColor", strokeWidth: "2.1", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M5 12h14M13 6l6 6-6 6" }) });
var HeartHands = (p) => /* @__PURE__ */ jsxRuntime.jsx("svg", { viewBox: "0 0 24 24", ...p, fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M12 20.3C12 20.3 3.4 14.9 3.4 8.7 3.4 6 5.5 4 8 4 9.8 4 11.3 5 12 6.3 12.7 5 14.2 4 16 4 18.5 4 20.6 6 20.6 8.7 20.6 14.9 12 20.3 12 20.3Z" }) });
var CITIES_FULL = [
  {
    id: "moskva",
    nom: "\u041C\u043E\u0441\u043A\u0432\u0430",
    loc: "\u041C\u043E\u0441\u043A\u0432\u0435",
    gen: "\u041C\u043E\u0441\u043A\u0432\u044B",
    count: 128,
    metro: true,
    districts: [["\u041F\u0430\u0442\u0440\u0438\u0430\u0440\u0448\u0438\u0435", 14], ["\u0425\u0430\u043C\u043E\u0432\u043D\u0438\u043A\u0438", 11], ["\u0410\u0440\u0431\u0430\u0442", 9], ["\u0422\u0432\u0435\u0440\u0441\u043A\u043E\u0439", 12], ["\u041F\u0440\u0435\u0441\u043D\u044F", 10], ["\u042F\u043A\u0438\u043C\u0430\u043D\u043A\u0430", 7], ["\u0417\u0430\u043C\u043E\u0441\u043A\u0432\u043E\u0440\u0435\u0447\u044C\u0435", 8], ["\u0427\u0438\u0441\u0442\u044B\u0435 \u043F\u0440\u0443\u0434\u044B", 7]]
  },
  {
    id: "spb",
    nom: "\u0421\u0430\u043D\u043A\u0442-\u041F\u0435\u0442\u0435\u0440\u0431\u0443\u0440\u0433",
    loc: "\u0421\u0430\u043D\u043A\u0442-\u041F\u0435\u0442\u0435\u0440\u0431\u0443\u0440\u0433\u0435",
    gen: "\u0421\u0430\u043D\u043A\u0442-\u041F\u0435\u0442\u0435\u0440\u0431\u0443\u0440\u0433\u0430",
    count: 86,
    metro: true,
    districts: [["\u0426\u0435\u043D\u0442\u0440\u0430\u043B\u044C\u043D\u044B\u0439", 12], ["\u041F\u0435\u0442\u0440\u043E\u0433\u0440\u0430\u0434\u043A\u0430", 9], ["\u0412\u0430\u0441\u0438\u043B\u044C\u0435\u0432\u0441\u043A\u0438\u0439 \u043E\u0441\u0442\u0440\u043E\u0432", 8], ["\u0410\u0434\u043C\u0438\u0440\u0430\u043B\u0442\u0435\u0439\u0441\u043A\u0438\u0439", 7], ["\u041C\u043E\u0441\u043A\u043E\u0432\u0441\u043A\u0438\u0439", 8], ["\u041F\u0440\u0438\u043C\u043E\u0440\u0441\u043A\u0438\u0439", 6], ["\u041D\u0435\u0432\u0441\u043A\u0438\u0439", 7], ["\u041A\u0443\u043F\u0447\u0438\u043D\u043E", 5]]
  },
  {
    id: "novosibirsk",
    nom: "\u041D\u043E\u0432\u043E\u0441\u0438\u0431\u0438\u0440\u0441\u043A",
    loc: "\u041D\u043E\u0432\u043E\u0441\u0438\u0431\u0438\u0440\u0441\u043A\u0435",
    gen: "\u041D\u043E\u0432\u043E\u0441\u0438\u0431\u0438\u0440\u0441\u043A\u0430",
    count: 27,
    metro: true,
    districts: [["\u0426\u0435\u043D\u0442\u0440\u0430\u043B\u044C\u043D\u044B\u0439", 6], ["\u0410\u043A\u0430\u0434\u0435\u043C\u0433\u043E\u0440\u043E\u0434\u043E\u043A", 4], ["\u0417\u0430\u0435\u043B\u044C\u0446\u043E\u0432\u0441\u043A\u0438\u0439", 3], ["\u041E\u043A\u0442\u044F\u0431\u0440\u044C\u0441\u043A\u0438\u0439", 4], ["\u041B\u0435\u043D\u0438\u043D\u0441\u043A\u0438\u0439", 3], ["\u0416\u0435\u043B\u0435\u0437\u043D\u043E\u0434\u043E\u0440\u043E\u0436\u043D\u044B\u0439", 3], ["\u0414\u0437\u0435\u0440\u0436\u0438\u043D\u0441\u043A\u0438\u0439", 2], ["\u041A\u0430\u043B\u0438\u043D\u0438\u043D\u0441\u043A\u0438\u0439", 2]]
  },
  {
    id: "ekb",
    nom: "\u0415\u043A\u0430\u0442\u0435\u0440\u0438\u043D\u0431\u0443\u0440\u0433",
    loc: "\u0415\u043A\u0430\u0442\u0435\u0440\u0438\u043D\u0431\u0443\u0440\u0433\u0435",
    gen: "\u0415\u043A\u0430\u0442\u0435\u0440\u0438\u043D\u0431\u0443\u0440\u0433\u0430",
    count: 33,
    metro: true,
    districts: [["\u0426\u0435\u043D\u0442\u0440", 7], ["\u0423\u0440\u0430\u043B\u043C\u0430\u0448", 4], ["\u0412\u0442\u0443\u0437\u0433\u043E\u0440\u043E\u0434\u043E\u043A", 3], ["\u042E\u0433\u043E-\u0417\u0430\u043F\u0430\u0434\u043D\u044B\u0439", 5], ["\u041F\u0438\u043E\u043D\u0435\u0440\u0441\u043A\u0438\u0439", 4], ["\u042D\u043B\u044C\u043C\u0430\u0448", 3], ["\u0411\u043E\u0442\u0430\u043D\u0438\u043A\u0430", 4], ["\u0410\u0432\u0442\u043E\u0432\u043E\u043A\u0437\u0430\u043B", 3]]
  },
  {
    id: "kazan",
    nom: "\u041A\u0430\u0437\u0430\u043D\u044C",
    loc: "\u041A\u0430\u0437\u0430\u043D\u0438",
    gen: "\u041A\u0430\u0437\u0430\u043D\u0438",
    count: 41,
    metro: true,
    districts: [["\u0412\u0430\u0445\u0438\u0442\u043E\u0432\u0441\u043A\u0438\u0439", 8], ["\u041D\u043E\u0432\u043E-\u0421\u0430\u0432\u0438\u043D\u043E\u0432\u0441\u043A\u0438\u0439", 6], ["\u0421\u043E\u0432\u0435\u0442\u0441\u043A\u0438\u0439", 5], ["\u041F\u0440\u0438\u0432\u043E\u043B\u0436\u0441\u043A\u0438\u0439", 6], ["\u041A\u0438\u0440\u043E\u0432\u0441\u043A\u0438\u0439", 4], ["\u041C\u043E\u0441\u043A\u043E\u0432\u0441\u043A\u0438\u0439", 4], ["\u0410\u0437\u0438\u043D\u043E", 5], ["\u0410\u0432\u0438\u0430\u0441\u0442\u0440\u043E\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0439", 3]]
  },
  {
    id: "nn",
    nom: "\u041D\u0438\u0436\u043D\u0438\u0439 \u041D\u043E\u0432\u0433\u043E\u0440\u043E\u0434",
    loc: "\u041D\u0438\u0436\u043D\u0435\u043C \u041D\u043E\u0432\u0433\u043E\u0440\u043E\u0434\u0435",
    gen: "\u041D\u0438\u0436\u043D\u0435\u0433\u043E \u041D\u043E\u0432\u0433\u043E\u0440\u043E\u0434\u0430",
    count: 22,
    metro: true,
    districts: [["\u041D\u0438\u0436\u0435\u0433\u043E\u0440\u043E\u0434\u0441\u043A\u0438\u0439", 5], ["\u041A\u0430\u043D\u0430\u0432\u0438\u043D\u0441\u043A\u0438\u0439", 3], ["\u0410\u0432\u0442\u043E\u0437\u0430\u0432\u043E\u0434\u0441\u043A\u0438\u0439", 4], ["\u0421\u043E\u0440\u043C\u043E\u0432\u0441\u043A\u0438\u0439", 3], ["\u0421\u043E\u0432\u0435\u0442\u0441\u043A\u0438\u0439", 3], ["\u041B\u0435\u043D\u0438\u043D\u0441\u043A\u0438\u0439", 2], ["\u041F\u0440\u0438\u043E\u043A\u0441\u043A\u0438\u0439", 2]]
  },
  {
    id: "chelyabinsk",
    nom: "\u0427\u0435\u043B\u044F\u0431\u0438\u043D\u0441\u043A",
    loc: "\u0427\u0435\u043B\u044F\u0431\u0438\u043D\u0441\u043A\u0435",
    gen: "\u0427\u0435\u043B\u044F\u0431\u0438\u043D\u0441\u043A\u0430",
    count: 18,
    metro: false,
    districts: [["\u0426\u0435\u043D\u0442\u0440\u0430\u043B\u044C\u043D\u044B\u0439", 4], ["\u041A\u0430\u043B\u0438\u043D\u0438\u043D\u0441\u043A\u0438\u0439", 3], ["\u041A\u0443\u0440\u0447\u0430\u0442\u043E\u0432\u0441\u043A\u0438\u0439", 3], ["\u041B\u0435\u043D\u0438\u043D\u0441\u043A\u0438\u0439", 2], ["\u0421\u043E\u0432\u0435\u0442\u0441\u043A\u0438\u0439", 2], ["\u0422\u0440\u0430\u043A\u0442\u043E\u0440\u043E\u0437\u0430\u0432\u043E\u0434\u0441\u043A\u0438\u0439", 2], ["\u041C\u0435\u0442\u0430\u043B\u043B\u0443\u0440\u0433\u0438\u0447\u0435\u0441\u043A\u0438\u0439", 2]]
  },
  {
    id: "krasnoyarsk",
    nom: "\u041A\u0440\u0430\u0441\u043D\u043E\u044F\u0440\u0441\u043A",
    loc: "\u041A\u0440\u0430\u0441\u043D\u043E\u044F\u0440\u0441\u043A\u0435",
    gen: "\u041A\u0440\u0430\u0441\u043D\u043E\u044F\u0440\u0441\u043A\u0430",
    count: 16,
    metro: false,
    districts: [["\u0426\u0435\u043D\u0442\u0440\u0430\u043B\u044C\u043D\u044B\u0439", 3], ["\u0421\u043E\u0432\u0435\u0442\u0441\u043A\u0438\u0439", 3], ["\u041E\u043A\u0442\u044F\u0431\u0440\u044C\u0441\u043A\u0438\u0439", 3], ["\u0416\u0435\u043B\u0435\u0437\u043D\u043E\u0434\u043E\u0440\u043E\u0436\u043D\u044B\u0439", 2], ["\u0421\u0432\u0435\u0440\u0434\u043B\u043E\u0432\u0441\u043A\u0438\u0439", 2], ["\u041A\u0438\u0440\u043E\u0432\u0441\u043A\u0438\u0439", 2], ["\u041B\u0435\u043D\u0438\u043D\u0441\u043A\u0438\u0439", 1]]
  },
  {
    id: "samara",
    nom: "\u0421\u0430\u043C\u0430\u0440\u0430",
    loc: "\u0421\u0430\u043C\u0430\u0440\u0435",
    gen: "\u0421\u0430\u043C\u0430\u0440\u044B",
    count: 19,
    metro: true,
    districts: [["\u041B\u0435\u043D\u0438\u043D\u0441\u043A\u0438\u0439", 3], ["\u0421\u0430\u043C\u0430\u0440\u0441\u043A\u0438\u0439", 3], ["\u041E\u043A\u0442\u044F\u0431\u0440\u044C\u0441\u043A\u0438\u0439", 3], ["\u041F\u0440\u043E\u043C\u044B\u0448\u043B\u0435\u043D\u043D\u044B\u0439", 4], ["\u041A\u0438\u0440\u043E\u0432\u0441\u043A\u0438\u0439", 2], ["\u0421\u043E\u0432\u0435\u0442\u0441\u043A\u0438\u0439", 2], ["\u0416\u0435\u043B\u0435\u0437\u043D\u043E\u0434\u043E\u0440\u043E\u0436\u043D\u044B\u0439", 2]]
  },
  {
    id: "ufa",
    nom: "\u0423\u0444\u0430",
    loc: "\u0423\u0444\u0435",
    gen: "\u0423\u0444\u044B",
    count: 14,
    metro: false,
    districts: [["\u041A\u0438\u0440\u043E\u0432\u0441\u043A\u0438\u0439", 3], ["\u041B\u0435\u043D\u0438\u043D\u0441\u043A\u0438\u0439", 2], ["\u041E\u043A\u0442\u044F\u0431\u0440\u044C\u0441\u043A\u0438\u0439", 3], ["\u0421\u043E\u0432\u0435\u0442\u0441\u043A\u0438\u0439", 2], ["\u041E\u0440\u0434\u0436\u043E\u043D\u0438\u043A\u0438\u0434\u0437\u0435\u0432\u0441\u043A\u0438\u0439", 2], ["\u041A\u0430\u043B\u0438\u043D\u0438\u043D\u0441\u043A\u0438\u0439", 1], ["\u0414\u0451\u043C\u0430", 1]]
  }
];
var OCCASIONS = [
  "\u0420\u043E\u0437\u044B \u043D\u0435\u0434\u043E\u0440\u043E\u0433\u043E",
  "\u041F\u0438\u043E\u043D\u044B \u043D\u0435\u0434\u043E\u0440\u043E\u0433\u043E",
  "\u0411\u0443\u043A\u0435\u0442 \u043D\u0430 \u0434\u0435\u043D\u044C \u0440\u043E\u0436\u0434\u0435\u043D\u0438\u044F",
  "\u0411\u0443\u043A\u0435\u0442 \u043D\u0430 \u0441\u0432\u0438\u0434\u0430\u043D\u0438\u0435",
  "\u0411\u0443\u043A\u0435\u0442 \u0432 \u043F\u043E\u0434\u0430\u0440\u043E\u043A",
  "\u0426\u0432\u0435\u0442\u044B \u0441\u0435\u0431\u0435 \u0434\u043E\u043C\u043E\u0439"
];
function SeoNav({ cityNom = "\u041C\u043E\u0441\u043A\u0432\u0430", cityIn = "\u041C\u043E\u0441\u043A\u0432\u0435" }) {
  return /* @__PURE__ */ jsxRuntime.jsx("header", { className: "pdl-nav", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-nav-in", children: [
    /* @__PURE__ */ jsxRuntime.jsxs("a", { href: LAND, className: "pdl-brand", style: { textDecoration: "none" }, children: [
      /* @__PURE__ */ jsxRuntime.jsx(Mark2, { size: 24 }),
      "\u041F\u0435\u0440\u0435\u0434\u0430\u0440\u0438\u043C"
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-nav-mid", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("button", { className: "pdl-nav-city", children: [
        /* @__PURE__ */ jsxRuntime.jsx(Pin, { className: "pin", style: { width: 16, height: 16 } }),
        cityNom,
        /* @__PURE__ */ jsxRuntime.jsx(Chev, { style: { width: 14, height: 14 } })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-nav-search", children: [
        /* @__PURE__ */ jsxRuntime.jsx(Search, { style: { width: 18, height: 18 } }),
        /* @__PURE__ */ jsxRuntime.jsxs("span", { children: [
          "\u041F\u043E\u0438\u0441\u043A \u0441\u0432\u0435\u0436\u0438\u0445 \u0431\u0443\u043A\u0435\u0442\u043E\u0432 \u0432 ",
          cityIn
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-navright", children: [
      /* @__PURE__ */ jsxRuntime.jsx("button", { className: "pdl-nav-login", children: "\u0412\u043E\u0439\u0442\u0438" }),
      /* @__PURE__ */ jsxRuntime.jsx("span", { className: "pdl-nav-cta", children: /* @__PURE__ */ jsxRuntime.jsx(Btn, { variant: "primary", icon: Plus, children: "\u041E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u0442\u044C \u0431\u0443\u043A\u0435\u0442" }) }),
      /* @__PURE__ */ jsxRuntime.jsx("button", { className: "pdl-nav-burger", "aria-label": "\u041C\u0435\u043D\u044E", children: /* @__PURE__ */ jsxRuntime.jsx(Menu, {}) })
    ] })
  ] }) });
}
function Shell({ desk, cityNom = "\u041C\u043E\u0441\u043A\u0432\u0430", cityIn = "\u041C\u043E\u0441\u043A\u0432\u0435", children }) {
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pd-root pd-web pds pdl" + (desk ? " pds--desk pdl--desk" : ""), "data-pd-theme": "a", children: [
    /* @__PURE__ */ jsxRuntime.jsx(SeoNav, { cityNom, cityIn }),
    /* @__PURE__ */ jsxRuntime.jsxs("main", { className: "pd-scroll pdw-scroll", children: [
      children,
      Footer ? /* @__PURE__ */ jsxRuntime.jsx(Footer, { desk }) : null
    ] })
  ] });
}
function PdSeoMeta({ url, title, description, h1, alt, label = "SEO-\u043C\u0435\u0442\u0430 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B" }) {
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pds-metaplate", children: [
    /* @__PURE__ */ jsxRuntime.jsx("span", { className: "lbl", children: label }),
    /* @__PURE__ */ jsxRuntime.jsxs("dl", { children: [
      /* @__PURE__ */ jsxRuntime.jsx("dt", { children: "URL" }),
      /* @__PURE__ */ jsxRuntime.jsx("dd", { children: url }),
      /* @__PURE__ */ jsxRuntime.jsx("dt", { children: "Title" }),
      /* @__PURE__ */ jsxRuntime.jsx("dd", { children: title }),
      description ? /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
        /* @__PURE__ */ jsxRuntime.jsx("dt", { children: "Description" }),
        /* @__PURE__ */ jsxRuntime.jsx("dd", { children: description })
      ] }) : null,
      h1 ? /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
        /* @__PURE__ */ jsxRuntime.jsx("dt", { children: "H1" }),
        /* @__PURE__ */ jsxRuntime.jsx("dd", { children: h1 })
      ] }) : null,
      alt ? /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
        /* @__PURE__ */ jsxRuntime.jsx("dt", { children: "alt \u0444\u043E\u0442\u043E" }),
        /* @__PURE__ */ jsxRuntime.jsx("dd", { children: alt })
      ] }) : null
    ] })
  ] });
}
var POOL = [...FRESH, ...LIKED];
var FRESHES = ["today", "d1_2", "d3_plus"];
function makeItems(cityNom, districts) {
  return POOL.slice(0, 12).map((d, i) => ({
    ...d,
    _id: "g" + i,
    price: Math.round(d.price * (i % 3 === 0 ? 0.78 : i % 3 === 1 ? 1 : 1.35) / 10) * 10,
    fresh: i < 6 ? "today" : FRESHES[(i + 1) % 3],
    district: cityNom + " \xB7 " + districts[i % districts.length][0]
  }));
}
var PRICE = { any: () => true, lt1k: (p) => p < 1e3, "1k2k": (p) => p >= 1e3 && p <= 2e3, gt2k: (p) => p > 2e3 };
function GeoCatalog({ cityNom = "\u041C\u043E\u0441\u043A\u0432\u0430", cityLoc = "\u041C\u043E\u0441\u043A\u0432\u0435", districts }) {
  const [price, setPrice] = React2__default.default.useState("any");
  const [fresh, setFresh] = React2__default.default.useState("any");
  const items = React2__default.default.useMemo(() => makeItems(cityNom, districts), [cityNom, districts]);
  const shown = React2__default.default.useMemo(() => items.filter((d) => PRICE[price](d.price) && (fresh === "any" || d.fresh === fresh)), [items, price, fresh]);
  const Chip = ({ on, onClick, children }) => /* @__PURE__ */ jsxRuntime.jsx("button", { className: "pds-fchip" + (on ? " on" : ""), onClick, children });
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pds-catbar", children: /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "pds-catcount", children: [
      /* @__PURE__ */ jsxRuntime.jsx("span", { className: "d" }),
      /* @__PURE__ */ jsxRuntime.jsx("span", { children: `${shown.length} \u0441\u0432\u0435\u0436\u0438\u0445 \u0431\u0443\u043A\u0435\u0442\u043E\u0432 \u0432 ${cityLoc} \u0441\u0435\u0439\u0447\u0430\u0441` })
    ] }) }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pds-filters", children: [
      /* @__PURE__ */ jsxRuntime.jsx(Chip, { on: price === "lt1k", onClick: () => setPrice(price === "lt1k" ? "any" : "lt1k"), children: "\u0434\u043E 1 000 \u20BD" }),
      /* @__PURE__ */ jsxRuntime.jsx(Chip, { on: price === "1k2k", onClick: () => setPrice(price === "1k2k" ? "any" : "1k2k"), children: "1 000\u20132 000 \u20BD" }),
      /* @__PURE__ */ jsxRuntime.jsx(Chip, { on: price === "gt2k", onClick: () => setPrice(price === "gt2k" ? "any" : "gt2k"), children: "2 000 \u20BD+" }),
      /* @__PURE__ */ jsxRuntime.jsx(Chip, { on: fresh === "today", onClick: () => setFresh(fresh === "today" ? "any" : "today"), children: "\u0421\u0435\u0433\u043E\u0434\u043D\u044F" }),
      /* @__PURE__ */ jsxRuntime.jsx(Chip, { on: fresh === "d1_2", onClick: () => setFresh(fresh === "d1_2" ? "any" : "d1_2"), children: "1\u20132 \u0434\u043D\u044F" })
    ] }),
    shown.length === 0 ? /* @__PURE__ */ jsxRuntime.jsx("p", { className: "pds-catnote", children: "\u041F\u043E \u044D\u0442\u0438\u043C \u0444\u0438\u043B\u044C\u0442\u0440\u0430\u043C \u0441\u0435\u0439\u0447\u0430\u0441 \u043D\u0438\u0447\u0435\u0433\u043E \u043D\u0435\u0442, \u0441\u043C\u044F\u0433\u0447\u0438\u0442\u0435 \u0446\u0435\u043D\u0443 \u0438\u043B\u0438 \u0441\u0432\u0435\u0436\u0435\u0441\u0442\u044C." }) : /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pds-grid", children: shown.map((d) => /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pd-rise", children: /* @__PURE__ */ jsxRuntime.jsx(Card2, { d, variant: "grid" }) }, d._id)) }),
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pds-catall", children: /* @__PURE__ */ jsxRuntime.jsxs("a", { href: CAT, children: [
      "\u0412\u0435\u0441\u044C \u043A\u0430\u0442\u0430\u043B\u043E\u0433 \u0431\u0443\u043A\u0435\u0442\u043E\u0432 \u0432 ",
      cityLoc,
      /* @__PURE__ */ jsxRuntime.jsx(Arrow, { style: { width: 18, height: 18 } })
    ] }) })
  ] });
}
function PdGeoPage({ platform = "desktop", data = CITIES_FULL[0] }) {
  const desk = platform === "desktop";
  const city = data.nom, cityLoc = data.loc, cityGen = data.gen, districts = data.districts, metro = data.metro;
  const nearMetro = metro ? " \u0438\u043B\u0438 \u0443 \u043C\u0435\u0442\u0440\u043E" : "";
  const pickupShort = metro ? "\u0443 \u0434\u043E\u043C\u0430 \u0438\u043B\u0438 \u043C\u0435\u0442\u0440\u043E" : "\u0440\u044F\u0434\u043E\u043C \u0441 \u0434\u043E\u043C\u043E\u043C";
  return /* @__PURE__ */ jsxRuntime.jsxs(Shell, { desk, cityNom: city, cityIn: cityLoc, children: [
    /* @__PURE__ */ jsxRuntime.jsx("section", { className: "pds-top", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pds-in", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("p", { className: "pds-crumbs", children: [
        /* @__PURE__ */ jsxRuntime.jsx("a", { href: LAND, children: "\u0413\u043B\u0430\u0432\u043D\u0430\u044F" }),
        " \xB7 ",
        city
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("p", { className: "pds-eyebrow", children: [
        /* @__PURE__ */ jsxRuntime.jsx(Leaf, {}),
        `\u0421\u0432\u0435\u0436\u0438\u0435 \u0431\u0443\u043A\u0435\u0442\u044B \xB7 ${city} \xB7 \u0441\u0430\u043C\u043E\u0432\u044B\u0432\u043E\u0437`
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("h1", { className: "pds-h1", children: [
        `\u0421\u0432\u0435\u0436\u0438\u0435 \u0431\u0443\u043A\u0435\u0442\u044B `,
        /* @__PURE__ */ jsxRuntime.jsx("em", { children: "\u043D\u0430\u043F\u0440\u044F\u043C\u0443\u044E \u043E\u0442 \u043B\u044E\u0434\u0435\u0439" }),
        ` \u0432\xA0${cityLoc}, `,
        /* @__PURE__ */ jsxRuntime.jsx("span", { style: { whiteSpace: "nowrap" }, children: "\u0432 2\u20133 \u0440\u0430\u0437\u0430" }),
        ` \u0434\u0435\u0448\u0435\u0432\u043B\u0435 \u043C\u0430\u0433\u0430\u0437\u0438\u043D\u0430`
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("p", { className: "pds-intro", children: [
        /* @__PURE__ */ jsxRuntime.jsx("b", { children: "\u0411\u0443\u043A\u0435\u0442 \u043F\u043E\u0434\u0430\u0440\u0438\u043B\u0438, \u043E\u043D \u043F\u043E\u0440\u0430\u0434\u043E\u0432\u0430\u043B \u0438 \u0443\u0436\u0435 \u043D\u0435 \u043D\u0443\u0436\u0435\u043D." }),
        " ",
        `\u0412\u043C\u0435\u0441\u0442\u043E \u043C\u0443\u0441\u043E\u0440\u043A\u0438 \u0441\u0432\u0435\u0436\u0438\u0435 \u0446\u0432\u0435\u0442\u044B \u0437\u0430 \u043F\u043E\u043B\u0446\u0435\u043D\u044B \u043D\u0430\u0445\u043E\u0434\u044F\u0442 \u043D\u043E\u0432\u043E\u0433\u043E \u0445\u043E\u0437\u044F\u0438\u043D\u0430 \u0432\xA0${cityLoc}. \u0412\u044B\u0441\u0442\u0430\u0432\u044C\u0442\u0435 \u0441\u0432\u043E\u0439 \u0437\u0430 \u043C\u0438\u043D\u0443\u0442\u0443 \u0438\u043B\u0438 \u0437\u0430\u0431\u0435\u0440\u0438\u0442\u0435 \u0447\u0443\u0436\u043E\u0439.`
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pds-trust", children: [
        /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "t", children: [
          /* @__PURE__ */ jsxRuntime.jsx(Tag, { style: { color: "var(--pd-primary)" } }),
          "\u0412 2\u20133 \u0440\u0430\u0437\u0430 \u0434\u0435\u0448\u0435\u0432\u043B\u0435"
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "t", children: [
          /* @__PURE__ */ jsxRuntime.jsx(Shield, {}),
          "\u041E\u043F\u043B\u0430\u0442\u0430 \u043F\u0440\u0438 \u0432\u0441\u0442\u0440\u0435\u0447\u0435"
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "t", children: [
          /* @__PURE__ */ jsxRuntime.jsx(Pin, {}),
          "\u0421\u0430\u043C\u043E\u0432\u044B\u0432\u043E\u0437 ",
          pickupShort
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntime.jsx("section", { className: "pds-sec", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pds-in", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pds-sechead", children: [
        /* @__PURE__ */ jsxRuntime.jsx("h2", { className: "pds-h2", children: "\u0421\u0432\u0435\u0436\u0438\u0435 \u0431\u0443\u043A\u0435\u0442\u044B \u0440\u044F\u0434\u043E\u043C, \u043F\u0440\u044F\u043C\u043E \u0441\u0435\u0439\u0447\u0430\u0441" }),
        /* @__PURE__ */ jsxRuntime.jsx("p", { className: "pds-h2-sub", children: "\u041C\u0435\u0442\u043A\u0430 \xAB\u0421\u0435\u0433\u043E\u0434\u043D\u044F\xBB \u0437\u043D\u0430\u0447\u0438\u0442, \u0447\u0442\u043E \u0431\u0443\u043A\u0435\u0442 \u043A\u0443\u043F\u043B\u0435\u043D \u0441\u0435\u0433\u043E\u0434\u043D\u044F. \u0421\u0432\u0435\u0436\u0435\u0441\u0442\u044C \u0442\u0430\u0435\u0442, \u043F\u043E\u044D\u0442\u043E\u043C\u0443 \u043B\u0443\u0447\u0448\u0438\u0435 \u0440\u0430\u0437\u0431\u0438\u0440\u0430\u044E\u0442 \u0437\u0430 \u0447\u0430\u0441\u044B." })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx(GeoCatalog, { cityNom: city, cityLoc, districts })
    ] }) }),
    /* @__PURE__ */ jsxRuntime.jsx("section", { className: "pds-sec alt", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pds-in", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pds-sechead", children: [
        /* @__PURE__ */ jsxRuntime.jsxs("h2", { className: "pds-h2", children: [
          "\u0411\u0443\u043A\u0435\u0442\u044B \u043F\u043E \u0440\u0430\u0439\u043E\u043D\u0430\u043C ",
          cityGen
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("p", { className: "pds-h2-sub", children: [
          "\u0417\u0430\u0431\u0435\u0440\u0438\u0442\u0435 \u0431\u0443\u043A\u0435\u0442 \u0432 \u0441\u0432\u043E\u0451\u043C \u0440\u0430\u0439\u043E\u043D\u0435, \u0440\u044F\u0434\u043E\u043C \u0441 \u0434\u043E\u043C\u043E\u043C",
          nearMetro,
          ", \u0431\u0435\u0437 \u043F\u043E\u0435\u0437\u0434\u043E\u043A \u0447\u0435\u0440\u0435\u0437 \u0432\u0435\u0441\u044C \u0433\u043E\u0440\u043E\u0434."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pds-links", children: districts.map(([n, c]) => /* @__PURE__ */ jsxRuntime.jsxs("a", { className: "pds-linkcard", href: "#", onClick: (e) => e.preventDefault(), children: [
        /* @__PURE__ */ jsxRuntime.jsx("b", { children: n }),
        /* @__PURE__ */ jsxRuntime.jsx("span", { children: c })
      ] }, n)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntime.jsx("section", { className: "pds-sec", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pds-in", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pds-sechead", children: [
        /* @__PURE__ */ jsxRuntime.jsx("h2", { className: "pds-h2", children: "\u041D\u0435\u0434\u043E\u0440\u043E\u0433\u0438\u0435 \u0431\u0443\u043A\u0435\u0442\u044B \u043F\u043E\u0434 \u043F\u043E\u0432\u043E\u0434" }),
        /* @__PURE__ */ jsxRuntime.jsx("p", { className: "pds-h2-sub", children: "\u041A \u0441\u0432\u0438\u0434\u0430\u043D\u0438\u044E, \u043D\u0430 \u0434\u0435\u043D\u044C \u0440\u043E\u0436\u0434\u0435\u043D\u0438\u044F \u0438\u043B\u0438 \u043F\u0440\u043E\u0441\u0442\u043E \u0441\u0435\u0431\u0435, \u043F\u043E\u0434\u0431\u0435\u0440\u0438\u0442\u0435 \u0441\u0432\u0435\u0436\u0438\u0439 \u0431\u0443\u043A\u0435\u0442 \u0437\u0430 \u043F\u043E\u043B\u0446\u0435\u043D\u044B." })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pds-chips", children: OCCASIONS.map((o) => /* @__PURE__ */ jsxRuntime.jsx("a", { className: "pds-chip", href: "#", onClick: (e) => e.preventDefault(), children: o }, o)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntime.jsx("section", { className: "pds-sec alt", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pds-in", children: [
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pds-sechead", children: /* @__PURE__ */ jsxRuntime.jsx("h2", { className: "pds-h2", children: "\u041F\u043E\u0447\u0435\u043C\u0443 \u0442\u0430\u043A \u0434\u0435\u0448\u0435\u0432\u043B\u0435 \u0438 \u0431\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u043E" }) }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pds-faq", children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pds-faqitem", children: [
          /* @__PURE__ */ jsxRuntime.jsx("h3", { className: "pds-faqq", children: "\u041F\u043E\u0447\u0435\u043C\u0443 \u0441\u0432\u0435\u0436\u0438\u0435 \u0431\u0443\u043A\u0435\u0442\u044B \u0441\u0442\u043E\u044F\u0442 \u0432 2\u20133 \u0440\u0430\u0437\u0430 \u0434\u0435\u0448\u0435\u0432\u043B\u0435?" }),
          /* @__PURE__ */ jsxRuntime.jsx("p", { className: "pds-faqa", children: "\u042D\u0442\u043E \u043D\u0435 \u043C\u0430\u0433\u0430\u0437\u0438\u043D. \u0411\u0443\u043A\u0435\u0442 \u0443\u0436\u0435 \u043A\u043E\u043C\u0443-\u0442\u043E \u043F\u043E\u0434\u0430\u0440\u0438\u043B\u0438, \u043E\u043D \u043F\u043E\u0441\u0442\u043E\u044F\u043B \u0434\u0435\u043D\u044C \u0438 \u0442\u0435\u043F\u0435\u0440\u044C \u043D\u0435 \u043D\u0443\u0436\u0435\u043D \u0445\u043E\u0437\u044F\u0438\u043D\u0443. \u0427\u0435\u043B\u043E\u0432\u0435\u043A \u043E\u0442\u0434\u0430\u0451\u0442 \u0435\u0433\u043E \u0437\u0430 \u043F\u043E\u043B\u0446\u0435\u043D\u044B, \u043B\u0438\u0448\u044C \u0431\u044B \u0446\u0432\u0435\u0442\u044B \u043D\u0435 \u0432\u044B\u0431\u0440\u043E\u0441\u0438\u043B\u0438. \u0412\u044B \u043F\u043B\u0430\u0442\u0438\u0442\u0435 \u0437\u0430 \u0441\u0432\u0435\u0436\u0438\u0435 \u0446\u0432\u0435\u0442\u044B, \u0430 \u043D\u0435 \u0437\u0430 \u0432\u0438\u0442\u0440\u0438\u043D\u0443 \u0438 \u0430\u0440\u0435\u043D\u0434\u0443." })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pds-faqitem", children: [
          /* @__PURE__ */ jsxRuntime.jsx("h3", { className: "pds-faqq", children: "\u0426\u0432\u0435\u0442\u044B \u0442\u043E\u0447\u043D\u043E \u0441\u0432\u0435\u0436\u0438\u0435?" }),
          /* @__PURE__ */ jsxRuntime.jsx("p", { className: "pds-faqa", children: "\u0423 \u043A\u0430\u0436\u0434\u043E\u0433\u043E \u0431\u0443\u043A\u0435\u0442\u0430 \u0435\u0441\u0442\u044C \u0434\u0430\u0442\u0430 \u0438 \u043C\u0435\u0442\u043A\u0430 \u0441\u0432\u0435\u0436\u0435\u0441\u0442\u0438, \u0430 \u043D\u0430 \u0444\u043E\u0442\u043E \u0432\u0438\u0434\u043D\u043E \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435. \u0411\u0435\u0440\u0438\u0442\u0435 \u0442\u043E, \u0447\u0442\u043E \u043A\u0443\u043F\u043B\u0435\u043D\u043E \u0441\u0435\u0433\u043E\u0434\u043D\u044F \u0438\u043B\u0438 \u0432\u0447\u0435\u0440\u0430, \u0438 \u043F\u043B\u0430\u0442\u0438\u0442\u0435 \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0435\u043D\u043D\u043E." })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pds-faqitem", children: [
          /* @__PURE__ */ jsxRuntime.jsxs("h3", { className: "pds-faqq", children: [
            "\u041A\u0430\u043A \u0437\u0430\u0431\u0440\u0430\u0442\u044C \u0431\u0443\u043A\u0435\u0442 \u0432 ",
            cityLoc,
            "?"
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs("p", { className: "pds-faqa", children: [
            "\u0422\u043E\u043B\u044C\u043A\u043E \u0441\u0430\u043C\u043E\u0432\u044B\u0432\u043E\u0437. \u041A\u043E\u0433\u0434\u0430 \u0434\u043E\u0433\u043E\u0432\u043E\u0440\u0438\u0442\u0435\u0441\u044C \u0432 \u0447\u0430\u0442\u0435 \u0441\u0434\u0435\u043B\u043A\u0438, \u043F\u0440\u043E\u0434\u0430\u0432\u0435\u0446 \u043F\u0440\u0438\u0448\u043B\u0451\u0442 \u0440\u0430\u0439\u043E\u043D \u0438 \u0442\u043E\u0447\u043A\u0443 \u0432\u0441\u0442\u0440\u0435\u0447\u0438: \u043E\u0431\u044B\u0447\u043D\u043E \u0434\u0432\u043E\u0440",
            metro ? " \u0438\u043B\u0438 \u0441\u0442\u0430\u043D\u0446\u0438\u044F \u043C\u0435\u0442\u0440\u043E" : " \u0438\u043B\u0438 \u0440\u0430\u0439\u043E\u043D",
            " \u0440\u044F\u0434\u043E\u043C \u0441 \u043F\u0440\u043E\u0434\u0430\u0432\u0446\u043E\u043C. \u0414\u043E\u0441\u0442\u0430\u0432\u043A\u0438 \u043D\u0435\u0442, \u043F\u043E\u044D\u0442\u043E\u043C\u0443 \u0438 \u0446\u0435\u043D\u0430 \u0447\u0435\u0441\u0442\u043D\u0430\u044F."
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pds-faqitem", children: [
          /* @__PURE__ */ jsxRuntime.jsx("h3", { className: "pds-faqq", children: "\u0410 \u0435\u0441\u043B\u0438 \u043F\u0440\u043E\u0434\u0430\u0432\u0435\u0446 \u043E\u0431\u043C\u0430\u043D\u0435\u0442?" }),
          /* @__PURE__ */ jsxRuntime.jsx("p", { className: "pds-faqa", children: "\u0412\u044B \u043D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043F\u043B\u0430\u0442\u0438\u0442\u0435 \u0432\u043F\u0435\u0440\u0451\u0434: \u043E\u043F\u043B\u0430\u0442\u0430 \u0442\u043E\u043B\u044C\u043A\u043E \u043F\u0440\u0438 \u0432\u0441\u0442\u0440\u0435\u0447\u0435, \u043A\u043E\u0433\u0434\u0430 \u0443\u0432\u0438\u0434\u0435\u043B\u0438 \u0431\u0443\u043A\u0435\u0442. \u041D\u0430\u0434\u0451\u0436\u043D\u044B\u0445 \u043F\u0440\u043E\u0434\u0430\u0432\u0446\u043E\u0432 \u043F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u044E\u0442 \u0440\u0435\u0439\u0442\u0438\u043D\u0433 \u0438 \u043E\u0442\u0437\u044B\u0432\u044B, \u0430 \u043D\u0430 \u043D\u0430\u0440\u0443\u0448\u0438\u0442\u0435\u043B\u0435\u0439 \u043C\u043E\u0436\u043D\u043E \u043F\u043E\u0436\u0430\u043B\u043E\u0432\u0430\u0442\u044C\u0441\u044F." })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntime.jsx("section", { className: "pds-sec", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pds-in", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pds-sechead", children: [
        /* @__PURE__ */ jsxRuntime.jsx("h2", { className: "pds-h2", children: "\u0421\u0432\u0435\u0436\u0438\u0435 \u0431\u0443\u043A\u0435\u0442\u044B \u0432 \u0434\u0440\u0443\u0433\u0438\u0445 \u0433\u043E\u0440\u043E\u0434\u0430\u0445" }),
        /* @__PURE__ */ jsxRuntime.jsx("p", { className: "pds-h2-sub", children: "\xAB\u041F\u0435\u0440\u0435\u0434\u0430\u0440\u0438\u043C\xBB \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442 \u0432 10 \u043A\u0440\u0443\u043F\u043D\u0435\u0439\u0448\u0438\u0445 \u0433\u043E\u0440\u043E\u0434\u0430\u0445 \u0420\u043E\u0441\u0441\u0438\u0438, \u0432\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0441\u0432\u043E\u0439." })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pds-links", children: CITIES_FULL.map((c) => /* @__PURE__ */ jsxRuntime.jsxs("a", { className: "pds-linkcard", href: "/" + c.id, style: c.id === data.id ? { borderColor: "var(--pd-primary)" } : null, children: [
        /* @__PURE__ */ jsxRuntime.jsx("b", { children: c.nom }),
        /* @__PURE__ */ jsxRuntime.jsx("span", { children: c.count })
      ] }, c.id)) })
    ] }) })
  ] });
}
function PdSafeDeal({ platform = "desktop" }) {
  const desk = platform === "desktop";
  return /* @__PURE__ */ jsxRuntime.jsxs(Shell, { desk, children: [
    /* @__PURE__ */ jsxRuntime.jsx("section", { className: "pds-top", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pds-in", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("p", { className: "pds-crumbs", children: [
        /* @__PURE__ */ jsxRuntime.jsx("a", { href: LAND, children: "\u0413\u043B\u0430\u0432\u043D\u0430\u044F" }),
        " \xB7 \u0411\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u043E\u0441\u0442\u044C \xB7 \u0411\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u0430\u044F \u0441\u0434\u0435\u043B\u043A\u0430"
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("p", { className: "pds-eyebrow", children: [
        /* @__PURE__ */ jsxRuntime.jsx(Shield, { style: { color: "var(--pd-fresh)" } }),
        "\u0411\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u0430\u044F \u0441\u0434\u0435\u043B\u043A\u0430"
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("h1", { className: "pds-h1", children: [
        "\u041F\u043B\u0430\u0442\u0438\u0442\u0435 \u0437\u0430 \u0431\u0443\u043A\u0435\u0442, ",
        /* @__PURE__ */ jsxRuntime.jsx("em", { children: "\u0442\u043E\u043B\u044C\u043A\u043E \u043A\u043E\u0433\u0434\u0430 \u0437\u0430\u0431\u0440\u0430\u043B\u0438 \u0435\u0433\u043E" })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx("p", { className: "pds-intro", children: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0441\u0442\u0440\u0430\u0445 \u043F\u0440\u0438 \u043F\u043E\u043A\u0443\u043F\u043A\u0435 \u0443 \u043D\u0435\u0437\u043D\u0430\u043A\u043E\u043C\u0446\u0430 \u2014 \u0447\u0442\u043E \u0437\u0430\u043F\u043B\u0430\u0442\u0438\u0448\u044C \u0438 \u043E\u0441\u0442\u0430\u043D\u0435\u0448\u044C\u0441\u044F \u0431\u0435\u0437 \u0431\u0443\u043A\u0435\u0442\u0430. \u041D\u0430 \xAB\u041F\u0435\u0440\u0435\u0434\u0430\u0440\u0438\u043C\u0435\xBB \u043F\u0440\u0435\u0434\u043E\u043F\u043B\u0430\u0442\u044B \u043D\u0435\u0442: \u0432\u044B \u0434\u043E\u0433\u043E\u0432\u0430\u0440\u0438\u0432\u0430\u0435\u0442\u0435\u0441\u044C \u0432 \u0447\u0430\u0442\u0435, \u0432\u0441\u0442\u0440\u0435\u0447\u0430\u0435\u0442\u0435\u0441\u044C \u0440\u044F\u0434\u043E\u043C \u0441 \u0434\u043E\u043C\u043E\u043C \u0438 \u043F\u043B\u0430\u0442\u0438\u0442\u0435 \u043F\u0440\u043E\u0434\u0430\u0432\u0446\u0443 \u043D\u0430 \u043C\u0435\u0441\u0442\u0435 \u2014 \u043A\u043E\u0433\u0434\u0430 \u0443\u0432\u0438\u0434\u0435\u043B\u0438 \u0446\u0432\u0435\u0442\u044B \u0432\u0436\u0438\u0432\u0443\u044E." })
    ] }) }),
    /* @__PURE__ */ jsxRuntime.jsx("section", { className: "pds-sec alt", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pds-in", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pds-sechead", children: [
        /* @__PURE__ */ jsxRuntime.jsx("h2", { className: "pds-h2", children: "\u041A\u0430\u043A \u043F\u0440\u043E\u0445\u043E\u0434\u0438\u0442 \u0441\u0434\u0435\u043B\u043A\u0430" }),
        /* @__PURE__ */ jsxRuntime.jsx("p", { className: "pds-h2-sub", children: "\u0422\u0440\u0438 \u0448\u0430\u0433\u0430, \u0431\u0435\u0437 \u043F\u0440\u0435\u0434\u043E\u043F\u043B\u0430\u0442\u044B \u0438 \u043F\u043E\u0441\u0440\u0435\u0434\u043D\u0438\u043A\u043E\u0432." })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pds-flow", children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pds-step", children: [
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "en", children: "1" }),
          /* @__PURE__ */ jsxRuntime.jsx("h4", { children: "\u041D\u0430\u043F\u0438\u0441\u0430\u043B\u0438 \u043F\u0440\u043E\u0434\u0430\u0432\u0446\u0443" }),
          /* @__PURE__ */ jsxRuntime.jsx("p", { children: "\u0412 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0435 \u043D\u0430\u0436\u043C\u0438\u0442\u0435 \xAB\u041D\u0430\u043F\u0438\u0441\u0430\u0442\u044C \u043F\u0440\u043E\u0434\u0430\u0432\u0446\u0443\xBB \u0438 \u0434\u043E\u0433\u043E\u0432\u043E\u0440\u0438\u0442\u0435\u0441\u044C \u043E \u0432\u0440\u0435\u043C\u0435\u043D\u0438 \u0438 \u043C\u0435\u0441\u0442\u0435 \u0432\u0441\u0442\u0440\u0435\u0447\u0438 \u043F\u0440\u044F\u043C\u043E \u0432 \u0447\u0430\u0442\u0435 \u0441\u0434\u0435\u043B\u043A\u0438." })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pds-step", children: [
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "en", children: "2" }),
          /* @__PURE__ */ jsxRuntime.jsx("h4", { children: "\u0412\u0441\u0442\u0440\u0435\u0442\u0438\u043B\u0438\u0441\u044C \u0438 \u043F\u0440\u043E\u0432\u0435\u0440\u0438\u043B\u0438" }),
          /* @__PURE__ */ jsxRuntime.jsx("p", { children: "\u0421\u0430\u043C\u043E\u0432\u044B\u0432\u043E\u0437 \u0440\u044F\u0434\u043E\u043C, \u0443 \u0434\u043E\u043C\u0430 \u0438\u043B\u0438 \u043C\u0435\u0442\u0440\u043E. \u0421\u043C\u043E\u0442\u0440\u0438\u0442\u0435 \u0431\u0443\u043A\u0435\u0442 \u0432\u0436\u0438\u0432\u0443\u044E: \u0441\u0432\u0435\u0436\u0435\u0441\u0442\u044C, \u0440\u0430\u0437\u043C\u0435\u0440, \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435." })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pds-step", children: [
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "en", children: "3" }),
          /* @__PURE__ */ jsxRuntime.jsx("h4", { children: "\u041F\u043B\u0430\u0442\u0438\u0442\u0435 \u043F\u0440\u0438 \u0432\u0441\u0442\u0440\u0435\u0447\u0435" }),
          /* @__PURE__ */ jsxRuntime.jsx("p", { children: "\u041F\u043E\u043D\u0440\u0430\u0432\u0438\u043B\u0441\u044F \u0431\u0443\u043A\u0435\u0442 \u2014 \u043E\u0442\u0434\u0430\u0451\u0442\u0435 \u0434\u0435\u043D\u044C\u0433\u0438 \u043F\u0440\u043E\u0434\u0430\u0432\u0446\u0443 \u043D\u0430 \u043C\u0435\u0441\u0442\u0435, \u043D\u0430\u043B\u0438\u0447\u043D\u044B\u043C\u0438 \u0438\u043B\u0438 \u043F\u0435\u0440\u0435\u0432\u043E\u0434\u043E\u043C. \u041D\u0438\u043A\u0430\u043A\u0438\u0445 \u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0439 \u0437\u0430\u0440\u0430\u043D\u0435\u0435." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pds-safe", children: [
        /* @__PURE__ */ jsxRuntime.jsx(HeartHands, {}),
        /* @__PURE__ */ jsxRuntime.jsxs("p", { children: [
          /* @__PURE__ */ jsxRuntime.jsx("b", { children: "\u041D\u0435 \u043F\u043E\u043D\u0440\u0430\u0432\u0438\u043B\u0441\u044F \u0431\u0443\u043A\u0435\u0442 \u2014 \u043F\u0440\u043E\u0441\u0442\u043E \u043D\u0435 \u043F\u043B\u0430\u0442\u0438\u0442\u0435." }),
          " \u0412\u044B \u043D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u0442\u0435\u0440\u044F\u0435\u0442\u0435: \u0434\u0435\u043D\u044C\u0433\u0438 \u043E\u0441\u0442\u0430\u044E\u0442\u0441\u044F \u0443 \u0432\u0430\u0441, \u043F\u043E\u043A\u0430 \u0446\u0432\u0435\u0442\u044B \u043D\u0435 \u043E\u043A\u0430\u0436\u0443\u0442\u0441\u044F \u0432 \u0440\u0443\u043A\u0430\u0445."
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntime.jsx("section", { className: "pds-sec", children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pds-in", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pds-prose", children: [
      /* @__PURE__ */ jsxRuntime.jsx("h2", { className: "pds-h2", style: { marginBottom: 16 }, children: "\u041F\u043E\u0447\u0435\u043C\u0443 \u0442\u0430\u043A \u0431\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u0435\u0435" }),
      /* @__PURE__ */ jsxRuntime.jsx("p", { children: "\u041A\u043E\u0433\u0434\u0430 \u043F\u043B\u0430\u0442\u0438\u0448\u044C \u043F\u0440\u0438 \u0432\u0441\u0442\u0440\u0435\u0447\u0435, \u043E\u0431\u043C\u0430\u043D \u043F\u043E\u0447\u0442\u0438 \u043D\u0435\u0432\u043E\u0437\u043C\u043E\u0436\u0435\u043D: \u043F\u0440\u043E\u0434\u0430\u0432\u0435\u0446 \u043F\u043E\u043B\u0443\u0447\u0430\u0435\u0442 \u0434\u0435\u043D\u044C\u0433\u0438 \u0442\u043E\u043B\u044C\u043A\u043E \u0432 \u043E\u0431\u043C\u0435\u043D \u043D\u0430 \u0431\u0443\u043A\u0435\u0442, \u0430 \u0432\u044B \u0432\u0438\u0434\u0438\u0442\u0435 \u0446\u0432\u0435\u0442\u044B \u0434\u043E \u043E\u043F\u043B\u0430\u0442\u044B. \u042D\u0442\u043E \u043F\u0440\u0438\u0432\u044B\u0447\u043D\u0430\u044F \u0438 \u043F\u043E\u043D\u044F\u0442\u043D\u0430\u044F \u0441\u0445\u0435\u043C\u0430, \u043A\u0430\u043A \u043D\u0430 \u043B\u044E\u0431\u043E\u0439 \u0434\u043E\u0441\u043A\u0435 \u043E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u0439." }),
      /* @__PURE__ */ jsxRuntime.jsx("p", { children: "\u0427\u0442\u043E\u0431\u044B \u0432\u044B\u0431\u0440\u0430\u0442\u044C \u043D\u0430\u0434\u0451\u0436\u043D\u043E\u0433\u043E \u043F\u0440\u043E\u0434\u0430\u0432\u0446\u0430, \u0441\u043C\u043E\u0442\u0440\u0438\u0442\u0435 \u043D\u0430 \u0440\u0435\u0439\u0442\u0438\u043D\u0433 \u0438 \u043E\u0442\u0437\u044B\u0432\u044B: \u0438\u0445 \u043E\u0441\u0442\u0430\u0432\u043B\u044F\u044E\u0442 \u0440\u0435\u0430\u043B\u044C\u043D\u044B\u0435 \u043F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u0438 \u043F\u043E\u0441\u043B\u0435 \u0432\u0441\u0442\u0440\u0435\u0447. \u041F\u0440\u043E\u0444\u0438\u043B\u0438 \u0441 \u0438\u0441\u0442\u043E\u0440\u0438\u0435\u0439 \u0441\u0434\u0435\u043B\u043E\u043A \u0438 \u0445\u043E\u0440\u043E\u0448\u0438\u043C\u0438 \u043E\u0446\u0435\u043D\u043A\u0430\u043C\u0438 \u0431\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u0435\u0435 \u043D\u043E\u0432\u044B\u0445." }),
      /* @__PURE__ */ jsxRuntime.jsx("h3", { children: "\u041A\u043E\u0433\u0434\u0430 \u0434\u0435\u043D\u044C\u0433\u0438 \u0443\u0445\u043E\u0434\u044F\u0442 \u043F\u0440\u043E\u0434\u0430\u0432\u0446\u0443" }),
      /* @__PURE__ */ jsxRuntime.jsxs("ul", { children: [
        /* @__PURE__ */ jsxRuntime.jsx("li", { children: "\u0412\u044B \u0437\u0430\u0431\u0440\u0430\u043B\u0438 \u0431\u0443\u043A\u0435\u0442 \u0438 \u043D\u0430\u0436\u0430\u043B\u0438 \xAB\u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044C \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0435\xBB \u0432 \u0441\u0434\u0435\u043B\u043A\u0435." }),
        /* @__PURE__ */ jsxRuntime.jsx("li", { children: "\u041B\u0438\u0431\u043E \u043F\u0440\u043E\u0448\u0451\u043B \u0441\u0440\u043E\u043A \u043E\u0436\u0438\u0434\u0430\u043D\u0438\u044F \u0438 \u0432\u044B \u043D\u0435 \u043E\u0442\u043A\u0440\u044B\u043B\u0438 \u0441\u043F\u043E\u0440 \u2014 \u0441\u0434\u0435\u043B\u043A\u0430 \u0437\u0430\u043A\u0440\u044B\u0432\u0430\u0435\u0442\u0441\u044F \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438." })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx("h3", { children: "\u041A\u043E\u0433\u0434\u0430 \u0434\u0435\u043D\u044C\u0433\u0438 \u0432\u043E\u0437\u0432\u0440\u0430\u0449\u0430\u044E\u0442\u0441\u044F \u0432\u0430\u043C" }),
      /* @__PURE__ */ jsxRuntime.jsxs("ul", { children: [
        /* @__PURE__ */ jsxRuntime.jsx("li", { children: "\u041F\u0440\u043E\u0434\u0430\u0432\u0435\u0446 \u043D\u0435 \u0432\u044B\u0448\u0435\u043B \u043D\u0430 \u0432\u0441\u0442\u0440\u0435\u0447\u0443 \u0438\u043B\u0438 \u043D\u0435 \u043E\u0442\u0434\u0430\u043B \u0431\u0443\u043A\u0435\u0442." }),
        /* @__PURE__ */ jsxRuntime.jsx("li", { children: "\u0411\u0443\u043A\u0435\u0442 \u043E\u043A\u0430\u0437\u0430\u043B\u0441\u044F \u043D\u0435 \u0442\u0430\u043A\u0438\u043C, \u043A\u0430\u043A \u0432 \u043E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u0438, \u2014 \u0432\u044B \u043E\u0442\u043A\u0440\u044B\u0432\u0430\u0435\u0442\u0435 \u0441\u043F\u043E\u0440 \u0441 \u0444\u043E\u0442\u043E." }),
        /* @__PURE__ */ jsxRuntime.jsx("li", { children: "\u041F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0430 \u0432\u0441\u0442\u0430\u0451\u0442 \u043D\u0430 \u0432\u0430\u0448\u0443 \u0441\u0442\u043E\u0440\u043E\u043D\u0443 \u043F\u043E \u0438\u0442\u043E\u0433\u0430\u043C \u0440\u0430\u0437\u0431\u043E\u0440\u0430." })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntime.jsx("section", { className: "pds-sec alt", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pds-in", children: [
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pds-sechead", children: /* @__PURE__ */ jsxRuntime.jsx("h2", { className: "pds-h2", children: "\u0427\u0430\u0441\u0442\u044B\u0435 \u0432\u043E\u043F\u0440\u043E\u0441\u044B" }) }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pds-faq", children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pds-faqitem", children: [
          /* @__PURE__ */ jsxRuntime.jsx("h3", { className: "pds-faqq", children: "\u041D\u0443\u0436\u043D\u043E \u043B\u0438 \u043F\u043B\u0430\u0442\u0438\u0442\u044C \u0437\u0430\u0440\u0430\u043D\u0435\u0435?" }),
          /* @__PURE__ */ jsxRuntime.jsx("p", { className: "pds-faqa", children: "\u041D\u0435\u0442. \u041F\u0440\u0435\u0434\u043E\u043F\u043B\u0430\u0442\u044B \u043D\u0430 \xAB\u041F\u0435\u0440\u0435\u0434\u0430\u0440\u0438\u043C\u0435\xBB \u043D\u0435\u0442. \u0412\u044B \u043F\u043B\u0430\u0442\u0438\u0442\u0435 \u043F\u0440\u043E\u0434\u0430\u0432\u0446\u0443 \u043F\u0440\u0438 \u0432\u0441\u0442\u0440\u0435\u0447\u0435, \u043A\u043E\u0433\u0434\u0430 \u0443\u0436\u0435 \u0443\u0432\u0438\u0434\u0435\u043B\u0438 \u0438 \u0437\u0430\u0431\u0440\u0430\u043B\u0438 \u0431\u0443\u043A\u0435\u0442." })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pds-faqitem", children: [
          /* @__PURE__ */ jsxRuntime.jsx("h3", { className: "pds-faqq", children: "\u041A\u0430\u043A \u0432\u044B\u0431\u0440\u0430\u0442\u044C \u043D\u0430\u0434\u0451\u0436\u043D\u043E\u0433\u043E \u043F\u0440\u043E\u0434\u0430\u0432\u0446\u0430?" }),
          /* @__PURE__ */ jsxRuntime.jsx("p", { className: "pds-faqa", children: "\u0421\u043C\u043E\u0442\u0440\u0438\u0442\u0435 \u0440\u0435\u0439\u0442\u0438\u043D\u0433, \u043E\u0442\u0437\u044B\u0432\u044B \u0438 \u0438\u0441\u0442\u043E\u0440\u0438\u044E \u0441\u0434\u0435\u043B\u043E\u043A. \u0412\u0441\u0451 \u043E\u0431\u0449\u0435\u043D\u0438\u0435 \u0432\u0435\u0434\u0438\u0442\u0435 \u0432 \u0447\u0430\u0442\u0435 \u0441\u0434\u0435\u043B\u043A\u0438 \u2014 \u0442\u0430\u043A \u043E\u0441\u0442\u0430\u0451\u0442\u0441\u044F \u043F\u0435\u0440\u0435\u043F\u0438\u0441\u043A\u0430." })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pds-faqitem", children: [
          /* @__PURE__ */ jsxRuntime.jsx("h3", { className: "pds-faqq", children: "\u0421\u043A\u043E\u043B\u044C\u043A\u043E \u0431\u0435\u0440\u0451\u0442 \u0441\u0435\u0440\u0432\u0438\u0441?" }),
          /* @__PURE__ */ jsxRuntime.jsx("p", { className: "pds-faqa", children: "\u041F\u0443\u0431\u043B\u0438\u043A\u0430\u0446\u0438\u044F \u0438 \u0441\u0434\u0435\u043B\u043A\u0430 \u0431\u0435\u0441\u043F\u043B\u0430\u0442\u043D\u044B. \xAB\u041F\u0435\u0440\u0435\u0434\u0430\u0440\u0438\u043C\xBB \u0441\u0432\u043E\u0434\u0438\u0442 \u043F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u044F \u0438 \u043F\u0440\u043E\u0434\u0430\u0432\u0446\u0430, \u0430 \u0440\u0430\u0441\u0447\u0451\u0442 \u043F\u0440\u043E\u0445\u043E\u0434\u0438\u0442 \u043C\u0435\u0436\u0434\u0443 \u0432\u0430\u043C\u0438 \u043D\u0430\u043F\u0440\u044F\u043C\u0443\u044E." })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pds-faqitem", children: [
          /* @__PURE__ */ jsxRuntime.jsx("h3", { className: "pds-faqq", children: "\u0427\u0442\u043E \u0434\u0435\u043B\u0430\u0442\u044C \u043F\u0440\u0438 \u043E\u0431\u043C\u0430\u043D\u0435?" }),
          /* @__PURE__ */ jsxRuntime.jsx("p", { className: "pds-faqa", children: "\u041F\u043E\u0436\u0430\u043B\u0443\u0439\u0442\u0435\u0441\u044C \u043D\u0430 \u043E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u0435 \u0438\u043B\u0438 \u043F\u0440\u043E\u0434\u0430\u0432\u0446\u0430 \u2014 \u043C\u043E\u0434\u0435\u0440\u0430\u0446\u0438\u044F \u043F\u0440\u043E\u0432\u0435\u0440\u0438\u0442 \u0438 \u043F\u0440\u0438 \u043D\u0430\u0440\u0443\u0448\u0435\u043D\u0438\u0438 \u0437\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u0443\u0435\u0442. \u0414\u0435\u043D\u044C\u0433\u0438 \u0432\u044B \u043D\u0435 \u0442\u0435\u0440\u044F\u0435\u0442\u0435, \u0432\u0435\u0434\u044C \u043F\u043B\u0430\u0442\u0438\u0442\u0435 \u0442\u043E\u043B\u044C\u043A\u043E \u043F\u0440\u0438 \u0432\u0441\u0442\u0440\u0435\u0447\u0435." })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntime.jsx("section", { className: "pds-sec", children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pds-in", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pds-cta", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "tx", children: [
        /* @__PURE__ */ jsxRuntime.jsx("h3", { children: "\u0417\u0430\u0431\u0435\u0440\u0438\u0442\u0435 \u0441\u0432\u0435\u0436\u0438\u0439 \u0431\u0443\u043A\u0435\u0442 \u0437\u0430 \u043F\u043E\u043B\u0446\u0435\u043D\u044B" }),
        /* @__PURE__ */ jsxRuntime.jsx("p", { children: "\u0421\u0432\u0435\u0436\u0438\u0435 \u0446\u0432\u0435\u0442\u044B \u0440\u044F\u0434\u043E\u043C \u0441 \u0432\u0430\u043C\u0438, \u043E\u043F\u043B\u0430\u0442\u0430 \u043F\u0440\u0438 \u0432\u0441\u0442\u0440\u0435\u0447\u0435. \u0421\u0430\u043C\u043E\u0432\u044B\u0432\u043E\u0437 \u0432 \u0441\u0432\u043E\u0451\u043C \u0440\u0430\u0439\u043E\u043D\u0435." })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx(Btn, { variant: "primary", lg: true, icon: Arrow, children: "\u0421\u043C\u043E\u0442\u0440\u0435\u0442\u044C \u0431\u0443\u043A\u0435\u0442\u044B" })
    ] }) }) })
  ] });
}
var ARTICLES = [
  { id: "kuda-det-buket", tag: "\u041F\u0440\u043E\u0434\u0430\u0432\u0446\u0443", img: "1567418938902-aa650a3eb346", title: "\u041A\u0443\u0434\u0430 \u0434\u0435\u0442\u044C \u043F\u043E\u0434\u0430\u0440\u0435\u043D\u043D\u044B\u0439 \u0431\u0443\u043A\u0435\u0442 \u0432\u043C\u0435\u0441\u0442\u043E \u043C\u0443\u0441\u043E\u0440\u043A\u0438", excerpt: "\u041F\u043E\u0434\u0430\u0440\u0438\u043B\u0438 \u0446\u0432\u0435\u0442\u044B, \u0430 \u0434\u043E\u043C\u0430 \u0441\u0442\u0430\u0432\u0438\u0442\u044C \u043D\u0435\u043A\u0443\u0434\u0430? \u041F\u044F\u0442\u044C \u0441\u043F\u043E\u0441\u043E\u0431\u043E\u0432 \u0434\u0430\u0442\u044C \u0431\u0443\u043A\u0435\u0442\u0443 \u0432\u0442\u043E\u0440\u0443\u044E \u0436\u0438\u0437\u043D\u044C \u0438 \u0432\u0435\u0440\u043D\u0443\u0442\u044C \u0447\u0430\u0441\u0442\u044C \u0434\u0435\u043D\u0435\u0433.", read: "4 \u043C\u0438\u043D" },
  { id: "cvety-posle-prazdnika", tag: "\u0423\u0445\u043E\u0434", img: "1581938165093-050aeb5ef218", title: "\u0427\u0442\u043E \u0434\u0435\u043B\u0430\u0442\u044C \u0441 \u0446\u0432\u0435\u0442\u0430\u043C\u0438 \u043F\u043E\u0441\u043B\u0435 \u043F\u0440\u0430\u0437\u0434\u043D\u0438\u043A\u0430", excerpt: "\u0411\u043E\u043B\u044C\u0448\u043E\u0439 \u0431\u0443\u043A\u0435\u0442 \u043E\u0442\u0436\u0438\u043B \u0441\u0432\u043E\u0451 \u043D\u0430 \u0441\u0442\u043E\u043B\u0435, \u043D\u043E \u0446\u0432\u0435\u0442\u044B \u0435\u0449\u0451 \u0441\u0432\u0435\u0436\u0438\u0435. \u041A\u0430\u043A \u043D\u0435 \u0432\u044B\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u043A\u0440\u0430\u0441\u0438\u0432\u043E\u0435 \u0438 \u043A\u043E\u043C\u0443 \u043E\u043D\u043E \u043D\u0443\u0436\u043D\u043E.", read: "5 \u043C\u0438\u043D" },
  { id: "prodlit-zhizn-buketu", tag: "\u0423\u0445\u043E\u0434", img: "1561181286-d3fee7d55364", title: "\u041A\u0430\u043A \u043F\u0440\u043E\u0434\u043B\u0438\u0442\u044C \u0436\u0438\u0437\u043D\u044C \u0441\u0440\u0435\u0437\u0430\u043D\u043D\u043E\u043C\u0443 \u0431\u0443\u043A\u0435\u0442\u0443", excerpt: "\u041F\u0440\u043E\u0441\u0442\u044B\u0435 \u043F\u0440\u0438\u0451\u043C\u044B, \u043E\u0442 \u043F\u043E\u0434\u0440\u0435\u0437\u043A\u0438 \u0441\u0442\u0435\u0431\u043B\u0435\u0439 \u0434\u043E \u0432\u043E\u0434\u044B \u0438 \u043C\u0435\u0441\u0442\u0430: \u0447\u0442\u043E\u0431\u044B \u0431\u0443\u043A\u0435\u0442 \u043F\u0440\u043E\u0441\u0442\u043E\u044F\u043B \u043D\u0430 \u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u0434\u043D\u0435\u0439 \u0434\u043E\u043B\u044C\u0448\u0435.", read: "6 \u043C\u0438\u043D" }
];
function PdBlogIndex({ platform = "desktop" }) {
  const desk = platform === "desktop";
  return /* @__PURE__ */ jsxRuntime.jsxs(Shell, { desk, children: [
    /* @__PURE__ */ jsxRuntime.jsx("section", { className: "pds-top", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pds-in", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("p", { className: "pds-crumbs", children: [
        /* @__PURE__ */ jsxRuntime.jsx("a", { href: LAND, children: "\u0413\u043B\u0430\u0432\u043D\u0430\u044F" }),
        " \xB7 \u0411\u043B\u043E\u0433"
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("p", { className: "pds-eyebrow", children: [
        /* @__PURE__ */ jsxRuntime.jsx(Leaf, {}),
        "\u0411\u043B\u043E\u0433 \xAB\u041F\u0435\u0440\u0435\u0434\u0430\u0440\u0438\u043C\u0430\xBB"
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("h1", { className: "pds-h1", children: [
        "\u0427\u0442\u043E \u0434\u0435\u043B\u0430\u0442\u044C \u0441 \u0431\u0443\u043A\u0435\u0442\u043E\u043C, \u043A\u043E\u0442\u043E\u0440\u044B\u0439 ",
        /* @__PURE__ */ jsxRuntime.jsx("em", { children: "\u0443\u0436\u0435 \u043F\u043E\u0434\u0430\u0440\u0438\u043B\u0438" })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx("p", { className: "pds-intro", children: "\u041A\u043E\u0440\u043E\u0442\u043A\u0438\u0435 \u0437\u0430\u043C\u0435\u0442\u043A\u0438 \u0434\u043B\u044F \u0442\u0435\u0445, \u043A\u043E\u043C\u0443 \u043F\u043E\u0434\u0430\u0440\u0438\u043B\u0438 \u0446\u0432\u0435\u0442\u044B: \u043A\u0430\u043A \u043F\u0440\u043E\u0434\u043B\u0438\u0442\u044C \u0438\u043C \u0436\u0438\u0437\u043D\u044C, \u0447\u0442\u043E \u0441\u0434\u0435\u043B\u0430\u0442\u044C \u0432\u043C\u0435\u0441\u0442\u043E \u043C\u0443\u0441\u043E\u0440\u043A\u0438 \u0438 \u043A\u0430\u043A \u043E\u0442\u0434\u0430\u0442\u044C \u0431\u0443\u043A\u0435\u0442 \u0434\u0430\u043B\u044C\u0448\u0435 \u0437\u0430 \u043F\u043E\u043B\u0446\u0435\u043D\u044B." })
    ] }) }),
    /* @__PURE__ */ jsxRuntime.jsx("section", { className: "pds-sec", children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pds-in", children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pds-blog-grid", children: ARTICLES.map((a) => /* @__PURE__ */ jsxRuntime.jsxs("a", { className: "pds-blogcard", href: "/blog/" + a.id, children: [
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "ph", children: /* @__PURE__ */ jsxRuntime.jsx("img", { src: `img/${a.img}.jpg`, alt: a.title, loading: "lazy" }) }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "bd", children: [
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "tag", children: a.tag }),
        /* @__PURE__ */ jsxRuntime.jsx("h3", { children: a.title }),
        /* @__PURE__ */ jsxRuntime.jsx("p", { children: a.excerpt }),
        /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "rd", children: [
          "\u0427\u0438\u0442\u0430\u0442\u044C \xB7 ",
          a.read
        ] })
      ] })
    ] }, a.id)) }) }) }),
    /* @__PURE__ */ jsxRuntime.jsx("section", { className: "pds-sec alt", children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pds-in", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pds-cta", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "tx", children: [
        /* @__PURE__ */ jsxRuntime.jsx("h3", { children: "\u0412\u0430\u043C \u043F\u043E\u0434\u0430\u0440\u0438\u043B\u0438 \u0431\u0443\u043A\u0435\u0442?" }),
        /* @__PURE__ */ jsxRuntime.jsx("p", { children: "\u041D\u0435 \u0432\u044B\u0431\u0440\u0430\u0441\u044B\u0432\u0430\u0439\u0442\u0435 \u043A\u0440\u0430\u0441\u0438\u0432\u043E\u0435 \u0438 \u0436\u0438\u0432\u043E\u0435. \u0412\u044B\u0441\u0442\u0430\u0432\u044C\u0442\u0435 \u0437\u0430 \u043C\u0438\u043D\u0443\u0442\u0443 \u2014 \u0431\u0443\u043A\u0435\u0442 \u0434\u043E\u0441\u0442\u0430\u043D\u0435\u0442\u0441\u044F \u043A\u043E\u043C\u0443-\u0442\u043E \u0440\u044F\u0434\u043E\u043C, \u0430 \u0432\u044B \u0432\u0435\u0440\u043D\u0451\u0442\u0435 \u0447\u0430\u0441\u0442\u044C \u0434\u0435\u043D\u0435\u0433." })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx(Btn, { variant: "primary", lg: true, icon: Plus, children: "\u041E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u0442\u044C \u0431\u0443\u043A\u0435\u0442" })
    ] }) }) })
  ] });
}
function PdBlogArticle({ platform = "desktop", article = ARTICLES[0] }) {
  const desk = platform === "desktop";
  const a = article;
  return /* @__PURE__ */ jsxRuntime.jsxs(Shell, { desk, children: [
    /* @__PURE__ */ jsxRuntime.jsx("section", { className: "pds-top", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pds-in pds-art-head", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("p", { className: "pds-crumbs", children: [
        /* @__PURE__ */ jsxRuntime.jsx("a", { href: LAND, children: "\u0413\u043B\u0430\u0432\u043D\u0430\u044F" }),
        " \xB7 ",
        /* @__PURE__ */ jsxRuntime.jsx("a", { href: "/blog", children: "\u0411\u043B\u043E\u0433" }),
        " \xB7 \u041F\u043E\u0434\u0430\u0440\u0435\u043D\u043D\u044B\u0439 \u0431\u0443\u043A\u0435\u0442"
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("p", { className: "pds-eyebrow", children: [
        /* @__PURE__ */ jsxRuntime.jsx(Leaf, {}),
        a.tag
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx("h1", { className: "pds-h1", style: { fontSize: desk ? 42 : 30 }, children: "\u041A\u0443\u0434\u0430 \u0434\u0435\u0442\u044C \u043F\u043E\u0434\u0430\u0440\u0435\u043D\u043D\u044B\u0439 \u0431\u0443\u043A\u0435\u0442 \u0432\u043C\u0435\u0441\u0442\u043E \u043C\u0443\u0441\u043E\u0440\u043A\u0438" }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pds-art-meta", children: [
        /* @__PURE__ */ jsxRuntime.jsx("span", { children: "\xAB\u041F\u0435\u0440\u0435\u0434\u0430\u0440\u0438\u043C\xBB" }),
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "dot" }),
        /* @__PURE__ */ jsxRuntime.jsx("span", { children: "5 \u0438\u044E\u043D\u044F 2026" }),
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "dot" }),
        /* @__PURE__ */ jsxRuntime.jsxs("span", { children: [
          a.read,
          " \u0447\u0442\u0435\u043D\u0438\u044F"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntime.jsx("section", { style: { padding: "0 0 8px" }, children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pds-in", children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pds-art-hero", children: /* @__PURE__ */ jsxRuntime.jsx("img", { src: `img/${a.img}.jpg`, alt: "\u0421\u0432\u0435\u0436\u0438\u0439 \u0431\u0443\u043A\u0435\u0442, \u043A\u043E\u0442\u043E\u0440\u044B\u0439 \u043C\u043E\u0436\u043D\u043E \u043F\u0435\u0440\u0435\u0434\u0430\u0442\u044C \u0434\u0430\u043B\u044C\u0448\u0435" }) }) }) }),
    /* @__PURE__ */ jsxRuntime.jsx("section", { className: "pds-sec", style: { paddingTop: 8 }, children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pds-in", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pds-prose", children: [
        /* @__PURE__ */ jsxRuntime.jsx("p", { children: "\u0411\u043E\u043B\u044C\u0448\u043E\u0439 \u0431\u0443\u043A\u0435\u0442 \u043D\u0430 \u0434\u0435\u043D\u044C \u0440\u043E\u0436\u0434\u0435\u043D\u0438\u044F \u0438\u043B\u0438 8 \u043C\u0430\u0440\u0442\u0430 \u2014 \u044D\u0442\u043E \u043A\u0440\u0430\u0441\u0438\u0432\u043E \u0440\u043E\u0432\u043D\u043E \u0434\u043E \u0442\u043E\u0433\u043E \u043C\u043E\u043C\u0435\u043D\u0442\u0430, \u043A\u043E\u0433\u0434\u0430 \u0434\u043E\u043C\u0430 \u0437\u0430\u043A\u0430\u043D\u0447\u0438\u0432\u0430\u044E\u0442\u0441\u044F \u0432\u0430\u0437\u044B. \u0427\u0435\u0440\u0435\u0437 \u0434\u0435\u043D\u044C-\u0434\u0432\u0430 \u0432\u0441\u0442\u0430\u0451\u0442 \u0432\u043E\u043F\u0440\u043E\u0441: \u0446\u0432\u0435\u0442\u044B \u0435\u0449\u0451 \u0441\u0432\u0435\u0436\u0438\u0435, \u0430 \u0441\u0442\u0430\u0432\u0438\u0442\u044C \u0438\u0445 \u043D\u0435\u043A\u0443\u0434\u0430. \u0412\u044B\u0431\u0440\u0430\u0441\u044B\u0432\u0430\u0442\u044C \u0436\u0438\u0432\u043E\u0439 \u0431\u0443\u043A\u0435\u0442 \u0436\u0430\u043B\u043A\u043E, \u043D\u043E \u0438 \u0434\u0435\u0440\u0436\u0430\u0442\u044C \u0432\u044F\u043D\u0443\u0449\u0438\u043C \u0442\u043E\u0436\u0435 \u043D\u0435 \u0432\u0430\u0440\u0438\u0430\u043D\u0442." }),
        /* @__PURE__ */ jsxRuntime.jsx("p", { children: "\u0425\u043E\u0440\u043E\u0448\u0430\u044F \u043D\u043E\u0432\u043E\u0441\u0442\u044C: \u0443 \u0431\u0443\u043A\u0435\u0442\u0430 \u0435\u0441\u0442\u044C \u0436\u0438\u0437\u043D\u044C \u0438 \u043F\u043E\u0441\u043B\u0435 \u0432\u0430\u0448\u0435\u0433\u043E \u043F\u0440\u0430\u0437\u0434\u043D\u0438\u043A\u0430. \u0412\u043E\u0442 \u0447\u0442\u043E \u0441 \u043D\u0438\u043C \u043C\u043E\u0436\u043D\u043E \u0441\u0434\u0435\u043B\u0430\u0442\u044C." }),
        /* @__PURE__ */ jsxRuntime.jsx("h3", { children: "1. \u041F\u0435\u0440\u0435\u0434\u0430\u0442\u044C \u0435\u0433\u043E \u0434\u0430\u043B\u044C\u0448\u0435 \u0437\u0430 \u043F\u043E\u043B\u0446\u0435\u043D\u044B" }),
        /* @__PURE__ */ jsxRuntime.jsx("p", { children: "\u0420\u044F\u0434\u043E\u043C \u0432\u0441\u0435\u0433\u0434\u0430 \u0435\u0441\u0442\u044C \u043A\u0442\u043E-\u0442\u043E, \u043A\u043E\u043C\u0443 \u043D\u0443\u0436\u043D\u044B \u0441\u0432\u0435\u0436\u0438\u0435 \u0446\u0432\u0435\u0442\u044B \u043D\u0430 \u0441\u0432\u0438\u0434\u0430\u043D\u0438\u0435, \u0432 \u043F\u043E\u0434\u0430\u0440\u043E\u043A \u0438\u043B\u0438 \u043F\u0440\u043E\u0441\u0442\u043E \u0434\u043E\u043C\u043E\u0439 \u2014 \u043D\u043E \u043D\u0435 \u0437\u0430 \u043C\u0430\u0433\u0430\u0437\u0438\u043D\u043D\u044B\u0435 \u0434\u0435\u043D\u044C\u0433\u0438. \u0412\u044B\u0441\u0442\u0430\u0432\u044C\u0442\u0435 \u0431\u0443\u043A\u0435\u0442 \u043D\u0430 \xAB\u041F\u0435\u0440\u0435\u0434\u0430\u0440\u0438\u043C\u0435\xBB: \u043F\u0430\u0440\u0430 \u0444\u043E\u0442\u043E, \u0440\u0430\u0439\u043E\u043D \u0438 \u0446\u0435\u043D\u0430 \u0432 \u043F\u043E\u043B\u0446\u0435\u043D\u044B. \u041F\u0443\u0431\u043B\u0438\u043A\u0430\u0446\u0438\u044F \u0431\u0435\u0441\u043F\u043B\u0430\u0442\u043D\u0430\u044F. \u0412\u044B \u0432\u043E\u0437\u0432\u0440\u0430\u0449\u0430\u0435\u0442\u0435 \u0447\u0430\u0441\u0442\u044C \u0434\u0435\u043D\u0435\u0433, \u0430 \u0446\u0432\u0435\u0442\u044B \u0434\u043E\u0441\u0442\u0430\u044E\u0442\u0441\u044F \u0447\u0435\u043B\u043E\u0432\u0435\u043A\u0443 \u043F\u043E\u0431\u043B\u0438\u0437\u043E\u0441\u0442\u0438." }),
        /* @__PURE__ */ jsxRuntime.jsx("h3", { children: "2. \u041F\u0440\u043E\u0434\u043B\u0438\u0442\u044C \u0435\u043C\u0443 \u0436\u0438\u0437\u043D\u044C" }),
        /* @__PURE__ */ jsxRuntime.jsxs("ul", { children: [
          /* @__PURE__ */ jsxRuntime.jsx("li", { children: "\u041F\u043E\u0434\u0440\u0435\u0436\u044C\u0442\u0435 \u0441\u0442\u0435\u0431\u043B\u0438 \u043F\u043E\u0434 \u0443\u0433\u043B\u043E\u043C \u0438 \u0441\u043C\u0435\u043D\u0438\u0442\u0435 \u0432\u043E\u0434\u0443." }),
          /* @__PURE__ */ jsxRuntime.jsx("li", { children: "\u0423\u0431\u0435\u0440\u0438\u0442\u0435 \u0431\u0443\u043A\u0435\u0442 \u043E\u0442 \u0431\u0430\u0442\u0430\u0440\u0435\u0438, \u0444\u0440\u0443\u043A\u0442\u043E\u0432 \u0438 \u043F\u0440\u044F\u043C\u043E\u0433\u043E \u0441\u043E\u043B\u043D\u0446\u0430." }),
          /* @__PURE__ */ jsxRuntime.jsx("li", { children: "\u0420\u0430\u0437\u0431\u0435\u0440\u0438\u0442\u0435 \u0431\u043E\u043B\u044C\u0448\u043E\u0439 \u0431\u0443\u043A\u0435\u0442 \u043D\u0430 \u043F\u0430\u0440\u0443 \u043C\u0430\u043B\u0435\u043D\u044C\u043A\u0438\u0445 \u2014 \u0442\u0430\u043A \u0446\u0432\u0435\u0442\u0430\u043C \u043F\u0440\u043E\u0441\u0442\u043E\u0440\u043D\u0435\u0435." })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx("h3", { children: "3. \u041E\u0442\u0434\u0430\u0442\u044C \u0442\u043E\u043C\u0443, \u043A\u043E\u043C\u0443 \u043F\u0440\u0438\u044F\u0442\u043D\u043E" }),
        /* @__PURE__ */ jsxRuntime.jsx("p", { children: "\u0421\u043E\u0441\u0435\u0434\u043A\u0430, \u043A\u043E\u043B\u043B\u0435\u0433\u0430, \u043F\u0443\u043D\u043A\u0442 \u0443 \u0434\u043E\u043C\u0430: \u0431\u0443\u043A\u0435\u0442 \u043B\u0435\u0433\u043A\u043E \u043F\u043E\u0434\u0430\u0440\u0438\u0442\u044C \u0434\u0430\u043B\u044C\u0448\u0435. \u041D\u043E \u0435\u0441\u043B\u0438 \u0445\u043E\u0447\u0435\u0442\u0441\u044F \u0432\u0435\u0440\u043D\u0443\u0442\u044C \u0447\u0430\u0441\u0442\u044C \u0434\u0435\u043D\u0435\u0433 \u0438 \u043D\u0435 \u0438\u0441\u043A\u0430\u0442\u044C \u0441\u0430\u043C\u043E\u043C\u0443, \u043A\u043E\u043C\u0443 \u043E\u043D \u043D\u0443\u0436\u0435\u043D, \u043F\u0440\u043E\u0449\u0435 \u0432\u044B\u0441\u0442\u0430\u0432\u0438\u0442\u044C \u0435\u0433\u043E \u0432 \u0441\u0435\u0440\u0432\u0438\u0441\u0435: \u043F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u044C \u043D\u0430\u0439\u0434\u0451\u0442\u0441\u044F \u0441\u0430\u043C \u0438 \u0437\u0430\u0431\u0435\u0440\u0451\u0442 \u0440\u044F\u0434\u043E\u043C." }),
        /* @__PURE__ */ jsxRuntime.jsxs("p", { children: [
          /* @__PURE__ */ jsxRuntime.jsx("b", { children: "\u0413\u043B\u0430\u0432\u043D\u043E\u0435 \u2014 \u043D\u0435 \u0432 \u043C\u0443\u0441\u043E\u0440\u043A\u0443." }),
          " \u0416\u0438\u0432\u043E\u0439 \u0431\u0443\u043A\u0435\u0442 \u043C\u043E\u0436\u0435\u0442 \u043F\u043E\u0440\u0430\u0434\u043E\u0432\u0430\u0442\u044C \u0435\u0449\u0451 \u043E\u0434\u043D\u043E\u0433\u043E \u0447\u0435\u043B\u043E\u0432\u0435\u043A\u0430. \u041D\u0430 \xAB\u041F\u0435\u0440\u0435\u0434\u0430\u0440\u0438\u043C\u0435\xBB \u044D\u0442\u043E \u0437\u0430\u043D\u0438\u043C\u0430\u0435\u0442 \u043C\u0438\u043D\u0443\u0442\u0443."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pds-cta", style: { marginTop: 34 }, children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "tx", children: [
          /* @__PURE__ */ jsxRuntime.jsx("h3", { children: "\u041F\u043E\u0434\u0430\u0440\u0438\u0442\u0435 \u0431\u0443\u043A\u0435\u0442\u0443 \u0432\u0442\u043E\u0440\u0443\u044E \u0436\u0438\u0437\u043D\u044C" }),
          /* @__PURE__ */ jsxRuntime.jsx("p", { children: "\u0412\u044B\u0441\u0442\u0430\u0432\u044C\u0442\u0435 \u0437\u0430 \u043C\u0438\u043D\u0443\u0442\u0443 \u0441 \u0442\u0435\u043B\u0435\u0444\u043E\u043D\u0430. \u0421\u0430\u043C\u043E\u0432\u044B\u0432\u043E\u0437 \u0440\u044F\u0434\u043E\u043C, \u043F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u044C \u0437\u0430\u0431\u0435\u0440\u0451\u0442 \u0441\u0430\u043C." })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx(Btn, { variant: "primary", lg: true, icon: Plus, children: "\u041E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u0442\u044C \u0431\u0443\u043A\u0435\u0442" })
      ] })
    ] }) })
  ] });
}

exports.CITIES_FULL = CITIES_FULL;
exports.PdBlogArticle = PdBlogArticle;
exports.PdBlogIndex = PdBlogIndex;
exports.PdGeoPage = PdGeoPage;
exports.PdLanding = PdLanding;
exports.PdLandingFooter = PdLandingFooter;
exports.PdLandingNav = PdLandingNav;
exports.PdSafeDeal = PdSafeDeal;
exports.PdSeoMeta = PdSeoMeta;
exports.nbsp = nbsp;
