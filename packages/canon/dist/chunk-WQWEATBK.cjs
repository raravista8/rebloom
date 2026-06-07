'use strict';

var chunkCMKDVS6C_cjs = require('./chunk-CMKDVS6C.cjs');
var React = require('react');
var jsxRuntime = require('react/jsx-runtime');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React__default = /*#__PURE__*/_interopDefault(React);

var IMG2 = (id) => `img/${id}.jpg`;
function Uploader() {
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pd-uploader", children: [
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pd-upcell", children: [
      /* @__PURE__ */ jsxRuntime.jsx("img", { src: IMG2("1561181286-d3fee7d55364"), alt: "" }),
      /* @__PURE__ */ jsxRuntime.jsx("button", { className: "x", children: chunkCMKDVS6C_cjs.I.x({ className: "pd-i14", fill: "none", stroke: "currentColor" }) }),
      /* @__PURE__ */ jsxRuntime.jsx("span", { className: "cover", children: "\u041E\u0431\u043B\u043E\u0436\u043A\u0430" })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pd-upcell", children: [
      /* @__PURE__ */ jsxRuntime.jsx("img", { src: IMG2("1567418938902-aa650a3eb346"), alt: "" }),
      /* @__PURE__ */ jsxRuntime.jsx("button", { className: "x", children: chunkCMKDVS6C_cjs.I.x({ className: "pd-i14", fill: "none", stroke: "currentColor" }) })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pd-upcell", children: [
      /* @__PURE__ */ jsxRuntime.jsx("img", { src: IMG2("1581938165093-050aeb5ef218"), alt: "", style: { filter: "brightness(.7)" } }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "prog", children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "bar" }) })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs("button", { className: "pd-upadd", children: [
      chunkCMKDVS6C_cjs.I.camera({ className: "pd-i24", fill: "none", stroke: "currentColor" }),
      /* @__PURE__ */ jsxRuntime.jsxs("span", { children: [
        "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C",
        /* @__PURE__ */ jsxRuntime.jsx("br", {}),
        "3 \u0438\u0437 5"
      ] })
    ] })
  ] });
}
function SellForm() {
  const [metro, setMetro] = React__default.default.useState("\u041C\u0430\u044F\u043A\u043E\u0432\u0441\u043A\u0430\u044F");
  const [flowers, setFlowers] = React__default.default.useState(["\u041F\u0438\u043E\u043D\u043E\u0432\u0438\u0434\u043D\u044B\u0435 \u0440\u043E\u0437\u044B", "\u0417\u0435\u043B\u0435\u043D\u044C \u0438 \u044D\u0432\u043A\u0430\u043B\u0438\u043F\u0442"]);
  const footer = /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pd-footerbar", children: /* @__PURE__ */ jsxRuntime.jsx(chunkCMKDVS6C_cjs.PdBtn, { variant: "primary", block: true, lg: true, children: "\u041E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u0442\u044C \u0431\u0443\u043A\u0435\u0442" }) });
  return /* @__PURE__ */ jsxRuntime.jsx(chunkCMKDVS6C_cjs.PdScreen, { title: "\u041F\u0440\u043E\u0434\u0430\u0442\u044C \u0431\u0443\u043A\u0435\u0442", footer, children: /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { padding: "16px", display: "flex", flexDirection: "column", gap: 20 }, children: [
    /* @__PURE__ */ jsxRuntime.jsx(chunkCMKDVS6C_cjs.PdField, { label: "\u0424\u043E\u0442\u043E \u0431\u0443\u043A\u0435\u0442\u0430", hint: "1\u20135 \u0444\u043E\u0442\u043E. \u0423\u0431\u0435\u0440\u0451\u043C \u043C\u0435\u0442\u0430\u0434\u0430\u043D\u043D\u044B\u0435 \u0438 \u0433\u0435\u043E\u0434\u0430\u043D\u043D\u044B\u0435 \u043F\u0435\u0440\u0435\u0434 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u043E\u0439.", children: /* @__PURE__ */ jsxRuntime.jsx(Uploader, {}) }),
    /* @__PURE__ */ jsxRuntime.jsx(chunkCMKDVS6C_cjs.PdField, { label: "\u0420\u0430\u0437\u043C\u0435\u0440", hint: "\u0421\u0447\u0438\u0442\u0430\u0435\u043C \u043F\u043E \u0447\u0438\u0441\u043B\u0443 \u0441\u0442\u0435\u0431\u043B\u0435\u0439 \u2014 \u043A\u0430\u043A \u043F\u0440\u0438\u043D\u044F\u0442\u043E \u0432\u043E \u0444\u043B\u043E\u0440\u0438\u0441\u0442\u0438\u043A\u0435.", children: /* @__PURE__ */ jsxRuntime.jsx(chunkCMKDVS6C_cjs.PdSizeSel, { value: "M" }) }),
    /* @__PURE__ */ jsxRuntime.jsx(chunkCMKDVS6C_cjs.PdField, { label: "\u041A\u043E\u0433\u0434\u0430 \u0431\u0443\u043A\u0435\u0442 \u043F\u043E\u0434\u0430\u0440\u0438\u043B\u0438", hint: "\u041E\u0442 \u044D\u0442\u043E\u0433\u043E \u0434\u043D\u044F \u0441\u0447\u0438\u0442\u0430\u0435\u043C \u0441\u0432\u0435\u0436\u0435\u0441\u0442\u044C \u2014 \u0435\u0451 \u0443\u0432\u0438\u0434\u044F\u0442 \u0432 \u0442\u0435\u0433\u0435 \u0431\u0443\u043A\u0435\u0442\u0430.", children: /* @__PURE__ */ jsxRuntime.jsx(chunkCMKDVS6C_cjs.PdSeg, { value: "today", options: [{ k: "today", label: "\u0421\u0435\u0433\u043E\u0434\u043D\u044F" }, { k: "d1_2", label: "1\u20132 \u0434\u043D\u044F" }, { k: "d3_plus", label: "3+ \u0434\u043D\u044F" }] }) }),
    /* @__PURE__ */ jsxRuntime.jsx(chunkCMKDVS6C_cjs.PdField, { label: "\u0426\u0435\u043D\u0430", children: /* @__PURE__ */ jsxRuntime.jsx(chunkCMKDVS6C_cjs.PdInput, { prefix: "\u20BD", value: "990" }) }),
    /* @__PURE__ */ jsxRuntime.jsx(chunkCMKDVS6C_cjs.PdField, { label: "\u0421\u0442\u0430\u043D\u0446\u0438\u044F \u043C\u0435\u0442\u0440\u043E", hint: "\u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u043E\u0440\u0438\u0435\u043D\u0442\u0438\u0440 \u0434\u043B\u044F \u043F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u044F. \u0422\u043E\u0447\u043D\u044B\u0439 \u0430\u0434\u0440\u0435\u0441 \u2014 \u0432 \u0447\u0430\u0442\u0435 \u043F\u043E\u0441\u043B\u0435 \u0434\u043E\u0433\u043E\u0432\u043E\u0440\u0451\u043D\u043D\u043E\u0441\u0442\u0438.", children: /* @__PURE__ */ jsxRuntime.jsx(chunkCMKDVS6C_cjs.PdMetroPicker, { cityKey: "msk", value: metro, onChange: setMetro }) }),
    /* @__PURE__ */ jsxRuntime.jsx(chunkCMKDVS6C_cjs.PdField, { label: "\u041A\u0430\u043A\u0438\u0435 \u0446\u0432\u0435\u0442\u044B", opt: "\u043D\u0435\u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E", hint: "\u041F\u043E\u043C\u043E\u0433\u0430\u0435\u0442 \u043F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u044E \u043D\u0430\u0439\u0442\u0438 \u0431\u0443\u043A\u0435\u0442 \u0432 \u0444\u0438\u043B\u044C\u0442\u0440\u0430\u0445 \u043F\u043E \u0442\u0438\u043F\u0443 \u0446\u0432\u0435\u0442\u043E\u0432.", children: /* @__PURE__ */ jsxRuntime.jsx(chunkCMKDVS6C_cjs.PdFlowerPicker, { value: flowers, onChange: setFlowers }) }),
    /* @__PURE__ */ jsxRuntime.jsx(chunkCMKDVS6C_cjs.PdField, { label: "\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435", opt: "\u043D\u0435\u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E", counter: "84 / 600", children: /* @__PURE__ */ jsxRuntime.jsx(chunkCMKDVS6C_cjs.PdInput, { textarea: true, rows: 3, value: "\u041F\u043E\u0434\u0430\u0440\u0438\u043B\u0438 \u0443\u0442\u0440\u043E\u043C, \u043F\u0438\u043E\u043D\u043E\u0432\u0438\u0434\u043D\u044B\u0435 \u0440\u043E\u0437\u044B \u0438 \u044D\u0432\u043A\u0430\u043B\u0438\u043F\u0442. \u041E\u0447\u0435\u043D\u044C \u0441\u0432\u0435\u0436\u0438\u0435, \u0441\u0442\u043E\u044F\u0442 \u0432 \u0432\u043E\u0434\u0435." }) })
  ] }) });
}
function SellBlocked() {
  const footer = /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pd-footerbar", children: /* @__PURE__ */ jsxRuntime.jsx(chunkCMKDVS6C_cjs.PdBtn, { variant: "primary", block: true, lg: true, children: "\u041E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u0442\u044C \u0431\u0443\u043A\u0435\u0442" }) });
  return /* @__PURE__ */ jsxRuntime.jsx(chunkCMKDVS6C_cjs.PdScreen, { title: "\u041F\u0440\u043E\u0434\u0430\u0442\u044C \u0431\u0443\u043A\u0435\u0442", footer, children: /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { padding: "16px", display: "flex", flexDirection: "column", gap: 20 }, children: [
    /* @__PURE__ */ jsxRuntime.jsx(chunkCMKDVS6C_cjs.PdNotice, { kind: "warn", icon: chunkCMKDVS6C_cjs.I.shield, children: "\u041A\u043E\u043D\u0442\u0430\u043A\u0442\u044B \u0438\u0437 \u043E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u044F \u0443\u0431\u0438\u0440\u0430\u0435\u043C: \u043E\u0431\u0449\u0430\u0442\u044C\u0441\u044F \u0431\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u0435\u0435 \u0432\u043D\u0443\u0442\u0440\u0438 \u0441\u0434\u0435\u043B\u043A\u0438." }),
    /* @__PURE__ */ jsxRuntime.jsx(chunkCMKDVS6C_cjs.PdField, { label: "\u0426\u0435\u043D\u0430", children: /* @__PURE__ */ jsxRuntime.jsx(chunkCMKDVS6C_cjs.PdInput, { prefix: "\u20BD", value: "990" }) }),
    /* @__PURE__ */ jsxRuntime.jsx(chunkCMKDVS6C_cjs.PdField, { label: "\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435", error: "\u0412 \u0442\u0435\u043A\u0441\u0442\u0435 \u0435\u0441\u0442\u044C \u0437\u0430\u043F\u0440\u0435\u0449\u0451\u043D\u043D\u044B\u0435 \u0441\u043B\u043E\u0432\u0430 \u0438\u043B\u0438 \u043A\u043E\u043D\u0442\u0430\u043A\u0442\u044B. \u041F\u043E\u043F\u0440\u0430\u0432\u044C\u0442\u0435, \u043F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430.", counter: "38 / 600", children: /* @__PURE__ */ jsxRuntime.jsx(chunkCMKDVS6C_cjs.PdInput, { textarea: true, rows: 3, state: "invalid", value: "\u0421\u0432\u0435\u0436\u0438\u0439 \u0431\u0443\u043A\u0435\u0442, \u043F\u0438\u0448\u0438\u0442\u0435 \u043C\u043D\u0435 \u0432 \u0442\u0435\u043B\u0435\u0433\u0440\u0430\u043C @\u2022\u2022\u2022\u2022\u2022" }) }),
    /* @__PURE__ */ jsxRuntime.jsx("p", { style: { fontSize: 12.5, color: "var(--pd-muted)", marginTop: -6 }, children: "\u041C\u044B \u043D\u0435 \u043F\u043E\u0434\u0441\u0432\u0435\u0447\u0438\u0432\u0430\u0435\u043C \u043A\u043E\u043D\u043A\u0440\u0435\u0442\u043D\u043E\u0435 \u0441\u043B\u043E\u0432\u043E, \u0447\u0442\u043E\u0431\u044B \u043D\u0435 \u043F\u043E\u0434\u0441\u043A\u0430\u0437\u044B\u0432\u0430\u0442\u044C \u043E\u0431\u0445\u043E\u0434. \u0423\u0431\u0435\u0440\u0438\u0442\u0435 \u0442\u0435\u043B\u0435\u0444\u043E\u043D, \u043D\u0438\u043A \u0438\u043B\u0438 \u0441\u0441\u044B\u043B\u043A\u0443 \u0438 \u043F\u0443\u0431\u043B\u0438\u043A\u0443\u0439\u0442\u0435." })
  ] }) });
}
function SellPublished() {
  const footer = /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pd-footerbar", style: { display: "flex", gap: 10 }, children: [
    /* @__PURE__ */ jsxRuntime.jsx(chunkCMKDVS6C_cjs.PdBtn, { variant: "secondary", style: { flex: 1 }, children: "\u0412 \u043C\u043E\u0438 \u043E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u044F" }),
    /* @__PURE__ */ jsxRuntime.jsx(chunkCMKDVS6C_cjs.PdBtn, { variant: "primary", style: { flex: 1 }, children: "\u041A \u0431\u0443\u043A\u0435\u0442\u0443" })
  ] });
  return /* @__PURE__ */ jsxRuntime.jsxs(chunkCMKDVS6C_cjs.PdScreen, { title: "\u0413\u043E\u0442\u043E\u0432\u043E", center: true, footer, children: [
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pd-empty", style: { height: "auto", paddingTop: 48 }, children: [
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "glyph", style: { color: "var(--pd-fresh)" }, children: chunkCMKDVS6C_cjs.I.check({ className: "pd-i28", fill: "none", stroke: "currentColor" }) }),
      /* @__PURE__ */ jsxRuntime.jsx("h3", { children: "\u0411\u0443\u043A\u0435\u0442 \u043E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u043D" }),
      /* @__PURE__ */ jsxRuntime.jsx("p", { children: "\u0423\u0436\u0435 \u0432 \u043B\u0435\u043D\u0442\u0435 \u041C\u043E\u0441\u043A\u0432\u044B, \u043F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u0438 \u0440\u044F\u0434\u043E\u043C \u0432\u0438\u0434\u044F\u0442 \u0435\u0433\u043E \u043F\u0440\u044F\u043C\u043E \u0441\u0435\u0439\u0447\u0430\u0441. \u0421\u0432\u0435\u0436\u0435\u0441\u0442\u044C \u0442\u0430\u0435\u0442 \u0441\u043E \u0432\u0440\u0435\u043C\u0435\u043D\u0435\u043C, \u043F\u043E\u044D\u0442\u043E\u043C\u0443 \u0445\u043E\u0440\u043E\u0448\u0435\u0435 \u0444\u043E\u0442\u043E \u0438 \u0447\u0435\u0441\u0442\u043D\u0430\u044F \u0446\u0435\u043D\u0430 \u043F\u043E\u043C\u043E\u0433\u0430\u044E\u0442 \u043F\u0440\u043E\u0434\u0430\u0442\u044C \u0431\u044B\u0441\u0442\u0440\u0435\u0435." })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx("div", { style: { padding: "0 16px" }, children: /* @__PURE__ */ jsxRuntime.jsx(chunkCMKDVS6C_cjs.PdNotice, { kind: "info", icon: chunkCMKDVS6C_cjs.I.info, children: "\u0415\u0441\u043B\u0438 \u0441 \u0444\u043E\u0442\u043E \u0438\u043B\u0438 \u0442\u0435\u043A\u0441\u0442\u043E\u043C \u0447\u0442\u043E-\u0442\u043E \u043D\u0435 \u0442\u0430\u043A, \u043C\u044B \u043F\u0440\u043E\u0432\u0435\u0440\u0438\u043C \u043F\u043E \u0441\u0438\u0433\u043D\u0430\u043B\u0443 \u0438 \u043F\u043E\u0434\u0441\u043A\u0430\u0436\u0435\u043C. \u041E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u0435 \u043E\u0441\u0442\u0430\u0451\u0442\u0441\u044F \u0432 \u043B\u0435\u043D\u0442\u0435." }) })
  ] });
}
function SellRemoved() {
  const footer = /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pd-footerbar", style: { display: "flex", gap: 10 }, children: [
    /* @__PURE__ */ jsxRuntime.jsx(chunkCMKDVS6C_cjs.PdBtn, { variant: "ghost", style: { flex: 1 }, children: "\u041D\u0435 \u0441\u043E\u0433\u043B\u0430\u0441\u0435\u043D" }),
    /* @__PURE__ */ jsxRuntime.jsx(chunkCMKDVS6C_cjs.PdBtn, { variant: "primary", style: { flex: 1 }, children: "\u041E\u0442\u0440\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0438 \u0432\u0435\u0440\u043D\u0443\u0442\u044C" })
  ] });
  return /* @__PURE__ */ jsxRuntime.jsxs(chunkCMKDVS6C_cjs.PdScreen, { title: "\u041E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u0435", center: true, footer, children: [
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pd-empty", style: { height: "auto", paddingTop: 48 }, children: [
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "glyph", style: { color: "var(--pd-warn)" }, children: chunkCMKDVS6C_cjs.I.alert({ className: "pd-i28", fill: "none", stroke: "currentColor" }) }),
      /* @__PURE__ */ jsxRuntime.jsx("h3", { children: "\u041E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u0435 \u0441\u043D\u044F\u0442\u043E \u0441 \u043F\u0443\u0431\u043B\u0438\u043A\u0430\u0446\u0438\u0438" }),
      /* @__PURE__ */ jsxRuntime.jsx("p", { children: "\u041F\u043E\u0441\u043B\u0435 \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0438 \u043F\u043E \u0441\u0438\u0433\u043D\u0430\u043B\u0443 \u043C\u044B \u0441\u043A\u0440\u044B\u043B\u0438 \u044D\u0442\u043E \u043E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u0435 \u0438\u0437 \u043B\u0435\u043D\u0442\u044B. \u0412\u043E\u0437\u043C\u043E\u0436\u043D\u043E, \u043D\u0430 \u0444\u043E\u0442\u043E \u043F\u043E\u043F\u0430\u043B\u043E \u043B\u0438\u0446\u043E \u0438\u043B\u0438 \u0432 \u0442\u0435\u043A\u0441\u0442\u0435 \u043E\u043A\u0430\u0437\u0430\u043B\u0438\u0441\u044C \u043A\u043E\u043D\u0442\u0430\u043A\u0442\u044B. \u041F\u043E\u043F\u0440\u0430\u0432\u044C\u0442\u0435 \u0438 \u0432\u0435\u0440\u043D\u0438\u0442\u0435 \u0432 \u043B\u0435\u043D\u0442\u0443." })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx("div", { style: { padding: "0 16px" }, children: /* @__PURE__ */ jsxRuntime.jsx(chunkCMKDVS6C_cjs.PdNotice, { kind: "info", icon: chunkCMKDVS6C_cjs.I.info, children: "\u0421\u0447\u0438\u0442\u0430\u0435\u0442\u0435, \u0447\u0442\u043E \u044D\u0442\u043E \u043E\u0448\u0438\u0431\u043A\u0430? \u041D\u0430\u0436\u043C\u0438\u0442\u0435 \xAB\u041D\u0435 \u0441\u043E\u0433\u043B\u0430\u0441\u0435\u043D\xBB, \u0438 \u043C\u044B \u043E\u0442\u043F\u0440\u0430\u0432\u0438\u043C \u043E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u0435 \u043D\u0430 \u043F\u043E\u0432\u0442\u043E\u0440\u043D\u0443\u044E \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0443." }) })
  ] });
}
var Consent = ({ on }) => /* @__PURE__ */ jsxRuntime.jsxs("label", { className: `pd-check${on ? " on" : ""}`, children: [
  /* @__PURE__ */ jsxRuntime.jsx("span", { className: "box", children: on && chunkCMKDVS6C_cjs.I.check({ className: "pd-i16", fill: "none", stroke: "currentColor" }) }),
  /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "t", children: [
    "\u0421\u043E\u0433\u043B\u0430\u0448\u0430\u044E\u0441\u044C \u0441 ",
    /* @__PURE__ */ jsxRuntime.jsx("a", { children: "\u0443\u0441\u043B\u043E\u0432\u0438\u044F\u043C\u0438" }),
    " \u0438 ",
    /* @__PURE__ */ jsxRuntime.jsx("a", { children: "\u043F\u043E\u043B\u0438\u0442\u0438\u043A\u043E\u0439 \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u043A\u0438 \u043F\u0435\u0440\u0441\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0445 \u0434\u0430\u043D\u043D\u044B\u0445" }),
    " (\u0424\u0417-152)."
  ] })
] });
function LoginShell({ children, footer }) {
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pd-root", "data-pd-theme": "a", children: [
    /* @__PURE__ */ jsxRuntime.jsxs("header", { className: "pd-appbar pd-appbar--plain", style: { paddingTop: 56 }, children: [
      /* @__PURE__ */ jsxRuntime.jsx("button", { className: "pd-iconbtn", children: chunkCMKDVS6C_cjs.I.back({ className: "pd-i22", fill: "none", stroke: "currentColor" }) }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { style: { flex: 1 } })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx("main", { className: "pd-scroll", style: { padding: "8px 22px" }, children }),
    footer
  ] });
}
function LoginPhone() {
  const footer = /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pd-footerbar", children: /* @__PURE__ */ jsxRuntime.jsx(chunkCMKDVS6C_cjs.PdBtn, { variant: "primary", block: true, lg: true, children: "\u041F\u043E\u043B\u0443\u0447\u0438\u0442\u044C \u043A\u043E\u0434" }) });
  return /* @__PURE__ */ jsxRuntime.jsxs(LoginShell, { footer, children: [
    /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { textAlign: "center", margin: "10px 0 26px" }, children: [
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pd-brand", style: { fontSize: 30, marginBottom: 10 }, children: "\u041F\u0435\u0440\u0435\u0434\u0430\u0440\u0438\u043C" }),
      /* @__PURE__ */ jsxRuntime.jsxs("p", { style: { color: "var(--pd-muted)", fontSize: 14, lineHeight: 1.5 }, children: [
        "\u0421\u0432\u0435\u0436\u0438\u0435 \u0431\u0443\u043A\u0435\u0442\u044B \u0441\u043E \u0441\u043A\u0438\u0434\u043A\u043E\u0439",
        /* @__PURE__ */ jsxRuntime.jsx("br", {}),
        "\u0438 \u0432\u0442\u043E\u0440\u0430\u044F \u0436\u0438\u0437\u043D\u044C \u0434\u043B\u044F \u043F\u043E\u0434\u0430\u0440\u0435\u043D\u043D\u044B\u0445 \u0446\u0432\u0435\u0442\u043E\u0432."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 18 }, children: [
      /* @__PURE__ */ jsxRuntime.jsx(chunkCMKDVS6C_cjs.PdField, { label: "\u041D\u043E\u043C\u0435\u0440 \u0442\u0435\u043B\u0435\u0444\u043E\u043D\u0430", hint: "\u041F\u0440\u0438\u0448\u043B\u0451\u043C \u043A\u043E\u0434 \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u044F \u043F\u043E SMS.", children: /* @__PURE__ */ jsxRuntime.jsx(chunkCMKDVS6C_cjs.PdInput, { prefix: "+7", value: "999 124-58-03", state: "focus" }) }),
      /* @__PURE__ */ jsxRuntime.jsx(Consent, { on: true })
    ] })
  ] });
}
function OtpVerify() {
  const footer = /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pd-footerbar", children: /* @__PURE__ */ jsxRuntime.jsx(chunkCMKDVS6C_cjs.PdBtn, { variant: "primary", block: true, lg: true, children: "\u0412\u043E\u0439\u0442\u0438" }) });
  return /* @__PURE__ */ jsxRuntime.jsxs(LoginShell, { footer, children: [
    /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { textAlign: "center", margin: "16px 0 26px" }, children: [
      /* @__PURE__ */ jsxRuntime.jsx("h2", { style: { fontSize: 22, fontWeight: 700, marginBottom: 8 }, children: "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043A\u043E\u0434" }),
      /* @__PURE__ */ jsxRuntime.jsx("p", { style: { color: "var(--pd-muted)", fontSize: 14 }, children: "\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u043B\u0438 \u043D\u0430 +7 999 124-58-03" })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx(chunkCMKDVS6C_cjs.PdOtp, { value: "4127", cur: 4 }),
    /* @__PURE__ */ jsxRuntime.jsx("p", { style: { textAlign: "center", color: "var(--pd-muted)", fontSize: 13, marginTop: 20 }, children: "\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u043A\u043E\u0434 \u0441\u043D\u043E\u0432\u0430 \u0447\u0435\u0440\u0435\u0437 0:42" }),
    /* @__PURE__ */ jsxRuntime.jsx("p", { style: { textAlign: "center", marginTop: 8 }, children: /* @__PURE__ */ jsxRuntime.jsx("button", { className: "pd-link", children: "\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u043D\u043E\u043C\u0435\u0440" }) })
  ] });
}
function OtpLocked() {
  const footer = /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pd-footerbar", children: /* @__PURE__ */ jsxRuntime.jsx(chunkCMKDVS6C_cjs.PdBtn, { variant: "secondary", block: true, lg: true, disabled: true, children: "\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u044C \u0447\u0435\u0440\u0435\u0437 58:00" }) });
  return /* @__PURE__ */ jsxRuntime.jsxs(LoginShell, { footer, children: [
    /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { textAlign: "center", margin: "16px 0 24px" }, children: [
      /* @__PURE__ */ jsxRuntime.jsx("h2", { style: { fontSize: 22, fontWeight: 700, marginBottom: 8 }, children: "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043A\u043E\u0434" }),
      /* @__PURE__ */ jsxRuntime.jsx("p", { style: { color: "var(--pd-muted)", fontSize: 14 }, children: "\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u043B\u0438 \u043D\u0430 +7 999 124-58-03" })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx(chunkCMKDVS6C_cjs.PdOtp, { value: "0000", state: "locked" }),
    /* @__PURE__ */ jsxRuntime.jsx("div", { style: { marginTop: 20 }, children: /* @__PURE__ */ jsxRuntime.jsxs(chunkCMKDVS6C_cjs.PdNotice, { kind: "danger", icon: chunkCMKDVS6C_cjs.I.lock, children: [
      /* @__PURE__ */ jsxRuntime.jsx("b", { children: "\u0421\u043B\u0438\u0448\u043A\u043E\u043C \u043C\u043D\u043E\u0433\u043E \u043F\u043E\u043F\u044B\u0442\u043E\u043A." }),
      " \u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043A\u043E\u0434 \u043F\u043E\u0437\u0436\u0435, \u043F\u043E\u0432\u0442\u043E\u0440\u043D\u0430\u044F \u043E\u0442\u043F\u0440\u0430\u0432\u043A\u0430 \u0431\u0443\u0434\u0435\u0442 \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0430 \u0447\u0435\u0440\u0435\u0437 1 \u0447\u0430\u0441. \u0422\u0430\u043A \u043C\u044B \u0437\u0430\u0449\u0438\u0449\u0430\u0435\u043C \u0432\u0430\u0448 \u0430\u043A\u043A\u0430\u0443\u043D\u0442."
    ] }) })
  ] });
}

exports.LoginPhone = LoginPhone;
exports.OtpLocked = OtpLocked;
exports.OtpVerify = OtpVerify;
exports.SellBlocked = SellBlocked;
exports.SellForm = SellForm;
exports.SellPublished = SellPublished;
exports.SellRemoved = SellRemoved;
