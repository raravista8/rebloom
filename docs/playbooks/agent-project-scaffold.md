# PLAYBOOK — Bootstrapping a new project so Claude Code agents are productive & safe from day 1

> **Why this exists.** Claude Code sessions are stateless across runs — a fresh session only knows what's committed. The way you structure the repo on day 1 *is* the agent's onboarding, guardrails, and memory. Get this scaffold right and agents ship correct, surgical, parallelizable work without re-deriving the rules each time.
> **When to read.** Starting a new repo, or retrofitting an existing one to be agent-friendly. Assumes the stack family: **Next.js (App Router) + Tailwind + a design-system package vendored from Claude Design + Playwright visual tests + FastAPI/SQLAlchemy + Postgres + Redis + Docker Compose + Caddy on a single VPS → managed scale-out.** Adapt placeholders: `<project>` / `@scope/canon` / `<domain>` / `<provider>` / `<region>` / `docs/<DOC>.md`.

---

## 0. The five load-bearing artifacts (in priority order)

Everything below is detail. If you only ship five things, ship these:

1. **A nested `CLAUDE.md` hierarchy** — root = the constitution; per-area files add local rules and point back to root.
2. **The 4 behavioral principles** (§2) at the top of root `CLAUDE.md` — the single highest-leverage text in the repo. They suppress the most common AI failure modes.
3. **A protected-paths table + a hard-rules list** (§3, §4) — the "do not break these invariants" contract.
4. **A handoff-doc set + a parallelization map** (§5, §6) — contracts that decouple parallel agents so they don't block or collide.
5. **A durable-knowledge / OPERATIONS file** (§8) — where every hard-won gotcha gets written down, because sessions forget.

---

## 1. The nested `CLAUDE.md` hierarchy

Agents read the **root** `CLAUDE.md` plus the **nearest** area `CLAUDE.md` for the files they're touching. So put global law at the root and local law in each area — never duplicate, always reference upward.

```
CLAUDE.md                      # root: product + principles + stack + protected paths + hard rules + DoD + doc index
backend/CLAUDE.md              # area: layout, domain rules, TDD, commands
web/CLAUDE.md                  # area: the-one-UI rule, SEO, device features, UI DoD
packages/canon/CLAUDE.md       # area: vendored design system, NEVER edit src/, vendoring procedure
mobile/CLAUDE.md               # area: wrapper config only, NO UI
```

**Root `CLAUDE.md` must contain (in roughly this order):**

| Section | Purpose |
|---|---|
| One-paragraph product description | What the thing is, who it's for, the core flow — so an agent has domain context |
| **§0 Behavioral principles** (§2 below) | Overrides task-specific instinct on every task. Put it FIRST. |
| Stack (one line per layer) | Versions + the non-obvious choices |
| Commands (`make` targets) | `install / dev / test / lint / typecheck / security-check / migrate` |
| Project structure | One line per top-level dir + the dependency rule (`core/` never imports `infrastructure/`) |
| Conventions (non-defaults only) | API envelope, money-as-int, ID format, timestamp policy, etc. — don't restate language defaults |
| **Protected paths** table (§3) | High-risk dirs → "read this doc first, tests same commit" |
| **Hard rules** (§4) | NEVER-violate invariants |
| **Definition of Done** (§7) | The checklist a change must pass before it's "done" |
| Reference-doc index (§5) | Each doc + a one-line **TRIGGER** ("read this when you touch X") |

**Each area `CLAUDE.md` must:**
- Open with a one-line "Root `CLAUDE.md` applies; this adds <area> specifics."
- Re-point to **§0 principles FIRST** — agents enter mid-tree and may not have re-read root.
- List the area layout, the area-specific rules, the area's Definition of Done (e.g. web's DoD = `npm run test:visual` ≤ 2%), and the area's verification commands.

> Keep area files SHORT (the real ones are 30–60 lines). They're rule deltas, not tutorials.

---

## 2. The 4 behavioral principles (copy verbatim into root §0)

