# web/ — Next.js (App Router) + Tailwind + @rebloom/canon (the one UI)

Area rules for the single web frontend. This web build IS the iOS/Android app (wrapped by Capacitor — see `mobile/`). Root `CLAUDE.md` applies.

> **Read root `CLAUDE.md` §0 (Behavioral principles) FIRST — it governs every task:** think before coding, simplicity first, surgical changes, goal-driven (for UI: `npm run test:visual` ≤ 2%).

## The one-codebase rule (ADR-0004)
- ONE web codebase renders web, mobile web, and (wrapped) iOS/Android. **NEVER write per-platform UI** (no Swift/Kotlin/RN screens). `mobile/` is Capacitor config only.
- UI comes from `@rebloom/canon` (vendored from Claude Design, **web** React + Tailwind) + exported tokens. **NEVER edit `packages/canon/src/*`** — round-trip through Claude Design (OPERATIONS §7).
- Don't hand-transcribe canon JSX into ad-hoc Tailwind; import canon entries directly.
- Mobile-first: design every screen for a phone viewport first; it's the dominant target (apps + mobile web).

## Structure
- `app/` — Next.js App Router routes
  - public/marketing + listing pages → SSR/SSG (crawlable, shareable)
  - `(app)/` — authenticated marketplace UI
- `components/` — app-only composition over canon (hand-rolled only with a justified reason)
- `lib/` — api client (`{ok,data}` envelope) generated/typed from `docs/handoff/API_CONTRACT.md` (→ OpenAPI), session, formatting (MSK in UI)
- `tests/visual/` — Playwright pixel-diff baselines

## SEO / metadata (indexable pages) — learned the hard way (2026-06 audit)
- **Meta description = ONE tight sentence, ≤~160 chars.** No colon/keyword lists, no 2–3-sentence pile-ups: Yandex rejects long/keystuffed descriptions and instead shows a sentence pulled from the page **body** (a sibling project got an off-message body sentence shown this way). Therefore:
- **First-screen body copy must itself be snippet-safe** — the hero H1 + first paragraph must read on-brand and accurate **out of context**, because an engine may use them regardless of the meta.
- **No money/escrow copy anywhere** (ADR-0013 — the platform touches no money): say «оплата при встрече»; NEVER «защита денег / удержание средств / эскроу / комиссия / предоплата». Applies to meta, OG, **and** body.
- **Unique description per page** — don't reuse one across routes. The 10 geo pages use a single `city.loc` template → 10 distinct strings (identical descriptions across pages are a duplicate-content / over-optimization signal).
- **Each indexable page**: self-referential `canonical` + `openGraph` + present in `app/sitemap.ts`. **Private/auth routes** (`/sell /deal /deals /me /settings /admin /notifications /login`) → in `app/robots.ts` disallow AND absent from the sitemap (a new auth route must be added to both).
- Canon-owned body copy (SEO pages imported wholesale: `PdGeoPage`/`PdSafeDeal`/`PdBlog*`) is fixed via Claude Design, not here — `docs/handoff/CLAUDE_DESIGN_PROMPT.md`.

## Device features (via Capacitor, used by the same UI)
Camera (photograph bouquet), geolocation (pickup), push (deal status), share — feature-detect; on plain web degrade gracefully.

## Payments / stores
Physical goods → external ЮKassa, **no Apple IAP**. Store submission per `docs/runbooks/store-submission.md`.

## UI Definition of Done
- Build clean; `npm run test:visual` ≤ 2% for affected screens.
- New screen reachable on web AND inside the wrapped app (same build).
- `docs/handoff/VISUAL_COVERAGE.md` / `SCREEN_INDEX.md` updated.
