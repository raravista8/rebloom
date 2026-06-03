# TASKS — Передарим (code-name `rebloom`)

> Backlog for Claude Code. Stable IDs `T<epic>.<seq>` — never renumber. Priority: P0 blocking MVP / P1 MVP / P2 post-MVP / P3 nice. One task ≈ one PR (<500 LOC, <2h agent work). Epic order = recommended execution order. Acceptance in EARS, verifiable by command/test. Token estimates rough.

---

## Epic E0: Project skeleton & CI
> Goal: a working, tested, secured repo skeleton both runtimes build on.
> Definition of Done: `make install/dev/test/lint/typecheck/security-check` all run; CI green on push.
> Depends on: -

### T0.1 [P0] Scaffold modular-monolith backend
- **Files**: `backend/pyproject.toml`, `backend/app/{api,core,infrastructure,workers,bot}/__init__.py`, `backend/app/main.py`, `Makefile`, `.nvmrc`, `.python-version`
- **Acceptance (EARS)**: The repo shall provide a Python 3.12 toolchain where `make test` runs pytest and exits 0 on an empty suite. When CI runs on push, the system shall execute ruff+import-linter+mypy+pytest in <3 min.
- **Out of scope**: any domain logic
- **Tokens**: ~30k · **Verification**: `make lint typecheck test` exit 0 · **Refs**: ARCHITECTURE §9–10, ADR-0001/0002

### T0.2 [P0] Configure import-linter dependency rule
- **Files**: `backend/.importlinter`, CI step
- **Acceptance**: If `app.core` imports `app.infrastructure`, then CI shall fail.
- **Tokens**: ~15k · **Verification**: a deliberate violating import fails CI · **Refs**: ADR-0002, SECURITY §7

### T0.3 [P0] Pre-commit + secret scanning + CI workflow
- **Files**: `.pre-commit-config.yaml`, `.secrets.baseline`, `.github/workflows/ci.yml`, `.gitignore`, `.env.example`
- **Acceptance**: The system shall block commits containing secrets (gitleaks/detect-secrets). When CI runs, it shall run bandit, pip-audit, npm audit (high+), gitleaks.
- **Tokens**: ~25k · **Verification**: `make security-check` exit 0; planted fake secret blocked · **Refs**: SECURITY §6–7
- **Depends on**: T0.1

### T0.4 [P0] Postgres + Redis via Docker Compose + Alembic baseline
- **Files**: `infra/docker-compose.yml`, `backend/alembic/`, `backend/app/infrastructure/postgres/engine.py`
- **Acceptance**: When `make dev` runs, the system shall start api+postgres+redis healthy. When `make migrate` runs, alembic shall reach head.
- **Tokens**: ~30k · **Verification**: `/healthz` 200, `/readyz` 200 after migrate · **Refs**: ADR-0006

---

## Epic E1: Identity, auth & 152-ФЗ consent
> Goal: phone+OTP login, revocable sessions, consent records.
> DoD: a user can register/login by phone OTP; sessions revocable; consent stored.
> Depends on: E0

### T1.1 [P0] Phone+OTP issue/verify (`core/auth` hexagonal)
- **Files**: `backend/app/core/auth/{service.py,ports.py,schemas.py}`, `backend/app/infrastructure/sms.py`, `backend/app/api/auth.py`
- **Acceptance (EARS)**: When a user submits a valid phone, the system shall send a 6-digit OTP (TTL 5 min). When a correct OTP is submitted within TTL, the system shall issue a revocable session. If OTP attempts exceed 5/15min, then the system shall lock issuance 1h.
- **Tokens**: ~45k · **Verification**: `pytest tests/.../test_otp_*` green · **Refs**: FR-001..003, ADR-0007, SECURITY T-01
- **Depends on**: T0.4

