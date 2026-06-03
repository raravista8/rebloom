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

## Device features (via Capacitor, used by the same UI)
Camera (photograph bouquet), geolocation (pickup), push (deal status), share — feature-detect; on plain web degrade gracefully.

## Payments / stores
Physical goods → external ЮKassa, **no Apple IAP**. Store submission per `docs/runbooks/store-submission.md`.

## UI Definition of Done
- Build clean; `npm run test:visual` ≤ 2% for affected screens.
- New screen reachable on web AND inside the wrapped app (same build).
- `docs/handoff/VISUAL_COVERAGE.md` / `SCREEN_INDEX.md` updated.
