#!/usr/bin/env bash
# Restore Postgres from an off-box encrypted backup (pairs with backup.sh).
#
# An untested backup is not a backup. This script is built for the QUARTERLY
# RESTORE DRILL: it restores into a THROWAWAY verify database, never the live one.
#
#   Usage: restore.sh [TARGET_DB] [BACKUP_NAME]
#
#     TARGET_DB    REQUIRED-by-design, but defaults to a clearly-named throwaway:
#                  'rebloom_verify'. The script DROPs and recreates this DB, so it
#                  must NOT be the live database. Restoring over live prod is
#                  refused unless you pass --i-understand-this-overwrites-prod AND
#                  type the live DB name when prompted (disaster-recovery only).
#     BACKUP_NAME  Optional. The off-box artifact to restore (e.g.
#                  rebloom-20260604T120000Z.sql.gz.enc). Omit → latest in BACKUP_REMOTE.
#
#   Drill (safe):    bash infra/scripts/restore.sh
#   Drill (pinned):  bash infra/scripts/restore.sh rebloom_verify rebloom-20260604T120000Z.sql.gz.enc
#   Disaster only:   bash infra/scripts/restore.sh --i-understand-this-overwrites-prod rebloom
#
# After a drill, compare row counts vs prod (docs/runbooks/backup-restore.md §verify),
# then drop the verify DB. Required env: BACKUP_ENC_KEY, BACKUP_REMOTE.
set -euo pipefail

cd "$(dirname "$0")/../.."
# shellcheck disable=SC1091
[ -f .env ] && set -a && . ./.env && set +a

: "${BACKUP_ENC_KEY:?set BACKUP_ENC_KEY}"
: "${BACKUP_REMOTE:?set BACKUP_REMOTE}"
PG_USER="${POSTGRES_USER:-rebloom_app}"
LIVE_DB="${POSTGRES_DB:-rebloom}"
DEFAULT_TARGET="rebloom_verify"
COMPOSE="docker compose --env-file .env -f infra/docker-compose.prod.yml"

# --- Parse args: optional override flag, TARGET_DB, BACKUP_NAME ---------------
ALLOW_PROD=0
if [ "${1:-}" = "--i-understand-this-overwrites-prod" ]; then
	ALLOW_PROD=1
	shift
fi
TARGET_DB="${1:-${DEFAULT_TARGET}}"
NAME="${2:-}"

# --- Fail-secure: never silently overwrite the live database -----------------
if [ "${TARGET_DB}" = "${LIVE_DB}" ] && [ "${ALLOW_PROD}" -ne 1 ]; then
	echo "[restore] REFUSING: TARGET_DB '${TARGET_DB}' is the LIVE database." >&2
	echo "[restore] For a restore DRILL, omit the argument (defaults to '${DEFAULT_TARGET}')" >&2
	echo "[restore] or name a throwaway DB. To overwrite prod in a real disaster," >&2
	echo "[restore]   restore.sh --i-understand-this-overwrites-prod ${LIVE_DB}" >&2
	exit 1
fi

# --- Resolve the backup object (latest if not pinned) ------------------------
if [ -z "${NAME}" ]; then
	NAME="$(rclone lsf "${BACKUP_REMOTE}/" | grep '\.sql\.gz\.enc$' | sort | tail -n1)"
	echo "[restore] latest backup: ${NAME:-<none>}"
fi
: "${NAME:?no backup found in ${BACKUP_REMOTE}}"

LOCAL="/tmp/${NAME}"
echo "[restore] downloading ${NAME}"
rclone copyto "${BACKUP_REMOTE}/${NAME}" "${LOCAL}"

# --- Confirm (extra-strict when ALLOW_PROD overwrites live) -------------------
if [ "${ALLOW_PROD}" -eq 1 ] && [ "${TARGET_DB}" = "${LIVE_DB}" ]; then
	echo "[restore] *** DISASTER RECOVERY: this DROPs and recreates the LIVE DB '${LIVE_DB}'. ***" >&2
	read -r -p "[restore] Type the live DB name '${LIVE_DB}' to proceed: " CONFIRM
	[ "${CONFIRM}" = "${LIVE_DB}" ] || { echo "[restore] aborted"; rm -f "${LOCAL}"; exit 1; }
else
	read -r -p "[restore] DROP and recreate throwaway DB '${TARGET_DB}' from ${NAME}? type 'yes': " CONFIRM
	[ "${CONFIRM}" = "yes" ] || { echo "[restore] aborted"; rm -f "${LOCAL}"; exit 1; }
fi

# --- Recreate target + load --------------------------------------------------
# Connect to the maintenance 'postgres' DB so we can drop/create the target.
echo "[restore] recreating database '${TARGET_DB}'"
$COMPOSE exec -T db psql -U "${PG_USER}" -d postgres \
	-c "DROP DATABASE IF EXISTS ${TARGET_DB} WITH (FORCE);"
$COMPOSE exec -T db psql -U "${PG_USER}" -d postgres \
	-c "CREATE DATABASE ${TARGET_DB} OWNER ${PG_USER};"

echo "[restore] decrypting + loading into '${TARGET_DB}'"
openssl enc -d -aes-256-cbc -pbkdf2 -pass "env:BACKUP_ENC_KEY" -in "${LOCAL}" \
	| gunzip \
	| $COMPOSE exec -T db psql -U "${PG_USER}" -d "${TARGET_DB}"

rm -f "${LOCAL}"
echo "[restore] done → DB '${TARGET_DB}'."
if [ "${TARGET_DB}" != "${LIVE_DB}" ]; then
	echo "[restore] Verify (docs/runbooks/backup-restore.md §verify): compare row counts"
	echo "[restore]   of users/listings/deals/ledger_entries vs prod, then drop '${TARGET_DB}':"
	echo "[restore]   $COMPOSE exec -T db psql -U ${PG_USER} -d postgres -c \"DROP DATABASE ${TARGET_DB} WITH (FORCE);\""
else
	echo "[restore] LIVE DB restored. Verify the ledger reconciles (OPERATIONS §5) before resuming."
fi
