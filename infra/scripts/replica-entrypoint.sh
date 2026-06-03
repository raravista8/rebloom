#!/bin/bash
# Streaming-replica bootstrap: on first boot, base-backup from the primary into
# an empty PGDATA with -R (writes standby.signal + primary_conninfo), then hand
# off to the stock postgres entrypoint so it starts as a hot standby.
set -euo pipefail

PGDATA=/var/lib/postgresql/data

if [ ! -s "$PGDATA/PG_VERSION" ]; then
  echo "replica: waiting for primary ${PRIMARY_HOST}:${PRIMARY_PORT} ..."
  until pg_isready -h "$PRIMARY_HOST" -p "$PRIMARY_PORT" -U "$REPL_USER" >/dev/null 2>&1; do
    sleep 1
  done
  echo "replica: running pg_basebackup ..."
  rm -rf "${PGDATA:?}/"*
  pg_basebackup -h "$PRIMARY_HOST" -p "$PRIMARY_PORT" -U "$REPL_USER" \
    -D "$PGDATA" -Fp -Xs -P -R
  chmod 0700 "$PGDATA"
fi

exec docker-entrypoint.sh "$@"
