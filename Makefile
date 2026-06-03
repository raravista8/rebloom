.PHONY: install dev test test-full lint typecheck security-check migrate hooks-install

install:
	cd backend && poetry install
	cd landing && npm install

dev:
	docker compose --env-file .env -f infra/docker-compose.yml up

test:
	cd backend && poetry run pytest -m "not e2e and not slow"
	cd landing && npm run test

test-full:
	cd backend && poetry run pytest
	cd landing && npm run test && npm run test:visual

lint:
	cd backend && poetry run ruff check . && poetry run lint-imports
	cd landing && npm run lint

typecheck:
	cd backend && poetry run mypy --strict app
	cd landing && npx tsc --noEmit

security-check:
	cd backend && poetry run bandit -q -r app && poetry run pip-audit
	cd landing && npm audit --audit-level=high
	gitleaks detect --no-banner

migrate:
	cd backend && poetry run alembic upgrade head

hooks-install:
	pre-commit install && pre-commit install --hook-type commit-msg
