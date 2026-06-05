# Changelog — @rebloom/canon

All notable changes per export. Newest first. SemVer. (`CANON_PACKAGE_TZ.md §7`)

## 0.2.0 — 2026-06-05 · marketing site + catalog + responsive fix

**Adds the public site** (marketing landing + bouquet catalog) and fixes the responsive system that
made prod render mobile on every resolution. Ships the implementation spec in `CLAUDE_CODE_HANDOFF.md`.

### Added
- **Marketing landing** (`./marketing`) — `PdLanding`, `PdLandingNav`: hero with live-count + price proof, live catalog teaser (working sample filters), how-it-works, advantages, reviews, escrow (dark), objections, app badges, split seller/buyer CTA, footer. Guest + authorized header states in one render.
- **Catalog** (`./catalog`) — `PdCatalog`: sidebar (desktop) / chip-bar + sheet (mobile) filters (price · freshness · seller-rating · size), sort (свежие/дешевле/дороже/рейтинг), «Показать ещё» pagination, empty state.
- **Favicon set** — `dist/favicon/` (terracotta tile + «Соцветие» + amber center): `favicon.svg`, `favicon.ico`, `favicon-16/32`, `apple-touch-icon` (180), `icon-192/512`, `site.webmanifest`.
- **`CLAUDE_CODE_HANDOFF.md`** — exact logic for `web/`: fast catalog (URL state · server-side filter + keyset pagination · RSC/streaming · skeletons · image CDN · prefetch), filter behaviour, and form hover/focus/validation/OTP state machines.

### Changed / Fixed
- **Responsive breakpoints (the prod bug).** Landing + catalog switched layout *only* via a forced `.pdl--desk`/`.pdc--desk` class (set by the prototype `platform` prop). With no width breakpoints, prod fell back to the mobile base at every resolution. Now driven by **container queries** (`@container`, 900px; catalog grid → 4-col at 1180px) so one markup is correct on phone and desktop. The `--desk` class is kept as a static-prototype fallback.
- **Form interaction states** baked into `canon.css`: real `:focus-within` rings on `.pd-input` (danger variant preserved), plus `:hover` on inputs/checkbox/size-select/segmented/switch and `:hover`+`:focus-visible` on OAuth rows. Components now carry focus/hover out of the box — stop forcing `state="focus"` in prod.
- **Brand mark on login** — auth (mobile + desktop) now uses the «Соцветие» mark instead of the gift glyph; desktop aside brand gets the mark + flex alignment.
- **Brand mark color** — header/catalog mark pinned terracotta (`.pdl-brand svg`), wordmark stays dark; footer stays white (inverse lockup). Resolves the black-header vs terracotta-login inconsistency.
- **Heart icon** — replaced the asymmetric like/favourite/welcome heart path with a clean symmetric one across feed, kit, auth, landing.
- **Copy** — landing + catalog microcopy de-em-dashed to match the reviewed copy revision.

### Notes for the consumer
- New entries registered in `package.json` exports and `tsup.config.ts` → `npm run build` emits `dist/marketing.*` and `dist/catalog.*`.
- `dist/canon.css` updated (landing + catalog + responsive + form states); `dist/*.js|.d.ts` still built by your `npm run build` (§9 step 4).
- Container queries need a width-bearing parent for `.pdl`/`.pdc` — see `CLAUDE_CODE_HANDOFF.md §4`.

## 0.1.0 — 2026-06-04 · first canon export

**Initial canon.** Full client + operator-admin UI extracted from the reviewed Claude Design
prototypes into a versioned package with semantic tokens and in-package motion.

### Added
- **Tokens** — `tokens/theme.css` (semantic `--pd-*` CSS vars, direction «Воздух»/A), `tokens/tailwind-preset.ts`, `tokens/motion.ts` (durations/easings/springs + Framer variants + reduced-motion helper, per `MOTION.md`).
- **Primitives** (`./buttons`, `./cards`, `./forms`) — PdBtn, PdChip, PdCard, PdAvatar, PdFreshness, PdLikeBtn, PdGallery, PdField, PdInput, PdOtp, PdSeg, PdSizeSel, PdStars, PdSwitch, PdNotice, PdEmpty, PdSkelCard, PdStepper, PdBubble, PdScreen, PdToast, PdI (icon set).
- **Feed** (`./feed`) — PdFeed (adaptive mobile), PdFeedDesktop, top/bottom nav, section heads, themes metadata.
- **Listing / Search / Profile / Deal** (`./screens`, `./deal`) — vitrina (loading/empty), listing (+sold), search (no-results), profile (+review form), deal (paid_held/disputed/released), payment-failed, notifications (+empty/offline); desktop compositions.
- **Auth** (`./auth`) — OAuth (Яндекс/Sber/VK/T-ID; Apple·iOS) + phone/OTP (typing/verifying/invalid/locked), знакомство, account-link, welcome, error/offline, access-blocked (FLOW-8) — mobile + desktop.
- **Settings** (`./settings`) — hub, profile, logins/привязки, payments, notifications, privacy (152-ФЗ), sessions, self-employment (FLOW-7), delete-account + OTP confirm (FLOW-9).
- **Admin** (`./admin`) — desktop overview/KPI, users (+drill), listings, deals (+cancel/4-eyes), finance/ledger, antifraud (+cluster), reactive moderation (+remove sheet), reports; plus the full mobile admin set.
- **Styles** — `dist/canon.css` prebuilt; hover/press/focus, skeleton-shimmer, like-pop, sheet, reduced-motion all in CSS.
- Build contract: `tsup.config.ts` (one bundle per entry point, ASCII charset for Cyrillic escaping), `tsconfig.json`, full `package.json` exports map.

### Copy
- All interface copy reflects the reviewed copy revision (city normalized to Москва; em-dash clause-connectors removed; reworded buttons «Сохранить и продолжить» / «Повторить вход» / «Повторить оплату» / «Оставить в ленте»; OTP-lock and self-employment microcopy). Source: `copy-redacted.md`.

### Notes for the consumer
- `dist/*.js|.d.ts` are produced by `npm run build` during vendoring (§9 step 4); only `dist/canon.css` is prebuilt in this zip.
- Baselines for pixel-diff are under `baselines/`; screen status in `SCREEN_INDEX_DELTA.md`.
- This is the **first** export → bumps the consumer's tracked canon version `0.0.0 → 0.1.0` (`SCREEN_INDEX.md`, `VISUAL_COVERAGE.md`, `web/CLAUDE.md`).
