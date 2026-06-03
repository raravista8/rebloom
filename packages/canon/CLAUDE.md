# packages/canon/ — vendored @rebloom/canon (web UI source of truth) + tokens

`@rebloom/canon` is the design system authored in **Claude Design** and vendored here. It is a **web** package (React + Tailwind), plus exported **design tokens** (`tailwind.config` palette/scale, CSS vars). It is consumed by `web/` and, by extension (Capacitor wrap), by the iOS/Android apps — so the design tool's verified web output is the runtime everywhere.

> **Read root `CLAUDE.md` §0 (Behavioral principles) FIRST — it governs every task:** think before coding, simplicity first, surgical changes, goal-driven.

## Hard rules
- **NEVER edit `src/` by hand** — it round-trips through Claude Design; hand edits are overwritten and break pixel parity.
- Import entries from the package; compose around them in `web/components/`. Don't fork components.
- A component change = a Claude Design change → new vendored version, not a local patch.

## Vendoring procedure (OPERATIONS §7 — frequent task)
1. **Verify the diff is real — don't trust the version label.** Diff zip `src/` vs vendored `src/`; read the zip CHANGELOG and confirm the change landed.
2. Copy changed `src/*`; bump `package.json` version + description; prepend CHANGELOG.
3. Rebuild dist (committed). Verify Cyrillic markers (esbuild escapes to `\uXXXX`).
4. Cache-bust install into `web/` (`--install-links`, `--force`).
5. Reconcile app-side adapters keyed off canon classes/selectors.
6. Bump version strings in `docs/handoff/*` + `web/CLAUDE.md`; run `npm run test:visual`.

## Tokens
Tokens are also exported in a stack-portable form (NativeWind-friendly `tailwind.config` / CSS vars), keeping a future native path open (ADR-0004) without committing to it now.
