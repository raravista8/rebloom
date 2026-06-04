.PHONY: install dev test test-full lint typecheck security-check migrate hooks-install

# Web (Next.js) is scaffolded in E2. Until web/package.json exists, the web
# steps no-op so the backend toolchain stays green on its own.
WEB_READY := $(shell [ -f web/package.json ] && echo yes)

install:
	cd backend && poetry install
ifeq ($(WEB_READY),yes)
	cd web && npm install
else
	@echo "· web/ not initialized yet (E2) — skipping npm install"
endif

dev:
	docker compose --env-file .env -f infra/docker-compose.yml up

test:
	cd backend && poetry run pytest -m "not e2e and not slow and not integration"
ifeq ($(WEB_READY),yes)
	cd web && npm run test
else
	@echo "· web/ not initialized yet (E2) — skipping web tests"
endif

test-full:
	cd backend && poetry run pytest
ifeq ($(WEB_READY),yes)
	cd web && npm run test && npm run test:visual
else
	@echo "· web/ not initialized yet (E2) — skipping web tests"
endif

lint:
	cd backend && poetry run ruff check . && poetry run ruff format --check . && poetry run lint-imports
ifeq ($(WEB_READY),yes)
	cd web && npm run lint
else
	@echo "· web/ not initialized yet (E2) — skipping web lint"
endif

typecheck:
	cd backend && poetry run mypy --strict app
ifeq ($(WEB_READY),yes)
	cd web && npx tsc --noEmit
else
	@echo "· web/ not initialized yet (E2) — skipping web typecheck"
endif

security-check:
	cd backend && poetry run bandit -q -r app && poetry run pip-audit
ifeq ($(WEB_READY),yes)
	cd web && npm audit --audit-level=high
else
	@echo "· web/ not initialized yet (E2) — skipping npm audit"
endif
	gitleaks detect --no-banner

migrate:
	cd backend && poetry run alembic upgrade head

hooks-install:
	pre-commit install && pre-commit install --hook-type commit-msg
