# OPERATIONS — how we actually ship & run Передарим (`rebloom`)

> **Why this file exists.** Claude Code sessions are stateless across sessions — a
> fresh session only knows what's committed (the `CLAUDE.md` hierarchy + always-loaded
> docs), not what a previous session learned live. This file captures durable
> operational knowledge so every session bootstraps the same way. **Keep it current**:
> when you learn an infra fact, a deploy gotcha, or a money-flow quirk the hard way —
> write it here. Read before any deploy / CI / canon / infra / payment-ops work.

---

## 1. Prod coordinates `[fill on first deploy]`

> **MVP launch is SINGLE-BOX** (everything on one VPS) — see **`docs/runbooks/deploy-single-box.md`**, the source of truth for the launch deploy. The managed-PG/Redis topology below is the **scale-out target** (OPERATIONS §8 / runbook §8), config-only to switch to. The single-box stack is `infra/docker-compose.prod.yml` (caddy + api + scheduler + db + redis), photos on a local volume served by Caddy.

| Thing | Value (MVP single-box) |
|---|---|
| Public domain | **peredarim.ru** |
| App VM (SSH) | `ssh deploy@<ip>` |
| Repo on VM | `/opt/rebloom` (deploy = `git pull` + `docker compose` there) |
| Compose invocation | `docker compose --env-file .env -f infra/docker-compose.prod.yml` |
| Services | `caddy`, `api`, `scheduler`, `db` (Postgres), `redis` — all on ONE box; `bot` deferred (Phase 2) |
| Postgres | in-compose `db` (single box); **off-box encrypted backups mandatory** — `infra/scripts/backup.sh` |
| Photos | local `photos` volume, served by Caddy at `/media` (S3+CDN is the scale-out step) |
| Build stamp | `GET /version` → `{git_sha, built_at}` |

> **Scale-out (when load grows):** Postgres → managed (HA + PITR) → Redis → managed → api replicas → photos → S3/CDN. Each step is an env change, no `core/**` rewrite (runbook §8).

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
- **Single-box MVP compose = ONE file:** `C="docker compose --env-file .env -f infra/docker-compose.prod.yml"` (the two-`-f` form above is the scale-out topology). There is **no `migrate` service** — run migrations as a one-shot (below).
- **NEVER `docker compose build --pull` the whole stack** — build only the changed service, without `--pull` (base images cached on VM).
- **`--no-deps`** so recreating one service doesn't bounce others; add `--force-recreate` when only the image changed.
- **Web (Next.js) builds exceed the SSH command timeout (~300s) → background them, then poll, then `up` SEPARATELY.** A `build && up` one-liner loses the `up` when the SSH session buffers/drops mid-build. Proven recipe:
  ```bash
  SHA=$(git rev-parse --short HEAD); TS=$(date -u +%Y-%m-%dT%H:%M:%SZ)
  nohup $C build --build-arg BUILD_VERSION=$SHA --build-arg BUILD_TIME=$TS web > /tmp/web-build.log 2>&1 &
  until grep -q "Image rebloom-web Built" /tmp/web-build.log; do sleep 5; done   # poll
  $C up -d --no-deps --force-recreate web caddy                                  # SEPARATE command
  ```
- **DB migrations: one-shot, never on boot, expand/contract only.** On the single box, after building `api` and BEFORE `up`:
  ```bash
  $C build api && $C run --rm --no-deps api alembic current      # see where we are
  $C run --rm --no-deps api alembic upgrade head                 # apply (additive → order-safe vs old api)
  $C up -d --no-deps --force-recreate api scheduler
  ```
