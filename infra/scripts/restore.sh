#!/usr/bin/env bash
# Restore Postgres from an off-box encrypted backup (pairs with backup.sh).
#
# ⚠️ DESTRUCTIVE: drops and recreates the target DB. Practice on a scratch box
# regularly (the runbook mandates a quarterly restore drill) — an untested backup
# is not a backup.
#
#   BACKUP_ENC_KEY=... BACKUP_REMOTE=... bash infra/scripts/restore.sh rebloom-20260604T120000Z.sql.gz.enc
#
# With no filename argument, restores the most recent object in BACKUP_REMOTE.
set -euo pipefail

cd "$(dirname "$0")/../.."
# shellcheck disable=SC1091
[ -f .env ] && set -a && . ./.env && set +a

: "${BACKUP_ENC_KEY:?set BACKUP_ENC_KEY}"
: "${BACKUP_REMOTE:?set BACKUP_REMOTE}"
PG_USER="${POSTGRES_USER:-rebloom_app}"
PG_DB="${POSTGRES_DB:-rebloom}"
COMPOSE="docker compose --env-file .env -f infra/docker-compose.prod.yml"

NAME="${1:-}"
if [ -z "${NAME}" ]; then
	NAME="$(rclone lsf "${BACKUP_REMOTE}/" | sort | tail -n1)"
	echo "[restore] latest backup: ${NAME}"
fi
: "${NAME:?no backup found in ${BACKUP_REMOTE}}"

LOCAL="/tmp/${NAME}"
echo "[restore] downloading ${NAME}"
rclone copyto "${BACKUP_REMOTE}/${NAME}" "${LOCAL}"

read -r -p "[restore] DROP and recreate '${PG_DB}' from ${NAME}? type 'yes': " CONFIRM
[ "${CONFIRM}" = "yes" ] || { echo "aborted"; exit 1; }

echo "[restore] recreating database"
$COMPOSE exec -T db psql -U "${PG_USER}" -d postgres -c "DROP DATABASE IF EXISTS ${PG_DB} WITH (FORCE);"
$COMPOSE exec -T db psql -U "${PG_USER}" -d postgres -c "CREATE DATABASE ${PG_DB} OWNER ${PG_USER};"

echo "[restore] decrypting + loading"
openssl enc -d -aes-256-cbc -pbkdf2 -pass "env:BACKUP_ENC_KEY" -in "${LOCAL}" \
	| gunzip \
	| $COMPOSE exec -T db psql -U "${PG_USER}" -d "${PG_DB}"

rm -f "${LOCAL}"
echo "[restore] done. Verify: ledger reconciles (OPERATIONS §5) before resuming payouts."