These four override task-specific instinct. They exist to suppress the most common AI coding failure modes: **silent assumptions, overengineering, scope creep, unverified completion.** This is the most reused text in the whole scaffold — paste it as-is.

> ### 0.1 Think before coding
> Don't assume. Don't hide confusion. Surface tradeoffs. Before implementing:
> - State your assumptions explicitly. If uncertain, ask.
> - If multiple interpretations exist, present them — don't pick silently.
> - If a simpler approach exists, say so. Push back when warranted.
> - If something is unclear, STOP. Name what's confusing. Ask.
>
> ### 0.2 Simplicity first
> Minimum code that solves the problem. Nothing speculative.
> - No features beyond what was asked. No abstractions for single-use code.
> - No "flexibility"/"configurability" that wasn't requested.
> - No error handling for impossible scenarios.
> - If you write 200 lines and it could be 50, rewrite it.
> - Self-check: *"Would a senior engineer say this is overcomplicated?"* If yes, simplify.
>
> ### 0.3 Surgical changes
> Touch only what you must. Clean up only your own mess.
> - Don't "improve" adjacent code, comments, or formatting. Don't refactor what isn't broken.
> - Match existing style, even if you'd do it differently.
> - **Orphan rule:** remove imports/vars/functions YOUR changes made unused; don't delete pre-existing dead code unless asked (mention it instead).
> - Test: every changed line traces directly to the request.
>
> ### 0.4 Goal-driven execution
> Define success criteria, loop until verified. Transform tasks into verifiable goals:
> - "Add validation" → "Write tests for invalid inputs, then make them pass"
> - "Fix the bug" → "Write a test that reproduces it, then make it pass"
> - "Make UI match design" → "`npm run test:visual` passes with diff ≤ 2%"
> - For multi-step tasks, state a brief plan — each `step → verify: [check]`.

**Working if:** fewer unnecessary diffs, fewer rewrites from overcomplication, clarifying questions come BEFORE implementation rather than AFTER mistakes.

---

## 3. The protected-paths convention

Some directories carry outsized risk (money, auth, PII, untrusted input, payment integrity, the vendored design system, CI/deploy). For those, the bar is higher: **read the governing doc first, update tests in the same commit, and run the extra security gate.**

Put a table in root `CLAUDE.md`:

```md
## Protected paths (read the doc first, update tests same commit)
| Path | Why | Read first |
|---|---|---|
| core/<money>/, core/<ledger>/ | money invariants | docs/SECURITY.md + ADR-xxxx |
| core/auth/                     | OTP, sessions, 2FA | docs/SECURITY.md |
| core/<pii>/, core/<consent>/   | PII / privacy law | docs/SECURITY.md |
| core/<upload>/, core/<moderation>/ | untrusted upload / LLM | docs/SECURITY.md |
| api/webhooks/                  | payment/provider integrity | docs/SECURITY.md |
| packages/canon/src/            | vendored design system | docs/OPERATIONS.md (vendoring) |
| infra/, .github/workflows/     | deploy / CI | docs/DEPLOYMENT.md, OPERATIONS |
```

**The protected-path contract (state it explicitly):**
- TDD: write the **invariant test first** for the high-risk core (the money/auth/moderation domains). Coverage targets are higher there (e.g. core ≥85%, money/auth ≥95%).
- A change to a protected path → run the **full** test suite + the **security gate** (`make security-check`: SAST + dependency audit + secret scan) + re-read the governing doc + land the tests **in the same commit**.
- Money/critical-core is a **single careful TDD stream, never split across parallel agents** (see §6).

---

## 4. The hard-rules list (NEVER-violate invariants)

A short, scannable list of absolute prohibitions. These are the lines that, if crossed, cause data loss, security holes, or money bugs. Keep them imperative and specific. Generic template (adapt to your domain):

