import { TopBar, SectionHead, PdSkelCard, BottomNav, PdEmpty, I, PdBtn, Ic, pdMoney, PdScreen, PdChip, PD_LIKED, Card, PdStars, PdNotice, PD_FRESH, Avatar, PdGallery, LikeBtn, Freshness, PdSeg } from './chunk-OS4LB2PH.mjs';
import 'react';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';

function VitrinaLoading() {
  return /* @__PURE__ */ jsxs("div", { className: "pd-root", "data-pd-theme": "a", children: [
    /* @__PURE__ */ jsx(TopBar, { safeTop: 56 }),
    /* @__PURE__ */ jsxs("main", { className: "pd-scroll", children: [
      /* @__PURE__ */ jsx(SectionHead, { title: "\u0421\u0430\u043C\u044B\u0435 \u0441\u0432\u0435\u0436\u0438\u0435", sub: "\u041A\u0443\u043F\u043B\u0435\u043D\u044B \u0441\u0435\u0433\u043E\u0434\u043D\u044F, \u0440\u044F\u0434\u043E\u043C \u0441 \u0432\u0430\u043C\u0438" }),
      /* @__PURE__ */ jsx("div", { className: "pd-rail", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsx("div", { style: { width: 202 }, children: /* @__PURE__ */ jsx(PdSkelCard, {}) }, i)) }),
      /* @__PURE__ */ jsx(SectionHead, { title: "\u0421\u0430\u043C\u044B\u0435 \u0437\u0430\u043B\u0430\u0439\u043A\u0430\u043D\u043D\u044B\u0435", sub: "\u041B\u044E\u0431\u0438\u043C\u0446\u044B \u043D\u0435\u0434\u0435\u043B\u0438 \u0432 \u041C\u043E\u0441\u043A\u0432\u0435" }),
      /* @__PURE__ */ jsx("div", { className: "pd-grid", children: [0, 1, 2, 3].map((i) => /* @__PURE__ */ jsx(PdSkelCard, {}, i)) })
    ] }),
    /* @__PURE__ */ jsx(BottomNav, { safeBottom: 22 })
  ] });
}
function VitrinaEmpty() {
  return /* @__PURE__ */ jsxs("div", { className: "pd-root", "data-pd-theme": "a", children: [
    /* @__PURE__ */ jsx(TopBar, { safeTop: 56 }),
    /* @__PURE__ */ jsx("main", { className: "pd-scroll", children: /* @__PURE__ */ jsxs(
      PdEmpty,
      {
        glyph: I.heartline,
        title: "\u0412 \u041C\u043E\u0441\u043A\u0432\u0435 \u043F\u043E\u043A\u0430 \u043D\u0435\u0442 \u0431\u0443\u043A\u0435\u0442\u043E\u0432",
        text: "\u0411\u0443\u0434\u044C\u0442\u0435 \u043F\u0435\u0440\u0432\u044B\u043C. \u0412\u044B\u0441\u0442\u0430\u0432\u0438\u0442\u0435 \u0431\u0443\u043A\u0435\u0442, \u043A\u043E\u0442\u043E\u0440\u044B\u0439 \u0432\u0430\u043C \u043F\u043E\u0434\u0430\u0440\u0438\u043B\u0438, \u0438 \u0434\u0430\u0439\u0442\u0435 \u0435\u043C\u0443 \u0432\u0442\u043E\u0440\u0443\u044E \u0436\u0438\u0437\u043D\u044C.",
        children: [
          /* @__PURE__ */ jsx(PdBtn, { variant: "primary", block: true, icon: Ic.plus, children: "\u041E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u0442\u044C \u0431\u0443\u043A\u0435\u0442" }),
          /* @__PURE__ */ jsx(PdBtn, { variant: "secondary", block: true, children: "\u0421\u043C\u0435\u043D\u0438\u0442\u044C \u0433\u043E\u0440\u043E\u0434" })
        ]
      }
    ) }),
    /* @__PURE__ */ jsx(BottomNav, { safeBottom: 22 })
  ] });
}
var LISTING = {
  photos: ["1561181286-d3fee7d55364", "1567418938902-aa650a3eb346", "1581938165093-050aeb5ef218"],
  price: 990,
  size: "M",
  district: "\u041C\u043E\u0441\u043A\u0432\u0430 \xB7 \u041F\u0430\u0442\u0440\u0438\u043A\u0438",
  likes: 47,
  liked: true,
  seller: { n: "\u0410\u043D\u044F", r: 4.9, av: "w1", deals: 23 }
};
function ListingActions() {
  return /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 4 }, children: [
    /* @__PURE__ */ jsx("button", { className: "pd-iconbtn", "aria-label": "\u041F\u043E\u0434\u0435\u043B\u0438\u0442\u044C\u0441\u044F", children: I.send({ className: "pd-i20", fill: "none", stroke: "currentColor" }) }),
    /* @__PURE__ */ jsx("button", { className: "pd-iconbtn", "aria-label": "\u041F\u043E\u0436\u0430\u043B\u043E\u0432\u0430\u0442\u044C\u0441\u044F", children: I.flag({ className: "pd-i20", fill: "none", stroke: "currentColor" }) })
  ] });
}
function ListingBody({ sold }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { style: { position: "relative" }, children: [
      /* @__PURE__ */ jsx(PdGallery, { photos: LISTING.photos, count: 3, idx: 0 }),
      sold && /* @__PURE__ */ jsx("div", { style: { position: "absolute", inset: 0, background: "rgba(35,32,27,.45)", display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsx("span", { style: { background: "#fff", color: "var(--pd-text)", fontWeight: 700, fontSize: 15, padding: "10px 18px", borderRadius: 999 }, children: "\u0423\u0436\u0435 \u043F\u0440\u043E\u0434\u0430\u043D\u043E" }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: { padding: "16px" }, children: [
      /* @__PURE__ */ jsxs("div", { className: "pd-price-row", style: { marginBottom: 10 }, children: [
        /* @__PURE__ */ jsx("span", { className: "pd-price", style: { fontSize: 26 }, children: pdMoney(LISTING.price) }),
        /* @__PURE__ */ jsx(LikeBtn, { liked: LISTING.liked, count: LISTING.likes })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pd-chiprow", style: { marginBottom: 14 }, children: [
        /* @__PURE__ */ jsx(Freshness, { kind: "today" }),
        /* @__PURE__ */ jsxs("span", { className: "pd-chip", style: { pointerEvents: "none" }, children: [
          "\u0420\u0430\u0437\u043C\u0435\u0440 ",
          LISTING.size,
          " \xB7 7\u201315 \u0448\u0442."
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 5, color: "var(--pd-muted)", fontSize: 13.5, marginBottom: 16 }, children: [
        Ic.pin({ className: "pd-i16", fill: "none", stroke: "currentColor" }),
        LISTING.district
      ] }),
      sold ? /* @__PURE__ */ jsx(PdNotice, { kind: "info", icon: I.info, children: "\u042D\u0442\u043E\u0442 \u0431\u0443\u043A\u0435\u0442 \u0443\u0436\u0435 \u043A\u0443\u043F\u0438\u043B\u0438. \u041F\u043E\u0441\u043C\u043E\u0442\u0440\u0438\u0442\u0435 \u0434\u0440\u0443\u0433\u0438\u0435 \u0441\u0432\u0435\u0436\u0438\u0435 \u0431\u0443\u043A\u0435\u0442\u044B \u0440\u044F\u0434\u043E\u043C, \u0438\u0445 \u0434\u043E\u0431\u0430\u0432\u043B\u044F\u044E\u0442 \u043A\u0430\u0436\u0434\u044B\u0439 \u0434\u0435\u043D\u044C." }) : /* @__PURE__ */ jsxs(PdNotice, { kind: "ok", icon: I.shield, children: [
        /* @__PURE__ */ jsx("b", { children: "\u0411\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u0430\u044F \u0441\u0434\u0435\u043B\u043A\u0430." }),
        " \u0414\u0435\u043D\u044C\u0433\u0438 \u0432 \u044D\u0441\u043A\u0440\u043E\u0443 \u042EKassa. \u041F\u0440\u043E\u0434\u0430\u0432\u0435\u0446 \u043F\u043E\u043B\u0443\u0447\u0438\u0442 \u0438\u0445 \u0442\u043E\u043B\u044C\u043A\u043E \u043F\u043E\u0441\u043B\u0435 \u0442\u043E\u0433\u043E, \u043A\u0430\u043A \u0432\u044B \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u0435 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0435."
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 11, padding: "14px 0", marginTop: 6, borderTop: "1px solid var(--pd-border)", borderBottom: "1px solid var(--pd-border)" }, children: [
        /* @__PURE__ */ jsx(Avatar, { seller: LISTING.seller, size: 44 }),
        /* @__PURE__ */ jsxs("div", { style: { flex: 1 }, children: [
          /* @__PURE__ */ jsx("div", { style: { fontWeight: 700, fontSize: 15 }, children: LISTING.seller.n }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 5, color: "var(--pd-muted)", fontSize: 12.5, marginTop: 2 }, children: [
            /* @__PURE__ */ jsx(PdStars, { value: 5 }),
            " ",
            LISTING.seller.r,
            " \xB7 ",
            LISTING.seller.deals,
            " \u0441\u0434\u0435\u043B\u043A\u0438"
          ] })
        ] }),
        I.fwd({ className: "pd-i18", fill: "none", stroke: "var(--pd-faint)" })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { marginTop: 16 }, children: [
        /* @__PURE__ */ jsx("div", { className: "pd-label", style: { marginBottom: 8 }, children: "\u041A\u0430\u043A \u0437\u0430\u0431\u0440\u0430\u0442\u044C" }),
        /* @__PURE__ */ jsx(PdSeg, { value: "pickup", options: [{ k: "pickup", label: "\u0421\u0430\u043C\u043E\u0432\u044B\u0432\u043E\u0437", icon: I.walk }, { k: "courier", label: "\u041A\u0443\u0440\u044C\u0435\u0440", icon: I.truck }] }),
        /* @__PURE__ */ jsx("p", { style: { fontSize: 12.5, color: "var(--pd-muted)", marginTop: 8 }, children: "\u0422\u043E\u0447\u043D\u044B\u0439 \u0430\u0434\u0440\u0435\u0441 \u043F\u043E\u044F\u0432\u0438\u0442\u0441\u044F \u0432 \u0447\u0430\u0442\u0435 \u043F\u043E\u0441\u043B\u0435 \u043E\u043F\u043B\u0430\u0442\u044B. \u0414\u0432\u043E\u0440 \u0438\u043B\u0438 \u0441\u0442\u0430\u043D\u0446\u0438\u044E \u0432\u044B\u0431\u0438\u0440\u0430\u0435\u0442 \u043F\u0440\u043E\u0434\u0430\u0432\u0435\u0446." })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { marginTop: 18 }, children: [
        /* @__PURE__ */ jsx("div", { className: "pd-label", style: { marginBottom: 6 }, children: "\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435" }),
        /* @__PURE__ */ jsx("p", { style: { fontSize: 14, lineHeight: 1.55, color: "var(--pd-text)" }, children: "\u041F\u043E\u0434\u0430\u0440\u0438\u043B\u0438 \u0443\u0442\u0440\u043E\u043C \u043D\u0430 \u0434\u0435\u043D\u044C \u0440\u043E\u0436\u0434\u0435\u043D\u0438\u044F: \u043F\u0438\u043E\u043D\u043E\u0432\u0438\u0434\u043D\u044B\u0435 \u0440\u043E\u0437\u044B \u0438 \u044D\u0432\u043A\u0430\u043B\u0438\u043F\u0442, \u043E\u0447\u0435\u043D\u044C \u0441\u0432\u0435\u0436\u0438\u0435, \u0441\u0442\u043E\u044F\u0442 \u0432 \u0432\u043E\u0434\u0435. \u041E\u0442\u0434\u0430\u044E \u043D\u0435\u0434\u043E\u0440\u043E\u0433\u043E, \u0436\u0430\u043B\u043A\u043E \u0432\u044B\u0431\u0440\u0430\u0441\u044B\u0432\u0430\u0442\u044C. \u0417\u0430\u0431\u0435\u0440\u0438\u0442\u0435 \u0441\u0435\u0433\u043E\u0434\u043D\u044F \u{1F33F}" })
      ] })
    ] })
  ] });
}
function Listing() {
  const footer = /* @__PURE__ */ jsx("div", { className: "pd-footerbar", children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 10 }, children: [
    /* @__PURE__ */ jsx(PdBtn, { variant: "secondary", style: { flex: 1 }, children: "\u041F\u0440\u0435\u0434\u043B\u043E\u0436\u0438\u0442\u044C \u0446\u0435\u043D\u0443" }),
    /* @__PURE__ */ jsxs(PdBtn, { variant: "primary", icon: I.cart, style: { flex: 1.4 }, children: [
      "\u041A\u0443\u043F\u0438\u0442\u044C \xB7 ",
      pdMoney(LISTING.price)
    ] })
  ] }) });
  return /* @__PURE__ */ jsx(PdScreen, { title: "\u0411\u0443\u043A\u0435\u0442", center: true, action: /* @__PURE__ */ jsx(ListingActions, {}), footer, children: /* @__PURE__ */ jsx(ListingBody, {}) });
}
function ListingSold() {
  const footer = /* @__PURE__ */ jsx("div", { className: "pd-footerbar", children: /* @__PURE__ */ jsx(PdBtn, { variant: "secondary", block: true, icon: I.back, children: "\u0421\u043C\u043E\u0442\u0440\u0435\u0442\u044C \u0441\u0432\u0435\u0436\u0438\u0435 \u0431\u0443\u043A\u0435\u0442\u044B" }) });
  return /* @__PURE__ */ jsx(PdScreen, { title: "\u0411\u0443\u043A\u0435\u0442", center: true, action: /* @__PURE__ */ jsx(ListingActions, {}), footer, children: /* @__PURE__ */ jsx(ListingBody, { sold: true }) });
}
function SearchNoResults() {
  const search = /* @__PURE__ */ jsxs("div", { className: "pd-appbar", style: { paddingTop: 56 }, children: [
    /* @__PURE__ */ jsx("button", { className: "pd-iconbtn", children: I.back({ className: "pd-i22", fill: "none", stroke: "currentColor" }) }),
    /* @__PURE__ */ jsxs("div", { className: "pd-search", style: { flex: 1 }, children: [
      Ic.search({ className: "pd-i18", fill: "none", stroke: "currentColor" }),
      /* @__PURE__ */ jsx("span", { style: { color: "var(--pd-text)", fontSize: 14 }, children: "\u043F\u0438\u043E\u043D\u044B \u043F\u0438\u043E\u043D\u043E\u0432\u0438\u0434\u043D\u044B\u0435" }),
      /* @__PURE__ */ jsx("span", { style: { marginLeft: "auto" }, children: I.x({ className: "pd-i18", fill: "none", stroke: "var(--pd-muted)" }) })
    ] })
  ] });
  return /* @__PURE__ */ jsxs("div", { className: "pd-root", "data-pd-theme": "a", children: [
    search,
    /* @__PURE__ */ jsxs("div", { className: "pd-chiprow", style: { padding: "12px 16px", borderBottom: "1px solid var(--pd-border)" }, children: [
      /* @__PURE__ */ jsx(PdChip, { on: true, icon: Ic.sliders, children: "\u0424\u0438\u043B\u044C\u0442\u0440\u044B \xB7 2" }),
      /* @__PURE__ */ jsx(PdChip, { children: "\u0434\u043E 1 000 \u20BD" }),
      /* @__PURE__ */ jsx(PdChip, { children: "\u0420\u0430\u0437\u043C\u0435\u0440 M" })
    ] }),
    /* @__PURE__ */ jsxs("main", { className: "pd-scroll", children: [
      /* @__PURE__ */ jsxs(
        PdEmpty,
        {
          glyph: Ic.search,
          title: "\u041D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043D\u0430\u0448\u043B\u043E\u0441\u044C",
          text: "\u041F\u043E \u0437\u0430\u043F\u0440\u043E\u0441\u0443 \xAB\u043F\u0438\u043E\u043D\u044B \u043F\u0438\u043E\u043D\u043E\u0432\u0438\u0434\u043D\u044B\u0435\xBB \u0432 \u041C\u043E\u0441\u043A\u0432\u0435 \u0441 \u044D\u0442\u0438\u043C\u0438 \u0444\u0438\u043B\u044C\u0442\u0440\u0430\u043C\u0438 \u043F\u043E\u043A\u0430 \u043D\u0435\u0442 \u0431\u0443\u043A\u0435\u0442\u043E\u0432.",
          children: [
            /* @__PURE__ */ jsx(PdBtn, { variant: "primary", block: true, children: "\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u0444\u0438\u043B\u044C\u0442\u0440\u044B" }),
            /* @__PURE__ */ jsx(PdBtn, { variant: "secondary", block: true, children: "\u0418\u0441\u043A\u0430\u0442\u044C \u0432\u043E \u0432\u0441\u0435\u0445 \u0433\u043E\u0440\u043E\u0434\u0430\u0445" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs("div", { style: { padding: "4px 16px 20px" }, children: [
        /* @__PURE__ */ jsx("div", { className: "pd-label", style: { marginBottom: 10 }, children: "\u041F\u043E\u0445\u043E\u0436\u0438\u0435 \u0441\u0432\u0435\u0436\u0438\u0435 \u0431\u0443\u043A\u0435\u0442\u044B" }),
        /* @__PURE__ */ jsx("div", { className: "pd-grid", style: { padding: 0 }, children: PD_LIKED.slice(0, 2).map((d) => /* @__PURE__ */ jsx("div", { className: "pd-rise", children: /* @__PURE__ */ jsx(Card, { d, variant: "grid" }) }, d.id)) })
      ] })
    ] })
  ] });
}
function Profile() {
  const s = { n: "\u0410\u043D\u044F", r: 4.9, av: "w1" };
  const reviews = [
    { n: "\u041C\u0430\u0440\u0438\u043D\u0430", av: "w2", r: 5, tm: "2 \u0434\u043D\u044F \u043D\u0430\u0437\u0430\u0434", t: "\u0411\u0443\u043A\u0435\u0442 \u0431\u044B\u043B \u0441\u0432\u0435\u0436\u0438\u0439, \u043A\u0430\u043A \u043D\u0430 \u0444\u043E\u0442\u043E. \u0410\u043D\u044F \u0432\u0441\u0451 \u0440\u0430\u0441\u0441\u043A\u0430\u0437\u0430\u043B\u0430, \u0432\u0441\u0442\u0440\u0435\u0442\u0438\u043B\u0438\u0441\u044C \u0443 \u043C\u0435\u0442\u0440\u043E, \u043E\u0447\u0435\u043D\u044C \u0443\u0434\u043E\u0431\u043D\u043E. \u0421\u043F\u0430\u0441\u0438\u0431\u043E!" },
    { n: "\u041A\u0430\u0442\u044F", av: "w4", r: 5, tm: "\u043D\u0435\u0434\u0435\u043B\u044E \u043D\u0430\u0437\u0430\u0434", t: "\u041F\u0440\u0435\u043A\u0440\u0430\u0441\u043D\u044B\u0435 \u0440\u043E\u0437\u044B, \u043F\u0440\u043E\u0441\u0442\u043E\u044F\u043B\u0438 \u0435\u0449\u0451 5 \u0434\u043D\u0435\u0439. \u0420\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0443\u044E!" }
  ];
  return /* @__PURE__ */ jsxs(PdScreen, { title: "\u041F\u0440\u043E\u0444\u0438\u043B\u044C", center: true, action: /* @__PURE__ */ jsx("button", { className: "pd-iconbtn", children: I.flag({ className: "pd-i20", fill: "none", stroke: "currentColor" }) }), children: [
    /* @__PURE__ */ jsxs("div", { className: "pd-prof", children: [
      /* @__PURE__ */ jsx("span", { className: "big", children: /* @__PURE__ */ jsx("img", { src: "img/av/" + s.av + ".jpg", alt: "" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { children: s.n }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 6, marginTop: 4 }, children: [
          /* @__PURE__ */ jsx(PdStars, { value: 5 }),
          /* @__PURE__ */ jsx("b", { style: { fontSize: 14 }, children: s.r }),
          /* @__PURE__ */ jsx("span", { style: { color: "var(--pd-muted)", fontSize: 13 }, children: "\xB7 23 \u0441\u0434\u0435\u043B\u043A\u0438" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "stat", children: [
          /* @__PURE__ */ jsxs("span", { children: [
            /* @__PURE__ */ jsx("b", { children: "12" }),
            " \u043E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u0439"
          ] }),
          /* @__PURE__ */ jsxs("span", { children: [
            /* @__PURE__ */ jsx("b", { children: "\u0441 2025" }),
            " \u043D\u0430 \u043F\u043B\u043E\u0449\u0430\u0434\u043A\u0435"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { style: { padding: "0 16px" }, children: /* @__PURE__ */ jsx(PdNotice, { kind: "ok", icon: I.shield, children: "\u041F\u0440\u043E\u0432\u0435\u0440\u0435\u043D\u043D\u044B\u0439 \u043F\u0440\u043E\u0434\u0430\u0432\u0435\u0446 \xB7 97% \u0441\u0434\u0435\u043B\u043E\u043A \u0431\u0435\u0437 \u0441\u043F\u043E\u0440\u0430. \u0414\u0435\u043D\u044C\u0433\u0438 \u0432 \u0437\u0430\u0449\u0438\u0449\u0451\u043D\u043D\u043E\u0439 \u0441\u0434\u0435\u043B\u043A\u0435." }) }),
    /* @__PURE__ */ jsx(SectionHead, { title: "\u0410\u043A\u0442\u0438\u0432\u043D\u044B\u0435 \u043E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u044F", sub: "3 \u0441\u0432\u0435\u0436\u0438\u0445 \u0431\u0443\u043A\u0435\u0442\u0430" }),
    /* @__PURE__ */ jsx("div", { className: "pd-grid", children: PD_FRESH.slice(0, 2).map((d) => /* @__PURE__ */ jsx("div", { className: "pd-rise", children: /* @__PURE__ */ jsx(Card, { d, variant: "grid" }) }, d.id)) }),
    /* @__PURE__ */ jsx(SectionHead, { title: "\u041E\u0442\u0437\u044B\u0432\u044B", sub: "23 \u043E\u0442\u0437\u044B\u0432\u0430 \xB7 4,9 \u2605" }),
    /* @__PURE__ */ jsx("div", { children: reviews.map((rv, i) => /* @__PURE__ */ jsxs("div", { className: "pd-review", children: [
      /* @__PURE__ */ jsxs("div", { className: "hd", children: [
        /* @__PURE__ */ jsx(Avatar, { seller: rv, size: 28 }),
        /* @__PURE__ */ jsx("span", { className: "nm", children: rv.n }),
        /* @__PURE__ */ jsx(PdStars, { value: rv.r }),
        /* @__PURE__ */ jsx("span", { className: "tm", children: rv.tm })
      ] }),
      /* @__PURE__ */ jsx("p", { children: rv.t })
    ] }, i)) }),
    /* @__PURE__ */ jsx("div", { style: { height: 20 } })
  ] });
}

export { Listing, ListingSold, Profile, SearchNoResults, VitrinaEmpty, VitrinaLoading };
