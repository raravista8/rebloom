# backend/ — Python 3.12 / FastAPI / SQLAlchemy 2.0 / RQ / aiogram

Area rules for the backend. Root `CLAUDE.md` applies; this adds backend specifics.

## Layout
- `app/api/` — thin FastAPI routers (validation + authz + call service; no domain logic)
- `app/core/<domain>/` — domain logic. **NEVER import `app/infrastructure/**`** (import-linter enforced). High-risk domains are hexagonal: define `ports.py` (typing.Protocol), keep effects out of core.
- `app/infrastructure/` — adapters: `postgres/`, `redis.py`, `object_storage.py`, `yookassa.py`, `yandex_delivery.py`, `sms.py`, `logging.py`
- `app/workers/` — RQ jobs (image, moderation, payouts, delivery, notifications)
- `app/bot/` — aiogram handlers; **egress to Telegram only via proxy** (OPERATIONS §4)
- `alembic/versions/` — migrations (expand/contract only)
- `tests/{unit,integration,contract,e2e,security}/`

## Rules
- Domain returns `Result[T, DomainError]`; raise only at the api boundary.
- Pydantic everywhere, `ConfigDict(extra='forbid')`.
- Money is **int kopecks**, never float; deal money path is single-transaction + `SELECT … FOR UPDATE`.
- Payment webhooks: verify signature + IP allowlist + re-fetch status + idempotent by `yk_payment_id`.
- Every public endpoint: rate-limit + auth check + ownership check (default-deny).
- Logs: structured JSON, PII masked at the formatter; never log card data/secrets.
- New runtime dep → ADR. No raw SQL f-strings. No PII to LLM without masking + `<user_content>` tags.

## TDD (TESTING §3)
Write the invariant test first for `core/{deals,payments,auth,moderation}`. Protected path → full suite + `make security-check` green + tests in same commit.

## API contract
Endpoints/shapes/enums/errors are defined in `docs/handoff/API_CONTRACT.md` and must match FastAPI's `/openapi.json`. Don't invent routes/fields — update the contract + CHANGELOG first.

## Commands
`poetry run pytest -m "not e2e and not slow"` · `mypy --strict app` · `ruff check .` · `lint-imports` · `bandit -r app` · `pip-audit` · `alembic upgrade head`