### T1.2 [P0] Server-side sessions in Redis + middleware
- **Files**: `backend/app/core/auth/session.py`, `backend/app/api/middleware/auth.py`
- **Acceptance**: While a session is revoked, the system shall reject requests with that token. The system shall set cookies HttpOnly+Secure+SameSite=Lax.
- **Tokens**: ~30k · **Verification**: session-revocation test green · **Refs**: ADR-0007, SECURITY A07
- **Depends on**: T1.1

### T1.3 [P0] Consent capture (152-ФЗ)
- **Files**: `backend/app/core/consent/`, migration
- **Acceptance**: The system shall store accepted consent with policy_version, timestamp, source_channel before first PII-producing action.
- **Tokens**: ~20k · **Verification**: `test_consent_required.py` · **Refs**: FR-004, SECURITY §3 T-10

### T1.4 [P1] Admin TOTP 2FA + RBAC roles
- **Files**: `backend/app/core/auth/rbac.py`, `backend/app/core/auth/totp.py`, `backend/app/api/admin/`
- **Acceptance**: While role=admin, login shall require TOTP. The system shall enforce the role/ownership matrix on protected routes.
- **Tokens**: ~35k · **Verification**: `test_admin_2fa.py`, authz matrix tests · **Refs**: SECURITY §5

---

## Epic E2: Web frontend (Next.js) + canon
> Goal: one Next.js web app consuming `@rebloom/canon` (the verified web design system from Claude Design); visual-regression harness. This web build is also the iOS/Android app (wrapped by Capacitor in E9).
> DoD: app shell renders canon; `npm run test:visual` passes ≤ 2%; mobile-first.
> Depends on: E0

### T2.1 [P0] Vendoring `@rebloom/canon` + Next.js scaffold (mobile-first)
- **Files**: `packages/canon/`, `web/` (Next.js App Router + Tailwind), `web/CLAUDE.md`
- **Acceptance**: The web app shall import `@rebloom/canon` + tokens and build clean. When canon is re-vendored, the diff shall be verified against the zip src (not the version label). Screens shall be designed mobile-first.
- **Tokens**: ~40k · **Verification**: `npm run build` clean; canon markers present · **Refs**: ADR-0004, ARCHITECTURE §0, `vitrina/OPERATIONS §7`

### T2.2 [P0] Visual regression (Playwright pixel-diff vs canon baselines)
- **Files**: `web/tests/visual/`, `infra/scripts/generate-canon-baselines.sh`
- **Acceptance**: When a screen changes, `npm run test:visual` shall pass with diff ≤ 2% vs baselines. (iOS/Android render the same build → parity is identical by construction.)
- **Tokens**: ~30k · **Verification**: visual suite green · **Refs**: CLAUDE.md UI DoD

### T2.3 [P1] App shell, routing, session wiring
- **Files**: `web/app/(app)/`, `web/app/(public)/`, auth client
- **Acceptance**: When an unauthenticated user opens an app route, the system shall redirect to phone-OTP login. Public listing routes shall be SSR/SSG (crawlable).
- **Tokens**: ~30k · **Refs**: E1, ADR-0004 (SEO)
- **Depends on**: T1.2, T2.1

### T2.4 [P0] Full interaction-state matrix for every screen/component
- **Files**: `web/` screens + canon usage, `web/tests/visual/` (per-state baselines)
- **Acceptance**: Every screen/component shall implement all applicable states per `INTERACTION_STATES.md`: rest/hover(pointer)/focus-visible/pressed/loading/disabled/error; input rest/hover/focus/filled/invalid/disabled; collection idle/loading-skeleton/empty/**no-results**/loading-more/end-of-list/error/offline. **Buttons are enabled by default** — `disabled` only in-flight or hard precondition; no "grey until valid" (validate inline on press). Data-driven states bind to `API_CONTRACT.md §7` / `INTERACTION_STATES.md §6`.
- **Tokens**: ~40k · **Verification**: `npm run test:visual` covers each state; offline/no-results render distinctly · **Refs**: INTERACTION_STATES, DESIGN_BRIEF §6
- **Depends on**: T2.1, T4.4

