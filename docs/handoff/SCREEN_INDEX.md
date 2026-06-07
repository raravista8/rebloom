# SCREEN_INDEX — canonical screens (Claude Design canon ⇄ web/ prod)

> Map of screens authored in Claude Design and consumed via `@rebloom/canon`. Source of truth for the design handoff. Parent specs: `DESIGN_BRIEF.md`, `CANON_PACKAGE_TZ.md`.
> Полная логика состояний — `INTERACTION_STATES.md §5`. **Пошаговые ветвящиеся флоу (спор, возврат, отмена, сбой оплаты, апелляция модерации, доставка, удаление аккаунта, жалоба) — `FLOWS.md`.**
> Status: 🔵 spec only · 🟢 canon-import (live) · 🟡 hand-rolled (temp) · 🔴 missing
> Canon version: `0.9.1` (vendored in `packages/canon`, rendering live in `web/`; design-pass ported — метро-ориентир, метро+тип-цветов фильтры, единая `PdWebNav` + `cityLoc` грамматика, `PaymentFailed`-фикс в источнике). `/catalog` — **хэндролл** (`CatalogScreen.tsx`, реальные фото + лайки); импорт canon `PdCatalog` ждёт data-driven `PdCard` (`canon-tasks/canon-0.9.2-pdcard.md`)

| # | Screen | Route (web) | Primary action | Key states | Status | Notes |
|---|---|---|---|---|---|---|
| 1 | Главная / витрина | `/` | открыть карточку | loading/empty/error | 🔵 | две топ-ленты: «самые свежие» + «самые залайканные»; CitySelector; BottomNav (FR-016) |
| 2 | Карточка букета | `/l/[id]` | Купить / Предложить цену | loading/sold/error | 🔵 | фото-каррусель, FreshnessBadge, LikeButton, цена, SellerBadge |
| 3 | Продать (публикация) | `/sell` | Опубликовать | upload-progress/validation-error/success | 🔵 | PhotoUploader 1–5, SizeSelector, FreshnessIndicator, PriceInput, город (FR-010) |
| 4 | Вход (phone+OTP) | `/login` | Войти | sending/invalid-otp/locked | 🔵 | OtpInput, согласие 152-ФЗ (FR-001..004) |
| 5 | Сделка + чат + статус | `/deal/[id]` | Подтвердить получение | agreed/meeting/done/problem/cancelled | 🔵 | PdStepper «Договорились/Встреча/Завершено», ChatBubble/Input, share-point (seller), оплата при встрече (ADR-0013) |
| 6 | Отзыв | `/deal/[id]/review` | Оставить отзыв | empty/submitted | 🔵 | RatingStars + текст, взаимный, 14 дней (FR-040) |
| 7 | Профиль продавца | `/u/[id]` | — | loading/empty | 🔵 | рейтинг, отзывы, активные объявления (FR-041) |
| 8 | Уведомления | `/notifications` | открыть сделку | empty | 🔵 | статусы сделок, лайки |
| 9 | Город / выбор + поиск/фильтр | `/city`, `/search` | применить | empty/no-results | 🔵 | CitySelector, фильтры |
| 9a | **Каталог букетов** | `/catalog` | открыть карточку / показать ещё | loading/loaded/empty/no-results/loading-more/end/error/offline | 🟢 | **browse-first** сетка всех букетов города (canon 0.9.0): `/api/feed` для базы + `/api/search` при фильтрах, метро+тип-цветов мультивыбор, cursor load-more, все состояния. `CatalogScreen.tsx` (canon `PdCatalog` — демо без data-пропсов → реюз `.pdc-*` разметки с live-данными). PUBLIC, без auth-гейта |
| 10 | Пустые состояния / нет сети | (overlay) | повторить | — | 🔵 | EmptyState, offline |
| 11 | Админ / очередь модерации | `/admin` | approve/reject | empty/loading | 🔵 | desktop; pending_review, held reviews (FR-060), 2FA |
| 12 | Открыть спор (причина+доказательства) | `/deal/[id]/dispute/new` | отправить спор | reason/error/submitting/success | 🔵 | FLOW-1 шаги 1–2 |
| 13 | Спор (ведение) | `/deal/[id]/dispute` | сообщение/доказательство | open/на рассмотрении/решён, SLA, empty/sending/error/offline | 🔵 | FLOW-1 шаг 3 |
| 14 | Разрешение спора (саппорт) | `/admin/deals/[id]/dispute` | release/refund/partial/escalate | loading/confirm+reason/in-flight/success | 🔵 | desktop; FLOW-1 шаг 4, 4-eyes |
| 15 | ~~Оплата не прошла~~ | — | — | — | ❌ removed | No payment layer at MVP (ADR-0013) — screen deleted |
| 16 | Объявление отклонено / апелляция | `/sell` (state) | редактировать/обжаловать | rejected/appealed | 🔵 | FLOW-5 |
| 17 | Удаление аккаунта (DSR) | `/settings/delete` | подтвердить (OTP) | confirm/scheduled/error | 🔵 | FLOW-9 |
| 18 | Пожаловаться | (modal) | отправить жалобу | form/submitting/success | 🔵 | FLOW-10 |

## Public SEO / marketing surface (canon `./marketing` 0.4.0, SSG)
Crawlable landing pages from `peredarim-seo-yadro.md`. SSR/SSG, per-page `generateMetadata` + JSON-LD; `sitemap.xml` + `robots.txt` live. Live wiring: geo catalog is a canon teaser (sample data) for now; live per-city counts/catalog deferred until inventory > 0.

| # | Screen | Route (web) | Render | Meta / structured data | Status |
|---|---|---|---|---|---|
| 19 | Гео-лендинг города ×10 | `/[city]` (moskva…ufa) | 🟢 SSG | Title/H1 «…в {loc}», BreadcrumbList+ItemList, canonical | live |
| 20 | Безопасная сделка | `/bezopasnaya-sdelka` | 🟢 SSG | FAQPage+BreadcrumbList | live |
| 21 | Блог (индекс) | `/blog` | 🟢 SSG | Blog+BreadcrumbList | live |
| 22 | Блог (статья ×3) | `/blog/[slug]` | 🟢 SSG | Article+BreadcrumbList | live (canon body templated — 1 written) |
| — | sitemap / robots | `/sitemap.xml`, `/robots.txt` | 🟢 | 10 geo + safe-deal + blog; private routes disallowed | live |

## Component coverage (canon)
Base + domain components per `DESIGN_BRIEF.md §4`. Track per-component status in `VISUAL_COVERAGE.md`.
