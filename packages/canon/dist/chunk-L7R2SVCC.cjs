'use strict';

var chunkGT5S3QFQ_cjs = require('./chunk-GT5S3QFQ.cjs');
require('react');
var jsxRuntime = require('react/jsx-runtime');

var IMG3 = (id) => `img/${id}.jpg`;
var DealMini = ({ status }) => /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 11, padding: "12px 16px", borderBottom: "1px solid var(--pd-border)", background: "var(--pd-surface)" }, children: [
  /* @__PURE__ */ jsxRuntime.jsx("img", { src: IMG3("1561181286-d3fee7d55364"), alt: "", style: { width: 48, height: 48, borderRadius: 12, objectFit: "cover" } }),
  /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
    /* @__PURE__ */ jsxRuntime.jsx("div", { style: { fontWeight: 700, fontSize: 14 }, children: "\u0411\u0443\u043A\u0435\u0442 M \xB7 \u041F\u0430\u0442\u0440\u0438\u043A\u0438" }),
    /* @__PURE__ */ jsxRuntime.jsx("div", { style: { fontSize: 12.5, color: "var(--pd-muted)", marginTop: 2 }, children: "\u041F\u0440\u043E\u0434\u0430\u0432\u0435\u0446 \u0410\u043D\u044F \xB7 4,9 \u2605" })
  ] }),
  /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { textAlign: "right" }, children: [
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pd-price", style: { fontSize: 16 }, children: chunkGT5S3QFQ_cjs.pdMoney(990) }),
    /* @__PURE__ */ jsxRuntime.jsx("div", { style: { fontSize: 11, color: "var(--pd-muted)" }, children: status })
  ] })
] });
function ChatInput() {
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pd-chatinput", children: [
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pd-input", style: { flex: 1, padding: "9px 14px" }, children: /* @__PURE__ */ jsxRuntime.jsx("input", { placeholder: "\u0421\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435\u2026" }) }),
    /* @__PURE__ */ jsxRuntime.jsx("button", { className: "send", children: chunkGT5S3QFQ_cjs.I.send({ className: "pd-i20", fill: "none", stroke: "currentColor" }) })
  ] });
}
function DealActive() {
  const footer = /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pd-footerbar", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { display: "flex", gap: 10 }, children: [
    /* @__PURE__ */ jsxRuntime.jsx(chunkGT5S3QFQ_cjs.PdBtn, { variant: "secondary", icon: chunkGT5S3QFQ_cjs.I.alert, style: { flex: 1 }, children: "\u041F\u0440\u043E\u0431\u043B\u0435\u043C\u0430" }),
    /* @__PURE__ */ jsxRuntime.jsx(chunkGT5S3QFQ_cjs.PdBtn, { variant: "primary", icon: chunkGT5S3QFQ_cjs.I.check, style: { flex: 1.5 }, children: "\u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044C \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0435" })
  ] }) });
  return /* @__PURE__ */ jsxRuntime.jsxs(chunkGT5S3QFQ_cjs.PdScreen, { title: "\u0421\u0434\u0435\u043B\u043A\u0430", center: true, footer, children: [
    /* @__PURE__ */ jsxRuntime.jsx("div", { style: { padding: "14px 16px 4px" }, children: /* @__PURE__ */ jsxRuntime.jsx(chunkGT5S3QFQ_cjs.PdStepper, { status: "meeting" }) }),
    /* @__PURE__ */ jsxRuntime.jsx(DealMini, { status: "\u0434\u043E\u0433\u043E\u0432\u043E\u0440\u0438\u043B\u0438\u0441\u044C" }),
    /* @__PURE__ */ jsxRuntime.jsx("div", { style: { padding: "14px 16px" }, children: /* @__PURE__ */ jsxRuntime.jsxs(chunkGT5S3QFQ_cjs.PdNotice, { kind: "ok", icon: chunkGT5S3QFQ_cjs.I.shield, children: [
      /* @__PURE__ */ jsxRuntime.jsx("b", { children: "\u041E\u043F\u043B\u0430\u0442\u0430 \u043F\u0440\u0438 \u0432\u0441\u0442\u0440\u0435\u0447\u0435." }),
      " \u0414\u043E\u0433\u043E\u0432\u043E\u0440\u0438\u0442\u0435\u0441\u044C \u043E \u0432\u0440\u0435\u043C\u0435\u043D\u0438, \u0437\u0430\u0431\u0435\u0440\u0438\u0442\u0435 \u0431\u0443\u043A\u0435\u0442 \u0438 \u0440\u0430\u0441\u043F\u043B\u0430\u0442\u0438\u0442\u0435\u0441\u044C \u043D\u0430 \u043C\u0435\u0441\u0442\u0435 \u2014 \u043D\u0430\u043B\u0438\u0447\u043D\u044B\u043C\u0438 \u0438\u043B\u0438 \u043F\u0435\u0440\u0435\u0432\u043E\u0434\u043E\u043C \u043F\u0440\u043E\u0434\u0430\u0432\u0446\u0443."
    ] }) }),
    /* @__PURE__ */ jsxRuntime.jsx("div", { style: { padding: "0 16px" }, children: /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", border: "1px solid var(--pd-border)", borderRadius: 13 }, children: [
      chunkGT5S3QFQ_cjs.I.walk({ className: "pd-i20", fill: "none", stroke: "var(--pd-primary)" }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { flex: 1 }, children: [
        /* @__PURE__ */ jsxRuntime.jsx("div", { style: { fontWeight: 600, fontSize: 13.5 }, children: "\u0421\u0430\u043C\u043E\u0432\u044B\u0432\u043E\u0437 \xB7 \u043C. \u041C\u0430\u044F\u043A\u043E\u0432\u0441\u043A\u0430\u044F" }),
        /* @__PURE__ */ jsxRuntime.jsx("div", { style: { fontSize: 12, color: "var(--pd-muted)" }, children: "\u0414\u0432\u043E\u0440, \u0422\u0432\u0435\u0440\u0441\u043A\u0430\u044F 12, \u043F\u043E\u044F\u0432\u0438\u043B\u0441\u044F \u043F\u043E\u0441\u043B\u0435 \u0434\u043E\u0433\u043E\u0432\u043E\u0440\u0451\u043D\u043D\u043E\u0441\u0442\u0438" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pd-chat", children: [
      /* @__PURE__ */ jsxRuntime.jsx(chunkGT5S3QFQ_cjs.PdBubble, { kind: "sys", children: "\u0427\u0430\u0442 \u0441\u0434\u0435\u043B\u043A\u0438 \u043E\u0442\u043A\u0440\u044B\u0442 \xB7 \u0434\u043E\u0433\u043E\u0432\u043E\u0440\u0438\u0442\u0435\u0441\u044C \u043E \u0432\u0441\u0442\u0440\u0435\u0447\u0435" }),
      /* @__PURE__ */ jsxRuntime.jsx(chunkGT5S3QFQ_cjs.PdBubble, { kind: "in", time: "17:58", children: "\u0417\u0434\u0440\u0430\u0432\u0441\u0442\u0432\u0443\u0439\u0442\u0435! \u041C\u043E\u0436\u043D\u043E \u0437\u0430\u0431\u0440\u0430\u0442\u044C \u0441\u0435\u0433\u043E\u0434\u043D\u044F \u043F\u043E\u0441\u043B\u0435 18:00 \u{1F338}" }),
      /* @__PURE__ */ jsxRuntime.jsx(chunkGT5S3QFQ_cjs.PdBubble, { kind: "out", time: "18:01", children: "\u041E\u0442\u043B\u0438\u0447\u043D\u043E, \u0431\u0443\u0434\u0443 \u043A 18:30" }),
      /* @__PURE__ */ jsxRuntime.jsx(chunkGT5S3QFQ_cjs.PdBubble, { kind: "in", time: "18:02", children: "\u0414\u0432\u043E\u0440 \u0434\u043E\u043C\u0430 \u043F\u043E \u0422\u0432\u0435\u0440\u0441\u043A\u043E\u0439, 12. \u041D\u0430\u043F\u0438\u0448\u0443, \u043A\u0430\u043A \u0432\u044B\u0439\u0434\u0443" })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx(ChatInput, {})
  ] });
}
function DealProblem() {
  const footer = /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pd-footerbar", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { display: "flex", gap: 10 }, children: [
    /* @__PURE__ */ jsxRuntime.jsx(chunkGT5S3QFQ_cjs.PdBtn, { variant: "secondary", style: { flex: 1 }, children: "\u041E\u0442\u043E\u0437\u0432\u0430\u0442\u044C \u043E\u0431\u0440\u0430\u0449\u0435\u043D\u0438\u0435" }),
    /* @__PURE__ */ jsxRuntime.jsx(chunkGT5S3QFQ_cjs.PdBtn, { variant: "primary", icon: chunkGT5S3QFQ_cjs.I.image, style: { flex: 1 }, children: "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0444\u043E\u0442\u043E" })
  ] }) });
  return /* @__PURE__ */ jsxRuntime.jsxs(chunkGT5S3QFQ_cjs.PdScreen, { title: "\u041F\u0440\u043E\u0431\u043B\u0435\u043C\u0430 \u043F\u043E \u0441\u0434\u0435\u043B\u043A\u0435", center: true, footer, children: [
    /* @__PURE__ */ jsxRuntime.jsx("div", { style: { padding: "14px 16px 4px" }, children: /* @__PURE__ */ jsxRuntime.jsx(chunkGT5S3QFQ_cjs.PdStepper, { status: "problem" }) }),
    /* @__PURE__ */ jsxRuntime.jsx(DealMini, { status: "\u043D\u0430 \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0435" }),
    /* @__PURE__ */ jsxRuntime.jsx("div", { style: { padding: "14px 16px" }, children: /* @__PURE__ */ jsxRuntime.jsxs(chunkGT5S3QFQ_cjs.PdNotice, { kind: "warn", icon: chunkGT5S3QFQ_cjs.I.clock, children: [
      /* @__PURE__ */ jsxRuntime.jsx("b", { children: "\u041D\u0430 \u0440\u0430\u0441\u0441\u043C\u043E\u0442\u0440\u0435\u043D\u0438\u0438." }),
      " \u041F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0430 \u0438\u0437\u0443\u0447\u0438\u0442 \u043E\u0431\u0440\u0430\u0449\u0435\u043D\u0438\u0435 \u0438 \u043E\u0442\u0432\u0435\u0442\u0438\u0442 \u0432 \u0442\u0435\u0447\u0435\u043D\u0438\u0435 24 \u0447\u0430\u0441\u043E\u0432, \u043E\u0441\u0442\u0430\u043B\u043E\u0441\u044C ~21 \u0447."
    ] }) }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pd-chat", children: [
      /* @__PURE__ */ jsxRuntime.jsx(chunkGT5S3QFQ_cjs.PdBubble, { kind: "sys", children: "\u041E\u0442\u043A\u0440\u044B\u0442\u043E \u043E\u0431\u0440\u0430\u0449\u0435\u043D\u0438\u0435 \xB7 12 \u0438\u044E\u043D\u044F, 14:20 \xB7 \u043F\u0440\u0438\u0447\u0438\u043D\u0430: \xAB\u043D\u0435 \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0443\u0435\u0442\xBB" }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { alignSelf: "flex-end", maxWidth: "78%" }, children: [
        /* @__PURE__ */ jsxRuntime.jsx("img", { src: IMG3("1583228858294-6745cb25969e"), alt: "", style: { width: 140, borderRadius: 14, display: "block", marginBottom: 4, marginLeft: "auto" } }),
        /* @__PURE__ */ jsxRuntime.jsx(chunkGT5S3QFQ_cjs.PdBubble, { kind: "out", time: "14:21", children: "\u0411\u0443\u043A\u0435\u0442 \u0437\u0430\u0432\u044F\u043B \u043A \u0432\u0435\u0447\u0435\u0440\u0443, \u043B\u0435\u043F\u0435\u0441\u0442\u043A\u0438 \u043E\u0441\u044B\u043F\u0430\u043B\u0438\u0441\u044C" })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx(chunkGT5S3QFQ_cjs.PdBubble, { kind: "sys", children: "\u041F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0430 \xAB\u041F\u0435\u0440\u0435\u0434\u0430\u0440\u0438\u043C\xBB \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0438\u043B\u0430\u0441\u044C" }),
      /* @__PURE__ */ jsxRuntime.jsxs(chunkGT5S3QFQ_cjs.PdBubble, { kind: "in", time: "14:35", children: [
        /* @__PURE__ */ jsxRuntime.jsx("b", { style: { color: "var(--pd-primary)" }, children: "\u041F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0430" }),
        /* @__PURE__ */ jsxRuntime.jsx("br", {}),
        "\u0417\u0434\u0440\u0430\u0432\u0441\u0442\u0432\u0443\u0439\u0442\u0435! \u0418\u0437\u0443\u0447\u0430\u0435\u043C \u0444\u043E\u0442\u043E. \u041E\u0442\u0432\u0435\u0442\u0438\u043C \u0441 \u0440\u0435\u0448\u0435\u043D\u0438\u0435\u043C \u0432 \u0442\u0435\u0447\u0435\u043D\u0438\u0435 24 \u0447\u0430\u0441\u043E\u0432."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx(ChatInput, {})
  ] });
}
function DealDone() {
  const footer = /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pd-footerbar", children: /* @__PURE__ */ jsxRuntime.jsx(chunkGT5S3QFQ_cjs.PdBtn, { variant: "primary", block: true, lg: true, icon: chunkGT5S3QFQ_cjs.Ic.star, children: "\u041E\u0446\u0435\u043D\u0438\u0442\u044C \u043F\u0440\u043E\u0434\u0430\u0432\u0446\u0430" }) });
  return /* @__PURE__ */ jsxRuntime.jsxs(chunkGT5S3QFQ_cjs.PdScreen, { title: "\u0421\u0434\u0435\u043B\u043A\u0430", center: true, footer, children: [
    /* @__PURE__ */ jsxRuntime.jsx("div", { style: { padding: "14px 16px 4px" }, children: /* @__PURE__ */ jsxRuntime.jsx(chunkGT5S3QFQ_cjs.PdStepper, { status: "done" }) }),
    /* @__PURE__ */ jsxRuntime.jsx(DealMini, { status: "\u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043E" }),
    /* @__PURE__ */ jsxRuntime.jsx("div", { style: { padding: "16px" }, children: /* @__PURE__ */ jsxRuntime.jsxs(chunkGT5S3QFQ_cjs.PdNotice, { kind: "ok", icon: chunkGT5S3QFQ_cjs.I.check, children: [
      /* @__PURE__ */ jsxRuntime.jsx("b", { children: "\u0413\u043E\u0442\u043E\u0432\u043E!" }),
      " \u0412\u044B \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u043B\u0438 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0435 \u0431\u0443\u043A\u0435\u0442\u0430. \u0420\u0430\u0441\u0441\u043A\u0430\u0436\u0438\u0442\u0435, \u043A\u0430\u043A \u0432\u0441\u0451 \u043F\u0440\u043E\u0448\u043B\u043E \u2014 \u044D\u0442\u043E \u043F\u043E\u043C\u043E\u0436\u0435\u0442 \u0434\u0440\u0443\u0433\u0438\u043C \u043F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u044F\u043C."
    ] }) }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pd-empty", style: { height: "auto", padding: "10px 30px 24px" }, children: [
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "glyph", style: { color: "var(--pd-like)" }, children: chunkGT5S3QFQ_cjs.I.heartline({ className: "pd-i28", fill: "var(--pd-like)", stroke: "var(--pd-like)" }) }),
      /* @__PURE__ */ jsxRuntime.jsx("h3", { children: "\u041A\u0430\u043A \u0432\u0441\u0451 \u043F\u0440\u043E\u0448\u043B\u043E?" }),
      /* @__PURE__ */ jsxRuntime.jsx("p", { children: "\u041E\u0441\u0442\u0430\u0432\u044C\u0442\u0435 \u043E\u0442\u0437\u044B\u0432, \u044D\u0442\u043E \u043F\u043E\u043C\u043E\u0433\u0430\u0435\u0442 \u0434\u0440\u0443\u0433\u0438\u043C \u043F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u044F\u043C \u0438 \u043F\u043E\u0434\u043D\u0438\u043C\u0430\u0435\u0442 \u043F\u0440\u043E\u0434\u0430\u0432\u0446\u0430 \u0432 \u043B\u0435\u043D\u0442\u0435." })
    ] })
  ] });
}
function PaymentFailed() {
  const footer = /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pd-footerbar", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { display: "flex", gap: 10 }, children: [
    /* @__PURE__ */ jsxRuntime.jsx(chunkGT5S3QFQ_cjs.PdBtn, { variant: "secondary", style: { flex: 1 }, children: "\u0421\u043C\u0435\u043D\u0438\u0442\u044C \u0441\u043F\u043E\u0441\u043E\u0431" }),
    /* @__PURE__ */ jsxRuntime.jsx(chunkGT5S3QFQ_cjs.PdBtn, { variant: "primary", icon: chunkGT5S3QFQ_cjs.I.refresh, style: { flex: 1 }, children: "\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u044C \u043E\u043F\u043B\u0430\u0442\u0443" })
  ] }) });
  return /* @__PURE__ */ jsxRuntime.jsxs(chunkGT5S3QFQ_cjs.PdScreen, { title: "\u041E\u043F\u043B\u0430\u0442\u0430", center: true, footer, children: [
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pd-empty", style: { height: "auto", paddingTop: 54 }, children: [
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "glyph", style: { color: "var(--pd-danger)", background: "var(--pd-danger-soft)" }, children: chunkGT5S3QFQ_cjs.I.alert({ className: "pd-i28", fill: "none", stroke: "currentColor" }) }),
      /* @__PURE__ */ jsxRuntime.jsx("h3", { children: "\u041E\u043F\u043B\u0430\u0442\u0430 \u043F\u0440\u0438 \u0432\u0441\u0442\u0440\u0435\u0447\u0435" }),
      /* @__PURE__ */ jsxRuntime.jsx("p", { children: "\u0414\u043E\u0433\u043E\u0432\u043E\u0440\u0438\u0442\u0435\u0441\u044C \u0441 \u043F\u0440\u043E\u0434\u0430\u0432\u0446\u043E\u043C \u0432 \u0447\u0430\u0442\u0435 \u0438 \u0437\u0430\u0431\u0435\u0440\u0438\u0442\u0435 \u0431\u0443\u043A\u0435\u0442 \u0440\u044F\u0434\u043E\u043C \u2014 \u043E\u043F\u043B\u0430\u0442\u0430 \u043F\u0440\u0438 \u0432\u0441\u0442\u0440\u0435\u0447\u0435, \u043A\u043E\u0433\u0434\u0430 \u0443\u0432\u0438\u0434\u0435\u043B\u0438 \u0446\u0432\u0435\u0442\u044B." })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { padding: "4px 16px" }, children: [
      /* @__PURE__ */ jsxRuntime.jsx(chunkGT5S3QFQ_cjs.PdNotice, { kind: "ok", icon: chunkGT5S3QFQ_cjs.I.shield, children: "\u041F\u043B\u0430\u0442\u0438\u0442\u0435 \u043F\u0440\u043E\u0434\u0430\u0432\u0446\u0443 \u043D\u0430 \u043C\u0435\u0441\u0442\u0435 \u2014 \u043D\u0430\u043B\u0438\u0447\u043D\u044B\u043C\u0438 \u0438\u043B\u0438 \u043F\u0435\u0440\u0435\u0432\u043E\u0434\u043E\u043C. \u041F\u043B\u043E\u0449\u0430\u0434\u043A\u0430 \u0434\u0435\u043D\u044C\u0433\u0438 \u043D\u0435 \u0434\u0435\u0440\u0436\u0438\u0442." }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { style: { marginTop: 12 }, children: /* @__PURE__ */ jsxRuntime.jsx(chunkGT5S3QFQ_cjs.PdInput, { icon: chunkGT5S3QFQ_cjs.I.wallet, value: "\u041A\u0430\u0440\u0442\u0430 \u2022\u2022\u2022\u2022 4416" }) })
    ] })
  ] });
}
function ReviewForm() {
  const footer = /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pd-footerbar", children: /* @__PURE__ */ jsxRuntime.jsx(chunkGT5S3QFQ_cjs.PdBtn, { variant: "primary", block: true, lg: true, children: "\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u043E\u0442\u0437\u044B\u0432" }) });
  return /* @__PURE__ */ jsxRuntime.jsxs(chunkGT5S3QFQ_cjs.PdScreen, { title: "\u041E\u0442\u0437\u044B\u0432", center: true, footer, children: [
    /* @__PURE__ */ jsxRuntime.jsx(DealMini, { status: "\u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043E" }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { padding: "22px 16px", display: "flex", flexDirection: "column", gap: 22 }, children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { textAlign: "center" }, children: [
        /* @__PURE__ */ jsxRuntime.jsx(chunkGT5S3QFQ_cjs.Avatar, { seller: { n: "\u0410\u043D\u044F", av: "w1" }, size: 56 }),
        /* @__PURE__ */ jsxRuntime.jsx("div", { style: { fontWeight: 700, fontSize: 17, marginTop: 8 }, children: "\u041E\u0446\u0435\u043D\u0438\u0442\u0435 \u0410\u043D\u044E" }),
        /* @__PURE__ */ jsxRuntime.jsx("div", { style: { marginTop: 12, display: "flex", justifyContent: "center" }, children: /* @__PURE__ */ jsxRuntime.jsx(chunkGT5S3QFQ_cjs.PdStars, { value: 4, input: true }) })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx(chunkGT5S3QFQ_cjs.PdField, { label: "\u041E\u0442\u0437\u044B\u0432", opt: "\u043D\u0435\u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E", counter: "0 / 500", children: /* @__PURE__ */ jsxRuntime.jsx(chunkGT5S3QFQ_cjs.PdInput, { textarea: true, rows: 4, placeholder: "\u0421\u0432\u0435\u0436\u0438\u0439 \u043B\u0438 \u0431\u044B\u043B \u0431\u0443\u043A\u0435\u0442? \u041A\u0430\u043A \u043F\u0440\u043E\u0448\u043B\u0430 \u0432\u0441\u0442\u0440\u0435\u0447\u0430?" }) }),
      /* @__PURE__ */ jsxRuntime.jsx(chunkGT5S3QFQ_cjs.PdNotice, { kind: "info", icon: chunkGT5S3QFQ_cjs.I.info, children: "\u041A\u043E\u043D\u0442\u0430\u043A\u0442\u044B \u0438 \u0433\u0440\u0443\u0431\u044B\u0435 \u0441\u043B\u043E\u0432\u0430 \u0432 \u043E\u0442\u0437\u044B\u0432\u0435 \u043D\u0435 \u043F\u0440\u043E\u043F\u0443\u0441\u0442\u0438\u043C, \u044D\u0442\u043E \u043F\u0443\u0431\u043B\u0438\u0447\u043D\u044B\u0439 \u0442\u0435\u043A\u0441\u0442." })
    ] })
  ] });
}
var NOTIFS = [
  { ic: chunkGT5S3QFQ_cjs.I.check, unread: true, t: "\u0421\u0434\u0435\u043B\u043A\u0430 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0430", s: "\xAB\u0411\u0443\u043A\u0435\u0442 M \xB7 \u041F\u0430\u0442\u0440\u0438\u043A\u0438\xBB \xB7 \u043F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u044C \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u043B \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0435", tm: "5 \u043C\u0438\u043D" },
  { ic: chunkGT5S3QFQ_cjs.I.heartline, unread: true, t: "\u0412\u0430\u0448 \u0431\u0443\u043A\u0435\u0442 \u0437\u0430\u043B\u0430\u0439\u043A\u0430\u043B\u0438", s: "\u0423\u0436\u0435 47 \u043B\u0430\u0439\u043A\u043E\u0432, \u043E\u043D \u0432 \u0442\u043E\u043F\u0435 \xAB\u0421\u0430\u043C\u044B\u0435 \u0437\u0430\u043B\u0430\u0439\u043A\u0430\u043D\u043D\u044B\u0435\xBB", tm: "1 \u0447" },
  { ic: chunkGT5S3QFQ_cjs.I.shield, unread: false, t: "\u041E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u0435 \u043F\u0440\u043E\u0448\u043B\u043E \u043C\u043E\u0434\u0435\u0440\u0430\u0446\u0438\u044E", s: "\xAB\u041F\u0438\u043E\u043D\u043E\u0432\u0438\u0434\u043D\u044B\u0435 \u0440\u043E\u0437\u044B\xBB \u043E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u043D\u043E \u0432 \u043B\u0435\u043D\u0442\u0435 \u041C\u043E\u0441\u043A\u0432\u044B", tm: "3 \u0447" },
  { ic: chunkGT5S3QFQ_cjs.Ic.star, unread: false, t: "\u041D\u043E\u0432\u044B\u0439 \u043E\u0442\u0437\u044B\u0432 \u043E\u0442 \u041C\u0430\u0440\u0438\u043D\u044B", s: "\xAB\u0411\u0443\u043A\u0435\u0442 \u0431\u044B\u043B \u0441\u0432\u0435\u0436\u0438\u0439, \u043A\u0430\u043A \u043D\u0430 \u0444\u043E\u0442\u043E\xBB \xB7 5 \u2605", tm: "\u0432\u0447\u0435\u0440\u0430" }
];
function Notifications() {
  return /* @__PURE__ */ jsxRuntime.jsx(chunkGT5S3QFQ_cjs.PdScreen, { title: "\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F", back: false, children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pd-list", children: NOTIFS.map((n, i) => /* @__PURE__ */ jsxRuntime.jsxs("div", { className: `pd-row${n.unread ? " unread" : ""}`, children: [
    /* @__PURE__ */ jsxRuntime.jsx("span", { className: "ring", children: n.ic({ className: "pd-i20", fill: "none", stroke: "currentColor" }) }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "mid", children: [
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "ttl", children: n.t }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "sub", children: n.s })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }, children: [
      /* @__PURE__ */ jsxRuntime.jsx("span", { className: "tm", children: n.tm }),
      n.unread && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "udot" })
    ] })
  ] }, i)) }) });
}
function NotificationsEmpty() {
  return /* @__PURE__ */ jsxRuntime.jsx(chunkGT5S3QFQ_cjs.PdScreen, { title: "\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F", back: false, children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pd-empty", children: [
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "glyph", children: chunkGT5S3QFQ_cjs.I.bell({ className: "pd-i28", fill: "none", stroke: "currentColor" }) }),
    /* @__PURE__ */ jsxRuntime.jsx("h3", { children: "\u041F\u043E\u043A\u0430 \u0442\u0438\u0445\u043E" }),
    /* @__PURE__ */ jsxRuntime.jsx("p", { children: "\u0417\u0434\u0435\u0441\u044C \u043F\u043E\u044F\u0432\u044F\u0442\u0441\u044F \u0441\u0442\u0430\u0442\u0443\u0441\u044B \u0441\u0434\u0435\u043B\u043E\u043A, \u043B\u0430\u0439\u043A\u0438 \u0432\u0430\u0448\u0438\u0445 \u0431\u0443\u043A\u0435\u0442\u043E\u0432 \u0438 \u043D\u043E\u0432\u044B\u0435 \u043E\u0442\u0437\u044B\u0432\u044B." })
  ] }) });
}
function Offline() {
  const banner = /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pd-offline", children: [
    chunkGT5S3QFQ_cjs.I.refresh({ className: "pd-i16", fill: "none", stroke: "currentColor" }),
    "\u041D\u0435\u0442 \u0441\u043E\u0435\u0434\u0438\u043D\u0435\u043D\u0438\u044F",
    /* @__PURE__ */ jsxRuntime.jsx("button", { className: "retry", children: "\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u044C" })
  ] });
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pd-root", "data-pd-theme": "a", children: [
    banner,
    /* @__PURE__ */ jsxRuntime.jsx("header", { className: "pd-appbar", children: /* @__PURE__ */ jsxRuntime.jsx("span", { className: "pd-brand", children: "\u041F\u0435\u0440\u0435\u0434\u0430\u0440\u0438\u043C" }) }),
    /* @__PURE__ */ jsxRuntime.jsx("main", { className: "pd-scroll", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pd-empty", children: [
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "glyph", children: chunkGT5S3QFQ_cjs.I.refresh({ className: "pd-i28", fill: "none", stroke: "currentColor" }) }),
      /* @__PURE__ */ jsxRuntime.jsx("h3", { children: "\u041D\u0435\u0442 \u0438\u043D\u0442\u0435\u0440\u043D\u0435\u0442\u0430" }),
      /* @__PURE__ */ jsxRuntime.jsx("p", { children: "\u041D\u0435 \u043F\u043E\u043B\u0443\u0447\u0438\u043B\u043E\u0441\u044C \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u043B\u0435\u043D\u0442\u0443. \u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u0441\u043E\u0435\u0434\u0438\u043D\u0435\u043D\u0438\u0435, \u043C\u044B \u043E\u0431\u043D\u043E\u0432\u0438\u043C \u0432\u0441\u0451 \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438, \u043A\u0430\u043A \u0442\u043E\u043B\u044C\u043A\u043E \u0441\u0435\u0442\u044C \u0432\u0435\u0440\u043D\u0451\u0442\u0441\u044F." }),
      /* @__PURE__ */ jsxRuntime.jsx(chunkGT5S3QFQ_cjs.PdBtn, { variant: "primary", block: true, icon: chunkGT5S3QFQ_cjs.I.refresh, children: "\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u044C" })
    ] }) })
  ] });
}
var wic = (Fn, cls = "pd-i18") => Fn({ className: cls, fill: "none", stroke: "currentColor" });
function WebShell({ active, children }) {
  const Bell = (p) => /* @__PURE__ */ jsxRuntime.jsxs("svg", { viewBox: "0 0 24 24", ...p, children: [
    /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" }),
    /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M10 19a2 2 0 0 0 4 0" })
  ] });
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pd-root pd-web", "data-pd-theme": "a", children: [
    /* @__PURE__ */ jsxRuntime.jsx("header", { className: "pdw-nav", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdw-nav-in", children: [
      /* @__PURE__ */ jsxRuntime.jsx("span", { className: "pd-brand pdw-brand", children: "\u041F\u0435\u0440\u0435\u0434\u0430\u0440\u0438\u043C" }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdw-navmid", children: [
        /* @__PURE__ */ jsxRuntime.jsxs("button", { className: "pd-city pdw-city", children: [
          wic(chunkGT5S3QFQ_cjs.Ic.pin, "pd-i16"),
          "\u041C\u043E\u0441\u043A\u0432\u0430",
          wic(chunkGT5S3QFQ_cjs.Ic.chev, "pd-i14")
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pd-search pdw-search", children: [
          wic(chunkGT5S3QFQ_cjs.Ic.search, "pd-i18"),
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "pd-search-ph", children: "\u041F\u043E\u0438\u0441\u043A \u0441\u0432\u0435\u0436\u0438\u0445 \u0431\u0443\u043A\u0435\u0442\u043E\u0432 \u0432 \u041C\u043E\u0441\u043A\u0432\u0435" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("nav", { className: "pdw-navright", children: [
        /* @__PURE__ */ jsxRuntime.jsx("button", { className: "pdw-iconbtn", children: wic(Bell, "pd-i20") }),
        /* @__PURE__ */ jsxRuntime.jsx("button", { className: "pdw-iconbtn", children: wic(chunkGT5S3QFQ_cjs.Ic.deals, "pd-i20") }),
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "pdw-avatar", children: "\u041C" }),
        /* @__PURE__ */ jsxRuntime.jsxs("button", { className: "pdw-cta", children: [
          wic(chunkGT5S3QFQ_cjs.Ic.plus, "pd-i18"),
          "\u041F\u0440\u043E\u0434\u0430\u0442\u044C \u0431\u0443\u043A\u0435\u0442"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntime.jsx("main", { className: "pd-scroll pdw-scroll", children })
  ] });
}
var Back = ({ children }) => /* @__PURE__ */ jsxRuntime.jsxs("button", { className: "pdw-back", children: [
  wic(chunkGT5S3QFQ_cjs.I.back, "pd-i16"),
  children
] });
function ListingDesktop() {
  const ph = ["1561181286-d3fee7d55364", "1567418938902-aa650a3eb346", "1581938165093-050aeb5ef218"];
  return /* @__PURE__ */ jsxRuntime.jsx(WebShell, { children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdw-detailwrap", children: [
    /* @__PURE__ */ jsxRuntime.jsx(Back, { children: "\u0421\u0432\u0435\u0436\u0438\u0435 \u0431\u0443\u043A\u0435\u0442\u044B \u041C\u043E\u0441\u043A\u0432\u044B" }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdw-2col", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdw-gallery", children: [
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "hero", children: /* @__PURE__ */ jsxRuntime.jsx("img", { src: `img/${ph[0]}.jpg`, alt: "" }) }),
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pdw-thumbs", children: ph.map((p, i) => /* @__PURE__ */ jsxRuntime.jsx("div", { className: `t${i === 0 ? " on" : ""}`, children: /* @__PURE__ */ jsxRuntime.jsx("img", { src: `img/${p}.jpg`, alt: "" }) }, p)) }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdw-card", style: { marginTop: 8 }, children: [
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pd-label", style: { marginBottom: 8 }, children: "\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435" }),
          /* @__PURE__ */ jsxRuntime.jsx("p", { style: { fontSize: 14.5, lineHeight: 1.6 }, children: "\u041F\u043E\u0434\u0430\u0440\u0438\u043B\u0438 \u0443\u0442\u0440\u043E\u043C \u043D\u0430 \u0434\u0435\u043D\u044C \u0440\u043E\u0436\u0434\u0435\u043D\u0438\u044F: \u043F\u0438\u043E\u043D\u043E\u0432\u0438\u0434\u043D\u044B\u0435 \u0440\u043E\u0437\u044B \u0438 \u044D\u0432\u043A\u0430\u043B\u0438\u043F\u0442, \u043E\u0447\u0435\u043D\u044C \u0441\u0432\u0435\u0436\u0438\u0435, \u0441\u0442\u043E\u044F\u0442 \u0432 \u0432\u043E\u0434\u0435. \u041E\u0442\u0434\u0430\u044E \u043D\u0435\u0434\u043E\u0440\u043E\u0433\u043E, \u0436\u0430\u043B\u043A\u043E \u0432\u044B\u0431\u0440\u0430\u0441\u044B\u0432\u0430\u0442\u044C. \u0417\u0430\u0431\u0435\u0440\u0438\u0442\u0435 \u0441\u0435\u0433\u043E\u0434\u043D\u044F \u{1F33F}" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdw-buy", children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between" }, children: [
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "price", children: chunkGT5S3QFQ_cjs.pdMoney(990) }),
          /* @__PURE__ */ jsxRuntime.jsx(chunkGT5S3QFQ_cjs.LikeBtn, { liked: true, count: 47 })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pd-chiprow", style: { margin: "14px 0" }, children: [
          /* @__PURE__ */ jsxRuntime.jsx(chunkGT5S3QFQ_cjs.Freshness, { kind: "today" }),
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "pd-chip", style: { pointerEvents: "none" }, children: "\u0420\u0430\u0437\u043C\u0435\u0440 M \xB7 7\u201315 \u0448\u0442." })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 5, color: "var(--pd-muted)", fontSize: 13.5 }, children: [
          wic(chunkGT5S3QFQ_cjs.Ic.pin, "pd-i16"),
          "\u041C\u043E\u0441\u043A\u0432\u0430 \xB7 \u041F\u0430\u0442\u0440\u0438\u043A\u0438"
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdw-sellerrow", children: [
          /* @__PURE__ */ jsxRuntime.jsx(chunkGT5S3QFQ_cjs.Avatar, { seller: { n: "\u0410\u043D\u044F", av: "w1" }, size: 44 }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { flex: 1 }, children: [
            /* @__PURE__ */ jsxRuntime.jsx("div", { style: { fontWeight: 700 }, children: "\u0410\u043D\u044F" }),
            /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 5, color: "var(--pd-muted)", fontSize: 12.5, marginTop: 2 }, children: [
              /* @__PURE__ */ jsxRuntime.jsx(chunkGT5S3QFQ_cjs.PdStars, { value: 5 }),
              "4,9 \xB7 23 \u0441\u0434\u0435\u043B\u043A\u0438"
            ] })
          ] }),
          wic(chunkGT5S3QFQ_cjs.I.fwd, "pd-i18")
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pd-label", style: { marginBottom: 8 }, children: "\u041A\u0430\u043A \u0437\u0430\u0431\u0440\u0430\u0442\u044C" }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 11, padding: "13px 14px", border: "1px solid var(--pd-border)", borderRadius: 14 }, children: [
          /* @__PURE__ */ jsxRuntime.jsxs("svg", { viewBox: "0 0 24 24", width: "20", height: "20", fill: "none", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round", strokeLinejoin: "round", style: { color: "var(--pd-primary)", flex: "none" }, children: [
            /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z" }),
            /* @__PURE__ */ jsxRuntime.jsx("circle", { cx: "12", cy: "10", r: "2.5" })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { flex: 1 }, children: [
            /* @__PURE__ */ jsxRuntime.jsx("div", { style: { fontWeight: 700, fontSize: 14 }, children: "\u0421\u0430\u043C\u043E\u0432\u044B\u0432\u043E\u0437 \u0440\u044F\u0434\u043E\u043C" }),
            /* @__PURE__ */ jsxRuntime.jsx("div", { style: { fontSize: 12.5, color: "var(--pd-muted)", marginTop: 1 }, children: "\u0417\u0430\u0431\u0435\u0440\u0451\u0442\u0435 \u0431\u0443\u043A\u0435\u0442 \u0443 \u043F\u0440\u043E\u0434\u0430\u0432\u0446\u0430 \u2014 \u043E\u0431\u044B\u0447\u043D\u043E \u0434\u0432\u043E\u0440 \u0438\u043B\u0438 \u043C\u0435\u0442\u0440\u043E \u043F\u043E\u0431\u043B\u0438\u0437\u043E\u0441\u0442\u0438" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx("div", { style: { margin: "16px 0" }, children: /* @__PURE__ */ jsxRuntime.jsxs(chunkGT5S3QFQ_cjs.PdNotice, { kind: "ok", icon: chunkGT5S3QFQ_cjs.I.shield, children: [
          /* @__PURE__ */ jsxRuntime.jsx("b", { children: "\u041E\u043F\u043B\u0430\u0442\u0430 \u043F\u0440\u0438 \u0432\u0441\u0442\u0440\u0435\u0447\u0435." }),
          " \u0414\u043E\u0433\u043E\u0432\u043E\u0440\u0438\u0442\u0435\u0441\u044C \u0432 \u0447\u0430\u0442\u0435 \u0438 \u0437\u0430\u0431\u0435\u0440\u0438\u0442\u0435 \u0431\u0443\u043A\u0435\u0442 \u0440\u044F\u0434\u043E\u043C \u2014 \u043F\u043B\u0430\u0442\u0438\u0442\u0435, \u043A\u043E\u0433\u0434\u0430 \u0443\u0432\u0438\u0434\u0435\u043B\u0438 \u0446\u0432\u0435\u0442\u044B."
        ] }) }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { display: "flex", gap: 10 }, children: [
          /* @__PURE__ */ jsxRuntime.jsx(chunkGT5S3QFQ_cjs.PdBtn, { variant: "secondary", style: { flex: 1 }, children: "\u041F\u0440\u0435\u0434\u043B\u043E\u0436\u0438\u0442\u044C \u0446\u0435\u043D\u0443" }),
          /* @__PURE__ */ jsxRuntime.jsx(chunkGT5S3QFQ_cjs.PdBtn, { variant: "primary", icon: chunkGT5S3QFQ_cjs.I.send, style: { flex: 1.4 }, children: "\u041D\u0430\u043F\u0438\u0441\u0430\u0442\u044C \u043F\u0440\u043E\u0434\u0430\u0432\u0446\u0443" })
        ] })
      ] })
    ] })
  ] }) });
}
function ProfileDesktop() {
  const reviews = [
    { n: "\u041C\u0430\u0440\u0438\u043D\u0430", av: "w2", r: 5, tm: "2 \u0434\u043D\u044F \u043D\u0430\u0437\u0430\u0434", t: "\u0411\u0443\u043A\u0435\u0442 \u0431\u044B\u043B \u0441\u0432\u0435\u0436\u0438\u0439, \u043A\u0430\u043A \u043D\u0430 \u0444\u043E\u0442\u043E. \u0410\u043D\u044F \u0432\u0441\u0451 \u0440\u0430\u0441\u0441\u043A\u0430\u0437\u0430\u043B\u0430, \u0432\u0441\u0442\u0440\u0435\u0442\u0438\u043B\u0438\u0441\u044C \u0443 \u043C\u0435\u0442\u0440\u043E, \u043E\u0447\u0435\u043D\u044C \u0443\u0434\u043E\u0431\u043D\u043E. \u0421\u043F\u0430\u0441\u0438\u0431\u043E!" },
    { n: "\u041A\u0430\u0442\u044F", av: "w4", r: 5, tm: "\u043D\u0435\u0434\u0435\u043B\u044E \u043D\u0430\u0437\u0430\u0434", t: "\u041F\u0440\u0435\u043A\u0440\u0430\u0441\u043D\u044B\u0435 \u0440\u043E\u0437\u044B, \u043F\u0440\u043E\u0441\u0442\u043E\u044F\u043B\u0438 \u0435\u0449\u0451 5 \u0434\u043D\u0435\u0439. \u0420\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0443\u044E!" }
  ];
  return /* @__PURE__ */ jsxRuntime.jsx(WebShell, { children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdw-detailwrap", children: [
    /* @__PURE__ */ jsxRuntime.jsx(Back, { children: "\u041D\u0430\u0437\u0430\u0434" }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdw-prof", children: [
      /* @__PURE__ */ jsxRuntime.jsx("span", { className: "big", children: /* @__PURE__ */ jsxRuntime.jsx("img", { src: "img/av/w1.jpg", alt: "" }) }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { flex: 1 }, children: [
        /* @__PURE__ */ jsxRuntime.jsx("h2", { children: "\u0410\u043D\u044F" }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 6, marginTop: 5 }, children: [
          /* @__PURE__ */ jsxRuntime.jsx(chunkGT5S3QFQ_cjs.PdStars, { value: 5 }),
          /* @__PURE__ */ jsxRuntime.jsx("b", { children: "4,9" }),
          /* @__PURE__ */ jsxRuntime.jsx("span", { style: { color: "var(--pd-muted)", fontSize: 13 }, children: "\xB7 23 \u0441\u0434\u0435\u043B\u043A\u0438" })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdw-statrow", children: [
          /* @__PURE__ */ jsxRuntime.jsxs("span", { children: [
            /* @__PURE__ */ jsxRuntime.jsx("b", { children: "12" }),
            " \u043E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u0439"
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs("span", { children: [
            /* @__PURE__ */ jsxRuntime.jsx("b", { children: "\u0441 2025" }),
            " \u043D\u0430 \u043F\u043B\u043E\u0449\u0430\u0434\u043A\u0435"
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs("span", { children: [
            /* @__PURE__ */ jsxRuntime.jsx("b", { children: "97%" }),
            " \u0441\u0434\u0435\u043B\u043E\u043A \u0431\u0435\u0437 \u0436\u0430\u043B\u043E\u0431"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx(chunkGT5S3QFQ_cjs.PdBtn, { variant: "secondary", children: "\u041F\u043E\u0436\u0430\u043B\u043E\u0432\u0430\u0442\u044C\u0441\u044F" })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pd-sechead", style: { padding: "4px 0 16px" }, children: /* @__PURE__ */ jsxRuntime.jsx("div", { children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pd-sectitle", style: { fontSize: 20 }, children: "\u0410\u043A\u0442\u0438\u0432\u043D\u044B\u0435 \u043E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u044F" }) }) }),
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pdw-grid", children: chunkGT5S3QFQ_cjs.PD_FRESH.slice(0, 4).map((d) => /* @__PURE__ */ jsxRuntime.jsx(chunkGT5S3QFQ_cjs.Card, { d, variant: "grid" }, d.id)) }),
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pd-sechead", style: { padding: "24px 0 16px" }, children: /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pd-sectitle", style: { fontSize: 20 }, children: "\u041E\u0442\u0437\u044B\u0432\u044B" }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pd-secsub", children: "23 \u043E\u0442\u0437\u044B\u0432\u0430 \xB7 4,9 \u2605" })
    ] }) }),
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pdw-twocol", children: reviews.map((rv, i) => /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdw-card", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }, children: [
        /* @__PURE__ */ jsxRuntime.jsx(chunkGT5S3QFQ_cjs.Avatar, { seller: rv, size: 30 }),
        /* @__PURE__ */ jsxRuntime.jsx("span", { style: { fontWeight: 700, fontSize: 14 }, children: rv.n }),
        /* @__PURE__ */ jsxRuntime.jsx(chunkGT5S3QFQ_cjs.PdStars, { value: rv.r }),
        /* @__PURE__ */ jsxRuntime.jsx("span", { style: { marginLeft: "auto", fontSize: 12, color: "var(--pd-muted)" }, children: rv.tm })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx("p", { style: { fontSize: 14, lineHeight: 1.55 }, children: rv.t })
    ] }, i)) })
  ] }) });
}
function DealDesktop() {
  return /* @__PURE__ */ jsxRuntime.jsx(WebShell, { children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdw-detailwrap", children: [
    /* @__PURE__ */ jsxRuntime.jsx(Back, { children: "\u041C\u043E\u0438 \u0441\u0434\u0435\u043B\u043A\u0438" }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdw-deal", children: [
      /* @__PURE__ */ jsxRuntime.jsx("div", { children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdw-card", children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }, children: [
          /* @__PURE__ */ jsxRuntime.jsx("img", { src: "img/1561181286-d3fee7d55364.jpg", alt: "", style: { width: 64, height: 64, borderRadius: 14, objectFit: "cover" } }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { flex: 1 }, children: [
            /* @__PURE__ */ jsxRuntime.jsx("div", { style: { fontWeight: 700, fontSize: 16 }, children: "\u0411\u0443\u043A\u0435\u0442 M \xB7 \u041F\u0430\u0442\u0440\u0438\u043A\u0438" }),
            /* @__PURE__ */ jsxRuntime.jsx("div", { style: { fontSize: 13, color: "var(--pd-muted)", marginTop: 2 }, children: "\u041F\u0440\u043E\u0434\u0430\u0432\u0435\u0446 \u0410\u043D\u044F \xB7 4,9 \u2605" })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { textAlign: "right" }, children: [
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pd-price", style: { fontSize: 20 }, children: chunkGT5S3QFQ_cjs.pdMoney(990) }),
            /* @__PURE__ */ jsxRuntime.jsx("div", { style: { fontSize: 12, color: "var(--pd-muted)" }, children: "\u0434\u043E\u0433\u043E\u0432\u043E\u0440\u0438\u043B\u0438\u0441\u044C" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx(chunkGT5S3QFQ_cjs.PdStepper, { status: "meeting" }),
        /* @__PURE__ */ jsxRuntime.jsx("div", { style: { margin: "16px 0" }, children: /* @__PURE__ */ jsxRuntime.jsxs(chunkGT5S3QFQ_cjs.PdNotice, { kind: "ok", icon: chunkGT5S3QFQ_cjs.I.shield, children: [
          /* @__PURE__ */ jsxRuntime.jsx("b", { children: "\u041E\u043F\u043B\u0430\u0442\u0430 \u043F\u0440\u0438 \u0432\u0441\u0442\u0440\u0435\u0447\u0435." }),
          " \u0414\u043E\u0433\u043E\u0432\u043E\u0440\u0438\u0442\u0435\u0441\u044C \u043E \u0432\u0440\u0435\u043C\u0435\u043D\u0438, \u0437\u0430\u0431\u0435\u0440\u0438\u0442\u0435 \u0431\u0443\u043A\u0435\u0442 \u0438 \u0440\u0430\u0441\u043F\u043B\u0430\u0442\u0438\u0442\u0435\u0441\u044C \u043D\u0430 \u043C\u0435\u0441\u0442\u0435."
        ] }) }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", border: "1px solid var(--pd-border)", borderRadius: 13 }, children: [
          wic(chunkGT5S3QFQ_cjs.I.walk, "pd-i20 "),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { flex: 1 }, children: [
            /* @__PURE__ */ jsxRuntime.jsx("div", { style: { fontWeight: 600, fontSize: 13.5 }, children: "\u0421\u0430\u043C\u043E\u0432\u044B\u0432\u043E\u0437 \xB7 \u043C. \u041C\u0430\u044F\u043A\u043E\u0432\u0441\u043A\u0430\u044F" }),
            /* @__PURE__ */ jsxRuntime.jsx("div", { style: { fontSize: 12, color: "var(--pd-muted)" }, children: "\u0414\u0432\u043E\u0440, \u0422\u0432\u0435\u0440\u0441\u043A\u0430\u044F 12, \u043F\u043E\u0441\u043B\u0435 \u0434\u043E\u0433\u043E\u0432\u043E\u0440\u0451\u043D\u043D\u043E\u0441\u0442\u0438" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { display: "flex", gap: 10, marginTop: 16 }, children: [
          /* @__PURE__ */ jsxRuntime.jsx(chunkGT5S3QFQ_cjs.PdBtn, { variant: "secondary", icon: chunkGT5S3QFQ_cjs.I.alert, style: { flex: 1 }, children: "\u041F\u0440\u043E\u0431\u043B\u0435\u043C\u0430" }),
          /* @__PURE__ */ jsxRuntime.jsx(chunkGT5S3QFQ_cjs.PdBtn, { variant: "primary", icon: chunkGT5S3QFQ_cjs.I.check, style: { flex: 1.5 }, children: "\u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044C \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0435" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdw-chatcard", children: [
        /* @__PURE__ */ jsxRuntime.jsx("div", { style: { padding: "13px 16px", borderBottom: "1px solid var(--pd-border)", fontWeight: 700, fontSize: 14 }, children: "\u0427\u0430\u0442 \u0441\u0434\u0435\u043B\u043A\u0438 \xB7 \u0410\u043D\u044F" }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pd-chat", children: [
          /* @__PURE__ */ jsxRuntime.jsx(chunkGT5S3QFQ_cjs.PdBubble, { kind: "sys", children: "\u0427\u0430\u0442 \u0441\u0434\u0435\u043B\u043A\u0438 \u043E\u0442\u043A\u0440\u044B\u0442 \xB7 \u0434\u043E\u0433\u043E\u0432\u043E\u0440\u0438\u0442\u0435\u0441\u044C \u043E \u0432\u0441\u0442\u0440\u0435\u0447\u0435" }),
          /* @__PURE__ */ jsxRuntime.jsx(chunkGT5S3QFQ_cjs.PdBubble, { kind: "in", time: "17:58", children: "\u0417\u0434\u0440\u0430\u0432\u0441\u0442\u0432\u0443\u0439\u0442\u0435! \u041C\u043E\u0436\u043D\u043E \u0437\u0430\u0431\u0440\u0430\u0442\u044C \u0441\u0435\u0433\u043E\u0434\u043D\u044F \u043F\u043E\u0441\u043B\u0435 18:00 \u{1F338}" }),
          /* @__PURE__ */ jsxRuntime.jsx(chunkGT5S3QFQ_cjs.PdBubble, { kind: "out", time: "18:01", children: "\u041E\u0442\u043B\u0438\u0447\u043D\u043E, \u0431\u0443\u0434\u0443 \u043A 18:30" }),
          /* @__PURE__ */ jsxRuntime.jsx(chunkGT5S3QFQ_cjs.PdBubble, { kind: "in", time: "18:02", children: "\u0414\u0432\u043E\u0440 \u0434\u043E\u043C\u0430 \u043F\u043E \u0422\u0432\u0435\u0440\u0441\u043A\u043E\u0439, 12. \u041D\u0430\u043F\u0438\u0448\u0443, \u043A\u0430\u043A \u0432\u044B\u0439\u0434\u0443" })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pd-chatinput", children: [
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pd-input", style: { flex: 1, padding: "9px 14px" }, children: /* @__PURE__ */ jsxRuntime.jsx("input", { placeholder: "\u0421\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435\u2026" }) }),
          /* @__PURE__ */ jsxRuntime.jsx("button", { className: "send", children: wic(chunkGT5S3QFQ_cjs.I.send, "pd-i20") })
        ] })
      ] })
    ] })
  ] }) });
}
function SellDesktop() {
  return /* @__PURE__ */ jsxRuntime.jsx(WebShell, { children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdw-narrow", children: [
    /* @__PURE__ */ jsxRuntime.jsx(Back, { children: "\u041E\u0442\u043C\u0435\u043D\u0430" }),
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pdw-h1", children: "\u041F\u0440\u043E\u0434\u0430\u0442\u044C \u0431\u0443\u043A\u0435\u0442" }),
    /* @__PURE__ */ jsxRuntime.jsx("p", { className: "pdw-lead", style: { marginBottom: 20 }, children: "\u041E\u043F\u0443\u0431\u043B\u0438\u043A\u0443\u0435\u0442\u0441\u044F \u0441\u0440\u0430\u0437\u0443 \u0438 \u043F\u043E\u043F\u0430\u0434\u0451\u0442 \u0432 \u043B\u0435\u043D\u0442\u0443 \u041C\u043E\u0441\u043A\u0432\u044B. \u041C\u0435\u0442\u0430\u0434\u0430\u043D\u043D\u044B\u0435 \u0438 \u0433\u0435\u043E\u0434\u0430\u043D\u043D\u044B\u0435 \u0443\u0431\u0435\u0440\u0451\u043C \u043F\u0435\u0440\u0435\u0434 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u043E\u0439." }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdw-card", style: { display: "flex", flexDirection: "column", gap: 20 }, children: [
      /* @__PURE__ */ jsxRuntime.jsx(chunkGT5S3QFQ_cjs.PdField, { label: "\u0424\u043E\u0442\u043E \u0431\u0443\u043A\u0435\u0442\u0430", hint: "1\u20135 \u0444\u043E\u0442\u043E.", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pd-uploader", children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pd-upcell", children: [
          /* @__PURE__ */ jsxRuntime.jsx("img", { src: "img/1561181286-d3fee7d55364.jpg", alt: "" }),
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "cover", children: "\u041E\u0431\u043B\u043E\u0436\u043A\u0430" })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pd-upcell", children: /* @__PURE__ */ jsxRuntime.jsx("img", { src: "img/1567418938902-aa650a3eb346.jpg", alt: "" }) }),
        /* @__PURE__ */ jsxRuntime.jsxs("button", { className: "pd-upadd", children: [
          wic(chunkGT5S3QFQ_cjs.I.camera, "pd-i24"),
          /* @__PURE__ */ jsxRuntime.jsxs("span", { children: [
            "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C",
            /* @__PURE__ */ jsxRuntime.jsx("br", {}),
            "2 \u0438\u0437 5"
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }, children: [
        /* @__PURE__ */ jsxRuntime.jsx(chunkGT5S3QFQ_cjs.PdField, { label: "\u0420\u0430\u0437\u043C\u0435\u0440", children: /* @__PURE__ */ jsxRuntime.jsx(chunkGT5S3QFQ_cjs.PdSizeSel, { value: "M" }) }),
        /* @__PURE__ */ jsxRuntime.jsx(chunkGT5S3QFQ_cjs.PdField, { label: "\u0426\u0435\u043D\u0430", hint: "\u041F\u043E\u0445\u043E\u0436\u0438\u0435: 700\u20131 300 \u20BD.", children: /* @__PURE__ */ jsxRuntime.jsx(chunkGT5S3QFQ_cjs.PdInput, { prefix: "\u20BD", value: "990" }) })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx(chunkGT5S3QFQ_cjs.PdField, { label: "\u0421\u0432\u0435\u0436\u0435\u0441\u0442\u044C", children: /* @__PURE__ */ jsxRuntime.jsx(chunkGT5S3QFQ_cjs.PdSeg, { value: "today", options: [{ k: "today", label: "\u0421\u0435\u0433\u043E\u0434\u043D\u044F" }, { k: "d1_2", label: "1\u20132 \u0434\u043D\u044F" }, { k: "d3_plus", label: "3+ \u0434\u043D\u044F" }] }) }),
      /* @__PURE__ */ jsxRuntime.jsx(chunkGT5S3QFQ_cjs.PdField, { label: "\u0420\u0430\u0439\u043E\u043D", hint: "\u0422\u043E\u0447\u043D\u044B\u0439 \u0430\u0434\u0440\u0435\u0441 \u0432\u0438\u0434\u0435\u043D \u043F\u043E\u0441\u043B\u0435 \u0434\u043E\u0433\u043E\u0432\u043E\u0440\u0451\u043D\u043D\u043E\u0441\u0442\u0438.", children: /* @__PURE__ */ jsxRuntime.jsx(chunkGT5S3QFQ_cjs.PdInput, { icon: chunkGT5S3QFQ_cjs.Ic.pin, value: "\u041C\u043E\u0441\u043A\u0432\u0430 \xB7 \u041F\u0430\u0442\u0440\u0438\u043A\u0438" }) }),
      /* @__PURE__ */ jsxRuntime.jsx(chunkGT5S3QFQ_cjs.PdField, { label: "\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435", opt: "\u043D\u0435\u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E", counter: "84 / 600", children: /* @__PURE__ */ jsxRuntime.jsx(chunkGT5S3QFQ_cjs.PdInput, { textarea: true, rows: 3, value: "\u041F\u043E\u0434\u0430\u0440\u0438\u043B\u0438 \u0443\u0442\u0440\u043E\u043C, \u043F\u0438\u043E\u043D\u043E\u0432\u0438\u0434\u043D\u044B\u0435 \u0440\u043E\u0437\u044B \u0438 \u044D\u0432\u043A\u0430\u043B\u0438\u043F\u0442. \u041E\u0447\u0435\u043D\u044C \u0441\u0432\u0435\u0436\u0438\u0435, \u0441\u0442\u043E\u044F\u0442 \u0432 \u0432\u043E\u0434\u0435." }) }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { children: /* @__PURE__ */ jsxRuntime.jsx(chunkGT5S3QFQ_cjs.PdBtn, { variant: "primary", lg: true, children: "\u041E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u0442\u044C \u0431\u0443\u043A\u0435\u0442" }) })
    ] })
  ] }) });
}
function NotificationsDesktop() {
  const N = [
    { ic: chunkGT5S3QFQ_cjs.I.check, unread: true, t: "\u0421\u0434\u0435\u043B\u043A\u0430 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0430", s: "\xAB\u0411\u0443\u043A\u0435\u0442 M \xB7 \u041F\u0430\u0442\u0440\u0438\u043A\u0438\xBB \xB7 \u043F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u044C \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u043B \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0435", tm: "5 \u043C\u0438\u043D" },
    { ic: chunkGT5S3QFQ_cjs.I.heartline, unread: true, t: "\u0412\u0430\u0448 \u0431\u0443\u043A\u0435\u0442 \u0437\u0430\u043B\u0430\u0439\u043A\u0430\u043B\u0438", s: "\u0423\u0436\u0435 47 \u043B\u0430\u0439\u043A\u043E\u0432, \u043E\u043D \u0432 \u0442\u043E\u043F\u0435 \xAB\u0421\u0430\u043C\u044B\u0435 \u0437\u0430\u043B\u0430\u0439\u043A\u0430\u043D\u043D\u044B\u0435\xBB", tm: "1 \u0447" },
    { ic: chunkGT5S3QFQ_cjs.Ic.search, unread: false, t: "\u041F\u043E\u0445\u043E\u0436\u0438\u0439 \u0431\u0443\u043A\u0435\u0442 \u0440\u044F\u0434\u043E\u043C", s: "\u041F\u0438\u043E\u043D\u043E\u0432\u0438\u0434\u043D\u044B\u0435 \u0440\u043E\u0437\u044B \u0432 \u041F\u0430\u0442\u0440\u0438\u043A\u0430\u0445 \u0437\u0430 890 \u20BD", tm: "3 \u0447" },
    { ic: chunkGT5S3QFQ_cjs.Ic.star, unread: false, t: "\u041D\u043E\u0432\u044B\u0439 \u043E\u0442\u0437\u044B\u0432 \u043E\u0442 \u041C\u0430\u0440\u0438\u043D\u044B", s: "\xAB\u0411\u0443\u043A\u0435\u0442 \u0431\u044B\u043B \u0441\u0432\u0435\u0436\u0438\u0439, \u043A\u0430\u043A \u043D\u0430 \u0444\u043E\u0442\u043E\xBB \xB7 5 \u2605", tm: "\u0432\u0447\u0435\u0440\u0430" }
  ];
  return /* @__PURE__ */ jsxRuntime.jsx(WebShell, { children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdw-narrow", children: [
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pdw-h1", style: { marginBottom: 18 }, children: "\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F" }),
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pdw-card", style: { padding: 0, overflow: "hidden" }, children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pd-list", children: N.map((n, i) => /* @__PURE__ */ jsxRuntime.jsxs("div", { className: `pd-row${n.unread ? " unread" : ""}`, children: [
      /* @__PURE__ */ jsxRuntime.jsx("span", { className: "ring", children: wic(n.ic, "pd-i20") }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "mid", children: [
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "ttl", children: n.t }),
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "sub", children: n.s })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }, children: [
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "tm", children: n.tm }),
        n.unread && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "udot" })
      ] })
    ] }, i)) }) })
  ] }) });
}
function SearchDesktop() {
  return /* @__PURE__ */ jsxRuntime.jsx(WebShell, { children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdw-detailwrap", children: [
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pd-search pdw-search", style: { maxWidth: 560, margin: "0 0 18px" }, children: [
      wic(chunkGT5S3QFQ_cjs.Ic.search, "pd-i18"),
      /* @__PURE__ */ jsxRuntime.jsx("span", { style: { color: "var(--pd-text)" }, children: "\u043F\u0438\u043E\u043D\u044B \u043F\u0438\u043E\u043D\u043E\u0432\u0438\u0434\u043D\u044B\u0435" })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pd-chiprow", style: { marginBottom: 20 }, children: [
      /* @__PURE__ */ jsxRuntime.jsx("span", { className: "pd-chip pd-chip--on", children: "\u0424\u0438\u043B\u044C\u0442\u0440\u044B \xB7 2" }),
      /* @__PURE__ */ jsxRuntime.jsx("span", { className: "pd-chip", children: "\u0434\u043E 1 000 \u20BD" }),
      /* @__PURE__ */ jsxRuntime.jsx("span", { className: "pd-chip", children: "\u0420\u0430\u0437\u043C\u0435\u0440 M" })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pd-empty", style: { height: "auto", padding: "30px 24px" }, children: [
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "glyph", children: wic(chunkGT5S3QFQ_cjs.Ic.search, "pd-i28") }),
      /* @__PURE__ */ jsxRuntime.jsx("h3", { children: "\u041D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043D\u0430\u0448\u043B\u043E\u0441\u044C" }),
      /* @__PURE__ */ jsxRuntime.jsx("p", { children: "\u041F\u043E \u0437\u0430\u043F\u0440\u043E\u0441\u0443 \xAB\u043F\u0438\u043E\u043D\u044B \u043F\u0438\u043E\u043D\u043E\u0432\u0438\u0434\u043D\u044B\u0435\xBB \u0441 \u044D\u0442\u0438\u043C\u0438 \u0444\u0438\u043B\u044C\u0442\u0440\u0430\u043C\u0438 \u043F\u043E\u043A\u0430 \u043D\u0435\u0442 \u0431\u0443\u043A\u0435\u0442\u043E\u0432." }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { display: "flex", gap: 10, justifyContent: "center", marginTop: 6 }, children: [
        /* @__PURE__ */ jsxRuntime.jsx(chunkGT5S3QFQ_cjs.PdBtn, { variant: "primary", children: "\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u0444\u0438\u043B\u044C\u0442\u0440\u044B" }),
        /* @__PURE__ */ jsxRuntime.jsx(chunkGT5S3QFQ_cjs.PdBtn, { variant: "secondary", children: "\u0418\u0441\u043A\u0430\u0442\u044C \u0432\u043E \u0432\u0441\u0435\u0445 \u0433\u043E\u0440\u043E\u0434\u0430\u0445" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pd-sectitle", style: { fontSize: 18, margin: "8px 0 16px" }, children: "\u041F\u043E\u0445\u043E\u0436\u0438\u0435 \u0441\u0432\u0435\u0436\u0438\u0435 \u0431\u0443\u043A\u0435\u0442\u044B" }),
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pdw-grid", children: chunkGT5S3QFQ_cjs.PD_LIKED.slice(0, 4).map((d) => /* @__PURE__ */ jsxRuntime.jsx(chunkGT5S3QFQ_cjs.Card, { d, variant: "grid" }, d.id)) })
  ] }) });
}

exports.DealActive = DealActive;
exports.DealDesktop = DealDesktop;
exports.DealDone = DealDone;
exports.DealProblem = DealProblem;
exports.ListingDesktop = ListingDesktop;
exports.Notifications = Notifications;
exports.NotificationsDesktop = NotificationsDesktop;
exports.NotificationsEmpty = NotificationsEmpty;
exports.Offline = Offline;
exports.PaymentFailed = PaymentFailed;
exports.ProfileDesktop = ProfileDesktop;
exports.ReviewForm = ReviewForm;
exports.SearchDesktop = SearchDesktop;
exports.SellDesktop = SellDesktop;