### T2.5 [P0] Branching flows UI (disputes, refunds, cancel, pay-retry, moderation-appeal, delivery, DSR, report)
- **Files**: `web/app/(app)/deal/[id]/dispute/`, related screens/modals, `web/tests/visual/flows/`
- **Acceptance**: Each flow in `FLOWS.md` shall be implemented step-by-step with all states (incl. edge cases/timeouts), bound to `API_CONTRACT`. Dispute (FLOW-1) implemented in full for both the user side and (admin) resolution side.
- **Tokens**: ~45k · **Verification**: `npm run test:visual` (flow baselines); dispute open→evidence→resolve covered · **Refs**: FLOWS.md, SUPPORT.md, INTERACTION_STATES
- **Depends on**: T2.4, T5.6
---

## Epic E3: Listings & photos
> Goal: sellers publish bouquets with moderated, EXIF-stripped photos.
> DoD: publish flow live; photos re-encoded & moderated; auto-archive on expiry.
> Depends on: E1, E2

### T3.1 [P0] Listing domain + lifecycle state machine
- **Files**: `backend/app/core/listings/{service.py,state_machine.py,schemas.py}`, migration, `backend/app/api/listings.py`
- **Acceptance**: When a seller publishes (1–5 photos, size, freshness, price, city), the system shall create it draft→active after moderation. While active, the system shall decay freshness over time and auto-archive at expiry (default 72h).
- **Tokens**: ~45k · **Verification**: `test_listing_lifecycle.py` · **Refs**: FR-010,013,014

### T3.2 [P0] Photo upload pipeline (validate, re-encode, EXIF-strip, store)
- **Files**: `backend/app/core/photos/`, `backend/app/workers/image.py`, `backend/app/infrastructure/object_storage.py`
- **Acceptance**: The system shall validate MIME+magic bytes, re-encode to JPEG/WebP, strip EXIF/GPS, generate thumb/card/full variants, store under random keys, reject SVG/oversize.
- **Tokens**: ~45k · **Verification**: `test_upload_fuzz.py`; output has no EXIF · **Refs**: FR-011, SECURITY T-04
- **Depends on**: T0.4

### T3.3 [P0] Automated moderation: text (profanity/hate-slurs/contacts) + photo — fail-closed
- **Files**: `backend/app/core/moderation/`, `backend/app/workers/moderation.py`, lexicon config
- **Acceptance**: The system shall normalize text (lowercase, de-leet, de-spacing, NFKC) and block profanity, hate/ethnic slurs, and off-platform contacts via maintained denylists + classifier; hard-hit → `content_blocked` (inline error, no echo of the term), probabilistic → `pending_review`. If a photo/text fails, then the listing is held and the seller notified. Model output is untrusted (`<user_content>`, no execution).
- **Tokens**: ~45k · **Verification**: `test_text_moderation.py` (incl. obfuscation bypass), `test_moderation_prompt_injection.py` · **Refs**: FR-012/062/063, MODERATION.md, SECURITY T-15
- **Depends on**: T3.2

### T3.4 [P1] Perceptual-hash duplicate / stolen-photo flag
- **Files**: `backend/app/core/moderation/phash.py`
- **Acceptance**: When a near-duplicate photo of an existing/known listing is uploaded, the system shall flag it for review.
- **Tokens**: ~25k · **Verification**: `test_phash_duplicate.py` · **Refs**: SECURITY T-09

---

## Epic E4: Feed, likes & top
> Goal: city-scoped home with «самые свежие» + «самые залайканные».
> DoD: home returns top-N freshest & top-N most-liked per city; likes idempotent.
> Depends on: E3

### T4.1 [P0] Likes (idempotent, per user per listing) + counters
- **Files**: `backend/app/core/likes/`, Redis counter, migration
- **Acceptance**: When a user likes a listing, the system shall record exactly one like per user per listing and update the score.
- **Tokens**: ~25k · **Verification**: `test_like_idempotent.py` · **Refs**: FR-015