- **`/version` reports the `api` build, not `web`.** A web-only deploy leaves `git_sha` on the api commit — verify web by the image-created timestamp (`docker image inspect rebloom-web:latest --format '{{.Created}}'`) and/or grepping the served bundle (`curl … | grep <marker>`), not `/version`.
- **The `api` build must ALSO pass `--build-arg BUILD_VERSION=$SHA --build-arg BUILD_TIME=$TS`.** The §2 web recipe passes them; the api one-shot (`$C build api`) does NOT — so as of 2026-06 prod `/version` returns `{"git_sha":"dev","built_at":"unknown"}` and you cannot confirm which commit is live. Mirror the web recipe's args on the api build to restore the deploy stamp.
- **`NEXT_PUBLIC_YM_COUNTER_ID` (Yandex Metrica) is baked at `next build`** via a compose `web` build-arg substituted from `.env` (`${NEXT_PUBLIC_YM_COUNTER_ID:-}`). Activate by setting it in `/opt/rebloom/.env` + rebuilding `web`; every later web rebuild then auto-bakes it. Verify on prod by grepping the served root-layout chunk — `afterInteractive` injects the tag client-side, so it is **NOT** in the SSR HTML: `curl -s https://<domain>/_next/static/chunks/app/layout-*.js | grep <id>`.
- **A new top-level `import` in backend app code must be a MAIN dependency**, not `[tool.poetry.group.dev]` — the prod image installs main deps only, so e.g. `import httpx` (dev-only, used by TestClient) crash-loops the api with `ModuleNotFoundError`. Use stdlib (`urllib`) for runtime HTTP, or promote the lib to a main dep via ADR. Catch it before deploy: `grep -rn "^import \|^from " app/ | <check against main deps>`.

### Verify a deploy
- `curl -sk https://<domain>/version` → `git_sha` matches merged commit (api deploys only — see above).
- `$C ps` shows services `healthy`; `/readyz` 200 (DB+Redis+storage+providers reachable).
- SSH alias: `peredarim` (`~/.ssh/config` → `161.104.44.11`). `docker compose run` is the one-shot for migrations/alembic.

---

## 3. CI (GitHub Actions)

Backend — `ruff + import-linter`, `mypy --strict`, `pytest` (unit+integration+security subset), `bandit`, `pip-audit`.
Frontend — `eslint`, `tsc --noEmit`, `vitest`, `npm audit (high+)`, `visual regression` (Playwright pixel-diff vs canon baselines).
Infra — `docker compose config`. Plus `gitleaks` and the security-review gate.

