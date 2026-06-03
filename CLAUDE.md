# Project: Передарим (brand) / `rebloom` (code-name)

C2C-маркетплейс ресейла подаренных букетов для РФ: продавец-физлицо выставляет букет → покупатель платит → деньги в эскроу → подтверждение → выплата; взаимные отзывы; топ-лента по свежести и лайкам. Один web-фронт (Next.js + `@rebloom/canon`), обёрнутый Capacitor в iOS/Android (тот же build), + Telegram-бот на едином backend. ФЗ-152.

`vitrina`-конвенция: бренд «Передарим» в customer-facing copy; `rebloom` — только code-name (repo, packages, env). For area rules, read the nearest nested `CLAUDE.md`: `backend/CLAUDE.md`, `web/CLAUDE.md` (**Next.js + web canon, mobile-first, pixel-perfect**), `mobile/CLAUDE.md` (Capacitor, config-only), `packages/canon/CLAUDE.md`.

## 0. Behavioral principles (read FIRST)
- **Think before coding.** State assumptions; if multiple interpretations — present, don't pick silently; if unclear — STOP and ask.
- **Simplicity first.** Minimum code; no speculative abstractions/flexibility; if 200 lines could be 50, rewrite.
- **Surgical changes.** Touch only what the request needs; match existing style; don't refactor working code; remove only orphans you created.
- **Goal-driven.** Turn tasks into verifiable goals (write the test, then pass it).

## 1. Stack
Python 3.12 + FastAPI + SQLAlchemy 2.0 + Postgres 16 (managed) + Redis (RQ). **Next.js (App Router) + Tailwind + `@rebloom/canon`** (web, the verified UI source of truth from Claude Design) + **Capacitor** wrap → iOS/Android (same build). aiogram 3 (bot). ЮKassa (escrow). Яндекс Доставка. Object Storage + CDN. Docker Compose on RF VM behind Caddy.

## 2. Commands (`make`)
`install` · `dev` (compose up) · `test` (pytest+vitest) · `test-full` (+e2e) · `lint` (ruff+eslint) · `typecheck` (mypy --strict + tsc) · `security-check` (bandit+pip-audit+npm audit+gitleaks) · `migrate` (alembic). UI: `cd landing && npm run test:visual`.

