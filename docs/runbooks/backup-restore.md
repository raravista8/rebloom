# RUNBOOK — off-box backups & restore drill · Передарим (`rebloom`)

> Money lives on the single box (escrow ledger, PII), so **off-box encrypted
> backups are mandatory** and **an untested backup is not a backup**. This runbook
> is the source of truth for: installing the scheduled backup (systemd timer),
> what the owner must configure (the rclone remote), how to run a safe
> restore-VERIFICATION, and retention. Pairs with `infra/scripts/backup.sh`,
> `infra/scripts/restore.sh`, `infra/systemd/*`, and `deploy-single-box.md §4`.

---

## 0. What runs and where

| Piece | File | Role |
|---|---|---|
| Backup job | `infra/scripts/backup.sh` | `pg_dump` (in the `db` container) → `gzip -9` → `openssl aes-256-cbc` → `rclone copy` off-box → prune older than `BACKUP_KEEP_DAYS` |
| Schedule | `infra/systemd/rebloom-backup.{service,timer}` | runs `backup.sh` **daily**, `Persistent=true` (catch-up after downtime) |
| Restore (drill) | `infra/scripts/restore.sh` | pulls the latest off-box artifact → decrypts → restores into a **throwaway** DB (never live unless explicitly forced) |

Secrets (`BACKUP_ENC_KEY`, `BACKUP_REMOTE`, `BACKUP_KEEP_DAYS`) live only in
`/opt/rebloom/.env` (0600, owned by `deploy`) — **never in git**. Both scripts
source `.env` themselves.

> ⚠️ **`BACKUP_ENC_KEY` is unrecoverable if lost** — every backup is encrypted
> with it. Keep a copy **off the server** (password manager), like the Android
> keystore (`deploy-single-box.md §2`).

---

## 1. One-time: configure the off-box rclone remote (OWNER must do this)

The backup is worthless if it lives on the same box/provider as the data. Set up
an rclone remote on a **different provider and/or region** from the VPS:

```bash
# on the VPS, as the deploy user
rclone config        # interactive: create a remote, e.g. name it "selectel"
                     # → S3-compatible object storage in a DIFFERENT region/provider
rclone lsd selectel: # sanity: the remote is reachable
rclone mkdir selectel:rebloom-backups
```

Then put the coordinates in `/opt/rebloom/.env`:

```bash
BACKUP_ENC_KEY=<openssl rand -base64 48>     # store a copy in your password manager!
BACKUP_REMOTE=selectel:rebloom-backups        # rclone target, DIFFERENT region/provider
BACKUP_KEEP_DAYS=14                            # remote retention (default 14 if unset)
```

`rclone`'s own credentials live in `~/.config/rclone/rclone.conf` (the deploy
user) — also off-git. Use a **dedicated, least-privilege** object-storage key
scoped to the backup bucket only.

**What the owner still must supply:** the rclone remote + its credentials
(a bucket on a different region/provider), and the `BACKUP_REMOTE` / `BACKUP_ENC_KEY`
values in `.env`. Until that exists, the timer will run but `backup.sh` exits
non-zero (`: "${BACKUP_REMOTE:?...}"`).

---

## 2. Install the scheduled backup (systemd timer)

The unit files are committed in `infra/systemd/`. They assume the repo at
`/opt/rebloom` and the `deploy` user (in the `docker` group). Install:

```bash
sudo cp /opt/rebloom/infra/systemd/rebloom-backup.service /etc/systemd/system/
sudo cp /opt/rebloom/infra/systemd/rebloom-backup.timer   /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now rebloom-backup.timer
```

Verify:

```bash
systemctl status rebloom-backup.timer
systemctl list-timers rebloom-backup.timer     # NEXT / LAST fire times
sudo systemctl start rebloom-backup.service     # fire one backup NOW (don't wait a day)
journalctl -u rebloom-backup.service -n 50      # read the run log
rclone lsf "$(grep -m1 ^BACKUP_REMOTE /opt/rebloom/.env | cut -d= -f2-)/"   # object landed off-box
```

- **Daily, with catch-up.** `OnCalendar=daily` + `Persistent=true`: if the VPS
  was down at the scheduled tick (reboot/maintenance), the backup fires once on
  next boot instead of silently skipping. `RandomizedDelaySec=15min` spreads it
  off the exact midnight tick.
- This **replaces** the host-cron line previously shown in `deploy-single-box.md §4`.
  If you migrated from cron, remove `/etc/cron.d/rebloom-backup` so they don't
  both run.

---

