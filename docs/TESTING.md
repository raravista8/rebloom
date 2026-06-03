# TESTING — Передарим (code-name `rebloom`)

> **Action title:** Тестовая пирамида с TDD на денежном ядре, pixel-diff на UI и обязательным security-слоем; деньги и авторизация покрываются раньше и плотнее всего.

**TL;DR**
- Юнит-тесты на `core/**` (домен) — основной объём; интеграция на адаптерах; e2e на критичных сценариях; security-слой обязателен в CI.
- **TDD обязателен** для `core/{deals,payments,auth,moderation}` (сначала тест-инвариант, потом код).
- Coverage: `core/` ≥ 85%, на `core/{deals,payments,auth}` ≥ 95%; адаптеры — без жёсткого таргета (покрыты интеграцией).

## 1. Пирамида и инструменты

| Слой | Что покрывает | Инструмент | Где |
|---|---|---|---|
| Unit | домен, state machine, ledger, политики OTP/authz, freshness/feed-логика | pytest + hypothesis | `backend/tests/unit/` |
| Integration | адаптеры (Postgres, Redis, ЮKassa, Яндекс Доставка, object storage) на testcontainers | pytest + testcontainers | `backend/tests/integration/` |
| Contract | формат webhook ЮKassa, envelope API, схемы Pydantic | pytest + schemathesis | `backend/tests/contract/` |
| E2E | покупка с эскроу, спор, публикация объявления, отзывы | pytest + httpx (api) | `backend/tests/e2e/` |
| Security | см. §security (обязательно) | pytest + bandit + Semgrep + gitleaks + pip-audit | `backend/tests/security/` |
| Visual (UI) | pixel-diff экранов vs canon-baselines (web == обёрнутое приложение) | Playwright | `web/tests/visual/` |
| Frontend unit | компоненты/хуки web-фронта | vitest | `web/` |

## 2. Coverage targets (явные числа)

- `app/core/**` ≥ **85%** строк.
- `app/core/{deals,payments,auth}` ≥ **95%** + 100% покрытие переходов state machine.
- `app/infrastructure/**` — без таргета покрытия, но каждый адаптер имеет ≥1 интеграционный тест happy-path + ≥1 на ошибку провайдера.
- `web/` компоненты canon — покрыты visual-regression (diff ≤ 2%); т.к. iOS/Android рендерят тот же web-build, паритет идентичен по построению; unit — на бизнес-логику хуков.

## 3. TDD-or-not policy

- **TDD обязателен**: `core/deals` (ledger/state machine), `core/payments` (escrow/split/payout), `core/auth` (OTP/sessions/lockout), `core/moderation` (fail-closed). Пишем тест-инвариант → реализуем → рефакторим.
- **Тест-после допустим**: тонкие роутеры, CRUD-модули (`feed/likes/users`), адаптеры с интеграционным покрытием.
- Каждый баг сначала воспроизводится тестом, потом чинится (CLAUDE.md §0.4).

## 4. Test data & fixtures

- Фабрики (`factory_boy`) для User/Listing/Deal/Payment; детерминированные seed.
- Изолированная БД на testcontainers Postgres; чистый Redis на тест.
- **Никаких реальных ПДн** в фикстурах — синтетические телефоны/имена.
- Golden-file для рендера объявления/чека; property-based (hypothesis) для freshness-decay, ledger-инвариантов, money-арифметики (никогда не теряем копейки).

## 5. Performance test plan

- Locust/k6 сценарий: лента города + image-served + покупка; цель p95 < 200ms (чтение) на seeded 50k пользователей / 100k объявлений.
- Прогон перед каждым релизом раскатки нового города.

## 6. Security tests (cross-ref SECURITY §9)

| Test file | Threat / OWASP |
|---|---|
| `test_authz_idor.py` (per-endpoint negative) | A01, T-06 |
| `test_otp_bruteforce.py` | A07, T-01 |
| `test_webhook_signature.py`, `test_webhook_replay.py` | A08, T-02 |
| `test_double_release_race.py` | T-03 |
| `test_upload_fuzz.py` | A05/A08, T-04 |
| `test_contact_leak_filter.py` | T-05 |
| `test_moderation_prompt_injection.py` | A05, T-15 |
| `test_pii_encryption.py`, `test_log_redaction.py` | A04/A09, T-07/T-10 |
| `test_address_disclosure_gate.py` | T-13 |
| `test_admin_audit.py` | A09, T-11 |
| `test_payment_failure_keeps_held.py` | A10 |
| bandit / Semgrep / pip-audit / npm audit / gitleaks (CI) | A02/A03/A05 |
| OWASP ZAP (staging, optional) | DAST |

**Gate:** изменения в protected paths (`core/{auth,payments,deals,listings,photos,reviews,moderation,consent}`) требуют зелёного `make security-check` + обновлённых тестов в том же коммите.


## 7. Quality gates (pre-commit + CI) — паритет с `vitrina`
Полный набор проверок, как в вашем сетапе. Реализуется в `T0.2`/`T0.3`, гоняется локально (`make`) + в CI.

**Pre-commit (блокирует коммит):**
- `gitleaks` + `detect-secrets` (`.secrets.baseline`) — **утечка секретов**
- `ruff` (format+lint), `commit-msg` hook (Conventional Commits)

**CI (GitHub Actions, ~13 проверок, merge заблокирован при красном):**
1. `ruff check` (backend lint)
2. `import-linter` (граница `core ↛ infrastructure`)
3. `mypy --strict` (backend types)
4. `pytest` unit+integration+contract + **security-subset**
5. `bandit` (SAST, backend)
6. `pip-audit` (SCA, Python)
7. `eslint` (web lint)
8. `tsc --noEmit` (web types)
9. `vitest` (web unit)
10. `npm audit --audit-level=high` (SCA, JS)
11. **visual regression** — Playwright **pixel-diff vs canon baselines ≤ 2%** (pixel-perfect)
12. `docker compose config` (infra)
13. `gitleaks` (secret scan) + security-review gate

**Дополнительно:** Capacitor signed build (iOS/Android) на релизных ветках; DAST (OWASP ZAP) на staging — опц.

**Definition of Done (CLAUDE.md §7):** build clean · lint · typecheck · tests green · protected path → `make security-check` зелёный + тесты в том же коммите · UI → `npm run test:visual` ≤ 2% · diff хирургический.