### T4.2 [P0] City-scoped feed: freshest + most-liked top
- **Files**: `backend/app/core/feed/`, `backend/app/api/feed.py`
- **Acceptance**: While a user is in city C, when they open home, the system shall return top-N freshest and top-N most-liked active listings for C (paginated, capped).
- **Tokens**: ~35k · **Verification**: `test_feed_top.py`; p95 < 200ms on seeded data · **Refs**: FR-016, NFR perf
- **Depends on**: T4.1

### T4.3 [P0] 10-city seed + geo scoping
- **Files**: `backend/app/core/geo/`, seed migration
- **Acceptance**: The system shall scope listings/feeds by city_id for the 10 launch cities.
- **Acceptance**: The system shall seed the 10 launch cities (msk, spb, nsk, ekb, kzn, krsk, nnv, chel, ufa, smr) with `city_id`/slug/name and scope all listings/feeds by `city_id`; rollout gated by per-city feature flag.
- **Tokens**: ~20k · **Verification**: `test_city_seed.py`; feed scoped by city · **Refs**: PRD §9 (cities table), OPERATIONS §8

### T4.4 [P0] Search + filters with applied-echo, empty vs no-results, pagination end
- **Files**: `backend/app/core/feed/search.py`, `backend/app/api/feed.py`
- **Acceptance**: `GET /api/search` shall return `{items, next_cursor, applied:{q,city_id,filters}, suggestions?}`; `GET /api/feed` shall include `applied`. The system shall make `empty` (no query/filter, items=[]) distinguishable from `no-results` (query/filter set, items=[]) via the `applied` echo, and signal end-of-list via `next_cursor:null`.
- **Tokens**: ~30k · **Verification**: `test_search_states.py` (empty vs no-results vs end) · **Refs**: API_CONTRACT §3/§7, INTERACTION_STATES §6/§7

---

## Epic E5: Deals & escrow (ЮKassa)
> Goal: safe purchase with escrow hold/release, ledger, idempotent webhooks.
> DoD: full deal lifecycle with funds held then released; double-release impossible.
> Depends on: E3, E1

### T5.1 [P0] Deal state machine + append-only ledger
- **Files**: `backend/app/core/deals/{service.py,state_machine.py,ledger.py,ports.py}`, migration
- **Acceptance**: While a deal is paid_held, the system shall release funds only via buyer confirmation, delivery confirmation, or support decision. The ledger shall be append-only and reconcile per deal.
- **Tokens**: ~50k · **Verification**: `test_deal_state_machine.py`, ledger invariant test · **Refs**: FR-020..026, ADR-0003
- **Depends on**: T3.1

### T5.2 [P0] ЮKassa adapter: «Безопасная сделка» + split + payout
- **Files**: `backend/app/infrastructure/yookassa.py`, `backend/app/api/payments.py`
- **Acceptance**: When a buyer pays, the system shall hold funds (escrow). When a deal is released, the system shall split commission and payout to the seller, and request a 54-ФЗ receipt. No card data shall be stored or logged.
- **Tokens**: ~50k · **Verification**: `test_payment_flow.py`; grep shows no card fields · **Refs**: ADR-0003/0005
- **Depends on**: T5.1

### T5.3 [P0] Webhook handler: signature-verified + idempotent
- **Files**: `backend/app/api/webhooks/yookassa.py`
- **Acceptance**: The system shall verify ЮKassa signature + source IP, re-fetch payment status, and process each payment id idempotently. If signature fails, then the system shall reject and alert.
- **Tokens**: ~35k · **Verification**: `test_webhook_signature.py`, `test_webhook_replay.py` · **Refs**: SECURITY T-02
- **Depends on**: T5.2

### T5.4 [P0] Concurrency-safe release (no double payout)
- **Files**: `backend/app/core/deals/service.py` (row locks)
- **Acceptance**: When confirm-receipt and a retried webhook arrive concurrently, the system shall release exactly once.
- **Tokens**: ~30k · **Verification**: `test_double_release_race.py` (concurrent) · **Refs**: SECURITY T-03
- **Depends on**: T5.1

