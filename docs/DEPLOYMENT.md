# DEPLOYMENT — Передарим (code-name `rebloom`)

> **Action title:** Хостимся в РФ (ФЗ-152): app-сервисы в Docker Compose на RF-VM за Caddy, БД и Redis — managed, фото — Object Storage + CDN; на 50k пользователей/10 городов достаточно одного крепкого app-узла + managed Postgres, с горизонтальной добавкой реплик API по триггеру.

**TL;DR**
- Среды: `local` (compose) → `staging` (RF-VM) → `prod` (RF-VM + managed DB/Redis + CDN).
- Стартовый сервер: **app-VM 8 vCPU / 16 GB / 160 GB NVMe** + **managed Postgres 2 vCPU/8 GB (HA-реплика)** + **managed Redis 2 GB** + **Object Storage + CDN**.
- Деплой — trunk-based: merge в `main` → пересборка изменённого сервиса на VM (как в `vitrina/OPERATIONS`).

## 1. Ответ на Q3 — «какую инфру и какой сервак»

Под 50 000 пользователей за первые месяцы, 10 городов, image-heavy C2C — нагрузка **умеренная**: ~5k DAU, пики сотни одновременных, пиковые ~100–300 RPS приложения (фото уходят на CDN, не на app). Поэтому:

**Рекомендация (cost/robustness-оптимум):**
- **1× app-VM**, RF (Yandex Cloud / Selectel / VK Cloud): **8 vCPU / 16 GB RAM / 160 GB NVMe**. На ней Docker Compose: `caddy`, `api ×2`, `workers`, `bot`, локальный `redis` только для dev — в prod Redis managed.
- **Managed PostgreSQL 16**, RF, HA: primary **2 vCPU / 8 GB / 100 GB** + read-replica; автобэкап + PITR. **Не self-host БД под деньги.**
- **Managed Redis** 2 GB (очереди RQ, сессии, счётчики лайков, pub/sub чата).
- **Object Storage (S3) + CDN** для фото (variants thumb/card/full).
- **SMS-провайдер** (OTP), **прокси/relay вне РФ** для Telegram-бота.

**Когда масштабировать (триггеры):** CPU app > 60% устойчиво → добавить `api`-реплики (stateless, за Caddy) и/или второй app-VM; рост чтений ленты → перевести feed/list на read-replica; рост фото-трафика → тюнинг CDN. Путь роста до ~250k пользователей — без смены архитектуры (modular monolith, ADR-0002/0006). Дальше — managed K8s.

> Вариант «подешевле как `vitrina`»: один RF-VPS + self-host Postgres — **не рекомендуется** для денежного маркетплейса (HA/бэкапы). Managed-БД — обязательна.
> `[verify: актуальные тарифы Yandex Cloud / Selectel / VK Cloud на VM, managed PG/Redis, Object Storage+CDN, SMS]`

## 2. Среды

| Env | Где | БД/Redis | Назначение |
|---|---|---|---|
| local | Docker Compose | контейнеры | разработка |
| staging | RF-VM (меньше) | managed (small) | приёмка, visual/e2e, DAST |
| prod | RF-VM | managed (HA) | боевой, 10 городов |

## 3. Infra-as-code

- `infra/docker-compose.yml` (base) + `docker-compose.prod.yml` (overrides), `infra/Caddyfile`.
- Provisioning managed-ресурсов — Terraform (RF-провайдер) `[verify: provider modules]`; секреты — secret-store/`.env` на VM, не в git.

## 4. CI/CD

- CI (GitHub Actions): backend (ruff+import-linter, mypy --strict, pytest, bandit, pip-audit) + web (eslint, tsc, vitest, npm audit, visual regression) + Capacitor build (signed iOS/Android) + infra (`docker compose config`) + gitleaks + security review gate. ~13 checks (как в `vitrina`).
- CD: merge в `main` → SSH на VM → `git pull --ff-only` → пересборка **только изменённого** сервиса (`--no-deps`, без `--pull` всего стека) → `up -d`. Подробности и gotchas — OPERATIONS §2.

## 5. Deployment topology (operational view)

- Наружу — только Caddy (443): TLS, rate-limit, security headers.
- Webhooks ЮKassa — отдельный путь с проверкой подписи + IP allowlist.
- Bot egress к Telegram — через прокси вне РФ.
- Фото — клиент ходит на CDN, не на app.

## 6. Rollback

- Сервис — пересборка предыдущего git-sha и `up -d --no-deps <svc>` (бэкап-образы кэшированы на VM).
- БД-миграции — только аддитивные/обратимо-совместимые (expand/contract); откат кода без отката миграции.
- Платежи: при сбое релиз/выплата **остаются held** (fail-secure), ручная сверка по ledger.

## 7. Observability stack

- Метрики Prometheus + Grafana; трейсы OpenTelemetry; ошибки — GlitchTip (RF-резидентно).
- Алерты: SLO-burn, всплеск 4xx/5xx, провалы подписи webhook, аномалии payout, длина очереди споров. Health: `/healthz`, `/readyz`.

## 8. Runbook stubs (`docs/runbooks/`)

- `deploy.md` — раскатка сервиса.
- `restore.md` — восстановление БД из бэкапа (тестируется ежеквартально).
- `payment-incident.md` — расхождение ledger/провайдер, заморозка выплат.
- `store-submission.md` — публикация iOS/Android.
- `city-rollout.md` — включение нового города (feature flag + seed).

## 9. Cost estimate (MVP, ориентир)

| Item | ~ /мес |
|---|---|
| app-VM 8/16 | — |
| managed Postgres HA | — |
| managed Redis 2GB | — |
| Object Storage + CDN | — |
| SMS (OTP) | переменно |
| Telegram proxy | — |
| **Цель ≤ 35 000 ₽/мес** (без комиссий ЮKassa) | `[verify pricing]` |

## 9b. Пиковые периоды (8 марта, 14 февраля)
Спрос ×N всплеском. План: заранее поднять `api`-реплики и воркеры (image/moderation), прогреть CDN, временно поднять тариф managed PG/Redis, включить read-replica; нагрузочный прогон (TESTING §5) перед сезоном; повышенный анти-скам (SECURITY). После — масштабирование вниз. Runbook — OPERATIONS §9.

## 10. Backup / restore policy

- Postgres: автобэкап ежедневно + PITR (managed); хранение 30 дней; шифрование; RF-регион.
- Object Storage: versioning на bucket с фото.
- Тест восстановления — ежеквартально по `restore.md`.
- Ledger — append-only, отдельная логическая сверка раз в сутки (нулевой разрыв escrow).
