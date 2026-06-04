import { I, PdBtn, PdNotice, PdField, PdInput, PdOtp, Ic } from './chunk-GANLKAPU.mjs';
import 'react';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';

var A = {
  chevR: (p) => /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", ...p, children: /* @__PURE__ */ jsx("path", { d: "m9 5 7 7-7 7" }) }),
  phone: (p) => /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", ...p, children: /* @__PURE__ */ jsx("path", { d: "M6 3h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 4 5a2 2 0 0 1 2-2Z" }) }),
  apple: (p) => /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "currentColor", stroke: "none", ...p, children: /* @__PURE__ */ jsx("path", { d: "M16 13c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.9-1.4-.1-2.8.9-3.5.9s-1.8-.8-3-.8C6.7 7.7 5.3 8.5 4.5 9.9c-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7 2-1.1 2.8-2.2c.9-1.3 1.2-2.5 1.3-2.6-.1 0-2.5-1-2.5-3.7ZM13.8 6.1c.6-.8 1.1-1.9.9-3-1 0-2.1.7-2.8 1.5-.6.7-1.1 1.8-.9 2.9 1.1 0 2.2-.6 2.8-1.4Z" }) }),
  gift: (p) => /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", ...p, children: [
    /* @__PURE__ */ jsx("rect", { x: "3", y: "9", width: "18", height: "11", rx: "1.5" }),
    /* @__PURE__ */ jsx("path", { d: "M3 13h18M12 9v11M8.5 9C6 9 6 5 8.5 5S12 9 12 9s-.5-4 2-4 2.5 4 0 4" })
  ] }),
  lockGlobe: (p) => /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", ...p, children: [
    /* @__PURE__ */ jsx("rect", { x: "5", y: "11", width: "14", height: "9", rx: "2.2" }),
    /* @__PURE__ */ jsx("path", { d: "M8 11V8a4 4 0 0 1 8 0v3" })
  ] }),
  spark: (p) => /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", ...p, children: /* @__PURE__ */ jsx("path", { d: "M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" }) }),
  heart: (p) => /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", ...p, children: /* @__PURE__ */ jsx("path", { d: "M12 20s-7-4.6-9.2-9C1.3 8 2.6 4.6 5.9 4.6c2 0 3.3 1.2 4.1 2.4.8-1.2 2.1-2.4 4.1-2.4 3.3 0 4.6 3.4 3.1 6.4C19 15.4 12 20 12 20Z" }) }),
  star: (p) => /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", ...p, children: /* @__PURE__ */ jsx("path", { d: "M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.6 1-5.8L3.5 9.7l5.9-.9z" }) }),
  wifi: (p) => /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", ...p, children: [
    /* @__PURE__ */ jsx("path", { d: "M2 8a16 16 0 0 1 20 0M5 12a11 11 0 0 1 14 0M8.5 15.5a6 6 0 0 1 7 0" }),
    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "19", r: "1", fill: "currentColor" })
  ] })
};
var ic = (Fn, cls = "pd-i18") => Fn({ className: cls, fill: "none", stroke: "currentColor" });
var PROV = {
  ya: { mk: "pa-mk-ya", ch: "\u042F", lbl: "\u0412\u043E\u0439\u0442\u0438 \u0441 \u042F\u043D\u0434\u0435\u043A\u0441 ID" },
  sber: { mk: "pa-mk-sber", ch: "\u0421", lbl: "\u0412\u043E\u0439\u0442\u0438 \u0441\u043E \u0421\u0431\u0435\u0440 ID" },
  vk: { mk: "pa-mk-vk", ch: "VK", lbl: "\u0412\u043E\u0439\u0442\u0438 \u0447\u0435\u0440\u0435\u0437 VK ID" },
  tid: { mk: "pa-mk-tid", ch: "\u0422", lbl: "\u0412\u043E\u0439\u0442\u0438 \u0441 T-ID" },
  apple: { mk: "pa-mk-apple", icon: A.apple, lbl: "\u0412\u043E\u0439\u0442\u0438 \u0441 Apple" },
  gos: { mk: "pa-mk-gos", ch: "\u0413\u0423", lbl: "\u0412\u043E\u0439\u0442\u0438 \u0447\u0435\u0440\u0435\u0437 \u0413\u043E\u0441\u0443\u0441\u043B\u0443\u0433\u0438" },
  phone: { mk: "pa-mk-phone", icon: A.phone, lbl: "\u0412\u043E\u0439\u0442\u0438 \u043F\u043E \u043D\u043E\u043C\u0435\u0440\u0443 \u0442\u0435\u043B\u0435\u0444\u043E\u043D\u0430", tint: true }
};
function OAuthBtn({ k, primary }) {
  const p = PROV[k];
  return /* @__PURE__ */ jsxs("button", { className: `pa-oauthbtn${primary ? " pa-oauthbtn--primary" : ""}`, children: [
    /* @__PURE__ */ jsx("span", { className: `mark ${p.mk}`, children: p.icon ? p.icon({ className: "pd-i18", style: { color: "inherit" } }) : p.ch }),
    /* @__PURE__ */ jsx("span", { className: "lbl", children: p.lbl }),
    /* @__PURE__ */ jsx("span", { className: "chev", children: ic(A.chevR, "pd-i16") })
  ] });
}
function OauthList({ plat }) {
  const list = plat === "ios" ? [["apple", true], ["ya", false], ["sber", false], ["vk", false], ["tid", false]] : [["ya", true], ["sber", false], ["vk", false], ["tid", false]];
  return /* @__PURE__ */ jsx("div", { className: "pa-oauth", children: list.map(([k, pr]) => /* @__PURE__ */ jsx(OAuthBtn, { k, primary: pr }, k)) });
}
var Consent = () => /* @__PURE__ */ jsxs("p", { className: "pa-consent", children: [
  "\u041F\u0440\u043E\u0434\u043E\u043B\u0436\u0430\u044F, \u0432\u044B \u0441\u043E\u0433\u043B\u0430\u0448\u0430\u0435\u0442\u0435\u0441\u044C \u0441 ",
  /* @__PURE__ */ jsx("a", { children: "\u0443\u0441\u043B\u043E\u0432\u0438\u044F\u043C\u0438" }),
  " \u0438 ",
  /* @__PURE__ */ jsx("a", { children: "\u043F\u043E\u043B\u0438\u0442\u0438\u043A\u043E\u0439 \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u043A\u0438 \u043F\u0435\u0440\u0441\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0445 \u0434\u0430\u043D\u043D\u044B\u0445" }),
  " (\u0424\u0417-152)."
] });
var TrustStrip = () => /* @__PURE__ */ jsxs("div", { className: "pa-trust", children: [
  ic(A.lockGlobe, "pd-i14"),
  " \u0417\u0430\u0449\u0438\u0449\u0451\u043D\u043D\u043E\u0435 \u0441\u043E\u0435\u0434\u0438\u043D\u0435\u043D\u0438\u0435 \xB7 \u0434\u0430\u043D\u043D\u044B\u0435 \u0448\u0438\u0444\u0440\u0443\u044E\u0442\u0441\u044F"
] });
function AuthShell({ plat = "ios", back = true, children, foot, overlay }) {
  return /* @__PURE__ */ jsxs("div", { className: `pd-root pa pa--${plat}`, "data-pd-theme": "a", style: { position: "relative" }, children: [
    /* @__PURE__ */ jsx("div", { className: "pa-top", style: { paddingTop: plat === "android" ? 6 : 0 }, children: back && /* @__PURE__ */ jsx("button", { className: "pd-iconbtn", children: ic(I.back, "pd-i22") }) }),
    /* @__PURE__ */ jsx("div", { className: "pa-body", children }),
    foot,
    overlay
  ] });
}
var Hero = ({ title, sub, logo = true }) => /* @__PURE__ */ jsxs("div", { className: "pa-hero", children: [
  logo && /* @__PURE__ */ jsx("div", { className: "pa-logo", children: ic(A.gift, "pd-i28") }),
  title ? /* @__PURE__ */ jsx("h1", { className: "pa-h2", children: title }) : /* @__PURE__ */ jsx("div", { className: "pa-brand", children: "\u041F\u0435\u0440\u0435\u0434\u0430\u0440\u0438\u043C" }),
  sub && /* @__PURE__ */ jsx("p", { className: "pa-tag", children: sub })
] });
function AuthChooser({ plat = "ios" }) {
  return /* @__PURE__ */ jsxs(AuthShell, { plat, back: false, children: [
    /* @__PURE__ */ jsx(Hero, { sub: /* @__PURE__ */ jsxs(Fragment, { children: [
      "\u0421\u0432\u0435\u0436\u0438\u0435 \u0431\u0443\u043A\u0435\u0442\u044B \u0441\u043E \u0441\u043A\u0438\u0434\u043A\u043E\u0439",
      /* @__PURE__ */ jsx("br", {}),
      "\u0438 \u0432\u0442\u043E\u0440\u0430\u044F \u0436\u0438\u0437\u043D\u044C \u0434\u043B\u044F \u043F\u043E\u0434\u0430\u0440\u0435\u043D\u043D\u044B\u0445 \u0446\u0432\u0435\u0442\u043E\u0432."
    ] }) }),
    /* @__PURE__ */ jsx(OauthList, { plat }),
    /* @__PURE__ */ jsx("div", { className: "pa-or", children: "\u0431\u044B\u0441\u0442\u0440\u0435\u0435 \u0432\u0441\u0435\u0433\u043E \u0447\u0435\u0440\u0435\u0437 \u0441\u0435\u0440\u0432\u0438\u0441" }),
    /* @__PURE__ */ jsx("div", { className: "pa-oauth", children: /* @__PURE__ */ jsx(OAuthBtn, { k: "phone" }) }),
    /* @__PURE__ */ jsx(Consent, {}),
    /* @__PURE__ */ jsx(TrustStrip, {})
  ] });
}
function ProvHead({ k }) {
  const p = PROV[k];
  return /* @__PURE__ */ jsxs("div", { className: "pa-provhead", children: [
    /* @__PURE__ */ jsx("span", { className: `mark ${p.mk}`, children: p.icon ? p.icon({ className: "pd-i20" }) : p.ch }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("div", { className: "ttl", children: p.lbl.replace("\u0412\u043E\u0439\u0442\u0438 \u0441 ", "").replace("\u0412\u043E\u0439\u0442\u0438 \u0447\u0435\u0440\u0435\u0437 ", "").replace("\u0412\u043E\u0439\u0442\u0438 \u0441\u043E ", "") }),
      /* @__PURE__ */ jsxs("div", { className: "url", children: [
        ic(I.lock, "pd-i12"),
        " id.",
        k === "ya" ? "yandex" : k === "sber" ? "sber" : k,
        ".ru"
      ] })
    ] })
  ] });
}
function ConsentBody({ k }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(ProvHead, { k }),
    /* @__PURE__ */ jsxs("div", { className: "pa-account", children: [
      /* @__PURE__ */ jsx("div", { className: "av", children: /* @__PURE__ */ jsx("img", { src: "img/av/w4.jpg", alt: "" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "nm", children: "\u0415\u043A\u0430\u0442\u0435\u0440\u0438\u043D\u0430 \u041B." }),
        /* @__PURE__ */ jsx("div", { className: "ph", children: "+7 999 \u2022\u2022\u2022-58-03" })
      ] }),
      /* @__PURE__ */ jsx("button", { className: "pd-link", style: { marginLeft: "auto" }, children: "\u0421\u043C\u0435\u043D\u0438\u0442\u044C" })
    ] }),
    /* @__PURE__ */ jsx("div", { style: { fontSize: 13, color: "var(--pd-muted)", marginBottom: 8 }, children: "\xAB\u041F\u0435\u0440\u0435\u0434\u0430\u0440\u0438\u043C\xBB \u0437\u0430\u043F\u0440\u043E\u0441\u0438\u0442:" }),
    /* @__PURE__ */ jsxs("div", { className: "pa-scopes", children: [
      /* @__PURE__ */ jsxs("div", { className: "pa-scope", children: [
        ic(I.check, "pd-i16"),
        /* @__PURE__ */ jsxs("span", { children: [
          "\u0418\u043C\u044F \u0438 \u0444\u043E\u0442\u043E \u043F\u0440\u043E\u0444\u0438\u043B\u044F",
          /* @__PURE__ */ jsx("span", { className: "muted", children: "\u0447\u0442\u043E\u0431\u044B \u043F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u0438 \u0432\u0430\u0441 \u0443\u0437\u043D\u0430\u0432\u0430\u043B\u0438" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pa-scope", children: [
        ic(I.check, "pd-i16"),
        /* @__PURE__ */ jsxs("span", { children: [
          "\u041D\u043E\u043C\u0435\u0440 \u0442\u0435\u043B\u0435\u0444\u043E\u043D\u0430",
          /* @__PURE__ */ jsx("span", { className: "muted", children: "\u0434\u043B\u044F \u0432\u0445\u043E\u0434\u0430 \u0438 \u0441\u0432\u044F\u0437\u0438 \u043F\u043E \u0441\u0434\u0435\u043B\u043A\u0435" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pa-scope", children: [
        ic(I.check, "pd-i16"),
        /* @__PURE__ */ jsxs("span", { children: [
          "Email",
          /* @__PURE__ */ jsx("span", { className: "muted", children: "\u0434\u043B\u044F \u0447\u0435\u043A\u043E\u0432 \u0438 \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u0439" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(PdBtn, { variant: "primary", block: true, lg: true, children: "\u0420\u0430\u0437\u0440\u0435\u0448\u0438\u0442\u044C \u0438 \u0432\u043E\u0439\u0442\u0438" }),
    /* @__PURE__ */ jsx("button", { className: "pd-link", style: { display: "block", margin: "12px auto 0" }, children: "\u041E\u0442\u043C\u0435\u043D\u0430" })
  ] });
}
function AuthOAuthSheet({ plat = "ios", prov = "ya" }) {
  const overlay = /* @__PURE__ */ jsx("div", { className: "pa-scrim", children: /* @__PURE__ */ jsxs("div", { className: "pa-sheet", children: [
    /* @__PURE__ */ jsx("div", { className: "grab" }),
    /* @__PURE__ */ jsx(ConsentBody, { k: prov })
  ] }) });
  return /* @__PURE__ */ jsxs("div", { className: `pd-root pa pa--${plat}`, "data-pd-theme": "a", style: { position: "relative" }, children: [
    /* @__PURE__ */ jsx("div", { className: "pa-top" }),
    /* @__PURE__ */ jsxs("div", { className: "pa-body", style: { filter: "blur(1.5px)", opacity: 0.5, pointerEvents: "none" }, children: [
      /* @__PURE__ */ jsx(Hero, { sub: "\u0421\u0432\u0435\u0436\u0438\u0435 \u0431\u0443\u043A\u0435\u0442\u044B \u0441\u043E \u0441\u043A\u0438\u0434\u043A\u043E\u0439." }),
      /* @__PURE__ */ jsx(OauthList, { plat })
    ] }),
    overlay
  ] });
}
function PhoneBody({ state = "rest", plat }) {
  const invalid = state === "invalid";
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { style: { textAlign: "center", margin: "8px 0 24px" }, children: [
      /* @__PURE__ */ jsx("h2", { className: "pa-h2", children: "\u0412\u0445\u043E\u0434 \u043F\u043E \u0442\u0435\u043B\u0435\u0444\u043E\u043D\u0443" }),
      /* @__PURE__ */ jsx("p", { className: "pa-sub", children: "\u041F\u0440\u0438\u0448\u043B\u0451\u043C \u043A\u043E\u0434 \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u044F \u043F\u043E SMS." })
    ] }),
    /* @__PURE__ */ jsx(
      PdField,
      {
        label: "\u041D\u043E\u043C\u0435\u0440 \u0442\u0435\u043B\u0435\u0444\u043E\u043D\u0430",
        hint: invalid ? void 0 : "\u041D\u0430\u043F\u0440\u0438\u043C\u0435\u0440, +7 999 124-58-03",
        error: invalid ? "\u041F\u043E\u0445\u043E\u0436\u0435, \u0432 \u043D\u043E\u043C\u0435\u0440\u0435 \u043D\u0435 \u0445\u0432\u0430\u0442\u0430\u0435\u0442 \u0446\u0438\u0444\u0440" : void 0,
        children: /* @__PURE__ */ jsx(PdInput, { prefix: "+7", value: invalid ? "999 124-58" : "999 124-58-03", state: invalid ? "invalid" : "focus" })
      }
    ),
    /* @__PURE__ */ jsx("div", { style: { marginTop: 16 }, children: /* @__PURE__ */ jsxs("label", { className: "pd-check on", children: [
      /* @__PURE__ */ jsx("span", { className: "box", children: ic(I.check, "pd-i16") }),
      /* @__PURE__ */ jsxs("span", { className: "t", children: [
        "\u0421\u043E\u0433\u043B\u0430\u0448\u0430\u044E\u0441\u044C \u0441 ",
        /* @__PURE__ */ jsx("a", { children: "\u0443\u0441\u043B\u043E\u0432\u0438\u044F\u043C\u0438" }),
        " \u0438 ",
        /* @__PURE__ */ jsx("a", { children: "\u043F\u043E\u043B\u0438\u0442\u0438\u043A\u043E\u0439 \u041F\u0414\u043D" }),
        " (\u0424\u0417-152)."
      ] })
    ] }) })
  ] });
}
function AuthPhone({ plat = "ios", state = "rest" }) {
  const foot = /* @__PURE__ */ jsx("div", { className: `pd-footerbar pa-foot${plat === "android" ? "" : ""}`, children: /* @__PURE__ */ jsx(PdBtn, { variant: "primary", block: true, lg: true, children: "\u041F\u043E\u043B\u0443\u0447\u0438\u0442\u044C \u043A\u043E\u0434" }) });
  return /* @__PURE__ */ jsx(AuthShell, { plat, foot, children: /* @__PURE__ */ jsx(PhoneBody, { state, plat }) });
}
function OtpBody({ state = "typing" }) {
  const map = {
    typing: { value: "4127", cur: 4, st: void 0 },
    verifying: { value: "412739", st: void 0 },
    invalid: { value: "412700", st: "invalid" },
    locked: { value: "0000", st: "locked" }
  };
  const c = map[state];
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { style: { textAlign: "center", margin: "10px 0 24px" }, children: [
      /* @__PURE__ */ jsx("h2", { className: "pa-h2", children: "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043A\u043E\u0434" }),
      /* @__PURE__ */ jsx("p", { className: "pa-sub", children: "\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u043B\u0438 \u043D\u0430 +7 999 124-58-03" })
    ] }),
    /* @__PURE__ */ jsx(PdOtp, { value: c.value, cur: c.cur, state: c.st }),
    state === "verifying" && /* @__PURE__ */ jsxs("p", { style: { textAlign: "center", color: "var(--pd-muted)", fontSize: 13, marginTop: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }, children: [
      null,
      /* @__PURE__ */ jsx("span", { className: "pd-spin", style: { width: 16, height: 16, border: "2px solid var(--pd-border)", borderTopColor: "var(--pd-primary)", borderRadius: "50%", display: "inline-block" } }),
      "\u041F\u0440\u043E\u0432\u0435\u0440\u044F\u0435\u043C \u043A\u043E\u0434\u2026"
    ] }),
    state === "invalid" && /* @__PURE__ */ jsx("div", { style: { marginTop: 18 }, children: /* @__PURE__ */ jsx(PdNotice, { kind: "danger", children: "\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u043A\u043E\u0434. \u041E\u0441\u0442\u0430\u043B\u043E\u0441\u044C \u043F\u043E\u043F\u044B\u0442\u043E\u043A: 2. \u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 SMS \u0438\u043B\u0438 \u0437\u0430\u043F\u0440\u043E\u0441\u0438\u0442\u0435 \u043A\u043E\u0434 \u0437\u0430\u043D\u043E\u0432\u043E." }) }),
    state === "locked" && /* @__PURE__ */ jsx("div", { style: { marginTop: 18 }, children: /* @__PURE__ */ jsxs(PdNotice, { kind: "danger", icon: I.lock, children: [
      /* @__PURE__ */ jsx("b", { children: "\u0421\u043B\u0438\u0448\u043A\u043E\u043C \u043C\u043D\u043E\u0433\u043E \u043F\u043E\u043F\u044B\u0442\u043E\u043A." }),
      " \u041F\u043E\u0432\u0442\u043E\u0440\u043D\u0430\u044F \u043E\u0442\u043F\u0440\u0430\u0432\u043A\u0430 \u0431\u0443\u0434\u0435\u0442 \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0430 \u0447\u0435\u0440\u0435\u0437 58:00."
    ] }) }),
    state === "typing" && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("p", { style: { textAlign: "center", color: "var(--pd-muted)", fontSize: 13, marginTop: 20 }, children: "\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u043A\u043E\u0434 \u0441\u043D\u043E\u0432\u0430 \u0447\u0435\u0440\u0435\u0437 0:42" }),
      /* @__PURE__ */ jsx("p", { style: { textAlign: "center", marginTop: 8 }, children: /* @__PURE__ */ jsx("button", { className: "pd-link", children: "\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u043D\u043E\u043C\u0435\u0440" }) })
    ] })
  ] });
}
function AuthOtp({ plat = "ios", state = "typing" }) {
  let foot;
  if (state === "locked") foot = /* @__PURE__ */ jsx("div", { className: "pd-footerbar pa-foot", children: /* @__PURE__ */ jsx(PdBtn, { variant: "secondary", block: true, lg: true, disabled: true, children: "\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u044C \u0447\u0435\u0440\u0435\u0437 58:00" }) });
  else if (state === "verifying") foot = /* @__PURE__ */ jsx("div", { className: "pd-footerbar pa-foot", children: /* @__PURE__ */ jsx(PdBtn, { variant: "primary", block: true, lg: true, loading: true, disabled: true, children: "\u0412\u0445\u043E\u0434\u0438\u043C\u2026" }) });
  else foot = /* @__PURE__ */ jsx("div", { className: "pd-footerbar pa-foot", children: /* @__PURE__ */ jsx(PdBtn, { variant: "primary", block: true, lg: true, children: "\u0412\u043E\u0439\u0442\u0438" }) });
  return /* @__PURE__ */ jsx(AuthShell, { plat, foot, children: /* @__PURE__ */ jsx(OtpBody, { state }) });
}
function RegisterBody({ state = "rest", plat }) {
  const invalid = state === "invalid";
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "pa-steps", children: [
      /* @__PURE__ */ jsx("i", {}),
      /* @__PURE__ */ jsx("i", { className: "on" }),
      /* @__PURE__ */ jsx("i", {})
    ] }),
    /* @__PURE__ */ jsxs("div", { style: { textAlign: "center", margin: "6px 0 18px" }, children: [
      /* @__PURE__ */ jsx("h2", { className: "pa-h2", children: "\u0414\u0430\u0432\u0430\u0439\u0442\u0435 \u043F\u043E\u0437\u043D\u0430\u043A\u043E\u043C\u0438\u043C\u0441\u044F" }),
      /* @__PURE__ */ jsx("p", { className: "pa-sub", children: "\u0422\u0430\u043A \u0432\u0430\u0441 \u0443\u0432\u0438\u0434\u044F\u0442 \u043F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u0438. \u042D\u0442\u043E \u0437\u0430\u0439\u043C\u0451\u0442 \u043C\u0438\u043D\u0443\u0442\u0443." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "pa-avadd", children: [
      /* @__PURE__ */ jsxs("div", { className: "ring", children: [
        ic(I.camera, "pd-i24"),
        /* @__PURE__ */ jsx("span", { className: "cam", children: ic(I.camera, "pd-i14") })
      ] }),
      /* @__PURE__ */ jsx("span", { className: "lab", children: "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0444\u043E\u0442\u043E \xB7 \u043F\u043E \u0436\u0435\u043B\u0430\u043D\u0438\u044E" })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 16 }, children: [
      /* @__PURE__ */ jsx(PdField, { label: "\u041A\u0430\u043A \u0432\u0430\u0441 \u0437\u043E\u0432\u0443\u0442", error: invalid ? "\u0423\u043A\u0430\u0436\u0438\u0442\u0435 \u0438\u043C\u044F, \u0435\u0433\u043E \u0443\u0432\u0438\u0434\u044F\u0442 \u043F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u0438" : void 0, children: /* @__PURE__ */ jsx(PdInput, { value: invalid ? "" : "\u0415\u043A\u0430\u0442\u0435\u0440\u0438\u043D\u0430", placeholder: "\u0418\u043C\u044F", state: invalid ? "invalid" : "focus" }) }),
      /* @__PURE__ */ jsx(PdField, { label: "\u0413\u043E\u0440\u043E\u0434", hint: "\u041F\u043E\u043A\u0430\u0436\u0435\u043C \u0431\u0443\u043A\u0435\u0442\u044B \u0438 \u043F\u043E\u043A\u0443\u043F\u0430\u0442\u0435\u043B\u0435\u0439 \u0440\u044F\u0434\u043E\u043C", children: /* @__PURE__ */ jsxs("div", { className: "pa-citysel", children: [
        /* @__PURE__ */ jsx("span", { children: "\u041C\u043E\u0441\u043A\u0432\u0430" }),
        /* @__PURE__ */ jsx("span", { className: "chev", children: ic(Ic.chev, "pd-i18") })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("p", { style: { fontSize: 12, color: "var(--pd-faint)", marginTop: 14, lineHeight: 1.5 }, children: "\u0418\u043C\u044F \u043C\u043E\u0436\u043D\u043E \u0438\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u043F\u043E\u0437\u0436\u0435 \u0432 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430\u0445 \u043F\u0440\u043E\u0444\u0438\u043B\u044F." })
  ] });
}
function AuthRegister({ plat = "ios", state = "rest" }) {
  const foot = state === "submitting" ? /* @__PURE__ */ jsx("div", { className: "pd-footerbar pa-foot", children: /* @__PURE__ */ jsx(PdBtn, { variant: "primary", block: true, lg: true, loading: true, disabled: true, children: "\u0421\u043E\u0445\u0440\u0430\u043D\u044F\u0435\u043C\u2026" }) }) : /* @__PURE__ */ jsx("div", { className: "pd-footerbar pa-foot", children: /* @__PURE__ */ jsx(PdBtn, { variant: "primary", block: true, lg: true, children: "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u0438 \u043F\u0440\u043E\u0434\u043E\u043B\u0436\u0438\u0442\u044C" }) });
  return /* @__PURE__ */ jsx(AuthShell, { plat, foot, children: /* @__PURE__ */ jsx(RegisterBody, { state, plat }) });
}
function AuthLink({ plat = "ios" }) {
  const foot = /* @__PURE__ */ jsxs("div", { className: "pd-footerbar pa-foot", style: { display: "flex", flexDirection: "column", gap: 9 }, children: [
    /* @__PURE__ */ jsx(PdBtn, { variant: "primary", block: true, lg: true, children: "\u0412\u043E\u0439\u0442\u0438 \u0447\u0435\u0440\u0435\u0437 \u042F\u043D\u0434\u0435\u043A\u0441 ID" }),
    /* @__PURE__ */ jsx(PdBtn, { variant: "ghost", block: true, children: "\u041F\u0440\u043E\u0434\u043E\u043B\u0436\u0438\u0442\u044C \u043F\u043E SMS-\u043A\u043E\u0434\u0443" })
  ] });
  return /* @__PURE__ */ jsxs(AuthShell, { plat, foot, children: [
    /* @__PURE__ */ jsxs("div", { style: { textAlign: "center", margin: "18px 0 22px" }, children: [
      /* @__PURE__ */ jsx("div", { className: "pa-logo", style: { background: "var(--pd-warn-soft)", color: "var(--pd-warn)" }, children: ic(I.shield, "pd-i28") }),
      /* @__PURE__ */ jsx("h2", { className: "pa-h2", children: "\u042D\u0442\u043E\u0442 \u043D\u043E\u043C\u0435\u0440 \u0443\u0436\u0435 \u0437\u043D\u0430\u043A\u043E\u043C" }),
      /* @__PURE__ */ jsxs("p", { className: "pa-sub", children: [
        "\u0410\u043A\u043A\u0430\u0443\u043D\u0442 \u0441 \u043D\u043E\u043C\u0435\u0440\u043E\u043C +7 999 \u2022\u2022\u2022-58-03 \u0443\u0436\u0435 \u043F\u0440\u0438\u0432\u044F\u0437\u0430\u043D \u043A ",
        /* @__PURE__ */ jsx("b", { children: "\u042F\u043D\u0434\u0435\u043A\u0441 ID" }),
        ". \u0412\u043E\u0439\u0434\u0438\u0442\u0435 \u043F\u0440\u0438\u0432\u044B\u0447\u043D\u044B\u043C \u0441\u043F\u043E\u0441\u043E\u0431\u043E\u043C, \u0432\u0441\u0435 \u043E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u044F \u0438 \u0441\u0434\u0435\u043B\u043A\u0438 \u043D\u0430 \u043C\u0435\u0441\u0442\u0435."
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "pa-account", style: { margin: "0 0 4px" }, children: [
      /* @__PURE__ */ jsx("div", { className: "av", children: /* @__PURE__ */ jsx("img", { src: "img/av/w4.jpg", alt: "" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "nm", children: "\u0415\u043A\u0430\u0442\u0435\u0440\u0438\u043D\u0430 \u041B." }),
        /* @__PURE__ */ jsx("div", { className: "ph", children: "\u042F\u043D\u0434\u0435\u043A\u0441 ID \xB7 \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0439 \u0432\u0445\u043E\u0434 2 \u0434\u043D\u044F \u043D\u0430\u0437\u0430\u0434" })
      ] })
    ] })
  ] });
}
function WelcomeBody() {
  return /* @__PURE__ */ jsxs("div", { className: "pa-welcome", children: [
    /* @__PURE__ */ jsx("div", { className: "burst", children: ic(A.heart, "pd-i28") }),
    /* @__PURE__ */ jsx("h2", { children: "\u0421 \u0432\u043E\u0437\u0432\u0440\u0430\u0449\u0435\u043D\u0438\u0435\u043C, \u041A\u0430\u0442\u044F!" }),
    /* @__PURE__ */ jsx("p", { children: "\u0413\u043E\u0442\u043E\u0432\u043E. \u0421\u0432\u0435\u0436\u0438\u0435 \u0431\u0443\u043A\u0435\u0442\u044B \u041C\u043E\u0441\u043A\u0432\u044B \u0443\u0436\u0435 \u0436\u0434\u0443\u0442. \u0418\u043B\u0438 \u043F\u043E\u0434\u0430\u0440\u0438\u0442\u0435 \u0432\u0442\u043E\u0440\u0443\u044E \u0436\u0438\u0437\u043D\u044C \u0441\u0432\u043E\u0435\u043C\u0443." }),
    /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 300, marginTop: 6 }, children: [
      /* @__PURE__ */ jsx(PdBtn, { variant: "primary", block: true, lg: true, icon: Ic.search, children: "\u0421\u043C\u043E\u0442\u0440\u0435\u0442\u044C \u0431\u0443\u043A\u0435\u0442\u044B" }),
      /* @__PURE__ */ jsx(PdBtn, { variant: "secondary", block: true, lg: true, icon: Ic.plus, children: "\u041F\u0440\u043E\u0434\u0430\u0442\u044C \u0431\u0443\u043A\u0435\u0442" })
    ] })
  ] });
}
function AuthWelcome({ plat = "ios" }) {
  return /* @__PURE__ */ jsx(AuthShell, { plat, back: false, children: /* @__PURE__ */ jsx(WelcomeBody, {}) });
}
function AuthError({ plat = "ios", offline = false }) {
  const foot = /* @__PURE__ */ jsxs("div", { className: "pd-footerbar pa-foot", style: { display: "flex", flexDirection: "column", gap: 9 }, children: [
    /* @__PURE__ */ jsx(PdBtn, { variant: "primary", block: true, lg: true, icon: I.refresh, children: "\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u044C \u0432\u0445\u043E\u0434" }),
    /* @__PURE__ */ jsx(PdBtn, { variant: "ghost", block: true, children: "\u0412\u043E\u0439\u0442\u0438 \u0434\u0440\u0443\u0433\u0438\u043C \u0441\u043F\u043E\u0441\u043E\u0431\u043E\u043C" })
  ] });
  return /* @__PURE__ */ jsx(AuthShell, { plat, foot, children: /* @__PURE__ */ jsxs("div", { className: "pd-empty", style: { height: "auto", paddingTop: 60 }, children: [
    /* @__PURE__ */ jsx("div", { className: "glyph", style: { color: offline ? "var(--pd-muted)" : "var(--pd-danger)" }, children: ic(offline ? A.wifi : I.alert, "pd-i28") }),
    /* @__PURE__ */ jsx("h3", { children: offline ? "\u041D\u0435\u0442 \u0441\u043E\u0435\u0434\u0438\u043D\u0435\u043D\u0438\u044F" : "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0432\u043E\u0439\u0442\u0438" }),
    /* @__PURE__ */ jsx("p", { children: offline ? "\u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u0438\u043D\u0442\u0435\u0440\u043D\u0435\u0442. \u041A\u0430\u043A \u0442\u043E\u043B\u044C\u043A\u043E \u0441\u0432\u044F\u0437\u044C \u0432\u0435\u0440\u043D\u0451\u0442\u0441\u044F, \u043C\u044B \u043F\u0440\u043E\u0434\u043E\u043B\u0436\u0438\u043C \u0432\u0445\u043E\u0434. \u0414\u0435\u043D\u044C\u0433\u0438 \u0438 \u0430\u043A\u043A\u0430\u0443\u043D\u0442 \u0432 \u0431\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u043E\u0441\u0442\u0438." : "\u0421\u0435\u0440\u0432\u0438\u0441 \u0432\u0445\u043E\u0434\u0430 \u043D\u0435 \u043E\u0442\u0432\u0435\u0442\u0438\u043B. \u042D\u0442\u043E \u0431\u044B\u0432\u0430\u0435\u0442 \u0440\u0435\u0434\u043A\u043E, \u043F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0441\u043D\u043E\u0432\u0430 \u0438\u043B\u0438 \u0432\u043E\u0439\u0434\u0438\u0442\u0435 \u0438\u043D\u0430\u0447\u0435." })
  ] }) });
}
function AuthBlocked({ plat = "ios" }) {
  const foot = /* @__PURE__ */ jsxs("div", { className: "pd-footerbar pa-foot", style: { display: "flex", flexDirection: "column", gap: 9 }, children: [
    /* @__PURE__ */ jsx(PdBtn, { variant: "primary", block: true, lg: true, icon: I.flag, children: "\u041E\u0431\u0436\u0430\u043B\u043E\u0432\u0430\u0442\u044C" }),
    /* @__PURE__ */ jsx(PdBtn, { variant: "ghost", block: true, children: "\u0412\u044B\u0439\u0442\u0438" })
  ] });
  return /* @__PURE__ */ jsxs(AuthShell, { plat, back: false, foot, children: [
    /* @__PURE__ */ jsxs("div", { className: "pd-empty pa-blocked", style: { height: "auto", paddingTop: 56 }, children: [
      /* @__PURE__ */ jsx("div", { className: "glyph", children: ic(I.lock, "pd-i28") }),
      /* @__PURE__ */ jsx("h3", { children: "\u0414\u043E\u0441\u0442\u0443\u043F \u043E\u0433\u0440\u0430\u043D\u0438\u0447\u0435\u043D" }),
      /* @__PURE__ */ jsx("p", { children: "\u0410\u043A\u043A\u0430\u0443\u043D\u0442 \u0432\u0440\u0435\u043C\u0435\u043D\u043D\u043E \u0437\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D \u043F\u043E\u0441\u043B\u0435 \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0438 \u0431\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u043E\u0441\u0442\u0438. \u0410\u043A\u0442\u0438\u0432\u043D\u044B\u0435 \u0441\u0434\u0435\u043B\u043A\u0438 \u0438 \u0434\u0435\u043D\u044C\u0433\u0438 \u0437\u0430\u0449\u0438\u0449\u0435\u043D\u044B. \u0415\u0441\u043B\u0438 \u044D\u0442\u043E \u043E\u0448\u0438\u0431\u043A\u0430, \u043E\u0442\u043F\u0440\u0430\u0432\u044C\u0442\u0435 \u043E\u0431\u0440\u0430\u0449\u0435\u043D\u0438\u0435, \u0438 \u043C\u044B \u0440\u0430\u0437\u0431\u0435\u0440\u0451\u043C\u0441\u044F \u0432 \u0442\u0435\u0447\u0435\u043D\u0438\u0435 24 \u0447\u0430\u0441\u043E\u0432." })
    ] }),
    /* @__PURE__ */ jsx("div", { style: { padding: "0 6px" }, children: /* @__PURE__ */ jsx(PdNotice, { kind: "info", children: "\u041F\u0440\u0438\u0447\u0438\u043D\u0443 \u0441\u043E\u043E\u0431\u0449\u0438\u043C \u0432 \u043E\u0442\u0432\u0435\u0442\u0435 \u043D\u0430 \u043E\u0431\u0440\u0430\u0449\u0435\u043D\u0438\u0435. \u0412 \u0446\u0435\u043B\u044F\u0445 \u0431\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u043E\u0441\u0442\u0438 \u043D\u0435 \u0440\u0430\u0441\u043A\u0440\u044B\u0432\u0430\u0435\u043C \u0434\u0435\u0442\u0430\u043B\u0438 \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0438 \u0437\u0434\u0435\u0441\u044C." }) })
  ] });
}
function DeskShell({ children, popup }) {
  return /* @__PURE__ */ jsxs("div", { className: "pd-root pad pa pa--desktop", "data-pd-theme": "a", children: [
    /* @__PURE__ */ jsxs("aside", { className: "pad-aside", children: [
      /* @__PURE__ */ jsx("img", { className: "pad-photo", src: "img/1561181286-d3fee7d55364.jpg", alt: "" }),
      /* @__PURE__ */ jsx("div", { className: "pad-brand", children: "\u041F\u0435\u0440\u0435\u0434\u0430\u0440\u0438\u043C" }),
      /* @__PURE__ */ jsx("div", { className: "pad-hl", children: "\u0421\u0432\u0435\u0436\u0438\u0435 \u0431\u0443\u043A\u0435\u0442\u044B \u0441\u043E \u0441\u043A\u0438\u0434\u043A\u043E\u0439 \u0438 \u0432\u0442\u043E\u0440\u0430\u044F \u0436\u0438\u0437\u043D\u044C \u043F\u043E\u0434\u0430\u0440\u0435\u043D\u043D\u044B\u043C \u0446\u0432\u0435\u0442\u0430\u043C." }),
      /* @__PURE__ */ jsx("p", { className: "pad-hlsub", children: "\u0422\u044B\u0441\u044F\u0447\u0438 \u0431\u0443\u043A\u0435\u0442\u043E\u0432 \u0432 \u0432\u0430\u0448\u0435\u043C \u0433\u043E\u0440\u043E\u0434\u0435. \u0414\u0435\u043D\u044C\u0433\u0438 \u0432 \u0437\u0430\u0449\u0438\u0449\u0451\u043D\u043D\u043E\u0439 \u0441\u0434\u0435\u043B\u043A\u0435, \u043E\u0442\u0437\u044B\u0432\u044B \u0432\u0437\u0430\u0438\u043C\u043D\u044B\u0435." }),
      /* @__PURE__ */ jsxs("div", { className: "pad-points", children: [
        /* @__PURE__ */ jsxs("div", { className: "pad-pt", children: [
          /* @__PURE__ */ jsx("span", { className: "ic", children: ic(A.spark, "pd-i16") }),
          "\u041F\u0443\u0431\u043B\u0438\u043A\u0430\u0446\u0438\u044F \u0431\u0443\u043A\u0435\u0442\u0430 \u0437\u0430 2 \u043C\u0438\u043D\u0443\u0442\u044B"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pad-pt", children: [
          /* @__PURE__ */ jsx("span", { className: "ic", children: ic(I.shield, "pd-i16") }),
          "\u0414\u0435\u043D\u044C\u0433\u0438 \u0432 \u044D\u0441\u043A\u0440\u043E\u0443 \u0434\u043E \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u044F"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pad-pt", children: [
          /* @__PURE__ */ jsx("span", { className: "ic", children: ic(A.star, "pd-i16") }),
          "\u0420\u0435\u0439\u0442\u0438\u043D\u0433\u0438 \u0438 \u0440\u0435\u0430\u043B\u044C\u043D\u044B\u0435 \u043E\u0442\u0437\u044B\u0432\u044B"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "pad-main", children: [
      /* @__PURE__ */ jsxs("div", { className: "pad-topnav", children: [
        "\u0423\u0436\u0435 \u0441 \u043D\u0430\u043C\u0438? ",
        /* @__PURE__ */ jsx("button", { children: "\u0412\u043E\u0439\u0442\u0438" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "pad-card", children }),
      popup
    ] })
  ] });
}
function AuthDesktopChooser() {
  return /* @__PURE__ */ jsxs(DeskShell, { children: [
    /* @__PURE__ */ jsxs("div", { className: "pa-hero", style: { paddingTop: 0 }, children: [
      /* @__PURE__ */ jsx("h1", { className: "pa-h2", style: { fontSize: 26 }, children: "\u0412\u0445\u043E\u0434 \u0438\u043B\u0438 \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F" }),
      /* @__PURE__ */ jsx("p", { className: "pa-tag", children: "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0443\u0434\u043E\u0431\u043D\u044B\u0439 \u0441\u043F\u043E\u0441\u043E\u0431, \u0437\u0430 \u043F\u0430\u0440\u0443 \u0441\u0435\u043A\u0443\u043D\u0434." })
    ] }),
    /* @__PURE__ */ jsx(OauthList, { plat: "desktop" }),
    /* @__PURE__ */ jsx("div", { className: "pa-or", children: "\u0438\u043B\u0438" }),
    /* @__PURE__ */ jsx("div", { className: "pa-oauth", children: /* @__PURE__ */ jsx(OAuthBtn, { k: "phone" }) }),
    /* @__PURE__ */ jsx(Consent, {})
  ] });
}
function AuthDesktopOAuth() {
  const popup = /* @__PURE__ */ jsx("div", { className: "pad-popup", children: /* @__PURE__ */ jsxs("div", { className: "pad-popwin", children: [
    /* @__PURE__ */ jsxs("div", { className: "pad-popbar", children: [
      /* @__PURE__ */ jsx("span", { className: "dot" }),
      /* @__PURE__ */ jsx("span", { className: "dot" }),
      /* @__PURE__ */ jsx("span", { className: "dot" }),
      /* @__PURE__ */ jsxs("span", { style: { marginLeft: 8 }, children: [
        ic(I.lock, "pd-i12"),
        " oauth.yandex.ru"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { style: { padding: 22 }, children: /* @__PURE__ */ jsx(ConsentBody, { k: "ya" }) })
  ] }) });
  return /* @__PURE__ */ jsxs(DeskShell, { popup, children: [
    /* @__PURE__ */ jsxs("div", { className: "pa-hero", style: { paddingTop: 0 }, children: [
      /* @__PURE__ */ jsx("h1", { className: "pa-h2", style: { fontSize: 26 }, children: "\u0412\u0445\u043E\u0434 \u0438\u043B\u0438 \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F" }),
      /* @__PURE__ */ jsx("p", { className: "pa-tag", children: "\u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u0435 \u0432\u0445\u043E\u0434 \u0432 \u043E\u0442\u043A\u0440\u044B\u0432\u0448\u0435\u043C\u0441\u044F \u043E\u043A\u043D\u0435." })
    ] }),
    /* @__PURE__ */ jsx(OauthList, { plat: "desktop" })
  ] });
}
function AuthDesktopPhone({ state = "rest" }) {
  return /* @__PURE__ */ jsxs(DeskShell, { children: [
    /* @__PURE__ */ jsx("div", { style: { marginBottom: 16, marginTop: 8 }, children: /* @__PURE__ */ jsx(PhoneBody, { state }) }),
    /* @__PURE__ */ jsx(PdBtn, { variant: "primary", block: true, lg: true, children: "\u041F\u043E\u043B\u0443\u0447\u0438\u0442\u044C \u043A\u043E\u0434" }),
    /* @__PURE__ */ jsx("button", { className: "pd-link", style: { display: "block", margin: "14px auto 0" }, children: "\u2190 \u0414\u0440\u0443\u0433\u0438\u0435 \u0441\u043F\u043E\u0441\u043E\u0431\u044B \u0432\u0445\u043E\u0434\u0430" })
  ] });
}
function AuthDesktopOtp({ state = "typing" }) {
  return /* @__PURE__ */ jsxs(DeskShell, { children: [
    /* @__PURE__ */ jsx("div", { style: { marginBottom: 20 }, children: /* @__PURE__ */ jsx(OtpBody, { state }) }),
    state !== "locked" && /* @__PURE__ */ jsx(PdBtn, { variant: "primary", block: true, lg: true, loading: state === "verifying", disabled: state === "verifying", children: state === "verifying" ? "\u0412\u0445\u043E\u0434\u0438\u043C\u2026" : "\u0412\u043E\u0439\u0442\u0438" }),
    state === "locked" && /* @__PURE__ */ jsx(PdBtn, { variant: "secondary", block: true, lg: true, disabled: true, children: "\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u044C \u0447\u0435\u0440\u0435\u0437 58:00" })
  ] });
}
function AuthDesktopRegister({ state = "rest" }) {
  return /* @__PURE__ */ jsxs(DeskShell, { children: [
    /* @__PURE__ */ jsx("div", { style: { marginBottom: 18 }, children: /* @__PURE__ */ jsx(RegisterBody, { state }) }),
    /* @__PURE__ */ jsx(PdBtn, { variant: "primary", block: true, lg: true, loading: state === "submitting", disabled: state === "submitting", children: state === "submitting" ? "\u0421\u043E\u0445\u0440\u0430\u043D\u044F\u0435\u043C\u2026" : "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u0438 \u043F\u0440\u043E\u0434\u043E\u043B\u0436\u0438\u0442\u044C" })
  ] });
}
function AuthDesktopWelcome() {
  return /* @__PURE__ */ jsx(DeskShell, { children: /* @__PURE__ */ jsx(WelcomeBody, {}) });
}

export { AuthBlocked, AuthChooser, AuthDesktopChooser, AuthDesktopOAuth, AuthDesktopOtp, AuthDesktopPhone, AuthDesktopRegister, AuthDesktopWelcome, AuthError, AuthLink, AuthOAuthSheet, AuthOtp, AuthPhone, AuthRegister, AuthWelcome, OAuthBtn, OauthList };
