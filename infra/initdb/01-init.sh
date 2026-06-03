#!/bin/bash
# Runs once on first primary init (postgres docker-entrypoint-initdb.d).
# Creates the replication role, the least-priv migrator role, and opens
# pg_hba for streaming replication on the local docker network.
set -euo pipefail

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-SQL
    CREATE ROLE replicator WITH REPLICATION LOGIN PASSWORD 'replicator_pw';

    -- Migrator owns the schema so Alembic (run out-of-band, OPERATIONS §2) can
    -- create/alter tables; the app role keeps narrower rights.
    CREATE ROLE rebloom_migrator WITH LOGIN PASSWORD 'rebloom';
    GRANT ALL PRIVILEGES ON DATABASE rebloom TO rebloom_migrator;
    GRANT ALL ON SCHEMA public TO rebloom_migrator;
    ALTER DEFAULT PRIVILEGES FOR ROLE rebloom_migrator IN SCHEMA public
        GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO rebloom_app;
    ALTER DEFAULT PRIVILEGES FOR ROLE rebloom_migrator IN SCHEMA public
        GRANT USAGE, SELECT ON SEQUENCES TO rebloom_app;
SQL

# Allow replication + app connections from the compose network.
{
  echo "host replication replicator all md5"
  echo "host all all all md5"
} >> "$PGDATA/pg_hba.conf"
