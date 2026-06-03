# mobile/ — Capacitor wrapper (config only, NO UI)

Wraps the `web/` build into signed iOS/Android apps. **There is NO UI code here** — the UI is the web build (`@rebloom/canon`). This folder is configuration + plugin wiring.

## Rules
- NEVER add screens/components here. NEVER hand-write Swift/Kotlin UI. If you're writing UI, you're in the wrong folder — it goes in `web/`.
- `capacitor.config.ts` points at the `web/` production build. The generated `ios/` and `android/` projects are build artifacts; don't hand-edit beyond signing/icons/splash/permissions.
- Plugins (camera, geolocation, push, share) are configured once and consumed by the shared web UI via the JS bridge.
- Builds + store submission: `docs/runbooks/store-submission.md`. Physical goods → external ЮKassa, no IAP.
- Apple 4.2 review nuance accepted (ADR-0004): mitigated by real device features + transactional marketplace; do NOT "add native UI" to pass review.
