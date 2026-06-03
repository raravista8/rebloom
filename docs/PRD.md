# PRD — Передарим (code-name `rebloom`)

> **Action title:** Строим C2C-маркетплейс ресейла подаренных букетов для РФ (10 городов, эскроу-сделки, взаимные отзывы, топ-лента по свежести и лайкам) — одновременно как сайт, мобильные приложения и Telegram-бот на едином backend и единой дизайн-системе `@rebloom/canon`.

**TL;DR**
- **Что:** площадка, где человек выставляет на продажу уже подаренный букет (фото + размер + свежесть + цена), а покупатель берёт свежие цветы заметно дешевле флориста; платформа держит деньги в эскроу и берёт комиссию, после сделки стороны пишут отзывы друг на друга.
- **Для кого:** дарители/получатели букетов (продавцы-физлица, преимущественно женщины 18–40) и покупатели, ищущие свежие цветы со скидкой; запуск в 10 крупнейших городах РФ.
- **Почему сейчас:** прототип Second Bloom (Узбекистан) показал работающую экономику — 32 000 пользователей и ~$150k оборота за ~4 месяца почти без маркетинга `[verify: цифры из Forbes.kz]`; ресейл одежды/техники привычен, цветов — нет; ниша свободна в РФ.

---

## 1. Problem (SCQ)

- **Situation.** Букет живёт 5–7 дней и дарится ради одного повода; в РФ дарят десятки миллионов букетов в год, после праздника они почти сразу отправляются в мусор.
- **Complication.** У получателя нет канала монетизировать ненужный свежий букет, а у покупателя нет способа купить свежие цветы дешевле розницы; C2C-ресейл нормализован для вещей, но не для цветов; цветы скоропортящиеся и гиперлокальные — обычные доски объявлений плохо подходят (нет срочности, эскроу, гео, контроля свежести).
- **Question.** Как построить доверенную площадку, где продавец-физлицо за минуты выставляет букет, покупатель быстро и безопасно платит, а сделка закрывается локально в тот же день — с защитой денег, репутацией сторон и контролем свежести?

---

## 2. Target users & JTBD

### Persona 1 — Продавец «Аня» (получатель букета)
- **Goal:** быстро вернуть часть стоимости ненужного букета, не выходя надолго из дома.
- **Pain:** жалко выбрасывать свежие цветы; нет канала продажи; страшно встречаться с незнакомцем и не получить деньги.
- **Current workaround:** отдаёт соседям, постит в чат дома/Telegram-барахолку, чаще выбрасывает.

### Persona 2 — Покупатель «Марина»
- **Goal:** купить свежий красивый букет к событию/себе дешевле флориста, рядом с домом, сегодня.
- **Pain:** розница дорогая; на досках объявлений нет цветов, нет гарантии свежести и безопасной оплаты.
- **Current workaround:** покупает в рознице дорого либо не покупает.

### Persona 3 (post-MVP) — Полупро «Флорист-частник»
- **Goal:** распродать остатки/стареющий сток до списания.
- **Pain:** некуда сбыть свежий, но «вчерашний» сток.
- **Current workaround:** скидки в своём Instagram/Telegram, списание.
- `ASSUMPTION:` в MVP допускаем как обычное физлицо; отдельная роль «pro-продавец» с верификацией и лимитами — post-MVP (см. Out of scope).

---

## 3. Press-release (Amazon working-backwards, «как будто уже выпустили»)

> **Передарим запускает площадку, где подаренные букеты получают вторую жизнь.**
> Сегодня в 10 городах России заработал «Передарим» — сервис, где любой может за две минуты выставить полученный в подарок букет на продажу, а покупатель — забрать свежие цветы на 40–70% дешевле флориста. Продавец фотографирует букет, указывает размер и свежесть и назначает цену; покупатель оплачивает картой или через СБП, а деньги площадка удерживает до подтверждения получения — поэтому встреча безопасна для обеих сторон. После сделки покупатель и продавец оценивают друг друга, а самые свежие и самые залайканные букеты попадают в топ на главной. «Мы превращаем то, что раньше отправлялось в мусорное ведро, в источник дохода и в доступную радость для другого человека», — говорит основатель. Доставка — на выбор: самовывоз или курьер. Начать продавать или покупать можно на сайте, в приложении для iPhone и Android или прямо в Telegram-боте.

---

## 4. User scenarios