### T5.5 [P0] Reservation TTL + payment timeout
- **Files**: `backend/app/workers/reservations.py`
- **Acceptance**: If payment is not completed within 30 min, then the system shall cancel the deal and release the listing.
- **Tokens**: ~20k · **Verification**: `test_reservation_expiry.py` · **Refs**: FR-022, SECURITY T-12

### T5.6 [P1] Disputes + support resolution
- **Files**: `backend/app/core/deals/dispute.py`, admin route
- **Acceptance**: When a party opens a dispute before release, the system shall freeze funds; support resolution shall release/refund/partial, all audit-logged.
- **Tokens**: ~35k · **Verification**: `test_dispute_flow.py`, audit test · **Refs**: FR-024, SECURITY T-11

---

## Epic E6: Hybrid delivery
> Goal: self-pickup chat/geo + integrated courier, PII-safe address gating.
> DoD: both delivery methods work; exact address never leaks pre-payment.
> Depends on: E5

### T6.1 [P0] Deal chat + gated geo/address sharing
- **Files**: `backend/app/core/deals/chat.py`, contact-leak filter, WS endpoint
- **Acceptance**: Where delivery=self_pickup, the system shall provide a deal-scoped chat and reveal exact address only after paid_held to the counterparty. If a message contains contacts, then the system shall hold/strip it.
- **Tokens**: ~40k · **Verification**: `test_address_disclosure_gate.py`, `test_contact_leak_filter.py` · **Refs**: FR-030, SECURITY T-05/T-13

### T6.2 [P1] Яндекс Доставка adapter (`DeliveryProvider` port)
- **Files**: `backend/app/infrastructure/yandex_delivery.py`, `backend/app/core/delivery/`
- **Acceptance**: Where delivery=courier, the system shall create a claim and surface tracking. If claim creation fails, then the deal shall stay paid_held and offer pickup/cancel.
- **Tokens**: ~40k · **Verification**: `test_delivery_*`, claim-failure fallback · **Refs**: FR-031/032, ADR-0008

---

## Epic E7: Reviews & ratings
> Goal: mutual post-deal reviews; seller rating; moderated review text.
> DoD: reviews enabled on release; ratings aggregate; bad reviews held.
> Depends on: E5

### T7.1 [P0] Mutual reviews on released deal
- **Files**: `backend/app/core/reviews/`, migration, api
- **Acceptance**: When a deal is released, the system shall enable mutual review forms for 14 days. If a review contains contacts/slurs, then it shall be held.
- **Tokens**: ~35k · **Verification**: `test_reviews_flow.py` · **Refs**: FR-040,042

### T7.2 [P1] Seller rating aggregation + ranking signal
- **Files**: `backend/app/core/reviews/rating.py`, feed integration
- **Acceptance**: The system shall compute seller rating from received reviews and use it as a ranking signal.
- **Tokens**: ~20k · **Verification**: `test_rating_aggregate.py` · **Refs**: FR-041

---

## Epic E8: Telegram bot channel
> Goal: same browse→buy→status flow inside Telegram (egress via proxy).
> DoD: bot lists city feed, opens listing, starts payment, pushes status.
> Depends on: E4, E5

### T8.1 [P0] aiogram bot skeleton + identity link via OTP
- **Files**: `backend/app/bot/`, proxy egress config
- **Acceptance**: The bot shall link a Telegram id only to an OTP-verified account. The bot shall reach Telegram via the configured proxy (RF-VPS blocks api.telegram.org).
- **Tokens**: ~40k · **Verification**: `test_bot_identity_link.py`; bot connects through proxy · **Refs**: SECURITY T-14, OPERATIONS §4, `vitrina` infra fact

### T8.2 [P1] Bot feed + listing card + payment link + status notifications
- **Files**: `backend/app/bot/handlers/`
- **Acceptance**: Where the user is in Telegram, the system shall present city feed, listing card, a ЮKassa payment link, and deal-status notifications.
- **Tokens**: ~40k · **Refs**: FR-051
- **Depends on**: T8.1

