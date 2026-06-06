# PLAYBOOK — Deploy & operations (single-box Docker Compose → managed scale-out)

> **Why this exists.** A reusable, project-agnostic deploy/ops guide for the stack family:
> Next.js (App Router) web + a FastAPI/SQLAlchemy backend + Postgres + Redis, all in one
> Docker Compose behind Caddy on a single VPS, with a **config-only** path to managed
> scale-out. Every line below is a gotcha that cost someone real time — generalize the
> framing, keep the substance.
>
> **When to read.** Before any deploy, CI change, migration, Caddy/infra edit, or
> build-time-env change. Skim §1–§3 once; come back to §4 (verify) and §10 (recipe) every deploy.

Conventions in this doc: `<project>` = your repo/compose project name · `<DOMAIN>` = public
domain · `<region>` = hosting region · `$C` = the compose invocation (defined per-§). Replace
the bracketed placeholders with your real values.

---

## 1. Topology — start single-box, scale by config

**MVP = ONE VPS, ONE compose file.** Everything (edge + app + scheduler + db + redis) on one
box; uploaded media on a local volume served by the edge proxy. You trade HA for
simplicity/cost (fine for a 99.5% SLO). The managed-services topology is the **scale-out
target** (§9), reachable by pointing env vars at managed endpoints — no `core/**` rewrite,
because external effects sit behind ports/adapters.

| Thing | Single-box value |
|---|---|
| Public domain | `<DOMAIN>` (DNS `A <DOMAIN> → <vps-ip>` must resolve before first request — edge needs it for auto-TLS) |
| App box (SSH) | `ssh deploy@<vps-ip>` (set up an `~/.ssh/config` alias) |
| Repo on box | `/opt/<project>` (deploy = `git pull` + compose there) |
| Compose invocation | `docker compose --env-file .env -f infra/docker-compose.prod.yml` |
| Services | `caddy`, `api`, `scheduler`, `db` (Postgres), `redis` — all on ONE box |
| Postgres / Redis | in-compose (single box); **off-box encrypted backups mandatory** (§7) |
| Media | local volume, served by the edge at `/media` (object-storage + CDN is the scale-out step) |
| Build stamp | `GET /version` → `{git_sha, built_at}` |

- **Provision sizing rule of thumb:** 4 vCPU / 8 GB / 100+ GB NVMe handles a small launch.
  Budget RAM: Postgres ~25% (`shared_buffers`), leave ~50% for OS page cache
  (`effective_cache_size`), the rest for the app + image/encode work.
- **Firewall:** allow only 22 (SSH, key-only + your IP ideally), 80, 443. **Nothing else** —
  db/redis/api are internal to the compose network and must have **no host port**.
- **Secrets live ONLY in `/opt/<project>/.env`** on the box (0600, owned by `deploy`) or a
  secret store — never in git. Commit `.env.example`; `.gitignore` the real `.env`.
- **Unrecoverable secrets** (PII column-encryption key, backup-encryption key, mobile signing
  keystore): losing one is permanent data loss. Keep an **off-box** copy (password manager).

### The Docker DNAT firewall trap (bites in dev, and on any box with a published port)
A bare `"5432:5432"` publishes on `0.0.0.0`, and Docker installs its own **DNAT iptables
rules that bypass a host firewall (UFW)** — the port is internet-reachable even with UFW
"deny". Always bind dev ports to localhost: `"127.0.0.1:5432:5432"`. Prod uses a compose file
with **no host ports** on data services at all.

---

## 2. Single-box compose discipline (the hard rules)

The deploy is `git pull` + rebuild **only the changed service** + one-shot migrate + `up`. The
rules below exist because the obvious shortcuts each broke a prod deploy.

- **Build ONLY the changed service** — `$C build api` (or `web`), never the whole stack.
- **NEVER `docker compose build --pull` the whole stack.** `--pull` re-fetches every base
  image (slow, and can pull a newer base that breaks the build); base images are already
  cached on the box. Build the one changed service, without `--pull`.
