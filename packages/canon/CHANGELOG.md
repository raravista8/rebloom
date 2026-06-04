# Changelog — @rebloom/canon

All notable changes per export. Newest first. SemVer. (`CANON_PACKAGE_TZ.md §7`)

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
