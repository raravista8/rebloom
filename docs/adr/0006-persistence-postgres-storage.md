# ADR-0006: Managed Postgres (+ read replica) and S3 object storage + CDN
Date: 2026-06-03
Status: Proposed

## Context
Money + PII demand durability, HA, backups, RF residency (ФЗ-152). Image-heavy feed needs cheap blob storage + CDN. Self-managing a money DB on a single VPS is an availability/data-loss risk.

## Decision
We will use a **managed PostgreSQL 16** (RF region, HA primary + read replica, automated encrypted backups, PITR) for relational/money data, **managed Redis** for queue/cache/sessions/counters, and **S3-compatible Object Storage + CDN** (Yandex/Selectel, RF) for photos. Read replica serves feed/list reads; primary serves all writes and money paths.

## Alternatives considered
- **Self-hosted Postgres on the app VPS** — rejected for money: weaker HA/backup story, ops burden.
- **MinIO self-host for photos** — rejected at scale: CDN + ops overhead vs managed object storage.

## Consequences
Positive: HA, backups, PITR, RF residency, CDN offload for images.
Negative: higher cost than bare VPS (justified for money/PII).
Neutral: read-replica wiring optional at launch, enabled on load trigger (see ARCHITECTURE open questions).

## Verification
`/readyz` checks primary+replica+Redis+storage; backup/restore runbook tested in `docs/runbooks/`; PII columns encrypted (`test_pii_encryption.py`); residency documented in DEPLOYMENT.