```md
## Hard rules (NEVER violate)
- NEVER commit secrets / .env / TOTP seeds / signing keys.
- NEVER store or log card/PII data — tokenize at the <provider>; mask PII in logs ([PHONE],[EMAIL],[ADDRESS]).
- NEVER auto-release/auto-settle money on a timeout or an ambiguous provider response — fail-secure: stay held.
- NEVER move money without a state-machine transition + idempotency key + audit log.
- NEVER weaken auth/2FA "temporarily".
- NEVER add a runtime dependency without an ADR.
- NEVER use raw SQL with f-strings — ORM or parameterized text(":param") only.
- NEVER concatenate user input into shell/HTML/LLM prompts — tag untrusted text <user_content>.
- NEVER edit the vendored design-system src/ by hand — round-trip through Claude Design.
- NEVER write per-platform mobile UI (Swift/Kotlin/RN) — one web codebase is the app via wrapper.
- NEVER use money as float — integer minor-units (cents/kopecks).
```

> The point isn't this exact list — it's the *pattern*: a finite set of named invariants an agent can scan in seconds and a reviewer can check against. Domain-specific failure modes (fail-secure money paths, the design-system round-trip, the one-codebase rule) belong here, not buried in prose.

---

## 5. The handoff-doc set (contracts that decouple parallel work)

Parallel agents stay unblocked only while the **contracts between them are stable**. Each doc below is a decoupling seam — freeze it, and the tracks on either side proceed independently against it.

| Doc | Decouples | What it pins |
|---|---|---|
| `docs/<API_CONTRACT>.md` | **front ⇔ back** | every route, request/response shape, enums, error codes, the response envelope. Must match the generated OpenAPI. Back implements it; front mocks it. |
| `docs/<DESIGN_BRIEF>.md` + design-system package | **design ⇔ code** | component inventory, design tokens, screen list. Design authors in Claude Design → exports a versioned npm package → code vendors it (never hand-transcribes). |
| `docs/<INTERACTION_STATES>.md` | **design ⇔ everything** | the exhaustive state matrix every screen/component must cover (rest/hover/focus/pressed/loading/disabled/error + collection idle/loading/empty/**no-results**/loading-more/end-of-list/error/offline), each bound to an API condition. |
| `docs/<FLOWS>.md` | **design ⇔ back** | step-by-step branching flows (disputes/refunds/cancel/retry/appeal/delivery/DSR/report) with states, API calls, edge cases. |
| `docs/<ARCHITECTURE>.md` (ER model) | **back ⇔ analytics** | the shared data model both sides build on. |

**Two cross-cutting rules these encode (worth stealing regardless of domain):**
- **Buttons are enabled by default.** `disabled` only while in-flight (anti-double-submit) or for a hard precondition — never "grey until the form is valid". Validate inline on press. (Lives in INTERACTION_STATES; saves endless re-litigation.)
- **`empty` ≠ `no-results`.** No data at all (no query) gets a different state/copy than "your query returned 0". The backend distinguishes them by echoing the `applied` query/filters; end-of-list is signalled by `next_cursor: null`. Design must not invent statuses — only consume contract enums.

> **Contract discipline:** changing a contract = bump its CHANGELOG + notify both tracks. A frozen contract is the thing that lets a backend agent finish a feature with zero UI in existence, measured purely by tests.

---

## 6. The parallelization map

Write a `docs/<PARALLELIZATION>.md` that says **what runs from day 1, what waits, and where the sync points are.** The decoupling contracts (§5) are what make the parallelism legal.

**Tracks that run in parallel from day 1:**

| Track | What | Can start | Blocked by |
|---|---|---|---|
| **Infra/DevOps** | repo skeleton + CI, Compose (PG/Redis), object storage, Caddy, observability | immediately | — |
| **Design** | tokens, screens, states, flows, motion → the design-system package | immediately | the handoff briefs |
| **Backend** | auth → domain modules → money core → reviews → moderation → notifications | right after the skeleton (no UI needed) | API contract + ER + skeleton |
| **Frontend** | web app on the design package + API | after first design-system export; **mock the API meanwhile** | design package + API contract |
| **Mobile** | wrapper + plugins + store release | skeleton early, finalize after web is stable | stable web build |
| **Admin/Analytics/Fraud** | admin API + UI | after the events/money core exists | core modules + admin briefs |