1. **Продавец выставляет букет.** Аня открывает приложение → «Продать» → делает 1–5 фото букета → выбирает размер (S/M/L/XL) и свежесть (сегодня / 1–2 дня / 3+ дня) → ставит цену и город/район → публикует. Система прогоняет фото через модерацию (без лиц/контактов), снимает EXIF/гео, считает «индекс свежести», ставит объявление в ленту города со сроком автоскрытия.
2. **Покупатель находит и покупает.** Марина видит на главной топ «Самые свежие» и «Самые залайканные» по своему городу → открывает букет → ставит лайк → нажимает «Купить» → выбирает самовывоз или курьер → платит картой/СБП. Деньги уходят в эскроу (ЮKassa «Безопасная сделка»). Появляется чат сделки.
3. **Передача и релиз денег.** Стороны встречаются (самовывоз) или курьер забирает/везёт (Яндекс Доставка). Покупатель подтверждает получение → эскроу релизит продавцу его сумму за вычетом комиссии площадки; продавцу формируется чек/выплата.
4. **Спор.** Покупатель не подтвердил / отказался → открывает спор с фото → поддержка решает (релиз/возврат/частичный возврат) в SLA-окне; деньги до решения заморожены.
5. **Отзывы и репутация.** После закрытой сделки покупатель и продавец видят форму отзыва (1–5★ + текст) друг на друга; рейтинг продавца и история сделок видны на его профиле и влияют на ранжирование.
6. **Канал Telegram.** Тот же сценарий «найти → купить» внутри Telegram-бота: лента города, карточка букета, оплата через ссылку ЮKassa, уведомления о статусе сделки.

---

## 5. Functional requirements (EARS)

**Аккаунт и идентичность**
- **FR-001** (Event) When a user submits a valid phone number, the system shall send a one-time SMS code and create a pending session.
- **FR-002** (Event) When a user submits a correct OTP within its TTL, the system shall authenticate the user and issue a revocable session token.
- **FR-003** (Unwanted) If OTP attempts exceed 5 within 15 minutes for a phone, then the system shall lock OTP issuance for that phone for 1 hour and log the event.
- **FR-004** (Ubiquitous) The system shall store each user's accepted ФЗ-152 consent with version, timestamp, and source channel.

**Объявления (listings)**
- **FR-010** (Event) When a seller publishes a listing with 1–5 photos, size, freshness, price, and city, the system shall create it in status `draft`→`active` after passing moderation.
- **FR-011** (Ubiquitous) The system shall strip EXIF/geolocation metadata from every uploaded photo before storage.
- **FR-012** (Unwanted) If a photo fails automated moderation (faces, contacts, prohibited content), then the system shall hold the listing in `pending_review` and notify the seller.
- **FR-013** (State) While a listing is `active`, the system shall display it in its city feed and decay its freshness score over time.
- **FR-014** (Event) When a listing reaches its freshness expiry (default 72h, seller-set), the system shall auto-archive it.
- **FR-015** (Event) When a user taps «лайк» on a listing, the system shall record one like per user per listing and update the listing's like score.
- **FR-016** (Complex) While a user is in city C, when the user opens the home feed, the system shall return the top-N freshest and top-N most-liked active listings for city C.

**Сделка и эскроу (deals)**
- **FR-020** (Event) When a buyer initiates purchase of an `active` listing, the system shall create a `deal` in status `created` and reserve the listing.
- **FR-021** (Event) When the buyer completes payment, the system shall move the deal to `paid_held` (funds in escrow) and open a deal chat.
- **FR-022** (Unwanted) If payment is not completed within 30 minutes, then the system shall cancel the deal and release the listing reservation.
- **FR-023** (Event) When the buyer confirms receipt, the system shall move the deal to `released`, trigger payout to the seller minus commission, and request a fiscal receipt.
- **FR-024** (Event) When either party opens a dispute before release, the system shall move the deal to `disputed` and freeze funds pending support resolution.
- **FR-025** (Ubiquitous) The system shall guarantee idempotent processing of payment provider webhooks by payment id.
- **FR-026** (State) While a deal is `paid_held`, the system shall never release funds without an explicit buyer confirmation, a delivery-confirmation event, or a support decision.

**Доставка (hybrid)**
- **FR-030** (Optional) Where delivery is `self_pickup`, the system shall provide a deal chat and on-demand geo/address sharing between the two parties only.
- **FR-031** (Optional) Where delivery is `courier`, the system shall create a courier claim via the delivery provider and surface tracking status in the deal.
- **FR-032** (Unwanted) If a courier claim fails to be created, then the system shall keep the deal `paid_held`, notify both parties, and offer pickup or cancellation.

**Отзывы и рейтинг**
- **FR-040** (Event) When a deal reaches `released`, the system shall enable mutual review forms for buyer and seller for 14 days.
- **FR-041** (Ubiquitous) The system shall compute a seller rating as the aggregate of received review scores over completed deals.
- **FR-042** (Unwanted) If a review contains contacts, slurs, or off-platform solicitation, then the system shall hold it for moderation.