- Watch a PR: `gh pr checks <N> --watch`.
- Visual regression flakes on slow navigation → `gh run rerun <run-id> --failed`.
- Merge: `gh pr merge <N> --squash --delete-branch`.
- **`main` has NO required-status-check protection — `gh pr merge` merges even with a RED check.** Always confirm `gh pr checks <N>` is all-pass *before* merging; a red `tsc`/`web` will otherwise land on main. (Bitten once: a bad `playwright.config` merged red and broke `main`.)
- **Visual testing has two layers** (`web/tests/visual/`, two Playwright projects `mobile-375` + `desktop-1280`; the mobile project is **375px wide — the iPhone reference**, not 360/Android): (1) DOM/functional specs + deterministic desktop **geometry guards** (`desktop.spec.ts`: no-clip via `scrollWidth≤clientWidth`, split spans full width, no horizontal overflow) — these catch structural breakage and never flake; (2) **pixel-diff** (`pixel.spec.ts`, `toHaveScreenshot` ≤2%, animations disabled + `emulateMedia({reducedMotion:'reduce'})`). Functional specs run in `mobile-375`; `desktop.spec.ts` is desktop-only; `pixel.spec.ts` runs in both. Reach for the geometry guard first — it's deterministic.
- **Pixel baselines are Linux-generated, never committed from macOS** (font rendering differs → false diffs). Regenerate via the **`visual-baselines` workflow_dispatch** (`gh workflow run visual-baselines.yml --ref <branch>`): it runs `--update-snapshots` and commits the `*-snapshots/*-linux.png`. Gotchas: the `git add` can't use bash `**` (no globstar — add the dir); and the bot's `GITHUB_TOKEN` push does **not** trigger CI (anti-recursion) → push an empty commit to run the diff verification. After adding/changing a screenshotted screen, dispatch the workflow to refresh baselines.
- **`ruff format --check`** is a separate gate from `ruff check` — run `poetry run ruff format` on every touched backend file (hand-written migrations especially), not just `ruff check`.
- **Bandit version can differ local↔CI** (CI pinned newer, e.g. 1.9.4): CI flags things local misses — e.g. `urllib.request.urlopen` → **B310** (Medium/High). Suppress real false-positives with `# nosec <CODE>` (a bandit directive); ruff's `# noqa` does nothing for bandit, and ruff's `S`-rules aren't enabled so `# noqa: S310` is itself an unused-directive error. Don't trust a local `bandit` pass alone.
- **Visual baselines are the `mobile-375` project** (375px = iPhone reference) — desktop-only changes (gated behind `useIsDesktop`/container-queries) don't move them. Run a fresh server (`CI=1 npm run test:visual`) — a stale reused `next start` can mask real changes.
- **`next lint` is cached → local can pass while CI fails.** ESLint caches per-file results (`.next/cache/eslint`); unchanged files aren't re-linted, so a rule that depends on the *route graph* (e.g. `@next/next/no-html-link-for-pages`) won't re-fire locally after you add a route — but CI runs cache-cold and flags it. Adding a **root-level dynamic segment** (`app/(public)/[city]/page.tsx`) makes that rule treat pre-existing `<a href="/legal/…">` links as page links and error. Fix = use `<Link>` for internal nav (the rule's intent); verify locally with `rm -rf web/.next/cache/eslint && npm run lint` before pushing, not a warm `next lint`.

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
  - **Gotcha:** the Caddyfile is a *single-file* bind mount (`./Caddyfile:/etc/caddy/Caddyfile`). `git pull` replaces the file via rename → new inode → the container keeps the **old** inode, so `caddy reload` re-reads the stale file. After a Caddyfile change you must **`$C up -d --no-deps --force-recreate caddy`** (re-binds the current inode), not just reload. (Bitten tuning the `/media` cache header.)
- **Security headers live at the Caddy edge** (one global `header {}` block → applies to web + api uniformly): HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options: SAMEORIGIN`, `-Server`, `-X-Powered-By`, and **`Content-Security-Policy-Report-Only`** (SECURITY A02). CSP ships **Report-Only first** (logs violations, blocks nothing) — its allowlist covers Yandex Metrica/Webvisor (`mc.yandex.ru`, `*.yandex.ru`), the Unsplash img proxy, and Next's inline runtime (`'unsafe-inline'`). **To enforce:** rename the header `Content-Security-Policy-Report-Only` → `Content-Security-Policy` and tighten `script-src` (drop `'unsafe-inline'` via nonce/hash) — but first confirm zero real violations in browser consoles (no report collector is wired yet; add a `report-uri`/`report-to` endpoint if you want central telemetry). Verify: `curl -skI https://<domain>/ | grep -i 'content-security\|x-frame\|x-powered'`.

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

### Vendoring gotchas (learned the hard way)
- **Unzip aborts on Cyrillic prototype filenames.** The export zip's `reference/prototypes/*.html` have Cyrillic names that make macOS `unzip` bail (`"disk full?"` / Bad file descriptor) *before* `src/` extracts. Always: `unzip -o -x "*/reference/prototypes/*" <zip> -d <dir>`. The prototypes aren't needed for vendoring.
- **`tsup clean:true` wipes `dist/canon.css` + `dist/favicon/` on every build.** The build emits per-entry css, NOT the concatenated `dist/canon.css` that `web/` imports (`@rebloom/canon/canon.css`), nor the favicon. After `npm run build`, **re-copy both from the export's `dist/`** or the web build breaks. (Do it *after* build, every time.)
- **Keep the local build-config fixes — the design export resets them.** Each delivery has shipped: `tsup.config.ts` missing the `outExtension` (→ emits `.js` under `"type":"module"`, breaking the `.mjs` exports map) and `package.json` `exports.require` set to `.js` instead of `.cjs`. Re-apply: `outExtension({format}) => ({js: format==='esm'?'.mjs':'.cjs'})` and `require → ./dist/X.cjs`. Verify nothing breaks: `node -e "require('@rebloom/canon/...')"`-style import + `npm run build` in `web/`.
- **Verify the install with markers, not the version label** (§7.1): `grep -q PdLanding node_modules/@rebloom/canon/dist/<entry>.mjs`.
- **The canon docs that ship in the package** (`AUTH_HANDOFF.md`, `CLAUDE_CODE_HANDOFF.md`, …) are the wiring spec for `web/` — copy them into `packages/canon/` so a future session sees them.
- **The home landing is HAND-ROLLED in `web/components/marketing/LandingHome.tsx`, NOT a canon `PdLanding` import.** It borrows canon's `.pdl-*` CSS (via the imported `canon.css`) but the JSX is web's own. Consequence for any canon **landing** patch (`src/marketing/landing.jsx`): the **CSS half propagates automatically** on re-vendor (it's the same `.pdl-*` classes), but **JSX changes do NOT** — you must hand-port them into `LandingHome.tsx` (e.g. 0.6.1: remove «Рядом с домом» chips, add the `.pdl-nav-city` header button + mobile `.pdl-nav-burger`). Don't assume "vendored canon → landing updated". Conversely, web's landing root is `pd-root pd-web pdl` and relies on the **`@container pdl (min-width:900px)`** path for desktop (it never sets `.pdl--desk`); when a patch changes nav-element visibility, confirm the desktop rule lives in the container block, not only under `.pdl--desk`, or the element vanishes on the live page. (The canon SEO pages — `PdGeoPage`/`PdSafeDeal`/`PdBlog*` — ARE imported directly, so those propagate fully.)
  - **Corollary (bit us through 0.6.0→0.6.2):** because the landing is hand-ported, a canon hero rework can sit in `landing.jsx` for *multiple* versions while prod still renders the OLD hero — the `LandingHome.tsx` copy was authored from the handoff's **meta-contract table (§8.3)**, which lagged the component. So on any landing patch, **diff every hero field (eyebrow / H1 / lede / photo / pricetag / live-count) against the canon `CLAUDE_CODE_HANDOFF.md` “READ FIRST” checklist**, field by field — don't trust "the component was updated". 0.6.2 synced them: H1 «…напрямую от людей…», static `public/hero-lacybird.png` (the live-feed image rendered an empty card pre-launch), pricetag «17 200 ₽ → от 4 500 ₽ / −74%», «128 букетов рядом». Also: the desktop **city popover** is web-owned (`components/marketing/NavCity.tsx`) — canon ships `NavCity`/`CityMenu` only as a *reference* (its own `Nav()` still renders the static button) + the `.pdl-citymenu` CSS; web wires the real `GEO_CITIES` + router.
  - **0.7.0 mobile burger drawer — two traps.** (1) **Containment:** canon's `.pdl-drawer` is `position:absolute` and contains itself to a *fixed-height device frame*; its closed panel parks off-screen-right (`translateX(100%)`). Web's landing is a *scrolling document* and `.pdl` has `container-type:inline-size` (a containing block for **both** `absolute` AND `fixed`), so an in-`.pdl` drawer anchors to the full-height document → panel footer off-screen, and the off-screen panel (even `visibility:hidden`) extends `scrollWidth` → horizontal-overflow-guard failures everywhere. Fix used in `components/marketing/MobileMenu.tsx`: **portal to `<body>` + `position:fixed`** (escapes the container) + a web override `.pdl-drawer{overflow:hidden}` in `globals.css` (clips the parked panel). (2) **SEO shells import the broken drawer:** `PdGeoPage`/`PdSafeDeal`/`PdBlog*` are imported *wholesale* (`CanonMarketing.tsx`) and their 0.7.0 nav renders canon `PdMobileMenu`, whose guest links are hard-coded `.html` preview paths (no route prop) → 404 on web. Hidden via `globals.css` `.pds/.pdc .pdl-nav-burger{display:none}` until canon exposes link props. Web's own landing burger (under `.pdl`) is unaffected. Also: canon 0.7.0's final-CTA copy added «комиссия сервиса 5%» — **NOT ported** (contradicts ADR-0013 «площадка денег не касается»); flag for a canon copy fix.

---

## 8. City rollout

- New city = feature flag + `city-rollout.md`: seed city row, enable flag, run a perf smoke (feed p95), then flip flag for users in that city. Geo is scoped by `city_id` from day one.


## 9. Peak season runbook (8 марта / 14 февраля)
Before: scale `api`/workers up, bump managed PG/Redis tier, enable read-replica, warm CDN, run load test (TESTING §5), raise anti-scam thresholds (SECURITY). During: watch SLO/online, moderation & dispute queues, payout anomalies. After: scale down, fraud post-mortem.


## 10. Security hardening — landed & open (pre-launch checklist)

> Pre-launch PII/ФЗ-152 hardening from the 2026-06 leak-readiness audit. Durable here so a
> fresh session doesn't redo landed work and knows what's still owner-blocked. Cross-ref:
> `SECURITY.md`, `docs/runbooks/data-breach.md`, `docs/runbooks/backup-restore.md`.

### Landed (in code + on prod)
- **Admin IP-allowlist wired** (`api/deps.py::require_admin`) — `ADMIN_IP_ALLOWLIST` (comma-sep, leftmost `X-Forwarded-For` behind Caddy) is now *enforced*; empty = allow any (current prod). Was previously inert config-drift. On top of session + TOTP 2FA + RBAC.
- **OTP-reveal prod hard-guard** — on `APP_ENV=prod`, `SMS_REVEAL_OTP=true` ALONE no longer reveals; it also needs `SMS_REVEAL_OTP_ALLOW_PROD=true`. A loud WARNING logs while reveal is active. (`config.py::otp_reveal_active`.)
- **`totp_secret` AES-256-GCM at rest** (admin 2FA seed; ADR-0012) — encrypt-on-write / graceful decrypt-on-read (legacy plaintext falls back, not raises). Migration `0021_totp_secret_widen` (64→256) applied on prod.
- **SSH hardened on the box** — `fail2ban` active (sshd jail, ignoreip = admin IP), `PasswordAuthentication no` + `KbdInteractiveAuthentication no` (key-only; root already `without-password`). Old config backed up at `/root/sshd_config.bak.*`.
- **Dev/CI compose ports bound to `127.0.0.1`** (`docker-compose.yml`: db/replica/redis/api) — Docker-DNAT no longer bypasses the host firewall. Prod (`docker-compose.prod.yml`) already has no host ports.
- **Backup automation authored** — `infra/systemd/rebloom-backup.{service,timer}` (daily) + `infra/scripts/restore.sh` (refuses the live DB without an explicit flag) + `docs/runbooks/backup-restore.md`. **Installed-but-inert until creds (see below).**
- **Breach runbook** — `docs/runbooks/data-breach.md` (РКН 24h/72h, containment, key rotation, restore).

### ⚠️ Testing-only states LIVE on prod — REVERT before real users
- **`SMS_REVEAL_OTP=true` + `SMS_REVEAL_OTP_ALLOW_PROD=true`** in `/opt/rebloom/.env` → OTP codes are printed to the api log (so owner can test login without a real SMS provider). Remove BOTH at launch.
- **Demo seed** (test sellers / bouquets / reviews, `backend/scripts/seed_demo.py` + `seed_reviews.py`) is loaded on prod. Wipe before launch. The demo listings are also **backfilled with metro station + flower types** via `backend/scripts/backfill_demo_metro.py` (idempotent; only touches `metro_station_id IS NULL`) so canon 0.9.0's metro/flower features show data — wiped with the rest of the demo seed.

### Open — needs the owner (NOT autonomously doable)
- **Off-box backup creds** — `rclone` remote on a *different* region/provider + `BACKUP_REMOTE` / `BACKUP_ENC_KEY` (+ opt. `BACKUP_KEEP_DAYS`) in `/opt/rebloom/.env`. Until set, the timer runs but `backup.sh` exits non-zero ⇒ **NO working backups yet**. `BACKUP_ENC_KEY` must be stored OFF the box (password manager). Then: enable the timer (`systemctl enable --now rebloom-backup.timer`) + run the restore drill (`backup-restore.md §3`).
- **`PermitRootLogin no` + a non-root `deploy` user** — deferred (lockout risk; root is currently key-only + fail2ban'd). When done, flip the backup unit `User=root` → `deploy` (in the `docker` group).
- **Real SMS provider creds** — OTP is console-revealed until then.
- **Disk-at-rest encryption** — LUKS, or move Postgres to managed (provider + downtime). Single-box ext4 is currently unencrypted at rest.

### Deferred to scale-out (accepted single-box risk)
- **Redis auth (`requirepass`)** + **Postgres TLS** — Redis/PG are internal-only on the single box (not internet-exposed; dev ports now localhost-bound). Revisit when they move to managed/multi-host (OPERATIONS §1 scale-out).
