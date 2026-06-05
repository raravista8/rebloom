import { PD_FRESH, PD_LIKED, PdBtn, Ic, Card } from './chunk-OS4LB2PH.mjs';
import React from 'react';
import { jsxs, jsx } from 'react/jsx-runtime';

var PETAL = "M50 50C38 41 36 21 50 10C64 21 62 41 50 50Z";
var Mark = ({ size = 22, center = "#E8A93B", style, className, title = "\u041F\u0435\u0440\u0435\u0434\u0430\u0440\u0438\u043C" }) => /* @__PURE__ */ jsxs("svg", { className, width: size, height: size, viewBox: "0 0 100 100", role: "img", "aria-label": title, style: { display: "block", flex: "none", ...style }, children: [
  [0, 72, 144, 216, 288].map((a) => /* @__PURE__ */ jsx("path", { d: PETAL, fill: "currentColor", transform: `rotate(${a} 50 50)` }, a)),
  /* @__PURE__ */ jsx("circle", { cx: "50", cy: "50", r: "8", fill: center })
] });
var PdLanding = (function() {
  const Ic2 = Ic, Btn = PdBtn, Card2 = Card;
  const FRESH = PD_FRESH || [], LIKED = PD_LIKED || [];
  const HERO_IMG = "img/1561181286-d3fee7d55364.jpg";
  const CITIES = [
    { id: "msk", name: "\u041C\u043E\u0441\u043A\u0432\u0430", count: 128 },
    { id: "spb", name: "\u0421\u0430\u043D\u043A\u0442-\u041F\u0435\u0442\u0435\u0440\u0431\u0443\u0440\u0433", count: 86 },
    { id: "kzn", name: "\u041A\u0430\u0437\u0430\u043D\u044C", count: 41 },
    { id: "ekb", name: "\u0415\u043A\u0430\u0442\u0435\u0440\u0438\u043D\u0431\u0443\u0440\u0433", count: 33 },
    { id: "nsk", name: "\u041D\u043E\u0432\u043E\u0441\u0438\u0431\u0438\u0440\u0441\u043A", count: 27 }
  ];
  [...FRESH.slice(0, 4), ...LIKED.slice(0, 4)].slice(0, 8);
  const G = {
    apple: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", width: "34", height: "34", fill: "#fff", children: /* @__PURE__ */ jsx("path", { d: "M16.4 12.6c0-2.2 1.8-3.3 1.9-3.3-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.6.8-3.3.8-.7 0-1.7-.8-2.8-.8-1.5 0-2.8.8-3.6 2.1-1.5 2.7-.4 6.6 1.1 8.8.7 1 1.5 2.2 2.6 2.2 1 0 1.4-.7 2.7-.7 1.2 0 1.6.7 2.7.6 1.1 0 1.8-1 2.5-2 .8-1.2 1.1-2.3 1.1-2.4-.1 0-2.1-.8-2.1-3.1zM14.3 6.1c.6-.7 1-1.7.9-2.7-.8 0-1.9.6-2.5 1.3-.5.6-1 1.6-.9 2.6.9.1 1.8-.5 2.5-1.2z" }) }),
    play: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", width: "33", height: "33", children: [
      /* @__PURE__ */ jsx("path", { d: "M4 3.5v17l9.5-8.5L4 3.5z", fill: "#2BD27A" }),
      /* @__PURE__ */ jsx("path", { d: "M13.5 12 4 3.5l11.5 6.4L13.5 12z", fill: "#FFC93A" }),
      /* @__PURE__ */ jsx("path", { d: "M13.5 12 4 20.5l11.5-6.4L13.5 12z", fill: "#FF5A5F" }),
      /* @__PURE__ */ jsx("path", { d: "m15.5 9.9 4 2.1-4 2.2L13.5 12l2-2.1z", fill: "#3B9DFF" })
    ] }),
    rustore: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", width: "34", height: "34", children: [
      /* @__PURE__ */ jsx("rect", { x: "3", y: "3", width: "18", height: "18", rx: "5", fill: "#0A6CFF" }),
      /* @__PURE__ */ jsx("path", { d: "M8 7.5h5.2c1.7 0 2.8 1 2.8 2.6 0 1.2-.7 2.1-1.8 2.4l2 4H14l-1.8-3.7H10V16.5H8v-9zm2 1.7v2.4h2.9c.7 0 1.1-.5 1.1-1.2 0-.7-.4-1.2-1.1-1.2H10z", fill: "#fff" })
    ] }),
    gallery: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", width: "34", height: "34", children: [
      /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "9", fill: "#E33B3B" }),
      /* @__PURE__ */ jsx("path", { d: "M9.2 8.5c0 2.3 1.2 4 2.8 4s2.8-1.7 2.8-4M8 13.8c.9 1.6 2.3 2.7 4 2.7s3.1-1.1 4-2.7", stroke: "#fff", strokeWidth: "1.4", fill: "none", strokeLinecap: "round" })
    ] })
  };
  const STORES = [
    { id: "ios", glyph: G.apple, small: "\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u0435 \u0432", name: "App Store" },
    { id: "play", glyph: G.play, small: "\u0414\u043E\u0441\u0442\u0443\u043F\u043D\u043E \u0432", name: "Google Play" },
    { id: "rustore", glyph: G.rustore, small: "\u0423\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u0435 \u0438\u0437", name: "RuStore" },
    { id: "gallery", glyph: G.gallery, small: "\u041E\u0442\u043A\u0440\u043E\u0439\u0442\u0435 \u0432", name: "AppGallery" }
  ];
  const Leaf = (p) => /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", ...p, children: [
    /* @__PURE__ */ jsx("path", { d: "M5 19c0-7 5-12 14-13 0 9-5 13-11 13-1.5 0-3 .5-3 .5", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" }),
    /* @__PURE__ */ jsx("path", { d: "M5 19c2-4 5-6 9-7", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round" })
  ] });
  const Tag = (p) => /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", ...p, fill: "none", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsx("path", { d: "M20 12 12 20l-8-8V4h8z" }),
    /* @__PURE__ */ jsx("circle", { cx: "8.5", cy: "8.5", r: "1.3", fill: "currentColor", stroke: "none" })
  ] });
  const Shield = (p) => /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", ...p, fill: "none", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsx("path", { d: "M12 3 5 6v5c0 4.2 2.9 7.5 7 9 4.1-1.5 7-4.8 7-9V6z" }),
    /* @__PURE__ */ jsx("path", { d: "m9.2 12 1.9 1.9 3.7-3.7" })
  ] });
  const Pin = (p) => /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", ...p, fill: "none", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsx("path", { d: "M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z" }),
    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "10", r: "2.5" })
  ] });
  const Search = (p) => /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", ...p, fill: "none", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsx("circle", { cx: "11", cy: "11", r: "7" }),
    /* @__PURE__ */ jsx("path", { d: "m20 20-3.2-3.2" })
  ] });
  const Bell = (p) => /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", ...p, fill: "none", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsx("path", { d: "M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" }),
    /* @__PURE__ */ jsx("path", { d: "M10 19a2 2 0 0 0 4 0" })
  ] });
  const Chev = (p) => /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", ...p, fill: "none", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx("path", { d: "m6 9 6 6 6-6" }) });
  const Menu = (p) => /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", ...p, fill: "none", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx("path", { d: "M4 7h16M4 12h16M4 17h16" }) });
  const Star = (p) => /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", ...p, fill: "currentColor", children: /* @__PURE__ */ jsx("path", { d: "M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.6 1-5.8L3.5 9.7l5.9-.9z" }) });
  function CityChips({ cls }) {
    return /* @__PURE__ */ jsx("div", { className: cls, children: CITIES.map((c, i) => /* @__PURE__ */ jsxs("button", { className: "pdl-citychip" + (i === 0 ? " on" : ""), children: [
      c.name,
      /* @__PURE__ */ jsx("span", { className: "n", children: c.count })
    ] }, c.id)) });
  }
  function Hero({ desk }) {
    const text = /* @__PURE__ */ jsxs("div", { className: "pdl-herotext", children: [
      /* @__PURE__ */ jsxs("p", { className: "pdl-kicker", children: [
        /* @__PURE__ */ jsx(Leaf, { className: "lf" }),
        "\u0412\u0442\u043E\u0440\u0430\u044F \u0436\u0438\u0437\u043D\u044C \u0431\u0443\u043A\u0435\u0442\u043E\u0432"
      ] }),
      /* @__PURE__ */ jsxs("h1", { className: "pdl-h1", children: [
        "\u0421\u0432\u0435\u0436\u0438\u0435 \u0431\u0443\u043A\u0435\u0442\u044B ",
        /* @__PURE__ */ jsx("em", { children: "\u0432 2\u20133 \u0440\u0430\u0437\u0430 \u0434\u0435\u0448\u0435\u0432\u043B\u0435" }),
        " \u0446\u0432\u0435\u0442\u043E\u0447\u043D\u043E\u0433\u043E \u043C\u0430\u0433\u0430\u0437\u0438\u043D\u0430"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "pdl-lead", children: "\u041A\u043E\u043C\u0443-\u0442\u043E \u043F\u043E\u0434\u0430\u0440\u0438\u043B\u0438 \u0446\u0432\u0435\u0442\u044B, \u0430 \u043E\u043D\u0438 \u0435\u0449\u0451 \u0441\u0432\u0435\u0436\u0438\u0435. \u0412\u043C\u0435\u0441\u0442\u043E \u043C\u0443\u0441\u043E\u0440\u043D\u043E\u0433\u043E \u0432\u0435\u0434\u0440\u0430 \u0431\u0443\u043A\u0435\u0442 \u043D\u0430\u0445\u043E\u0434\u0438\u0442 \u043D\u043E\u0432\u044B\u0439 \u0434\u043E\u043C. \u0412\u044B \u043F\u0435\u0440\u0435\u0434\u0430\u0451\u0442\u0435 \u0441\u0432\u043E\u0439 \u0431\u0443\u043A\u0435\u0442 \u0434\u0430\u043B\u044C\u0448\u0435 \u0438\u043B\u0438 \u0437\u0430\u0431\u0438\u0440\u0430\u0435\u0442\u0435 \u0447\u0443\u0436\u043E\u0439 \u0437\u0430 \u043F\u043E\u043B\u0446\u0435\u043D\u044B." }),
      /* @__PURE__ */ jsxs("div", { className: "pdl-cta", children: [
        /* @__PURE__ */ jsx(Btn, { variant: "primary", lg: true, icon: Ic2 && Ic2.plus, children: "\u041E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u0442\u044C \u0431\u0443\u043A\u0435\u0442" }),
        /* @__PURE__ */ jsx(Btn, { variant: "secondary", lg: true, children: "\u0421\u043C\u043E\u0442\u0440\u0435\u0442\u044C \u0431\u0443\u043A\u0435\u0442\u044B" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pdl-trust", children: [
        /* @__PURE__ */ jsxs("span", { className: "t", children: [
          /* @__PURE__ */ jsx(Tag, {}),
          "\u0412 2\u20133 \u0440\u0430\u0437\u0430 \u0434\u0435\u0448\u0435\u0432\u043B\u0435"
        ] }),
        /* @__PURE__ */ jsx("span", { className: "sep" }),
        /* @__PURE__ */ jsxs("span", { className: "t", children: [
          /* @__PURE__ */ jsx(Shield, {}),
          "\u0414\u0435\u043D\u044C\u0433\u0438 \u043F\u043E\u0434 \u0437\u0430\u0449\u0438\u0442\u043E\u0439 \u044D\u0441\u043A\u0440\u043E\u0443"
        ] }),
        /* @__PURE__ */ jsx("span", { className: "sep" }),
        /* @__PURE__ */ jsxs("span", { className: "t", children: [
          /* @__PURE__ */ jsx(Pin, {}),
          "\u0420\u044F\u0434\u043E\u043C \u0441 \u0434\u043E\u043C\u043E\u043C"
        ] })
      ] })
    ] });
    const vis = /* @__PURE__ */ jsx("div", { className: "pdl-herovis", children: /* @__PURE__ */ jsxs("div", { className: "pdl-herophoto", children: [
      /* @__PURE__ */ jsx("img", { src: HERO_IMG, alt: "\u0421\u0432\u0435\u0436\u0438\u0439 \u0431\u0443\u043A\u0435\u0442 \u0442\u044E\u043B\u044C\u043F\u0430\u043D\u043E\u0432", loading: "lazy" }),
      /* @__PURE__ */ jsxs("span", { className: "pdl-livecount", children: [
        /* @__PURE__ */ jsx("span", { className: "pdl-livedot" }),
        "128 \u0441\u0432\u0435\u0436\u0438\u0445 \u0431\u0443\u043A\u0435\u0442\u043E\u0432 \u0441\u0435\u0439\u0447\u0430\u0441"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pdl-pricetag", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "old", children: "2 490 \u20BD \u0432 \u0446\u0432\u0435\u0442\u043E\u0447\u043D\u043E\u0439" }),
          /* @__PURE__ */ jsx("div", { className: "new", children: "\u043E\u0442 690 \u20BD" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "save", children: [
          /* @__PURE__ */ jsx("b", { children: "\u221260%" }),
          /* @__PURE__ */ jsx("span", { children: "\u0434\u0435\u0448\u0435\u0432\u043B\u0435" })
        ] })
      ] })
    ] }) });
    return /* @__PURE__ */ jsx("section", { className: "pdl-hero", children: /* @__PURE__ */ jsxs("div", { className: "pdl-hero-in", children: [
      text,
      vis
    ] }) });
  }
  const C_POOL = [...FRESH, ...LIKED];
  const C_PRICE = { any: () => true, lt1k: (p) => p < 1e3, "1k2k": (p) => p >= 1e3 && p <= 2e3, gt2k: (p) => p > 2e3 };
  const C_RATING = { any: () => true, "45": (r) => r >= 4.5, "48": (r) => r >= 4.8, "5": (r) => r >= 5 };
  const FILTERS = {
    price: { label: "\u0426\u0435\u043D\u0430", opts: [["lt1k", "\u0434\u043E 1 000 \u20BD"], ["1k2k", "1 000\u20132 000 \u20BD"], ["gt2k", "2 000 \u20BD+"]] },
    fresh: { label: "\u0421\u0432\u0435\u0436\u0435\u0441\u0442\u044C", opts: [["today", "\u0421\u0435\u0433\u043E\u0434\u043D\u044F"], ["d1_2", "1\u20132 \u0434\u043D\u044F"]] },
    rating: { label: "\u0420\u0435\u0439\u0442\u0438\u043D\u0433 \u043F\u0440\u043E\u0434\u0430\u0432\u0446\u0430", opts: [["45", "4,5+"], ["48", "4,8+"], ["5", "5,0"]] }
  };
  function Catalog({ desk }) {
    const [sel, setSel] = React.useState({ price: "any", fresh: "any", rating: "any" });
    const toggle = (k, v) => setSel((s) => ({ ...s, [k]: s[k] === v ? "any" : v }));
    const reset = () => setSel({ price: "any", fresh: "any", rating: "any" });
    const activeN = Object.values(sel).filter((v) => v !== "any").length;
    const filtered = React.useMemo(() => C_POOL.filter(
      (d) => C_PRICE[sel.price](d.price) && (sel.fresh === "any" || d.fresh === sel.fresh) && C_RATING[sel.rating](d.seller.r)
    ), [sel]);
    const shown = filtered.slice(0, 8);
    return /* @__PURE__ */ jsx("section", { className: "pdl-sec alt", id: "catalog", children: /* @__PURE__ */ jsxs("div", { className: "pdl-in", children: [
      /* @__PURE__ */ jsxs("div", { className: "pdl-sechead l", children: [
        /* @__PURE__ */ jsxs("p", { className: "pdl-kicker", children: [
          /* @__PURE__ */ jsx(Leaf, { className: "lf" }),
          "\u0416\u0438\u0432\u043E\u0439 \u043A\u0430\u0442\u0430\u043B\u043E\u0433"
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "pdl-h2", children: "\u0421\u0432\u0435\u0436\u0438\u0435 \u0431\u0443\u043A\u0435\u0442\u044B \u0440\u044F\u0434\u043E\u043C, \u043F\u0440\u044F\u043C\u043E \u0441\u0435\u0439\u0447\u0430\u0441" }),
        /* @__PURE__ */ jsx("p", { className: "pdl-sub", children: "\u041C\u0435\u0442\u043A\u0430 \xAB\u0421\u0435\u0433\u043E\u0434\u043D\u044F\xBB \u0437\u043D\u0430\u0447\u0438\u0442, \u0447\u0442\u043E \u0431\u0443\u043A\u0435\u0442 \u043A\u0443\u043F\u043B\u0435\u043D \u0441\u0435\u0433\u043E\u0434\u043D\u044F. \u0421\u0432\u0435\u0436\u0435\u0441\u0442\u044C \u0442\u0430\u0435\u0442, \u043F\u043E\u044D\u0442\u043E\u043C\u0443 \u043B\u0443\u0447\u0448\u0438\u0435 \u0440\u0430\u0437\u0431\u0438\u0440\u0430\u044E\u0442 \u0437\u0430 \u0447\u0430\u0441\u044B." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pdl-catbar", children: [
        /* @__PURE__ */ jsx(CityChips, { cls: "pdl-cities" }),
        /* @__PURE__ */ jsxs("span", { className: "pdl-catcount", children: [
          /* @__PURE__ */ jsx("span", { className: "d" }),
          filtered.length,
          " \u0441\u0432\u0435\u0436\u0438\u0445 \u0431\u0443\u043A\u0435\u0442\u043E\u0432 \u0432 \u041C\u043E\u0441\u043A\u0432\u0435"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pdl-filters", children: [
        Object.entries(FILTERS).map(([k, g]) => /* @__PURE__ */ jsxs("div", { className: "pdl-fgroup", children: [
          /* @__PURE__ */ jsx("span", { className: "pdl-flabel", children: g.label }),
          g.opts.map(([val, lab]) => /* @__PURE__ */ jsxs("button", { className: "pdl-fchip" + (sel[k] === val ? " on" : ""), onClick: () => toggle(k, val), children: [
            k === "rating" && /* @__PURE__ */ jsx("span", { className: "st", children: "\u2605" }),
            lab
          ] }, val))
        ] }, k)),
        activeN > 0 && /* @__PURE__ */ jsxs("button", { className: "pdl-freset", onClick: reset, children: [
          "\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C",
          activeN > 1 ? ` (${activeN})` : ""
        ] })
      ] }),
      shown.length === 0 ? /* @__PURE__ */ jsx("p", { className: "pdl-catnote", children: "\u041F\u043E \u044D\u0442\u0438\u043C \u0444\u0438\u043B\u044C\u0442\u0440\u0430\u043C \u043D\u0438\u0447\u0435\u0433\u043E \u043D\u0435\u0442, \u0441\u043C\u044F\u0433\u0447\u0438\u0442\u0435 \u0446\u0435\u043D\u0443 \u0438\u043B\u0438 \u0441\u0432\u0435\u0436\u0435\u0441\u0442\u044C." }) : /* @__PURE__ */ jsx("div", { className: "pdl-catgrid", children: shown.map((d, i) => /* @__PURE__ */ jsx("div", { className: "pd-rise", children: /* @__PURE__ */ jsx(Card2, { d, variant: "grid" }) }, d.id || i)) }),
      /* @__PURE__ */ jsx("div", { className: "pdl-catall", children: /* @__PURE__ */ jsxs("a", { href: "\u041F\u0435\u0440\u0435\u0434\u0430\u0440\u0438\u043C \xB7 \u041A\u0430\u0442\u0430\u043B\u043E\u0433 \u0431\u0443\u043A\u0435\u0442\u043E\u0432.html", children: [
        "\u0412\u0435\u0441\u044C \u043A\u0430\u0442\u0430\u043B\u043E\u0433 \u0431\u0443\u043A\u0435\u0442\u043E\u0432",
        /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", width: "18", height: "18", fill: "none", stroke: "currentColor", strokeWidth: "2.1", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx("path", { d: "M5 12h14M13 6l6 6-6 6" }) })
      ] }) })
    ] }) });
  }
  function How({ desk }) {
    return /* @__PURE__ */ jsx("section", { className: "pdl-sec", id: "how", children: /* @__PURE__ */ jsxs("div", { className: "pdl-in", children: [
      /* @__PURE__ */ jsxs("div", { className: "pdl-sechead", children: [
        /* @__PURE__ */ jsxs("p", { className: "pdl-kicker", style: { justifyContent: "center" }, children: [
          /* @__PURE__ */ jsx(Leaf, { className: "lf" }),
          "\u041A\u0430\u043A \u044D\u0442\u043E \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442"
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "pdl-h2", children: "\u0422\u0440\u0438 \u0448\u0430\u0433\u0430, \u0438 \u0431\u0443\u043A\u0435\u0442 \u043F\u0440\u043E\u0434\u043E\u043B\u0436\u0430\u0435\u0442 \u0440\u0430\u0434\u043E\u0432\u0430\u0442\u044C" }),
        /* @__PURE__ */ jsx("p", { className: "pdl-sub", children: "\u041F\u0443\u0442\u044C \u043F\u0440\u043E\u0434\u0430\u0432\u0446\u0430: \u0432\u044B\u0441\u0442\u0430\u0432\u0438\u0442\u044C \u0431\u0443\u043A\u0435\u0442 \u043F\u0440\u043E\u0449\u0435, \u0447\u0435\u043C \u043A\u0430\u0436\u0435\u0442\u0441\u044F" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pdl-steps", children: [
        /* @__PURE__ */ jsxs("div", { className: "pdl-step", children: [
          /* @__PURE__ */ jsx("span", { className: "pdl-seller-tag", children: "\u043F\u0440\u043E\u0434\u0430\u0432\u0435\u0446" }),
          /* @__PURE__ */ jsx("div", { className: "pdl-stepn", children: "1" }),
          /* @__PURE__ */ jsx("h3", { children: "\u041F\u043E\u043B\u0443\u0447\u0438\u043B\u0438 \u0431\u0443\u043A\u0435\u0442" }),
          /* @__PURE__ */ jsx("p", { children: "\u0412\u0430\u043C \u043F\u043E\u0434\u0430\u0440\u0438\u043B\u0438 \u0446\u0432\u0435\u0442\u044B, \u043D\u043E \u0434\u043E\u043C\u0430 \u0438\u0445 \u0443\u0436\u0435 \u043D\u0435\u043A\u0443\u0434\u0430 \u0441\u0442\u0430\u0432\u0438\u0442\u044C, \u0430 \u043E\u043D\u0438 \u0435\u0449\u0451 \u0441\u0432\u0435\u0436\u0438\u0435 \u0438 \u0436\u0438\u0432\u044B\u0435." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pdl-step", children: [
          /* @__PURE__ */ jsx("span", { className: "pdl-seller-tag", children: "\u043F\u0440\u043E\u0434\u0430\u0432\u0435\u0446" }),
          /* @__PURE__ */ jsx("div", { className: "pdl-stepn", children: "2" }),
          /* @__PURE__ */ jsx("h3", { children: "\u0412\u044B\u0441\u0442\u0430\u0432\u0438\u043B\u0438 \u0437\u0430 \u043F\u043E\u043B\u0446\u0435\u043D\u044B" }),
          /* @__PURE__ */ jsx("p", { children: "\u0421\u0444\u043E\u0442\u043E\u0433\u0440\u0430\u0444\u0438\u0440\u043E\u0432\u0430\u043B\u0438, \u0443\u043A\u0430\u0437\u0430\u043B\u0438 \u0441\u0432\u0435\u0436\u0435\u0441\u0442\u044C \u0438 \u0440\u0430\u0439\u043E\u043D. \u041F\u0443\u0431\u043B\u0438\u043A\u0430\u0446\u0438\u044F \u0431\u0435\u0441\u043F\u043B\u0430\u0442\u043D\u0430, \u0441\u0435\u0440\u0432\u0438\u0441 \u0431\u0435\u0440\u0451\u0442 \u0432\u0441\u0435\u0433\u043E 5% \u043A\u043E\u043C\u0438\u0441\u0441\u0438\u0438 \u0438 \u0442\u043E\u043B\u044C\u043A\u043E \u043A\u043E\u0433\u0434\u0430 \u0431\u0443\u043A\u0435\u0442 \u043F\u0440\u043E\u0434\u0430\u043D." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pdl-step", children: [
          /* @__PURE__ */ jsx("span", { className: "pdl-seller-tag", children: "\u043F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u044C" }),
          /* @__PURE__ */ jsx("div", { className: "pdl-stepn", children: "3" }),
          /* @__PURE__ */ jsx("h3", { children: "\u041A\u0442\u043E-\u0442\u043E \u0440\u044F\u0434\u043E\u043C \u0437\u0430\u0431\u0440\u0430\u043B" }),
          /* @__PURE__ */ jsx("p", { children: "\u041F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u044C \u043E\u043F\u043B\u0430\u0447\u0438\u0432\u0430\u0435\u0442 \u0447\u0435\u0440\u0435\u0437 \u0431\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u0443\u044E \u0441\u0434\u0435\u043B\u043A\u0443 \u0438 \u0437\u0430\u0431\u0438\u0440\u0430\u0435\u0442 \u0431\u0443\u043A\u0435\u0442 \u0440\u044F\u0434\u043E\u043C \u0441 \u0432\u0430\u043C\u0438. \u0414\u0435\u043D\u044C\u0433\u0438 \u043F\u0440\u0438\u0445\u043E\u0434\u044F\u0442 \u0432\u0430\u043C." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pdl-vals", children: [
        /* @__PURE__ */ jsxs("div", { className: "pdl-val", children: [
          /* @__PURE__ */ jsx("div", { className: "ic", children: /* @__PURE__ */ jsx(Tag, {}) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("b", { children: "\u0412 2\u20133 \u0440\u0430\u0437\u0430 \u0434\u0435\u0448\u0435\u0432\u043B\u0435" }),
            /* @__PURE__ */ jsx("span", { children: "\u0441\u0432\u0435\u0436\u0438\u0435 \u0431\u0443\u043A\u0435\u0442\u044B \u043F\u043E-\u0447\u0435\u0441\u0442\u043D\u043E\u043C\u0443" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pdl-val", children: [
          /* @__PURE__ */ jsx("div", { className: "ic g", children: /* @__PURE__ */ jsx(Shield, {}) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("b", { children: "\u0411\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u0430\u044F \u0441\u0434\u0435\u043B\u043A\u0430" }),
            /* @__PURE__ */ jsx("span", { children: "\u0434\u0435\u043D\u044C\u0433\u0438 \u043F\u043E\u0434 \u0437\u0430\u0449\u0438\u0442\u043E\u0439 \u044D\u0441\u043A\u0440\u043E\u0443" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pdl-val", children: [
          /* @__PURE__ */ jsx("div", { className: "ic gold", children: /* @__PURE__ */ jsx(Pin, {}) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("b", { children: "\u0420\u044F\u0434\u043E\u043C \u0441 \u0432\u0430\u043C\u0438" }),
            /* @__PURE__ */ jsx("span", { children: "\u0441\u0430\u043C\u043E\u0432\u044B\u0432\u043E\u0437 \u0438\u043B\u0438 \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0430 \u043F\u043E \u0433\u043E\u0440\u043E\u0434\u0443" })
          ] })
        ] })
      ] })
    ] }) });
  }
  function Escrow({ desk }) {
    const HeartHands = (p) => /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", ...p, fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx("path", { d: "M12 20.3C12 20.3 3.4 14.9 3.4 8.7 3.4 6 5.5 4 8 4 9.8 4 11.3 5 12 6.3 12.7 5 14.2 4 16 4 18.5 4 20.6 6 20.6 8.7 20.6 14.9 12 20.3 12 20.3Z" }) });
    return /* @__PURE__ */ jsx("section", { className: "pdl-sec pdl-escrow", id: "safety", children: /* @__PURE__ */ jsxs("div", { className: "pdl-in", children: [
      /* @__PURE__ */ jsxs("div", { className: "pdl-sechead l", children: [
        /* @__PURE__ */ jsxs("p", { className: "pdl-kicker", children: [
          /* @__PURE__ */ jsx(Shield, { style: { width: 14, height: 14 } }),
          "\u0411\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u0430\u044F \u0441\u0434\u0435\u043B\u043A\u0430"
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "pdl-h2", children: "\u0414\u0435\u043D\u044C\u0433\u0438 \u043F\u0440\u0438\u0434\u0443\u0442 \u043F\u0440\u043E\u0434\u0430\u0432\u0446\u0443 \u0442\u043E\u043B\u044C\u043A\u043E \u043F\u043E\u0441\u043B\u0435 \u0442\u043E\u0433\u043E, \u043A\u0430\u043A \u0432\u044B \u0437\u0430\u0431\u0440\u0430\u043B\u0438 \u0431\u0443\u043A\u0435\u0442" }),
        /* @__PURE__ */ jsx("p", { className: "pdl-sub", children: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0441\u0442\u0440\u0430\u0445 \u0432 \u0441\u0434\u0435\u043B\u043A\u0430\u0445 \u043C\u0435\u0436\u0434\u0443 \u043D\u0435\u0437\u043D\u0430\u043A\u043E\u043C\u0446\u0430\u043C\u0438 \u2014 \u043E\u0431\u043C\u0430\u043D. \u041F\u043E\u044D\u0442\u043E\u043C\u0443 \u0434\u0435\u043D\u044C\u0433\u0438 \u043F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u044F \u0437\u0430\u043C\u043E\u0440\u0430\u0436\u0438\u0432\u0430\u044E\u0442\u0441\u044F \u0438 \u0436\u0434\u0443\u0442, \u043F\u043E\u043A\u0430 \u0431\u0443\u043A\u0435\u0442 \u043D\u0435 \u043E\u043A\u0430\u0436\u0435\u0442\u0441\u044F \u0443 \u043D\u0435\u0433\u043E \u0432 \u0440\u0443\u043A\u0430\u0445." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pdl-escrow-grid", children: [
        /* @__PURE__ */ jsxs("div", { className: "pdl-eflow", children: [
          /* @__PURE__ */ jsx("span", { className: "en", children: "1" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h4", { children: "\u041F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u044C \u043F\u043B\u0430\u0442\u0438\u0442" }),
            /* @__PURE__ */ jsx("p", { children: "\u0414\u0435\u043D\u044C\u0433\u0438 \u0441\u043F\u0438\u0441\u044B\u0432\u0430\u044E\u0442\u0441\u044F \u0438 \u0437\u0430\u043C\u043E\u0440\u0430\u0436\u0438\u0432\u0430\u044E\u0442\u0441\u044F \u043D\u0430 \u0441\u0447\u0451\u0442\u0435 \u0441\u0435\u0440\u0432\u0438\u0441\u0430, \u0430 \u043D\u0435 \u0443 \u043F\u0440\u043E\u0434\u0430\u0432\u0446\u0430." })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pdl-eflow", children: [
          /* @__PURE__ */ jsx("span", { className: "en", children: "2" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h4", { children: "\u0417\u0430\u0431\u0438\u0440\u0430\u0435\u0442 \u0431\u0443\u043A\u0435\u0442" }),
            /* @__PURE__ */ jsx("p", { children: "\u0421\u0430\u043C\u043E\u0432\u044B\u0432\u043E\u0437 \u0438\u043B\u0438 \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0430 \u043F\u043E \u0433\u043E\u0440\u043E\u0434\u0443. \u041F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u044C \u0432\u0438\u0434\u0438\u0442, \u0447\u0442\u043E \u0446\u0432\u0435\u0442\u044B \u0441\u0432\u0435\u0436\u0438\u0435." })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pdl-eflow", children: [
          /* @__PURE__ */ jsx("span", { className: "en", children: "3" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h4", { children: "\u0414\u0435\u043D\u044C\u0433\u0438 \u0443\u0445\u043E\u0434\u044F\u0442 \u043F\u0440\u043E\u0434\u0430\u0432\u0446\u0443" }),
            /* @__PURE__ */ jsx("p", { children: "\u0422\u043E\u043B\u044C\u043A\u043E \u043F\u043E\u0441\u043B\u0435 \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u044F \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u044F, \u0437\u0430 \u0432\u044B\u0447\u0435\u0442\u043E\u043C 5% \u043A\u043E\u043C\u0438\u0441\u0441\u0438\u0438 \u0441\u0435\u0440\u0432\u0438\u0441\u0430. \u0414\u043E \u044D\u0442\u043E\u0433\u043E \u0434\u0435\u043D\u044C\u0433\u0438 \u043F\u043E\u0434 \u0437\u0430\u0449\u0438\u0442\u043E\u0439." })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pdl-esafe", children: [
        /* @__PURE__ */ jsx(HeartHands, {}),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("b", { children: "\u0415\u0441\u043B\u0438 \u0447\u0442\u043E-\u0442\u043E \u043F\u043E\u0448\u043B\u043E \u043D\u0435 \u0442\u0430\u043A" }),
          " \u0438 \u0431\u0443\u043A\u0435\u0442 \u043D\u0435 \u043E\u0442\u0434\u0430\u043B\u0438 \u0438\u043B\u0438 \u043E\u043D \u043E\u043A\u0430\u0437\u0430\u043B\u0441\u044F \u043D\u0435 \u0442\u0430\u043A\u0438\u043C, \u0434\u0435\u043D\u044C\u0433\u0438 \u0432\u043E\u0437\u0432\u0440\u0430\u0449\u0430\u044E\u0442\u0441\u044F \u043F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u044E. \u0421\u043F\u043E\u0440 \u0440\u0435\u0448\u0430\u0435\u0442 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0430, \u0430 \u043D\u0435 \u043F\u0440\u043E\u0434\u0430\u0432\u0435\u0446."
        ] })
      ] })
    ] }) });
  }
  function Objections({ desk }) {
    return /* @__PURE__ */ jsx("section", { className: "pdl-sec alt", id: "faq", children: /* @__PURE__ */ jsxs("div", { className: "pdl-in", children: [
      /* @__PURE__ */ jsxs("div", { className: "pdl-sechead", children: [
        /* @__PURE__ */ jsxs("p", { className: "pdl-kicker", style: { justifyContent: "center" }, children: [
          /* @__PURE__ */ jsx(Leaf, { className: "lf" }),
          "\u0427\u0435\u0441\u0442\u043D\u043E \u043E \u0433\u043B\u0430\u0432\u043D\u043E\u043C"
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "pdl-h2", children: "\u0410 \u0432\u0434\u0440\u0443\u0433\u2026" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pdl-obj", children: [
        /* @__PURE__ */ jsxs("div", { className: "pdl-objc", children: [
          /* @__PURE__ */ jsxs("h3", { className: "pdl-objq", children: [
            /* @__PURE__ */ jsx("span", { className: "qm", children: "?" }),
            "\u2026\u0431\u0443\u043A\u0435\u0442 \u0443\u0436\u0435 \u043F\u043E\u0434\u0432\u044F\u0432\u0448\u0438\u0439?"
          ] }),
          /* @__PURE__ */ jsx("p", { children: "\u0423 \u043A\u0430\u0436\u0434\u043E\u0433\u043E \u0431\u0443\u043A\u0435\u0442\u0430 \u0441\u0442\u043E\u0438\u0442 \u0434\u0430\u0442\u0430 \u0438 \u043C\u0435\u0442\u043A\u0430 \u0441\u0432\u0435\u0436\u0435\u0441\u0442\u0438, \u0430 \u043D\u0430 \u0444\u043E\u0442\u043E \u0432\u0438\u0434\u043D\u043E \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435. \u0411\u0435\u0440\u0451\u0442\u0435 \u0442\u043E\u043B\u044C\u043A\u043E \u0442\u043E, \u0447\u0442\u043E \u043A\u0443\u043F\u043B\u0435\u043D\u043E \u0441\u0435\u0433\u043E\u0434\u043D\u044F \u0438\u043B\u0438 \u0432\u0447\u0435\u0440\u0430, \u0438 \u043F\u043B\u0430\u0442\u0438\u0442\u0435 \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0435\u043D\u043D\u043E." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pdl-objc", children: [
          /* @__PURE__ */ jsxs("h3", { className: "pdl-objq", children: [
            /* @__PURE__ */ jsx("span", { className: "qm", children: "?" }),
            "\u2026\u043F\u0440\u043E\u0434\u0430\u0432\u0435\u0446 \u043D\u0435 \u043E\u0442\u0434\u0430\u0441\u0442 \u043F\u043E\u0441\u043B\u0435 \u043E\u043F\u043B\u0430\u0442\u044B?"
          ] }),
          /* @__PURE__ */ jsx("p", { children: "\u041D\u0435 \u0441\u043C\u043E\u0436\u0435\u0442. \u0414\u0435\u043D\u044C\u0433\u0438 \u0437\u0430\u043C\u043E\u0440\u043E\u0436\u0435\u043D\u044B \u0438 \u0443\u0439\u0434\u0443\u0442 \u0435\u043C\u0443 \u0442\u043E\u043B\u044C\u043A\u043E \u043F\u043E\u0441\u043B\u0435 \u0442\u043E\u0433\u043E, \u043A\u0430\u043A \u0432\u044B \u0437\u0430\u0431\u0440\u0430\u043B\u0438 \u0431\u0443\u043A\u0435\u0442. \u041D\u0435 \u0437\u0430\u0431\u0440\u0430\u043B\u0438, \u0432\u0435\u0440\u043D\u0451\u043C \u043E\u043F\u043B\u0430\u0442\u0443." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pdl-objc", children: [
          /* @__PURE__ */ jsxs("h3", { className: "pdl-objq", children: [
            /* @__PURE__ */ jsx("span", { className: "qm", children: "?" }),
            "\u2026\u043D\u0435\u043B\u043E\u0432\u043A\u043E \u043F\u0440\u043E\u0434\u0430\u0432\u0430\u0442\u044C \u043F\u043E\u0434\u0430\u0440\u043E\u043A?"
          ] }),
          /* @__PURE__ */ jsx("p", { children: "\u0412\u044B \u043D\u0435 \u0432\u044B\u0431\u0440\u0430\u0441\u044B\u0432\u0430\u0435\u0442\u0435 \u0438 \u043D\u0435 \u043D\u0430\u0436\u0438\u0432\u0430\u0435\u0442\u0435\u0441\u044C. \u0412\u044B \u043E\u0442\u0434\u0430\u0451\u0442\u0435 \u043A\u0440\u0430\u0441\u0438\u0432\u043E\u0435 \u0442\u043E\u043C\u0443, \u043A\u043E\u043C\u0443 \u043E\u043D\u043E \u043D\u0443\u0436\u043D\u043E, \u0438 \u0432\u043E\u0437\u0432\u0440\u0430\u0449\u0430\u0435\u0442\u0435 \u0447\u0430\u0441\u0442\u044C \u0434\u0435\u043D\u0435\u0433. \u042D\u0442\u043E \u0431\u0435\u0440\u0435\u0436\u043D\u043E, \u0430 \u043D\u0435 \u0441\u0442\u044B\u0434\u043D\u043E." })
        ] })
      ] })
    ] }) });
  }
  function App({ desk }) {
    return /* @__PURE__ */ jsx("section", { className: "pdl-sec pdl-app", id: "app", children: /* @__PURE__ */ jsx("div", { className: "pdl-in", children: /* @__PURE__ */ jsxs("div", { className: "pdl-app-in", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("p", { className: "pdl-kicker", children: [
          /* @__PURE__ */ jsx(Leaf, { className: "lf" }),
          "\u041F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435"
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "pdl-h2", children: "\u0423\u0437\u043D\u0430\u0432\u0430\u0439\u0442\u0435 \u043E \u0441\u0432\u0435\u0436\u0438\u0445 \u0431\u0443\u043A\u0435\u0442\u0430\u0445 \u0440\u044F\u0434\u043E\u043C \u043F\u0435\u0440\u0432\u044B\u043C\u0438" }),
        /* @__PURE__ */ jsx("p", { className: "pdl-sub", children: "\u0421\u0432\u0435\u0436\u0438\u0439 \u0431\u0443\u043A\u0435\u0442 \u043F\u043E \u0441\u043E\u0441\u0435\u0434\u0441\u0442\u0432\u0443 \u0436\u0438\u0432\u0451\u0442 \u0441\u0447\u0438\u0442\u0430\u043D\u043D\u044B\u0435 \u0447\u0430\u0441\u044B. \u0412\u043A\u043B\u044E\u0447\u0438\u0442\u0435 push, \u0438 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435 \u0441\u043E\u043E\u0431\u0449\u0438\u0442, \u043A\u0430\u043A \u0442\u043E\u043B\u044C\u043A\u043E \u0440\u044F\u0434\u043E\u043C \u043F\u043E\u044F\u0432\u0438\u0442\u0441\u044F \u043F\u043E\u0434\u0445\u043E\u0434\u044F\u0449\u0438\u0439, \u043F\u043E\u043A\u0430 \u0435\u0433\u043E \u043D\u0435 \u0437\u0430\u0431\u0440\u0430\u043B\u0438." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "pdl-badges", children: STORES.map((s) => /* @__PURE__ */ jsxs("a", { className: "pdl-badge", href: "#", onClick: (e) => e.preventDefault(), children: [
        /* @__PURE__ */ jsx("span", { className: "glyph", children: s.glyph }),
        /* @__PURE__ */ jsxs("span", { className: "txt", children: [
          /* @__PURE__ */ jsx("small", { children: s.small }),
          /* @__PURE__ */ jsx("b", { children: s.name })
        ] })
      ] }, s.id)) })
    ] }) }) });
  }
  function Final({ desk }) {
    return /* @__PURE__ */ jsx("section", { className: "pdl-sec pdl-final", children: /* @__PURE__ */ jsx("div", { className: "pdl-in", children: /* @__PURE__ */ jsxs("div", { className: "pdl-finalgrid", children: [
      /* @__PURE__ */ jsxs("div", { className: "pdl-finalc seller", children: [
        /* @__PURE__ */ jsx("span", { className: "role", children: "\u0412\u0430\u043C \u043F\u043E\u0434\u0430\u0440\u0438\u043B\u0438 \u0431\u0443\u043A\u0435\u0442" }),
        /* @__PURE__ */ jsx("h3", { children: "\u041F\u043E\u0434\u0430\u0440\u0438\u0442\u0435 \u0435\u043C\u0443 \u0432\u0442\u043E\u0440\u0443\u044E \u0436\u0438\u0437\u043D\u044C" }),
        /* @__PURE__ */ jsx("p", { children: "\u041D\u0435 \u0432\u044B\u0431\u0440\u0430\u0441\u044B\u0432\u0430\u0439\u0442\u0435 \u043A\u0440\u0430\u0441\u0438\u0432\u043E\u0435 \u0438 \u0436\u0438\u0432\u043E\u0435. \u0412\u044B\u0441\u0442\u0430\u0432\u044C\u0442\u0435 \u0437\u0430 \u043C\u0438\u043D\u0443\u0442\u0443 \u0438 \u0432\u0435\u0440\u043D\u0438\u0442\u0435 \u0447\u0430\u0441\u0442\u044C \u0434\u0435\u043D\u0435\u0433, \u0431\u0443\u043A\u0435\u0442 \u0434\u043E\u0441\u0442\u0430\u043D\u0435\u0442\u0441\u044F \u043A\u043E\u043C\u0443-\u0442\u043E \u0440\u044F\u0434\u043E\u043C. \u041F\u0443\u0431\u043B\u0438\u043A\u0430\u0446\u0438\u044F \u0431\u0435\u0441\u043F\u043B\u0430\u0442\u043D\u0430, \u043A\u043E\u043C\u0438\u0441\u0441\u0438\u044F \u0441\u0435\u0440\u0432\u0438\u0441\u0430 \u0432\u0441\u0435\u0433\u043E 5% \u0441 \u043F\u0440\u043E\u0434\u0430\u0436\u0438." }),
        /* @__PURE__ */ jsx(Btn, { variant: "onbrand", lg: true, icon: Ic2 && Ic2.plus, children: "\u041E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u0442\u044C \u0431\u0443\u043A\u0435\u0442" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pdl-finalc buyer", children: [
        /* @__PURE__ */ jsx("span", { className: "role", children: "\u041D\u0443\u0436\u043D\u044B \u0441\u0432\u0435\u0436\u0438\u0435 \u0446\u0432\u0435\u0442\u044B" }),
        /* @__PURE__ */ jsx("h3", { children: "\u0421\u0432\u0435\u0436\u0438\u0439 \u0431\u0443\u043A\u0435\u0442 \u0437\u0430 \u043F\u043E\u043B\u0446\u0435\u043D\u044B" }),
        /* @__PURE__ */ jsx("p", { children: "\u041A \u0441\u0432\u0438\u0434\u0430\u043D\u0438\u044E, \u0432 \u043F\u043E\u0434\u0430\u0440\u043E\u043A \u0438\u043B\u0438 \u043F\u0440\u043E\u0441\u0442\u043E \u0441\u0435\u0431\u0435 \u0434\u043E\u043C\u043E\u0439: \u0442\u0435 \u0436\u0435 \u0441\u0432\u0435\u0436\u0438\u0435 \u0446\u0432\u0435\u0442\u044B \u0440\u044F\u0434\u043E\u043C \u0441 \u0432\u0430\u043C\u0438 \u0438 \u0432 2\u20133 \u0440\u0430\u0437\u0430 \u0434\u0435\u0448\u0435\u0432\u043B\u0435 \u043C\u0430\u0433\u0430\u0437\u0438\u043D\u0430." }),
        /* @__PURE__ */ jsx(Btn, { variant: "primary", lg: true, children: "\u0421\u043C\u043E\u0442\u0440\u0435\u0442\u044C \u0431\u0443\u043A\u0435\u0442\u044B \u0432 \u041C\u043E\u0441\u043A\u0432\u0435" })
      ] })
    ] }) }) });
  }
  const FOOT_COLS = [
    { h: "\u0421\u0435\u0440\u0432\u0438\u0441", links: ["\u041E \xAB\u041F\u0435\u0440\u0435\u0434\u0430\u0440\u0438\u043C\u0435\xBB", "\u041A\u0430\u043A \u044D\u0442\u043E \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442", "\u0412\u0442\u043E\u0440\u0430\u044F \u0436\u0438\u0437\u043D\u044C \u0431\u0443\u043A\u0435\u0442\u043E\u0432", "\u0411\u043B\u043E\u0433"] },
    { h: "\u041F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u044F\u043C", links: ["\u0421\u0432\u0435\u0436\u0438\u0435 \u0431\u0443\u043A\u0435\u0442\u044B \u0440\u044F\u0434\u043E\u043C", "\u0411\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u0430\u044F \u0441\u0434\u0435\u043B\u043A\u0430", "\u0414\u043E\u0441\u0442\u0430\u0432\u043A\u0430 \u0438 \u0441\u0430\u043C\u043E\u0432\u044B\u0432\u043E\u0437", "\u0412\u043E\u0437\u0432\u0440\u0430\u0442 \u0438 \u0441\u043F\u043E\u0440\u044B"] },
    { h: "\u041F\u0440\u043E\u0434\u0430\u0432\u0446\u0430\u043C", links: ["\u041E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u0442\u044C \u0431\u0443\u043A\u0435\u0442", "\u041F\u0440\u0430\u0432\u0438\u043B\u0430 \u043F\u0443\u0431\u043B\u0438\u043A\u0430\u0446\u0438\u0438", "\u0412\u044B\u043F\u043B\u0430\u0442\u044B", "\u0421\u0430\u043C\u043E\u0437\u0430\u043D\u044F\u0442\u044B\u043C"] },
    { h: "\u041F\u043E\u043C\u043E\u0449\u044C", links: ["\u041F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0430", "\u0412\u043E\u043F\u0440\u043E\u0441\u044B \u0438 \u043E\u0442\u0432\u0435\u0442\u044B", "\u0411\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u043E\u0441\u0442\u044C", "\u0421\u0432\u044F\u0437\u0430\u0442\u044C\u0441\u044F \u0441 \u043D\u0430\u043C\u0438"] }
  ];
  function Footer({ desk }) {
    return /* @__PURE__ */ jsx("footer", { className: "pdl-foot", children: /* @__PURE__ */ jsxs("div", { className: "pdl-in", children: [
      /* @__PURE__ */ jsxs("div", { className: "pdl-foot-top", children: [
        /* @__PURE__ */ jsxs("div", { className: "pdl-foot-brand", children: [
          /* @__PURE__ */ jsxs("span", { className: "pdl-foot-mark", children: [
            /* @__PURE__ */ jsx(Mark, { size: 26 }),
            /* @__PURE__ */ jsx("span", { className: "w", children: "\u041F\u0435\u0440\u0435\u0434\u0430\u0440\u0438\u043C" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "pdl-foot-tag", children: "\u0421\u0435\u0440\u0432\u0438\u0441 \u043F\u0435\u0440\u0435\u0434\u0430\u0440\u0438\u0432\u0430\u043D\u0438\u044F \u0441\u0432\u0435\u0436\u0438\u0445 \u0431\u0443\u043A\u0435\u0442\u043E\u0432. \u0414\u0430\u0440\u0438\u043C \u0446\u0432\u0435\u0442\u0430\u043C \u0432\u0442\u043E\u0440\u0443\u044E \u0436\u0438\u0437\u043D\u044C \u0438 \u043F\u0440\u043E\u0434\u0430\u0451\u043C \u0438\u0445 \u0432 2\u20133 \u0440\u0430\u0437\u0430 \u0434\u0435\u0448\u0435\u0432\u043B\u0435 \u043C\u0430\u0433\u0430\u0437\u0438\u043D\u0430." })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "pdl-foot-cols", children: FOOT_COLS.map((c) => /* @__PURE__ */ jsxs("div", { className: "pdl-foot-col", children: [
          /* @__PURE__ */ jsx("h4", { children: c.h }),
          /* @__PURE__ */ jsx("ul", { children: c.links.map((l) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#", onClick: (e) => e.preventDefault(), children: l }) }, l)) })
        ] }, c.h)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pdl-foot-legal", children: [
        /* @__PURE__ */ jsxs("div", { className: "links", children: [
          /* @__PURE__ */ jsx("a", { href: "#", onClick: (e) => e.preventDefault(), children: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u0441\u043A\u043E\u0435 \u0441\u043E\u0433\u043B\u0430\u0448\u0435\u043D\u0438\u0435" }),
          /* @__PURE__ */ jsx("a", { href: "#", onClick: (e) => e.preventDefault(), children: "\u041F\u043E\u043B\u0438\u0442\u0438\u043A\u0430 \u043A\u043E\u043D\u0444\u0438\u0434\u0435\u043D\u0446\u0438\u0430\u043B\u044C\u043D\u043E\u0441\u0442\u0438" }),
          /* @__PURE__ */ jsx("a", { href: "#", onClick: (e) => e.preventDefault(), children: "\u0421\u043E\u0433\u043B\u0430\u0441\u0438\u0435 \u043D\u0430 \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u043A\u0443 \u0434\u0430\u043D\u043D\u044B\u0445" })
        ] }),
        /* @__PURE__ */ jsx("p", { children: "\xA9 2026 \xAB\u041F\u0435\u0440\u0435\u0434\u0430\u0440\u0438\u043C\xBB. \u0421\u0435\u0440\u0432\u0438\u0441 \u043D\u0435 \u044F\u0432\u043B\u044F\u0435\u0442\u0441\u044F \u0446\u0432\u0435\u0442\u043E\u0447\u043D\u044B\u043C \u043C\u0430\u0433\u0430\u0437\u0438\u043D\u043E\u043C \u0438 \u043D\u0435 \u043F\u0440\u043E\u0434\u0430\u0451\u0442 \u043D\u043E\u0432\u044B\u0435 \u0431\u0443\u043A\u0435\u0442\u044B. \u041E\u0431\u0440\u0430\u0431\u043E\u0442\u043A\u0430 \u043F\u0435\u0440\u0441\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0445 \u0434\u0430\u043D\u043D\u044B\u0445 \u043F\u043E 152-\u0424\u0417." })
      ] })
    ] }) });
  }
  const REVIEWS = [
    { q: "\u0417\u0430\u0431\u0440\u0430\u043B\u0430 \u043F\u0438\u043E\u043D\u044B \u0437\u0430 690 \u20BD \u0432 \u0441\u043E\u0441\u0435\u0434\u043D\u0435\u043C \u0434\u0432\u043E\u0440\u0435, \u0432 \u043C\u0430\u0433\u0430\u0437\u0438\u043D\u0435 \u0442\u0430\u043A\u0438\u0435 \u0436\u0435 \u043F\u043E 2 000. \u0421\u0432\u0435\u0436\u0438\u0435, \u043F\u0440\u043E\u0441\u0442\u043E\u044F\u043B\u0438 \u0432\u043E\u0441\u0435\u043C\u044C \u0434\u043D\u0435\u0439.", n: "\u0410\u043B\u0438\u043D\u0430", city: "\u041C\u043E\u0441\u043A\u0432\u0430", role: "buyer", c: "#CF5638" },
    { q: "\u041F\u043E\u0434\u0430\u0440\u0438\u043B\u0438 \u043E\u0433\u0440\u043E\u043C\u043D\u044B\u0439 \u0431\u0443\u043A\u0435\u0442 \u043D\u0430 \u044E\u0431\u0438\u043B\u0435\u0439, \u0430 \u0434\u043E\u043C\u0430 \u0441\u0442\u0430\u0432\u0438\u0442\u044C \u043D\u0435\u043A\u0443\u0434\u0430. \u0412\u044B\u0441\u0442\u0430\u0432\u0438\u043B\u0430 \u0437\u0430 \u043F\u043E\u043B\u0446\u0435\u043D\u044B, \u0437\u0430\u0431\u0440\u0430\u043B\u0438 \u0447\u0435\u0440\u0435\u0437 \u0447\u0430\u0441. \u041F\u0440\u0438\u044F\u0442\u043D\u043E, \u0447\u0442\u043E \u043D\u0435 \u0432\u044B\u0431\u0440\u043E\u0441\u0438\u043B\u0430.", n: "\u041E\u043B\u044C\u0433\u0430", city: "\u0421\u0430\u043D\u043A\u0442-\u041F\u0435\u0442\u0435\u0440\u0431\u0443\u0440\u0433", role: "seller", c: "#5B8C68" },
    { q: "\u0411\u043E\u044F\u043B\u0441\u044F \u0440\u0430\u0437\u0432\u043E\u0434\u0430, \u043D\u043E \u0434\u0435\u043D\u044C\u0433\u0438 \u0441\u043F\u0438\u0441\u0430\u043B\u0438\u0441\u044C \u0438 \u0432\u0438\u0441\u0435\u043B\u0438, \u043F\u043E\u043A\u0430 \u044F \u043D\u0435 \u0437\u0430\u0431\u0440\u0430\u043B \u0431\u0443\u043A\u0435\u0442. \u041F\u0440\u043E\u0434\u0430\u0432\u0435\u0446 \u043E\u0442\u0434\u0430\u043B, \u0432\u0441\u0451 \u0447\u0435\u0441\u0442\u043D\u043E.", n: "\u0422\u0438\u043C\u0443\u0440", city: "\u041A\u0430\u0437\u0430\u043D\u044C", role: "buyer", c: "#C98A1E" },
    { q: "\u041E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u0442\u044C \u0432\u044B\u0448\u043B\u043E \u0440\u0435\u0430\u043B\u044C\u043D\u043E \u0437\u0430 \u043C\u0438\u043D\u0443\u0442\u0443 \u0441 \u0442\u0435\u043B\u0435\u0444\u043E\u043D\u0430. \u0412\u044B\u043F\u043B\u0430\u0442\u0430 \u043F\u0440\u0438\u0448\u043B\u0430 \u043D\u0430 \u043A\u0430\u0440\u0442\u0443 \u0432 \u0442\u043E\u0442 \u0436\u0435 \u0432\u0435\u0447\u0435\u0440.", n: "\u041C\u0430\u0440\u0438\u043D\u0430", city: "\u041C\u043E\u0441\u043A\u0432\u0430", role: "seller", c: "#23201B" },
    { q: "\u0412\u0437\u044F\u043B\u0430 \u0431\u0443\u043A\u0435\u0442 \u043A \u0441\u0432\u0438\u0434\u0430\u043D\u0438\u044E \u0437\u0430 \u0442\u0440\u0435\u0442\u044C \u0446\u0435\u043D\u044B. \u041D\u0438\u043A\u0442\u043E \u0438 \u043D\u0435 \u0434\u043E\u0433\u0430\u0434\u0430\u043B\u0441\u044F, \u0447\u0442\u043E \u043E\u043D \xAB\u043F\u0435\u0440\u0435\u0434\u0430\u0440\u0435\u043D\u043D\u044B\u0439\xBB.", n: "\u0412\u0435\u0440\u0430", city: "\u0415\u043A\u0430\u0442\u0435\u0440\u0438\u043D\u0431\u0443\u0440\u0433", role: "buyer", c: "#5B8C68" },
    { q: "\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0431\u044B\u043B\u043E \u043D\u0435\u043B\u043E\u0432\u043A\u043E \u043F\u0440\u043E\u0434\u0430\u0432\u0430\u0442\u044C \u043F\u043E\u0434\u0430\u0440\u043E\u043A. \u041D\u043E \u043A\u043E\u043C\u0443-\u0442\u043E \u043E\u043D \u043F\u043E-\u043D\u0430\u0441\u0442\u043E\u044F\u0449\u0435\u043C\u0443 \u043F\u0440\u0438\u0433\u043E\u0434\u0438\u043B\u0441\u044F, \u044D\u0442\u043E \u043A\u0443\u0434\u0430 \u043F\u0440\u0438\u044F\u0442\u043D\u0435\u0435 \u043C\u0443\u0441\u043E\u0440\u043A\u0438.", n: "\u041D\u0438\u043A\u0438\u0442\u0430", city: "\u041C\u043E\u0441\u043A\u0432\u0430", role: "seller", c: "#CF5638" }
  ];
  function Reviews({ desk }) {
    return /* @__PURE__ */ jsx("section", { className: "pdl-sec alt", id: "reviews", children: /* @__PURE__ */ jsxs("div", { className: "pdl-in", children: [
      /* @__PURE__ */ jsxs("div", { className: "pdl-sechead", children: [
        /* @__PURE__ */ jsxs("p", { className: "pdl-kicker", style: { justifyContent: "center" }, children: [
          /* @__PURE__ */ jsx(Leaf, { className: "lf" }),
          "\u041E\u0442\u0437\u044B\u0432\u044B"
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "pdl-h2", children: "\u0411\u0443\u043A\u0435\u0442\u044B \u043D\u0430\u0445\u043E\u0434\u044F\u0442 \u043D\u043E\u0432\u044B\u0439 \u0434\u043E\u043C \u043A\u0430\u0436\u0434\u044B\u0439 \u0434\u0435\u043D\u044C" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "pdl-revs", children: REVIEWS.map((r, i) => /* @__PURE__ */ jsxs("div", { className: "pdl-rev", children: [
        /* @__PURE__ */ jsx("span", { className: "pdl-rev-stars", children: [0, 1, 2, 3, 4].map((s) => /* @__PURE__ */ jsx(Star, {}, s)) }),
        /* @__PURE__ */ jsxs("p", { className: "pdl-rev-q", children: [
          "\xAB",
          r.q,
          "\xBB"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pdl-rev-who", children: [
          /* @__PURE__ */ jsx("span", { className: "pdl-rev-ava", style: { background: r.c }, children: r.n[0] }),
          /* @__PURE__ */ jsxs("div", { className: "pdl-rev-meta", children: [
            /* @__PURE__ */ jsx("b", { children: r.n }),
            /* @__PURE__ */ jsx("span", { children: r.city })
          ] }),
          /* @__PURE__ */ jsx("span", { className: "pdl-rev-role " + r.role, children: r.role === "seller" ? "\u043F\u0440\u043E\u0434\u0430\u0432\u0435\u0446" : "\u043F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u044C" })
        ] })
      ] }, i)) })
    ] }) });
  }
  function Nav({ desk, auth }) {
    if (auth) {
      return /* @__PURE__ */ jsx("header", { className: "pdl-nav", children: /* @__PURE__ */ jsxs("div", { className: "pdl-nav-in", children: [
        /* @__PURE__ */ jsxs("span", { className: "pdl-brand", children: [
          /* @__PURE__ */ jsx(Mark, { size: 24 }),
          "\u041F\u0435\u0440\u0435\u0434\u0430\u0440\u0438\u043C"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pdl-nav-mid", children: [
          /* @__PURE__ */ jsxs("button", { className: "pdl-nav-city", children: [
            /* @__PURE__ */ jsx(Pin, { className: "pin" }),
            "\u041C\u043E\u0441\u043A\u0432\u0430",
            /* @__PURE__ */ jsx(Chev, {})
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "pdl-nav-search", children: [
            /* @__PURE__ */ jsx(Search, {}),
            /* @__PURE__ */ jsx("span", { children: "\u041F\u043E\u0438\u0441\u043A \u0441\u0432\u0435\u0436\u0438\u0445 \u0431\u0443\u043A\u0435\u0442\u043E\u0432 \u0432 \u041C\u043E\u0441\u043A\u0432\u0435" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pdl-navright", children: [
          /* @__PURE__ */ jsx("button", { className: "pdl-nav-icon", "aria-label": "\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F", children: /* @__PURE__ */ jsx(Bell, {}) }),
          /* @__PURE__ */ jsx("button", { className: "pdl-nav-icon pdl-nav-fav", "aria-label": "\u0418\u0437\u0431\u0440\u0430\u043D\u043D\u043E\u0435", children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx("path", { d: "M12 20.3C12 20.3 3.4 14.9 3.4 8.7 3.4 6 5.5 4 8 4 9.8 4 11.3 5 12 6.3 12.7 5 14.2 4 16 4 18.5 4 20.6 6 20.6 8.7 20.6 14.9 12 20.3 12 20.3Z" }) }) }),
          /* @__PURE__ */ jsx("button", { className: "pdl-nav-ava", "aria-label": "\u041F\u0440\u043E\u0444\u0438\u043B\u044C", children: "\u041C" }),
          /* @__PURE__ */ jsx("span", { className: "pdl-nav-cta", children: /* @__PURE__ */ jsx(Btn, { variant: "primary", icon: Ic2 && Ic2.plus, children: "\u041F\u0440\u043E\u0434\u0430\u0442\u044C \u0431\u0443\u043A\u0435\u0442" }) }),
          /* @__PURE__ */ jsx("button", { className: "pdl-nav-burger", "aria-label": "\u041C\u0435\u043D\u044E", children: /* @__PURE__ */ jsx(Menu, {}) })
        ] })
      ] }) });
    }
    return /* @__PURE__ */ jsx("header", { className: "pdl-nav", children: /* @__PURE__ */ jsxs("div", { className: "pdl-nav-in", children: [
      /* @__PURE__ */ jsxs("span", { className: "pdl-brand", children: [
        /* @__PURE__ */ jsx(Mark, { size: 24 }),
        "\u041F\u0435\u0440\u0435\u0434\u0430\u0440\u0438\u043C"
      ] }),
      /* @__PURE__ */ jsxs("nav", { className: "pdl-navlinks", children: [
        /* @__PURE__ */ jsx("a", { href: "\u041F\u0435\u0440\u0435\u0434\u0430\u0440\u0438\u043C \xB7 \u041A\u0430\u0442\u0430\u043B\u043E\u0433 \u0431\u0443\u043A\u0435\u0442\u043E\u0432.html", children: "\u041A\u0430\u0442\u0430\u043B\u043E\u0433" }),
        /* @__PURE__ */ jsx("a", { href: "#how", children: "\u041A\u0430\u043A \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442" }),
        /* @__PURE__ */ jsx("a", { href: "#safety", children: "\u0411\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u043E\u0441\u0442\u044C" }),
        /* @__PURE__ */ jsx("a", { href: "#app", children: "\u041F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pdl-navright", children: [
        /* @__PURE__ */ jsx("button", { className: "pdl-nav-login", children: "\u0412\u043E\u0439\u0442\u0438" }),
        /* @__PURE__ */ jsx("span", { className: "pdl-nav-cta", children: /* @__PURE__ */ jsx(Btn, { variant: "primary", icon: Ic2 && Ic2.plus, children: "\u041E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u0442\u044C \u0431\u0443\u043A\u0435\u0442" }) }),
        /* @__PURE__ */ jsx("button", { className: "pdl-nav-burger", "aria-label": "\u041C\u0435\u043D\u044E", children: /* @__PURE__ */ jsx(Menu, {}) })
      ] })
    ] }) });
  }
  function LandingNav({ auth = false, desk = true }) {
    return /* @__PURE__ */ jsx("div", { className: "pd-root pd-web pdl" + (desk ? " pdl--desk" : ""), "data-pd-theme": "a", style: { minHeight: 0 }, children: /* @__PURE__ */ jsx(Nav, { desk, auth }) });
  }
  var PdLandingComp = function PdLanding2({ platform = "desktop", auth = false }) {
    const desk = platform === "desktop";
    return /* @__PURE__ */ jsxs("div", { className: "pd-root pd-web pdl" + (desk ? " pdl--desk" : ""), "data-pd-theme": "a", children: [
      /* @__PURE__ */ jsx(Nav, { desk, auth }),
      /* @__PURE__ */ jsxs("main", { className: "pd-scroll pdw-scroll", children: [
        /* @__PURE__ */ jsx(Hero, { desk }),
        /* @__PURE__ */ jsx(Catalog, { desk }),
        /* @__PURE__ */ jsx(How, { desk }),
        /* @__PURE__ */ jsx(Reviews, { desk }),
        /* @__PURE__ */ jsx(Escrow, { desk }),
        /* @__PURE__ */ jsx(Objections, { desk }),
        /* @__PURE__ */ jsx(App, { desk }),
        /* @__PURE__ */ jsx(Final, { desk }),
        /* @__PURE__ */ jsx(Footer, { desk })
      ] })
    ] });
  };
  PdLandingComp._navComp = LandingNav;
  return PdLandingComp;
})();
var PdLandingNav = PdLanding._navComp;

export { PdLanding, PdLandingNav };
