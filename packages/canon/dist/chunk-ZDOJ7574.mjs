import { Ic, I, pdMoney, PdBtn, PdOtp } from './chunk-SNT6I4NE.mjs';
import 'react';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';

var aic = (Fn, cls = "pd-i18") => Fn({ className: cls, fill: "none", stroke: "currentColor" });
function Side({ active }) {
  const items = [
    ["dash", "\u041E\u0431\u0437\u043E\u0440", Ic.home, null],
    ["users", "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0438", Ic.user, null],
    ["list", "\u041E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u044F", Ic.search, null],
    ["deals", "\u0421\u0434\u0435\u043B\u043A\u0438", Ic.deals, null],
    ["fin", "\u0424\u0438\u043D\u0430\u043D\u0441\u044B", I.wallet, null],
    ["fraud", "\u0410\u043D\u0442\u0438\u0444\u0440\u043E\u0434", I.shield, "7"],
    ["mod", "\u041C\u043E\u0434\u0435\u0440\u0430\u0446\u0438\u044F", I.alert, "12"],
    ["reports", "\u0416\u0430\u043B\u043E\u0431\u044B", I.flag, "3"]
  ];
  return /* @__PURE__ */ jsxs("aside", { className: "pda-side", children: [
    /* @__PURE__ */ jsx("div", { className: "pda-brand", children: "\u041F\u0435\u0440\u0435\u0434\u0430\u0440\u0438\u043C \xB7 admin" }),
    items.map(([k, l, Ic2, ct]) => /* @__PURE__ */ jsxs("button", { className: `pda-nav${active === k ? " on" : ""}`, children: [
      Ic2({ className: "pd-i18", fill: "none", stroke: "currentColor" }),
      l,
      ct && /* @__PURE__ */ jsx("span", { className: "ct", children: ct })
    ] }, k)),
    /* @__PURE__ */ jsxs("div", { className: "pda-side-foot", children: [
      /* @__PURE__ */ jsx("span", { className: "av", children: "\u041E" }),
      /* @__PURE__ */ jsxs("div", { style: { fontSize: 12.5 }, children: [
        /* @__PURE__ */ jsx("div", { style: { fontWeight: 600 }, children: "\u041E\u043F\u0435\u0440\u0430\u0442\u043E\u0440" }),
        /* @__PURE__ */ jsx("div", { style: { color: "var(--pd-muted)", fontSize: 11 }, children: "moderator" })
      ] })
    ] })
  ] });
}
var Spark = ({ pts, color }) => /* @__PURE__ */ jsx("svg", { className: "pda-spark", viewBox: "0 0 100 34", preserveAspectRatio: "none", style: { width: "100%", height: 34 }, children: /* @__PURE__ */ jsx("polyline", { points: pts, fill: "none", stroke: color || "var(--pd-primary)", strokeWidth: "2.5", vectorEffect: "non-scaling-stroke" }) });
function AdminShell({ active, title, top, overlay, children }) {
  return /* @__PURE__ */ jsxs("div", { className: "pda-app", style: { position: "relative" }, children: [
    /* @__PURE__ */ jsx(Side, { active }),
    /* @__PURE__ */ jsxs("div", { className: "pda-main", children: [
      /* @__PURE__ */ jsxs("div", { className: "pda-top", children: [
        /* @__PURE__ */ jsx("h1", { children: title }),
        top,
        /* @__PURE__ */ jsxs("span", { className: "pda-2fa", style: top ? void 0 : { marginLeft: "auto" }, children: [
          aic(I.lock, "pd-i13"),
          "2FA \xB7 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F \u0432 audit-log"
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "pda-body", children })
    ] }),
    overlay
  ] });
}
function AdminToast({ kind = "ok", children }) {
  return /* @__PURE__ */ jsxs("div", { className: "pd-toast", style: { position: "absolute", right: 24, bottom: 24, zIndex: 80 }, children: [
    aic(kind === "ok" ? I.check : I.alert, "pd-i18"),
    children
  ] });
}
function AdminDashboard() {
  const kpis = [
    { lab: "\u041E\u043D\u043B\u0430\u0439\u043D \u0441\u0435\u0439\u0447\u0430\u0441", val: "342", d: "+5%", up: true, sp: "0,28 14,24 28,26 42,18 56,20 70,12 84,14 100,8" },
    { lab: "DAU / MAU", val: "4 870", sub: "/ 51 200", d: "+8%", up: true, sp: "0,30 16,26 32,22 48,24 64,16 80,14 100,9" },
    { lab: "\u041E\u0431\u043E\u0440\u043E\u0442 \u0441\u0434\u0435\u043B\u043E\u043A", val: "3,24 \u043C\u043B\u043D \u20BD", note: "\u043E\u0446\u0435\u043D\u043A\u0430 \u043F\u043E \u0437\u0430\u0432\u0435\u0440\u0448\u0451\u043D\u043D\u044B\u043C", d: "+14%", up: true, sp: "0,32 16,28 32,24 48,20 64,17 80,11 100,7" },
    { lab: "\u0421\u0434\u0435\u043B\u043E\u043A \u0437\u0430 \u043C\u0435\u0441\u044F\u0446", val: "1 142", d: "+12%", up: true, sp: "0,31 16,27 32,25 48,19 64,16 80,12 100,8" }
  ];
  const months = ["\u042F\u043D\u0432", "\u0424\u0435\u0432", "\u041C\u0430\u0440", "\u0410\u043F\u0440", "\u041C\u0430\u0439", "\u0418\u044E\u043D"];
  const dataW = [40, 52, 60, 72, 84, 96], dataA = [26, 30, 40, 52, 64, 78];
  const max = 180;
  const cities = [["\u041C\u043E\u0441\u043A\u0432\u0430", 2870, "var(--pd-primary)"], ["\u0421\u0430\u043D\u043A\u0442-\u041F\u0435\u0442\u0435\u0440\u0431\u0443\u0440\u0433", 1120, "#5B8C68"], ["\u041D\u043E\u0432\u043E\u0441\u0438\u0431\u0438\u0440\u0441\u043A", 430, "#D29A33"], ["\u0415\u043A\u0430\u0442\u0435\u0440\u0438\u043D\u0431\u0443\u0440\u0433", 310, "#9B7BB8"]];
  const cmax = 2870;
  const deals = [
    ["\u041C\u0430\u0440\u0438\u043D\u0430 \u2192 \u0410\u043D\u044F", "\u041C\u043E\u0441\u043A\u0432\u0430", 990, 90, "done"],
    ["\u041A\u0430\u0442\u044F \u2192 \u041B\u0435\u043D\u0430", "\u041C\u043E\u0441\u043A\u0432\u0430", 1190, 107, "meeting"],
    ["\u0421\u043E\u043D\u044F \u2192 \u042E\u043B\u044F", "\u0421\u041F\u0431", 850, 76, "problem"],
    ["\u0412\u0435\u0440\u0430 \u2192 \u041E\u043B\u044C\u0433\u0430", "\u041A\u0430\u0437\u0430\u043D\u044C", 590, 53, "done"]
  ];
  const DEAL_LBL = { done: "\u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0430", meeting: "\u0438\u0434\u0451\u0442", problem: "\u0436\u0430\u043B\u043E\u0431\u0430" };
  return /* @__PURE__ */ jsxs("div", { className: "pda-app", children: [
    /* @__PURE__ */ jsx(Side, { active: "dash" }),
    /* @__PURE__ */ jsxs("div", { className: "pda-main", children: [
      /* @__PURE__ */ jsxs("div", { className: "pda-top", children: [
        /* @__PURE__ */ jsx("h1", { children: "\u041E\u0431\u0437\u043E\u0440" }),
        /* @__PURE__ */ jsxs("div", { className: "pda-period", children: [
          /* @__PURE__ */ jsx("button", { children: "\u0414\u0435\u043D\u044C" }),
          /* @__PURE__ */ jsx("button", { children: "\u041D\u0435\u0434\u0435\u043B\u044F" }),
          /* @__PURE__ */ jsx("button", { className: "on", children: "\u041C\u0435\u0441\u044F\u0446" }),
          /* @__PURE__ */ jsx("button", { children: "\u041F\u0435\u0440\u0438\u043E\u0434" })
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "pda-2fa", children: [
          I.lock({ className: "pd-i13", fill: "none", stroke: "currentColor" }),
          "2FA \xB7 \u0434\u043E\u0441\u0442\u0443\u043F \u043B\u043E\u0433\u0438\u0440\u0443\u0435\u0442\u0441\u044F"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pda-body", children: [
        /* @__PURE__ */ jsx("div", { className: "pda-kpis", children: kpis.map((k, i) => /* @__PURE__ */ jsxs("div", { className: "pda-kpi", children: [
          /* @__PURE__ */ jsx("div", { className: "lab", children: k.lab }),
          /* @__PURE__ */ jsxs("div", { className: "val", children: [
            k.val,
            k.sub && /* @__PURE__ */ jsxs("span", { style: { fontSize: 15, color: "var(--pd-muted)", fontWeight: 600 }, children: [
              " ",
              k.sub
            ] })
          ] }),
          k.note && /* @__PURE__ */ jsx("div", { style: { fontSize: 11, color: "var(--pd-faint)", marginTop: 2 }, children: k.note }),
          k.d && /* @__PURE__ */ jsxs("div", { className: `delta ${k.up ? "up" : "down"}`, children: [
            "\u2191 ",
            k.d,
            " \u043A \u043F\u0440\u043E\u0448\u043B\u043E\u043C\u0443 \u043F\u0435\u0440\u0438\u043E\u0434\u0443"
          ] }),
          /* @__PURE__ */ jsx(Spark, { pts: k.sp, color: i >= 2 ? "#5B8C68" : "var(--pd-primary)" })
        ] }, i)) }),
        /* @__PURE__ */ jsxs("div", { className: "pda-row2", children: [
          /* @__PURE__ */ jsxs("div", { className: "pda-panel", children: [
            /* @__PURE__ */ jsx("h3", { children: "\u041F\u0440\u0438\u0440\u043E\u0441\u0442 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0435\u0439" }),
            /* @__PURE__ */ jsx("div", { className: "psub", children: "\u041D\u043E\u0432\u044B\u0435 \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u0438 \u043F\u043E \u043C\u0435\u0441\u044F\u0446\u0430\u043C \xB7 web vs \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435" }),
            /* @__PURE__ */ jsx("div", { className: "pda-bars", children: months.map((m, i) => /* @__PURE__ */ jsxs("div", { className: "b", children: [
              /* @__PURE__ */ jsxs("div", { className: "bset", children: [
                /* @__PURE__ */ jsx("div", { className: "bar", style: { height: dataA[i] / max * 100 + "%", background: "var(--pd-surface-3)" } }),
                /* @__PURE__ */ jsx("div", { className: "bar", style: { height: dataW[i] / max * 100 + "%", background: "var(--pd-primary)" } })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "t", children: m })
            ] }, m)) }),
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 16, marginTop: 14, fontSize: 12, color: "var(--pd-muted)" }, children: [
              /* @__PURE__ */ jsxs("span", { style: { display: "inline-flex", alignItems: "center", gap: 6 }, children: [
                /* @__PURE__ */ jsx("i", { style: { width: 10, height: 10, borderRadius: 3, background: "var(--pd-primary)" } }),
                "Web"
              ] }),
              /* @__PURE__ */ jsxs("span", { style: { display: "inline-flex", alignItems: "center", gap: 6 }, children: [
                /* @__PURE__ */ jsx("i", { style: { width: 10, height: 10, borderRadius: 3, background: "var(--pd-surface-3)" } }),
                "\u041F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435 (iOS+Android)"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "pda-panel", children: [
            /* @__PURE__ */ jsx("h3", { children: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0438 \u043F\u043E \u0433\u043E\u0440\u043E\u0434\u0430\u043C" }),
            /* @__PURE__ */ jsx("div", { className: "psub", children: "\u0422\u043E\u043F-4 \u0438\u0437 10 \u0433\u043E\u0440\u043E\u0434\u043E\u0432" }),
            /* @__PURE__ */ jsx("div", { className: "pda-legend", children: cities.map(([n, v, c]) => /* @__PURE__ */ jsxs("div", { className: "pda-leg", children: [
              /* @__PURE__ */ jsx("span", { className: "dot", style: { background: c } }),
              /* @__PURE__ */ jsx("span", { className: "nm", children: n }),
              /* @__PURE__ */ jsx("span", { className: "vl", children: v.toLocaleString("ru-RU").replace(/,/g, " ") }),
              /* @__PURE__ */ jsx("span", { className: "track", children: /* @__PURE__ */ jsx("i", { style: { width: v / cmax * 100 + "%", background: c } }) })
            ] }, n)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pda-panel", style: { padding: 0, overflow: "hidden" }, children: [
          /* @__PURE__ */ jsxs("div", { style: { padding: "16px 18px 12px" }, children: [
            /* @__PURE__ */ jsx("h3", { children: "\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0435 \u0441\u0434\u0435\u043B\u043A\u0438" }),
            /* @__PURE__ */ jsx("div", { className: "psub", style: { margin: 0 }, children: "\u0421\u0443\u043C\u043C\u044B \u0441\u0434\u0435\u043B\u043E\u043A \u0432 \u20BD" })
          ] }),
          /* @__PURE__ */ jsxs("table", { className: "pda-table", children: [
            /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("th", { children: "\u0423\u0447\u0430\u0441\u0442\u043D\u0438\u043A\u0438" }),
              /* @__PURE__ */ jsx("th", { children: "\u0413\u043E\u0440\u043E\u0434" }),
              /* @__PURE__ */ jsx("th", { children: "\u0421\u0443\u043C\u043C\u0430" }),
              /* @__PURE__ */ jsx("th", { children: "\u0421\u0442\u0430\u0442\u0443\u0441" })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { children: deals.map((d, i) => /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("td", { children: d[0] }),
              /* @__PURE__ */ jsx("td", { children: d[1] }),
              /* @__PURE__ */ jsx("td", { style: { fontWeight: 700 }, children: pdMoney(d[2]) }),
              /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("span", { className: `pda-badge ${d[4]}`, children: DEAL_LBL[d[4]] }) })
            ] }, i)) })
          ] })
        ] })
      ] })
    ] })
  ] });
}
function AdminModeration() {
  const cards = [
    { photo: "1565695951564-007d8f297e48", type: "\u041E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u0435", seller: "\u041A\u0430\u0442\u044F", reason: "ML-\u0440\u0438\u0441\u043A: \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E \u043B\u0438\u0446\u043E \u043D\u0430 \u0444\u043E\u0442\u043E", txt: "\u0411\u043E\u043B\u044C\u0448\u043E\u0439 \u0431\u0443\u043A\u0435\u0442 \u043F\u0438\u043E\u043D\u043E\u0432, \u043E\u0447\u0435\u043D\u044C \u0441\u0432\u0435\u0436\u0438\u0439. \u0421\u0430\u043C\u043E\u0432\u044B\u0432\u043E\u0437 \u0441\u0435\u0433\u043E\u0434\u043D\u044F." },
    { photo: "1531120364508-a6b656c3e78d", type: "\u041E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u0435", seller: "\u042E\u043B\u044F", reason: "\u0416\u0430\u043B\u043E\u0431\u0430: \u043A\u043E\u043D\u0442\u0430\u043A\u0442 \u0432 \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u0438", txt: "\u0421\u0432\u0435\u0436\u0438\u0435 \u0440\u043E\u0437\u044B, \u043F\u0438\u0448\u0438\u0442\u0435 \u0434\u043B\u044F \u0434\u0435\u0442\u0430\u043B\u0435\u0439\u2026" },
    { photo: null, type: "\u041E\u0442\u0437\u044B\u0432", seller: "\u0410\u043D\u043E\u043D\u0438\u043C \u2192 \u041B\u0435\u043D\u0430", reason: "\u0410\u043D\u0442\u0438\u0444\u0440\u043E\u0434: \u043F\u043E\u0434\u043E\u0437\u0440\u0435\u043D\u0438\u0435 \u043D\u0430 \u043D\u0430\u043A\u0440\u0443\u0442\u043A\u0443", txt: "\xAB\u2026\xBB \xB7 \u0442\u0435\u043A\u0441\u0442 \u0441\u043A\u0440\u044B\u0442 \u0434\u043E \u0440\u0435\u0448\u0435\u043D\u0438\u044F \u043C\u043E\u0434\u0435\u0440\u0430\u0442\u043E\u0440\u0430" }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "pda-app", children: [
    /* @__PURE__ */ jsx(Side, { active: "mod" }),
    /* @__PURE__ */ jsxs("div", { className: "pda-main", children: [
      /* @__PURE__ */ jsxs("div", { className: "pda-top", children: [
        /* @__PURE__ */ jsx("h1", { children: "\u041C\u043E\u0434\u0435\u0440\u0430\u0446\u0438\u044F" }),
        /* @__PURE__ */ jsxs("span", { className: "pda-2fa", style: { marginLeft: "auto" }, children: [
          I.lock({ className: "pd-i13", fill: "none", stroke: "currentColor" }),
          "2FA \xB7 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F \u0432 audit-log"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pda-body", children: [
        /* @__PURE__ */ jsxs("div", { className: "pda-filter", children: [
          /* @__PURE__ */ jsxs("div", { className: "pda-srch", children: [
            Ic.search({ className: "pd-i16", fill: "none", stroke: "currentColor" }),
            "\u041F\u043E\u0438\u0441\u043A \u043F\u043E \u043E\u0447\u0435\u0440\u0435\u0434\u0438"
          ] }),
          /* @__PURE__ */ jsx("button", { className: "pd-chip pd-chip--on", children: "ML-\u0440\u0438\u0441\u043A \xB7 5" }),
          /* @__PURE__ */ jsx("button", { className: "pd-chip", children: "\u0416\u0430\u043B\u043E\u0431\u044B \xB7 4" }),
          /* @__PURE__ */ jsx("button", { className: "pd-chip", children: "\u0410\u043D\u0442\u0438\u0444\u0440\u043E\u0434 \xB7 2" }),
          /* @__PURE__ */ jsx("button", { className: "pd-chip", children: "\u0410\u043F\u0435\u043B\u043B\u044F\u0446\u0438\u0438 \xB7 1" }),
          /* @__PURE__ */ jsx("span", { style: { marginLeft: "auto", fontSize: 13, color: "var(--pd-muted)", fontWeight: 600 }, children: "\u0420\u0435\u0430\u043A\u0442\u0438\u0432\u043D\u0430\u044F \u043E\u0447\u0435\u0440\u0435\u0434\u044C \xB7 \u043A\u043E\u043D\u0442\u0435\u043D\u0442 \u0436\u0438\u0432\u043E\u0439, \u043D\u0435 \u0432\u0435\u0441\u044C \u043F\u043E\u0442\u043E\u043A" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "pda-modgrid", children: cards.map((c, i) => /* @__PURE__ */ jsxs("div", { className: "pda-modcard", children: [
          /* @__PURE__ */ jsxs("div", { className: "ph", children: [
            c.photo ? /* @__PURE__ */ jsx("img", { src: `img/${c.photo}.jpg`, alt: "" }) : /* @__PURE__ */ jsx("div", { style: { height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--pd-faint)" }, children: I.alert({ className: "pd-i28", fill: "none", stroke: "currentColor" }) }),
            /* @__PURE__ */ jsx("span", { className: "tag", children: "\u043D\u0430 \u0440\u0435\u0432\u044C\u044E \xB7 \u0436\u0438\u0432\u043E\u0435" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bd", children: [
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between" }, children: [
              /* @__PURE__ */ jsxs("b", { style: { fontSize: 13.5 }, children: [
                c.type,
                " \xB7 ",
                c.seller
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "pda-flag", children: [
                I.alert({ className: "pd-i13", fill: "none", stroke: "currentColor" }),
                c.reason
              ] })
            ] }),
            /* @__PURE__ */ jsx("p", { style: { fontSize: 13, color: "var(--pd-muted)", lineHeight: 1.45, margin: 0 }, children: c.txt })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "acts", children: [
            /* @__PURE__ */ jsx("button", { className: "pd-btn pd-btn--secondary pda-mini-act danger", style: { flex: 1 }, children: "\u0421\u043D\u044F\u0442\u044C\u2026" }),
            /* @__PURE__ */ jsx("button", { className: "pd-btn pda-mini-act ok", style: { flex: 1 }, children: "\u041E\u0441\u0442\u0430\u0432\u0438\u0442\u044C \u0432 \u043B\u0435\u043D\u0442\u0435" })
          ] })
        ] }, i)) })
      ] })
    ] })
  ] });
}
var vic = (Fn, cls = "pd-i18") => Fn({ className: cls, fill: "none", stroke: "currentColor" });
var sortI = (p) => /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", ...p, children: /* @__PURE__ */ jsx("path", { d: "m8 9 4-4 4 4M8 15l4 4 4-4" }) });
var cross = (p) => /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", ...p, children: /* @__PURE__ */ jsx("path", { d: "M6 6l12 12M18 6 6 18" }) });
var usersGl = (p) => /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", ...p, children: [
  /* @__PURE__ */ jsx("circle", { cx: "9", cy: "9", r: "3.5" }),
  /* @__PURE__ */ jsx("path", { d: "M3 19c0-3 2.7-5 6-5s6 2 6 5" }),
  /* @__PURE__ */ jsx("path", { d: "M16 7a3 3 0 0 1 0 6M22 19c0-2-1.3-3.6-3.5-4.3" })
] });
var Sel = ({ k, v, on }) => /* @__PURE__ */ jsxs("button", { className: `pda-sel${on ? " on" : ""}`, children: [
  k && /* @__PURE__ */ jsxs("span", { className: "k", children: [
    k,
    ":"
  ] }),
  v,
  vic(Ic.chev, "pd-i14")
] });
var Th = ({ children, sort, num }) => /* @__PURE__ */ jsx("th", { className: (sort ? "sortable " : "") + (num ? "num" : ""), children: sort ? /* @__PURE__ */ jsxs("span", { className: "so", children: [
  children,
  sortI({ className: "pd-i13" })
] }) : children });
var Cbx = ({ on }) => /* @__PURE__ */ jsx("span", { className: `pda-cbx${on ? " on" : ""}` });
var Risk = ({ lvl }) => {
  const m = { hi: "\u0432\u044B\u0441\u043E\u043A\u0438\u0439", md: "\u0441\u0440\u0435\u0434\u043D\u0438\u0439", lo: "\u043D\u0438\u0437\u043A\u0438\u0439" };
  return /* @__PURE__ */ jsxs("span", { className: `pda-risk ${lvl}`, children: [
    /* @__PURE__ */ jsx("span", { className: "pda-dot", style: { background: "currentColor" } }),
    m[lvl]
  ] });
};
var Pager = ({ page = 1, total = 8 }) => /* @__PURE__ */ jsxs("div", { className: "pda-pager", children: [
  /* @__PURE__ */ jsx("span", { children: "\u041F\u043E\u043A\u0430\u0437\u0430\u043D\u044B 1\u201320 \u0438\u0437 4 870" }),
  /* @__PURE__ */ jsxs("div", { style: { marginLeft: "auto", display: "flex", gap: 6 }, children: [
    /* @__PURE__ */ jsx("button", { className: "pg", children: "\u2039" }),
    [1, 2, 3].map((n) => /* @__PURE__ */ jsx("button", { className: `pg${n === page ? " on" : ""}`, children: n }, n)),
    /* @__PURE__ */ jsx("span", { style: { alignSelf: "center", color: "var(--pd-faint)" }, children: "\u2026" }),
    /* @__PURE__ */ jsx("button", { className: "pg", children: "244" }),
    /* @__PURE__ */ jsx("button", { className: "pg", children: "\u203A" })
  ] })
] });
function SkRows({ cols = 6, rows = 7 }) {
  return [...Array(rows)].map((_, r) => /* @__PURE__ */ jsx("tr", { children: [...Array(cols)].map((_2, c) => /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("div", { className: "pda-sk", style: { width: c === 0 ? "70%" : c === 1 ? "50%" : "40%" } }) }, c)) }, r));
}
function TableState({ kind }) {
  const map = {
    empty: { ic: usersGl, h: "\u041F\u043E\u043A\u0430 \u043D\u0435\u0442 \u0434\u0430\u043D\u043D\u044B\u0445", p: "\u0417\u0434\u0435\u0441\u044C \u043F\u043E\u044F\u0432\u044F\u0442\u0441\u044F \u0437\u0430\u043F\u0438\u0441\u0438, \u043A\u0430\u043A \u0442\u043E\u043B\u044C\u043A\u043E \u043E\u043D\u0438 \u0432\u043E\u0437\u043D\u0438\u043A\u043D\u0443\u0442 \u0432 \u0441\u0438\u0441\u0442\u0435\u043C\u0435." },
    noresults: { ic: Ic.search, h: "\u041D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E", p: "\u041F\u043E\u0434 \u0442\u0435\u043A\u0443\u0449\u0438\u0435 \u0444\u0438\u043B\u044C\u0442\u0440\u044B \u0438 \u043F\u043E\u0438\u0441\u043A \u043D\u0435\u0442 \u0441\u043E\u0432\u043F\u0430\u0434\u0435\u043D\u0438\u0439. \u0421\u0431\u0440\u043E\u0441\u044C\u0442\u0435 \u0444\u0438\u043B\u044C\u0442\u0440\u044B \u0438\u043B\u0438 \u0438\u0437\u043C\u0435\u043D\u0438\u0442\u0435 \u0437\u0430\u043F\u0440\u043E\u0441." },
    error: { ic: I.alert, h: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C", p: "\u0421\u0435\u0440\u0432\u0438\u0441 \u0434\u0430\u043D\u043D\u044B\u0445 \u043D\u0435 \u043E\u0442\u0432\u0435\u0442\u0438\u043B. \u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u0435 \u0437\u0430\u043F\u0440\u043E\u0441. \u0415\u0441\u043B\u0438 \u043E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u0432\u0442\u043E\u0440\u044F\u0435\u0442\u0441\u044F, \u043F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u0441\u0442\u0430\u0442\u0443\u0441 API.", err: true },
    offline: { ic: I.refresh, h: "\u041D\u0435\u0442 \u0441\u043E\u0435\u0434\u0438\u043D\u0435\u043D\u0438\u044F", p: "\u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u0438\u043D\u0442\u0435\u0440\u043D\u0435\u0442. \u0414\u0430\u043D\u043D\u044B\u0435 \u043E\u0431\u043D\u043E\u0432\u044F\u0442\u0441\u044F \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438 \u043F\u0440\u0438 \u0432\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0438 \u0441\u0432\u044F\u0437\u0438." }
  }[kind];
  return /* @__PURE__ */ jsxs("div", { className: `pda-state${map.err ? " error" : ""}`, children: [
    /* @__PURE__ */ jsx("div", { className: "gl", children: vic(map.ic, "pd-i28") }),
    /* @__PURE__ */ jsx("h3", { children: map.h }),
    /* @__PURE__ */ jsx("p", { children: map.p }),
    (kind === "error" || kind === "offline") && /* @__PURE__ */ jsx("div", { style: { marginTop: 16 }, children: /* @__PURE__ */ jsx(PdBtn, { variant: "secondary", icon: I.refresh, children: "\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u044C" }) }),
    kind === "noresults" && /* @__PURE__ */ jsx("div", { style: { marginTop: 16 }, children: /* @__PURE__ */ jsx(PdBtn, { variant: "ghost", children: "\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u0444\u0438\u043B\u044C\u0442\u0440\u044B" }) })
  ] });
}
var USERS = [
  ["w1.jpg", "\u041C\u0430\u0440\u0438\u043D\u0430 \u041A.", "\u041C\u043E\u0441\u043A\u0432\u0430", "iOS", 12, 4.9, 38, "2.18.\xB7\xB7.41", null, "active", "12.01.25"],
  ["w2.jpg", "\u0410\u043D\u044F \u041F.", "\u041C\u043E\u0441\u043A\u0432\u0430", "Web", 3, 4.7, 11, "95.71.\xB7\xB7.06", null, "active", "03.02.25"],
  ["w3.jpg", "\u0421\u043E\u043D\u044F \u041B.", "\u0421\u041F\u0431", "Android", 7, 4.2, 19, "2.18.\xB7\xB7.41", "multi", "review", "21.11.24"],
  ["w4.jpg", "\u0415\u043A\u0430\u0442\u0435\u0440\u0438\u043D\u0430 \u041B.", "\u041C\u043E\u0441\u043A\u0432\u0430", "iOS", 23, 4.9, 57, "176.9.\xB7\xB7.12", null, "active", "08.09.24"],
  ["w5.jpg", "\u042E\u043B\u044F \u0412.", "\u041A\u0430\u0437\u0430\u043D\u044C", "Web", 1, 3.6, 4, "2.18.\xB7\xB7.41", "multi", "blocked", "15.02.25"],
  ["w6.jpg", "\u041E\u043B\u044C\u0433\u0430 \u0420.", "\u041D\u043E\u0432\u043E\u0441\u0438\u0431\u0438\u0440\u0441\u043A", "iOS", 9, 4.8, 26, "81.30.\xB7\xB7.77", null, "active", "29.12.24"]
];
function AdminUsers({ state = "loaded", bulk = false, overlay }) {
  const top = /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs("div", { className: "pda-srch", style: { marginLeft: 0 }, children: [
    vic(Ic.search, "pd-i16"),
    "\u041F\u043E\u0438\u0441\u043A \u043F\u043E \u0438\u043C\u0435\u043D\u0438, \u0442\u0435\u043B\u0435\u0444\u043E\u043D\u0443 \u0438\u043B\u0438 ID"
  ] }) });
  return /* @__PURE__ */ jsxs(AdminShell, { active: "users", title: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0438", top, overlay, children: [
    /* @__PURE__ */ jsxs("div", { className: "pda-fbar", children: [
      /* @__PURE__ */ jsx(Sel, { k: "\u0413\u043E\u0440\u043E\u0434", v: "\u0412\u0441\u0435" }),
      /* @__PURE__ */ jsx(Sel, { k: "\u0421\u0442\u0430\u0442\u0443\u0441", v: "\u0410\u043A\u0442\u0438\u0432\u043D\u044B\u0435", on: true }),
      /* @__PURE__ */ jsx(Sel, { k: "\u041F\u043B\u0430\u0442\u0444\u043E\u0440\u043C\u0430", v: "\u0412\u0441\u0435" }),
      /* @__PURE__ */ jsx(Sel, { k: "\u0420\u0438\u0441\u043A", v: "\u041B\u044E\u0431\u043E\u0439" }),
      /* @__PURE__ */ jsx(Sel, { v: "\u0415\u0449\u0451 \u0444\u0438\u043B\u044C\u0442\u0440\u044B" }),
      /* @__PURE__ */ jsx("span", { className: "pda-count", children: "4 870 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0435\u0439 \xB7 \u043E\u0442\u0444\u0438\u043B\u044C\u0442\u0440\u043E\u0432\u0430\u043D\u043E 312" })
    ] }),
    bulk && /* @__PURE__ */ jsxs("div", { className: "pda-bulk", children: [
      "\u0412\u044B\u0431\u0440\u0430\u043D\u043E: 3",
      ` `,
      /* @__PURE__ */ jsx("span", { style: { opacity: 0.7, fontWeight: 500 }, children: "\xB7 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F \u043F\u0440\u0438\u043C\u0435\u043D\u044F\u044E\u0442\u0441\u044F \u043A \u0432\u044B\u0431\u0440\u0430\u043D\u043D\u044B\u043C" }),
      /* @__PURE__ */ jsxs("span", { className: "b", children: [
        /* @__PURE__ */ jsx("button", { children: "\u0421\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435" }),
        /* @__PURE__ */ jsx("button", { children: "\u0412 \u043E\u0447\u0435\u0440\u0435\u0434\u044C \u0430\u043D\u0442\u0438\u0444\u0440\u043E\u0434\u0430" }),
        /* @__PURE__ */ jsx("button", { className: "danger", children: "\u0417\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u0442\u044C\u2026" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "pda-tablewrap", children: [
      /* @__PURE__ */ jsxs("table", { className: "pda-table", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { className: "pda-check-cell", children: /* @__PURE__ */ jsx(Cbx, { on: bulk }) }),
          /* @__PURE__ */ jsx(Th, { sort: true, children: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C" }),
          /* @__PURE__ */ jsx(Th, { children: "\u0413\u043E\u0440\u043E\u0434" }),
          /* @__PURE__ */ jsx(Th, { children: "\u041F\u043B\u0430\u0442\u0444\u043E\u0440\u043C\u0430" }),
          /* @__PURE__ */ jsx(Th, { sort: true, num: true, children: "\u041E\u0431\u044A\u044F\u0432\u043B." }),
          /* @__PURE__ */ jsx(Th, { sort: true, num: true, children: "\u0420\u0435\u0439\u0442\u0438\u043D\u0433" }),
          /* @__PURE__ */ jsx(Th, { sort: true, num: true, children: "\u041E\u0442\u0437\u044B\u0432\u044B" }),
          /* @__PURE__ */ jsx(Th, { children: "\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0439 IP" }),
          /* @__PURE__ */ jsx(Th, { sort: true, children: "\u0421\u0442\u0430\u0442\u0443\u0441" }),
          /* @__PURE__ */ jsx(Th, { sort: true, children: "\u0420\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F" })
        ] }) }),
        /* @__PURE__ */ jsxs("tbody", { children: [
          state === "loading" && /* @__PURE__ */ jsx(SkRows, { cols: 10 }),
          state === "loaded" && USERS.map((u, i) => /* @__PURE__ */ jsxs("tr", { className: `clickable${bulk && i < 3 ? " sel" : ""}`, children: [
            /* @__PURE__ */ jsx("td", { className: "pda-check-cell", children: /* @__PURE__ */ jsx(Cbx, { on: bulk && i < 3 }) }),
            /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs("div", { className: "pda-u", children: [
              /* @__PURE__ */ jsx("span", { className: "av", children: /* @__PURE__ */ jsx("img", { src: `img/av/${u[0]}`, alt: "" }) }),
              /* @__PURE__ */ jsx("b", { children: u[1] })
            ] }) }),
            /* @__PURE__ */ jsx("td", { children: u[2] }),
            /* @__PURE__ */ jsx("td", { children: u[3] }),
            /* @__PURE__ */ jsx("td", { className: "num", children: u[4] }),
            /* @__PURE__ */ jsx("td", { className: "num", children: u[5] }),
            /* @__PURE__ */ jsx("td", { className: "num", children: u[6] }),
            /* @__PURE__ */ jsxs("td", { children: [
              /* @__PURE__ */ jsx("span", { className: "pda-ip", children: u[7] }),
              u[8] === "multi" && /* @__PURE__ */ jsxs("div", { className: "pda-flag", style: { marginTop: 3 }, children: [
                vic(I.alert, "pd-i12"),
                "\u043C\u0443\u043B\u044C\u0442\u0438-IP"
              ] })
            ] }),
            /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("span", { className: `pda-badge ${u[9]}`, children: { active: "\u0430\u043A\u0442\u0438\u0432\u0435\u043D", review: "\u043D\u0430 \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0435", blocked: "\u0437\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D" }[u[9]] }) }),
            /* @__PURE__ */ jsx("td", { style: { color: "var(--pd-muted)" }, children: u[10] })
          ] }, i))
        ] })
      ] }),
      state === "loaded" && /* @__PURE__ */ jsx(Pager, { page: 1 }),
      ["empty", "noresults", "error", "offline"].includes(state) && /* @__PURE__ */ jsx(TableState, { kind: state })
    ] })
  ] });
}
function AdminUserDrill() {
  const drill = /* @__PURE__ */ jsx("div", { className: "pda-drill-scrim", children: /* @__PURE__ */ jsxs("div", { className: "pda-drill", children: [
    /* @__PURE__ */ jsxs("div", { className: "pda-drill-top", children: [
      /* @__PURE__ */ jsx("b", { style: { fontSize: 15 }, children: "\u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0430 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F" }),
      /* @__PURE__ */ jsxs("span", { className: "pda-logged", children: [
        vic(I.lock, "pd-i12"),
        "\u0434\u043E\u0441\u0442\u0443\u043F \u043A \u041F\u0414\u043D \u043B\u043E\u0433\u0438\u0440\u0443\u0435\u0442\u0441\u044F"
      ] }),
      /* @__PURE__ */ jsx("button", { className: "x", children: cross({ className: "pd-i18" }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "pda-drill-bd", children: [
      /* @__PURE__ */ jsxs("div", { className: "pda-dhdr", children: [
        /* @__PURE__ */ jsx("span", { className: "av", children: /* @__PURE__ */ jsx("img", { src: "img/av/w4.jpg", alt: "" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "nm", children: [
            "\u0415\u043A\u0430\u0442\u0435\u0440\u0438\u043D\u0430 \u041B. ",
            /* @__PURE__ */ jsx("span", { className: "pda-badge active", style: { marginLeft: 6 }, children: "\u0430\u043A\u0442\u0438\u0432\u0435\u043D" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt", children: "ID 48213 \xB7 \u041C\u043E\u0441\u043A\u0432\u0430 \xB7 iOS \xB7 \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F 08.09.24" }),
          /* @__PURE__ */ jsx("div", { style: { marginTop: 7 }, children: /* @__PURE__ */ jsx(Risk, { lvl: "lo" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pda-dactions", children: [
        /* @__PURE__ */ jsx("button", { className: "pda-mini-act", children: "\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u0441\u0435\u0441\u0441\u0438\u0438" }),
        /* @__PURE__ */ jsx("button", { className: "pda-mini-act warn", children: "\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0434\u0430\u043D\u043D\u044B\u0435\u2026" }),
        /* @__PURE__ */ jsx("button", { className: "pda-mini-act danger", children: "\u0417\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u0442\u044C\u2026" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pda-dsec", children: [
        /* @__PURE__ */ jsxs("h4", { children: [
          "\u041A\u043E\u043D\u0442\u0430\u043A\u0442\u044B ",
          /* @__PURE__ */ jsxs("span", { className: "pda-logged", style: { marginLeft: 6 }, children: [
            vic(I.lock, "pd-i12"),
            "\u041F\u0414\u043D"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pda-kv", children: [
          /* @__PURE__ */ jsx("span", { className: "k", children: "\u0422\u0435\u043B\u0435\u0444\u043E\u043D" }),
          /* @__PURE__ */ jsx("span", { className: "v", children: "+7 999 \xB7\xB7\xB7-58-03" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pda-kv", children: [
          /* @__PURE__ */ jsx("span", { className: "k", children: "Email" }),
          /* @__PURE__ */ jsx("span", { className: "v", children: "katya@ya.ru" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pda-kv", children: [
          /* @__PURE__ */ jsx("span", { className: "k", children: "\u041F\u0440\u0438\u0432\u044F\u0437\u043A\u0438" }),
          /* @__PURE__ */ jsx("span", { className: "v", children: "\u042F\u043D\u0434\u0435\u043A\u0441 ID \xB7 VK ID" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pda-dsec", children: [
        /* @__PURE__ */ jsx("h4", { children: "\u0410\u043A\u0442\u0438\u0432\u043D\u043E\u0441\u0442\u044C" }),
        /* @__PURE__ */ jsxs("div", { className: "pda-kv", children: [
          /* @__PURE__ */ jsx("span", { className: "k", children: "\u041E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u0439" }),
          /* @__PURE__ */ jsx("span", { className: "v", children: "23 (4 \u0430\u043A\u0442\u0438\u0432\u043D\u044B\u0445)" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pda-kv", children: [
          /* @__PURE__ */ jsx("span", { className: "k", children: "\u0421\u0434\u0435\u043B\u043E\u043A" }),
          /* @__PURE__ */ jsx("span", { className: "v", children: "57 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043E \xB7 1 \u0436\u0430\u043B\u043E\u0431\u0430" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pda-kv", children: [
          /* @__PURE__ */ jsx("span", { className: "k", children: "\u0420\u0435\u0439\u0442\u0438\u043D\u0433" }),
          /* @__PURE__ */ jsx("span", { className: "v", children: "4.9 \xB7 57 \u043E\u0442\u0437\u044B\u0432\u043E\u0432" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pda-dsec", children: [
        /* @__PURE__ */ jsx("h4", { children: "IP \u0438 \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0430" }),
        /* @__PURE__ */ jsxs("div", { className: "pda-kv", children: [
          /* @__PURE__ */ jsxs("span", { className: "k", children: [
            /* @__PURE__ */ jsx("span", { className: "pda-ip", children: "176.9.\xB7\xB7.12" }),
            " \xB7 iPhone 15"
          ] }),
          /* @__PURE__ */ jsx("span", { className: "v", children: "\u0441\u0435\u0439\u0447\u0430\u0441" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pda-kv", children: [
          /* @__PURE__ */ jsxs("span", { className: "k", children: [
            /* @__PURE__ */ jsx("span", { className: "pda-ip", children: "176.9.\xB7\xB7.12" }),
            " \xB7 Chrome/macOS"
          ] }),
          /* @__PURE__ */ jsx("span", { className: "v", children: "2 \u0447 \u043D\u0430\u0437\u0430\u0434" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pda-kv", children: [
          /* @__PURE__ */ jsxs("span", { className: "k", children: [
            /* @__PURE__ */ jsx("span", { className: "pda-ip", children: "2.18.\xB7\xB7.41" }),
            " \xB7 Android"
          ] }),
          /* @__PURE__ */ jsx("span", { className: "v", children: "3 \u0434\u043D\u044F \u043D\u0430\u0437\u0430\u0434" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pda-dsec", children: [
        /* @__PURE__ */ jsx("h4", { children: "\u0418\u0441\u0442\u043E\u0440\u0438\u044F \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0439 (audit)" }),
        /* @__PURE__ */ jsxs("div", { className: "pda-audit", children: [
          /* @__PURE__ */ jsxs("div", { className: "pda-aud", children: [
            /* @__PURE__ */ jsx("span", { className: "dt muted" }),
            /* @__PURE__ */ jsxs("div", { className: "ct", children: [
              /* @__PURE__ */ jsx("b", { children: "\u0412\u0445\u043E\u0434 \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D" }),
              " \xB7 \u042F\u043D\u0434\u0435\u043A\u0441 ID",
              /* @__PURE__ */ jsx("div", { className: "when", children: "\u0441\u0435\u0433\u043E\u0434\u043D\u044F, 14:02 \xB7 176.9.\xB7\xB7.12" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "pda-aud", children: [
            /* @__PURE__ */ jsx("span", { className: "dt" }),
            /* @__PURE__ */ jsxs("div", { className: "ct", children: [
              /* @__PURE__ */ jsx("b", { children: "\u0418\u0437\u043C\u0435\u043D\u0451\u043D \u043F\u0440\u043E\u0444\u0438\u043B\u044C" }),
              " \u043E\u043F\u0435\u0440\u0430\u0442\u043E\u0440\u043E\u043C ",
              /* @__PURE__ */ jsx("i", { children: "moderator" }),
              /* @__PURE__ */ jsx("div", { className: "when", children: "02.06.25, 11:20 \xB7 \u043F\u0440\u0438\u0447\u0438\u043D\u0430: \u0437\u0430\u043F\u0440\u043E\u0441 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0438 #1841" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "pda-aud", children: [
            /* @__PURE__ */ jsx("span", { className: "dt danger" }),
            /* @__PURE__ */ jsxs("div", { className: "ct", children: [
              /* @__PURE__ */ jsx("b", { children: "\u041E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u0435 \u043E\u0442\u043A\u043B\u043E\u043D\u0435\u043D\u043E" }),
              " \xB7 \u043A\u043E\u043D\u0442\u0430\u043A\u0442 \u0432 \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u0438",
              /* @__PURE__ */ jsx("div", { className: "when", children: "28.05.25, 09:14" })
            ] })
          ] })
        ] })
      ] })
    ] })
  ] }) });
  return /* @__PURE__ */ jsx(AdminUsers, { state: "loaded", overlay: drill });
}
var LISTINGS = [
  ["1565695951564-007d8f297e48", "\u041F\u0438\u043E\u043D\u044B, \u0431\u043E\u043B\u044C\u0448\u043E\u0439 \u0431\u0443\u043A\u0435\u0442", "\u041A\u0430\u0442\u044F", "\u041C\u043E\u0441\u043A\u0432\u0430", 1190, "today", "active"],
  ["1531120364508-a6b656c3e78d", "\u0421\u0432\u0435\u0436\u0438\u0435 \u0440\u043E\u0437\u044B 25 \u0448\u0442", "\u042E\u043B\u044F", "\u041A\u0430\u0437\u0430\u043D\u044C", 990, "today", "flagged"],
  ["1522748906645-95d8adfd52c7", "\u0422\u044E\u043B\u044C\u043F\u0430\u043D\u044B \u043C\u0438\u043A\u0441", "\u0421\u043E\u043D\u044F", "\u0421\u041F\u0431", 650, "d1_2", "active"],
  ["1567696911980-2eed69a46042", "\u0420\u0430\u043D\u0443\u043D\u043A\u0443\u043B\u044E\u0441\u044B", "\u041E\u043B\u044C\u0433\u0430", "\u041D\u043E\u0432\u043E\u0441\u0438\u0431\u0438\u0440\u0441\u043A", 1450, "today", "active"],
  ["1561181286-d3fee7d55364", "\u0413\u043E\u0440\u0442\u0435\u043D\u0437\u0438\u044F", "\u041C\u0430\u0440\u0438\u043D\u0430", "\u041C\u043E\u0441\u043A\u0432\u0430", 2100, "d3_plus", "sold"]
];
function AdminListings({ state = "loaded" }) {
  const fresh = { today: ["\u0421\u0435\u0433\u043E\u0434\u043D\u044F", "var(--pd-fresh)"], d1_2: ["1\u20132 \u0434\u043D\u044F", "var(--pd-aging)"], d3_plus: ["3+ \u0434\u043D\u044F", "var(--pd-old)"] };
  const top = /* @__PURE__ */ jsxs("div", { className: "pda-srch", style: { marginLeft: 0 }, children: [
    vic(Ic.search, "pd-i16"),
    "\u041F\u043E\u0438\u0441\u043A \u043F\u043E \u043E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u044F\u043C"
  ] });
  return /* @__PURE__ */ jsxs(AdminShell, { active: "list", title: "\u041E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u044F", top, children: [
    /* @__PURE__ */ jsxs("div", { className: "pda-fbar", children: [
      /* @__PURE__ */ jsx(Sel, { k: "\u0413\u043E\u0440\u043E\u0434", v: "\u0412\u0441\u0435" }),
      /* @__PURE__ */ jsx(Sel, { k: "\u0421\u0442\u0430\u0442\u0443\u0441", v: "\u0412\u0441\u0435" }),
      /* @__PURE__ */ jsx(Sel, { k: "\u0421\u0432\u0435\u0436\u0435\u0441\u0442\u044C", v: "\u041B\u044E\u0431\u0430\u044F" }),
      /* @__PURE__ */ jsx(Sel, { k: "\u041C\u043E\u0434\u0435\u0440\u0430\u0446\u0438\u044F", v: "\u041D\u0430 \u0440\u0435\u0432\u044C\u044E (\u0444\u043B\u0430\u0433) \xB7 9", on: true }),
      /* @__PURE__ */ jsx("span", { className: "pda-count", children: "1 284 \u043E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u044F \xB7 \u043F\u0443\u0431\u043B\u0438\u043A\u0443\u044E\u0442\u0441\u044F \u0441\u0440\u0430\u0437\u0443" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "pda-tablewrap", children: [
      /* @__PURE__ */ jsxs("table", { className: "pda-table", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx(Th, { children: "\u0411\u0443\u043A\u0435\u0442" }),
          /* @__PURE__ */ jsx(Th, { children: "\u041F\u0440\u043E\u0434\u0430\u0432\u0435\u0446" }),
          /* @__PURE__ */ jsx(Th, { children: "\u0413\u043E\u0440\u043E\u0434" }),
          /* @__PURE__ */ jsx(Th, { sort: true, num: true, children: "\u0426\u0435\u043D\u0430" }),
          /* @__PURE__ */ jsx(Th, { children: "\u0421\u0432\u0435\u0436\u0435\u0441\u0442\u044C" }),
          /* @__PURE__ */ jsx(Th, { sort: true, children: "\u0421\u0442\u0430\u0442\u0443\u0441" }),
          /* @__PURE__ */ jsx("th", { style: { width: 120 } })
        ] }) }),
        /* @__PURE__ */ jsxs("tbody", { children: [
          state === "loading" && /* @__PURE__ */ jsx(SkRows, { cols: 7 }),
          state === "loaded" && LISTINGS.map((l, i) => /* @__PURE__ */ jsxs("tr", { className: "clickable", children: [
            /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs("div", { className: "pda-u", children: [
              /* @__PURE__ */ jsx("span", { className: "av", style: { borderRadius: 8, width: 40, height: 32 }, children: /* @__PURE__ */ jsx("img", { src: `img/${l[0]}.jpg`, alt: "" }) }),
              /* @__PURE__ */ jsx("b", { children: l[1] })
            ] }) }),
            /* @__PURE__ */ jsx("td", { children: l[2] }),
            /* @__PURE__ */ jsx("td", { children: l[3] }),
            /* @__PURE__ */ jsx("td", { className: "num", style: { fontWeight: 700 }, children: pdMoney(l[4]) }),
            /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs("span", { style: { display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5 }, children: [
              /* @__PURE__ */ jsx("span", { className: "pda-dot", style: { background: fresh[l[5]][1] } }),
              fresh[l[5]][0]
            ] }) }),
            /* @__PURE__ */ jsx("td", { children: l[6] === "flagged" ? /* @__PURE__ */ jsx("span", { className: "pda-badge held", children: "\u0436\u0438\u0432\u043E\u0435 \xB7 \u0444\u043B\u0430\u0433" }) : /* @__PURE__ */ jsx("span", { className: `pda-badge ${l[6] === "active" ? "active" : "sold"}`, children: { active: "\u0430\u043A\u0442\u0438\u0432\u043D\u043E", sold: "\u043F\u0440\u043E\u0434\u0430\u043D\u043E" }[l[6]] }) }),
            /* @__PURE__ */ jsx("td", { children: l[6] === "flagged" ? /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 6 }, children: [
              /* @__PURE__ */ jsx("button", { className: "pda-mini-act danger", children: "\u0421\u043D\u044F\u0442\u044C\u2026" }),
              /* @__PURE__ */ jsx("button", { className: "pda-mini-act ok", children: "\u041E\u0441\u0442\u0430\u0432\u0438\u0442\u044C \u0432 \u043B\u0435\u043D\u0442\u0435" })
            ] }) : /* @__PURE__ */ jsx("button", { className: "pda-mini-act", children: "\u041E\u0442\u043A\u0440\u044B\u0442\u044C" }) })
          ] }, i))
        ] })
      ] }),
      state === "loaded" && /* @__PURE__ */ jsx(Pager, {}),
      ["empty", "noresults", "error", "offline"].includes(state) && /* @__PURE__ */ jsx(TableState, { kind: state })
    ] })
  ] });
}
var DEALS = [
  ["#10482", "\u041C\u0430\u0440\u0438\u043D\u0430 \u2192 \u0410\u043D\u044F", "\u041C\u043E\u0441\u043A\u0432\u0430", 990, 99, "meeting", "03.06 14:02"],
  ["#10481", "\u041A\u0430\u0442\u044F \u2192 \u041B\u0435\u043D\u0430", "\u041C\u043E\u0441\u043A\u0432\u0430", 1190, 119, "done", "03.06 12:20"],
  ["#10478", "\u0421\u043E\u043D\u044F \u2192 \u042E\u043B\u044F", "\u0421\u041F\u0431", 850, 85, "problem", "02.06 19:41"],
  ["#10475", "\u0412\u0435\u0440\u0430 \u2192 \u041E\u043B\u044C\u0433\u0430", "\u041A\u0430\u0437\u0430\u043D\u044C", 590, 59, "cancelled", "02.06 10:08"],
  ["#10470", "\u041B\u0438\u0437\u0430 \u2192 \u041D\u0438\u043A\u0430", "\u041C\u043E\u0441\u043A\u0432\u0430", 1450, 145, "agreed", "01.06 21:15"],
  ["#10468", "\u0418\u0440\u0430 \u2192 \u041F\u043E\u043B\u044F", "\u0423\u0444\u0430", 720, 72, "cancelled", "01.06 16:33"]
];
var DEAL_ST = { agreed: "\u043D\u043E\u0432\u0430\u044F", meeting: "\u0438\u0434\u0451\u0442", done: "\u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0430", problem: "\u0436\u0430\u043B\u043E\u0431\u0430", cancelled: "\u043E\u0442\u043C\u0435\u043D\u0435\u043D\u0430" };
function AdminDeals({ state = "loaded", overlay }) {
  const top = /* @__PURE__ */ jsxs("div", { className: "pda-srch", style: { marginLeft: 0 }, children: [
    vic(Ic.search, "pd-i16"),
    "\u041F\u043E\u0438\u0441\u043A \u043F\u043E \u0441\u0434\u0435\u043B\u043A\u0435, \u0443\u0447\u0430\u0441\u0442\u043D\u0438\u043A\u0443 \u0438\u043B\u0438 ID"
  ] });
  return /* @__PURE__ */ jsxs(AdminShell, { active: "deals", title: "\u0421\u0434\u0435\u043B\u043A\u0438", top, overlay, children: [
    /* @__PURE__ */ jsxs("div", { className: "pda-fbar", children: [
      Object.entries(DEAL_ST).map(([k, v], i) => /* @__PURE__ */ jsx(Sel, { v, on: k === "problem" }, k)),
      /* @__PURE__ */ jsx("span", { className: "pda-count", children: "\u0421\u0434\u0435\u043B\u043E\u043A \u0437\u0430 \u043F\u0435\u0440\u0438\u043E\u0434: 1 284" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "pda-tablewrap", children: [
      /* @__PURE__ */ jsxs("table", { className: "pda-table", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx(Th, { sort: true, children: "ID" }),
          /* @__PURE__ */ jsx(Th, { children: "\u0423\u0447\u0430\u0441\u0442\u043D\u0438\u043A\u0438" }),
          /* @__PURE__ */ jsx(Th, { children: "\u0413\u043E\u0440\u043E\u0434" }),
          /* @__PURE__ */ jsx(Th, { sort: true, num: true, children: "\u0421\u0443\u043C\u043C\u0430" }),
          /* @__PURE__ */ jsx(Th, { sort: true, children: "\u0421\u0442\u0430\u0442\u0443\u0441" }),
          /* @__PURE__ */ jsx(Th, { children: "\u0421\u043E\u0437\u0434\u0430\u043D\u0430" }),
          /* @__PURE__ */ jsx("th", { style: { width: 160 } })
        ] }) }),
        /* @__PURE__ */ jsxs("tbody", { children: [
          state === "loading" && /* @__PURE__ */ jsx(SkRows, { cols: 7 }),
          state === "loaded" && DEALS.map((d, i) => /* @__PURE__ */ jsxs("tr", { className: "clickable", children: [
            /* @__PURE__ */ jsx("td", { style: { fontWeight: 700 }, children: d[0] }),
            /* @__PURE__ */ jsx("td", { children: d[1] }),
            /* @__PURE__ */ jsx("td", { children: d[2] }),
            /* @__PURE__ */ jsx("td", { className: "num", style: { fontWeight: 700 }, children: pdMoney(d[3]) }),
            /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("span", { className: `pda-badge ${d[5]}`, children: DEAL_ST[d[5]] }) }),
            /* @__PURE__ */ jsx("td", { style: { color: "var(--pd-muted)" }, children: d[6] }),
            /* @__PURE__ */ jsx("td", { children: ["meeting", "agreed", "problem"].includes(d[5]) ? /* @__PURE__ */ jsx("button", { className: "pda-mini-act danger", children: "\u041E\u0442\u043C\u0435\u043D\u0438\u0442\u044C\u2026" }) : /* @__PURE__ */ jsx("button", { className: "pda-mini-act", children: "\u0414\u0435\u0442\u0430\u043B\u0438" }) })
          ] }, i))
        ] })
      ] }),
      state === "loaded" && /* @__PURE__ */ jsx(Pager, {}),
      ["empty", "noresults", "error", "offline"].includes(state) && /* @__PURE__ */ jsx(TableState, { kind: state })
    ] })
  ] });
}
function AdminDealConfirm({ phase = "confirm" }) {
  let modal;
  if (phase === "success") {
    modal = /* @__PURE__ */ jsx("div", { className: "pda-modal-scrim", children: /* @__PURE__ */ jsxs("div", { className: "pda-modal success", children: [
      /* @__PURE__ */ jsxs("div", { className: "pda-modal-ok", children: [
        /* @__PURE__ */ jsx("div", { className: "gl", children: vic(I.check, "pd-i28") }),
        /* @__PURE__ */ jsx("h3", { style: { marginBottom: 6 }, children: "\u0421\u0434\u0435\u043B\u043A\u0430 \u043E\u0442\u043C\u0435\u043D\u0435\u043D\u0430" }),
        /* @__PURE__ */ jsx("p", { style: { color: "var(--pd-muted)", fontSize: 13.5, lineHeight: 1.5 }, children: "\u0421\u0434\u0435\u043B\u043A\u0430 \u0441\u043D\u044F\u0442\u0430, \u043E\u0431\u0435 \u0441\u0442\u043E\u0440\u043E\u043D\u044B \u043F\u043E\u043B\u0443\u0447\u0430\u0442 \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u0435. \u0417\u0430\u043F\u0438\u0441\u044C \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0430 \u0432 audit-log." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mf", style: { paddingTop: 0 }, children: /* @__PURE__ */ jsx(PdBtn, { variant: "secondary", block: true, children: "\u0417\u0430\u043A\u0440\u044B\u0442\u044C" }) })
    ] }) });
  } else {
    const inflight = phase === "inflight";
    modal = /* @__PURE__ */ jsx("div", { className: "pda-modal-scrim", children: /* @__PURE__ */ jsxs("div", { className: "pda-modal", children: [
      /* @__PURE__ */ jsxs("div", { className: "mh", children: [
        /* @__PURE__ */ jsx("div", { className: "gl danger", children: vic(I.alert, "pd-i24") }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { children: "\u041E\u0442\u043C\u0435\u043D\u0438\u0442\u044C \u0441\u0434\u0435\u043B\u043A\u0443 #10482?" }),
          /* @__PURE__ */ jsx("p", { children: "\u041C\u0430\u0440\u0438\u043D\u0430 \u2192 \u0410\u043D\u044F \xB7 990 \u20BD. \u041E\u0442\u043C\u0435\u043D\u0430 \u0441\u043D\u0438\u043C\u0435\u0442 \u0441\u0434\u0435\u043B\u043A\u0443, \u043E\u0431\u0435 \u0441\u0442\u043E\u0440\u043E\u043D\u044B \u043F\u043E\u043B\u0443\u0447\u0430\u0442 \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u0435. \u0414\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \u043D\u0435\u043E\u0431\u0440\u0430\u0442\u0438\u043C\u043E." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb", children: [
        /* @__PURE__ */ jsxs("label", { className: "fl", children: [
          "\u041F\u0440\u0438\u0447\u0438\u043D\u0430 \u043E\u0442\u043C\u0435\u043D\u044B ",
          /* @__PURE__ */ jsx("span", { style: { color: "var(--pd-danger)" }, children: "*" }),
          " \xB7 \u043F\u043E\u043F\u0430\u0434\u0451\u0442 \u0432 audit-log"
        ] }),
        /* @__PURE__ */ jsx("textarea", { rows: 3, defaultValue: "\u041F\u0440\u043E\u0434\u0430\u0432\u0435\u0446 \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D 48 \u0447, \u0431\u0443\u043A\u0435\u0442 \u043D\u0435\u0430\u043A\u0442\u0443\u0430\u043B\u0435\u043D. \u041E\u0431\u0440\u0430\u0449\u0435\u043D\u0438\u0435 \u043F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u044F #1902." }),
        /* @__PURE__ */ jsxs("div", { className: "pda-4eyes", children: [
          vic(I.shield, "pd-i16"),
          "\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \u0444\u0438\u043A\u0441\u0438\u0440\u0443\u0435\u0442\u0441\u044F \u0432 audit-log."
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mf", children: [
        /* @__PURE__ */ jsx(PdBtn, { variant: "ghost", block: true, disabled: inflight, children: "\u041E\u0442\u043C\u0435\u043D\u0430" }),
        /* @__PURE__ */ jsx(PdBtn, { variant: "danger", block: true, loading: inflight, disabled: inflight, children: inflight ? "\u041E\u0442\u043C\u0435\u043D\u044F\u0435\u043C\u2026" : "\u041E\u0442\u043C\u0435\u043D\u0438\u0442\u044C \u0441\u0434\u0435\u043B\u043A\u0443" })
      ] })
    ] }) });
  }
  return /* @__PURE__ */ jsx(AdminDeals, { state: "loaded", overlay: /* @__PURE__ */ jsxs(Fragment, { children: [
    modal,
    phase === "success" && /* @__PURE__ */ jsx(AdminToast, { children: "\u0421\u0434\u0435\u043B\u043A\u0430 #10482 \u043E\u0442\u043C\u0435\u043D\u0435\u043D\u0430" })
  ] }) });
}
function AdminFinance({ state = "loaded" }) {
  const top = /* @__PURE__ */ jsxs("div", { className: "pda-period", style: { marginLeft: "auto" }, children: [
    /* @__PURE__ */ jsx("button", { children: "\u0414\u0435\u043D\u044C" }),
    /* @__PURE__ */ jsx("button", { children: "\u041D\u0435\u0434\u0435\u043B\u044F" }),
    /* @__PURE__ */ jsx("button", { className: "on", children: "\u041C\u0435\u0441\u044F\u0446" }),
    /* @__PURE__ */ jsx("button", { children: "\u041F\u0435\u0440\u0438\u043E\u0434" })
  ] });
  const byStatus = [
    ["\u0417\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043E", "1 142", "ok"],
    ["\u0418\u0434\u0451\u0442 \u0441\u0435\u0439\u0447\u0430\u0441", "86", "ok"],
    ["\u0416\u0430\u043B\u043E\u0431\u044B", "3", "warn"],
    ["\u041E\u0442\u043C\u0435\u043D\u0435\u043D\u043E", "41", "ok"]
  ];
  return /* @__PURE__ */ jsx(AdminShell, { active: "fin", title: "\u0424\u0438\u043D\u0430\u043D\u0441\u044B", top, children: state === "loading" ? /* @__PURE__ */ jsx("div", { className: "pda-finrow", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxs("div", { className: "pda-finbig", children: [
    /* @__PURE__ */ jsx("div", { className: "pda-sk", style: { width: "50%", height: 14 } }),
    /* @__PURE__ */ jsx("div", { className: "pda-sk", style: { width: "70%", height: 30, marginTop: 12 } })
  ] }, i)) }) : /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "pda-finrow", children: [
      /* @__PURE__ */ jsxs("div", { className: "pda-finbig accent", children: [
        /* @__PURE__ */ jsx("div", { className: "lab", children: "\u041E\u0431\u043E\u0440\u043E\u0442 \u0441\u0434\u0435\u043B\u043E\u043A \u0437\u0430 \u043C\u0435\u0441\u044F\u0446" }),
        /* @__PURE__ */ jsx("div", { className: "val", children: "3,24 \u043C\u043B\u043D \u20BD" }),
        /* @__PURE__ */ jsx("div", { className: "sub", children: "\u043E\u0446\u0435\u043D\u043A\u0430 \u043F\u043E \u0437\u0430\u0432\u0435\u0440\u0448\u0451\u043D\u043D\u044B\u043C \xB7 \u2191 14%" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pda-finbig", children: [
        /* @__PURE__ */ jsx("div", { className: "lab", children: "\u0417\u0430\u0432\u0435\u0440\u0448\u0451\u043D\u043D\u044B\u0445 \u0441\u0434\u0435\u043B\u043E\u043A" }),
        /* @__PURE__ */ jsx("div", { className: "val", children: "1 142" }),
        /* @__PURE__ */ jsx("div", { className: "sub", children: "\u0437\u0430 \u043C\u0435\u0441\u044F\u0446 \xB7 \u2191 12%" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pda-finbig", children: [
        /* @__PURE__ */ jsx("div", { className: "lab", children: "\u0421\u0440\u0435\u0434\u043D\u0438\u0439 \u0447\u0435\u043A" }),
        /* @__PURE__ */ jsx("div", { className: "val", children: "1 040 \u20BD" }),
        /* @__PURE__ */ jsx("div", { className: "sub", children: "\u043C\u0435\u0434\u0438\u0430\u043D\u0430 950 \u20BD" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "pda-panel", style: { display: "flex", alignItems: "flex-start", gap: 12, background: "var(--pd-warn-soft)", border: "none" }, children: [
      vic(I.info, "pd-i20"),
      /* @__PURE__ */ jsx("div", { style: { fontSize: 13.5, color: "#7a5a16", lineHeight: 1.5 }, children: "\u041F\u043B\u0430\u0442\u0435\u0436\u0438 \u0438\u0434\u0443\u0442 \u043C\u0435\u0436\u0434\u0443 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F\u043C\u0438 \u043D\u0430\u043F\u0440\u044F\u043C\u0443\u044E, \u043F\u043B\u043E\u0449\u0430\u0434\u043A\u0430 \u0438\u0445 \u043D\u0435 \u043E\u0431\u0440\u0430\u0431\u0430\u0442\u044B\u0432\u0430\u0435\u0442 \u0438 \u043D\u0435 \u0445\u0440\u0430\u043D\u0438\u0442. \u041A\u043E\u043C\u0438\u0441\u0441\u0438\u044F, \u0432\u044B\u043F\u043B\u0430\u0442\u044B \u0438 \u0441\u0432\u0435\u0440\u043A\u0430 \u043F\u043E\u044F\u0432\u044F\u0442\u0441\u044F \u043F\u043E\u0441\u043B\u0435 \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u044F \u043C\u043E\u043D\u0435\u0442\u0438\u0437\u0430\u0446\u0438\u0438." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "pda-row2", children: [
      /* @__PURE__ */ jsxs("div", { className: "pda-panel", children: [
        /* @__PURE__ */ jsx("h3", { children: "\u041E\u0431\u043E\u0440\u043E\u0442 \u0441\u0434\u0435\u043B\u043E\u043A \u043F\u043E \u043C\u0435\u0441\u044F\u0446\u0430\u043C" }),
        /* @__PURE__ */ jsx("div", { className: "psub", children: "\u20BD \xB7 \u043E\u0446\u0435\u043D\u043A\u0430 \u043F\u043E \u0437\u0430\u0432\u0435\u0440\u0448\u0451\u043D\u043D\u044B\u043C" }),
        /* @__PURE__ */ jsx("div", { className: "pda-bars", children: ["\u042F\u043D\u0432", "\u0424\u0435\u0432", "\u041C\u0430\u0440", "\u0410\u043F\u0440", "\u041C\u0430\u0439", "\u0418\u044E\u043D"].map((m, i) => {
          const g = [55, 62, 70, 80, 88, 100][i];
          return /* @__PURE__ */ jsxs("div", { className: "b", children: [
            /* @__PURE__ */ jsx("div", { className: "bset", children: /* @__PURE__ */ jsx("div", { className: "bar", style: { height: g + "%", background: "var(--pd-primary)" } }) }),
            /* @__PURE__ */ jsx("div", { className: "t", children: m })
          ] }, m);
        }) }),
        /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: 16, marginTop: 14, fontSize: 12, color: "var(--pd-muted)" }, children: /* @__PURE__ */ jsxs("span", { style: { display: "inline-flex", alignItems: "center", gap: 6 }, children: [
          /* @__PURE__ */ jsx("i", { style: { width: 10, height: 10, borderRadius: 3, background: "var(--pd-primary)" } }),
          "\u041E\u0431\u043E\u0440\u043E\u0442 \u0441\u0434\u0435\u043B\u043E\u043A"
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pda-panel", children: [
        /* @__PURE__ */ jsx("h3", { children: "\u0421\u0434\u0435\u043B\u043A\u0438 \u043F\u043E \u0441\u0442\u0430\u0442\u0443\u0441\u0430\u043C" }),
        /* @__PURE__ */ jsx("div", { className: "psub", children: "\u0437\u0430 \u0442\u0435\u043A\u0443\u0449\u0438\u0439 \u043C\u0435\u0441\u044F\u0446" }),
        /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: 0 }, children: byStatus.map(([n, v, st], i) => /* @__PURE__ */ jsxs("div", { className: "pda-kv", style: { borderBottom: "1px solid var(--pd-border)", padding: "10px 0" }, children: [
          /* @__PURE__ */ jsx("span", { className: "k", children: n }),
          /* @__PURE__ */ jsx("span", { className: "v", style: { color: st === "warn" ? "var(--pd-warn)" : "var(--pd-text)" }, children: v })
        ] }, i)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "pda-panel", style: { display: "flex", alignItems: "center", gap: 14 }, children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { style: { marginBottom: 2 }, children: "\u042D\u043A\u0441\u043F\u043E\u0440\u0442 \u0437\u0430 \u043F\u0435\u0440\u0438\u043E\u0434" }),
        /* @__PURE__ */ jsx("div", { className: "psub", style: { margin: 0 }, children: "CSV / XLSX \xB7 \u0441\u0434\u0435\u043B\u043A\u0438, \u0441\u0442\u0430\u0442\u0443\u0441\u044B, \u0433\u043E\u0440\u043E\u0434\u0430, \u0441\u0443\u043C\u043C\u044B" })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { marginLeft: "auto", display: "flex", gap: 9 }, children: [
        /* @__PURE__ */ jsx(PdBtn, { variant: "secondary", children: "\u042D\u043A\u0441\u043F\u043E\u0440\u0442 CSV" }),
        /* @__PURE__ */ jsx(PdBtn, { variant: "secondary", children: "\u042D\u043A\u0441\u043F\u043E\u0440\u0442 XLSX" })
      ] })
    ] })
  ] }) });
}
function AdminFraud({ state = "loaded" }) {
  const top = /* @__PURE__ */ jsxs("div", { className: "pda-srch", style: { marginLeft: 0 }, children: [
    vic(Ic.search, "pd-i16"),
    "\u041F\u043E\u0438\u0441\u043A \u043F\u043E \u0441\u0438\u0433\u043D\u0430\u043B\u0430\u043C \u0438 \u043A\u043B\u0430\u0441\u0442\u0435\u0440\u0430\u043C"
  ] });
  const signals = [
    { lvl: "hi", sc: 92, ttl: "\u041C\u0443\u043B\u044C\u0442\u0438-\u0430\u043A\u043A\u0430\u0443\u043D\u0442\u044B \u043F\u043E \u043E\u0434\u043D\u043E\u043C\u0443 IP", tags: ["IP-\u043A\u043B\u0430\u0441\u0442\u0435\u0440", "3 \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0430"], desc: "\u041D\u0430 IP 2.18.\xB7\xB7.41: \u0421\u043E\u043D\u044F \u041B., \u042E\u043B\u044F \u0412. \u0438 \u0435\u0449\u0451 1 \u0430\u043A\u043A\u0430\u0443\u043D\u0442. \u0412\u0437\u0430\u0438\u043C\u043D\u044B\u0435 \u043B\u0430\u0439\u043A\u0438 \u0438 \u043E\u0442\u0437\u044B\u0432\u044B \u043C\u0435\u0436\u0434\u0443 \u0441\u0432\u044F\u0437\u0430\u043D\u043D\u044B\u043C\u0438 \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0430\u043C\u0438." },
    { lvl: "hi", sc: 88, ttl: "\u041D\u0430\u043A\u0440\u0443\u0442\u043A\u0430 \u043E\u0442\u0437\u044B\u0432\u043E\u0432 (self-dealing)", tags: ["\u041E\u0442\u0437\u044B\u0432\u044B", "\u0433\u0440\u0430\u0444 \u0441\u0434\u0435\u043B\u043E\u043A"], desc: "\u0426\u0435\u043F\u043E\u0447\u043A\u0430 \u0441\u0434\u0435\u043B\u043E\u043A \u043F\u043E \u043A\u0440\u0443\u0433\u0443 \u043C\u0435\u0436\u0434\u0443 3 \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0430\u043C\u0438 \u0441 \u043F\u043E\u043B\u043E\u0436\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u043C\u0438 \u043E\u0442\u0437\u044B\u0432\u0430\u043C\u0438 \u0431\u0435\u0437 \u0440\u0435\u0430\u043B\u044C\u043D\u044B\u0445 \u0432\u044B\u043F\u043B\u0430\u0442 \u043D\u0430 \u0432\u043D\u0435\u0448\u043D\u0438\u0435 \u043A\u0430\u0440\u0442\u044B." },
    { lvl: "md", sc: 64, ttl: "\u041F\u043E\u0432\u0442\u043E\u0440\u043D\u044B\u0435 \u0436\u0430\u043B\u043E\u0431\u044B \u043D\u0430 \u043F\u0440\u043E\u0434\u0430\u0432\u0446\u0430", tags: ["\u0416\u0430\u043B\u043E\u0431\u044B", "3 \u0437\u0430 14\u0434"], desc: "\u041D\u0430 \u043E\u0434\u043D\u043E\u0433\u043E \u043F\u0440\u043E\u0434\u0430\u0432\u0446\u0430 3 \u0436\u0430\u043B\u043E\u0431\u044B \u0437\u0430 14 \u0434\u043D\u0435\u0439 \u2014 \u043F\u0430\u0442\u0442\u0435\u0440\u043D \u043D\u0430 \u043E\u0434\u043D\u0443 \u043A\u0430\u0440\u0442\u0443 \xB7\xB7\xB77781 \u0437\u0430 \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0435 14 \u0434\u043D\u0435\u0439." },
    { lvl: "md", sc: 57, ttl: "\u041F\u0435\u0440\u0435\u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u043D\u0438\u0435 \u0444\u043E\u0442\u043E", tags: ["\u0424\u043E\u0442\u043E", "perceptual hash"], desc: "\u041E\u0434\u0438\u043D\u0430\u043A\u043E\u0432\u044B\u0435 \u0444\u043E\u0442\u043E \u0431\u0443\u043A\u0435\u0442\u0430 \u0432 4 \u0430\u043A\u0442\u0438\u0432\u043D\u044B\u0445 \u043E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u044F\u0445 \u0440\u0430\u0437\u043D\u044B\u0445 \u043F\u0440\u043E\u0434\u0430\u0432\u0446\u043E\u0432 (\u0441\u043E\u0432\u043F\u0430\u0434\u0435\u043D\u0438\u0435 \u0445\u044D\u0448\u0430 98%)." },
    { lvl: "lo", sc: 34, ttl: "\u0410\u043D\u043E\u043C\u0430\u043B\u0438\u044F \u0446\u0435\u043D\u044B", tags: ["\u0426\u0435\u043D\u0430"], desc: "\u0411\u0443\u043A\u0435\u0442 \u0437\u0430 120 \u20BD \u043F\u0440\u0438 \u043C\u0435\u0434\u0438\u0430\u043D\u0435 \u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u0438 950 \u20BD, \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u0430\u044F \u043F\u0440\u0438\u043C\u0430\u043D\u043A\u0430." }
  ];
  return /* @__PURE__ */ jsxs(AdminShell, { active: "fraud", title: "\u0410\u043D\u0442\u0438\u0444\u0440\u043E\u0434", top, children: [
    /* @__PURE__ */ jsxs("div", { className: "pda-fbar", children: [
      /* @__PURE__ */ jsx(Sel, { k: "\u0420\u0438\u0441\u043A", v: "\u0412\u044B\u0441\u043E\u043A\u0438\u0439 + \u0441\u0440\u0435\u0434\u043D\u0438\u0439", on: true }),
      /* @__PURE__ */ jsx(Sel, { k: "\u0422\u0438\u043F", v: "\u0412\u0441\u0435 \u043C\u0435\u0442\u043E\u0434\u0438\u043A\u0438" }),
      /* @__PURE__ */ jsx(Sel, { v: "\u0417\u0430 30 \u0434\u043D\u0435\u0439" }),
      /* @__PURE__ */ jsx("span", { className: "pda-count", children: "\u041E\u0442\u043A\u0440\u044B\u0442\u044B\u0445 \u0441\u0438\u0433\u043D\u0430\u043B\u043E\u0432: 7 \xB7 \u043A\u043B\u0430\u0441\u0442\u0435\u0440\u043E\u0432: 2" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "pda-row2", style: { gridTemplateColumns: "1.5fr 1fr" }, children: [
      /* @__PURE__ */ jsx("div", { className: "pda-fraudgrid", children: state === "loading" ? [0, 1, 2].map((i) => /* @__PURE__ */ jsxs("div", { className: "pda-signal", children: [
        /* @__PURE__ */ jsx("div", { className: "pda-sk", style: { width: 52, height: 52, borderRadius: 13 } }),
        /* @__PURE__ */ jsxs("div", { style: { flex: 1 }, children: [
          /* @__PURE__ */ jsx("div", { className: "pda-sk", style: { width: "60%", height: 15 } }),
          /* @__PURE__ */ jsx("div", { className: "pda-sk", style: { width: "90%", height: 12, marginTop: 8 } })
        ] })
      ] }, i)) : signals.map((s, i) => /* @__PURE__ */ jsxs("div", { className: `pda-signal ${s.lvl}`, children: [
        /* @__PURE__ */ jsxs("div", { className: "sco", children: [
          s.sc,
          /* @__PURE__ */ jsx("small", { children: "RISK" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mid", children: [
          /* @__PURE__ */ jsx("div", { className: "ttl", children: s.ttl }),
          /* @__PURE__ */ jsx("div", { className: "desc", children: s.desc }),
          /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: 6, marginTop: 8 }, children: s.tags.map((t) => /* @__PURE__ */ jsx("span", { className: "pda-tag", children: t }, t)) }),
          /* @__PURE__ */ jsxs("div", { className: "acts", children: [
            /* @__PURE__ */ jsx("button", { className: "pda-mini-act", children: "\u0412 \u043E\u0447\u0435\u0440\u0435\u0434\u044C" }),
            /* @__PURE__ */ jsx("button", { className: "pda-mini-act warn", children: "\u041E\u0433\u0440\u0430\u043D\u0438\u0447\u0438\u0442\u044C" }),
            /* @__PURE__ */ jsx("button", { className: "pda-mini-act danger", children: "\u0417\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u0442\u044C\u2026" })
          ] })
        ] })
      ] }, i)) }),
      /* @__PURE__ */ jsxs("div", { className: "pda-panel", children: [
        /* @__PURE__ */ jsx("h3", { children: "\u041A\u043B\u0430\u0441\u0442\u0435\u0440 \u043F\u043E IP" }),
        /* @__PURE__ */ jsx("div", { className: "psub", children: "\u0421\u0432\u044F\u0437\u043A\u0430 \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u043E\u0432 \xB7 2.18.\xB7\xB7.41" }),
        /* @__PURE__ */ jsxs("div", { className: "pda-cluster", children: [
          /* @__PURE__ */ jsx("div", { className: "hub", children: /* @__PURE__ */ jsxs("span", { className: "ipnode", children: [
            vic(I.shield, "pd-i14"),
            "2.18.\xB7\xB7.41"
          ] }) }),
          /* @__PURE__ */ jsx("span", { className: "pda-clines" }),
          /* @__PURE__ */ jsxs("div", { className: "nodes", children: [
            /* @__PURE__ */ jsxs("div", { className: "pda-cnode flag", children: [
              /* @__PURE__ */ jsx("span", { className: "av", children: /* @__PURE__ */ jsx("img", { src: "img/av/w3.jpg", alt: "" }) }),
              "\u0421\u043E\u043D\u044F \u041B."
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "pda-cnode flag", children: [
              /* @__PURE__ */ jsx("span", { className: "av", children: /* @__PURE__ */ jsx("img", { src: "img/av/w5.jpg", alt: "" }) }),
              "\u042E\u043B\u044F \u0412."
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "pda-cnode", children: [
              /* @__PURE__ */ jsx("span", { className: "av", children: /* @__PURE__ */ jsx("img", { src: "img/av/w2.jpg", alt: "" }) }),
              "\u0410\u043A\u043A\u0430\u0443\u043D\u0442 #5120"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { style: { marginTop: 14, fontSize: 12, color: "var(--pd-muted)", lineHeight: 1.5 }, children: "\u0412\u0437\u0430\u0438\u043C\u043D\u044B\u0435 \u043E\u0442\u0437\u044B\u0432\u044B: 6 \xB7 \u043E\u0431\u0449\u0438\u0445 \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432: 2 \xB7 \u0441\u043E\u0432\u043F\u0430\u0434\u0435\u043D\u0438\u0435 \u043F\u043E\u0432\u0435\u0434\u0435\u043D\u0438\u044F: \u0432\u044B\u0441\u043E\u043A\u043E\u0435." })
        ] }),
        /* @__PURE__ */ jsx("div", { style: { marginTop: 12 }, children: /* @__PURE__ */ jsx(PdBtn, { variant: "danger", block: true, icon: I.shield, children: "\u0417\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u043A\u043B\u0430\u0441\u0442\u0435\u0440\u2026" }) })
      ] })
    ] })
  ] });
}
function AdminReports({ state = "loaded" }) {
  const reps = [
    ["#R-882", "\u041E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u0435", "\u041F\u0438\u043E\u043D\u044B, \u0431\u043E\u043B\u044C\u0448\u043E\u0439 \u0431\u0443\u043A\u0435\u0442", "\u0421\u043F\u0430\u043C / \u043A\u043E\u043D\u0442\u0430\u043A\u0442\u044B \u0432 \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u0438", "\u0410\u043D\u044F \u041F.", "new", "5 \u043C\u0438\u043D \u043D\u0430\u0437\u0430\u0434"],
    ["#R-879", "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C", "\u042E\u043B\u044F \u0412.", "\u041E\u0441\u043A\u043E\u0440\u0431\u043B\u0435\u043D\u0438\u044F \u0432 \u0447\u0430\u0442\u0435", "\u041B\u0435\u043D\u0430 \u041A.", "review", "1 \u0447 \u043D\u0430\u0437\u0430\u0434"],
    ["#R-877", "\u041E\u0442\u0437\u044B\u0432", "\xAB\u2026\xBB \u043A \u0441\u0434\u0435\u043B\u043A\u0435 #10478", "\u041D\u0435\u0434\u043E\u0441\u0442\u043E\u0432\u0435\u0440\u043D\u044B\u0439 \u043E\u0442\u0437\u044B\u0432", "\u0421\u043E\u043D\u044F \u041B.", "new", "3 \u0447 \u043D\u0430\u0437\u0430\u0434"],
    ["#R-870", "\u041E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u0435", "\u0421\u0432\u0435\u0436\u0438\u0435 \u0440\u043E\u0437\u044B 25 \u0448\u0442", "\u041D\u0435\u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0438\u0435 \u0444\u043E\u0442\u043E", "\u041C\u0430\u0440\u0438\u043D\u0430 \u041A.", "resolved", "\u0432\u0447\u0435\u0440\u0430"]
  ];
  const st = { new: ["\u043D\u043E\u0432\u0430\u044F", "problem"], review: ["\u0432 \u0440\u0430\u0431\u043E\u0442\u0435", "held"], resolved: ["\u0440\u0435\u0448\u0435\u043D\u0430", "done"] };
  const top = /* @__PURE__ */ jsxs("div", { className: "pda-srch", style: { marginLeft: 0 }, children: [
    vic(Ic.search, "pd-i16"),
    "\u041F\u043E\u0438\u0441\u043A \u043F\u043E \u0436\u0430\u043B\u043E\u0431\u0430\u043C"
  ] });
  return /* @__PURE__ */ jsxs(AdminShell, { active: "reports", title: "\u0416\u0430\u043B\u043E\u0431\u044B \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0435\u0439", top, children: [
    /* @__PURE__ */ jsxs("div", { className: "pda-fbar", children: [
      /* @__PURE__ */ jsx(Sel, { k: "\u0421\u0442\u0430\u0442\u0443\u0441", v: "\u041D\u043E\u0432\u044B\u0435 + \u0432 \u0440\u0430\u0431\u043E\u0442\u0435", on: true }),
      /* @__PURE__ */ jsx(Sel, { k: "\u041D\u0430 \u0447\u0442\u043E", v: "\u0412\u0441\u0435" }),
      /* @__PURE__ */ jsx(Sel, { k: "\u041F\u0440\u0438\u0447\u0438\u043D\u0430", v: "\u041B\u044E\u0431\u0430\u044F" }),
      /* @__PURE__ */ jsx("span", { className: "pda-count", children: "\u041E\u0442\u043A\u0440\u044B\u0442\u044B\u0445 \u0436\u0430\u043B\u043E\u0431: 3" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "pda-tablewrap", children: [
      /* @__PURE__ */ jsxs("table", { className: "pda-table", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx(Th, { children: "ID" }),
          /* @__PURE__ */ jsx(Th, { children: "\u041D\u0430 \u0447\u0442\u043E" }),
          /* @__PURE__ */ jsx(Th, { children: "\u041E\u0431\u044A\u0435\u043A\u0442" }),
          /* @__PURE__ */ jsx(Th, { children: "\u041F\u0440\u0438\u0447\u0438\u043D\u0430" }),
          /* @__PURE__ */ jsx(Th, { children: "\u0417\u0430\u044F\u0432\u0438\u0442\u0435\u043B\u044C" }),
          /* @__PURE__ */ jsx(Th, { sort: true, children: "\u0421\u0442\u0430\u0442\u0443\u0441" }),
          /* @__PURE__ */ jsx(Th, { children: "\u041A\u043E\u0433\u0434\u0430" }),
          /* @__PURE__ */ jsx("th", { style: { width: 150 } })
        ] }) }),
        /* @__PURE__ */ jsxs("tbody", { children: [
          state === "loading" && /* @__PURE__ */ jsx(SkRows, { cols: 7 }),
          state === "empty" ? null : state === "loaded" && reps.map((r, i) => /* @__PURE__ */ jsxs("tr", { className: "clickable", children: [
            /* @__PURE__ */ jsx("td", { style: { fontWeight: 700 }, children: r[0] }),
            /* @__PURE__ */ jsx("td", { children: r[1] }),
            /* @__PURE__ */ jsx("td", { style: { maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: r[2] }),
            /* @__PURE__ */ jsx("td", { children: r[3] }),
            /* @__PURE__ */ jsx("td", { children: r[4] }),
            /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("span", { className: `pda-badge ${st[r[5]][1]}`, children: st[r[5]][0] }) }),
            /* @__PURE__ */ jsx("td", { style: { color: "var(--pd-muted)" }, children: r[6] }),
            /* @__PURE__ */ jsx("td", { children: r[5] !== "resolved" ? /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 6 }, children: [
              /* @__PURE__ */ jsx("button", { className: "pda-mini-act", children: "\u041E\u0442\u043A\u0440\u044B\u0442\u044C" }),
              /* @__PURE__ */ jsx("button", { className: "pda-mini-act ok", children: "\u0420\u0430\u0437\u043E\u0431\u0440\u0430\u0442\u044C" })
            ] }) : /* @__PURE__ */ jsx("button", { className: "pda-mini-act", children: "\u041E\u0442\u043A\u0440\u044B\u0442\u044C" }) })
          ] }, i))
        ] })
      ] }),
      state === "loaded" && /* @__PURE__ */ jsx(Pager, {}),
      state === "empty" && /* @__PURE__ */ jsx(TableState, { kind: "empty" }),
      ["noresults", "error", "offline"].includes(state) && /* @__PURE__ */ jsx(TableState, { kind: state })
    ] })
  ] });
}
var mic = (Fn, cls = "pd-i18") => Fn({ className: cls, fill: "none", stroke: "currentColor" });
var chevR = (p) => /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", ...p, children: /* @__PURE__ */ jsx("path", { d: "m9 5 7 7-7 7" }) });
var back = (p) => /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", ...p, children: /* @__PURE__ */ jsx("path", { d: "m15 5-7 7 7 7" }) });
var dots = (p) => /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", ...p, children: [
  /* @__PURE__ */ jsx("circle", { cx: "5", cy: "12", r: "1.6" }),
  /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "1.6" }),
  /* @__PURE__ */ jsx("circle", { cx: "19", cy: "12", r: "1.6" })
] });
var gift = (p) => /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", ...p, children: [
  /* @__PURE__ */ jsx("rect", { x: "3", y: "9", width: "18", height: "11", rx: "1.5" }),
  /* @__PURE__ */ jsx("path", { d: "M3 13h18M12 9v11M8.5 9C6 9 6 5 8.5 5S12 9 12 9s-.5-4 2-4 2.5 4 0 4" })
] });
var NAV = [["dash", "\u041E\u0431\u0437\u043E\u0440", Ic.home, null], ["mod", "\u041C\u043E\u0434\u0435\u0440\u0430\u0446\u0438\u044F", I.alert, "12"], ["deals", "\u0421\u0434\u0435\u043B\u043A\u0438", Ic.deals, "1"], ["fraud", "\u0410\u043D\u0442\u0438\u0444\u0440\u043E\u0434", I.shield, "7"], ["more", "\u0415\u0449\u0451", dots, "3"]];
function MTab({ active }) {
  return /* @__PURE__ */ jsx("nav", { className: "pdam-tab", children: NAV.map(([k, l, Ic2, ct]) => /* @__PURE__ */ jsxs("button", { className: active === k ? "on" : "", children: [
    ct && /* @__PURE__ */ jsx("span", { className: "ct", children: ct }),
    mic(Ic2, "pd-i22"),
    l
  ] }, k)) });
}
function MShell({ active, title, back: bk, action, children, overlay, noTab }) {
  return /* @__PURE__ */ jsxs("div", { className: "pdam", children: [
    /* @__PURE__ */ jsxs("div", { className: "pdam-top", children: [
      bk && /* @__PURE__ */ jsx("button", { className: "pd-iconbtn", style: { marginRight: 2, marginLeft: -6 }, children: mic(back, "pd-i22") }),
      /* @__PURE__ */ jsx("div", { className: "h", children: title }),
      action || /* @__PURE__ */ jsxs("span", { className: "badge", children: [
        mic(I.lock, "pd-i12"),
        "2FA"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "pdam-body", children }),
    !noTab && /* @__PURE__ */ jsx(MTab, { active }),
    overlay
  ] });
}
var Sheet = ({ children }) => /* @__PURE__ */ jsx("div", { className: "pdam-scrim", children: /* @__PURE__ */ jsxs("div", { className: "pdam-sheet", children: [
  /* @__PURE__ */ jsx("div", { className: "grab" }),
  children
] }) });
function AdminMobileLogin({ step = "login" }) {
  return /* @__PURE__ */ jsx("div", { className: "pdam", children: /* @__PURE__ */ jsxs("div", { className: "pdam-login", children: [
    /* @__PURE__ */ jsx("div", { className: "logo", children: mic(gift, "pd-i28") }),
    step === "login" ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("h2", { children: "\u041F\u0435\u0440\u0435\u0434\u0430\u0440\u0438\u043C \xB7 admin" }),
      /* @__PURE__ */ jsx("p", { children: "\u0412\u0445\u043E\u0434 \u0434\u043B\u044F \u043E\u043F\u0435\u0440\u0430\u0442\u043E\u0440\u043E\u0432. \u0414\u043E\u0441\u0442\u0443\u043F \u043F\u043E \u0440\u043E\u043B\u044F\u043C, \u0432\u0441\u0435 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F \u043B\u043E\u0433\u0438\u0440\u0443\u044E\u0442\u0441\u044F." }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 13, textAlign: "left" }, children: [
        /* @__PURE__ */ jsxs("div", { className: "pd-field", children: [
          /* @__PURE__ */ jsx("label", { className: "pd-label", children: "\u0420\u0430\u0431\u043E\u0447\u0438\u0439 email" }),
          /* @__PURE__ */ jsx("div", { className: "pd-input pd-input--focus", children: /* @__PURE__ */ jsx("input", { defaultValue: "moderator@peredarim.ru" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pd-field", children: [
          /* @__PURE__ */ jsx("label", { className: "pd-label", children: "\u041F\u0430\u0440\u043E\u043B\u044C" }),
          /* @__PURE__ */ jsx("div", { className: "pd-input", children: /* @__PURE__ */ jsx("input", { type: "password", defaultValue: "\xB7\xB7\xB7\xB7\xB7\xB7\xB7\xB7" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { style: { marginTop: 18 }, children: /* @__PURE__ */ jsx(PdBtn, { variant: "primary", block: true, lg: true, children: "\u0412\u043E\u0439\u0442\u0438" }) }),
      /* @__PURE__ */ jsxs("div", { className: "pdam-rolepill", children: [
        mic(I.shield, "pd-i12"),
        "\u0422\u0440\u0435\u0431\u0443\u0435\u0442\u0441\u044F 2FA (TOTP)"
      ] })
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("h2", { children: "\u041A\u043E\u0434 \u0434\u0432\u0443\u0445\u0444\u0430\u043A\u0442\u043E\u0440\u043D\u043E\u0439" }),
      /* @__PURE__ */ jsx("p", { children: "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 6-\u0437\u043D\u0430\u0447\u043D\u044B\u0439 \u043A\u043E\u0434 \u0438\u0437 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u044F-\u0430\u0443\u0442\u0435\u043D\u0442\u0438\u0444\u0438\u043A\u0430\u0442\u043E\u0440\u0430." }),
      /* @__PURE__ */ jsx(PdOtp, { value: "6041", cur: 4 }),
      /* @__PURE__ */ jsx("div", { style: { marginTop: 22 }, children: /* @__PURE__ */ jsx(PdBtn, { variant: "primary", block: true, lg: true, children: "\u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044C \u0432\u0445\u043E\u0434" }) }),
      /* @__PURE__ */ jsxs("p", { style: { marginTop: 14, fontSize: 12 }, children: [
        "\u0414\u043E\u0441\u0442\u0443\u043F \u043E\u043F\u0435\u0440\u0430\u0442\u043E\u0440\u0430 ",
        /* @__PURE__ */ jsx("b", { children: "moderator" }),
        " \xB7 \u0441\u0435\u0441\u0441\u0438\u044F 12 \u0447"
      ] })
    ] })
  ] }) });
}
function AdminMobileDash() {
  const k = [["\u041E\u043D\u043B\u0430\u0439\u043D", "342", "+5%"], ["DAU", "4 870", "+8%"], ["\u041E\u0431\u043E\u0440\u043E\u0442 / \u043C\u0435\u0441", "3,24 \u043C\u043B\u043D \u20BD", "+14%"], ["\u0421\u0434\u0435\u043B\u043E\u043A", "1 142", "+12%"]];
  const att = [
    [I.alert, "var(--pd-warn)", "\u041C\u043E\u0434\u0435\u0440\u0430\u0446\u0438\u044F", "12 \u0432 \u043E\u0447\u0435\u0440\u0435\u0434\u0438 \xB7 1 \u043E\u0441\u043F\u043E\u0440\u0435\u043D\u043E"],
    [I.shield, "var(--pd-danger)", "\u0410\u043D\u0442\u0438\u0444\u0440\u043E\u0434", "7 \u0441\u0438\u0433\u043D\u0430\u043B\u043E\u0432 \xB7 2 \u0432\u044B\u0441\u043E\u043A\u043E\u0433\u043E \u0440\u0438\u0441\u043A\u0430"],
    [Ic.deals, "var(--pd-danger)", "\u0416\u0430\u043B\u043E\u0431\u044B \u043D\u0430 \u0441\u0434\u0435\u043B\u043A\u0438", "1 \u0430\u043A\u0442\u0438\u0432\u043D\u0430\u044F \xB7 SLA 24 \u0447"],
    [I.flag, "var(--pd-warn)", "\u0416\u0430\u043B\u043E\u0431\u044B", "3 \u043D\u043E\u0432\u044B\u0445"]
  ];
  return /* @__PURE__ */ jsxs(MShell, { active: "dash", title: "\u041E\u0431\u0437\u043E\u0440", children: [
    /* @__PURE__ */ jsx("div", { className: "pdam-kpis", children: k.map((x, i) => /* @__PURE__ */ jsxs("div", { className: "pdam-kpi", children: [
      /* @__PURE__ */ jsx("div", { className: "lab", children: x[0] }),
      /* @__PURE__ */ jsx("div", { className: "val", children: x[1] }),
      /* @__PURE__ */ jsxs("div", { className: "delta", children: [
        "\u2191 ",
        x[2]
      ] })
    ] }, i)) }),
    /* @__PURE__ */ jsxs("div", { className: "pdam-sec", children: [
      /* @__PURE__ */ jsx("div", { className: "sh", children: "\u0422\u0440\u0435\u0431\u0443\u044E\u0442 \u0432\u043D\u0438\u043C\u0430\u043D\u0438\u044F" }),
      att.map((a, i) => /* @__PURE__ */ jsxs("div", { className: "pdam-item", children: [
        /* @__PURE__ */ jsx("span", { className: "ic", style: { background: a[1] === "var(--pd-danger)" ? "var(--pd-danger-soft)" : "var(--pd-warn-soft)", color: a[1] }, children: mic(a[0], "pd-i18") }),
        /* @__PURE__ */ jsxs("div", { className: "mid", children: [
          /* @__PURE__ */ jsx("div", { className: "t1", children: a[2] }),
          /* @__PURE__ */ jsx("div", { className: "t2", children: a[3] })
        ] }),
        /* @__PURE__ */ jsx("span", { className: "chev", children: mic(chevR, "pd-i18") })
      ] }, i))
    ] }),
    /* @__PURE__ */ jsx("div", { className: "pdam-readonly", children: "\u041F\u043E\u043B\u043D\u044B\u0435 \u0442\u0430\u0431\u043B\u0438\u0446\u044B, \u0433\u0440\u0430\u0444\u0438\u043A\u0438 \u0438 \u0441\u0432\u0435\u0440\u043A\u0430 ledger \u0432 \u0434\u0435\u0441\u043A\u0442\u043E\u043F\u043D\u043E\u0439 \u0432\u0435\u0440\u0441\u0438\u0438." })
  ] });
}
var MODCARDS = [
  ["1565695951564-007d8f297e48", "\u041E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u0435 \xB7 \u041A\u0430\u0442\u044F", "ML-\u0440\u0438\u0441\u043A: \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E \u043B\u0438\u0446\u043E \u043D\u0430 \u0444\u043E\u0442\u043E", "\u0411\u043E\u043B\u044C\u0448\u043E\u0439 \u0431\u0443\u043A\u0435\u0442 \u043F\u0438\u043E\u043D\u043E\u0432, \u043E\u0447\u0435\u043D\u044C \u0441\u0432\u0435\u0436\u0438\u0439. \u0421\u0430\u043C\u043E\u0432\u044B\u0432\u043E\u0437 \u0441\u0435\u0433\u043E\u0434\u043D\u044F."],
  ["1531120364508-a6b656c3e78d", "\u041E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u0435 \xB7 \u042E\u043B\u044F", "\u0416\u0430\u043B\u043E\u0431\u0430: \u043A\u043E\u043D\u0442\u0430\u043A\u0442 \u0432 \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u0438", "\u0421\u0432\u0435\u0436\u0438\u0435 \u0440\u043E\u0437\u044B, \u043F\u0438\u0448\u0438\u0442\u0435 \u0434\u043B\u044F \u0434\u0435\u0442\u0430\u043B\u0435\u0439\u2026"]
];
function ModQueue() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "pdam-chips", children: [
      /* @__PURE__ */ jsxs("button", { className: "pdam-chip on", children: [
        "ML-\u0440\u0438\u0441\u043A",
        /* @__PURE__ */ jsx("span", { className: "n", children: "5" })
      ] }),
      /* @__PURE__ */ jsxs("button", { className: "pdam-chip", children: [
        "\u0416\u0430\u043B\u043E\u0431\u044B",
        /* @__PURE__ */ jsx("span", { className: "n", children: "4" })
      ] }),
      /* @__PURE__ */ jsxs("button", { className: "pdam-chip", children: [
        "\u0410\u043D\u0442\u0438\u0444\u0440\u043E\u0434",
        /* @__PURE__ */ jsx("span", { className: "n", children: "2" })
      ] }),
      /* @__PURE__ */ jsxs("button", { className: "pdam-chip", children: [
        "\u0410\u043F\u0435\u043B\u043B\u044F\u0446\u0438\u0438",
        /* @__PURE__ */ jsx("span", { className: "n", children: "1" })
      ] })
    ] }),
    MODCARDS.map((c, i) => /* @__PURE__ */ jsxs("div", { className: "pdam-mod", children: [
      /* @__PURE__ */ jsxs("div", { className: "img", children: [
        /* @__PURE__ */ jsx("img", { src: `img/${c[0]}.jpg`, alt: "" }),
        /* @__PURE__ */ jsx("span", { className: "tag", children: "\u043D\u0430 \u0440\u0435\u0432\u044C\u044E \xB7 \u0436\u0438\u0432\u043E\u0435" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bd", children: [
        /* @__PURE__ */ jsxs("div", { className: "rw", children: [
          /* @__PURE__ */ jsx("span", { className: "who", children: c[1] }),
          /* @__PURE__ */ jsxs("span", { className: "pda-flag", style: { fontSize: 11 }, children: [
            mic(I.alert, "pd-i12"),
            "\u0444\u043B\u0430\u0433"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rsn", children: [
          mic(I.alert, "pd-i12"),
          c[2]
        ] }),
        /* @__PURE__ */ jsx("p", { className: "txt", children: c[3] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "acts", children: [
        /* @__PURE__ */ jsx(PdBtn, { variant: "secondary", block: true, children: "\u0421\u043D\u044F\u0442\u044C\u2026" }),
        /* @__PURE__ */ jsx(PdBtn, { variant: "primary", block: true, children: "\u041E\u0441\u0442\u0430\u0432\u0438\u0442\u044C \u0432 \u043B\u0435\u043D\u0442\u0435" })
      ] })
    ] }, i))
  ] });
}
function AdminMobileMod() {
  return /* @__PURE__ */ jsx(MShell, { active: "mod", title: "\u041C\u043E\u0434\u0435\u0440\u0430\u0446\u0438\u044F", children: /* @__PURE__ */ jsx(ModQueue, {}) });
}
function AdminMobileModReject() {
  const sheet = /* @__PURE__ */ jsxs(Sheet, { children: [
    /* @__PURE__ */ jsx("h3", { children: "\u0421\u043D\u044F\u0442\u044C \u043E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u0435 \u0441 \u043F\u0443\u0431\u043B\u0438\u043A\u0430\u0446\u0438\u0438" }),
    /* @__PURE__ */ jsx("p", { className: "sub", children: "\u041E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u0435 \u0441\u0435\u0439\u0447\u0430\u0441 \u0436\u0438\u0432\u043E\u0435. \u041F\u0440\u0438\u0447\u0438\u043D\u0430 \u0443\u0439\u0434\u0451\u0442 \u043F\u0440\u043E\u0434\u0430\u0432\u0446\u0443 \u0438 \u0432 audit-log, \u043E\u043D \u0441\u043C\u043E\u0436\u0435\u0442 \u043E\u0442\u0440\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0438 \u043E\u0431\u0436\u0430\u043B\u043E\u0432\u0430\u0442\u044C." }),
    /* @__PURE__ */ jsxs("div", { className: "pdam-reasons", children: [
      /* @__PURE__ */ jsxs("label", { className: "pdam-reason on", children: [
        /* @__PURE__ */ jsx("span", { className: "rb" }),
        "\u041A\u043E\u043D\u0442\u0430\u043A\u0442\u044B \u0432 \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u0438"
      ] }),
      /* @__PURE__ */ jsxs("label", { className: "pdam-reason", children: [
        /* @__PURE__ */ jsx("span", { className: "rb" }),
        "\u041D\u0435 \u0446\u0432\u0435\u0442\u044B / \u043D\u0435 \u0442\u0430 \u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044F"
      ] }),
      /* @__PURE__ */ jsxs("label", { className: "pdam-reason", children: [
        /* @__PURE__ */ jsx("span", { className: "rb" }),
        "\u0417\u0430\u043F\u0440\u0435\u0449\u0451\u043D\u043D\u044B\u0439 \u043A\u043E\u043D\u0442\u0435\u043D\u0442 \u043D\u0430 \u0444\u043E\u0442\u043E"
      ] }),
      /* @__PURE__ */ jsxs("label", { className: "pdam-reason", children: [
        /* @__PURE__ */ jsx("span", { className: "rb" }),
        "\u0414\u0440\u0443\u0433\u043E\u0435 (\u0443\u043A\u0430\u0437\u0430\u0442\u044C)"
      ] })
    ] }),
    /* @__PURE__ */ jsx("textarea", { rows: 2, placeholder: "\u041A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0439 \u043F\u0440\u043E\u0434\u0430\u0432\u0446\u0443 (\u043D\u0435\u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E)" }),
    /* @__PURE__ */ jsxs("div", { className: "sf", children: [
      /* @__PURE__ */ jsx(PdBtn, { variant: "ghost", block: true, children: "\u041E\u0442\u043C\u0435\u043D\u0430" }),
      /* @__PURE__ */ jsx(PdBtn, { variant: "danger", block: true, children: "\u0421\u043D\u044F\u0442\u044C" })
    ] })
  ] });
  return /* @__PURE__ */ jsx(MShell, { active: "mod", title: "\u041C\u043E\u0434\u0435\u0440\u0430\u0446\u0438\u044F", overlay: sheet, children: /* @__PURE__ */ jsx(ModQueue, {}) });
}
var MDEALS = [["#10478", "\u0421\u043E\u043D\u044F \u2192 \u042E\u043B\u044F", 850, "problem", "\u0436\u0430\u043B\u043E\u0431\u0430 \xB7 SLA 24 \u0447"], ["#10482", "\u041C\u0430\u0440\u0438\u043D\u0430 \u2192 \u0410\u043D\u044F", 990, "meeting", "\u0438\u0434\u0451\u0442"], ["#10481", "\u041A\u0430\u0442\u044F \u2192 \u041B\u0435\u043D\u0430", 1190, "done", "\u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0430"], ["#10475", "\u0412\u0435\u0440\u0430 \u2192 \u041E\u043B\u044C\u0433\u0430", 590, "cancelled", "\u043E\u0442\u043C\u0435\u043D\u0435\u043D\u0430"]];
var STC = { problem: ["var(--pd-danger-soft)", "#7e2c1e"], meeting: ["var(--pd-warn-soft)", "#7a5a16"], done: ["var(--pd-fresh-soft)", "#2f5a3c"], cancelled: ["var(--pd-surface-3)", "#7a6a52"], agreed: ["#e9eefb", "#33508f"] };
function DealsList() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "pdam-chips", children: [
      /* @__PURE__ */ jsxs("button", { className: "pdam-chip on", children: [
        "\u0416\u0430\u043B\u043E\u0431\u0430",
        /* @__PURE__ */ jsx("span", { className: "n", children: "1" })
      ] }),
      /* @__PURE__ */ jsx("button", { className: "pdam-chip", children: "\u0418\u0434\u0451\u0442" }),
      /* @__PURE__ */ jsx("button", { className: "pdam-chip", children: "\u0417\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0430" }),
      /* @__PURE__ */ jsx("button", { className: "pdam-chip", children: "\u041E\u0442\u043C\u0435\u043D\u0435\u043D\u0430" }),
      /* @__PURE__ */ jsx("button", { className: "pdam-chip", children: "\u0412\u0441\u0435" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "pdam-sec", children: [
      /* @__PURE__ */ jsxs("div", { className: "sh", children: [
        "\u0416\u0430\u043B\u043E\u0431\u044B ",
        /* @__PURE__ */ jsx("span", { className: "ct", children: "1" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pdam-item", children: [
        /* @__PURE__ */ jsx("span", { className: "ic", style: { background: "var(--pd-danger-soft)", color: "var(--pd-danger)" }, children: mic(I.alert, "pd-i18") }),
        /* @__PURE__ */ jsxs("div", { className: "mid", children: [
          /* @__PURE__ */ jsx("div", { className: "t1", children: "#10478 \xB7 \u0421\u043E\u043D\u044F \u2192 \u042E\u043B\u044F" }),
          /* @__PURE__ */ jsx("div", { className: "t2", children: "\u0411\u0443\u043A\u0435\u0442 \u043D\u0435 \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0443\u0435\u0442 \u0444\u043E\u0442\u043E \xB7 SLA 24 \u0447" })
        ] }),
        /* @__PURE__ */ jsx("span", { className: "amt", children: pdMoney(850) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pdam-modact", style: { display: "flex", gap: 8, padding: "11px 15px", borderTop: "1px solid var(--pd-border)" }, children: [
        /* @__PURE__ */ jsx(PdBtn, { variant: "secondary", block: true, children: "\u0414\u0435\u0442\u0430\u043B\u0438 \u0436\u0430\u043B\u043E\u0431\u044B" }),
        /* @__PURE__ */ jsx(PdBtn, { variant: "primary", block: true, children: "\u0420\u0430\u0437\u043E\u0431\u0440\u0430\u0442\u044C" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "pdam-sec", children: [
      /* @__PURE__ */ jsx("div", { className: "sh", children: "\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0435 \u0441\u0434\u0435\u043B\u043A\u0438" }),
      MDEALS.map((d, i) => /* @__PURE__ */ jsxs("div", { className: "pdam-item", children: [
        /* @__PURE__ */ jsx("span", { className: "ic", style: { background: STC[d[3]][0], color: STC[d[3]][1] }, children: mic(Ic.deals, "pd-i18") }),
        /* @__PURE__ */ jsxs("div", { className: "mid", children: [
          /* @__PURE__ */ jsxs("div", { className: "t1", children: [
            d[0],
            " \xB7 ",
            d[1]
          ] }),
          /* @__PURE__ */ jsx("div", { className: "t2", children: d[4] })
        ] }),
        /* @__PURE__ */ jsx("span", { className: "amt", children: pdMoney(d[2]) })
      ] }, i))
    ] }),
    /* @__PURE__ */ jsx("div", { className: "pdam-readonly", children: "\u041E\u0442\u043C\u0435\u043D\u0430 \u0441\u0434\u0435\u043B\u043A\u0438 \u0444\u0438\u043A\u0441\u0438\u0440\u0443\u0435\u0442\u0441\u044F \u0432 audit-log." })
  ] });
}
function AdminMobileDeals() {
  return /* @__PURE__ */ jsx(MShell, { active: "deals", title: "\u0421\u0434\u0435\u043B\u043A\u0438", children: /* @__PURE__ */ jsx(DealsList, {}) });
}
function AdminMobileDealCancel() {
  const sheet = /* @__PURE__ */ jsxs(Sheet, { children: [
    /* @__PURE__ */ jsx("h3", { children: "\u041E\u0442\u043C\u0435\u043D\u0438\u0442\u044C \u0441\u0434\u0435\u043B\u043A\u0443 #10482?" }),
    /* @__PURE__ */ jsx("p", { className: "sub", children: "\u041C\u0430\u0440\u0438\u043D\u0430 \u2192 \u0410\u043D\u044F \xB7 990 \u20BD. \u041E\u0442\u043C\u0435\u043D\u0430 \u0441\u043D\u0438\u043C\u0435\u0442 \u0441\u0434\u0435\u043B\u043A\u0443, \u0441\u0442\u043E\u0440\u043E\u043D\u044B \u043F\u043E\u043B\u0443\u0447\u0430\u0442 \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u0435. \u041D\u0435\u043E\u0431\u0440\u0430\u0442\u0438\u043C\u043E." }),
    /* @__PURE__ */ jsx("div", { className: "pd-field", style: { textAlign: "left" }, children: /* @__PURE__ */ jsx("label", { className: "pd-label", children: "\u041F\u0440\u0438\u0447\u0438\u043D\u0430 \u043E\u0442\u043C\u0435\u043D\u044B *" }) }),
    /* @__PURE__ */ jsx("textarea", { rows: 3, defaultValue: "\u041F\u0440\u043E\u0434\u0430\u0432\u0435\u0446 \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D 48 \u0447, \u0431\u0443\u043A\u0435\u0442 \u043D\u0435\u0430\u043A\u0442\u0443\u0430\u043B\u0435\u043D. \u041E\u0431\u0440\u0430\u0449\u0435\u043D\u0438\u0435 #1902." }),
    /* @__PURE__ */ jsxs("div", { className: "pdam-4eyes", children: [
      mic(I.shield, "pd-i16"),
      "\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \u0444\u0438\u043A\u0441\u0438\u0440\u0443\u0435\u0442\u0441\u044F \u0432 audit-log."
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "sf", children: [
      /* @__PURE__ */ jsx(PdBtn, { variant: "ghost", block: true, children: "\u041E\u0442\u043C\u0435\u043D\u0430" }),
      /* @__PURE__ */ jsx(PdBtn, { variant: "danger", block: true, children: "\u041E\u0442\u043C\u0435\u043D\u0438\u0442\u044C \u0441\u0434\u0435\u043B\u043A\u0443" })
    ] })
  ] });
  return /* @__PURE__ */ jsx(MShell, { active: "deals", title: "\u0421\u0434\u0435\u043B\u043A\u0438", overlay: sheet, children: /* @__PURE__ */ jsx(DealsList, {}) });
}
function AdminMobileDispute() {
  return /* @__PURE__ */ jsxs(MShell, { active: "deals", title: "\u0416\u0430\u043B\u043E\u0431\u0430 #10478", back: true, action: /* @__PURE__ */ jsx("button", { className: "pd-iconbtn", children: mic(dots, "pd-i20") }), children: [
    /* @__PURE__ */ jsxs("div", { className: "pdam-sec", style: { padding: "14px 15px" }, children: [
      /* @__PURE__ */ jsxs("div", { className: "rw", style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
        /* @__PURE__ */ jsx("span", { className: "pda-badge problem", children: "\u0436\u0430\u043B\u043E\u0431\u0430" }),
        /* @__PURE__ */ jsx("span", { style: { fontSize: 12, color: "var(--pd-danger)", fontWeight: 700 }, children: "SLA 24 \u0447 \xB7 \u043E\u0441\u0442\u0430\u043B\u043E\u0441\u044C 18:42" })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { fontSize: 20, fontWeight: 700, marginTop: 10 }, children: [
        pdMoney(850),
        " ",
        /* @__PURE__ */ jsx("span", { style: { fontSize: 13, color: "var(--pd-muted)", fontWeight: 600 }, children: "\u0441\u0443\u043C\u043C\u0430 \u0441\u0434\u0435\u043B\u043A\u0438" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "pdam-sec", children: [
      /* @__PURE__ */ jsxs("div", { className: "pdam-kv", children: [
        /* @__PURE__ */ jsx("span", { className: "k", children: "\u041F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u044C" }),
        /* @__PURE__ */ jsx("span", { className: "v", children: "\u042E\u043B\u044F \u0412." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pdam-kv", children: [
        /* @__PURE__ */ jsx("span", { className: "k", children: "\u041F\u0440\u043E\u0434\u0430\u0432\u0435\u0446" }),
        /* @__PURE__ */ jsx("span", { className: "v", children: "\u0421\u043E\u043D\u044F \u041B." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pdam-kv", children: [
        /* @__PURE__ */ jsx("span", { className: "k", children: "\u041F\u0440\u0438\u0447\u0438\u043D\u0430 \u0436\u0430\u043B\u043E\u0431\u044B" }),
        /* @__PURE__ */ jsx("span", { className: "v", children: "\u0411\u0443\u043A\u0435\u0442 \u043D\u0435 \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0443\u0435\u0442 \u0444\u043E\u0442\u043E" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pdam-kv", children: [
        /* @__PURE__ */ jsx("span", { className: "k", children: "\u041E\u0442\u043A\u0440\u044B\u0442" }),
        /* @__PURE__ */ jsx("span", { className: "v", children: "02.06 19:41" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "pdam-sec", children: [
      /* @__PURE__ */ jsx("div", { className: "sh", children: "\u0414\u043E\u043A\u0430\u0437\u0430\u0442\u0435\u043B\u044C\u0441\u0442\u0432\u0430" }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 8, padding: "0 15px 14px" }, children: [
        /* @__PURE__ */ jsx("div", { style: { flex: 1, aspectRatio: "1", borderRadius: 10, overflow: "hidden", background: "var(--pd-surface-2)" }, children: /* @__PURE__ */ jsx("img", { src: "img/1531120364508-a6b656c3e78d.jpg", style: { width: "100%", height: "100%", objectFit: "cover" }, alt: "" }) }),
        /* @__PURE__ */ jsx("div", { style: { flex: 1, aspectRatio: "1", borderRadius: 10, overflow: "hidden", background: "var(--pd-surface-2)" }, children: /* @__PURE__ */ jsx("img", { src: "img/1522748906645-95d8adfd52c7.jpg", style: { width: "100%", height: "100%", objectFit: "cover" }, alt: "" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "pdam-actbar", children: [
      /* @__PURE__ */ jsx(PdBtn, { variant: "primary", block: true, lg: true, children: "\u041F\u0440\u0435\u0434\u0443\u043F\u0440\u0435\u0434\u0438\u0442\u044C \u043F\u0440\u043E\u0434\u0430\u0432\u0446\u0430" }),
      /* @__PURE__ */ jsx(PdBtn, { variant: "secondary", block: true, lg: true, children: "\u0417\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u043F\u0440\u043E\u0434\u0430\u0432\u0446\u0430\u2026" }),
      /* @__PURE__ */ jsx(PdBtn, { variant: "ghost", block: true, children: "\u041E\u0442\u043A\u043B\u043E\u043D\u0438\u0442\u044C \u0436\u0430\u043B\u043E\u0431\u0443" })
    ] })
  ] });
}
var SIG = [["hi", 92, "\u041C\u0443\u043B\u044C\u0442\u0438-\u0430\u043A\u043A\u0430\u0443\u043D\u0442\u044B \u043F\u043E IP", "2.18.\xB7\xB7.41 \xB7 3 \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0430"], ["hi", 88, "\u041D\u0430\u043A\u0440\u0443\u0442\u043A\u0430 \u043E\u0442\u0437\u044B\u0432\u043E\u0432", "\u0446\u0435\u043F\u043E\u0447\u043A\u0430 \u0438\u0437 3 \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u043E\u0432"], ["md", 64, "\u041F\u043E\u0432\u0442\u043E\u0440\u043D\u044B\u0435 \u0436\u0430\u043B\u043E\u0431\u044B", "3 \u0436\u0430\u043B\u043E\u0431\u044B \xB7 1 \u043F\u0440\u043E\u0434\u0430\u0432\u0435\u0446"], ["md", 57, "\u041F\u0435\u0440\u0435\u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u043D\u0438\u0435 \u0444\u043E\u0442\u043E", "\u0445\u044D\u0448 98% \xB7 4 \u043E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u044F"], ["lo", 34, "\u0410\u043D\u043E\u043C\u0430\u043B\u0438\u044F \u0446\u0435\u043D\u044B", "120 \u20BD \u043F\u0440\u0438 \u043C\u0435\u0434\u0438\u0430\u043D\u0435 950 \u20BD"]];
function AdminMobileFraud() {
  return /* @__PURE__ */ jsxs(MShell, { active: "fraud", title: "\u0410\u043D\u0442\u0438\u0444\u0440\u043E\u0434", children: [
    /* @__PURE__ */ jsxs("div", { className: "pdam-kpis", children: [
      /* @__PURE__ */ jsxs("div", { className: "pdam-kpi", children: [
        /* @__PURE__ */ jsx("div", { className: "lab", children: "\u041E\u0442\u043A\u0440\u044B\u0442\u044B\u0445 \u0441\u0438\u0433\u043D\u0430\u043B\u043E\u0432" }),
        /* @__PURE__ */ jsx("div", { className: "val", children: "7" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pdam-kpi", children: [
        /* @__PURE__ */ jsx("div", { className: "lab", children: "\u0412\u044B\u0441\u043E\u043A\u0438\u0439 \u0440\u0438\u0441\u043A" }),
        /* @__PURE__ */ jsx("div", { className: "val", style: { color: "var(--pd-danger)" }, children: "2" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "pdam-chips", children: [
      /* @__PURE__ */ jsx("button", { className: "pdam-chip on", children: "\u0412\u044B\u0441\u043E\u043A\u0438\u0439 + \u0441\u0440\u0435\u0434\u043D\u0438\u0439" }),
      /* @__PURE__ */ jsx("button", { className: "pdam-chip", children: "\u0412\u0441\u0435 \u043C\u0435\u0442\u043E\u0434\u0438\u043A\u0438" }),
      /* @__PURE__ */ jsx("button", { className: "pdam-chip", children: "30 \u0434\u043D\u0435\u0439" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "pdam-sec", children: [
      /* @__PURE__ */ jsx("div", { className: "sh", children: "\u0421\u0438\u0433\u043D\u0430\u043B\u044B" }),
      SIG.map((s, i) => /* @__PURE__ */ jsxs("div", { className: "pdam-item", children: [
        /* @__PURE__ */ jsx("span", { className: "ic", style: { background: s[0] === "hi" ? "var(--pd-danger-soft)" : s[0] === "md" ? "var(--pd-warn-soft)" : "var(--pd-fresh-soft)", color: s[0] === "hi" ? "#7e2c1e" : s[0] === "md" ? "#7a5a16" : "#2f5a3c", fontWeight: 800, fontSize: 14 }, children: s[1] }),
        /* @__PURE__ */ jsxs("div", { className: "mid", children: [
          /* @__PURE__ */ jsx("div", { className: "t1", children: s[2] }),
          /* @__PURE__ */ jsx("div", { className: "t2", children: s[3] })
        ] }),
        /* @__PURE__ */ jsx("span", { className: "chev", children: mic(chevR, "pd-i18") })
      ] }, i))
    ] }),
    /* @__PURE__ */ jsx("div", { className: "pdam-readonly", children: "\u0411\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u043A\u0430 \u043A\u043B\u0430\u0441\u0442\u0435\u0440\u043E\u0432 \u0438 \u0433\u0440\u0430\u0444 \u0441\u0432\u044F\u0437\u0435\u0439 \u0432 \u0434\u0435\u0441\u043A\u0442\u043E\u043F\u043D\u043E\u0439 \u0432\u0435\u0440\u0441\u0438\u0438." })
  ] });
}
function AdminMobileFraudDrill() {
  return /* @__PURE__ */ jsxs(MShell, { active: "fraud", title: "\u0421\u0438\u0433\u043D\u0430\u043B \xB7 risk 92", back: true, children: [
    /* @__PURE__ */ jsx("div", { className: "pdam-sec", style: { padding: "14px 15px" }, children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 13, alignItems: "center" }, children: [
      /* @__PURE__ */ jsx("span", { style: { width: 52, height: 52, borderRadius: 13, background: "var(--pd-danger-soft)", color: "#7e2c1e", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 18, flex: "none" }, children: "92" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { style: { fontWeight: 700, fontSize: 15 }, children: "\u041C\u0443\u043B\u044C\u0442\u0438-\u0430\u043A\u043A\u0430\u0443\u043D\u0442\u044B \u043F\u043E IP" }),
        /* @__PURE__ */ jsx("div", { style: { fontSize: 12.5, color: "var(--pd-muted)", marginTop: 3 }, children: "IP 2.18.\xB7\xB7.41 \xB7 \u0432\u0437\u0430\u0438\u043C\u043D\u044B\u0435 \u043B\u0430\u0439\u043A\u0438 \u0438 \u043E\u0442\u0437\u044B\u0432\u044B" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "pdam-sec", children: [
      /* @__PURE__ */ jsx("div", { className: "sh", children: "\u0421\u0432\u044F\u0437\u0430\u043D\u043D\u044B\u0435 \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u044B" }),
      [["w3.jpg", "\u0421\u043E\u043D\u044F \u041B.", "flag"], ["w5.jpg", "\u042E\u043B\u044F \u0412.", "flag"], ["w2.jpg", "\u0410\u043A\u043A\u0430\u0443\u043D\u0442 #5120", ""]].map((u, i) => /* @__PURE__ */ jsxs("div", { className: "pdam-item", children: [
        /* @__PURE__ */ jsx("span", { className: "ic", style: { padding: 0, overflow: "hidden" }, children: /* @__PURE__ */ jsx("img", { src: `img/av/${u[0]}`, style: { width: "100%", height: "100%", objectFit: "cover" }, alt: "" }) }),
        /* @__PURE__ */ jsxs("div", { className: "mid", children: [
          /* @__PURE__ */ jsx("div", { className: "t1", children: u[1] }),
          /* @__PURE__ */ jsx("div", { className: "t2", children: u[2] ? "\u043F\u043E\u043C\u0435\u0447\u0435\u043D \xB7 \u0432\u044B\u0441\u043E\u043A\u0438\u0439 \u0440\u0438\u0441\u043A" : "\u0432 \u043D\u0430\u0431\u043B\u044E\u0434\u0435\u043D\u0438\u0438" })
        ] }),
        u[2] && /* @__PURE__ */ jsxs("span", { className: "pda-flag", style: { fontSize: 11 }, children: [
          mic(I.alert, "pd-i12"),
          "\u0444\u043B\u0430\u0433"
        ] })
      ] }, i)),
      /* @__PURE__ */ jsxs("div", { className: "pdam-kv", children: [
        /* @__PURE__ */ jsx("span", { className: "k", children: "\u0412\u0437\u0430\u0438\u043C\u043D\u044B\u0435 \u043E\u0442\u0437\u044B\u0432\u044B" }),
        /* @__PURE__ */ jsx("span", { className: "v", children: "6" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pdam-kv", children: [
        /* @__PURE__ */ jsx("span", { className: "k", children: "\u041E\u0431\u0449\u0438\u0445 \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432" }),
        /* @__PURE__ */ jsx("span", { className: "v", children: "2" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "pdam-actbar", children: [
      /* @__PURE__ */ jsx(PdBtn, { variant: "danger", block: true, lg: true, icon: I.shield, children: "\u0417\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u043A\u043B\u0430\u0441\u0442\u0435\u0440\u2026" }),
      /* @__PURE__ */ jsx(PdBtn, { variant: "secondary", block: true, children: "\u041E\u0433\u0440\u0430\u043D\u0438\u0447\u0438\u0442\u044C \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u044B" })
    ] })
  ] });
}
function AdminMobileMore() {
  const rows = [["\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0438", Ic.user, null], ["\u041E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u044F", Ic.search, null], ["\u0424\u0438\u043D\u0430\u043D\u0441\u044B", I.wallet, null], ["\u0416\u0430\u043B\u043E\u0431\u044B", I.flag, "3"], ["\u041C\u043E\u0434\u0435\u0440\u0430\u0446\u0438\u044F", I.alert, "12"]];
  return /* @__PURE__ */ jsxs(MShell, { active: "more", title: "\u0415\u0449\u0451", children: [
    /* @__PURE__ */ jsx("div", { className: "pdam-sec", style: { padding: "4px 16px" }, children: /* @__PURE__ */ jsx("div", { className: "pdam-more", children: rows.map((r, i) => /* @__PURE__ */ jsxs("div", { className: "pdam-morerow", children: [
      /* @__PURE__ */ jsx("span", { className: "ic", children: mic(r[1], "pd-i18") }),
      r[0],
      r[2] && /* @__PURE__ */ jsx("span", { className: "ct", children: r[2] }),
      !r[2] && /* @__PURE__ */ jsx("span", { style: { marginLeft: "auto", color: "var(--pd-faint)" }, children: mic(chevR, "pd-i18") })
    ] }, i)) }) }),
    /* @__PURE__ */ jsx("div", { className: "pdam-sec", style: { padding: "4px 16px" }, children: /* @__PURE__ */ jsxs("div", { className: "pdam-more", children: [
      /* @__PURE__ */ jsxs("div", { className: "pdam-morerow", children: [
        /* @__PURE__ */ jsx("span", { className: "ic", children: mic(I.shield, "pd-i18") }),
        "\u0420\u043E\u043B\u044C \u0438 \u0434\u043E\u0441\u0442\u0443\u043F",
        /* @__PURE__ */ jsx("span", { style: { marginLeft: "auto", fontSize: 12.5, color: "var(--pd-muted)" }, children: "moderator" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pdam-morerow danger", children: [
        /* @__PURE__ */ jsx("span", { className: "ic", children: mic(I.lock, "pd-i18") }),
        "\u0412\u044B\u0439\u0442\u0438"
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "pdam-readonly", children: "\u0412\u0438\u0434\u0438\u043C\u043E\u0441\u0442\u044C \u0440\u0430\u0437\u0434\u0435\u043B\u043E\u0432 \u0437\u0430\u0432\u0438\u0441\u0438\u0442 \u043E\u0442 \u0440\u043E\u043B\u0438 (RBAC). \u0427\u0430\u0441\u0442\u044C \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0439 \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0430 \u0442\u043E\u043B\u044C\u043A\u043E \u043D\u0430 \u0434\u0435\u0441\u043A\u0442\u043E\u043F\u0435." })
  ] });
}
var MUSERS = [["w1.jpg", "\u041C\u0430\u0440\u0438\u043D\u0430 \u041A.", "\u041C\u043E\u0441\u043A\u0432\u0430 \xB7 iOS", "active"], ["w3.jpg", "\u0421\u043E\u043D\u044F \u041B.", "\u0421\u041F\u0431 \xB7 Android", "review"], ["w5.jpg", "\u042E\u043B\u044F \u0412.", "\u041A\u0430\u0437\u0430\u043D\u044C \xB7 Web", "blocked"], ["w4.jpg", "\u0415\u043A\u0430\u0442\u0435\u0440\u0438\u043D\u0430 \u041B.", "\u041C\u043E\u0441\u043A\u0432\u0430 \xB7 iOS", "active"], ["w6.jpg", "\u041E\u043B\u044C\u0433\u0430 \u0420.", "\u041D\u043E\u0432\u043E\u0441\u0438\u0431\u0438\u0440\u0441\u043A", "active"]];
function UsersList() {
  const stb = { active: ["active", "\u0430\u043A\u0442\u0438\u0432\u0435\u043D"], review: ["held", "\u043D\u0430 \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0435"], blocked: ["blocked", "\u0437\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D"] };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "pdam-search", children: [
      mic(Ic.search, "pd-i16"),
      "\u041F\u043E\u0438\u0441\u043A \u043F\u043E \u0438\u043C\u0435\u043D\u0438, \u0442\u0435\u043B\u0435\u0444\u043E\u043D\u0443, ID"
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "pdam-chips", children: [
      /* @__PURE__ */ jsx("button", { className: "pdam-chip on", children: "\u0410\u043A\u0442\u0438\u0432\u043D\u044B\u0435" }),
      /* @__PURE__ */ jsx("button", { className: "pdam-chip", children: "\u041D\u0430 \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0435" }),
      /* @__PURE__ */ jsx("button", { className: "pdam-chip", children: "\u0417\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D\u044B" }),
      /* @__PURE__ */ jsx("button", { className: "pdam-chip", children: "\u041C\u0443\u043B\u044C\u0442\u0438-IP" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "pdam-sec", children: MUSERS.map((u, i) => /* @__PURE__ */ jsxs("div", { className: "pdam-item", children: [
      /* @__PURE__ */ jsx("span", { className: "ic", style: { borderRadius: "50%", padding: 0, overflow: "hidden" }, children: /* @__PURE__ */ jsx("img", { src: `img/av/${u[0]}`, style: { width: "100%", height: "100%", objectFit: "cover" }, alt: "" }) }),
      /* @__PURE__ */ jsxs("div", { className: "mid", children: [
        /* @__PURE__ */ jsx("div", { className: "t1", children: u[1] }),
        /* @__PURE__ */ jsx("div", { className: "t2", children: u[2] })
      ] }),
      /* @__PURE__ */ jsx("span", { className: `pda-badge ${stb[u[3]][0]}`, style: { fontSize: 11 }, children: stb[u[3]][1] })
    ] }, i)) })
  ] });
}
function AdminMobileUsers() {
  return /* @__PURE__ */ jsx(MShell, { active: "more", title: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0438", back: true, children: /* @__PURE__ */ jsx(UsersList, {}) });
}
function AdminMobileUserDrill() {
  return /* @__PURE__ */ jsxs(MShell, { active: "more", title: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C", back: true, action: /* @__PURE__ */ jsxs("span", { className: "pdam-logged", children: [
    mic(I.lock, "pd-i12"),
    "\u041F\u0414\u043D"
  ] }), children: [
    /* @__PURE__ */ jsx("div", { className: "pdam-sec", style: { padding: "14px 15px" }, children: /* @__PURE__ */ jsxs("div", { className: "pdam-drillhead", children: [
      /* @__PURE__ */ jsx("span", { className: "av", children: /* @__PURE__ */ jsx("img", { src: "img/av/w4.jpg", alt: "" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "nm", children: "\u0415\u043A\u0430\u0442\u0435\u0440\u0438\u043D\u0430 \u041B." }),
        /* @__PURE__ */ jsx("div", { className: "mt", children: "ID 48213 \xB7 \u041C\u043E\u0441\u043A\u0432\u0430 \xB7 iOS" }),
        /* @__PURE__ */ jsxs("div", { style: { marginTop: 6, display: "flex", gap: 6 }, children: [
          /* @__PURE__ */ jsx("span", { className: "pda-badge active", style: { fontSize: 11 }, children: "\u0430\u043A\u0442\u0438\u0432\u0435\u043D" }),
          /* @__PURE__ */ jsx("span", { className: "pda-risk lo", style: { fontSize: 11 }, children: "\u043D\u0438\u0437\u043A\u0438\u0439 \u0440\u0438\u0441\u043A" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "pdam-sec", children: [
      /* @__PURE__ */ jsxs("div", { className: "pdam-kv", children: [
        /* @__PURE__ */ jsx("span", { className: "k", children: "\u0422\u0435\u043B\u0435\u0444\u043E\u043D" }),
        /* @__PURE__ */ jsx("span", { className: "v", children: "+7 999 \xB7\xB7\xB7-58-03" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pdam-kv", children: [
        /* @__PURE__ */ jsx("span", { className: "k", children: "Email" }),
        /* @__PURE__ */ jsx("span", { className: "v", children: "katya@ya.ru" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pdam-kv", children: [
        /* @__PURE__ */ jsx("span", { className: "k", children: "\u041F\u0440\u0438\u0432\u044F\u0437\u043A\u0438" }),
        /* @__PURE__ */ jsx("span", { className: "v", children: "\u042F\u043D\u0434\u0435\u043A\u0441 ID \xB7 VK ID" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pdam-kv", children: [
        /* @__PURE__ */ jsx("span", { className: "k", children: "\u041E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u0439" }),
        /* @__PURE__ */ jsx("span", { className: "v", children: "23 (4 \u0430\u043A\u0442\u0438\u0432\u043D\u044B\u0445)" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pdam-kv", children: [
        /* @__PURE__ */ jsx("span", { className: "k", children: "\u0421\u0434\u0435\u043B\u043E\u043A" }),
        /* @__PURE__ */ jsx("span", { className: "v", children: "57 \xB7 1 \u0436\u0430\u043B\u043E\u0431\u0430" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pdam-kv", children: [
        /* @__PURE__ */ jsx("span", { className: "k", children: "\u0420\u0435\u0439\u0442\u0438\u043D\u0433" }),
        /* @__PURE__ */ jsx("span", { className: "v", children: "4.9 \xB7 57 \u043E\u0442\u0437\u044B\u0432\u043E\u0432" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "pdam-actbar", children: [
      /* @__PURE__ */ jsx(PdBtn, { variant: "secondary", block: true, children: "\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u0441\u0435\u0441\u0441\u0438\u0438" }),
      /* @__PURE__ */ jsx(PdBtn, { variant: "danger", block: true, icon: I.shield, children: "\u0417\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u0442\u044C\u2026" })
    ] })
  ] });
}
function AdminMobileBlock() {
  const sheet = /* @__PURE__ */ jsxs(Sheet, { children: [
    /* @__PURE__ */ jsx("h3", { children: "\u0417\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0415\u043A\u0430\u0442\u0435\u0440\u0438\u043D\u0443 \u041B.?" }),
    /* @__PURE__ */ jsx("p", { className: "sub", children: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u043D\u0435 \u0441\u043C\u043E\u0436\u0435\u0442 \u0432\u0445\u043E\u0434\u0438\u0442\u044C \u0438 \u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u0442\u044C. \u0410\u043A\u0442\u0438\u0432\u043D\u044B\u0435 \u0441\u0434\u0435\u043B\u043A\u0438 \u0437\u0430\u043C\u043E\u0440\u0430\u0436\u0438\u0432\u0430\u044E\u0442\u0441\u044F. \u041F\u0440\u0438\u0447\u0438\u043D\u0430 \u043F\u043E\u043F\u0430\u0434\u0451\u0442 \u0432 audit-log." }),
    /* @__PURE__ */ jsxs("div", { className: "pdam-reasons", children: [
      /* @__PURE__ */ jsxs("label", { className: "pdam-reason on", children: [
        /* @__PURE__ */ jsx("span", { className: "rb" }),
        "\u041C\u043E\u0448\u0435\u043D\u043D\u0438\u0447\u0435\u0441\u0442\u0432\u043E / \u0430\u043D\u0442\u0438\u0444\u0440\u043E\u0434"
      ] }),
      /* @__PURE__ */ jsxs("label", { className: "pdam-reason", children: [
        /* @__PURE__ */ jsx("span", { className: "rb" }),
        "\u0421\u043F\u0430\u043C \u0438 \u043D\u0430\u043A\u0440\u0443\u0442\u043A\u0430"
      ] }),
      /* @__PURE__ */ jsxs("label", { className: "pdam-reason", children: [
        /* @__PURE__ */ jsx("span", { className: "rb" }),
        "\u0416\u0430\u043B\u043E\u0431\u044B \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0435\u0439"
      ] }),
      /* @__PURE__ */ jsxs("label", { className: "pdam-reason", children: [
        /* @__PURE__ */ jsx("span", { className: "rb" }),
        "\u0414\u0440\u0443\u0433\u043E\u0435"
      ] })
    ] }),
    /* @__PURE__ */ jsx("textarea", { rows: 2, placeholder: "\u041A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0439 (\u0432\u0438\u0434\u0435\u043D \u0432 audit-log)" }),
    /* @__PURE__ */ jsxs("div", { className: "sf", children: [
      /* @__PURE__ */ jsx(PdBtn, { variant: "ghost", block: true, children: "\u041E\u0442\u043C\u0435\u043D\u0430" }),
      /* @__PURE__ */ jsx(PdBtn, { variant: "danger", block: true, children: "\u0417\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u0442\u044C" })
    ] })
  ] });
  return /* @__PURE__ */ jsx(MShell, { active: "more", title: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C", back: true, overlay: sheet, children: /* @__PURE__ */ jsx("div", { className: "pdam-sec", style: { padding: "14px 15px" }, children: /* @__PURE__ */ jsxs("div", { className: "pdam-drillhead", children: [
    /* @__PURE__ */ jsx("span", { className: "av", children: /* @__PURE__ */ jsx("img", { src: "img/av/w4.jpg", alt: "" }) }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("div", { className: "nm", children: "\u0415\u043A\u0430\u0442\u0435\u0440\u0438\u043D\u0430 \u041B." }),
      /* @__PURE__ */ jsx("div", { className: "mt", children: "ID 48213 \xB7 \u041C\u043E\u0441\u043A\u0432\u0430 \xB7 iOS" })
    ] })
  ] }) }) });
}
var MLIST = [["1565695951564-007d8f297e48", "\u041F\u0438\u043E\u043D\u044B, \u0431\u043E\u043B\u044C\u0448\u043E\u0439 \u0431\u0443\u043A\u0435\u0442", "\u041A\u0430\u0442\u044F \xB7 \u041C\u043E\u0441\u043A\u0432\u0430", 1190, "active"], ["1531120364508-a6b656c3e78d", "\u0421\u0432\u0435\u0436\u0438\u0435 \u0440\u043E\u0437\u044B 25 \u0448\u0442", "\u042E\u043B\u044F \xB7 \u041A\u0430\u0437\u0430\u043D\u044C", 990, "flagged"], ["1522748906645-95d8adfd52c7", "\u0422\u044E\u043B\u044C\u043F\u0430\u043D\u044B \u043C\u0438\u043A\u0441", "\u0421\u043E\u043D\u044F \xB7 \u0421\u041F\u0431", 650, "active"], ["1561181286-d3fee7d55364", "\u0413\u043E\u0440\u0442\u0435\u043D\u0437\u0438\u044F", "\u041C\u0430\u0440\u0438\u043D\u0430 \xB7 \u041C\u043E\u0441\u043A\u0432\u0430", 2100, "sold"]];
function AdminMobileListings() {
  const stb = { active: ["active", "\u0430\u043A\u0442\u0438\u0432\u043D\u043E"], flagged: ["held", "\u0436\u0438\u0432\u043E\u0435 \xB7 \u0444\u043B\u0430\u0433"], sold: ["sold", "\u043F\u0440\u043E\u0434\u0430\u043D\u043E"] };
  return /* @__PURE__ */ jsxs(MShell, { active: "more", title: "\u041E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u044F", back: true, children: [
    /* @__PURE__ */ jsxs("div", { className: "pdam-search", children: [
      mic(Ic.search, "pd-i16"),
      "\u041F\u043E\u0438\u0441\u043A \u043F\u043E \u043E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u044F\u043C"
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "pdam-chips", children: [
      /* @__PURE__ */ jsxs("button", { className: "pdam-chip on", children: [
        "\u041D\u0430 \u0440\u0435\u0432\u044C\u044E",
        /* @__PURE__ */ jsx("span", { className: "n", children: "9" })
      ] }),
      /* @__PURE__ */ jsx("button", { className: "pdam-chip", children: "\u0410\u043A\u0442\u0438\u0432\u043D\u044B\u0435" }),
      /* @__PURE__ */ jsx("button", { className: "pdam-chip", children: "\u041F\u0440\u043E\u0434\u0430\u043D\u043E" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "pdam-sec", children: MLIST.map((l, i) => /* @__PURE__ */ jsxs("div", { className: "pdam-item", children: [
      /* @__PURE__ */ jsx("span", { className: "ic", style: { borderRadius: 9, padding: 0, overflow: "hidden", width: 42, height: 42 }, children: /* @__PURE__ */ jsx("img", { src: `img/${l[0]}.jpg`, style: { width: "100%", height: "100%", objectFit: "cover" }, alt: "" }) }),
      /* @__PURE__ */ jsxs("div", { className: "mid", children: [
        /* @__PURE__ */ jsx("div", { className: "t1", children: l[1] }),
        /* @__PURE__ */ jsxs("div", { className: "t2", children: [
          l[2],
          " \xB7 ",
          pdMoney(l[3])
        ] })
      ] }),
      /* @__PURE__ */ jsx("span", { className: `pda-badge ${stb[l[4]][0]}`, style: { fontSize: 11 }, children: stb[l[4]][1] })
    ] }, i)) })
  ] });
}
function AdminMobileFinance() {
  return /* @__PURE__ */ jsxs(MShell, { active: "more", title: "\u0424\u0438\u043D\u0430\u043D\u0441\u044B", back: true, children: [
    /* @__PURE__ */ jsxs("div", { style: { background: "linear-gradient(155deg,#CF5638,#A8402A)", color: "#fff", borderRadius: 16, padding: 18 }, children: [
      /* @__PURE__ */ jsx("div", { style: { fontSize: 12.5, color: "rgba(255,255,255,.85)", fontWeight: 600 }, children: "\u041E\u0431\u043E\u0440\u043E\u0442 \u0441\u0434\u0435\u043B\u043E\u043A \u0437\u0430 \u043C\u0435\u0441\u044F\u0446" }),
      /* @__PURE__ */ jsx("div", { style: { fontSize: 30, fontWeight: 700, letterSpacing: "-.5px", marginTop: 6 }, children: "3,24 \u043C\u043B\u043D \u20BD" }),
      /* @__PURE__ */ jsx("div", { style: { fontSize: 12.5, color: "rgba(255,255,255,.85)", marginTop: 4 }, children: "\u043E\u0446\u0435\u043D\u043A\u0430 \u043F\u043E \u0437\u0430\u0432\u0435\u0440\u0448\u0451\u043D\u043D\u044B\u043C \xB7 \u2191 14%" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "pdam-kpis", children: [
      /* @__PURE__ */ jsxs("div", { className: "pdam-kpi", children: [
        /* @__PURE__ */ jsx("div", { className: "lab", children: "\u0417\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043E" }),
        /* @__PURE__ */ jsx("div", { className: "val", children: "1 142" }),
        /* @__PURE__ */ jsx("div", { className: "delta", children: "\u2191 12%" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pdam-kpi", children: [
        /* @__PURE__ */ jsx("div", { className: "lab", children: "\u0421\u0440\u0435\u0434\u043D\u0438\u0439 \u0447\u0435\u043A" }),
        /* @__PURE__ */ jsx("div", { className: "val", children: "1 040 \u20BD" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "pdam-sec", children: [
      /* @__PURE__ */ jsx("div", { className: "sh", children: "\u0421\u0434\u0435\u043B\u043A\u0438 \u043F\u043E \u0441\u0442\u0430\u0442\u0443\u0441\u0430\u043C" }),
      /* @__PURE__ */ jsxs("div", { className: "pdam-kv", children: [
        /* @__PURE__ */ jsx("span", { className: "k", children: "\u0417\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043E" }),
        /* @__PURE__ */ jsx("span", { className: "v", children: "1 142" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pdam-kv", children: [
        /* @__PURE__ */ jsx("span", { className: "k", children: "\u0418\u0434\u0451\u0442 \u0441\u0435\u0439\u0447\u0430\u0441" }),
        /* @__PURE__ */ jsx("span", { className: "v", children: "86" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pdam-kv", children: [
        /* @__PURE__ */ jsx("span", { className: "k", children: "\u0416\u0430\u043B\u043E\u0431\u044B" }),
        /* @__PURE__ */ jsx("span", { className: "v", style: { color: "var(--pd-warn)" }, children: "3" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pdam-kv", children: [
        /* @__PURE__ */ jsx("span", { className: "k", children: "\u041E\u0442\u043C\u0435\u043D\u0435\u043D\u043E" }),
        /* @__PURE__ */ jsx("span", { className: "v", children: "41" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "pdam-readonly", children: "\u041F\u043B\u0430\u0442\u0435\u0436\u0438 \u043F\u0440\u043E\u0445\u043E\u0434\u044F\u0442 \u043C\u0435\u0436\u0434\u0443 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F\u043C\u0438 \u043D\u0430\u043F\u0440\u044F\u043C\u0443\u044E \u2014 \u043F\u043B\u043E\u0449\u0430\u0434\u043A\u0430 \u0438\u0445 \u043D\u0435 \u043E\u0431\u0440\u0430\u0431\u0430\u0442\u044B\u0432\u0430\u0435\u0442. \u041A\u043E\u043C\u0438\u0441\u0441\u0438\u044F \u0438 \u0432\u044B\u043F\u043B\u0430\u0442\u044B \u043F\u043E\u044F\u0432\u044F\u0442\u0441\u044F \u043F\u043E\u0441\u043B\u0435 \u043C\u043E\u043D\u0435\u0442\u0438\u0437\u0430\u0446\u0438\u0438." })
  ] });
}
function AdminMobileReports() {
  const reps = [["#R-882", "\u0421\u043F\u0430\u043C / \u043A\u043E\u043D\u0442\u0430\u043A\u0442\u044B", "\u041F\u0438\u043E\u043D\u044B, \u0431\u043E\u043B\u044C\u0448\u043E\u0439 \u0431\u0443\u043A\u0435\u0442", "new"], ["#R-879", "\u041E\u0441\u043A\u043E\u0440\u0431\u043B\u0435\u043D\u0438\u044F \u0432 \u0447\u0430\u0442\u0435", "\u042E\u043B\u044F \u0412.", "review"], ["#R-877", "\u041D\u0435\u0434\u043E\u0441\u0442\u043E\u0432\u0435\u0440\u043D\u044B\u0439 \u043E\u0442\u0437\u044B\u0432", "\u043A \u0441\u0434\u0435\u043B\u043A\u0435 #10478", "new"]];
  const st = { new: ["problem", "\u043D\u043E\u0432\u0430\u044F"], review: ["held", "\u0432 \u0440\u0430\u0431\u043E\u0442\u0435"] };
  return /* @__PURE__ */ jsxs(MShell, { active: "more", title: "\u0416\u0430\u043B\u043E\u0431\u044B", back: true, children: [
    /* @__PURE__ */ jsxs("div", { className: "pdam-chips", children: [
      /* @__PURE__ */ jsx("button", { className: "pdam-chip on", children: "\u041D\u043E\u0432\u044B\u0435 + \u0432 \u0440\u0430\u0431\u043E\u0442\u0435" }),
      /* @__PURE__ */ jsx("button", { className: "pdam-chip", children: "\u0412\u0441\u0435" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "pdam-sec", children: reps.map((r, i) => /* @__PURE__ */ jsxs("div", { className: "pdam-item", children: [
      /* @__PURE__ */ jsx("span", { className: "ic", style: { background: "var(--pd-warn-soft)", color: "var(--pd-warn)" }, children: mic(I.flag, "pd-i18") }),
      /* @__PURE__ */ jsxs("div", { className: "mid", children: [
        /* @__PURE__ */ jsxs("div", { className: "t1", children: [
          r[0],
          " \xB7 ",
          r[1]
        ] }),
        /* @__PURE__ */ jsx("div", { className: "t2", children: r[2] })
      ] }),
      /* @__PURE__ */ jsx("span", { className: `pda-badge ${st[r[3]][0]}`, style: { fontSize: 11 }, children: st[r[3]][1] })
    ] }, i)) })
  ] });
}

export { AdminDashboard, AdminDealConfirm, AdminDeals, AdminFinance, AdminFraud, AdminListings, AdminMobileBlock, AdminMobileDash, AdminMobileDealCancel, AdminMobileDeals, AdminMobileDispute, AdminMobileFinance, AdminMobileFraud, AdminMobileFraudDrill, AdminMobileListings, AdminMobileLogin, AdminMobileMod, AdminMobileModReject, AdminMobileMore, AdminMobileReports, AdminMobileUserDrill, AdminMobileUsers, AdminModeration, AdminReports, AdminShell, AdminToast, AdminUserDrill, AdminUsers, Side, Spark, aic };