---

## Epic E9: Mobile apps — Capacitor wrapper (one codebase, no per-platform UI)
> Goal: signed iOS+Android that render the SAME `web/` build via Capacitor; zero platform-specific UI.
> DoD: signed artifacts build from the web bundle; camera/geo/push reachable via plugins; no Swift/Kotlin/RN UI exists; store checklist passes.
> Depends on: E2, E3, E5

### T9.1 [P0] Capacitor project wrapping the web build (single source)
- **Files**: `mobile/` (Capacitor config only), `mobile/CLAUDE.md`, CI build
- **Acceptance**: The build shall produce signed iOS and Android artifacts from the SAME `web/` build. The repo shall contain NO platform-specific UI (no Swift/Kotlin/RN screens) — `mobile/` is config + plugin wiring only.
- **Tokens**: ~40k · **Verification**: signed artifacts; lint/grep finds no native UI; visual parity = same DOM · **Refs**: ADR-0004

### T9.2 [P0] Capacitor plugins via JS bridge (shared config, not separate dev)
- **Files**: `mobile/` plugin config consumed by the shared web UI
- **Acceptance**: The same web UI shall reach camera (photograph bouquet), geolocation (pickup), push (deal status), share — configured once, no per-platform UI code.
- **Tokens**: ~30k · **Refs**: ADR-0004
- **Depends on**: T9.1

### T9.3 [P1] Store submission checklist (Apple/Google)
- **Files**: `docs/runbooks/store-submission.md`
- **Acceptance**: The submission shall pass the documented Apple 4.2/4.3 checklist (real device features + transactional marketplace, not a brochure); physical-goods payments via ЮKassa (no IAP).
- **Tokens**: ~20k · **Refs**: DEPLOYMENT, ADR-0004 (residual review risk = accepted)
---

## Epic E10: Admin, observability & deploy
> Goal: moderation queue, audit, metrics/alerts, prod deploy + backups.
> DoD: admin moderates; audit immutable; alerts fire; deploy + restore tested.
> Depends on: E1, E5

### T10.1 [P0] Moderation queue + immutable audit log
- **Files**: `backend/app/core/admin/`, `backend/app/api/admin/`
- **Acceptance**: The system shall give moderators approve/reject for pending listings/reviews; every approve/reject/refund/release shall write an immutable audit entry (actor, target, reason, request_id).
- **Tokens**: ~40k · **Verification**: `test_admin_audit.py`, immutability test · **Refs**: FR-060/061, SECURITY T-11

### T10.2 [P0] Structured logging + PII redaction + health endpoints
- **Files**: `backend/app/infrastructure/logging.py`, `/healthz`, `/readyz`
- **Acceptance**: The logger shall mask phones/emails/addresses; /healthz=liveness, /readyz=dependency readiness with distinct semantics.
- **Tokens**: ~25k · **Verification**: `test_log_redaction.py` · **Refs**: SECURITY §8

### T10.3 [P1] Metrics/tracing + alerts (SLO + security)
- **Files**: `infra/observability/`, OpenTelemetry wiring
- **Acceptance**: The system shall trace deal/payment/payout and alert on failed-login spikes, 4xx/5xx spikes, webhook-signature failures, payout anomalies.
- **Tokens**: ~35k · **Refs**: SECURITY §8

### T10.4 [P0] Prod deploy (Caddy + compose + managed DB) + backup/restore runbook
- **Files**: `infra/Caddyfile`, `infra/docker-compose.prod.yml`, `docs/runbooks/deploy.md`, `docs/runbooks/restore.md`
- **Acceptance**: When merged to main, the changed service shall deploy via documented runbook; a restore from backup shall be verified.
- **Tokens**: ~35k · **Verification**: deploy + restore dry-run documented · **Refs**: DEPLOYMENT, OPERATIONS

---

