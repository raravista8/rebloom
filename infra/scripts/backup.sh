#!/usr/bin/env bash
# Off-box encrypted Postgres backup for the single-box deploy.
#
# Money lives on this box (escrow ledger) — losing the disk must NOT lose the DB.
# This pg_dumps the running container, gzips, encrypts (AES-256, OpenSSL), and
# uploads to OFF-BOX storage via rclone. Run from host cron (see runbook):
#   0 */6 * * *  cd /opt/rebloom && BACKUP_ENC_KEY=... BACKUP_REMOTE=... bash infra/scripts/backup.sh
#
# Required env (from /opt/rebloom/.env or the cron environment):
#   POSTGRES_USER (default rebloom_app), POSTGRES_DB (default rebloom)
#   BACKUP_ENC_KEY   — strong passphrase; back it up SEPARATELY (lose it = lose backups)
#   BACKUP_REMOTE    — rclone target, e.g. "selectel:rebloom-backups" (different provider/region)
#   BACKUP_KEEP_DAYS — retention on the remote (default 14)
set -euo pipefail

cd "$(dirname "$0")/../.."  # repo root (/opt/rebloom)
# shellcheck disable=SC1091
[ -f .env ] && set -a && . ./.env && set +a

: "${BACKUP_ENC_KEY:?set BACKUP_ENC_KEY}"
: "${BACKUP_REMOTE:?set BACKUP_REMOTE (rclone target)}"
PG_USER="${POSTGRES_USER:-rebloom_app}"
PG_DB="${POSTGRES_DB:-rebloom}"
KEEP_DAYS="${BACKUP_KEEP_DAYS:-14}"
COMPOSE="docker compose --env-file .env -f infra/docker-compose.prod.yml"

TS="$(date -u +%Y%m%dT%H%M%SZ)"
OUT="/tmp/rebloom-${TS}.sql.gz.enc"

echo "[backup] dumping ${PG_DB} → ${OUT}"
$COMPOSE exec -T db pg_dump -U "${PG_USER}" --no-owner "${PG_DB}" \
	| gzip -9 \
	| openssl enc -aes-256-cbc -salt -pbkdf2 -pass "env:BACKUP_ENC_KEY" \
	> "${OUT}"

SIZE="$(du -h "${OUT}" | cut -f1)"
echo "[backup] encrypted ${SIZE}; uploading → ${BACKUP_REMOTE}"
rclone copy "${OUT}" "${BACKUP_REMOTE}/"

echo "[backup] pruning remote older than ${KEEP_DAYS}d"
rclone delete --min-age "${KEEP_DAYS}d" "${BACKUP_REMOTE}/" || true

rm -f "${OUT}"
echo "[backup] done: rebloom-${TS}.sql.gz.enc"
