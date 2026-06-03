# ADR-0004: One web codebase (Next.js) + Capacitor wrapper for iOS/Android
Date: 2026-06-03
Status: **Accepted** (gate resolved — see Context)

## Context
**Requirement (outcome):** mobile web, Android, iOS identical, from one codebase, with no separate per-platform development.
**Gate resolved:** the UI is authored in Claude Design, whose *verified* output is **web (HTML/React/CSS/JS) + portable design tokens** — it can preview, screenshot, and pixel-verify web, but **cannot build or verify a React Native / NativeWind package** (RN would be unverified hand-off code, "design-in-code, not a tested package"). Therefore a universal-RN canon cannot be a *verified single source of truth*; going native would split the design system into "designed in the tool (web, verified)" vs "re-implemented in RN by engineers (unverified, drifts)" — i.e. maintaining the UI separately from the design tool, which the requirement forbids.

## Decision
Keep the **runtime web on every platform** so that what Claude Design verifies is exactly what ships:
- **One web app: Next.js (App Router) + React + Tailwind consuming `@rebloom/canon`** (the verified web design system vendored from Claude Design, same pipeline as vitrina's `@samosite/canon`) + the exported **design tokens** (`tailwind.config`, CSS vars).
- Served as **mobile web + desktop web**, and wrapped **as-is via Capacitor** into signed **iOS/Android** apps that render the same web build.
- Device features (camera — core sell action, geolocation — pickup, push — deal status, share) via **Capacitor plugins** from the same UI (configured once, not per-platform UI).
- Visual verification: Playwright **pixel-diff against canon baselines** (≤ 2%) — and because all platforms render the same web build, parity is **identical by construction** on web == mobile web == in-app webview.

## Alternatives considered
- **Expo + RN + RN Web + NativeWind (universal native)** — rejected **now**: Claude Design can't produce a *verified* universal RN canon (gate). Would require engineers to build+maintain a separate RN component library from tokens (double-authoring, native render unverified by the design tool, drift) — conflicts with "no separate per-platform development." Revisit only if you accept that engineering ownership of a native canon.
- **Fully native (Swift/Kotlin)** — rejected: two codebases; violates the requirement.
- **Flutter / KMP** — rejected: not React; doesn't consume the Claude Design (React/web) pipeline.

## Consequences
Positive: Claude Design's verified web output IS the runtime everywhere → guaranteed-identical, pixel-verified UI on web/iOS/Android from one codebase; reuses the vitrina canon pipeline you already run; OTA-trivial (web). Tokens are also exported, keeping a future native path open.
Negative / accepted: WebView UX is slightly less "native-feeling" than RN/native (accepted cost of a single verified source). **Apple Guideline 4.2** review nuance for web-wrappers → mitigated by real device features (camera/geo/push, all intrinsic) + physical-goods payments via ЮKassa (no IAP); residual review risk accepted, handled at submission, not by writing native UI.

## Verification
- One web bundle builds both apps; CI produces signed iOS + Android from that bundle (Capacitor).
- **No platform-specific UI exists** — `mobile/` is Capacitor config + plugin wiring only; grep finds no Swift/Kotlin/RN screens.
- `npm run test:visual` (≤ 2%) covers web == mobile-web == in-app webview (same DOM).
- Camera/geo/push reachable via Capacitor plugins from the shared UI.