**Уведомления / каналы**
- **FR-050** (Event) When a deal changes status, the system shall notify the relevant party via their active channels (push, Telegram, email — best-effort).
- **FR-051** (Where) Where the user interacts via Telegram bot, the system shall present the same city feed, listing card, purchase, and status flows as web/app.

**Админ/модерация**
- **FR-060** (Ubiquitous) The system shall provide moderators a queue of `pending_review` listings and held reviews with approve/reject actions.
- **FR-061** (State) While acting as admin, every approve/reject/refund action shall be written to an immutable audit log with actor, target, and reason.

**Модерация контента (текст)**
- **FR-062** (Unwanted) If listing/chat/review/profile-name text contains profanity, hate/ethnic slurs, or off-platform contacts (after normalization for obfuscation), then the system shall block publication with `content_blocked` (hard) or hold it for review, and show an inline error without echoing the banned term. (see MODERATION.md)
- **FR-063** (Event) When a user appeals a moderation block, the system shall create a moderation case marked "appealed".

**Жалобы и атрибуция**
- **FR-064** (Event) When a user reports a listing or another user, the system shall create a `user_report` in the moderation/abuse queue.
- **FR-065** (Ubiquitous) The system shall capture per-session platform (web/ios/android), source/UTM (first-touch), and request IP for analytics and fraud (ФЗ-152: access logged).

**Аналитика и админ-панель**
- **FR-070** (Ubiquitous) The admin panel shall show online-now, DAU/MAU, users total and by city/platform, GMV turnover, commission per period, and growth over time by city/source — role-gated, 2FA.
- **FR-071** (Event) When an admin searches users or listings, the system shall return matches by name/phone/id (users) or by listing fields.
- **FR-072** (Event) When an admin blocks/edits a user or stops/deletes a deal, the system shall require a reason, write an immutable audit entry, and (for money-affecting actions above threshold) require 4-eyes.
- **FR-073** (Ubiquitous) The system shall surface fraud signals (multi-account per IP/device, self-dealing, price/velocity anomalies, photo reuse, payout concentration) with a risk score and review actions. (see ADMIN_BACKEND_TZ.md)

**Комиссия / платежи**
- **FR-027** (Ubiquitous) The system shall charge a platform commission (default 10% from the seller, configurable `PLATFORM_COMMISSION_BPS`), deduct it via ЮKassa split on release, and show `commission_kopecks` on the deal; the buyer pays the listing price exactly. (ADR-0010)

**Уведомления / приватность / поддержка**
- **FR-090** (Event) When a notifiable event occurs, the system shall deliver via the user's opted-in channels (push/email/Telegram), idempotently; marketing requires explicit opt-in with one-click unsubscribe. (NOTIFICATIONS.md)
- **FR-091** (Event) When a user requests data export or account deletion, the system shall fulfil it (export machine-readable; delete/anonymize PII per retention, keeping legally-required anonymized ledger). (PRIVACY_152FZ.md)
- **FR-092** (Ubiquitous) The system shall provide a support/dispute console with SLA timers; disputes freeze funds until resolution; resolutions are audited. (SUPPORT.md)
- **FR-093** (Optional) Where the referral program flag is on, the system shall attribute invitees and grant rewards only after a confirmed deal, with anti-abuse checks. (REFERRAL.md)

**Пиковая нагрузка**
- **FR-094** (Where) Where a peak season is active (8 марта, 14 февраля), the system shall sustain elevated load and apply heightened anti-scam controls. (DEPLOYMENT/SECURITY)

---

## 6. Non-functional requirements

- **Performance:** p95 API < 200 ms (read), < 400 ms (write, excl. payment provider); feed first render < 1.5 s on 4G; image thumbnails served from CDN.
- **Scale envelope:** design for 50 000 registered users in first months, ~5 000 DAU, 10 cities; peak ~300 RPS app + image traffic on CDN; headroom to 250 000 users via horizontal API replicas + read replica (см. ARCHITECTURE §10, ADR-0006).
- **Availability:** 99.5% MVP; money paths (payment, payout, release) must fail-secure (never double-release, never lose escrow state).
- **a11y:** WCAG 2.1 AA on web; touch targets ≥ 44px; RU first, single-locale MVP.
- **i18n:** RU only at MVP; copy externalized for future locales.
- **Observability:** structured JSON logs + correlation id; traces on payment/deal/payout flows; SLO-burn + security alerts (см. SECURITY §8).
- **Cost ceiling:** target ≤ 35 000 ₽/мес infra at MVP scale (compute + managed Postgres + Redis + object storage + CDN + SMS), excl. payment provider commissions `[verify pricing]`.
- **Compliance:** ФЗ-152 (хранение ПДн в РФ, согласия), 54-ФЗ (фискальные чеки через платёжного агента), ФЗ-115 (AML/KYC на платёжной стороне через провайдера), PCI DSS scope minimized (карт. данные не касаются нашего backend — токенизация на стороне ЮKassa).