**Sync points** (where independent tracks must converge):
1. **Freeze the API contract** before front+back go heads-down (minimizes rework).
2. **First design-system export** — frontend swaps stubs for real components.
3. **Front↔back integration on staging** — real client vs real server (contract/e2e tests).
4. **Wrapper build** — after the web build is stable.
5. **Store release** — after wrapper + privacy/legal docs + review notes.

**The one thing you do NOT parallelize:** the **money / critical core** (deals + payments + ledger, or whatever your high-stakes invariant cluster is). One careful TDD stream — invariant test first — not split across agents. Distributed edits to a money state machine are how double-spend/lost-state bugs are born.

**How a track stays unblocked:**
- **Frontend without backend:** mock the API from the contract (forms/enums/errors), build every screen + state on mocks, switch to the real endpoint as each lands. Where the design-system component doesn't exist yet, stub with its known prop API and swap on vendoring.
- **Backend without UI:** the whole domain is covered by unit/integration/contract tests; readiness is measured by tests, not screens.

---

## 7. The autonomous build/PR workflow cadence

How an agent ships work safely and visibly:

- **One task = one branch = one PR**, kept small (target **< ~500 LOC**, roughly < 2h of agent work). Stable task IDs in a backlog (`T<epic>.<seq>` — never renumber).
- **Conventional Commits**, each referencing its task ID. Phase-0 repo init may go straight to the default branch; everything after is branch → PR → merge.
- **Verify locally before pushing:** `make lint typecheck test`; add `make security-check` for protected paths.
- **Confirm CI is green before merging.** If the default branch has no required-status-check protection, a red check can still be merged — so *always* check `gh pr checks <N>` is all-pass first, then `gh pr merge <N> --squash --delete-branch`.
- **Watch CI on EVERY merge** (`gh run watch` / `gh pr checks` on the default branch after merging). Skipping it lets the trunk stay red unnoticed across several PRs. `gh run watch` can EOF mid-poll — re-check with `gh pr checks` before relying on it.
- **Deploy + verify:** after merge, deploy the changed service and confirm it live (a `/version` build stamp + a `/readyz` check). Don't assume; verify the SHA you merged is the SHA running.
- **Co-author trailer** on commits/PRs per the harness convention (a `Co-Authored-By:` line on commits; the generated-with note on PR bodies).

**Lint/format footguns that bite this cadence (stack-family-specific, all learned the hard way):**
- Run the **formatter**, not just the linter, on every touched file — `ruff format --check` is a *separate* CI gate from `ruff check`. Wire `format --check` into your local `make lint` so local == CI.
- **Lint caches can mask failures.** `ruff`'s `.ruff_cache` hides errors a cold CI run catches → use `ruff check --no-cache` as the pre-commit truth. ESLint caches per-file → after adding a route, a route-graph rule (e.g. `no-html-link-for-pages`) won't re-fire locally but CI (cache-cold) flags it → `rm -rf .next/cache/eslint && npm run lint` before pushing.
- **SAST version drift:** local SAST (bandit) can differ from CI's pinned newer version — CI flags things local misses. Suppress real false-positives with the tool's own directive (`# nosec <CODE>`), not the linter's (`# noqa` does nothing for bandit).
- A new top-level runtime `import` must be a **main** dependency, not a dev-group one — the prod image installs main deps only, so a dev-only import (e.g. an HTTP client used by the test client) crash-loops the service with `ModuleNotFoundError`. Use stdlib for runtime, or promote the lib via ADR.

---

## 8. The durable-knowledge habit (an OPERATIONS-style file)

