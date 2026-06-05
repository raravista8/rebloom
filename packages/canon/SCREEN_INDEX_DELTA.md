# SCREEN_INDEX delta — canon 0.4.0

Canon version: `0.3.0 → 0.4.0`. Adds the **public SEO/marketing surface** (geo pages ×10, safe-deal, blog)
and applies **pickup-only** to the deal/buy screens. Status: 🔵 spec · 🟢 canon-import · 🟡 hand-rolled · 🔴 missing.

| # | Screen | Route | canon import (entry · component) | What changed | Status |
|---|---|---|---|---|---|
| 5 | Сделка / покупка | `/deal/[id]`, `/l/[id]` | `screens` · `Listing`/`ListingDesktop`, `deal` · `DealActive` | **pickup-only**: `DeliveryToggle` removed → static «Самовывоз рядом» row; courier behind `delivery.courier=off` | 🟢 (updated) |
| 12 | Гео-страница города ×10 | `/[city]` | `marketing` · `PdGeoPage` (`data`, `platform`) | NEW — SEO template, declensions+districts (`PD_GEO_CITIES`), working filters, interlinking, FAQ; SSG ×10 | 🔵 → 🟢 |
| 13 | Безопасная сделка | `/bezopasnaya-sdelka` | `marketing` · `PdSafeDeal` | NEW — флоу «оплата при встрече» + «как безопасно купить с рук» + FAQ; trust cluster | 🔵 → 🟢 |
| 14 | Блог (индекс) | `/blog` | `marketing` · `PdBlogIndex` | NEW — supply warm-up, 3 articles | 🔵 → 🟢 |
| 15 | Статья блога | `/blog/[slug]` | `marketing` · `PdBlogArticle` (`article`) | NEW — article template + CTA | 🔵 → 🟢 |
| 16 | SEO-карточка (мета) | `/l/[id]` | `marketing` · `PdSeoMeta` | NEW — Title `{Цветы} за {цена} ₽ рядом, {район} — самовывоз`, alt; overlay on card #2 | 🔵 → 🟢 |

### Adoption checklist (web/)
- `/[city]` SSG via `generateStaticParams` over the 10 city slugs (white-list — must not shadow `/sell`,`/login`,`/deal`,`/u`,`/l`,`/settings`,`/admin`,`/search`); 404 unknown city.
- `generateMetadata` per page (Title/Description/canonical/OG) — table in `CLAUDE_CODE_HANDOFF.md §8`; JSON-LD (ItemList/Breadcrumb/FAQ/Article) + sitemap (10 geo + safe-deal + blog).
- Replace `PD_GEO_CITIES` with the production declension table + live counts.
- Apply `nbsp()` at SSR/build (not the client DOM walker).
- Pickup-only: front always sends `delivery_method=self_pickup`; keep courier code behind `delivery.courier=off`.

---

# SCREEN_INDEX delta — canon 0.3.0

Canon version: `0.2.0 → 0.3.0`. **No new screens** — fixes & finishes screen #4 (Регистрация и вход) so
the OAuth-first canon is adoptable on every platform. Status: 🔵 spec · 🟢 canon-import · 🟡 hand-rolled · 🔴 missing.

| # | Screen | Route | canon import (entry · component) | What changed | Status |
|---|---|---|---|---|---|
| 4 | Регистрация и вход | `/login*` | `auth` · `AuthChooser` … `AuthDesktopChooser/OAuth/Phone/Otp/Register/Welcome` **+ new `AuthDesktopLink/Error/Blocked`** | `AuthDesktopOAuth` `prov` prop; `slots`/`slot` for official SDK buttons; desktop link/error/blocked variants; `PROV_HOST`; `data-provider` | 🟡 prod (legacy phone-only) → 🟢 |

### The prod bug this closes
- **Mobile** `/login` showed **no ID buttons** — prod was on the legacy phone-only login, never adopting `AuthChooser` (OAuth + phone). Adopt `AuthChooser plat={…}` (ID buttons + phone fallback).
- **Desktop** `/login` rendered `AuthPhone plat="web"` (mobile card) inside the marketplace `WebShell`. Use **`AuthDesktop*`** (split layout, standalone page). Full route map in `AUTH_HANDOFF.md §2`.

### Adoption checklist (web/)
- Route map by platform → component (`AUTH_HANDOFF.md §2`); desktop uses `AuthDesktop*`, **not** `plat="web"`.
- Provide `slots` with official provider SDK widgets (Яндекс/Sber/VK/T-ID; Apple iOS-only) — placeholders are not prod-ready.
- Map canon `ya` ↔ API `yandex`; OAuth via backend `/start`→`/callback` (Authorization Code + PKCE).

---

# SCREEN_INDEX delta — canon 0.2.0

Canon version: `0.1.0 → 0.2.0`. Adds the **public site** and upgrades the catalog/search row. Status
legend: 🔵 spec only · 🟢 canon-import (live) · 🟡 hand-rolled (temp) · 🔴 missing.

| # | Screen | Route | canon import (entry · component) | States shipped | Before → After |
|---|---|---|---|---|---|
| 0 | Лендинг (главная сайта) | `/` | `marketing` · `PdLanding` / `PdLandingNav` | guest + authorized header, full page (hero→footer), live catalog teaser | 🔴 → 🟢 |
| 9 | Каталог букетов | `/catalog/[city]` | `catalog` · `PdCatalog` | filters (price·fresh·rating·size), sort, pagination, empty | 🔵 → 🟢 |

