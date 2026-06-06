# @rebloom/canon — v0.8.1

Versioned UI canon for **Передарим** (code-name `rebloom`): the client app + operator admin.
Authored in Claude Design, consumed by Claude Code in `web/`. This package is the **single source of truth** for the product UI — what's drawn and reviewed here is what `web/` (and the Capacitor iOS/Android wrappers) render. Manual JSX re-implementation in `web/` is forbidden (`CANON_PACKAGE_TZ.md §1`, §10).

> **Code-name vs brand:** the package is named `rebloom` (code-name) on purpose — the brand is «Передарим». Don't "fix" it.

> **0.8.1 — full package (0.8.0 was docs-only).** Folds the entire auth-polish set into `src/` + prebuilt `dist/canon.css`, ships `dist/img/oauth/tid.svg` + `dist/img/hero-lacybird.png`, closes the 0.7.0 `PdMobileMenu` route-prop debt, and bakes in the `.cjs` build fix. **Start with `CHANGELOG.md` §0.8.1**, then the two deep-dives:
> - **`OTP_KEYBOARD_AUTOFILL.md`** — OTP “keyboard up + SMS AutoFill” logic; prototype mock vs. real `web/` (`autocomplete="one-time-code"`, iOS QuickType, Android WebOTP). The keyboard is always the **stock OS** one.
> - **`VISUAL_TEXT_CHANGES_0.8.0.md`** — exhaustive screen-by-screen list of every visual & text change (incl. the login background photo and the no-trailing-period rule).
>
> After vendoring, delete the temporary `web/` overrides (globals.css 0.8.0 block, `next.config.mjs` photo rewrite, SEO-burger hide) — this package makes them unnecessary.

---

## What's in this export

```
canon-0.1.0-pkg/
  package.json            # name @rebloom/canon · exports map · peers · sideEffects
  tsup.config.ts          # build → dist/ (one bundle per entry point)
  tsconfig.json
  src/                    # SINGLE SOURCE — React components (edited ONLY by Claude Design)
    index.jsx             # root barrel
    entries/              # entry-point barrels (buttons, cards, forms, feed, deal, auth, settings, screens, admin, tokens, motion)
    primitives/kit.jsx    # PdBtn, PdField, PdInput, PdOtp, PdSeg, PdSizeSel, PdChip, PdStepper, PdBubble, PdStars, PdNotice, PdEmpty, PdSkelCard, PdGallery, PdScreen, PdToast, PdI (icons)
    feed/                 # PdFeed, PdFeedDesktop, PdCard, PdAvatar, PdFreshness, PdLikeBtn, PdTopBar, PdBottomNav, PdSectionHead, pdMoney, PD_FRESH, PD_LIKED, PD_THEMES
    marketing/landing.jsx # PdLanding, PdLandingNav, PdLandingFooter — public peredarim.ru landing (hero, live catalog teaser, how-it-works, reviews, safe-deal, objections, app, split CTA, footer)
    marketing/seo.jsx     # PdGeoPage, PdSafeDeal, PdBlogIndex, PdBlogArticle, PdSeoMeta, PD_GEO_CITIES, nbsp — SEO pages (geo ×10 cities, safe-deal, blog) + SSR typographer
    catalog/catalog.jsx   # PdCatalog — bouquet catalog: filters (price/fresh/rating/size) + sort + pagination
    auth/                 # OAuth + phone/OTP + знакомство + link + welcome + error/offline/blocked (mobile + desktop)
    settings/             # hub, profile, logins, payments, notifications, privacy, security, self-employed, delete (PdSwitch)
    screens/              # discovery (vitrina/listing/search/profile), sell+moderation, deal+chat+notifications, desktop compositions
    admin/                # core (KPI/moderation/shell), views (users/listings/deals/finance/fraud/reports), mobile admin
    styles/canon.css      # canonical stylesheet (the visual source of truth)
  tokens/
    theme.css             # semantic CSS-vars — the one place to retheme
    tailwind-preset.ts    # Tailwind preset mapping classes → token vars
    motion.ts             # motion tokens, springs, Framer variants, reduced-motion helper (MOTION.md)
  dist/
    canon.css             # PREBUILT stylesheet (ready to ship)
    BUILD.md              # how the JS bundles are produced
  reference/              # the original HTML prototypes (design reference + baseline reproduction)
  baselines/              # device-framed screenshots per screen/state (pixel-diff source)
  SCREEN_INDEX_DELTA.md   # screens added/changed in 0.1.0 + status
  WHAT_CHANGED.md         # 1–5 bullet summary (basis for CHANGELOG)
  CHANGELOG.md
```

