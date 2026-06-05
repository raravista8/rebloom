# API CONTRACT — Передарим (`rebloom`)

> **Единственный источник истины для связки фронт ↔ бек.** Бэкенд (Claude Code) реализует эти эндпоинты; веб-приложение (Claude Code) их потребляет; Claude Design проектирует экраны под эти **формы данных и состояния** (enum'ы, ошибки, пустые/loading).生成ируемая правда — OpenAPI из FastAPI (`/openapi.json`); этот документ — человеко-читаемый контракт и должен совпадать с ним.

## 0. Соглашения
- Все ответы — конверт: `{"ok": true, "data": {...}}` или `{"ok": false, "error": "code", "message": "...", "request_id": "..."}`.
- Деньги — целые **копейки** (`price_kopecks`). Время — ISO-8601 UTC (UI показывает MSK).
- ID — UUIDv4 (string). Пагинация — курсорная: `?cursor=&limit=`.
- Аутентификация — сессионная cookie (`HttpOnly; Secure; SameSite=Lax`) после OTP; mobile — secure storage. Authz по умолчанию **deny**; ownership-проверка на ресурсных маршрутах.

## 1. Общие enum'ы (фронт и бек используют одинаковые)
- `size`: `S | M | L | XL`
- `freshness`: `today | d1_2 | d3_plus`
- `deal.status`: `agreed → meeting → done | problem | cancelled` (no-escrow «оплата при встрече», ADR-0013; the platform processes no payment)
- `delivery_method`: `self_pickup | courier`
- `listing.status`: `draft | pending_review | active | reserved | sold | archived`
- `feed.section`: `fresh | liked`

## 2. Auth & identity
| Method | Path | Auth | Request | Response `data` | FR |
|---|---|---|---|---|---|
| POST | `/api/auth/otp/request` | — | `{phone}` | `{sent:true, retry_after_sec}` | FR-001 |
| POST | `/api/auth/otp/verify` | — | `{phone, code}` | `{user}` (+ session cookie) | FR-002 |
| POST | `/api/auth/oauth/{provider}/start` | — | `{redirect_uri}` | `{authorize_url, state}` | FR-005 |
| POST | `/api/auth/oauth/{provider}/callback` | — | `{code, state}` | `{user, is_new}` (+ session cookie) | FR-005 |
| POST | `/api/auth/logout` | session | — | `{ok}` | — |
| GET | `/api/me` | session | — | `{user}` | — |
| POST | `/api/consent` | session | `{policy_version}` | `{accepted_at}` | FR-004 |

`{provider}` ∈ `yandex | sber | vk | tid` (`apple` iOS-only, post-MVP). OAuth is **Authorization Code + PKCE, backend-mediated** (AUTH_HANDOFF §4.1): the verifier/secret never touch the client; `state` is single-use server-side (anti-CSRF/replay); `redirect_uri` must be on the backend allowlist. A provider with no configured credentials returns `oauth_failed` (button disabled).
`user`: `{id, display_name, phone_masked, city_id, roles[], seller_rating, deals_count}` (OAuth-first users may have `phone_masked: ""` until linked).
Errors: `validation_error`, `otp_locked` (FR-003), `rate_limited`, `oauth_failed`, `not_found` (unknown provider).

## 3. Photos & listings
| Method | Path | Auth | Request | Response `data` | FR |
|---|---|---|---|---|---|
| POST | `/api/photos` | session | `{content_type}` | `{photo_id, upload_url}` (direct-to-storage) | FR-011 |
| POST | `/api/listings` | session(seller) | `{size, freshness, price_kopecks, city_id, geo?, photo_ids[1..5], expires_in_h?}` | `listing` | FR-010 |
| GET | `/api/listings/{id}` | optional | — | `listing` (detail) | — |
| GET | `/api/feed` | optional | `?city_id&section=fresh\|liked&cursor&limit` | `{items: listing_card[], next_cursor, applied:{city_id, filters}}` | FR-016 |
| GET | `/api/search` | optional | `?city_id&q&size?&freshness?&price_min?&price_max?&cursor&limit` | `{items: listing_card[], next_cursor, applied:{q, city_id, filters}, suggestions?:[{type,label,href}]}` | FR-016 |
| POST | `/api/listings/{id}/like` | session | — | `{like_count, liked:true}` | FR-015 |
| DELETE | `/api/listings/{id}/like` | session | — | `{like_count, liked:false}` | FR-015 |
| GET | `/api/listings/{id}/messages` | session | `?buyer_id&cursor` | `{messages[], next_cursor}` — pre-purchase thread (seller passes `buyer_id`; buyer omits it) | FR-030 |
| POST | `/api/listings/{id}/messages` | session | `{body, buyer_id?}` | `message` (or held if contacts) — rate-limited (T-08) | FR-030/ T-05 |

`listing_card`: `{id, photo_thumb_url, size, freshness, price_kopecks, city_id, like_count, liked, seller:{id,display_name,seller_rating}}`
`listing` (detail) adds: `{photos:[{card_url,full_url}], status, freshness_score, expires_at, geo_coarse}`
Errors: `validation_error`, `moderation_pending` (FR-012), `forbidden` (not your listing).

## 4. Deals, chat & payment
| Method | Path | Auth | Request | Response `data` | FR |
|---|---|---|---|---|---|
| POST | `/api/deals` | session(buyer) | `{listing_id, delivery_method}` | `{deal}` (status `agreed`, opens chat) — **no payment** | FR-020/021 |
| GET | `/api/deals` | session | `?role=buyer\|seller&status&limit` | `{items: deal[], next_cursor}` — caller's own deals | — |
| GET | `/api/deals/{id}` | party only | — | `deal` | T-06 |
| POST | `/api/deals/{id}/share-point` | seller | `{address}` | `deal` (→`meeting`); pickup address stored AES-256-GCM (ADR-0012) + revealed to buyer | FR-030 |
| POST | `/api/deals/{id}/confirm-receipt` | buyer | — | `deal` (→`done`) — opens reviews | FR-023 |
| POST | `/api/deals/{id}/report` | party | `{reason, photo_ids[]}` | `deal` (→`problem`) — to support/moderation | FR-024 |
| POST | `/api/deals/{id}/cancel` | party | `{reason?}` | `deal` (→`cancelled`), listing → `active` | FLOW-3 |
| GET | `/api/deals/{id}/messages` | party | `?cursor` | `{messages[], next_cursor}` | FR-030 |
| POST | `/api/deals/{id}/messages` | party | `{body}` | `message` (or held if contacts) | FR-030/ T-05 |
| GET | `/api/deals/{id}/delivery` | party | — | `{revealed, address}` — exact address only after `meeting` (T-13) | FR-030 |
| POST | `/api/account/transfer-details` | session | `{card_last4?, phone?}` | `{ok}` — seller payout details for the **direct** P2P transfer (informational) | — |

`deal`: `{id, status, listing:{id,photo_thumb_url,price_kopecks}, role:"buyer"\|"seller", counterparty:{id,display_name,seller_rating}, delivery_method, created_at, done_at?}`. `price_kopecks` is the listing's **reference price**, not a charge.
**No payment layer at MVP (ADR-0013):** removed `payment` from `POST /api/deals`, `POST /api/webhooks/yookassa`, `amount_kopecks`/`commission_kopecks`/`released_at`, and the `payment_failed` error. The frontend polls `GET /api/deals/{id}` or subscribes via WS for status. Exact address is returned only after `meeting` (T-13).
Errors: `listing_unavailable`, `conflict`, `forbidden`.

## 5. Reviews & profile
| Method | Path | Auth | Request | Response `data` | FR |
|---|---|---|---|---|---|
| POST | `/api/deals/{id}/review` | party (after `done`) | `{score:1..5, text}` | `review` (or held) | FR-040/042 |
| GET | `/api/users/{id}` | optional | — | `{user, reviews[], active_listings[]}` | FR-041 |

## 6. Notifications, reports & admin
> Полный админ-API (overview/users/listings/deals/finance/stats/fraud/reports) — в `ADMIN_BACKEND_TZ.md §API`.
| Method | Path | Auth | Request | Response `data` | FR |
|---|---|---|---|---|---|
| GET | `/api/notifications` | session | `?cursor` | `{items:[{id,kind,title,body,payload,read,created_at}], next_cursor}` (in-app channel) | FR-050 |
| POST | `/api/reports` | session | `{target_type:"listing"\|"user", target_id, reason}` | `{report_id}` | FR-064 |
| GET/PATCH | `/api/me/notifications` | session | toggles `{deals,messages,marketing}` | `{settings}` | FR-090 |
| POST | `/api/me/export` | session | — | `{export:{profile,consents,listings,deals,reviews,messages}}` (MVP inline; async job + signed URL post-MVP) | FR-091 |
| POST | `/api/me/delete` | session | `{confirm:true}` | `{scheduled_at}` — soft-disable now (status→`deleted`), anonymize after retention grace | FR-091 |
| PATCH | `/api/me` | session | `{display_name?, city_id?}` | `{user}` — self-correction (DSR) | FR-091 |
| POST | `/api/support/tickets` | session | `{category, body}` | `{ticket_id}` | FR-092 |
| GET | `/api/admin/moderation/queue` | admin/moderator(2FA) | `?type=listing\|review` | `{items[], next_cursor}` | FR-060 |
| POST | `/api/admin/moderation/{id}` | admin/moderator(2FA) | `{type:"listing"\|"review", action:"approve"\|"reject", reason}` | `{status}` (audit-logged) | FR-061 |
| POST | `/api/admin/2fa/verify` | admin (session) | `{code}` (TOTP) | `{verified_2fa:true}` — unlocks 2FA session | — |
| GET | `/api/admin/deals` | admin(2FA) | `?status&limit` | `{items: deal[], next_cursor}` — all deals | FR-072 |
| POST | `/api/admin/deals/{id}/resolve` | admin(2FA) | `{action:"done"\|"cancelled", reason}` | `deal` (done/cancelled) — audit-logged. No money moves → **no 4-eyes** (ADR-0013) | FR-024, FLOW-1 |
| GET | `/api/admin/finance` | admin(2FA) | `?since&until` (ISO) | `{deal_turnover_kopecks, deals_by_status, avg_ticket_kopecks}` — turnover estimate over `done` deals at listing price; no GMV/commission/ledger (ADR-0013) `[verify: KPI-rename pending]` | FR-070 |

## 7. Error code catalogue (stable `error` values)
`validation_error`, `unauthorized`, `forbidden`, `not_found`, `rate_limited`, `otp_locked`, `oauth_failed`, `moderation_pending`, `content_blocked`, `listing_unavailable`, `conflict`, `internal`. (`payment_failed` removed — no payment layer at MVP, ADR-0013.)
> `content_blocked` — текст не прошёл модерацию (мат/слуры/контакты, см. `../MODERATION.md`); UI — инлайн-ошибка без эха запрещённого слова.
UI maps each to a user-facing RU message + a design state. **State ↔ backend binding (empty vs no-results vs error vs offline, pagination end) — в `handoff/INTERACTION_STATES.md §6`.** Key rule: `empty` (нет данных, фильтр не задан) ≠ `no-results` (запрос/фильтр задан, 0 результатов) — бек различает их через эхо `applied` (есть ли запрос/фильтры) и пустой `items`; `end-of-list` = `next_cursor:null`. No stack traces to clients.

## 8. Realtime (optional MVP)
- `WS /api/ws/deals/{id}` — статусы сделки + сообщения чата (Redis pub/sub). Деградация — polling `GET /api/deals/{id}`.
- `WS /api/ws/listings/{id}/threads/{buyer_id}` — pre-purchase чат по объявлению (seller-or-buyer only). Деградация — polling `GET /api/listings/{id}/messages`.

## 9. How the two sides stay in sync
- Бэкенд — источник схем (Pydantic → `/openapi.json`). При изменении контракта: обновить этот файл + bump в `CHANGELOG`, фронт регенерирует типы из OpenAPI.
- Claude Design проектирует строго под enum'ы §1 и состояния ошибок §7 (никаких «выдуманных» статусов).
- Любое новое поле/endpoint, затрагивающее деньги/PII, проходит через `SECURITY.md` (authz, T-06/T-13) перед мержем.