- **`--no-deps`** so recreating one service doesn't bounce its dependencies (don't restart the
  db/redis/edge to ship an app change): `$C up -d --no-deps api`.
- **`--force-recreate` when only the image changed** — compose skips recreation if the service
  *definition* is unchanged, so a freshly-built image won't actually start without it:
  `$C up -d --no-deps --force-recreate api`.
- **One compose file in prod.** The single-box invocation is `-f infra/docker-compose.prod.yml`
  (one `-f`). A multi-`-f` override stack is the scale-out topology, not the MVP.
- **No `migrate` service on boot.** Migrations are a one-shot you run by hand (§3), gated behind
  a compose `profile` so a plain `up` never runs them.

### The framework build EXCEEDS the SSH command timeout → background, poll, then `up` SEPARATELY
A Next.js production build routinely runs longer than the agent/SSH command timeout (~300s). A
`build && up` one-liner is **fragile**: if the SSH session buffers or drops mid-build, you lose
the `&& up` and the new image is built but never started. Proven recipe — background the build,
**poll a log marker**, then run `up` as its own command:

```bash
SHA=$(git rev-parse --short HEAD); TS=$(date -u +%Y-%m-%dT%H:%M:%SZ)
nohup $C build --build-arg BUILD_VERSION=$SHA --build-arg BUILD_TIME=$TS web \
  > /tmp/web-build.log 2>&1 &
until grep -q "Built\|Successfully" /tmp/web-build.log; do sleep 5; done   # poll
$C up -d --no-deps --force-recreate web caddy                              # SEPARATE command
```

(Backend builds are faster but follow the same shape; only the framework/web build reliably
trips the timeout.)

---

## 3. DB migrations — ONE-SHOT, never on boot, expand/contract only

- **One-shot, not on app start.** Running migrations in the app entrypoint races multiple
  replicas and couples a restart to a schema change. Run them explicitly, once, per deploy.
- **Expand/contract (additive) only.** New migration must be backward-compatible with the
  *currently running* (old) app code, because you migrate **after build, before `up`** — for a
  window both schemas coexist. Add columns/tables now; drop the old ones in a *later* deploy
  after all code stops using them. A code rollback then never needs a schema rollback.
- **Order: build → migrate → up.**

```bash
$C build api                                   # build new image first
$C --profile migrate run --rm migrate          # or: $C run --rm --no-deps api alembic upgrade head
$C run --rm --no-deps api alembic current      # sanity: confirm it reached head
$C up -d --no-deps --force-recreate api scheduler
```

- Use a **least-privilege migrator role** (separate DB user with DDL rights) distinct from the
  app's runtime role, wired via its own env URL (`DB_MIGRATOR_URL`).
- **`run --rm`** (the migrate container is ephemeral); `depends_on: db healthy` so it never
  fires before Postgres is accepting connections.

---

## 4. The `/version` build stamp — pass build-args on EVERY service build

The backend exposes `GET /version → {git_sha, built_at}`, populated from build-args baked into
the image (`ARG BUILD_VERSION` / `ARG BUILD_TIME` → `ENV`). This is your only reliable answer to
"what commit is live?".

- **You MUST pass `--build-arg BUILD_VERSION=$SHA --build-arg BUILD_TIME=$TS` on EVERY image
  build** (api AND web). Miss it on one and that service's stamp silently reverts to the
  Dockerfile default (`git_sha:"dev"`, `built_at:"unknown"`) — and you can no longer confirm
  which commit is running. (Real failure: the web recipe passed the args, the api one-shot
  didn't, so prod `/version` read `dev/unknown` for months.)

```bash
SHA=$(git rev-parse --short HEAD); TS=$(date -u +%Y-%m-%dT%H:%M:%SZ)
$C build --build-arg BUILD_VERSION=$SHA --build-arg BUILD_TIME=$TS api   # and the same for web
```

- **`/version` reports the API build, not the web build.** A web-only deploy leaves `git_sha`
  on the API commit. Verify web by the image-created timestamp
  (`docker image inspect <project>-web:latest --format '{{.Created}}'`) and/or by grepping a
  marker in the served bundle — not `/version`.

---

## 5. Verify a deploy (the ritual)

- **`curl -sk https://<DOMAIN>/version`** → `git_sha` matches the merged commit (API deploys).
- **`/healthz` vs `/readyz` — distinct semantics, don't conflate:**
  - `/healthz` = **liveness**: 200 as long as the process can serve. Use for the container
    healthcheck / "restart it if this fails".
  - `/readyz` = **readiness**: 200 only when **dependencies are reachable** (DB + Redis +
    storage + providers); returns **503** if any dependency is down. Use for "is it safe to send
    traffic / did this deploy come up healthy". A box can be *alive* but *not ready* (db still
    starting) — that distinction is the whole point.