### ⚠️ Read this about `dist/` JS
Claude Design ships **`src/` + `tokens/` + prebuilt `dist/canon.css`**. The JavaScript bundles in
`dist/*.js|.mjs|.d.ts` are produced by **`npm run build`** (tsup) as the **first step of vendoring**
(`CANON_PACKAGE_TZ.md §9 step 4`) — run it in `packages/canon/` before installing into `web/`.
The CSS is prebuilt because it has no toolchain dependency; the JS is built in your repo so the
committed `dist/` matches your exact React/TS/tsup versions. Everything needed to build is here.

---

## Entry points & import examples

```tsx
// Whole surface (simplest; pulls canon.css):
import { PdFeed, Listing, DealActive } from '@rebloom/canon';
import '@rebloom/canon/canon.css';

// Scoped entries (smaller bundles — preferred):
import { PdBtn, PdChip } from '@rebloom/canon/buttons';
import { PdCard, PdGallery } from '@rebloom/canon/cards';
import { PdField, PdInput, PdOtp, PdSwitch } from '@rebloom/canon/forms';
import { PdFeed, PdFeedDesktop } from '@rebloom/canon/feed';
import { PdLanding, PdGeoPage, PdSafeDeal, PdBlogIndex, PD_GEO_CITIES } from '@rebloom/canon/marketing';
import { PdCatalog } from '@rebloom/canon/catalog';
import { PdStepper, DealActive, DealDesktop } from '@rebloom/canon/deal';
import { AuthChooser, AuthOtp, AuthDesktopChooser } from '@rebloom/canon/auth';
import { SettingsHub, SettingsDesktop } from '@rebloom/canon/settings';
import { AdminDashboard, AdminFraud, AdminMobileMod } from '@rebloom/canon/admin';

// Motion (ships inside the package — never hand-write animations in web/):
import motion, { variants, pressable, prefersReducedMotion } from '@rebloom/canon/motion';
```

### Tailwind wiring
```js
// web/tailwind.config.js
import canonPreset from '@rebloom/canon/tokens/tailwind-preset';
export default { presets: [canonPreset], content: [/* … */] };
```
```css
/* web/app/globals.css — central theming via CSS vars */
@import '@rebloom/canon/tokens/theme.css';
@import '@rebloom/canon/canon.css';
```

---

## Theming & tokens
Components reference **only** semantic tokens (`--pd-*`) — no raw hex. Retheme by overriding the vars
in `tokens/theme.css` (or scoping a new `[data-pd-theme]` block). The freshness scale
(`--pd-fresh / --pd-aging / --pd-old`) is domain-specific. Direction shipped: **«Воздух» (A)** — light
minimal, Golos Text, terracotta. (`PD_THEMES` carries label metadata for B/C directions.)

## Motion (`MOTION.md`)
Motion is part of the system, not decoration. Budgets: micro 120–200ms, transitions 250–350ms;
GPU-only props; 60fps; `prefers-reduced-motion` honored (built into `canon.css` + `motion.ts`).
The CSS layer already animates hovers/press/skeleton/like-pop/sheets; `motion.ts` exposes the matching
tokens + Framer variants for spring/shared-element/stagger work. `framer-motion` is a package dependency
so motion "доезжает" with the components.

## Platforms (`ADR-0008`)One adaptive web UI. The `plat` prop on auth/settings/feed screens (`ios | android | web | desktop`)
switches platform-native chrome only — the core content/components are identical. Device bezels in
`reference/` are prototype harness, **not** part of the shipped package.

## Vendoring (Claude Code) — see `CANON_PACKAGE_TZ.md §9`
1. Diff this zip's `src/` against the vendored `src/` and cross-check `CHANGELOG.md` (never trust the version label — §7).
2. `cp` changed `src/*` and `tokens/*` into `packages/canon/`.
3. Bump `package.json` version + description; prepend a `CHANGELOG.md` section.
4. `npm run build`; commit `dist/`; grep `dist/` for ASCII component markers (Cyrillic §5).
5. Cache-bust install into `web/` (`--install-links`, see §9 step 5).
6. Re-check consumer adapters if markup/classes/href changed; run `npm run test:visual` (≤ 2% vs new baselines).

## Don'ts (§10)
- Never edit `packages/canon/src/*` by hand — the next export overwrites it.
- Don't fork components or hand-patch animations in `web/`. A change = a new canon version (round-trip).