## Epic E11: Admin panel, analytics & fraud
> Goal: оператор видит метрики/деньги/юзеров/сделки, модерирует, ловит фрод.
> DoD: admin API + UI live; все действия audited; метрики/финансы из ledger/events; fraud-сигналы в очереди.
> Depends on: E1, E5, E10. Specs: `docs/handoff/ADMIN_BACKEND_TZ.md` (бек) + `ADMIN_DESIGN_BRIEF.md` (UI).

### T11.1 [P0] Analytics events + sessions + platform/source/IP capture
- **Files**: `backend/app/core/analytics/`, `EVENT`/`SESSION`/`IP_LOG` migrations, client platform/UTM tagging
- **Acceptance**: The system shall record events with platform(web/ios/android), source/UTM (first-touch), city, IP; online = Redis heartbeat; compute DAU/MAU. ПДн-доступ logged.
- **Tokens**: ~40k · **Verification**: `test_dau_mau.py`, `test_online_count.py` · **Refs**: FR-065/070, ADMIN_BACKEND_TZ

### T11.2 [P0] Admin overview + finance (turnover, commission) from ledger
- **Files**: `backend/app/api/admin/overview.py`, `finance.py`
- **Acceptance**: `/api/admin/overview` + `/api/admin/finance` shall return online/DAU/MAU, users by city/platform, GMV, commission per period — derived from append-only ledger/events; role+2FA.
- **Tokens**: ~40k · **Verification**: `test_admin_finance_reconciles.py` · **Refs**: FR-070, SECURITY T-17

### T11.3 [P0] Admin users + listings + deals (search, edit, block, stop/delete) — audited, 4-eyes
- **Files**: `backend/app/api/admin/{users,listings,deals}.py`, RBAC, audit
- **Acceptance**: Search users (name/phone/id) & listings; user drill-down (listings, reviews, rating, IPs, multi-account flag, platform); block/unblock/edit (reason+audit); stop/soft-delete deal (4-eyes if money; ledger never lost).
- **Tokens**: ~50k · **Verification**: `test_admin_authz.py`, `test_admin_audit.py`, `test_deal_softdelete_ledger.py` · **Refs**: FR-071/072, SECURITY T-11/T-16

### T11.4 [P1] Fraud signals + multi-account clustering + risk score
- **Files**: `backend/app/core/fraud/`, `FRAUD_SIGNAL` migration, `/api/admin/fraud`
- **Acceptance**: The system shall compute signals (multi-account per IP/device, self-dealing, price/velocity anomaly, photo reuse, payout concentration, dispute spikes, geo mismatch) into a risk score with review actions.
- **Tokens**: ~45k · **Verification**: `test_multiaccount_cluster.py`, `test_selfdealing.py` · **Refs**: FR-073, SECURITY T-18, ADMIN_BACKEND_TZ §Fraud

### T11.5 [P1] User reports (abuse) + appeals queue
- **Files**: `backend/app/core/moderation/reports.py`, `/api/reports`, admin queue
- **Acceptance**: When a user reports a listing/user or appeals a block, the system shall queue it for moderators.
- **Tokens**: ~25k · **Verification**: `test_reports.py` · **Refs**: FR-064/063

### T11.6 [P1] Admin UI (canon `./admin`) — dashboard, tables, drill-downs, destructive-confirm
- **Files**: `web/app/(admin)/`, canon admin components, `web/tests/visual/admin/`
- **Acceptance**: Desktop-first admin renders overview/users/listings/deals/finance/fraud/moderation/reports per `ADMIN_DESIGN_BRIEF.md` with full states (loading/empty/no-results/error) and confirm+reason modals for destructive actions.
- **Tokens**: ~45k · **Verification**: `npm run test:visual` (admin baselines) · **Refs**: ADMIN_DESIGN_BRIEF, INTERACTION_STATES

### T11.7 [P2] Motion in canon reaches prod (verify) + reduced-motion
- **Files**: `web/`, canon `./motion` consumption, motion checklist
- **Acceptance**: Hover/press/focus/like/skeleton/transition animations come from canon (not hand-added in `web/`); `prefers-reduced-motion` fully supported; 60fps; motion checklist passes.
- **Tokens**: ~20k · **Verification**: motion checklist + reduced-motion test · **Refs**: MOTION.md

