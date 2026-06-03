# OPERATIONS — how we actually ship & run Передарим (`rebloom`)

> **Why this file exists.** Claude Code sessions are stateless across sessions — a
> fresh session only knows what's committed (the `CLAUDE.md` hierarchy + always-loaded
> docs), not what a previous session learned live. This file captures durable
> operational knowledge so every session bootstraps the same way. **Keep it current**:
> when you learn an infra fact, a deploy gotcha, or a money-flow quirk the hard way —
> write it here. Read before any deploy / CI / canon / infra / payment-ops work.

---

## 1. Prod coordinates `[fill on first deploy]`

| Thing | Value |
|---|---|
| Public domain | **peredarim.ru** |
| App VM (SSH) | `ssh deploy@<ip>` |
| Repo on VM | `/opt/rebloom` (deploy = `git pull` + `docker compose` there) |
| Compose invocation | `docker compose --env-file .env -f infra/docker-compose.yml -f infra/docker-compose.prod.yml` |
| Services | `caddy`, `api ×2`, `workers`, `bot` (Redis + Postgres are **managed**, not in compose on prod) |
| Managed Postgres | RF region, HA primary + read-replica; app user `rebloom_app`, migrator `rebloom_migrator` |
| Object Storage | bucket `rebloom-prod-photos` (+ CDN) |
| Build stamp | `GET /version` → `{git_sha, built_at}` |

Secrets live ONLY in `/opt/rebloom/.env` on the VM (or secret-store) — never in git.

---

## 2. Deploy runbook

Trunk-based: merge PR → `main` → deploy changed service(s) on the VM.

```bash
ssh deploy@<ip>
cd /opt/rebloom && git pull --ff-only origin main
C="docker compose --env-file .env -f infra/docker-compose.yml -f infra/docker-compose.prod.yml"
```

**Backend change** (api / workers / bot share one image):
```bash
$C build api && $C up -d --no-deps api workers bot
```

**Web change** — Next.js build served by the `web` service; pass build-args so `/version` is correct:
```bash
SHA=$(git rev-parse --short HEAD); TS=$(date -u +%Y-%m-%dT%H:%M:%SZ)
$C build --build-arg BUILD_VERSION=$SHA --build-arg BUILD_TIME=$TS web
$C up -d --no-deps web
```
> Native iOS/Android are produced by **Capacitor** from the same web build (signed in CI), not served from this VM (see DEPLOYMENT).

### Hard rules / gotchas
- **NEVER `docker compose build --pull` the whole stack** — build only the changed service, without `--pull` (base images cached on VM).
- **`--no-deps`** so recreating one service doesn't bounce others.
- Web (Next.js) builds can be slow → run detached and poll the log (foreground SSH times out).
- **DB migrations are run from CI / a one-shot, never by the app on boot.** Migrations must be expand/contract (additive) so a rollback of code doesn't require a rollback of schema.

### Verify a deploy
- `curl -sk https://<domain>/version` → `git_sha` matches merged commit.
- `$C ps` shows services `healthy`; `/readyz` 200 (DB+Redis+storage+providers reachable).

---

## 3. CI (GitHub Actions)

Backend — `ruff + import-linter`, `mypy --strict`, `pytest` (unit+integration+security subset), `bandit`, `pip-audit`.
Frontend — `eslint`, `tsc --noEmit`, `vitest`, `npm audit (high+)`, `visual regression` (Playwright pixel-diff vs canon baselines).
Infra — `docker compose config`. Plus `gitleaks` and the security-review gate.

- Watch a PR: `gh pr checks <N> --watch`.
- Visual regression flakes on slow navigation → `gh run rerun <run-id> --failed`.
- Merge: `gh pr merge <N> --squash --delete-branch`.

---

## 4. Infra facts (learned the hard way / carried from `vitrina`)