## 3. Project structure
- `backend/app/api/` — thin FastAPI routers
- `backend/app/core/<domain>/` — domain logic, hexagonal — **NEVER imports infrastructure/**
- `backend/app/infrastructure/` — adapters (postgres, redis, object_storage, yookassa, yandex_delivery, sms)
- `backend/app/workers/` — RQ jobs (image, moderation, payouts, delivery, notifications)
- `backend/app/bot/` — aiogram handlers (egress via proxy)
- `web/` — Next.js (App Router) consuming `@rebloom/canon`; one build serves web + (wrapped) iOS/Android; `app/`, `components/`, `tests/visual/`
- `mobile/` — Capacitor wrapper (config + plugin wiring only; NO UI)
- `packages/canon/` — vendored `@rebloom/canon`
- `infra/` — compose, Caddyfile, deploy · `docs/` — PRD/ARCH/SECURITY/TASKS/ADR/OPERATIONS

## 4. Conventions (non-defaults)
- API: `{ "ok": true, "data": {...} }` / `{ "ok": false, "error": "code", "request_id": "..." }`
- Domain returns `Result[T, DomainError]`; exceptions only at api boundary
- All Pydantic: `ConfigDict(extra='forbid')`
- IDs: UUIDv4 public; money in **kopecks (int)**, never float
- Timestamps: TIMESTAMPTZ in DB, UTC in app, MSK in UI
- Brand «Передарим» Cyrillic in customer copy; `rebloom` in code only

## 5. Protected paths (read the doc first, update tests same commit)
| Path | Why | Read first |
|---|---|---|
| `core/deals/`, `core/payments/` | escrow, ledger, money | `docs/SECURITY.md` + ADR-0003 |
| `core/auth/` | OTP, sessions, 2FA | `docs/SECURITY.md` + ADR-0007 |
| `core/consent/`, `core/leads` | PII, ФЗ-152 | `docs/SECURITY.md` |
| `core/photos/`, `core/moderation/` | untrusted upload/LLM | `docs/SECURITY.md` |
| `api/webhooks/` | payment integrity | `docs/SECURITY.md` T-02/03 |
| `packages/canon/src/` | vendored Claude Design | `docs/OPERATIONS.md §7` |
| `infra/`, `.github/workflows/` | deploy/CI | `docs/DEPLOYMENT.md`, OPERATIONS |

## 6. Hard rules (NEVER violate)
- NEVER commit secrets / `.env` / TOTP seeds
- NEVER store or log card data — tokenized at ЮKassa only
- NEVER auto-release escrow on timeout/ambiguous provider response — **fail-secure: stay held**
- NEVER release/refund without state-machine transition + idempotency + audit log
- NEVER weaken auth/2FA "temporarily"
- NEVER add a runtime dependency without an ADR
- NEVER use raw SQL with f-strings; ORM or `text(":param")` only
- NEVER concatenate user input into shell/HTML/LLM prompts; tag `<user_content>`
- NEVER send PII to LLM/log without masking (`[PHONE]`,`[EMAIL]`,`[ADDRESS]`)
- NEVER edit `packages/canon/src/*` directly — round-trip via Claude Design
- NEVER write per-platform mobile UI (Swift/Kotlin/RN) — **one web codebase (Next.js) is the iOS/Android app via Capacitor wrap**; `mobile/` is config + plugins only, never a parallel UI (ADR-0004)
- NEVER assume direct Telegram works from prod — egress via proxy (OPERATIONS §4)
- NEVER use money as float — kopecks int

## 7. Definition of Done
Build clean · `make lint` green · `make typecheck` green · `make test` green (full suite for protected paths) · protected path → `make security-check` green + doc re-read + tests in same commit · UI → `npm run test:visual` ≤ 2% · diff surgical.

## 8. Reference docs
- @docs/OPERATIONS.md — how we ship & run prod (read before deploy/CI/canon/infra/payment-ops)
- @docs/SECURITY.md — threat model + ФЗ-152/payment controls (read before auth/payments/deals/photos/moderation/consent)
- @docs/handoff/DESIGN_BRIEF.md — TRIGGER: any UI/design work — what Claude Design must produce
- @docs/handoff/CANON_PACKAGE_TZ.md — TRIGGER: any canon refresh / new entry — npm export + vendoring contract
- @docs/handoff/API_CONTRACT.md — TRIGGER: any endpoint or frontend↔backend work — the single source of truth for routes/shapes/enums/errors
- @docs/handoff/INTERACTION_STATES.md — TRIGGER: any UI/endpoint work — exhaustive states (hover/focus/empty/no-results/error/offline) bound to the API
- @docs/handoff/FLOWS.md — TRIGGER: disputes/refunds/cancellation/payment-retry/moderation-appeal/delivery/DSR/report — step-by-step branching flows
- @docs/MODERATION.md — TRIGGER: listings/chat/reviews/names — text+image auto-moderation (profanity, hate slurs, contacts)
- @docs/handoff/MOTION.md — TRIGGER: any UI — hover/animation spec; motion ships inside canon
- @docs/handoff/ADMIN_DESIGN_BRIEF.md · @docs/handoff/ADMIN_BACKEND_TZ.md — admin panel (UI + backend/analytics/fraud)
- @docs/NOTIFICATIONS.md · @docs/PRIVACY_152FZ.md · @docs/SUPPORT.md · @docs/REFERRAL.md — notifications, ФЗ-152 DSR/retention, support/disputes, referral
- @docs/legal/LEGAL.md — required legal docs (lawyer sign-off); ADR-0009 (telegram egress), ADR-0010 (commission)
- @docs/PARALLELIZATION.md — what can be built in parallel/independently (workstreams + sync points)
- @docs/runbooks/store-submission.md — build & release to App Store / Google Play / RuStore
- @docs/handoff/SCREEN_INDEX.md · @docs/handoff/VISUAL_COVERAGE.md — screen map + live UI coverage tracker
- @docs/PRD.md · @docs/ARCHITECTURE.md · @docs/TASKS.md · @docs/adr/ (0001–0008)