- **`$C ps`** → every service `healthy`/`running`.
- Health checks in compose: `pg_isready` for Postgres, `redis-cli ping` for Redis,
  `curl -fsS .../healthz` for the app, with generous `retries` so a slow first boot doesn't
  flap. App services `depends_on: {db: service_healthy, redis: service_healthy}`.

---

## 6. Edge proxy (Caddy) — auto-TLS, routing, the bind-mount inode trap

Single global edge config: auto-TLS for `<DOMAIN>`, route `/media/*` → media volume,
`/api/* + health/build routes` → api (WebSocket upgrades proxy transparently), everything else
→ web. Security headers live in **one global `header {}` block** so they apply uniformly.

### The single-file bind-mount inode trap (THE Caddy gotcha)
The Caddyfile is mounted as a **single file** (`./Caddyfile:/etc/caddy/Caddyfile`). `git pull`
**replaces the file via rename → new inode**, but the running container still holds the **old
inode**, so `caddy reload` re-reads the **stale** file. After any Caddyfile change you must
**`$C up -d --no-deps --force-recreate caddy`** (re-binds the current inode) — a `reload` alone
silently keeps serving the old config. (Bitten tuning a cache header.) A reload is only safe
when the file inode is unchanged (e.g. you edited in place without a rename).

```bash
# Caddyfile changed → recreate, don't just reload:
$C up -d --no-deps --force-recreate caddy
# (only if you edited in place / inode unchanged:)
$C exec -T caddy caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile
```

### Security headers at the edge (set once, globally)
HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`,
`X-Frame-Options: SAMEORIGIN`, strip `-Server`/`-X-Powered-By`. Ship **CSP as
`Content-Security-Policy-Report-Only` first** (logs violations, blocks nothing) so you can
confirm the allowlist (analytics, image proxy, the framework's inline runtime) with zero
breakage; flip to enforcing `Content-Security-Policy` (and drop `'unsafe-inline'` via
nonce/hash) only after browser consoles show zero real violations.
Verify: `curl -skI https://<DOMAIN>/ | grep -i 'content-security\|x-frame\|x-powered'`.

### Media cache header
Serve uploaded media `immutable` with a long `max-age` + `nosniff` + `Content-Disposition:
inline`, straight from the read-only volume — until you move media to object storage + CDN (§9).

---

## 7. Backups (single-box = money/data lives here → mandatory & tested)

On a single box the DB *is* your only copy. **Off-box encrypted backups are mandatory and an
untested backup is not a backup.**

- **Job:** `pg_dump` (inside the `db` container) → `gzip` → `openssl aes-256` → `rclone copy`
  to an **off-box remote on a DIFFERENT provider/region** → prune older than `BACKUP_KEEP_DAYS`.
  A backup on the same box/provider as the data is not a backup.
- **Schedule via a systemd timer**, not host cron: `OnCalendar=daily` + **`Persistent=true`**
  so a backup that was missed during downtime **fires once on next boot** instead of silently
  skipping; `RandomizedDelaySec` spreads it off the exact tick. The unit's `User` must be in the
  `docker` group and `Requires=docker.service`.
- **rclone creds** live in the deploy user's `~/.config/rclone/rclone.conf` (off-git); use a
  dedicated least-privilege object-storage key scoped to the backup bucket only.