### Also in 0.2.0 (no new screens)
- **Responsive**: landing + catalog now switch on container width (`@container` 900px / 1180px), not a forced class — fixes prod rendering mobile at all resolutions (`CLAUDE_CODE_HANDOFF.md §4`).
- **Form states**: `:focus-within` + `:hover` baked into `canon.css` for inputs/checkbox/size/seg/switch/oauth.
- **Brand**: login uses the «Соцветие» mark; header/catalog mark terracotta; clean heart icon; favicon set in `dist/favicon/`.

> ℹ️ The landing route `/` overlaps the legacy "Главная / витрина" feed (screen #1). In prod the marketing
> landing is the public `/` for logged-out visitors; the authenticated app feed (`PdFeed`) lives behind auth.
> Confirm the routing split when wiring (`CLAUDE_CODE_HANDOFF.md §4`).

---

# SCREEN_INDEX delta — canon 0.1.0

Canon version: `0.0.0 → 0.1.0` (first export). Status legend (from `SCREEN_INDEX.md`):
🔵 spec only · 🟢 canon-import (live) · 🟡 hand-rolled (temp) · 🔴 missing.

All screens move **🔵 → 🟢** with this export (first time available as canon imports).

| # | Screen | Route | canon import (entry · component) | States shipped | Before → After |
|---|---|---|---|---|---|
| 1 | Главная / витрина | `/` | `feed` · `PdFeed` / `PdFeedDesktop` | loading (`VitrinaLoading`), empty (`VitrinaEmpty`), loaded | 🔵 → 🟢 |
| 2 | Карточка букета | `/l/[id]` | `screens` · `Listing` / `ListingDesktop` | loaded, sold (`ListingSold`) | 🔵 → 🟢 |
| 3 | Продать (публикация) | `/sell` | `screens` · `SellForm` / `SellDesktop` | rest, content_blocked (`SellBlocked`), published (`SellPublished`), removed+appeal (`SellRemoved`) | 🔵 → 🟢 |
| 4 | Регистрация и вход | `/login` | `auth` · `AuthChooser`, `AuthOAuthSheet`, `AuthPhone`, `AuthOtp`, `AuthRegister`, `AuthLink`, `AuthWelcome`, `AuthError`, `AuthBlocked` (+ `AuthDesktop*`) | rest/invalid/verifying/locked, oauth-consent, знакомство, link, welcome, error/offline, blocked (FLOW-8) | 🔵 → 🟢 |
| 5 | Сделка + чат + статус | `/deal/[id]` | `deal` · `DealActive` / `DealDesktop` | agreed→meeting→done (`DealActive`), problem (`DealProblem`), завершено (`DealDone`) | 🔵 → 🟢 |
| 6 | Отзыв | `/deal/[id]/review` | `deal` · `ReviewForm` | empty, filled | 🔵 → 🟢 |
| 7 | Профиль продавца | `/u/[id]` | `screens` · `Profile` / `ProfileDesktop` | loaded | 🔵 → 🟢 |
| 8 | Уведомления | `/notifications` | `screens` · `Notifications` / `NotificationsDesktop` | list, empty (`NotificationsEmpty`) | 🔵 → 🟢 |
| 8a | Настройки аккаунта | `/settings/*` | `settings` · `SettingsHub`, `SettingsProfile`, `SettingsLogins`, `SettingsPayments`, `SettingsNotifications`, `SettingsPrivacy`, `SettingsSecurity`, `SettingsSelfEmployed`, `SettingsDelete` (+ `SettingsDesktop`) | rest/saving, confirm-otp (delete), toggles | 🔵 → 🟢 |
| 9 | Поиск / фильтр | `/search` | `screens` · `SearchNoResults` / `SearchDesktop` | no-results, similar | 🔵 → 🟢 |
| 10 | Пустые состояния / offline | overlay | `screens` · `Offline`, `forms` · `PdEmpty` | empty, offline | 🔵 → 🟢 |
| 11 | Админ / реактивная модерация | `/admin` | `admin` · `AdminDashboard`, `AdminModeration`, `AdminUsers`, `AdminListings`, `AdminDeals`, `AdminFinance`, `AdminFraud`, `AdminReports` (+ `AdminMobile*`) | KPI, queue, drill, cancel/4-eyes, table states (empty/no-results/error/offline) | 🔵 → 🟢 |

## Components added (coverage)
Primitives: `PdBtn PdChip PdCard PdAvatar PdFreshness PdLikeBtn PdGallery PdField PdInput PdOtp PdSeg PdSizeSel PdStars PdSwitch PdNotice PdEmpty PdSkelCard PdStepper PdBubble PdScreen PdToast PdI`.
Domain shells: feed (mobile+desktop), deal stepper+chat, admin shell+tables+charts.

## Trackers to bump after vendoring (§9 step 7)
- `SCREEN_INDEX.md` canon version `0.0.0 → 0.1.0`, statuses 🔵 → 🟢.
- `VISUAL_COVERAGE.md` — add baselines under `baselines/`.
- `web/CLAUDE.md` — record consumed canon `0.1.0`.