---

## Epic E12: Notifications, privacy, support, referral, peak & telegram-egress
> Goal: транзакционные уведомления, права ПДн (ФЗ-152), консоль поддержки/споров, реферал (за флагом), готовность к пикам, рабочий Telegram-egress.
> DoD: уведомления доставляются идемпотентно; DSR работает; споры с SLA; реферал за флагом; пиковый runbook; бот ходит через прокси.
> Depends on: E1, E5, E10, E11. Specs: NOTIFICATIONS / PRIVACY_152FZ / SUPPORT / REFERRAL / ADR-0009/0010.

### T12.1 [P0] Transactional notifications (outbox + push/email/Telegram)
- **Files**: `backend/app/core/notifications/`, providers in `infrastructure/`, RQ worker
- **Acceptance**: Notifiable events deliver via opted-in channels idempotently (dedup by event+channel) with retries; критичные (сделка) надёжными каналами. Email via Yandex SMTP; Telegram via proxy.
- **Tokens**: ~40k · **Verification**: `test_notifications_idempotent.py` · **Refs**: FR-090, NOTIFICATIONS.md
### T12.2 [P1] Notification settings + one-click unsubscribe + maintenance banner
- **Files**: `backend/app/api/me/notifications.py`, `web/` settings, global banner
- **Acceptance**: Per-category toggles; marketing opt-in only + 1-click unsubscribe; admin maintenance banner renders globally.
- **Tokens**: ~25k · **Refs**: FR-090, NOTIFICATIONS.md §4–5
### T12.3 [P0] ФЗ-152 DSR: export / delete / correct + retention jobs
- **Files**: `backend/app/core/privacy/`, `/api/me/export`, `/api/me/delete`, retention worker
- **Acceptance**: Verified user can export data (machine-readable) and request deletion (soft-disable now, anonymize per retention, keep legally-required anonymized ledger); retention jobs purge IP/sessions/photos on schedule; DSR audited.
- **Tokens**: ~40k · **Verification**: `test_dsr_export_delete.py`, `test_retention_jobs.py` · **Refs**: FR-091, PRIVACY_152FZ.md, SECURITY T-10
### T12.4 [P1] Support/dispute console + SLA + escalation
- **Files**: `backend/app/core/support/`, `/api/support/tickets`, admin console
- **Acceptance**: Tickets + dispute queue with SLA timers; support resolves within limit, escalates to admin (4-eyes on money); all audited; disputes freeze funds.
- **Tokens**: ~35k · **Verification**: `test_dispute_sla.py` · **Refs**: FR-092, SUPPORT.md, FR-024
### T12.5 [P2] Referral program (feature-flagged) + anti-abuse
- **Files**: `backend/app/core/referral/` (behind `REFERRAL_ENABLED`)
- **Acceptance**: When enabled, attribute invitees; reward only after a confirmed deal; self-referral/multi-account checks (fraud). Off by default.
- **Tokens**: ~30k · **Refs**: FR-093, REFERRAL.md
### T12.6 [P1] Telegram egress via proxy (ADR-0009)
- **Files**: `backend/app/bot/` egress config, healthcheck
- **Acceptance**: Bot reaches Telegram only via `TG_PROXY_URL`; healthcheck verifies; token never logged.
- **Tokens**: ~15k · **Verification**: bot connects through proxy; no token in logs · **Refs**: ADR-0009, SECURITY T-14
### T12.7 [P2] Peak-season readiness (8 марта / 14 февраля)
- **Files**: `docs/runbooks/peak.md`, load-test scenario, scale config
- **Acceptance**: Documented runbook (scale up/down, replica, CDN warm), pre-season load test passes targets, heightened anti-scam thresholds toggle.
- **Tokens**: ~20k · **Refs**: FR-094, DEPLOYMENT §9b, OPERATIONS §9
