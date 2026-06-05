import { Ic, SectionHead, PD_FRESH, Card, PD_LIKED } from './chunk-OS4LB2PH.mjs';
import 'react';
import { jsxs, jsx } from 'react/jsx-runtime';

function PdFeedDesktop({ theme = "a" }) {
  const Card2 = Card, SectionHead2 = SectionHead, Ic2 = Ic;
  const FRESH = PD_FRESH, LIKED = PD_LIKED;
  const Bell = (p) => /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", ...p, children: [
    /* @__PURE__ */ jsx("path", { d: "M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" }),
    /* @__PURE__ */ jsx("path", { d: "M10 19a2 2 0 0 0 4 0" })
  ] });
  return /* @__PURE__ */ jsxs("div", { className: "pd-root pd-web", "data-pd-theme": theme, children: [
    /* @__PURE__ */ jsx("header", { className: "pdw-nav", children: /* @__PURE__ */ jsxs("div", { className: "pdw-nav-in", children: [
      /* @__PURE__ */ jsx("span", { className: "pd-brand pdw-brand", children: "\u041F\u0435\u0440\u0435\u0434\u0430\u0440\u0438\u043C" }),
      /* @__PURE__ */ jsxs("div", { className: "pdw-navmid", children: [
        /* @__PURE__ */ jsxs("button", { className: "pd-city pdw-city", children: [
          /* @__PURE__ */ jsx(Ic2.pin, { className: "pd-i16", fill: "none", stroke: "currentColor" }),
          "\u041C\u043E\u0441\u043A\u0432\u0430",
          /* @__PURE__ */ jsx(Ic2.chev, { className: "pd-i14", fill: "none", stroke: "currentColor" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pd-search pdw-search", children: [
          /* @__PURE__ */ jsx(Ic2.search, { className: "pd-i18", fill: "none", stroke: "currentColor" }),
          /* @__PURE__ */ jsx("span", { className: "pd-search-ph", children: "\u041F\u043E\u0438\u0441\u043A \u0441\u0432\u0435\u0436\u0438\u0445 \u0431\u0443\u043A\u0435\u0442\u043E\u0432 \u0432 \u041C\u043E\u0441\u043A\u0432\u0435" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("nav", { className: "pdw-navright", children: [
        /* @__PURE__ */ jsx("button", { className: "pdw-iconbtn", "aria-label": "\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F", children: /* @__PURE__ */ jsx(Bell, { className: "pd-i20", fill: "none", stroke: "currentColor" }) }),
        /* @__PURE__ */ jsx("button", { className: "pdw-iconbtn", "aria-label": "\u0421\u0434\u0435\u043B\u043A\u0438", children: /* @__PURE__ */ jsx(Ic2.deals, { className: "pd-i20", fill: "none", stroke: "currentColor" }) }),
        /* @__PURE__ */ jsx("span", { className: "pdw-avatar", "aria-hidden": "true", children: "\u041C" }),
        /* @__PURE__ */ jsxs("button", { className: "pdw-cta", children: [
          /* @__PURE__ */ jsx(Ic2.plus, { className: "pd-i18", fill: "none", stroke: "currentColor" }),
          "\u041F\u0440\u043E\u0434\u0430\u0442\u044C \u0431\u0443\u043A\u0435\u0442"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("main", { className: "pd-scroll pdw-scroll", children: /* @__PURE__ */ jsxs("div", { className: "pdw-wrap", children: [
      /* @__PURE__ */ jsxs("section", { className: "pdw-section", children: [
        /* @__PURE__ */ jsx(SectionHead2, { title: "\u0421\u0430\u043C\u044B\u0435 \u0441\u0432\u0435\u0436\u0438\u0435", sub: "\u041A\u0443\u043F\u043B\u0435\u043D\u044B \u0441\u0435\u0433\u043E\u0434\u043D\u044F, \u0440\u044F\u0434\u043E\u043C \u0441 \u0432\u0430\u043C\u0438 \u0432 \u041C\u043E\u0441\u043A\u0432\u0435", action: "\u0421\u043C\u043E\u0442\u0440\u0435\u0442\u044C \u0432\u0441\u0435" }),
        /* @__PURE__ */ jsx("div", { className: "pdw-grid", children: FRESH.map((d) => /* @__PURE__ */ jsx("div", { className: "pd-rise", children: /* @__PURE__ */ jsx(Card2, { d, variant: "grid" }) }, d.id)) })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "pdw-section", children: [
        /* @__PURE__ */ jsx(SectionHead2, { title: "\u0421\u0430\u043C\u044B\u0435 \u0437\u0430\u043B\u0430\u0439\u043A\u0430\u043D\u043D\u044B\u0435", sub: "\u041B\u044E\u0431\u0438\u043C\u0446\u044B \u043D\u0435\u0434\u0435\u043B\u0438, \u0431\u043E\u043B\u044C\u0448\u0435 \u0432\u0441\u0435\u0433\u043E \u2665 \u0437\u0430 7 \u0434\u043D\u0435\u0439", action: "\u0421\u043C\u043E\u0442\u0440\u0435\u0442\u044C \u0432\u0441\u0435" }),
        /* @__PURE__ */ jsx("div", { className: "pdw-grid", children: LIKED.map((d) => /* @__PURE__ */ jsx("div", { className: "pd-rise", children: /* @__PURE__ */ jsx(Card2, { d, variant: "grid" }) }, d.id)) }),
        /* @__PURE__ */ jsx("div", { className: "pd-feed-end", children: "\u0412\u044B \u043F\u043E\u0441\u043C\u043E\u0442\u0440\u0435\u043B\u0438 \u0441\u0432\u0435\u0436\u0438\u0435 \u0431\u0443\u043A\u0435\u0442\u044B \u041C\u043E\u0441\u043A\u0432\u044B. \u0421\u043C\u0435\u043D\u0438\u0442\u0435 \u0433\u043E\u0440\u043E\u0434, \u0447\u0442\u043E\u0431\u044B \u0443\u0432\u0438\u0434\u0435\u0442\u044C \u0431\u043E\u043B\u044C\u0448\u0435" })
      ] })
    ] }) })
  ] });
}

export { PdFeedDesktop };
