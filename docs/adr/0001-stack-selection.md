# ADR-0001: Backend & runtime stack selection
Date: 2026-06-03
Status: Proposed

## Context
Greenfield C2C marketplace handling escrow money, PII (ФЗ-152), image-heavy feed, three frontends (web/app/bot), small team + Claude Code, target 50k users / 10 cities with headroom. Money flows demand transactional integrity; team already operates a Python/FastAPI/Postgres stack (`vitrina`).

## Decision
We will build the backend on **Python 3.12 + FastAPI + SQLAlchemy 2.0 + PostgreSQL 16 + Redis (RQ)**, with Pydantic v2 for validation. Bot on **aiogram 3**.

## Alternatives considered
- **Node.js / NestJS** — rejected: less team depth, weaker typing ergonomics for money invariants vs Python+mypy strict.
- **Go** — rejected: faster runtime but slower time-to-market for a small team; not needed at this scale.
- **MongoDB** — rejected: escrow/ledger need ACID multi-row transactions; Postgres JSONB covers semi-structured needs.

## Consequences
Positive: fast TTM, strong typing, transactional money core, reuse of team ops knowledge.
Negative: Python throughput lower than Go (mitigated by horizontal API replicas + CDN).
Neutral: aligns with `vitrina` toolchain (poetry, ruff, mypy, alembic).

## Verification
`pyproject.toml` pins Python 3.12; `make typecheck` runs `mypy --strict`; `import-linter` enforces core↔infrastructure boundary; CI green.
