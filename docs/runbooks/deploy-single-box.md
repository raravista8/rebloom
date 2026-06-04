# RUNBOOK — single-box MVP deploy (one VPS)

> Simplified launch: the **whole stack on one VPS** — Caddy + api + scheduler +
> Postgres + Redis in one Docker Compose, photos on a local volume. Trades HA for
> simplicity/cost (accepted for MVP, SLO 99.5%). **Money lives on this box**, so
> off-box encrypted backups are mandatory. Scale-out is config-only later (§8).
>
> This supersedes the managed-PG/Redis topology in OPERATIONS §1 for the MVP
> phase; switch back by pointing `DATABASE_URL`/`REDIS_URL` at managed services.

## 1. Provision

- **VPS:** Selectel cloud server, RF region (ФЗ-152). **4 vCPU / 8 GB / 100+ GB NVMe**. Ubuntu 24.04.
  - Rough split: Postgres ~1–2 GB, Redis ~0.5 GB, api+scheduler ~2–3 GB, headroom for Pillow image-encoding + page cache.
- **DNS:** `A peredarim.ru → <vps-ip>` (Caddy needs it resolvable for auto-TLS).
- **Host packages:** `docker`, `docker compose`, `rclone` (for off-box backups), `openssl` (preinstalled).
- **Firewall:** allow 22 (SSH, ideally key-only + your IP), 80, 443. Nothing else — db/redis/api are internal to the compose network.

```bash
ssh deploy@<vps-ip>
sudo mkdir -p /opt/rebloom && sudo chown "$USER" /opt/rebloom
git clone https://github.com/raravista8/rebloom /opt/rebloom && cd /opt/rebloom
```

## 2. Secrets (`/opt/rebloom/.env`)

Copy `.env.example` → `.env` and fill (NEVER commit). Minimum for launch:

```bash
cp .env.example .env
# generate the two crypto secrets:
python3 -c "import os,base64;print('PII_ENC_KEY='+base64.b64encode(os.urandom(32)).decode())"
openssl rand -base64 32   # → POSTGRES_PASSWORD
openssl rand -base64 48   # → BACKUP_ENC_KEY  (store a copy in your password manager!)
```

Required: `PUBLIC_DOMAIN`, `POSTGRES_PASSWORD`, `PII_ENC_KEY`, `APP_SECRET_KEY`, `YOOKASSA_*`, `SMS_*`, `BACKUP_ENC_KEY`, `BACKUP_REMOTE`. `APP_ENV=prod`. The initdb script creates `rebloom_migrator`; on the single box it shares `POSTGRES_PASSWORD`.

> `PII_ENC_KEY` and `BACKUP_ENC_KEY` losing either is unrecoverable (encrypted addresses / all backups). Back them up **off** the server (password manager), like the Android keystore.

## 3. First boot

```bash
C="docker compose --env-file .env -f infra/docker-compose.prod.yml"
SHA=$(git rev-parse --short HEAD); TS=$(date -u +%Y-%m-%dT%H:%M:%SZ)
BUILD_VERSION=$SHA BUILD_TIME=$TS $C build api scheduler
$C up -d db redis                       # bring data services up first
$C --profile migrate run --rm migrate   # alembic upgrade head (Hard Rule: not on app boot)
BUILD_VERSION=$SHA BUILD_TIME=$TS $C up -d api scheduler caddy
```

Caddy provisions TLS on first request to `https://$PUBLIC_DOMAIN`.

### Verify
- `curl -sk https://$PUBLIC_DOMAIN/version` → `git_sha` matches `$SHA`.
- `curl -sk https://$PUBLIC_DOMAIN/readyz` → 200 (DB + Redis reachable).
- `$C ps` → all services `healthy`/`running`.

## 4. Backups (MANDATORY — money is here)

Set up `rclone` once (`rclone config` → an off-box target on a **different** provider/region, e.g. `selectel:rebloom-backups`). Then host cron:

```cron
# /etc/cron.d/rebloom-backup  — every 6h
0 */6 * * * deploy cd /opt/rebloom && bash infra/scripts/backup.sh >> /var/log/rebloom-backup.log 2>&1
```

`backup.sh` = `pg_dump | gzip | openssl aes-256 | rclone copy` + prune older than `BACKUP_KEEP_DAYS`. Photos live in the `photos` volume — add it to the same off-box sync if you want them durable (`rclone sync /var/lib/docker/volumes/rebloom_photos/_data selectel:rebloom-photos`), or accept re-upload-on-loss for MVP.

**Restore drill (quarterly, non-negotiable):** on a scratch box, `bash infra/scripts/restore.sh` then check the ledger reconciles (OPERATIONS §5) before trusting it. An untested backup is not a backup.

## 5. Deploy an update

```bash
cd /opt/rebloom && git pull --ff-only origin main
C="docker compose --env-file .env -f infra/docker-compose.prod.yml"
SHA=$(git rev-parse --short HEAD); TS=$(date -u +%Y-%m-%dT%H:%M:%SZ)
BUILD_VERSION=$SHA BUILD_TIME=$TS $C build api scheduler
$C --profile migrate run --rm migrate         # expand/contract migrations only
$C up -d --no-deps api scheduler              # recreate app, leave db/redis/caddy
$C exec -T caddy caddy reload --config /etc/caddy/Caddyfile  # only if Caddyfile changed
```

Migrations are expand/contract (additive) so a code rollback never needs a schema rollback.

## 6. Logs & ops

- `$C logs -f api` / `scheduler` / `caddy` (structured JSON; PII masked at the formatter, T-07).
- Scheduler runs the periodic jobs in-process (notifications 60s, reservations 300s, fraud 1h, retention 24h) — `app/workers/scheduler.py`.
- Money fail-secure, webhook idempotency, daily ledger reconciliation — unchanged (OPERATIONS §4–5).

## 7. Peak season (8 марта / 14 февраля)

Single box → vertical scale: resize the VPS to **8 vCPU / 16 GB** before the peak (Selectel resize = reboot), raise anti-scam thresholds (SECURITY), warm nothing (no CDN yet). Revert after. If one box can't take the peak, that's the trigger for §8.

## 8. Scale-out path (when load/users grow — config-only, no rewrite)

The ports/adapters design means each step is an env change, not a refactor:
1. **Postgres → managed** (most critical: HA + PITR for the ledger). Point `DATABASE_URL` at the managed primary; set `DATABASE_REPLICA_URL` to the read-replica → feed/search reads move off the writer automatically. Stop the `db` service.
2. **Redis → managed.** Point `REDIS_URL`; stop the `redis` service.
3. **api replicas.** Run `api` ×N behind Caddy (`reverse_proxy` to multiple upstreams); sessions are already server-side in Redis, so any replica serves any request.
4. **Photos → S3 + CDN.** Write an `S3Storage` adapter behind the existing `ObjectStorage` port (`S3_*` env already scaffolded); swap the wiring. Caddy stops serving `/media`.
5. **Move the scheduler** to RQ-scheduler / a managed cron — the job functions are unchanged.

Nothing in `core/**` changes at any step.
