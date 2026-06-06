# WHAT CHANGED — canon 0.7.0 (basis for the CHANGELOG section)

**Mobile burger menu (drawer).** Adds the expanded burger state that was missing: until now
`.pdl-nav-burger` was a dead trigger on mobile — visible, but with no panel behind it, so the whole site
nav was unreachable on a phone. New component **`PdMobileMenu`** (export from `./marketing`), reused by the
landing (`PdLanding`) and the SEO pages (`SeoNav`). Full dev logic: **`BURGER_MENU.md`**.

## The component
- **Right-anchored sheet + scrim.** `width:min(88%,360px)`; slides over a dimmed backdrop. Open via burger
  tap; close via ✕ / scrim tap / **Esc**; focus moves to ✕ on open; honors `prefers-reduced-motion`.
- **Containment fix.** `.pdl` now has `position:relative`; the drawer is `position:absolute; inset:0`
  against it, covering exactly the app/viewport frame. (`position:fixed` resolved against the layout
  viewport and escaped framed/scaled contexts.) Mount the sheet as a **sibling of `<header>`**, not inside
  the sticky nav.
- **Mobile-only.** Burger is `display:none` ≥900px (container-query on `.pdl`).

## Two content sets
- **Guest:** inline city picker → site nav (Каталог букетов / Как это работает / Безопасная сделка /
  Приложение) → footer CTA «Опубликовать букет» + «Войти».
- **Authorized:** profile row → city picker → account sections (Каталог букетов · Избранное `12` ·
  Мои букеты · Сделки и чат `2` · Уведомления • · Настройки) → footer CTA + «Выйти». No search field in the
  drawer (it lives in the top bar).

## Two copy/route fixes that rode along
1. **Burger links are route-absolute.** Bare `#how` / `#safety` / `#app` 404'd when the burger was opened
   off the landing. Now: Как это работает → landing `/#how`, Приложение → landing `/#app`,
   **Безопасная сделка → the dedicated `PdSafeDeal` page** (was an in-landing anchor), Каталог букетов →
   `/catalog`. First drawer item is **«Каталог букетов»** in *both* states (site lexicon; an earlier draft
   labeled the authorized one «Лента»).
2. **Reviews — residual escrow phrasing removed.** Тимур + Марина testimonials rewritten to be
   unmistakably **pay-on-meeting / no-prepayment** (no «списалось/висело/выплата на карту»).

## Files
- `src/marketing/landing.jsx` — `PdMobileMenu` + icons, `Nav` wiring (guest/auth), `SeoNav` wiring,
  `GUEST_LINKS`/`AUTH_LINKS`, REVIEWS copy. New export `PdMobileMenu`.
- `src/marketing/seo.jsx` — `SeoNav` opens the shared `PdMobileMenu`.
- `src/styles/canon.css` + `dist/canon.css` — `.pdl{position:relative}` + `.pdl-drawer*` block + reduced-motion guard.
- `reference/prototypes/pd-land.{jsx,css}`, `pd-seo.jsx` — byte-current with design source.
- **No token changes.** Rebuild `dist/*.js` via `npm run build`.
