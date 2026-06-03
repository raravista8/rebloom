# ADMIN — BACKEND TZ (ТЗ для Claude Code) · Передарим (`rebloom`)

> Бэкенд **админ-панели**: API, модель данных, аналитика (DAU/MAU/online/источники/платформы), финансы (оборот/комиссия), антифрод и контроли доступа/ПДн. Живёт в `core/admin`, `core/analytics`, `core/fraud`. Парное ТЗ по UI — `ADMIN_DESIGN_BRIEF.md`. Базовый контракт/конверт — `API_CONTRACT.md`. Безопасность — `SECURITY.md`.

## RBAC и доступ
- Роли: `admin` (всё), `moderator` (модерация/жалобы), `support` (сделки/споры в лимите), `analyst` (только чтение метрик, без ПДн/IP).
- Все админ-маршруты: сессия + **TOTP 2FA**, IP-allowlist для `/admin`, rate-limit.
- **Доступ к ПДн/IP и редактирование юзера — логируется** (кто/что/когда/причина) в `AUDIT_LOG` (ФЗ-152, SECURITY T-11). `analyst` к ПДн/IP не имеет доступа (агрегаты обезличены).
- Destructive (block/edit-user/stop-deal/delete-deal/refund): подтверждение + обязательная `reason`; **4-eyes** (второй админ) для денежных операций выше порога.

## Модель данных (добавления к ARCHITECTURE ER)
- `event` 🔒 — `{id, user_id?, anon_id, type, platform(web|ios|android), source/utm{source,medium,campaign}, ip, city_id?, ts}` — источник DAU/MAU/воронок/прироста/атрибуции.
- `session` 🔒 — `{id, user_id, platform, ip, user_agent, device_fingerprint, started_at, last_seen_at}`; online = Redis-set с TTL-heartbeat.
- `ip_log` 🔒 — связка `user_id ↔ ip ↔ device` (для мульти-аккаунт детекта); хранение по retention-политике.
- `attribution` — first-touch источник/UTM на пользователя.
- `fraud_signal` — `{user_id|deal_id, type, score, evidence, ts, status}`; агрегат `risk_score` на юзера/сделку.
- `user_report` — жалобы пользователей на объявление/юзера.
- `user` += `status(active|limited|blocked)`, `blocked_reason`, `risk_score`.
- Финансы — из существующего append-only `LEDGER_ENTRY` (оборот/комиссия/выплаты), без отдельной «правды».

## API (всё под `{ok,data}`, роль+2FA, audit)
| Method | Path | Назначение |
|---|---|---|
| GET | `/api/admin/overview` | KPI: `{online, dau, mau, users_total, users_by_city[], users_by_platform{web,ios,android}, gmv_kopecks, commission_kopecks, deals_by_status{}, growth_series}` за период |
| GET | `/api/admin/users` | поиск (`q`=имя/телефон/id) + фильтры (city/status/platform/risk), пагинация; строка: listings_count, rating, reviews_count, last_ip, multi_account_flag, platform, status |
| GET | `/api/admin/users/{id}` | drill: профиль, объявления, отзывы+рейтинг, сделки, IP/устройства/платформы, fraud-сигналы |
| PATCH | `/api/admin/users/{id}` | редактирование данных юзера (audited, reason) |
| POST | `/api/admin/users/{id}/block` · `/unblock` | блокировка/разблокировка (reason) |
| POST | `/api/admin/users/{id}/reset-sessions` | сброс сессий |
| GET | `/api/admin/listings` | поиск по объявлениям + фильтры + очередь модерации |
| POST | `/api/admin/moderation/{id}` | approve/reject (reason) — текст/фото (см. MODERATION.md) |
| GET | `/api/admin/deals` | фильтр по статусам, суммы/комиссия |
| POST | `/api/admin/deals/{id}/stop` | заморозить сделку (reason) |
| DELETE | `/api/admin/deals/{id}` | отменить/удалить (soft, возврат по правилам, 4-eyes если деньги) |
| GET | `/api/admin/finance` | оборот всего + комиссия по периодам + выплаты/заморозки + сверка ledger |
| GET | `/api/admin/stats` | прирост юзеров по времени/городу/источнику; темпы |
| GET | `/api/admin/fraud` | сигналы/кластеры подозрительной активности |
| GET | `/api/admin/reports` | жалобы пользователей |

## Аналитика (как считаем)
- **Online сейчас** — кол-во активных session-heartbeat в Redis за окно (напр. 5 мин).
- **DAU/MAU** — уникальные `user_id` в `event` за 1/30 дней; DAU/MAU = stickiness.
- **Платформа** (web/iOS/Android) — из `session.platform`/`event.platform` (клиент проставляет; mobile = Capacitor-обёртка помечает ios/android).
- **Источник/UTM** — `event.source` + `attribution` (first-touch); прирост с разбивкой по источнику.
- **Прирост по городам/времени** — регистрации по `city_id` × период; темп (%/период).
- **Оборот/комиссия** — суммы из `LEDGER_ENTRY` (`held/released/commission/refund`) по периодам; деньги в копейках.

## Fraud — методики выявления подозрительной активности (для C2C-цветов)
Каждый сигнал = правило + порог → `fraud_signal(score)` → действие (flag/в очередь/limit/shadow/block). Агрегат `risk_score`.
1. **Мульти-аккаунт по IP/устройству** — N аккаунтов с одним `ip`/`device_fingerprint` → кластер + предупреждение в админке.
2. **Self-dealing / накрутка отзывов** — покупатель и продавец связаны (один IP/устройство/карта выплаты) → wash-trade для фарма рейтинга; блок засчёта отзывов.
3. **Velocity-аномалии** — слишком много объявлений/сделок/лайков за短 период; молодой аккаунт + высокая активность.
4. **Ценовая аномалия** — цена сильно ниже медианы по размеру/городу → приманка-скам.
5. **Переиспользование фото** (pHash) между аккаунтами/объявлениями (чужие/ворованные фото) — SECURITY T-09.
6. **Концентрация выплат** — много продавцов выводят на одну карту/счёт.
7. **Всплеск споров/чарджбэков** у юзера.
8. **Попытки увести в офлайн** — повторные контакты в чате (MODERATION/T-05) → сигнал.
9. **Гео-несоответствие** — заявленный город ≠ гео IP.
10. **Манипуляция отзывами/рейтингом** — всплески, только взаимные отзывы, отзывы без сделок.
11. **Новый аккаунт + высокий чек** — повышенный риск, доп. проверки/лимиты.
12. **Повторные попытки протолкнуть запрещёнку** (мат/слуры/контакты) → поведенческий сигнал.
> MVP — правила + пороги + ручная очередь; later — скоринг/ML. Действия логируются; ложные срабатывания пересматриваются.

## Безопасность/контроли (cross-ref SECURITY)
- Админка — высокоценная цель: 2FA, IP-allowlist, аудит всего, least-privilege по ролям, отдельный rate-limit.
- ПДн/IP/редактирование юзера — доступ логируется, причина обязательна; `analyst` видит только агрегаты.
- Destructive — soft-delete + audit + 4-eyes (деньги); удаление сделки никогда не «теряет» ledger (fail-secure).
- Это расширяет threat model: добавить в `SECURITY.md` строки T-16 (злоупотребление админ-доступом к ПДн), T-17 (искажение метрик/финотчётов), T-18 (обход блокировки/ban-evasion).

## Связанные задачи
Реализуется отдельным эпиком в `TASKS.md` (E11: Admin & analytics & fraud), зависит от E1/E5/E10. Эндпоинты — строго по этому файлу; UI — по `ADMIN_DESIGN_BRIEF.md`.
