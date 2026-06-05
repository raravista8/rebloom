# SCREEN_INDEX — canonical screens (Claude Design canon ⇄ web/ prod)

> Map of screens authored in Claude Design and consumed via `@rebloom/canon`. Source of truth for the design handoff. Parent specs: `DESIGN_BRIEF.md`, `CANON_PACKAGE_TZ.md`.
> Полная логика состояний — `INTERACTION_STATES.md §5`. **Пошаговые ветвящиеся флоу (спор, возврат, отмена, сбой оплаты, апелляция модерации, доставка, удаление аккаунта, жалоба) — `FLOWS.md`.**
> Status: 🔵 spec only · 🟢 canon-import (live) · 🟡 hand-rolled (temp) · 🔴 missing
> Canon version: `0.2.0` (vendored in `packages/canon`, rendering live in `web/`; screens being data-wired)

| # | Screen | Route (web) | Primary action | Key states | Status | Notes |
|---|---|---|---|---|---|---|
| 1 | Главная / витрина | `/` | открыть карточку | loading/empty/error | 🔵 | две топ-ленты: «самые свежие» + «самые залайканные»; CitySelector; BottomNav (FR-016) |
| 2 | Карточка букета | `/l/[id]` | Купить / Предложить цену | loading/sold/error | 🔵 | фото-каррусель, FreshnessBadge, LikeButton, цена, SellerBadge |
| 3 | Продать (публикация) | `/sell` | Опубликовать | upload-progress/validation-error/success | 🔵 | PhotoUploader 1–5, SizeSelector, FreshnessIndicator, PriceInput, город (FR-010) |
| 4 | Вход (phone+OTP) | `/login` | Войти | sending/invalid-otp/locked | 🔵 | OtpInput, согласие 152-ФЗ (FR-001..004) |
| 5 | Сделка + чат + статус | `/deal/[id]` | Подтвердить получение | paid_held/disputed/released | 🔵 | DealStatusStepper, ChatBubble/Input, DeliveryToggle/tracking |
| 6 | Отзыв | `/deal/[id]/review` | Оставить отзыв | empty/submitted | 🔵 | RatingStars + текст, взаимный, 14 дней (FR-040) |
| 7 | Профиль продавца | `/u/[id]` | — | loading/empty | 🔵 | рейтинг, отзывы, активные объявления (FR-041) |
| 8 | Уведомления | `/notifications` | открыть сделку | empty | 🔵 | статусы сделок, лайки |
| 9 | Город / выбор + поиск/фильтр | `/city`, `/search` | применить | empty/no-results | 🔵 | CitySelector, фильтры |
| 10 | Пустые состояния / нет сети | (overlay) | повторить | — | 🔵 | EmptyState, offline |
| 11 | Админ / очередь модерации | `/admin` | approve/reject | empty/loading | 🔵 | desktop; pending_review, held reviews (FR-060), 2FA |
| 12 | Открыть спор (причина+доказательства) | `/deal/[id]/dispute/new` | отправить спор | reason/error/submitting/success | 🔵 | FLOW-1 шаги 1–2 |
| 13 | Спор (ведение) | `/deal/[id]/dispute` | сообщение/доказательство | open/на рассмотрении/решён, SLA, empty/sending/error/offline | 🔵 | FLOW-1 шаг 3 |
| 14 | Разрешение спора (саппорт) | `/admin/deals/[id]/dispute` | release/refund/partial/escalate | loading/confirm+reason/in-flight/success | 🔵 | desktop; FLOW-1 шаг 4, 4-eyes |
| 15 | Оплата не прошла | `/deal/[id]/pay` (state) | повторить/сменить метод | pending/failed/retry/success | 🔵 | FLOW-4 |
| 16 | Объявление отклонено / апелляция | `/sell` (state) | редактировать/обжаловать | rejected/appealed | 🔵 | FLOW-5 |
| 17 | Удаление аккаунта (DSR) | `/settings/delete` | подтвердить (OTP) | confirm/scheduled/error | 🔵 | FLOW-9 |
| 18 | Пожаловаться | (modal) | отправить жалобу | form/submitting/success | 🔵 | FLOW-10 |

## Component coverage (canon)
Base + domain components per `DESIGN_BRIEF.md §4`. Track per-component status in `VISUAL_COVERAGE.md`.
