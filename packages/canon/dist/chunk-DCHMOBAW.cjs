'use strict';

var chunkCMKDVS6C_cjs = require('./chunk-CMKDVS6C.cjs');
var React = require('react');
var jsxRuntime = require('react/jsx-runtime');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React__default = /*#__PURE__*/_interopDefault(React);

var PETAL = "M50 50C38 41 36 21 50 10C64 21 62 41 50 50Z";
var Mark = ({ size = 22, center = "#E8A93B", style, className, title = "\u041F\u0435\u0440\u0435\u0434\u0430\u0440\u0438\u043C" }) => /* @__PURE__ */ jsxRuntime.jsxs("svg", { className, width: size, height: size, viewBox: "0 0 100 100", role: "img", "aria-label": title, style: { display: "block", flex: "none", ...style }, children: [
  [0, 72, 144, 216, 288].map((a) => /* @__PURE__ */ jsxRuntime.jsx("path", { d: PETAL, fill: "currentColor", transform: `rotate(${a} 50 50)` }, a)),
  /* @__PURE__ */ jsxRuntime.jsx("circle", { cx: "50", cy: "50", r: "8", fill: center })
] });
var PdWebNav = (function() {
  const Ic2 = chunkCMKDVS6C_cjs.Ic, Btn = chunkCMKDVS6C_cjs.PdBtn, Heart2 = chunkCMKDVS6C_cjs.Heart;
  const ico = (Fn, cls) => Fn ? Fn({ className: cls, fill: "none", stroke: "currentColor" }) : null;
  const Bell = (p) => /* @__PURE__ */ jsxRuntime.jsxs("svg", { viewBox: "0 0 24 24", ...p, fill: "none", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" }),
    /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M10 19a2 2 0 0 0 4 0" })
  ] });
  const Menu = (p) => /* @__PURE__ */ jsxRuntime.jsx("svg", { viewBox: "0 0 24 24", ...p, fill: "none", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round", children: /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M4 7h16M4 12h16M4 17h16" }) });
  const Close = (p) => /* @__PURE__ */ jsxRuntime.jsx("svg", { viewBox: "0 0 24 24", ...p, fill: "none", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round", children: /* @__PURE__ */ jsxRuntime.jsx("path", { d: "m6 6 12 12M18 6 6 18" }) });
  const Star = (p) => /* @__PURE__ */ jsxRuntime.jsx("svg", { viewBox: "0 0 24 24", ...p, fill: "currentColor", stroke: "none", children: /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.6 1-5.8L3.5 9.7l5.9-.9z" }) });
  const ChevR = (p) => /* @__PURE__ */ jsxRuntime.jsx("svg", { viewBox: "0 0 24 24", ...p, fill: "none", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxRuntime.jsx("path", { d: "m9 6 6 6-6 6" }) });
  const Shield = (p) => /* @__PURE__ */ jsxRuntime.jsxs("svg", { viewBox: "0 0 24 24", ...p, fill: "none", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" }),
    /* @__PURE__ */ jsxRuntime.jsx("path", { d: "m9 12 2 2 4-4" })
  ] });
  const Phone = (p) => /* @__PURE__ */ jsxRuntime.jsxs("svg", { viewBox: "0 0 24 24", ...p, fill: "none", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntime.jsx("rect", { x: "7", y: "2.5", width: "10", height: "19", rx: "2.5" }),
    /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M11 18.5h2" })
  ] });
  const LANDING = "\u041F\u0435\u0440\u0435\u0434\u0430\u0440\u0438\u043C \xB7 \u041B\u0435\u043D\u0434\u0438\u043D\u0433 peredarim.ru.html";
  const CATALOG = "\u041F\u0435\u0440\u0435\u0434\u0430\u0440\u0438\u043C \xB7 \u041A\u0430\u0442\u0430\u043B\u043E\u0433 \u0431\u0443\u043A\u0435\u0442\u043E\u0432.html";
  const DEFAULT_LINKS = [
    { label: "\u041A\u0430\u0442\u0430\u043B\u043E\u0433", sub: "\u0412\u0441\u0435 \u0441\u0432\u0435\u0436\u0438\u0435 \u0431\u0443\u043A\u0435\u0442\u044B \u041C\u043E\u0441\u043A\u0432\u044B", href: CATALOG, Icon: (p) => ico(Ic2.search, "pd-i20") },
    { label: "\u041A\u0430\u043A \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442", sub: "\u041F\u0435\u0440\u0435\u0434\u0430\u0440\u0438\u0432\u0430\u043D\u0438\u0435 \u0437\u0430 1 \u0434\u0435\u043D\u044C", href: LANDING + "#how", Icon: Shield },
    { label: "\u0411\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u0430\u044F \u0441\u0434\u0435\u043B\u043A\u0430", sub: "\u041E\u043F\u043B\u0430\u0442\u0430 \u043F\u0440\u0438 \u0432\u0441\u0442\u0440\u0435\u0447\u0435", href: LANDING + "#safe", Icon: (p) => ico(Ic2.deals, "pd-i20") },
    { label: "\u041F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435", sub: "iOS \u0438 Android", href: LANDING + "#app", Icon: Phone }
  ];
  return function PdWebNav2({ active, authed = true, city = "\u041C\u043E\u0441\u043A\u0432\u0430", cityLoc = "\u041C\u043E\u0441\u043A\u0432\u0435", user = { n: "\u041C\u0430\u0440\u0438\u044F", r: 4.9 }, links = DEFAULT_LINKS, onPublish }) {
    const [menu, setMenu] = React__default.default.useState(false);
    const close = () => setMenu(false);
    const initial = user && user.n ? user.n[0] : "\u041C";
    return /* @__PURE__ */ jsxRuntime.jsxs(React__default.default.Fragment, { children: [
      /* @__PURE__ */ jsxRuntime.jsx("header", { className: "pdl-nav", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-nav-in", children: [
        /* @__PURE__ */ jsxRuntime.jsxs("a", { href: LANDING, className: "pdl-brand", style: { textDecoration: "none" }, children: [
          /* @__PURE__ */ jsxRuntime.jsx(Mark, { size: 24 }),
          "\u041F\u0435\u0440\u0435\u0434\u0430\u0440\u0438\u043C"
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-nav-mid", children: [
          /* @__PURE__ */ jsxRuntime.jsxs("button", { className: "pdl-nav-city", children: [
            ico(Ic2.pin, "pd-i16"),
            city,
            ico(Ic2.chev, "pd-i14")
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-nav-search", children: [
            ico(Ic2.search, "pd-i18"),
            /* @__PURE__ */ jsxRuntime.jsxs("span", { children: [
              "\u041F\u043E\u0438\u0441\u043A \u0441\u0432\u0435\u0436\u0438\u0445 \u0431\u0443\u043A\u0435\u0442\u043E\u0432 \u0432 ",
              cityLoc
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-navright", children: [
          /* @__PURE__ */ jsxRuntime.jsx("button", { className: "pdl-nav-icon", "aria-label": "\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F", children: /* @__PURE__ */ jsxRuntime.jsx(Bell, {}) }),
          authed ? /* @__PURE__ */ jsxRuntime.jsxs(React__default.default.Fragment, { children: [
            /* @__PURE__ */ jsxRuntime.jsx("button", { className: "pdl-nav-icon pdl-nav-fav", "aria-label": "\u0418\u0437\u0431\u0440\u0430\u043D\u043D\u043E\u0435", children: /* @__PURE__ */ jsxRuntime.jsx(Heart2, { className: "pd-i20" }) }),
            /* @__PURE__ */ jsxRuntime.jsx("button", { className: "pdl-nav-ava", "aria-label": "\u041F\u0440\u043E\u0444\u0438\u043B\u044C", children: initial })
          ] }) : /* @__PURE__ */ jsxRuntime.jsx("a", { className: "pdl-nav-login", href: LANDING + "#login", children: "\u0412\u043E\u0439\u0442\u0438" }),
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "pdl-nav-cta", children: /* @__PURE__ */ jsxRuntime.jsx(Btn, { variant: "primary", icon: Ic2 && Ic2.plus, onClick: onPublish, children: "\u041E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u0442\u044C \u0431\u0443\u043A\u0435\u0442" }) }),
          /* @__PURE__ */ jsxRuntime.jsx("button", { className: "pdl-nav-burger", "aria-label": "\u041C\u0435\u043D\u044E", "aria-expanded": menu, onClick: () => setMenu(true), children: /* @__PURE__ */ jsxRuntime.jsx(Menu, {}) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-drawer" + (menu ? " open" : ""), "aria-hidden": !menu, children: [
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pdl-drawer-scrim", onClick: close }),
        /* @__PURE__ */ jsxRuntime.jsxs("aside", { className: "pdl-drawer-panel", role: "dialog", "aria-modal": "true", "aria-label": "\u041C\u0435\u043D\u044E", children: [
          /* @__PURE__ */ jsxRuntime.jsxs("header", { className: "pdl-drawer-top", children: [
            /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "pdl-brand", children: [
              /* @__PURE__ */ jsxRuntime.jsx(Mark, { size: 23 }),
              "\u041F\u0435\u0440\u0435\u0434\u0430\u0440\u0438\u043C"
            ] }),
            /* @__PURE__ */ jsxRuntime.jsx("button", { className: "pdl-drawer-x", onClick: close, "aria-label": "\u0417\u0430\u043A\u0440\u044B\u0442\u044C \u043C\u0435\u043D\u044E", children: /* @__PURE__ */ jsxRuntime.jsx(Close, {}) })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pdl-drawer-body", children: [
            authed ? /* @__PURE__ */ jsxRuntime.jsxs("a", { className: "pdl-drawer-prof", href: "#", onClick: (e) => {
              e.preventDefault();
              close();
            }, children: [
              /* @__PURE__ */ jsxRuntime.jsx("span", { className: "av", children: initial }),
              /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "who", children: [
                /* @__PURE__ */ jsxRuntime.jsx("b", { children: user.n }),
                /* @__PURE__ */ jsxRuntime.jsx("span", { children: "\u041F\u0440\u043E\u0444\u0438\u043B\u044C \u0438 \u043E\u0442\u0437\u044B\u0432\u044B" })
              ] }),
              /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "rt", children: [
                /* @__PURE__ */ jsxRuntime.jsx(Star, {}),
                (user.r || 5).toFixed(1).replace(".", ",")
              ] }),
              /* @__PURE__ */ jsxRuntime.jsx(ChevR, { className: "go" })
            ] }) : /* @__PURE__ */ jsxRuntime.jsxs("a", { className: "pdl-drawer-prof pdl-drawer-login", href: LANDING + "#login", onClick: close, children: [
              /* @__PURE__ */ jsxRuntime.jsx("span", { className: "av", children: ico(Ic2.user || Ic2.deals, "pd-i20") }),
              /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "who", children: [
                /* @__PURE__ */ jsxRuntime.jsx("b", { children: "\u0412\u043E\u0439\u0442\u0438 \u0438\u043B\u0438 \u0437\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C\u0441\u044F" }),
                /* @__PURE__ */ jsxRuntime.jsx("span", { children: "\u0427\u0442\u043E\u0431\u044B \u043F\u0440\u043E\u0434\u0430\u0432\u0430\u0442\u044C \u0438 \u0441\u043E\u0445\u0440\u0430\u043D\u044F\u0442\u044C" })
              ] }),
              /* @__PURE__ */ jsxRuntime.jsx(ChevR, { className: "go" })
            ] }),
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pdl-drawer-city", children: /* @__PURE__ */ jsxRuntime.jsxs("button", { className: "head", children: [
              /* @__PURE__ */ jsxRuntime.jsx("span", { className: "pin", children: ico(Ic2.pin, "pd-i18") }),
              /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "tx", children: [
                /* @__PURE__ */ jsxRuntime.jsx("b", { children: city }),
                /* @__PURE__ */ jsxRuntime.jsx("span", { children: "\u0441\u0432\u0435\u0436\u0438\u0435 \u0431\u0443\u043A\u0435\u0442\u044B \u0440\u044F\u0434\u043E\u043C" })
              ] }),
              ico(Ic2.chev, "chev pd-i18")
            ] }) }),
            /* @__PURE__ */ jsxRuntime.jsx("nav", { className: "pdl-drawer-nav", children: links.map((l) => /* @__PURE__ */ jsxRuntime.jsxs("a", { className: "pdl-drawer-row" + (active === l.label ? " on" : ""), href: l.href, onClick: close, children: [
              /* @__PURE__ */ jsxRuntime.jsx("span", { className: "ic", children: /* @__PURE__ */ jsxRuntime.jsx(l.Icon, {}) }),
              /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "tx", children: [
                /* @__PURE__ */ jsxRuntime.jsx("b", { children: l.label }),
                /* @__PURE__ */ jsxRuntime.jsx("span", { children: l.sub })
              ] }),
              /* @__PURE__ */ jsxRuntime.jsx(ChevR, { className: "go" })
            ] }, l.label)) })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsx("footer", { className: "pdl-drawer-foot", children: /* @__PURE__ */ jsxRuntime.jsx(Btn, { variant: "primary", block: true, lg: true, icon: Ic2 && Ic2.plus, onClick: () => {
            close();
            onPublish && onPublish();
          }, children: "\u041E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u0442\u044C \u0431\u0443\u043A\u0435\u0442" }) })
        ] })
      ] })
    ] });
  };
})();

exports.PdWebNav = PdWebNav;