Sessions are stateless across runs. The cure is a single living `docs/<OPERATIONS>.md` where **every hard-won infra/ops/deploy/money-flow gotcha gets written down the moment you learn it.** Lead it with: *"Keep this current — when you learn an infra fact, a deploy gotcha, or a money quirk the hard way, write it here. Read before any deploy / CI / design-vendoring / infra / money-ops work."*

What belongs in it (these are the categories that recur in this stack family):
- **Prod coordinates** — domain, SSH alias, repo path on the box, the compose invocation, the services, where backups go, the build-stamp endpoint.
- **Deploy runbook + gotchas** — build only the changed service (never `--pull` the whole stack); `--no-deps` so recreating one service doesn't bounce others; run migrations as a **one-shot, never on boot, expand/contract only**.
- **Long builds vs SSH timeout** — a web/Next.js build can exceed the SSH command timeout; a `build && up` one-liner loses the `up` when the session buffers/drops. Background the build, poll a log for a completion marker, then run `up` as a **separate** command.
- **Bind-mount inode trap** — a single-file bind mount (e.g. `./Caddyfile`) goes stale on `git pull` (rename → new inode; the container keeps the old one), so a `reload` re-reads the stale file. After editing it you must `up -d --force-recreate <svc>`, not reload.
- **Which `/version` you're reading** — a web-only deploy leaves the api-served `/version` on the api SHA. Verify the web deploy by the image-created time + grepping the served bundle, not `/version`.
- **Design-system (canon) vendoring** — the most frequent protected-path task; see §9.
- **Visual-test baselines** — generate them on the **CI/Linux** runner, never commit from macOS (font rendering differs → false diffs). The visual baseline viewport is the mobile reference width; desktop-only changes gated behind a `useIsDesktop`/container-query path won't move it.
- **Provider/egress facts** — anything blocked from your `<region>` host (e.g. an external API your VPS can't reach → route via proxy), webhook verification discipline (verify signature **and** re-fetch status before any state change; process idempotently by provider id; reject + alert on signature failure).
- **Money-ops** — daily ledger reconciliation, the fail-secure rule, refund/force-release approval thresholds (4-eyes above a limit), every action audit-logged.

> The test: if a future session would re-learn it the hard way, it goes in this file.

---

## 9. Vendoring the design-system package (the recurring protected-path task)

The UI is authored in Claude Design and arrives **only** as a versioned npm package — never hand-edited in `src/`. Document this procedure once; it runs on every refresh. Full procedure: see `playbooks/design-system-handoff.md` (canonical).

1. **Verify the diff is real — DON'T trust the version label.** Diff the export's `src/` against the vendored `src/`; read the export CHANGELOG and confirm the change actually landed (exports have shipped old code under a new number).
2. Copy changed `src/*` (and `tokens/*`); bump `package.json` version + description; prepend a CHANGELOG section.
3. Rebuild `dist/` (committed). If the bundler escapes non-ASCII to `\uXXXX`, grep for known ASCII component markers to confirm the new build is what installed (not the version label).
4. **Cache-bust the install** into the consumer: `rm -rf node_modules/@scope/canon && npm cache clean --force && npm install --install-links file:../packages/canon --force` (`--install-links` is mandatory — bundlers don't follow `file:` symlinks; set `install-links=true` in `.npmrc` so `npm ci` materializes it too).
5. Reconcile any consumer code keyed off the design system's classes/selectors/hrefs.
6. Bump version strings in the coverage/screen-index trackers + `web/CLAUDE.md`; run `npm run test:visual` (diff ≤ 2%).

**Build-config gotchas that recur every export (the design tool resets them):**
- The bundler's `clean: true` wipes the **concatenated** `dist/canon.css` and the favicon set on every build — the per-entry build emits per-entry css, not the combined file the consumer imports. **Re-copy `dist/canon.css` + favicon AFTER every build.**
- The export periodically reships a broken `outExtension` (emits `.js` under `"type":"module"`, breaking the `.mjs` exports map) and a `package.json` `exports.require` pointing at `.js` instead of `.cjs`. **Re-apply** the fixes each time; verify with a `require()` smoke test + a consumer build.
- Unzip aborts on non-ASCII prototype filenames in the export (`unzip` bails before `src/` extracts). Exclude them: `unzip -o -x "*/reference/prototypes/*" <zip> -d <dir>`.
- **Hand-rolled consumer screens don't auto-update from a re-vendor.** If a screen (e.g. the landing) is hand-composed in the consumer using the design system's CSS classes (because the component bakes sample data with no props to inject live data), the **CSS half propagates** on re-vendor but **JSX changes do NOT** — you must hand-port them. The long-term fix is asking Claude Design to give the component a data/slot prop so the consumer imports it directly. Track which screens are imported-wholesale vs hand-ported.

---

## 10. Copy-pasteable skeleton tree

```
<project>/
├── CLAUDE.md                          # root constitution (§1 template below)
├── Makefile                           # install/dev/test/lint/typecheck/security-check/migrate
├── .python-version  .nvmrc
├── .pre-commit-config.yaml  .secrets.baseline  .gitleaks.toml
├── .github/workflows/ci.yml           # lint+format, typecheck, tests, SAST, dep-audit, secret-scan, visual-regression, compose-config
├── .env.example                       # committed; real .env gitignored
├── backend/
│   ├── CLAUDE.md
│   ├── pyproject.toml  poetry.lock
│   ├── .importlinter                  # enforce core ⇏ infrastructure
│   ├── alembic/versions/              # expand/contract migrations only
│   └── app/
│       ├── api/                       # thin routers: validate + authz + call service
│       ├── core/<domain>/             # domain logic; ports.py (Protocol) for high-risk; NEVER import infrastructure
│       ├── infrastructure/            # adapters: postgres/, redis, object_storage, <provider>, sms, logging, crypto
│       ├── workers/  bot/  main.py
│       └── tests/{unit,integration,contract,e2e,security}/
├── web/
│   ├── CLAUDE.md
│   ├── .npmrc                         # install-links=true
│   ├── app/                           # App Router: public/SSG (crawlable) + (app)/ authed
│   ├── components/                    # composition over the design system (hand-roll only with justification)
│   ├── lib/                           # api client ({ok,data}), session, formatting
│   └── tests/visual/                  # Playwright pixel-diff baselines (mobile + desktop projects)
├── packages/canon/                    # @scope/canon — vendored design system
│   ├── CLAUDE.md
│   ├── src/                           # SINGLE SOURCE — Claude Design only, NEVER hand-edit
│   ├── dist/                          # committed build (incl. concatenated canon.css + favicon)
│   ├── tokens/                        # tailwind preset + css vars
│   └── package.json  CHANGELOG.md
├── mobile/
│   ├── CLAUDE.md
│   └── capacitor.config.ts            # points at web/ build; NO UI code here
├── infra/
│   ├── docker-compose.yml  docker-compose.prod.yml
│   ├── Caddyfile                      # auto-TLS, edge security headers, /media static, routing
│   └── scripts/{backup.sh,restore.sh}
└── docs/
    ├── PRD.md  ARCHITECTURE.md  TASKS.md  PARALLELIZATION.md
    ├── SECURITY.md  OPERATIONS.md  DEPLOYMENT.md
    ├── adr/00xx-*.md                  # one ADR per consequential decision / new runtime dep
    ├── handoff/{API_CONTRACT,DESIGN_BRIEF,INTERACTION_STATES,FLOWS,SCREEN_INDEX,VISUAL_COVERAGE}.md
    ├── runbooks/{deploy,restore,store-submission}.md
    └── playbooks/agent-project-scaffold.md   # this file
```

---

## 11. Root `CLAUDE.md` template (fill the placeholders)

```md
# Project: <Product Name> (code-name `<project>`)

<One paragraph: what it is, who it's for, the core user flow, the regulatory/region constraint.>
For area rules, read the nearest nested CLAUDE.md: backend/, web/, mobile/, packages/canon/.

## 0. Behavioral principles (read FIRST, applies to EVERY task)
<Paste §2 of the scaffold playbook verbatim: 0.1 Think before coding · 0.2 Simplicity first ·
 0.3 Surgical changes · 0.4 Goal-driven execution.>

## 1. Stack
<One line per layer: language+framework / ORM+DB / cache+queue / web framework + design system /
 mobile wrapper / external providers / edge. Note non-obvious version choices.>

## 2. Commands (make)
install · dev · test · lint · typecheck · security-check · migrate. UI: cd web && npm run test:visual.

## 3. Project structure
- backend/app/api/ — thin routers
- backend/app/core/<domain>/ — domain logic, hexagonal — NEVER imports infrastructure/
- backend/app/infrastructure/ — adapters
- web/ — Next.js consuming @scope/canon (one build → web + wrapped iOS/Android)
- packages/canon/ — vendored design system (NEVER edit src/)
- mobile/ — wrapper config only, NO UI
- infra/ · docs/

## 4. Conventions (non-defaults only)
- API envelope: { "ok": true, "data": {...} } / { "ok": false, "error": "code", "request_id": "..." }
- Domain returns Result[T, DomainError]; exceptions only at the api boundary
- All Pydantic models: ConfigDict(extra='forbid')
- IDs: UUIDv4 public; money in integer minor-units, never float
- Timestamps: TIMESTAMPTZ in DB, UTC in app, local TZ in UI

## 5. Protected paths (read the doc first, update tests same commit)
<The §3 table.>

## 6. Hard rules (NEVER violate)
<The §4 list.>

## 7. Definition of Done
Build clean · make lint green · make typecheck green · make test green (full suite for protected paths) ·
protected path → make security-check green + governing doc re-read + tests in the same commit ·
UI → npm run test:visual ≤ 2% · diff surgical (every changed line traces to the request).

## 8. Reference docs (TRIGGER = when to read each)
- @docs/OPERATIONS.md — TRIGGER: any deploy/CI/design-vendoring/infra/money-ops
- @docs/SECURITY.md — TRIGGER: any change to auth/money/PII/upload/moderation/webhooks
- @docs/handoff/API_CONTRACT.md — TRIGGER: any endpoint or front↔back work
- @docs/handoff/DESIGN_BRIEF.md — TRIGGER: any UI/design work
- @docs/handoff/INTERACTION_STATES.md — TRIGGER: any UI/endpoint work (exhaustive states)
- @docs/handoff/FLOWS.md — TRIGGER: any branching flow (dispute/refund/cancel/appeal/DSR/report)
- @docs/PARALLELIZATION.md — TRIGGER: planning what to build independently
- @docs/PRD.md · @docs/ARCHITECTURE.md · @docs/TASKS.md · @docs/adr/
```

---

## 12. Day-1 checklist

- [ ] Root `CLAUDE.md` exists with §0 principles, protected paths, hard rules, DoD, doc index.
- [ ] Area `CLAUDE.md` in each top-level codebase, each re-pointing to §0.
- [ ] `Makefile` with the standard targets; `make lint` includes the **formatter** check; CI runs the same set cache-cold.
- [ ] Import-linter (or equivalent) enforcing `core ⇏ infrastructure`.
- [ ] Pre-commit secret scanning + a CI secret-scan + SAST + dependency audit gate.
- [ ] Compose with Postgres + Redis; Alembic baseline; `/healthz` + `/readyz` + a `/version` build stamp.
- [ ] The handoff-doc set written and the **API contract frozen** before front+back go heads-down.
- [ ] `docs/PARALLELIZATION.md` naming the tracks, sync points, and the do-not-split money core.
- [ ] `docs/OPERATIONS.md` seeded with the "write down what you learn the hard way" preamble.
- [ ] A backlog (`docs/TASKS.md`) with stable IDs, one-task-one-PR sizing, EARS-style acceptance.
```