- **Restore-VERIFICATION drill (quarterly, non-negotiable):** restore the latest artifact into a
  **throwaway** DB (never live) and **compare row counts** of core/financial tables vs prod — a
  restore that loads but is missing data is a silent failure. Make the restore script *refuse*
  to target the live DB without an explicit `--i-understand-this-overwrites-prod` override.
- **Media files are NOT in the DB dump** — either add a separate off-box `rclone sync` of the
  media volume, or consciously accept re-upload-on-loss for MVP.
- **Legally-retained financial data** (ledger) — never purge backups holding it without sign-off.

---

## 8. Build-time env vars & the prod-deps trap (two ways a deploy looks fine but isn't)

### Public/build-time vars are baked at `build`, not read at runtime
Framework `NEXT_PUBLIC_*` vars (analytics counter ids, feature flags, public keys) are **inlined
into the client bundle at `next build`** — setting them in the runtime env does nothing. Wire
them as a compose `build-arg` substituted from `.env`
(`NEXT_PUBLIC_X: ${NEXT_PUBLIC_X:-}` → Dockerfile `ARG`/`ENV`). Empty default → the feature
stays inert (dev/CI builds emit nothing). To activate: set it in the box `.env` + **rebuild
web**; every later web rebuild then auto-bakes it.
- **Verify by grepping the SERVED BUNDLE, not the SSR HTML.** Client-injected scripts
  (`afterInteractive`) are **not** in the server-rendered HTML:
  `curl -s https://<DOMAIN>/_next/static/chunks/app/layout-*.js | grep <id>`.

### The prod image installs MAIN deps only → a dev-only import crash-loops the service
The backend image installs **main dependencies only** (`poetry install --only main` /
`npm ci --omit=dev`). So a new **top-level `import` of a dev-only dependency** in app code
crash-loops the container at startup with `ModuleNotFoundError` (classic: `import httpx`, which
is a test-only dep used by the test client). Options:
- Use the **stdlib** for runtime needs (e.g. `urllib` instead of `httpx` for a one-off HTTP call), or
- **Promote the library to a main dependency** via an explicit dependency decision (ADR).
- **Catch it before deploy:** grep your touched files' new top-level imports against the
  main-dependency list; don't trust a local run where dev deps are present.

---

## 9. Scale-out ladder (each step is env-only, no `core/**` rewrite)

The ports/adapters design means you grow by re-pointing env vars and swapping an adapter, not
refactoring. Do them in this order (most-critical first):

1. **Postgres → managed (HA + PITR).** Most important — the financial/ledger data wants
   point-in-time recovery. Point `DATABASE_URL` at the managed primary; set
   `DATABASE_REPLICA_URL` to the read-replica so feed/search reads move off the writer
   automatically. Stop the in-compose `db` service.
2. **Redis → managed.** Point `REDIS_URL`; stop the in-compose `redis`.
3. **API replicas.** Run `api` ×N behind the edge (`reverse_proxy` to multiple upstreams).
   Sessions are server-side in Redis, so any replica serves any request.
4. **Media → object storage + CDN.** Implement the `S3Storage` adapter behind the existing
   `ObjectStorage` port (`S3_*` env already scaffolded); swap the wiring. The edge stops serving
   `/media`.
5. **Move the scheduler** to a managed cron / queue-scheduler — the job functions are unchanged.

Vertical-scale first for a known peak (resize the VPS up before the event, revert after); if one
box can't take the peak, that's your trigger to start the ladder.

---

## 10. CI gotchas (the ones that land red on main)

- **`main` may have NO required-status-check protection → `gh pr merge` merges even with a RED
  check.** ALWAYS confirm `gh pr checks <N>` is **all-green BEFORE merging** — a red
  `tsc`/`build`/format check will otherwise land on main and break the trunk for everyone.
  (Bitten once: a bad config merged red and broke main.)
- **Format-check is a SEPARATE gate from lint.** `ruff format --check` (or `prettier --check`)
  fails independently of `ruff check` / `eslint`. Run the formatter on **every** touched file
  (hand-written migrations especially), not just the linter.