---

## 7. Success metrics

- **North star:** GMV закрытых сделок в месяц (releasered deals × средний чек).
- **Leading 1 — Activation:** доля новых продавцов, опубликовавших ≥1 объявление в первые 24 ч. **Target ≥ 30%.** Method: cohort funnel в analytics-событиях.
- **Leading 2 — Liquidity:** доля активных объявлений, проданных в течение 48 ч. **Target ≥ 25%.** Method: listing→deal join, time-to-sale.
- **Leading 3 — Trust:** доля закрытых сделок без спора + средний рейтинг. **Target ≥ 97% без спора, ≥ 4.6★.** Method: deal status + reviews.
- **Guardrail:** chargeback / fraud rate < 0.3% от объёма; escrow-разрывов (double release / lost state) = **0**.
- *AI-составляющая (модерация фото/текста):* accuracy модерации ≥ 0.95 на тест-сете, false-allow (пропуск лиц/контактов) ≤ 1%, p95 latency инференса < 1.5 с, $/проверку отслеживается (см. ADR по модерации). `[verify: модель/провайдер инференса]`

---

## 8. Out of scope (границы для агента)

- Собственный курьерский флот (используем провайдера доставки).
- Покупка букетов площадкой / собственный сток / витрина флористов.
- Подписки/гифтинг, корпоративные заказы, B2B-каталог.
- Мультивалютность, международные платежи, не-RU локали.
- Полноценная роль «pro-продавец» с верификацией ИП/самозанятости и повышенными лимитами (post-MVP).
- ML-антифрод (MVP — правила/пороги/ручная очередь; скоринг-модель — post-MVP).
- Хранение и обработка карточных данных на нашей стороне (токенизация только у провайдера).
- ML-рекомендации/персонализация ленты сверх «свежесть + лайки + гео» (post-MVP).

---

## 9. Assumptions & open questions

**Assumptions**
- `ASSUMPTION:` модель листинга — **fixed-price + «предложить цену» (offer)**, не живой аукцион (источник работает «по принципу доски объявлений»; аукцион — отдельный ADR post-MVP).
- `ASSUMPTION:` продавец — **любое физлицо**; самозанятость предлагается опционально для частых продавцов (ADR-0005); продажа личного имущества физлицом в общем случае не облагается НДФЛ — налоговую квалификацию подтвердить с юристом `[verify: налоговый статус продаж б/у имущества физлицами]`.
- **Launch cities (решено, seed):** гео-скоупинг по `city_id` с day-1; раскатка через feature-flag, Москва первой, далее по убыванию населения:

| # | Город | Население | slug | rollout |
|---|---|---|---|---|
| 1 | Москва | 13,15 млн | `msk` | wave 1 |
| 2 | Санкт-Петербург | 5,60 млн | `spb` | wave 1 |
| 3 | Новосибирск | 1,63 млн | `nsk` | wave 2 |
| 4 | Екатеринбург | 1,54 млн | `ekb` | wave 2 |
| 5 | Казань | 1,32 млн | `kzn` | wave 2 |
| 6 | Красноярск | 1,21 млн | `krsk` | wave 3 |
| 7 | Нижний Новгород | 1,20 млн | `nnv` | wave 3 |
| 8 | Челябинск | 1,18 млн | `chel` | wave 3 |
| 9 | Уфа | 1,16 млн | `ufa` | wave 3 |
| 10 | Самара | 1,16 млн | `smr` | wave 3 |

- **Requirement:** mobile web, iOS и Android **идентичны и строятся из одной кодовой базы, без отдельной разработки под платформу**. Реализация (ADR-0004): один **Next.js**-фронт на `@rebloom/canon` (верифицируемый web-canon из Claude Design), обёрнутый **Capacitor** в iOS/Android — то, что нарисовано и проверено в Claude Design, и едет на всех платформах. Натив (Expo/RN) отклонён: Claude Design не верифицирует RN-canon → двойной авторинг и дрейф.

**Open questions**
- Размер комиссии площадки (% со сделки) и кто платит (продавец/покупатель/сплит)?
- Нужен ли в MVP именно эскроу-чат или хватит статус-уведомлений + контакт по факту оплаты?
- Финальный бренд и домен (см. ARCHITECTURE §1, шорт-лист названий).
