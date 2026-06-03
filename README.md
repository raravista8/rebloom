# Передарим (code-name `rebloom`)

> **Публичный бренд — «Передарим»** (домен **peredarim.ru**). В коде,
> имени репозитория, package paths и env vars — инженерное имя `rebloom` (code-name, не product name).

C2C-маркетплейс ресейла подаренных букетов для РФ: продавец-физлицо выставляет полученный
букет (фото + размер + свежесть + цена), покупатель берёт свежие цветы дешевле флориста,
платформа держит деньги в эскроу и берёт комиссию, после сделки — взаимные отзывы. Топ-лента
на главной: «самые свежие» и «самые залайканные». Каналы: web + iOS/Android (один Next.js web-фронт, обёрнутый Capacitor) +
Telegram-бот на едином backend. Подробности — `docs/PRD.md`.

## Layout
```
backend/         FastAPI + workers + bot (Python 3.12, poetry)
web/             Next.js (App Router, Tailwind) + @rebloom/canon — one build = web + (wrapped) mobile
mobile/          Capacitor wrapper (iOS/Android) over the web build — config only
packages/canon/  vendored @rebloom/canon (web UI source of truth, from Claude Design)
packages/canon/  vendored @rebloom/canon (UI source of truth, from Claude Design)
infra/           docker-compose, Caddyfile, deploy scripts
docs/            PRD, ARCHITECTURE, SECURITY, ADRs, TASKS, TESTING, DEPLOYMENT, OPERATIONS
```
Architecture: modular monolith with hexagonal core for high-risk modules (payments / deals /
auth / listings / reviews / moderation). See `docs/ARCHITECTURE.md` and `docs/adr/0002-*`.

## Local dev (≤10 commands)
```
pyenv install -s 3.12 && pyenv local 3.12      # 1. Python toolchain
pipx install poetry                            # 2.
nvm use 20                                      # 3. Node toolchain (frontend)
make install                                    # 4. deps (backend + frontend)
cp .env.example .env                            # 5. fill required secrets
make dev                                        # 6. bring up the stack
make migrate                                    # 7. migrations
make test                                       # 8. tests
```
Full workflow (branching, commits, PR template) — `CONTRIBUTING.md`.

## Make targets
| Target | What |
|---|---|
| `make install` | poetry install (backend) + npm install (web) |
| `make dev` | docker compose up (full stack) |
| `make test` | pytest + vitest (unit+integration+security subset) |
| `make test-full` | adds e2e + slow markers |
| `make lint` | ruff (backend) + eslint (frontend) |
| `make typecheck` | mypy --strict + tsc --noEmit |
| `make security-check` | bandit + pip-audit + npm audit + gitleaks |
| `make migrate` | alembic upgrade head |

## Specification — read in order before writing code
1. `CLAUDE.md` — operational context + hard rules
2. `docs/PRD.md` — what we're building
3. `docs/ARCHITECTURE.md` — how it fits together
4. `docs/SECURITY.md` — threat model + ФЗ-152/payment controls (read before auth/payments/deals/photos/moderation)
5. `docs/adr/` — locked-in decisions (0001–0008)
6. `docs/TASKS.md` — backlog with stable IDs (E0 → E10)
7. `docs/OPERATIONS.md` — how we ship & run prod
8. `docs/handoff/` — **design handoff pack**: `DESIGN_BRIEF` + `INTERACTION_STATES` + `FLOWS` + `MOTION` + `CANON_PACKAGE_TZ` + `API_CONTRACT` + admin briefs
9. `docs/PARALLELIZATION.md` — параллельные потоки работ; `docs/runbooks/store-submission.md` — релиз в сторы