- **Telegram API is BLOCKED from RF VPS/Selectel.** `api.telegram.org` TCP-connect
  times out on RF hosting. The bot CANNOT deliver from the prod VM directly. ⇒ the
  `bot` service routes egress through a **proxy/relay outside RF** (`TG_PROXY_URL`); options & choice — **ADR-0009**. Alternatively run the bot where Telegram is reachable. **Do not assume direct TG works.**
- **Founder/user alerts** therefore go via **push (mobile) + email (Yandex SMTP, port 465 implicit TLS)**; Telegram leg is best-effort and only works once the proxy is configured.
- **ЮKassa webhooks**: verify signature **and** re-fetch payment status from the ЮKassa API before any state change — never trust the webhook body alone. Process idempotently by `yk_payment_id`. Reject + alert on signature failure (SECURITY T-02).
- **Money paths fail-secure**: on any payment/payout/provider error, the deal stays `paid_held`. Never auto-release on a timeout or an ambiguous provider response. Resolve via the ledger + `payment-incident.md`.
- **Object Storage write path** must be configured before the publish/photo flow works (api+workers need `S3_*` creds). Without them, uploads are inert.
- **Caddy is bind-mounted** — after `git pull`, reload config atomically:
  `$C exec -T caddy caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile`.

---

## 5. Money operations (the highest-stakes runbook)

- **Daily ledger reconciliation** (automated): sum of `held` must equal escrow balance reported by ЮKassa; sum of `released+commission+refunded` must reconcile per deal. Any non-zero drift → freeze payouts + `payment-incident.md`.
- **Refund / force-release**: support within a configured limit; above the limit requires 4-eyes (second admin). Every action → immutable audit log.
- **Disputes**: funds stay frozen until resolution; resolution writes ledger + audit entries.
- **54-ФЗ receipts** are issued by ЮKassa on release; confirm `fiscal_receipt_id` is set before marking a deal complete.

---

## 6. Admin auth

- `/admin` requires **TOTP 2FA** (RBAC role=admin). 2FA is on by default in code; do not disable it on prod for convenience.
- Admin/moderation actions are all audit-logged (actor, target, reason, request_id).

---

## 7. Canon vendoring (`@rebloom/canon`) — frequent task

Canon is vendored at `packages/canon/`. Claude Design ships new versions as a zip. Procedure (same discipline as `vitrina`):
1. **Verify the diff is real — DON'T trust the version label.** Diff the zip's `src/` against vendored `src/`; read the zip CHANGELOG to know what *should* have changed and confirm it did.
2. `cp` changed `src/*` into `packages/canon/src/`.
3. Bump `packages/canon/package.json` version + description; prepend CHANGELOG section.
4. Rebuild dist (`npm run build`), commit dist. esbuild escapes Cyrillic to `\uXXXX` — grep ASCII markers to verify.
5. Cache-bust install into web:
   `cd web && rm -rf node_modules/@rebloom/canon && npm cache clean --force && npm install --install-links file:../packages/canon --force`.
6. Reconcile any consumer hacks that key off canon classes/selectors.
7. Bump version strings in `docs/handoff/VISUAL_COVERAGE.md`, `docs/handoff/SCREEN_INDEX.md`, `web/CLAUDE.md`.
8. Run `npm run test:visual` (diff ≤ 2%).

> **NEVER edit `packages/canon/src/*` directly** — it round-trips through Claude Design.

---

## 8. City rollout

- New city = feature flag + `city-rollout.md`: seed city row, enable flag, run a perf smoke (feed p95), then flip flag for users in that city. Geo is scoped by `city_id` from day one.


## 9. Peak season runbook (8 марта / 14 февраля)
Before: scale `api`/workers up, bump managed PG/Redis tier, enable read-replica, warm CDN, run load test (TESTING §5), raise anti-scam thresholds (SECURITY). During: watch SLO/online, moderation & dispute queues, payout anomalies. After: scale down, fraud post-mortem.
