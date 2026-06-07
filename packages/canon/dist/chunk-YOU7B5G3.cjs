'use strict';

var chunkG5Y6Q77T_cjs = require('./chunk-G5Y6Q77T.cjs');
require('react');
var jsxRuntime = require('react/jsx-runtime');

var sic = (Fn, cls = "pd-i18") => Fn({ className: cls, fill: "none", stroke: "currentColor" });
var S = {
  trash: (p) => /* @__PURE__ */ jsxRuntime.jsx("svg", { viewBox: "0 0 24 24", ...p, children: /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" }) }),
  logout: (p) => /* @__PURE__ */ jsxRuntime.jsx("svg", { viewBox: "0 0 24 24", ...p, children: /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M14 4h5v16h-5M14 12H4m0 0 3.5-3.5M4 12l3.5 3.5" }) }),
  globe: (p) => /* @__PURE__ */ jsxRuntime.jsxs("svg", { viewBox: "0 0 24 24", ...p, children: [
    /* @__PURE__ */ jsxRuntime.jsx("circle", { cx: "12", cy: "12", r: "9" }),
    /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M3 12h18M12 3c2.5 2.5 2.5 15.5 0 18M12 3c-2.5 2.5-2.5 15.5 0 18" })
  ] }),
  device: (p) => /* @__PURE__ */ jsxRuntime.jsxs("svg", { viewBox: "0 0 24 24", ...p, children: [
    /* @__PURE__ */ jsxRuntime.jsx("rect", { x: "6", y: "3", width: "12", height: "18", rx: "2.5" }),
    /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M10 18h4" })
  ] }),
  laptop: (p) => /* @__PURE__ */ jsxRuntime.jsxs("svg", { viewBox: "0 0 24 24", ...p, children: [
    /* @__PURE__ */ jsxRuntime.jsx("rect", { x: "4", y: "5", width: "16", height: "11", rx: "1.5" }),
    /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M2 20h20" })
  ] }),
  mail: (p) => /* @__PURE__ */ jsxRuntime.jsxs("svg", { viewBox: "0 0 24 24", ...p, children: [
    /* @__PURE__ */ jsxRuntime.jsx("rect", { x: "3", y: "5", width: "18", height: "14", rx: "2.5" }),
    /* @__PURE__ */ jsxRuntime.jsx("path", { d: "m4 7 8 6 8-6" })
  ] }),
  doc: (p) => /* @__PURE__ */ jsxRuntime.jsxs("svg", { viewBox: "0 0 24 24", ...p, children: [
    /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M6 3h8l4 4v14H6z" }),
    /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M14 3v4h4M9 13h6M9 17h6" })
  ] }),
  moon: (p) => /* @__PURE__ */ jsxRuntime.jsx("svg", { viewBox: "0 0 24 24", ...p, children: /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M20 14a8 8 0 1 1-9.5-9 6.5 6.5 0 0 0 9.5 9Z" }) }),
  key: (p) => /* @__PURE__ */ jsxRuntime.jsxs("svg", { viewBox: "0 0 24 24", ...p, children: [
    /* @__PURE__ */ jsxRuntime.jsx("circle", { cx: "8", cy: "8", r: "4" }),
    /* @__PURE__ */ jsxRuntime.jsx("path", { d: "m11 11 8 8M16 16l2-2M19 19l1.5-1.5" })
  ] }),
  chevR: (p) => /* @__PURE__ */ jsxRuntime.jsx("svg", { viewBox: "0 0 24 24", ...p, children: /* @__PURE__ */ jsxRuntime.jsx("path", { d: "m9 5 7 7-7 7" }) })
};
var PROVMK = { ya: { c: "#FC3F1D", t: "\u042F" }, sber: { c: "#21A038", t: "\u0421" }, vk: { c: "#0077FF", t: "VK", fs: 11 }, tid: { c: "#FFDD2D", t: "\u0422", col: "#222" }};
function Switch({ on }) {
  return /* @__PURE__ */ jsxRuntime.jsx("button", { className: `pd-switch${on ? " on" : ""}`, role: "switch", "aria-checked": on, children: /* @__PURE__ */ jsxRuntime.jsx("i", {}) });
}
function SetShell({ plat = "ios", title, back = true, footer, action, children }) {
  const top = plat === "ios" ? 54 : plat === "android" ? 8 : 12;
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pd-root", "data-pd-theme": "a", children: [
    /* @__PURE__ */ jsxRuntime.jsxs("header", { className: "pd-appbar", style: { paddingTop: top }, children: [
      back ? /* @__PURE__ */ jsxRuntime.jsx("button", { className: "pd-iconbtn", children: sic(chunkG5Y6Q77T_cjs.I.back, "pd-i22") }) : /* @__PURE__ */ jsxRuntime.jsx("div", { style: { width: 6 } }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pd-appbar-title center", children: title }),
      action || /* @__PURE__ */ jsxRuntime.jsx("div", { style: { width: 38 } })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx("main", { className: "pd-scroll pds-scroll", children }),
    footer
  ] });
}
function SRow({ icon, iconKind, title, sub, value, right, danger, chev = true, mark }) {
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: `pds-row${danger ? " danger" : ""}`, role: "button", tabIndex: 0, children: [
    mark ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "pds-link-mk", style: { background: mark.c, color: mark.col || "#fff", fontSize: mark.fs || 14 }, children: mark.t || sic(S.device, "pd-i18") }) : icon && /* @__PURE__ */ jsxRuntime.jsx("span", { className: `ic ${iconKind || ""}`, children: sic(icon, "pd-i18") }),
    /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "mid", children: [
      /* @__PURE__ */ jsxRuntime.jsx("span", { className: "ttl", children: title }),
      sub && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "sub", children: sub })
    ] }),
    value && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "val", children: value }),
    right,
    chev && !right && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "chev", children: sic(S.chevR, "pd-i18") })
  ] });
}
var Group = ({ head, children }) => /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pds-group", children: [
  /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pds-ghead", children: head }),
  /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pds-card", children })
] });
function SettingsHub({ plat = "ios" }) {
  return /* @__PURE__ */ jsxRuntime.jsxs(SetShell, { plat, title: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438", children: [
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pds-prof", children: [
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "big", children: /* @__PURE__ */ jsxRuntime.jsx("img", { src: "img/av/w4.jpg", alt: "" }) }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "nm", children: "\u0415\u043A\u0430\u0442\u0435\u0440\u0438\u043D\u0430 \u041B." }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "meta", children: [
          sic(chunkG5Y6Q77T_cjs.Ic.pin, "pd-i13"),
          "\u041C\u043E\u0441\u043A\u0432\u0430 \xB7 ",
          sic(chunkG5Y6Q77T_cjs.Ic.star, "pd-i13"),
          /* @__PURE__ */ jsxRuntime.jsx("b", { style: { color: "var(--pd-text)" }, children: "4.9" }),
          " \xB7 23 \u0441\u0434\u0435\u043B\u043A\u0438"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx("button", { className: "pd-iconbtn pd-iconbtn--ring edit", children: sic(chunkG5Y6Q77T_cjs.I.camera, "pd-i18") })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs(Group, { head: "\u0410\u043A\u043A\u0430\u0443\u043D\u0442", children: [
      /* @__PURE__ */ jsxRuntime.jsx(SRow, { icon: chunkG5Y6Q77T_cjs.Ic.user, title: "\u041F\u0440\u043E\u0444\u0438\u043B\u044C", sub: "\u0418\u043C\u044F, \u0444\u043E\u0442\u043E, \u0433\u043E\u0440\u043E\u0434, \u043E \u0441\u0435\u0431\u0435" }),
      /* @__PURE__ */ jsxRuntime.jsx(SRow, { icon: S.key, title: "\u0421\u043F\u043E\u0441\u043E\u0431\u044B \u0432\u0445\u043E\u0434\u0430", sub: "\u0422\u0435\u043B\u0435\u0444\u043E\u043D, email, \u043F\u0440\u0438\u0432\u044F\u0437\u043A\u0438", value: "3 \u043F\u0440\u0438\u0432\u044F\u0437\u043A\u0438" })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs(Group, { head: "\u041F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435", children: [
      /* @__PURE__ */ jsxRuntime.jsx(SRow, { icon: chunkG5Y6Q77T_cjs.I.bell, title: "\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F", sub: "Push, email, Telegram" }),
      /* @__PURE__ */ jsxRuntime.jsx(SRow, { icon: S.globe, title: "\u042F\u0437\u044B\u043A", value: "\u0420\u0443\u0441\u0441\u043A\u0438\u0439" }),
      /* @__PURE__ */ jsxRuntime.jsx(SRow, { icon: S.moon, title: "\u0422\u0435\u043C\u0430", value: "\u0421\u0438\u0441\u0442\u0435\u043C\u043D\u0430\u044F" })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs(Group, { head: "\u0411\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u043E\u0441\u0442\u044C \u0438 \u0434\u0430\u043D\u043D\u044B\u0435", children: [
      /* @__PURE__ */ jsxRuntime.jsx(SRow, { icon: chunkG5Y6Q77T_cjs.I.shield, title: "\u0421\u0435\u0441\u0441\u0438\u0438 \u0438 \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0430", value: "3 \u0430\u043A\u0442\u0438\u0432\u043D\u044B\u0435" }),
      /* @__PURE__ */ jsxRuntime.jsx(SRow, { icon: chunkG5Y6Q77T_cjs.I.lock, title: "\u041F\u0440\u0438\u0432\u0430\u0442\u043D\u043E\u0441\u0442\u044C \u0438 \u0434\u0430\u043D\u043D\u044B\u0435", sub: "\u0421\u043E\u0433\u043B\u0430\u0441\u0438\u044F 152-\u0424\u0417, \u044D\u043A\u0441\u043F\u043E\u0440\u0442" })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs(Group, { head: " ", children: [
      /* @__PURE__ */ jsxRuntime.jsx(SRow, { icon: S.logout, title: "\u0412\u044B\u0439\u0442\u0438", chev: false }),
      /* @__PURE__ */ jsxRuntime.jsx(SRow, { icon: S.trash, iconKind: "danger", title: "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0430\u043A\u043A\u0430\u0443\u043D\u0442", danger: true, chev: false })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx("p", { style: { textAlign: "center", color: "var(--pd-faint)", fontSize: 12, marginTop: 18 }, children: "\u041F\u0435\u0440\u0435\u0434\u0430\u0440\u0438\u043C \xB7 \u0432\u0435\u0440\u0441\u0438\u044F 1.4.0" })
  ] });
}
function SettingsProfile({ plat = "ios", state = "rest" }) {
  const foot = /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pd-footerbar", children: /* @__PURE__ */ jsxRuntime.jsx(chunkG5Y6Q77T_cjs.PdBtn, { variant: "primary", block: true, lg: true, loading: state === "saving", disabled: state === "saving", children: state === "saving" ? "\u0421\u043E\u0445\u0440\u0430\u043D\u044F\u0435\u043C\u2026" : "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C" }) });
  return /* @__PURE__ */ jsxRuntime.jsx(SetShell, { plat, title: "\u041F\u0440\u043E\u0444\u0438\u043B\u044C", footer: foot, children: /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { padding: "0 18px" }, children: [
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pds-avedit", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "ring", children: [
        /* @__PURE__ */ jsxRuntime.jsx("img", { src: "img/av/w4.jpg", alt: "" }),
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "cam", children: sic(chunkG5Y6Q77T_cjs.I.camera, "pd-i16") })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx("button", { className: "pd-link", children: "\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u0444\u043E\u0442\u043E" })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 16 }, children: [
      /* @__PURE__ */ jsxRuntime.jsx(chunkG5Y6Q77T_cjs.PdField, { label: "\u0418\u043C\u044F", hint: "\u0422\u0430\u043A \u0432\u0430\u0441 \u0432\u0438\u0434\u044F\u0442 \u043F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u0438", children: /* @__PURE__ */ jsxRuntime.jsx(chunkG5Y6Q77T_cjs.PdInput, { value: "\u0415\u043A\u0430\u0442\u0435\u0440\u0438\u043D\u0430", state: "focus" }) }),
      /* @__PURE__ */ jsxRuntime.jsx(chunkG5Y6Q77T_cjs.PdField, { label: "\u0413\u043E\u0440\u043E\u0434", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pa-citysel", children: [
        /* @__PURE__ */ jsxRuntime.jsx("span", { children: "\u041C\u043E\u0441\u043A\u0432\u0430" }),
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "chev", children: sic(chunkG5Y6Q77T_cjs.Ic.chev, "pd-i18") })
      ] }) }),
      /* @__PURE__ */ jsxRuntime.jsx(chunkG5Y6Q77T_cjs.PdField, { label: "\u041E \u0441\u0435\u0431\u0435", opt: "\u043F\u043E \u0436\u0435\u043B\u0430\u043D\u0438\u044E", counter: "48 / 160", children: /* @__PURE__ */ jsxRuntime.jsx(chunkG5Y6Q77T_cjs.PdInput, { textarea: true, rows: 3, value: "\u0414\u0430\u0440\u044E \u0431\u0443\u043A\u0435\u0442\u0430\u043C \u0432\u0442\u043E\u0440\u0443\u044E \u0436\u0438\u0437\u043D\u044C \u{1F337} \u0421\u0430\u043C\u043E\u0432\u044B\u0432\u043E\u0437 \u0432 \u0446\u0435\u043D\u0442\u0440\u0435." }) })
    ] })
  ] }) });
}
function SettingsLogins({ plat = "ios" }) {
  return /* @__PURE__ */ jsxRuntime.jsxs(SetShell, { plat, title: "\u0421\u043F\u043E\u0441\u043E\u0431\u044B \u0432\u0445\u043E\u0434\u0430", children: [
    /* @__PURE__ */ jsxRuntime.jsx("div", { style: { padding: "14px 18px 4px" }, children: /* @__PURE__ */ jsxRuntime.jsx(chunkG5Y6Q77T_cjs.PdNotice, { kind: "info", children: "\u0425\u043E\u0442\u044F \u0431\u044B \u043E\u0434\u0438\u043D \u0441\u043F\u043E\u0441\u043E\u0431 \u0432\u0445\u043E\u0434\u0430 \u0434\u043E\u043B\u0436\u0435\u043D \u043E\u0441\u0442\u0430\u0432\u0430\u0442\u044C\u0441\u044F \u0430\u043A\u0442\u0438\u0432\u043D\u044B\u043C. \u041F\u0440\u0438\u0432\u044F\u0437\u043A\u0438 \u0443\u0441\u043A\u043E\u0440\u044F\u044E\u0442 \u0432\u0445\u043E\u0434 \u0438 \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0430\u044E\u0442 \u043B\u0438\u0447\u043D\u043E\u0441\u0442\u044C." }) }),
    /* @__PURE__ */ jsxRuntime.jsxs(Group, { head: "\u041A\u043E\u043D\u0442\u0430\u043A\u0442\u044B", children: [
      /* @__PURE__ */ jsxRuntime.jsx(SRow, { icon: S.device, title: "\u0422\u0435\u043B\u0435\u0444\u043E\u043D", value: "+7 999 \xB7\xB7\xB7-58-03", right: /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "pds-pill ok", children: [
        sic(chunkG5Y6Q77T_cjs.I.check, "pd-i13"),
        "\u043E\u0441\u043D\u043E\u0432\u043D\u043E\u0439"
      ] }), chev: false }),
      /* @__PURE__ */ jsxRuntime.jsx(SRow, { icon: S.mail, title: "Email", sub: "\u0414\u043B\u044F \u0447\u0435\u043A\u043E\u0432 \u0438 \u0432\u0430\u0436\u043D\u044B\u0445 \u043F\u0438\u0441\u0435\u043C", right: /* @__PURE__ */ jsxRuntime.jsx("span", { className: "pd-link", style: { fontSize: 13 }, children: "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C" }), chev: false })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs(Group, { head: "\u0421\u0435\u0440\u0432\u0438\u0441\u044B", children: [
      /* @__PURE__ */ jsxRuntime.jsx(SRow, { mark: PROVMK.ya, title: "\u042F\u043D\u0434\u0435\u043A\u0441 ID", sub: "\u041F\u0440\u0438\u0432\u044F\u0437\u0430\u043D \xB7 katya@ya.ru", right: /* @__PURE__ */ jsxRuntime.jsx("span", { className: "pd-link", style: { fontSize: 13 }, children: "\u041E\u0442\u0432\u044F\u0437\u0430\u0442\u044C" }), chev: false }),
      /* @__PURE__ */ jsxRuntime.jsx(SRow, { mark: PROVMK.vk, title: "VK ID", sub: "\u041F\u0440\u0438\u0432\u044F\u0437\u0430\u043D", right: /* @__PURE__ */ jsxRuntime.jsx("span", { className: "pd-link", style: { fontSize: 13 }, children: "\u041E\u0442\u0432\u044F\u0437\u0430\u0442\u044C" }), chev: false }),
      /* @__PURE__ */ jsxRuntime.jsx(SRow, { mark: PROVMK.sber, title: "\u0421\u0431\u0435\u0440 ID", right: /* @__PURE__ */ jsxRuntime.jsx("span", { className: "pds-pill off", children: "\u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0438\u0442\u044C" }), chev: false }),
      /* @__PURE__ */ jsxRuntime.jsx(SRow, { mark: PROVMK.tid, title: "T-ID", right: /* @__PURE__ */ jsxRuntime.jsx("span", { className: "pds-pill off", children: "\u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0438\u0442\u044C" }), chev: false })
    ] })
  ] });
}
function SettingsNotifications({ plat = "ios" }) {
  const row = (icon, title, sub, on) => /* @__PURE__ */ jsxRuntime.jsx(SRow, { icon, title, sub, right: /* @__PURE__ */ jsxRuntime.jsx(Switch, { on }), chev: false });
  return /* @__PURE__ */ jsxRuntime.jsxs(SetShell, { plat, title: "\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F", children: [
    /* @__PURE__ */ jsxRuntime.jsxs(Group, { head: "\u0421\u0434\u0435\u043B\u043A\u0438", children: [
      row(chunkG5Y6Q77T_cjs.I.wallet, "\u0421\u0442\u0430\u0442\u0443\u0441\u044B \u0441\u0434\u0435\u043B\u043E\u043A", "\u0414\u043E\u0433\u043E\u0432\u043E\u0440\u0451\u043D\u043D\u043E\u0441\u0442\u044C, \u0432\u0441\u0442\u0440\u0435\u0447\u0430, \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0438\u0435", true),
      row(chunkG5Y6Q77T_cjs.I.bell, "\u0421\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u044F \u0432 \u0447\u0430\u0442\u0435", null, true),
      row(chunkG5Y6Q77T_cjs.Ic.star, "\u041D\u043E\u0432\u044B\u0435 \u043E\u0442\u0437\u044B\u0432\u044B", null, true)
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs(Group, { head: "\u0410\u043A\u0442\u0438\u0432\u043D\u043E\u0441\u0442\u044C", children: [
      row(chunkG5Y6Q77T_cjs.I.heartline, "\u041B\u0430\u0439\u043A\u0438 \u043D\u0430 \u0432\u0430\u0448\u0438\u0445 \u0431\u0443\u043A\u0435\u0442\u0430\u0445", null, false),
      row(chunkG5Y6Q77T_cjs.Ic.search, "\u041F\u043E\u0445\u043E\u0436\u0438\u0435 \u0431\u0443\u043A\u0435\u0442\u044B \u0440\u044F\u0434\u043E\u043C", null, true)
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs(Group, { head: "\u041A\u0430\u043D\u0430\u043B\u044B", children: [
      row(S.device, "Push", "\u041D\u0430 \u044D\u0442\u043E\u043C \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0435", true),
      row(S.mail, "Email", "katya@ya.ru", false),
      row(chunkG5Y6Q77T_cjs.I.send, "Telegram", "\u0411\u043E\u0442 @peredarim_bot", true)
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx(Group, { head: "\u041F\u0440\u043E\u0447\u0435\u0435", children: row(chunkG5Y6Q77T_cjs.I.info, "\u041D\u043E\u0432\u043E\u0441\u0442\u0438 \u0438 \u0430\u043A\u0446\u0438\u0438", "\u041D\u0435 \u0447\u0430\u0449\u0435 \u0440\u0430\u0437\u0430 \u0432 \u043D\u0435\u0434\u0435\u043B\u044E", false) })
  ] });
}
function SettingsPrivacy({ plat = "ios" }) {
  return /* @__PURE__ */ jsxRuntime.jsxs(SetShell, { plat, title: "\u041F\u0440\u0438\u0432\u0430\u0442\u043D\u043E\u0441\u0442\u044C \u0438 \u0434\u0430\u043D\u043D\u044B\u0435", children: [
    /* @__PURE__ */ jsxRuntime.jsxs(Group, { head: "\u0421\u043E\u0433\u043B\u0430\u0441\u0438\u044F 152-\u0424\u0417", children: [
      /* @__PURE__ */ jsxRuntime.jsx(SRow, { icon: chunkG5Y6Q77T_cjs.I.shield, title: "\u041E\u0431\u0440\u0430\u0431\u043E\u0442\u043A\u0430 \u043F\u0435\u0440\u0441\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0445 \u0434\u0430\u043D\u043D\u044B\u0445", right: /* @__PURE__ */ jsxRuntime.jsx("span", { className: "pds-pill ok", children: "\u0434\u0430\u043D\u043E" }), chev: false }),
      /* @__PURE__ */ jsxRuntime.jsx(SRow, { icon: chunkG5Y6Q77T_cjs.Ic.pin, title: "\u0413\u0435\u043E\u043B\u043E\u043A\u0430\u0446\u0438\u044F", sub: "\u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0442\u044C \u0431\u0443\u043A\u0435\u0442\u044B \u0440\u044F\u0434\u043E\u043C", right: /* @__PURE__ */ jsxRuntime.jsx(Switch, { on: true }), chev: false }),
      /* @__PURE__ */ jsxRuntime.jsx(SRow, { icon: chunkG5Y6Q77T_cjs.Ic.user, title: "\u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0442\u044C \u043F\u0440\u043E\u0444\u0438\u043B\u044C \u0432 \u043F\u043E\u0438\u0441\u043A\u0435", right: /* @__PURE__ */ jsxRuntime.jsx(Switch, { on: true }), chev: false })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs(Group, { head: "\u0412\u0430\u0448\u0438 \u0434\u0430\u043D\u043D\u044B\u0435", children: [
      /* @__PURE__ */ jsxRuntime.jsx(SRow, { icon: S.doc, title: "\u0421\u043A\u0430\u0447\u0430\u0442\u044C \u043C\u043E\u0438 \u0434\u0430\u043D\u043D\u044B\u0435", sub: "\u0412\u044B\u0433\u0440\u0443\u0437\u043A\u0430 \u0432 \u0442\u0435\u0447\u0435\u043D\u0438\u0435 30 \u0434\u043D\u0435\u0439" }),
      /* @__PURE__ */ jsxRuntime.jsx(SRow, { icon: chunkG5Y6Q77T_cjs.I.info, title: "\u041F\u043E\u043B\u0438\u0442\u0438\u043A\u0430 \u043A\u043E\u043D\u0444\u0438\u0434\u0435\u043D\u0446\u0438\u0430\u043B\u044C\u043D\u043E\u0441\u0442\u0438" }),
      /* @__PURE__ */ jsxRuntime.jsx(SRow, { icon: S.doc, title: "\u0423\u0441\u043B\u043E\u0432\u0438\u044F \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u043D\u0438\u044F" })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx(Group, { head: " ", children: /* @__PURE__ */ jsxRuntime.jsx(SRow, { icon: S.trash, iconKind: "danger", title: "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0430\u043A\u043A\u0430\u0443\u043D\u0442", sub: "\u0423\u0434\u0430\u043B\u0435\u043D\u0438\u0435 \u043F\u043E \u0437\u0430\u043F\u0440\u043E\u0441\u0443 (DSR)", danger: true, chev: true }) })
  ] });
}
function SettingsSecurity({ plat = "ios" }) {
  const foot = /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pd-footerbar", children: /* @__PURE__ */ jsxRuntime.jsx(chunkG5Y6Q77T_cjs.PdBtn, { variant: "secondary", block: true, lg: true, children: "\u0417\u0430\u0432\u0435\u0440\u0448\u0438\u0442\u044C \u0432\u0441\u0435 \u0434\u0440\u0443\u0433\u0438\u0435 \u0441\u0435\u0441\u0441\u0438\u0438" }) });
  return /* @__PURE__ */ jsxRuntime.jsxs(SetShell, { plat, title: "\u0421\u0435\u0441\u0441\u0438\u0438 \u0438 \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0430", footer: foot, children: [
    /* @__PURE__ */ jsxRuntime.jsxs(Group, { head: "\u0410\u043A\u0442\u0438\u0432\u043D\u044B\u0435 \u0441\u0435\u0439\u0447\u0430\u0441", children: [
      /* @__PURE__ */ jsxRuntime.jsx(SRow, { icon: S.device, title: "iPhone 15 \xB7 \u044D\u0442\u043E \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u043E", sub: "\u041C\u043E\u0441\u043A\u0432\u0430 \xB7 \u0442\u043E\u043B\u044C\u043A\u043E \u0447\u0442\u043E", right: /* @__PURE__ */ jsxRuntime.jsx("span", { className: "pds-pill ok", children: "\u0442\u0435\u043A\u0443\u0449\u0435\u0435" }), chev: false }),
      /* @__PURE__ */ jsxRuntime.jsx(SRow, { icon: S.laptop, title: "Web \xB7 Chrome, macOS", sub: "\u041C\u043E\u0441\u043A\u0432\u0430 \xB7 2 \u0447\u0430\u0441\u0430 \u043D\u0430\u0437\u0430\u0434", right: /* @__PURE__ */ jsxRuntime.jsx("span", { className: "pd-link", style: { fontSize: 13 }, children: "\u0412\u044B\u0439\u0442\u0438" }), chev: false }),
      /* @__PURE__ */ jsxRuntime.jsx(SRow, { icon: S.device, title: "Android \xB7 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435", sub: "\u0421\u041F\u0431 \xB7 3 \u0434\u043D\u044F \u043D\u0430\u0437\u0430\u0434", right: /* @__PURE__ */ jsxRuntime.jsx("span", { className: "pd-link", style: { fontSize: 13 }, children: "\u0412\u044B\u0439\u0442\u0438" }), chev: false })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx("div", { style: { padding: "4px 18px 0" }, children: /* @__PURE__ */ jsxRuntime.jsx(chunkG5Y6Q77T_cjs.PdNotice, { kind: "warn", icon: chunkG5Y6Q77T_cjs.I.shield, children: "\u041D\u0435 \u0443\u0437\u043D\u0430\u0451\u0442\u0435 \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u043E? \u0417\u0430\u0432\u0435\u0440\u0448\u0438\u0442\u0435 \u0441\u0435\u0441\u0441\u0438\u044E \u0438 \u0441\u043C\u0435\u043D\u0438\u0442\u0435 \u0441\u043F\u043E\u0441\u043E\u0431 \u0432\u0445\u043E\u0434\u0430. \u0414\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \u043B\u043E\u0433\u0438\u0440\u0443\u0435\u0442\u0441\u044F." }) })
  ] });
}
function SettingsDelete({ plat = "ios", state = "warn" }) {
  if (state === "otp") {
    const foot2 = /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pd-footerbar", children: /* @__PURE__ */ jsxRuntime.jsx(chunkG5Y6Q77T_cjs.PdBtn, { variant: "danger", block: true, lg: true, children: "\u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044C \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u0435" }) });
    return /* @__PURE__ */ jsxRuntime.jsx(SetShell, { plat, title: "\u0423\u0434\u0430\u043B\u0435\u043D\u0438\u0435 \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0430", footer: foot2, children: /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { padding: "24px 20px", textAlign: "center" }, children: [
      /* @__PURE__ */ jsxRuntime.jsx("h2", { style: { fontSize: 21, fontWeight: 700, marginBottom: 8 }, children: "\u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u0435 \u043F\u043E \u043A\u043E\u0434\u0443" }),
      /* @__PURE__ */ jsxRuntime.jsx("p", { style: { color: "var(--pd-muted)", fontSize: 14, lineHeight: 1.5, marginBottom: 24 }, children: "\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u043B\u0438 \u043A\u043E\u0434 \u043D\u0430 +7 999 \xB7\xB7\xB7-58-03. \u042D\u0442\u043E \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0439 \u0448\u0430\u0433, \u043F\u043E\u0441\u043B\u0435 \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u044F \u0430\u043A\u043A\u0430\u0443\u043D\u0442 \u043E\u0442\u043A\u043B\u044E\u0447\u0430\u0435\u0442\u0441\u044F \u0441\u0440\u0430\u0437\u0443." }),
      /* @__PURE__ */ jsxRuntime.jsx(chunkG5Y6Q77T_cjs.PdOtp, { value: "41", cur: 2 })
    ] }) });
  }
  const foot = /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pd-footerbar", style: { display: "flex", flexDirection: "column", gap: 9 }, children: [
    /* @__PURE__ */ jsxRuntime.jsx(chunkG5Y6Q77T_cjs.PdBtn, { variant: "danger", block: true, lg: true, children: "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0430\u043A\u043A\u0430\u0443\u043D\u0442" }),
    /* @__PURE__ */ jsxRuntime.jsx(chunkG5Y6Q77T_cjs.PdBtn, { variant: "ghost", block: true, children: "\u041E\u0442\u043C\u0435\u043D\u0430" })
  ] });
  return /* @__PURE__ */ jsxRuntime.jsxs(SetShell, { plat, title: "\u0423\u0434\u0430\u043B\u0435\u043D\u0438\u0435 \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0430", footer: foot, children: [
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pds-confirm", children: [
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "glyph", children: sic(S.trash, "pd-i28") }),
      /* @__PURE__ */ jsxRuntime.jsx("h2", { children: "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0430\u043A\u043A\u0430\u0443\u043D\u0442?" }),
      /* @__PURE__ */ jsxRuntime.jsx("p", { children: "\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \u043D\u0435\u043E\u0431\u0440\u0430\u0442\u0438\u043C\u043E. \u041F\u0440\u043E\u0444\u0438\u043B\u044C, \u043E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u044F \u0438 \u0438\u0441\u0442\u043E\u0440\u0438\u044F \u0431\u0443\u0434\u0443\u0442 \u0443\u0434\u0430\u043B\u0435\u043D\u044B \u0438\u043B\u0438 \u043E\u0431\u0435\u0437\u043B\u0438\u0447\u0435\u043D\u044B \u043F\u043E \u0437\u0430\u043A\u043E\u043D\u0443." })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx("div", { style: { padding: "0 20px" }, children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pds-keeplist", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "li", style: { color: "var(--pd-danger)" }, children: [
        sic(S.trash, "pd-i16"),
        /* @__PURE__ */ jsxRuntime.jsx("span", { children: "\u041F\u0440\u043E\u0444\u0438\u043B\u044C, \u0444\u043E\u0442\u043E, \u043E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u044F \u0438 \u043B\u0430\u0439\u043A\u0438 \u0443\u0434\u0430\u043B\u044F\u044E\u0442\u0441\u044F" })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "li", children: [
        sic(chunkG5Y6Q77T_cjs.I.lock, "pd-i16"),
        /* @__PURE__ */ jsxRuntime.jsx("span", { children: "\u0414\u0430\u043D\u043D\u044B\u0435 \u0437\u0430\u0432\u0435\u0440\u0448\u0451\u043D\u043D\u044B\u0445 \u0441\u0434\u0435\u043B\u043E\u043A \u0438 \u0447\u0435\u043A\u0438 \u0445\u0440\u0430\u043D\u044F\u0442\u0441\u044F \u043F\u043E 54-\u0424\u0417/152-\u0424\u0417" })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "li", style: { color: "var(--pd-warn)" }, children: [
        sic(chunkG5Y6Q77T_cjs.I.alert, "pd-i16"),
        /* @__PURE__ */ jsxRuntime.jsx("span", { children: "\u0410\u043A\u0442\u0438\u0432\u043D\u044B\u0435 \u0441\u0434\u0435\u043B\u043A\u0438 \u043D\u0443\u0436\u043D\u043E \u0437\u0430\u0432\u0435\u0440\u0448\u0438\u0442\u044C \u0434\u043E \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u044F" })
      ] })
    ] }) })
  ] });
}
var DNAV = [
  ["profile", "\u041F\u0440\u043E\u0444\u0438\u043B\u044C", chunkG5Y6Q77T_cjs.Ic.user],
  ["logins", "\u0421\u043F\u043E\u0441\u043E\u0431\u044B \u0432\u0445\u043E\u0434\u0430", S.key],
  ["notif", "\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F", chunkG5Y6Q77T_cjs.I.bell],
  ["privacy", "\u041F\u0440\u0438\u0432\u0430\u0442\u043D\u043E\u0441\u0442\u044C \u0438 \u0434\u0430\u043D\u043D\u044B\u0435", chunkG5Y6Q77T_cjs.I.lock],
  ["security", "\u0421\u0435\u0441\u0441\u0438\u0438", chunkG5Y6Q77T_cjs.I.shield]
];
function SettingsDesktop({ screen = "profile" }) {
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdss pd-root", "data-pd-theme": "a", children: [
    /* @__PURE__ */ jsxRuntime.jsxs("aside", { className: "pdss-side", children: [
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "h", children: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438" }),
      DNAV.map(([k, l, Ic2]) => /* @__PURE__ */ jsxRuntime.jsxs("button", { className: `pdss-nav${screen === k ? " on" : ""}`, children: [
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "ic", children: sic(Ic2, "pd-i18") }),
        l
      ] }, k)),
      /* @__PURE__ */ jsxRuntime.jsxs("button", { className: "pdss-nav danger", children: [
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "ic", children: sic(S.trash, "pd-i18") }),
        "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0430\u043A\u043A\u0430\u0443\u043D\u0442"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx("main", { className: "pdss-main", children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pdss-wrap", children: DESKBODY[screen] ? DESKBODY[screen]() : DESKBODY.profile() }) })
  ] });
}
var dRow = (icon, title, sub, right, opts = {}) => /* @__PURE__ */ jsxRuntime.jsxs("div", { className: `pds-row${opts.danger ? " danger" : ""}`, role: "button", style: { borderRadius: 0 }, children: [
  opts.mark ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "pds-link-mk", style: { background: opts.mark.c, color: opts.mark.col || "#fff", fontSize: opts.mark.fs || 14 }, children: opts.mark.t }) : /* @__PURE__ */ jsxRuntime.jsx("span", { className: `ic ${opts.iconKind || ""}`, children: sic(icon, "pd-i18") }),
  /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "mid", children: [
    /* @__PURE__ */ jsxRuntime.jsx("span", { className: "ttl", children: title }),
    sub && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "sub", children: sub })
  ] }),
  right
] });
var DESKBODY = {
  profile: () => /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsx("h1", { className: "pdss-h1", children: "\u041F\u0440\u043E\u0444\u0438\u043B\u044C" }),
    /* @__PURE__ */ jsxRuntime.jsx("p", { className: "pdss-sub", children: "\u0422\u0430\u043A \u0432\u0430\u0441 \u0432\u0438\u0434\u044F\u0442 \u043F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u0438 \u043D\u0430 \u0432\u0438\u0442\u0440\u0438\u043D\u0435 \u0438 \u0432 \u0441\u0434\u0435\u043B\u043A\u0430\u0445" }),
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pdss-block", style: { padding: "22px" }, children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pds-avedit", style: { flexDirection: "row", gap: 18, padding: 0, alignItems: "center" }, children: [
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "ring", style: { width: 78, height: 78 }, children: /* @__PURE__ */ jsxRuntime.jsx("img", { src: "img/av/w4.jpg", alt: "" }) }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntime.jsx("div", { style: { fontWeight: 700, fontSize: 17 }, children: "\u0415\u043A\u0430\u0442\u0435\u0440\u0438\u043D\u0430 \u041B." }),
        /* @__PURE__ */ jsxRuntime.jsx("div", { style: { color: "var(--pd-muted)", fontSize: 13, marginTop: 3 }, children: "katya@ya.ru" }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { marginTop: 10, display: "flex", gap: 8 }, children: [
          /* @__PURE__ */ jsxRuntime.jsx(chunkG5Y6Q77T_cjs.PdBtn, { variant: "secondary", children: "\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u0444\u043E\u0442\u043E" }),
          /* @__PURE__ */ jsxRuntime.jsx(chunkG5Y6Q77T_cjs.PdBtn, { variant: "ghost", children: "\u0423\u0434\u0430\u043B\u0438\u0442\u044C" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdss-block", style: { padding: "22px" }, children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px 22px" }, children: [
        /* @__PURE__ */ jsxRuntime.jsx(chunkG5Y6Q77T_cjs.PdField, { label: "\u0418\u043C\u044F", children: /* @__PURE__ */ jsxRuntime.jsx(chunkG5Y6Q77T_cjs.PdInput, { value: "\u0415\u043A\u0430\u0442\u0435\u0440\u0438\u043D\u0430", state: "focus" }) }),
        /* @__PURE__ */ jsxRuntime.jsx(chunkG5Y6Q77T_cjs.PdField, { label: "\u0413\u043E\u0440\u043E\u0434", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pa-citysel", children: [
          /* @__PURE__ */ jsxRuntime.jsx("span", { children: "\u041C\u043E\u0441\u043A\u0432\u0430" }),
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "chev", children: sic(chunkG5Y6Q77T_cjs.Ic.chev, "pd-i18") })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { style: { marginTop: 18 }, children: /* @__PURE__ */ jsxRuntime.jsx(chunkG5Y6Q77T_cjs.PdField, { label: "\u041E \u0441\u0435\u0431\u0435", opt: "\u043F\u043E \u0436\u0435\u043B\u0430\u043D\u0438\u044E", counter: "48 / 160", children: /* @__PURE__ */ jsxRuntime.jsx(chunkG5Y6Q77T_cjs.PdInput, { textarea: true, rows: 3, value: "\u0414\u0430\u0440\u044E \u0431\u0443\u043A\u0435\u0442\u0430\u043C \u0432\u0442\u043E\u0440\u0443\u044E \u0436\u0438\u0437\u043D\u044C \u{1F337} \u0421\u0430\u043C\u043E\u0432\u044B\u0432\u043E\u0437 \u0432 \u0446\u0435\u043D\u0442\u0440\u0435." }) }) }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { style: { marginTop: 20 }, children: /* @__PURE__ */ jsxRuntime.jsx(chunkG5Y6Q77T_cjs.PdBtn, { variant: "primary", lg: true, children: "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C" }) })
    ] })
  ] }),
  logins: () => /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsx("h1", { className: "pdss-h1", children: "\u0421\u043F\u043E\u0441\u043E\u0431\u044B \u0432\u0445\u043E\u0434\u0430" }),
    /* @__PURE__ */ jsxRuntime.jsx("p", { className: "pdss-sub", children: "\u041A\u043E\u043D\u0442\u0430\u043A\u0442\u044B \u0438 \u0441\u0435\u0440\u0432\u0438\u0441\u044B \u0434\u043B\u044F \u0431\u044B\u0441\u0442\u0440\u043E\u0433\u043E \u0432\u0445\u043E\u0434\u0430. \u0425\u043E\u0442\u044F \u0431\u044B \u043E\u0434\u0438\u043D \u0441\u043F\u043E\u0441\u043E\u0431 \u0434\u043E\u043B\u0436\u0435\u043D \u043E\u0441\u0442\u0430\u0432\u0430\u0442\u044C\u0441\u044F \u0430\u043A\u0442\u0438\u0432\u043D\u044B\u043C" }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdss-block", children: [
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "bh", children: "\u041A\u043E\u043D\u0442\u0430\u043A\u0442\u044B" }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { style: { height: 6 } }),
      dRow(S.device, "\u0422\u0435\u043B\u0435\u0444\u043E\u043D", "+7 999 \xB7\xB7\xB7-58-03", /* @__PURE__ */ jsxRuntime.jsx("span", { className: "pds-pill ok", children: "\u043E\u0441\u043D\u043E\u0432\u043D\u043E\u0439" })),
      dRow(S.mail, "Email", "\u041D\u0435 \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D", /* @__PURE__ */ jsxRuntime.jsx("span", { className: "pd-link", style: { fontSize: 13 }, children: "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C" }))
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdss-block", children: [
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "bh", children: "\u0421\u0435\u0440\u0432\u0438\u0441\u044B" }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { style: { height: 6 } }),
      dRow(null, "\u042F\u043D\u0434\u0435\u043A\u0441 ID", "\u041F\u0440\u0438\u0432\u044F\u0437\u0430\u043D \xB7 katya@ya.ru", /* @__PURE__ */ jsxRuntime.jsx("span", { className: "pd-link", style: { fontSize: 13 }, children: "\u041E\u0442\u0432\u044F\u0437\u0430\u0442\u044C" }), { mark: PROVMK.ya }),
      dRow(null, "VK ID", "\u041F\u0440\u0438\u0432\u044F\u0437\u0430\u043D", /* @__PURE__ */ jsxRuntime.jsx("span", { className: "pd-link", style: { fontSize: 13 }, children: "\u041E\u0442\u0432\u044F\u0437\u0430\u0442\u044C" }), { mark: PROVMK.vk }),
      dRow(null, "\u0421\u0431\u0435\u0440 ID", null, /* @__PURE__ */ jsxRuntime.jsx("span", { className: "pds-pill off", children: "\u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0438\u0442\u044C" }), { mark: PROVMK.sber }),
      dRow(null, "T-ID", null, /* @__PURE__ */ jsxRuntime.jsx("span", { className: "pds-pill off", children: "\u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0438\u0442\u044C" }), { mark: PROVMK.tid })
    ] })
  ] }),
  notif: () => /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsx("h1", { className: "pdss-h1", children: "\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F" }),
    /* @__PURE__ */ jsxRuntime.jsx("p", { className: "pdss-sub", children: "\u0427\u0442\u043E \u0438 \u043A\u0443\u0434\u0430 \u043F\u0440\u0438\u0441\u044B\u043B\u0430\u0442\u044C. \u0412\u0430\u0436\u043D\u044B\u0435 \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F \u043E \u0441\u0434\u0435\u043B\u043A\u0430\u0445 \u043E\u0442\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u043D\u0435\u043B\u044C\u0437\u044F" }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdss-block", children: [
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "bh", children: "\u0421\u0434\u0435\u043B\u043A\u0438" }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { style: { height: 6 } }),
      dRow(chunkG5Y6Q77T_cjs.I.wallet, "\u0421\u0442\u0430\u0442\u0443\u0441\u044B \u0441\u0434\u0435\u043B\u043E\u043A", "\u0414\u043E\u0433\u043E\u0432\u043E\u0440\u0451\u043D\u043D\u043E\u0441\u0442\u044C, \u0432\u0441\u0442\u0440\u0435\u0447\u0430, \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0438\u0435", /* @__PURE__ */ jsxRuntime.jsx(Switch, { on: true })),
      dRow(chunkG5Y6Q77T_cjs.I.bell, "\u0421\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u044F \u0432 \u0447\u0430\u0442\u0435", null, /* @__PURE__ */ jsxRuntime.jsx(Switch, { on: true })),
      dRow(chunkG5Y6Q77T_cjs.Ic.star, "\u041D\u043E\u0432\u044B\u0435 \u043E\u0442\u0437\u044B\u0432\u044B", null, /* @__PURE__ */ jsxRuntime.jsx(Switch, { on: true }))
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdss-block", children: [
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "bh", children: "\u041A\u0430\u043D\u0430\u043B\u044B" }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { style: { height: 6 } }),
      dRow(S.device, "Push", "\u041D\u0430 \u044D\u0442\u043E\u043C \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0435", /* @__PURE__ */ jsxRuntime.jsx(Switch, { on: true })),
      dRow(S.mail, "Email", "katya@ya.ru", /* @__PURE__ */ jsxRuntime.jsx(Switch, {})),
      dRow(chunkG5Y6Q77T_cjs.I.send, "Telegram", "\u0411\u043E\u0442 @peredarim_bot", /* @__PURE__ */ jsxRuntime.jsx(Switch, { on: true }))
    ] })
  ] }),
  security: () => /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsx("h1", { className: "pdss-h1", children: "\u0421\u0435\u0441\u0441\u0438\u0438 \u0438 \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0430" }),
    /* @__PURE__ */ jsxRuntime.jsx("p", { className: "pdss-sub", children: "\u0413\u0434\u0435 \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D \u0432\u0445\u043E\u0434. \u0417\u0430\u0432\u0435\u0440\u0448\u0438\u0442\u0435 \u043D\u0435\u0437\u043D\u0430\u043A\u043E\u043C\u044B\u0435 \u0441\u0435\u0441\u0441\u0438\u0438, \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \u043B\u043E\u0433\u0438\u0440\u0443\u0435\u0442\u0441\u044F" }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdss-block", children: [
      /* @__PURE__ */ jsxRuntime.jsx("div", { style: { height: 8 } }),
      dRow(S.laptop, "Web \xB7 Chrome, macOS", "\u041C\u043E\u0441\u043A\u0432\u0430 \xB7 \u044D\u0442\u043E \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u043E \xB7 \u0442\u043E\u043B\u044C\u043A\u043E \u0447\u0442\u043E", /* @__PURE__ */ jsxRuntime.jsx("span", { className: "pds-pill ok", children: "\u0442\u0435\u043A\u0443\u0449\u0435\u0435" })),
      dRow(S.device, "iPhone 15 \xB7 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435", "\u041C\u043E\u0441\u043A\u0432\u0430 \xB7 2 \u0447\u0430\u0441\u0430 \u043D\u0430\u0437\u0430\u0434", /* @__PURE__ */ jsxRuntime.jsx("span", { className: "pd-link", style: { fontSize: 13 }, children: "\u0412\u044B\u0439\u0442\u0438" })),
      dRow(S.device, "Android \xB7 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435", "\u0421\u041F\u0431 \xB7 3 \u0434\u043D\u044F \u043D\u0430\u0437\u0430\u0434", /* @__PURE__ */ jsxRuntime.jsx("span", { className: "pd-link", style: { fontSize: 13 }, children: "\u0412\u044B\u0439\u0442\u0438" }))
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx(chunkG5Y6Q77T_cjs.PdBtn, { variant: "secondary", lg: true, children: "\u0417\u0430\u0432\u0435\u0440\u0448\u0438\u0442\u044C \u0432\u0441\u0435 \u0434\u0440\u0443\u0433\u0438\u0435 \u0441\u0435\u0441\u0441\u0438\u0438" })
  ] }),
  privacy: () => /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsx("h1", { className: "pdss-h1", children: "\u041F\u0440\u0438\u0432\u0430\u0442\u043D\u043E\u0441\u0442\u044C \u0438 \u0434\u0430\u043D\u043D\u044B\u0435" }),
    /* @__PURE__ */ jsxRuntime.jsx("p", { className: "pdss-sub", children: "\u0421\u043E\u0433\u043B\u0430\u0441\u0438\u044F \u043F\u043E 152-\u0424\u0417 \u0438 \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u0432\u0430\u0448\u0438\u043C\u0438 \u0434\u0430\u043D\u043D\u044B\u043C\u0438" }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdss-block", children: [
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "bh", children: "\u0421\u043E\u0433\u043B\u0430\u0441\u0438\u044F" }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { style: { height: 6 } }),
      dRow(chunkG5Y6Q77T_cjs.I.shield, "\u041E\u0431\u0440\u0430\u0431\u043E\u0442\u043A\u0430 \u043F\u0435\u0440\u0441\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0445 \u0434\u0430\u043D\u043D\u044B\u0445", null, /* @__PURE__ */ jsxRuntime.jsx("span", { className: "pds-pill ok", children: "\u0434\u0430\u043D\u043E" })),
      dRow(chunkG5Y6Q77T_cjs.Ic.pin, "\u0413\u0435\u043E\u043B\u043E\u043A\u0430\u0446\u0438\u044F", "\u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0442\u044C \u0431\u0443\u043A\u0435\u0442\u044B \u0440\u044F\u0434\u043E\u043C", /* @__PURE__ */ jsxRuntime.jsx(Switch, { on: true }))
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdss-block", children: [
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "bh", children: "\u0412\u0430\u0448\u0438 \u0434\u0430\u043D\u043D\u044B\u0435" }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { style: { height: 6 } }),
      dRow(S.doc, "\u0421\u043A\u0430\u0447\u0430\u0442\u044C \u043C\u043E\u0438 \u0434\u0430\u043D\u043D\u044B\u0435", "\u0412\u044B\u0433\u0440\u0443\u0437\u043A\u0430 \u0432 \u0442\u0435\u0447\u0435\u043D\u0438\u0435 30 \u0434\u043D\u0435\u0439", /* @__PURE__ */ jsxRuntime.jsx("span", { className: "pd-link", style: { fontSize: 13 }, children: "\u0417\u0430\u043F\u0440\u043E\u0441\u0438\u0442\u044C" }))
    ] })
  ] })
};

exports.SettingsDelete = SettingsDelete;
exports.SettingsDesktop = SettingsDesktop;
exports.SettingsHub = SettingsHub;
exports.SettingsLogins = SettingsLogins;
exports.SettingsNotifications = SettingsNotifications;
exports.SettingsPrivacy = SettingsPrivacy;
exports.SettingsProfile = SettingsProfile;
exports.SettingsSecurity = SettingsSecurity;
exports.Switch = Switch;