- **SAST tool versions differ local ↔ CI.** CI often pins a newer scanner (e.g. bandit) that
  flags things your local version misses. Suppress real false-positives with the **tool's own**
  inline directive (`# nosec <CODE>` for bandit) — a different tool's `# noqa` does nothing for
  it. Don't trust a local SAST pass alone; read the CI scanner's output.
- **Linters cache per-file → local can pass while CI fails.** Rules that depend on the *project
  graph* (e.g. "no raw `<a>` to internal pages" after you add a route) won't re-fire on a warm
  cache locally, but CI runs cache-cold and flags them. Reproduce with a cold cache
  (`rm -rf .next/cache/eslint && npm run lint`) before pushing.
- **Visual/pixel baselines are OS-specific** — generate them on the CI OS (Linux), never commit
  macOS-rendered screenshots (font rendering differs → false diffs). Use a dedicated
  `--update-snapshots` workflow; note that a bot-token push often **doesn't** re-trigger CI
  (anti-recursion) → push an empty commit to run the diff verification.
- **`git pull --ff-only origin main`** on the box, and **squash-merge** PRs, to keep the trunk
  linear and each deploy = one commit.

---

## 11. Logs & ops basics

- `$C logs -f api` / `scheduler` / `caddy`. App logs are **structured JSON** with a
  `request_id`; **PII is masked at the log formatter** (not at call sites) so phones/emails/
  addresses never hit the log store.
- A `scheduler` service runs periodic jobs in-process (notifications, reservation/timeout
  sweeps, retention, etc.) — keep it as its own one-replica service so jobs don't double-fire
  across API replicas.
- **Money/critical paths fail-secure:** on any provider/payout error, hold state; never
  auto-resolve on a timeout or an ambiguous provider response. Process provider webhooks
  idempotently (verify signature + re-fetch status before any state change).

---

## 12. Runnable deploy recipe (skeleton — adapt the service names)

```bash
# ── 0. SSH in, pull main ────────────────────────────────────────────────
ssh deploy@<vps-ip>
cd /opt/<project> && git pull --ff-only origin main
C="docker compose --env-file .env -f infra/docker-compose.prod.yml"
SHA=$(git rev-parse --short HEAD); TS=$(date -u +%Y-%m-%dT%H:%M:%SZ)

# ── 1a. BACKEND change ──────────────────────────────────────────────────
$C build --build-arg BUILD_VERSION=$SHA --build-arg BUILD_TIME=$TS api scheduler  # build first, with stamp args
$C --profile migrate run --rm migrate                                             # one-shot, expand/contract, BEFORE up
$C run --rm --no-deps api alembic current                                         # sanity: reached head
$C up -d --no-deps --force-recreate api scheduler                                 # recreate app only; leave db/redis/edge

# ── 1b. WEB change (build EXCEEDS SSH timeout → background + poll + up SEPARATELY) ──
nohup $C build --build-arg BUILD_VERSION=$SHA --build-arg BUILD_TIME=$TS web \
  > /tmp/web-build.log 2>&1 &
until grep -q "Built\|Successfully" /tmp/web-build.log; do sleep 5; done
$C up -d --no-deps --force-recreate web caddy

# ── 1c. CADDYFILE change (inode trap → force-recreate, NOT reload) ──────
$C up -d --no-deps --force-recreate caddy

# ── 2. VERIFY ───────────────────────────────────────────────────────────
curl -sk https://<DOMAIN>/version    # git_sha matches $SHA (API deploys)
curl -sk https://<DOMAIN>/readyz     # 200 = deps reachable (DB+Redis); 503 = not ready
$C ps                                # all services healthy/running
# web-only deploy → verify by image timestamp, not /version:
docker image inspect <project>-web:latest --format '{{.Created}}'
```

**Pre-flight checklist:** `gh pr checks <N>` all-green before merge · build-stamp args on every
build · migration is additive (safe vs the old running code) · new top-level imports are main
deps (not dev-only) · build-time `PUBLIC_*` vars set in `.env` if changed · Caddyfile change →
force-recreate, not reload.
