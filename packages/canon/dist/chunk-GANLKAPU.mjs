import React2 from 'react';
import { jsxs, jsx } from 'react/jsx-runtime';

// src/primitives/kit.jsx
var I = {
  back: (p) => /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", ...p, children: /* @__PURE__ */ jsx("path", { d: "m15 5-7 7 7 7" }) }),
  fwd: (p) => /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", ...p, children: /* @__PURE__ */ jsx("path", { d: "m9 5 7 7-7 7" }) }),
  x: (p) => /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", ...p, children: /* @__PURE__ */ jsx("path", { d: "M6 6l12 12M18 6 6 18" }) }),
  check: (p) => /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", ...p, children: /* @__PURE__ */ jsx("path", { d: "m5 12.5 4.5 4.5L19 7" }) }),
  camera: (p) => /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", ...p, children: [
    /* @__PURE__ */ jsx("path", { d: "M3 8h3l1.5-2.5h9L18 8h3v12H3z" }),
    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "13.5", r: "3.6" })
  ] }),
  image: (p) => /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", ...p, children: [
    /* @__PURE__ */ jsx("rect", { x: "3", y: "4", width: "18", height: "16", rx: "2.5" }),
    /* @__PURE__ */ jsx("circle", { cx: "8.5", cy: "9.5", r: "1.6" }),
    /* @__PURE__ */ jsx("path", { d: "m4 18 5-5 4 4 3-3 4 4" })
  ] }),
  send: (p) => /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", ...p, children: /* @__PURE__ */ jsx("path", { d: "M4 12 20 5l-6 15-3-6-7-2Z" }) }),
  lock: (p) => /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", ...p, children: [
    /* @__PURE__ */ jsx("rect", { x: "5", y: "11", width: "14", height: "9", rx: "2.2" }),
    /* @__PURE__ */ jsx("path", { d: "M8 11V8a4 4 0 0 1 8 0v3" })
  ] }),
  shield: (p) => /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", ...p, children: [
    /* @__PURE__ */ jsx("path", { d: "M12 3 5 6v6c0 4.4 3 7.6 7 9 4-1.4 7-4.6 7-9V6l-7-3Z" }),
    /* @__PURE__ */ jsx("path", { d: "m9 12 2 2 4-4" })
  ] }),
  truck: (p) => /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", ...p, children: [
    /* @__PURE__ */ jsx("path", { d: "M2 7h11v8H2zM13 10h4l3 3v2h-7z" }),
    /* @__PURE__ */ jsx("circle", { cx: "6.5", cy: "17.5", r: "1.8" }),
    /* @__PURE__ */ jsx("circle", { cx: "16.5", cy: "17.5", r: "1.8" })
  ] }),
  walk: (p) => /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", ...p, children: [
    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "4.5", r: "2" }),
    /* @__PURE__ */ jsx("path", { d: "M12 8v6m0 0-3 6m3-6 3 6M8 11h8" })
  ] }),
  alert: (p) => /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", ...p, children: [
    /* @__PURE__ */ jsx("path", { d: "M12 4 2.5 20h19L12 4Z" }),
    /* @__PURE__ */ jsx("path", { d: "M12 10v4.5M12 17.5v.5" })
  ] }),
  info: (p) => /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", ...p, children: [
    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "9" }),
    /* @__PURE__ */ jsx("path", { d: "M12 11v5M12 8v.5" })
  ] }),
  clock: (p) => /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", ...p, children: [
    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "9" }),
    /* @__PURE__ */ jsx("path", { d: "M12 7v5l3.5 2" })
  ] }),
  bell: (p) => /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", ...p, children: [
    /* @__PURE__ */ jsx("path", { d: "M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" }),
    /* @__PURE__ */ jsx("path", { d: "M10 19a2 2 0 0 0 4 0" })
  ] }),
  refresh: (p) => /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", ...p, children: [
    /* @__PURE__ */ jsx("path", { d: "M20 11a8 8 0 1 0-.5 4" }),
    /* @__PURE__ */ jsx("path", { d: "M20 5v6h-6" })
  ] }),
  flag: (p) => /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", ...p, children: /* @__PURE__ */ jsx("path", { d: "M5 21V4m0 1h12l-2.5 4L17 13H5" }) }),
  heartline: (p) => /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", ...p, children: /* @__PURE__ */ jsx("path", { d: "M12 20s-7-4.6-9.2-9C1.3 8 2.6 4.6 5.9 4.6c2 0 3.3 1.2 4.1 2.4.8-1.2 2.1-2.4 4.1-2.4 3.3 0 4.6 3.4 3.1 6.4C19 15.4 12 20 12 20Z" }) }),
  cart: (p) => /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", ...p, children: [
    /* @__PURE__ */ jsx("path", { d: "M3 4h2l2.2 11h10L20 7H6.5" }),
    /* @__PURE__ */ jsx("circle", { cx: "9", cy: "19", r: "1.6" }),
    /* @__PURE__ */ jsx("circle", { cx: "17", cy: "19", r: "1.6" })
  ] }),
  wallet: (p) => /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", ...p, children: [
    /* @__PURE__ */ jsx("rect", { x: "3", y: "6", width: "18", height: "13", rx: "2.5" }),
    /* @__PURE__ */ jsx("path", { d: "M3 10h18M16 14h2" })
  ] })
};
var Sp = (p) => /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", className: "pd-spin " + (p.className || ""), children: [
  /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "9", strokeOpacity: ".25" }),
  /* @__PURE__ */ jsx("path", { d: "M21 12a9 9 0 0 0-9-9" })
] });
function PdBtn({ variant = "primary", block, lg, loading, icon, children, ...rest }) {
  const Icon = icon;
  return /* @__PURE__ */ jsxs("button", { className: `pd-btn pd-btn--${variant}${block ? " pd-btn--block" : ""}${lg ? " pd-btn--lg" : ""}`, ...rest, children: [
    loading ? /* @__PURE__ */ jsx(Sp, {}) : Icon && /* @__PURE__ */ jsx(Icon, { className: "pd-i18", fill: "none", stroke: "currentColor" }),
    children
  ] });
}
function PdField({ label, opt, hint, error, counter, children }) {
  return /* @__PURE__ */ jsxs("div", { className: "pd-field", children: [
    label && /* @__PURE__ */ jsxs("label", { className: "pd-label", children: [
      label,
      opt && /* @__PURE__ */ jsxs("span", { className: "opt", children: [
        " \xB7 ",
        opt
      ] })
    ] }),
    children,
    (hint || error || counter) && /* @__PURE__ */ jsxs("div", { className: "pd-fieldfoot", children: [
      error ? /* @__PURE__ */ jsxs("span", { className: "pd-err", children: [
        I.alert({ className: "pd-i14", fill: "none", stroke: "currentColor" }),
        error
      ] }) : hint && /* @__PURE__ */ jsx("span", { className: "pd-hint", children: hint }),
      counter && /* @__PURE__ */ jsx("span", { className: "pd-hint cnt", children: counter })
    ] })
  ] });
}
function PdInput({ state, prefix, icon, value, placeholder, textarea, rows = 4 }) {
  const Icon = icon;
  return /* @__PURE__ */ jsxs("div", { className: `pd-input${state === "focus" ? " pd-input--focus" : ""}${state === "invalid" ? " pd-input--invalid" : ""}`, children: [
    Icon && /* @__PURE__ */ jsx(Icon, { className: "pd-i18", fill: "none", stroke: "currentColor", style: { color: "var(--pd-muted)", flex: "none" } }),
    prefix && /* @__PURE__ */ jsx("span", { className: "pre", children: prefix }),
    textarea ? /* @__PURE__ */ jsx("textarea", { rows, defaultValue: value, placeholder }) : /* @__PURE__ */ jsx("input", { defaultValue: value, placeholder })
  ] });
}
function PdOtp({ value = "", cur, state }) {
  const cells = Array.from({ length: 6 }, (_, i) => value[i] || "");
  return /* @__PURE__ */ jsx("div", { className: `pd-otp${state === "invalid" ? " invalid" : ""}${state === "locked" ? " locked" : ""}`, children: cells.map((c, i) => /* @__PURE__ */ jsx("div", { className: `cell${c ? " filled" : ""}${i === cur ? " cur" : ""}`, children: c }, i)) });
}
function PdSeg({ options, value }) {
  return /* @__PURE__ */ jsx("div", { className: "pd-seg", children: options.map((o) => /* @__PURE__ */ jsxs("button", { className: value === o.k ? "on" : "", children: [
    o.icon && /* @__PURE__ */ jsx(o.icon, { className: "pd-i16", fill: "none", stroke: "currentColor", style: { marginRight: 5, verticalAlign: "-3px" } }),
    o.label
  ] }, o.k)) });
}
var PD_SIZES = [["S", "\u0434\u043E 7"], ["M", "7\u201315"], ["L", "15\u201325"], ["XL", "25+"]];
function PdSizeSel({ value }) {
  return /* @__PURE__ */ jsx("div", { className: "pd-sizes", children: PD_SIZES.map(([s, l]) => /* @__PURE__ */ jsxs("button", { className: `pd-sizebtn${value === s ? " on" : ""}`, children: [
    /* @__PURE__ */ jsx("span", { className: "s", children: s }),
    /* @__PURE__ */ jsxs("span", { className: "l", children: [
      l,
      " \u0448\u0442."
    ] })
  ] }, s)) });
}
function PdChip({ on, children, icon }) {
  const Icon = icon;
  return /* @__PURE__ */ jsxs("button", { className: `pd-chip${on ? " pd-chip--on" : ""}`, children: [
    Icon && /* @__PURE__ */ jsx(Icon, { className: "pd-i14", fill: "none", stroke: "currentColor" }),
    children
  ] });
}
var DEAL_STEPS = [["created", "\u041E\u043F\u043B\u0430\u0442\u0430"], ["paid_held", "\u0412 \u044D\u0441\u043A\u0440\u043E\u0443"], ["handover", "\u041F\u0435\u0440\u0435\u0434\u0430\u0447\u0430"], ["released", "\u0413\u043E\u0442\u043E\u0432\u043E"]];
function PdStepper({ status }) {
  const order = ["created", "paid_held", "handover", "released"];
  let curIdx = status === "disputed" ? 2 : order.indexOf(status === "released" ? "released" : status === "paid_held" ? "handover" : status);
  if (status === "paid_held") curIdx = 2;
  if (status === "released") curIdx = 3;
  if (status === "created") curIdx = 1;
  return /* @__PURE__ */ jsx("div", { className: "pd-stepper", children: DEAL_STEPS.map(([k, l], i) => {
    let cls = "";
    if (status === "disputed") {
      cls = i < 2 ? "done" : i === 2 ? "warn" : "";
    } else {
      cls = i < curIdx ? "done" : i === curIdx ? "cur" : "";
      if (status === "released") cls = i <= 3 ? "done" : "";
    }
    return /* @__PURE__ */ jsxs("div", { className: `pd-step ${cls}`, children: [
      /* @__PURE__ */ jsx("span", { className: "dot", children: cls === "done" ? I.check({ className: "pd-i16", fill: "none", stroke: "currentColor" }) : cls === "warn" ? "!" : i + 1 }),
      /* @__PURE__ */ jsx("span", { className: "lab", children: l })
    ] }, k);
  }) });
}
function PdBubble({ kind = "in", children, time }) {
  return /* @__PURE__ */ jsxs("div", { className: `pd-bubble pd-bubble--${kind}`, children: [
    children,
    time && /* @__PURE__ */ jsx("div", { className: "tm", children: time })
  ] });
}
function PdStars({ value = 0, input }) {
  return /* @__PURE__ */ jsx("span", { className: `pd-stars pd-stars--${input ? "input" : "read"}`, children: [1, 2, 3, 4, 5].map((n) => /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", className: n <= value ? "on" : "off", children: /* @__PURE__ */ jsx("path", { d: "M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.6 1-5.8L3.5 9.7l5.9-.9z" }) }, n)) });
}
function PdNotice({ kind = "info", icon, children }) {
  const Icon = icon || (kind === "warn" ? I.clock : kind === "ok" ? I.shield : kind === "danger" ? I.alert : I.info);
  return /* @__PURE__ */ jsxs("div", { className: `pd-notice pd-notice--${kind}`, children: [
    /* @__PURE__ */ jsx("span", { className: "ic", children: Icon({ className: "pd-i18", fill: "none", stroke: "currentColor" }) }),
    /* @__PURE__ */ jsx("div", { children })
  ] });
}
function PdEmpty({ glyph, title, text, children }) {
  const G = glyph || I.heartline;
  return /* @__PURE__ */ jsxs("div", { className: "pd-empty", children: [
    /* @__PURE__ */ jsx("div", { className: "glyph", children: G({ className: "pd-i28", fill: "none", stroke: "currentColor" }) }),
    /* @__PURE__ */ jsx("h3", { children: title }),
    /* @__PURE__ */ jsx("p", { children: text }),
    children && /* @__PURE__ */ jsx("div", { className: "pd-suggest", children })
  ] });
}
function PdSkelCard() {
  return /* @__PURE__ */ jsxs("div", { className: "pd-sk-card", children: [
    /* @__PURE__ */ jsx("div", { className: "pd-sk ph", style: { borderRadius: 0 } }),
    /* @__PURE__ */ jsxs("div", { className: "bd", children: [
      /* @__PURE__ */ jsx("div", { className: "pd-sk", style: { height: 16, width: "60%" } }),
      /* @__PURE__ */ jsx("div", { className: "pd-sk", style: { height: 12, width: "40%" } }),
      /* @__PURE__ */ jsx("div", { className: "pd-sk", style: { height: 12, width: "72%" } })
    ] })
  ] });
}
function PdGallery({ photos, count, idx = 0 }) {
  const PD_IMG2 = (id) => `img/${id}.jpg`;
  return /* @__PURE__ */ jsxs("div", { className: "pd-gallery", children: [
    /* @__PURE__ */ jsx("img", { src: PD_IMG2(photos[idx]), alt: "\u0411\u0443\u043A\u0435\u0442" }),
    /* @__PURE__ */ jsxs("span", { className: "pd-gcount", children: [
      idx + 1,
      " / ",
      count || photos.length
    ] }),
    /* @__PURE__ */ jsx("div", { className: "pd-gdots", children: Array.from({ length: count || photos.length }).map((_, i) => /* @__PURE__ */ jsx("i", { className: i === idx ? "on" : "" }, i)) })
  ] });
}
function PdScreen({ title, center, back = true, action, onBg, footer, banner, children, safeTop = 56, noScroll }) {
  return /* @__PURE__ */ jsxs("div", { className: "pd-root", "data-pd-theme": "a", children: [
    banner,
    /* @__PURE__ */ jsxs("header", { className: "pd-appbar", style: { paddingTop: safeTop }, children: [
      back && /* @__PURE__ */ jsx("button", { className: "pd-iconbtn", "aria-label": "\u041D\u0430\u0437\u0430\u0434", children: I.back({ className: "pd-i22", fill: "none", stroke: "currentColor" }) }),
      !back && /* @__PURE__ */ jsx("div", { style: { width: 6 } }),
      /* @__PURE__ */ jsx("div", { className: `pd-appbar-title${center ? " center" : ""}`, children: title }),
      action || /* @__PURE__ */ jsx("div", { style: { width: 38 } })
    ] }),
    noScroll ? children : /* @__PURE__ */ jsx("main", { className: "pd-scroll", children }),
    footer
  ] });
}
function PdToast({ kind = "ok", children }) {
  const Icon = kind === "ok" ? I.check : I.info;
  return /* @__PURE__ */ jsxs("div", { style: { position: "absolute", left: 16, right: 16, bottom: 24, background: "#3A322A", color: "#fff", borderRadius: 14, padding: "13px 15px", display: "flex", gap: 10, alignItems: "center", fontSize: 13.5, fontWeight: 600, boxShadow: "0 12px 30px rgba(0,0,0,.25)", zIndex: 30 }, children: [
    Icon({ className: "pd-i18", fill: "none", stroke: "currentColor" }),
    children
  ] });
}
var PD_IMG = (id) => `img/${id}.jpg`;
var PD_FRESH = [
  { id: "f1", photo: "1561181286-d3fee7d55364", size: "M", fresh: "today", price: 990, district: "\u041F\u0430\u0442\u0440\u0438\u043A\u0438", likes: 47, liked: true, seller: { n: "\u0410\u043D\u044F", r: 4.9, av: "w1" } },
  { id: "f2", photo: "1563241527-3004b7be0ffd", size: "L", fresh: "today", price: 1290, district: "\u0425\u0430\u043C\u043E\u0432\u043D\u0438\u043A\u0438", likes: 23, liked: false, seller: { n: "\u041C\u0430\u0440\u0438\u043D\u0430", r: 4.8, av: "w2" } },
  { id: "f3", photo: "1567418938902-aa650a3eb346", size: "S", fresh: "today", price: 690, district: "\u0421\u043E\u043A\u043E\u043B", likes: 12, liked: false, seller: { n: "\u041E\u043B\u044C\u0433\u0430", r: 5 } },
  { id: "f4", photo: "1572454591674-2739f30d8c40", size: "M", fresh: "today", price: 1100, district: "\u0427\u0438\u0441\u0442\u044B\u0435 \u043F\u0440\u0443\u0434\u044B", likes: 56, liked: false, seller: { n: "\u0421\u043E\u043D\u044F", r: 5, av: "w3" } },
  { id: "f5", photo: "1581938165093-050aeb5ef218", size: "L", fresh: "today", price: 1450, district: "\u0410\u0440\u0431\u0430\u0442", likes: 19, liked: false, seller: { n: "\u0412\u0435\u0440\u0430", r: 4.6 } }
];
var PD_LIKED = [
  { id: "l1", photo: "1565695951564-007d8f297e48", size: "XL", fresh: "d1_2", price: 1190, district: "\u0422\u0432\u0435\u0440\u0441\u043A\u043E\u0439", likes: 134, liked: true, seller: { n: "\u041A\u0430\u0442\u044F", r: 4.7, av: "w4" }, ar: "4 / 5" },
  { id: "l2", photo: "1582794543139-8ac9cb0f7b11", size: "M", fresh: "today", price: 850, district: "\u0417\u0430\u043C\u043E\u0441\u043A\u0432\u043E\u0440\u0435\u0447\u044C\u0435", likes: 88, liked: false, seller: { n: "\u041B\u0435\u043D\u0430", r: 4.9, av: "w5" }, ar: "1 / 1" },
  { id: "l3", photo: "1531120364508-a6b656c3e78d", size: "L", fresh: "d1_2", price: 920, district: "\u041F\u0440\u0435\u0441\u043D\u044F", likes: 71, liked: true, seller: { n: "\u042E\u043B\u044F", r: 4.8, av: "w6" }, ar: "1 / 1" },
  { id: "l4", photo: "1583228858294-6745cb25969e", size: "S", fresh: "d3_plus", price: 590, district: "\u0421\u043E\u043A\u043E\u043B", likes: 56, liked: false, seller: { n: "\u041E\u043B\u044C\u0433\u0430", r: 5 }, ar: "4 / 5" },
  { id: "l5", photo: "1533616688419-b7a585564566", size: "M", fresh: "today", price: 1290, district: "\u041F\u0430\u0442\u0440\u0438\u043A\u0438", likes: 51, liked: false, seller: { n: "\u0410\u043D\u044F", r: 4.9, av: "w1" }, ar: "1 / 1" },
  { id: "l6", photo: "1604323990536-e5452c0507c1", size: "L", fresh: "d1_2", price: 760, district: "\u0425\u0430\u043C\u043E\u0432\u043D\u0438\u043A\u0438", likes: 39, liked: false, seller: { n: "\u041C\u0430\u0440\u0438\u043D\u0430", r: 4.8, av: "w2" }, ar: "4 / 5" }
];
var PD_FRESH_META = {
  today: { label: "\u0421\u0435\u0433\u043E\u0434\u043D\u044F", dot: "var(--pd-fresh)" },
  d1_2: { label: "1\u20132 \u0434\u043D\u044F", dot: "var(--pd-aging)" },
  d3_plus: { label: "3+ \u0434\u043D\u044F", dot: "var(--pd-old)" }
};
var pdMoney = (rub) => rub.toLocaleString("ru-RU").replace(/,/g, " ") + " \u20BD";
var Ic = {
  home: (p) => /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", ...p, children: [
    /* @__PURE__ */ jsx("path", { d: "M3 10.5 12 3l9 7.5" }),
    /* @__PURE__ */ jsx("path", { d: "M5 9.5V20h14V9.5" })
  ] }),
  search: (p) => /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", ...p, children: [
    /* @__PURE__ */ jsx("circle", { cx: "11", cy: "11", r: "7" }),
    /* @__PURE__ */ jsx("path", { d: "m20 20-3.2-3.2" })
  ] }),
  plus: (p) => /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", ...p, children: /* @__PURE__ */ jsx("path", { d: "M12 5v14M5 12h14" }) }),
  deals: (p) => /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", ...p, children: [
    /* @__PURE__ */ jsx("path", { d: "M4 7h16v12H4z" }),
    /* @__PURE__ */ jsx("path", { d: "M9 7V5h6v2" }),
    /* @__PURE__ */ jsx("path", { d: "M4 12h16" })
  ] }),
  user: (p) => /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", ...p, children: [
    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "8", r: "4" }),
    /* @__PURE__ */ jsx("path", { d: "M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6" })
  ] }),
  pin: (p) => /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", ...p, children: [
    /* @__PURE__ */ jsx("path", { d: "M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z" }),
    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "10", r: "2.5" })
  ] }),
  star: (p) => /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", ...p, children: /* @__PURE__ */ jsx("path", { d: "M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.6 1-5.8L3.5 9.7l5.9-.9z" }) }),
  chev: (p) => /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", ...p, children: /* @__PURE__ */ jsx("path", { d: "m6 9 6 6 6-6" }) }),
  sliders: (p) => /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", ...p, children: [
    /* @__PURE__ */ jsx("path", { d: "M4 7h16M4 12h16M4 17h16" }),
    /* @__PURE__ */ jsx("circle", { cx: "9", cy: "7", r: "2.2", fill: "currentColor", stroke: "none" }),
    /* @__PURE__ */ jsx("circle", { cx: "15", cy: "12", r: "2.2", fill: "currentColor", stroke: "none" }),
    /* @__PURE__ */ jsx("circle", { cx: "8", cy: "17", r: "2.2", fill: "currentColor", stroke: "none" })
  ] })
};
var Heart = ({ filled, className }) => /* @__PURE__ */ jsx(
  "svg",
  {
    viewBox: "0 0 24 24",
    className,
    fill: filled ? "var(--pd-like)" : "none",
    stroke: filled ? "var(--pd-like)" : "currentColor",
    children: /* @__PURE__ */ jsx("path", { d: "M12 20s-7-4.6-9.2-9C1.3 8 2.6 4.6 5.9 4.6c2 0 3.3 1.2 4.1 2.4.8-1.2 2.1-2.4 4.1-2.4 3.3 0 4.6 3.4 3.1 6.4C19 15.4 12 20 12 20Z" })
  }
);
function Freshness({ kind }) {
  const m = PD_FRESH_META[kind];
  return /* @__PURE__ */ jsxs("span", { className: "pd-fresh", "data-kind": kind, children: [
    /* @__PURE__ */ jsx("span", { className: "pd-fresh-dot", style: { background: m.dot } }),
    m.label
  ] });
}
function LikeBtn({ liked: init, count: c0, big }) {
  const [liked, setLiked] = React2.useState(init);
  const [count, setCount] = React2.useState(c0);
  const [pop, setPop] = React2.useState(false);
  const toggle = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const next = !liked;
    setLiked(next);
    setCount((n) => n + (next ? 1 : -1));
    if (next) {
      setPop(true);
      setTimeout(() => setPop(false), 420);
    }
  };
  return /* @__PURE__ */ jsxs(
    "button",
    {
      className: "pd-like-btn" + (big ? " pd-like-btn--big" : "") + (pop ? " pd-pop" : ""),
      "aria-pressed": liked,
      "aria-label": liked ? "\u0423\u0431\u0440\u0430\u0442\u044C \u043B\u0430\u0439\u043A" : "\u041B\u0430\u0439\u043A",
      onClick: toggle,
      children: [
        /* @__PURE__ */ jsx(Heart, { filled: liked, className: "pd-like-heart" }),
        /* @__PURE__ */ jsx("span", { className: "pd-like-n", style: { fontVariantNumeric: "tabular-nums" }, children: count })
      ]
    }
  );
}
function Avatar({ seller, size = 21 }) {
  const st = { width: size, height: size, fontSize: Math.round(size * 0.5) };
  return /* @__PURE__ */ jsx("span", { className: "pd-ava", style: st, "aria-hidden": "true", children: seller.av ? /* @__PURE__ */ jsx("img", { src: "img/av/" + seller.av + ".jpg", alt: "", loading: "lazy" }) : seller.n[0] });
}
function Card({ d, variant }) {
  const ar = variant === "rail" ? "3 / 4" : d.ar || "1 / 1";
  return /* @__PURE__ */ jsxs("article", { className: "pd-card pd-card--" + variant, tabIndex: 0, children: [
    /* @__PURE__ */ jsxs("div", { className: "pd-photo-wrap", style: { aspectRatio: ar }, children: [
      /* @__PURE__ */ jsx("img", { className: "pd-photo", src: PD_IMG(d.photo), alt: "\u0411\u0443\u043A\u0435\u0442", loading: "lazy" }),
      /* @__PURE__ */ jsxs("div", { className: "pd-photo-top", children: [
        /* @__PURE__ */ jsx(Freshness, { kind: d.fresh }),
        /* @__PURE__ */ jsx(LikeBtn, { liked: d.liked, count: d.likes })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "pd-card-body", children: [
      /* @__PURE__ */ jsxs("div", { className: "pd-price-row", children: [
        /* @__PURE__ */ jsx("span", { className: "pd-price", children: pdMoney(d.price) }),
        /* @__PURE__ */ jsx("span", { className: "pd-size", children: d.size })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pd-meta", children: [
        /* @__PURE__ */ jsx(Ic.pin, { className: "pd-i14", fill: "none", stroke: "currentColor" }),
        /* @__PURE__ */ jsx("span", { className: "pd-district", children: d.district })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pd-seller", children: [
        /* @__PURE__ */ jsx(Avatar, { seller: d.seller, size: 21 }),
        /* @__PURE__ */ jsx("span", { className: "pd-seller-n", children: d.seller.n }),
        /* @__PURE__ */ jsxs("span", { className: "pd-rating", children: [
          /* @__PURE__ */ jsx(Ic.star, { className: "pd-i13 pd-star" }),
          " ",
          d.seller.r.toFixed(1)
        ] })
      ] })
    ] })
  ] });
}
function SectionHead({ title, sub, action }) {
  return /* @__PURE__ */ jsxs("div", { className: "pd-sechead", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h2", { className: "pd-sectitle", children: title }),
      sub && /* @__PURE__ */ jsx("p", { className: "pd-secsub", children: sub })
    ] }),
    action && /* @__PURE__ */ jsx("button", { className: "pd-link", children: action })
  ] });
}
function TopBar({ safeTop }) {
  return /* @__PURE__ */ jsxs("header", { className: "pd-topbar", style: { paddingTop: safeTop }, children: [
    /* @__PURE__ */ jsxs("div", { className: "pd-topbar-row", children: [
      /* @__PURE__ */ jsx("span", { className: "pd-brand", children: "\u041F\u0435\u0440\u0435\u0434\u0430\u0440\u0438\u043C" }),
      /* @__PURE__ */ jsxs("button", { className: "pd-city", children: [
        /* @__PURE__ */ jsx(Ic.pin, { className: "pd-i16", fill: "none", stroke: "currentColor" }),
        "\u041C\u043E\u0441\u043A\u0432\u0430",
        /* @__PURE__ */ jsx(Ic.chev, { className: "pd-i14", fill: "none", stroke: "currentColor" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "pd-searchrow", children: [
      /* @__PURE__ */ jsxs("div", { className: "pd-search", children: [
        /* @__PURE__ */ jsx(Ic.search, { className: "pd-i18", fill: "none", stroke: "currentColor" }),
        /* @__PURE__ */ jsx("span", { className: "pd-search-ph", children: "\u041F\u043E\u0438\u0441\u043A \u0431\u0443\u043A\u0435\u0442\u043E\u0432 \u0432 \u041C\u043E\u0441\u043A\u0432\u0435" })
      ] }),
      /* @__PURE__ */ jsx("button", { className: "pd-filter", "aria-label": "\u0424\u0438\u043B\u044C\u0442\u0440\u044B", children: /* @__PURE__ */ jsx(Ic.sliders, { className: "pd-i20", fill: "none", stroke: "currentColor" }) })
    ] })
  ] });
}
function BottomNav({ safeBottom }) {
  const tabs = [
    { k: "home", label: "\u0413\u043B\u0430\u0432\u043D\u0430\u044F", icon: Ic.home, active: true },
    { k: "search", label: "\u041F\u043E\u0438\u0441\u043A", icon: Ic.search },
    { k: "sell", label: "\u041F\u0440\u043E\u0434\u0430\u0442\u044C", icon: Ic.plus, fab: true },
    { k: "deals", label: "\u0421\u0434\u0435\u043B\u043A\u0438", icon: Ic.deals },
    { k: "me", label: "\u041F\u0440\u043E\u0444\u0438\u043B\u044C", icon: Ic.user }
  ];
  return /* @__PURE__ */ jsx("nav", { className: "pd-bottomnav", style: { paddingBottom: safeBottom }, children: tabs.map((t) => t.fab ? /* @__PURE__ */ jsxs("button", { className: "pd-tab pd-tab--fab", "aria-label": t.label, children: [
    /* @__PURE__ */ jsx("span", { className: "pd-fab", children: /* @__PURE__ */ jsx(t.icon, { className: "pd-i24", fill: "none", stroke: "currentColor" }) }),
    /* @__PURE__ */ jsx("span", { className: "pd-tab-l", children: t.label })
  ] }, t.k) : /* @__PURE__ */ jsxs("button", { className: "pd-tab" + (t.active ? " pd-tab--on" : ""), "aria-current": t.active ? "page" : void 0, children: [
    /* @__PURE__ */ jsx(t.icon, { className: "pd-i24", fill: "none", stroke: "currentColor" }),
    /* @__PURE__ */ jsx("span", { className: "pd-tab-l", children: t.label })
  ] }, t.k)) });
}
function PdFeed({ theme = "a", platform = "ios" }) {
  const safeTop = platform === "ios" ? 56 : platform === "web" ? 8 : 10;
  const safeBottom = platform === "ios" ? 22 : 8;
  return /* @__PURE__ */ jsxs("div", { className: "pd-root", "data-pd-theme": theme, children: [
    /* @__PURE__ */ jsx(TopBar, { safeTop }),
    /* @__PURE__ */ jsxs("main", { className: "pd-scroll", children: [
      /* @__PURE__ */ jsxs("section", { className: "pd-section", children: [
        /* @__PURE__ */ jsx(SectionHead, { title: "\u0421\u0430\u043C\u044B\u0435 \u0441\u0432\u0435\u0436\u0438\u0435", sub: "\u041A\u0443\u043F\u043B\u0435\u043D\u044B \u0441\u0435\u0433\u043E\u0434\u043D\u044F, \u0440\u044F\u0434\u043E\u043C \u0441 \u0432\u0430\u043C\u0438", action: "\u0412\u0441\u0435" }),
        /* @__PURE__ */ jsxs("div", { className: "pd-rail", children: [
          PD_FRESH.map((d) => /* @__PURE__ */ jsx("div", { className: "pd-rise", children: /* @__PURE__ */ jsx(Card, { d, variant: "rail" }) }, d.id)),
          /* @__PURE__ */ jsx("div", { className: "pd-rail-end", children: /* @__PURE__ */ jsxs("span", { children: [
            "\u041B\u0438\u0441\u0442\u0430\u0439\u0442\u0435",
            /* @__PURE__ */ jsx("br", {}),
            "\u0434\u0430\u043B\u044C\u0448\u0435 \u2192"
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "pd-section", children: [
        /* @__PURE__ */ jsx(SectionHead, { title: "\u0421\u0430\u043C\u044B\u0435 \u0437\u0430\u043B\u0430\u0439\u043A\u0430\u043D\u043D\u044B\u0435", sub: "\u041B\u044E\u0431\u0438\u043C\u0446\u044B \u043D\u0435\u0434\u0435\u043B\u0438 \u0432 \u041C\u043E\u0441\u043A\u0432\u0435", action: "\u0412\u0441\u0435" }),
        /* @__PURE__ */ jsx("div", { className: "pd-grid", children: PD_LIKED.map((d) => /* @__PURE__ */ jsx("div", { className: "pd-rise", children: /* @__PURE__ */ jsx(Card, { d, variant: "grid" }) }, d.id)) }),
        /* @__PURE__ */ jsx("div", { className: "pd-feed-end", children: "\u0412\u044B \u043F\u043E\u0441\u043C\u043E\u0442\u0440\u0435\u043B\u0438 \u0441\u0432\u0435\u0436\u0438\u0435 \u0431\u0443\u043A\u0435\u0442\u044B \u041C\u043E\u0441\u043A\u0432\u044B" })
      ] }),
      /* @__PURE__ */ jsx("div", { style: { height: 18 } })
    ] }),
    /* @__PURE__ */ jsx(BottomNav, { safeBottom })
  ] });
}
var PD_THEMES = [
  { id: "a", name: "A \xB7 \xAB\u0412\u043E\u0437\u0434\u0443\u0445\xBB", sub: "\u0441\u0432\u0435\u0442\u043B\u044B\u0439 \u043C\u0438\u043D\u0438\u043C\u0430\u043B \xB7 Golos Text \xB7 \u0442\u0435\u0440\u0440\u0430\u043A\u043E\u0442\u0430" },
  { id: "b", name: "B \xB7 \xAB\u0422\u0451\u043F\u043B\u044B\u0439\xBB", sub: "\u0443\u044E\u0442\u043D\u044B\u0439 \xB7 Lora + Nunito Sans \xB7 \u043A\u0430\u0440\u0430\u043C\u0435\u043B\u044C" },
  { id: "c", name: "C \xB7 \xAB\u0421\u0430\u0434\xBB", sub: "\u0441\u0432\u0435\u0436\u0438\u0439 tech \xB7 Manrope \xB7 \u0431\u043E\u0442\u0430\u043D\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u0437\u0435\u043B\u0435\u043D\u044C" }
];

export { Avatar, BottomNav, Card, Freshness, Heart, I, Ic, LikeBtn, PD_FRESH, PD_LIKED, PD_THEMES, PdBtn, PdBubble, PdChip, PdEmpty, PdFeed, PdField, PdGallery, PdInput, PdNotice, PdOtp, PdScreen, PdSeg, PdSizeSel, PdSkelCard, PdStars, PdStepper, PdToast, SectionHead, TopBar, pdMoney };