## 3. Restore-VERIFICATION drill (quarterly — non-negotiable)

`restore.sh` is built so a drill **cannot** clobber prod: `TARGET_DB` defaults to
the throwaway `rebloom_verify`, and the script **refuses** to target the live DB
(`POSTGRES_DB`, default `rebloom`) without an explicit override flag. Run a drill
on the box (or, better, a scratch box) like this:

```bash
cd /opt/rebloom
# Restore the LATEST off-box backup into the throwaway DB 'rebloom_verify'.
bash infra/scripts/restore.sh
#   → downloads latest, decrypts, DROP/CREATE rebloom_verify, loads. Asks "type 'yes'".
# Pin a specific artifact instead of latest:
bash infra/scripts/restore.sh rebloom_verify rebloom-20260604T120000Z.sql.gz.enc
```

### 3a. Compare row counts (verify) vs prod

A restore that loads but is missing data is a silent failure. Compare the
core tables in the restored `rebloom_verify` against the live `rebloom`:

```bash
C="docker compose --env-file .env -f infra/docker-compose.prod.yml"
PGU="$(grep -m1 ^POSTGRES_USER .env | cut -d= -f2- || true)"; PGU="${PGU:-rebloom_app}"
SQL="SELECT 'users' t, count(*) n FROM users
   UNION ALL SELECT 'listings', count(*) FROM listings
   UNION ALL SELECT 'deals', count(*) FROM deals
   UNION ALL SELECT 'ledger_entries', count(*) FROM ledger_entries
   ORDER BY 1;"
echo "== prod (rebloom) ==";          $C exec -T db psql -U "$PGU" -d rebloom        -c "$SQL"
echo "== restored (rebloom_verify) =="; $C exec -T db psql -U "$PGU" -d rebloom_verify -c "$SQL"
```

The two tables should match (allow a tiny delta from writes between the dump and
the comparison — the backup is a point-in-time snapshot, so the **restored**
counts equal prod **as of the dump timestamp**, ≤ current prod). If `ledger_entries`
is short or missing, the backup is bad — investigate before trusting it.

> `ledger_entries` is the money source of truth; it is the table whose integrity
> matters most. If the deal/ledger code isn't merged yet, that table may not
> exist — verify `users`/`listings` and add `deals`/`ledger_entries` to the drill
> once they ship.

### 3b. Drop the throwaway DB when done

```bash
C="docker compose --env-file .env -f infra/docker-compose.prod.yml"
$C exec -T db psql -U "$PGU" -d postgres -c "DROP DATABASE rebloom_verify WITH (FORCE);"
```

`restore.sh` prints this exact command at the end of a drill.

### 3c. Real disaster recovery (overwriting live — rare)

Only when the live DB is actually lost/corrupt and you are intentionally
restoring over it:

```bash
bash infra/scripts/restore.sh --i-understand-this-overwrites-prod rebloom
#   → extra confirmation: you must type the live DB name 'rebloom' to proceed.
```

After a live restore, **verify the ledger reconciles** (OPERATIONS §5) before
resuming any payouts.

---

## 4. Retention

- **Off-box (remote):** `backup.sh` prunes objects older than `BACKUP_KEEP_DAYS`
  (default 14) via `rclone delete --min-age`. Raise it for more history; storage
  is cheap, lost money isn't.
- **Local:** none — the encrypted dump is written to `/tmp`, uploaded, then
  `rm`'d; restore downloads to `/tmp` and `rm`'s after. Nothing persists on disk.
- **Photos** (the `photos` volume) are **not** in the DB dump. For MVP we accept
  re-upload-on-loss; to make them durable add the off-box sync from
  `deploy-single-box.md §4` (`rclone sync … selectel:rebloom-photos`).
- **Ledger/financial data** is retained by law (`PRIVACY_152FZ.md §3`) — never
  purge backups that hold it without legal sign-off.

---

## 5. Troubleshooting

- **Timer enabled but no backups appear off-box.** Check `journalctl -u
  rebloom-backup.service` — most often `BACKUP_REMOTE`/`BACKUP_ENC_KEY` unset in
  `.env`, or the rclone remote/creds aren't configured for the `deploy` user.
- **`docker compose ... exec db` fails in the unit.** The service `User=deploy`
  must be in the `docker` group; `Requires=docker.service` keeps it from running
  before Docker is up.
- **Restore says "REFUSING: TARGET_DB is the LIVE database".** Working as
  intended — for a drill omit the argument (defaults to `rebloom_verify`); only
  the explicit `--i-understand-this-overwrites-prod` path touches live.
