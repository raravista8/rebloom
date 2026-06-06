# VISUAL_COVERAGE — live tracker (canon-import vs hand-rolled)

> Per-screen / per-component status across viewports. Update on every canon vendoring (`CANON_PACKAGE_TZ.md §9`) and every UI task (CLAUDE.md UI DoD).
> Сейчас: canon `0.8.0` вендорен и рендерится в `web/` (Next.js 15 + Playwright-харнесс поднят, smoke зелёный). Экраны постепенно подключаются к API; per-screen pixel-baselines добавляются по мере готовности (T2.2). 0.6.2 — лендинг-only: **синхронизирован герой** (бровь «Люди передаривают свои букеты», H1 «…напрямую от людей…», статичное фото `hero-lacybird.png`, ценник «17 200 ₽ → от 4 500 ₽ / −74%», «128 букетов рядом») — раньше прод рендерил старый герой, т.к. `LandingHome.tsx` строился по устаревшей мета-таблице §8.3; **десктопный поповер выбора города** (`NavCity` — port canon-референса, Esc/клик-вне, → /[slug]). CSS доезжает пакетом; JSX-правки портированы вручную в `LandingHome.tsx` (web хэндроллит лендинг, не импортит canon `PdLanding`). 0.6.3 — фикс спейсинга заголовков (двухклассовые `.pdl-sechead .pdl-h2/.pdl-sub` перебивают `.pd-root` ресет) + полировка секций (шаги/эскроу/возражения/финал/фильтры-мобайл) — всё через CSS; портированы JSX: текст шага 1, блок доверия `.pdl-esafe-h` (+ убрана stale-escrow-копия «деньги возвращаются»), пол в отзывах (Артём/Юлия). 0.7.0 — **мобильное бургер-меню** (`components/marketing/MobileMenu.tsx` — порт canon `PdMobileMenu`/`.pdl-drawer`, гость, реальные роуты; **портал в `<body>` + `position:fixed`**, т.к. `.pdl` с `container-type` иначе якорит drawer к полному документу, а не к вьюпорту); фикс отзывов Тимур/Марина (убрана escrow-копия). Бургер на canon-SEO-страницах (`.pds`/`.pdc`, импортятся целиком) скрыт CSS — у canon `PdMobileMenu` зашиты `.html`-ссылки без route-props; ценник «комиссия 5%» из canon НЕ портирован (конфликт с ADR-0013, площадка денег не касается). 0.8.0 — **экспорт пришёл docs-only** (без src/dist), поэтому правки применены web-side: фото на экране логина (`.pad-photo` → `public/hero-lacybird.png` в `LoginFlow`), снятие завершающих точек в заголовках/подзаголовках (6 строк: auth ×3, лендинг ×3 — остальные web-экраны уже чистые), и 3 canon-CSS фикса (A6 спейсинг согласия, A7 выравнивание чекбокса, C `PdNotice text-wrap:pretty`) в `globals.css` как consumer-override (до полного re-export). OTP-клавиатура у web уже системная (`autocomplete=one-time-code` + `inputmode=numeric`, без кастомного нумпада). **Заблокировано**: точки на SEO-страницах (`PdGeoPage`/`PdSafeDeal` импортятся целиком — нужен полный canon src) и OAuth-марки провайдеров (web-auth беднее canon-прототипа).
> Legend: 🔵 spec only · 🟢 canon-import + visual ≤2% · 🟡 hand-rolled (justify) · 🔴 missing/broken

## Screens
| Screen | Mobile (375) | Mobile (414) | Desktop | Visual baseline | Status |
|---|---|---|---|---|---|
| Главная / витрина | 🔵 | 🔵 | 🔵 | — | spec |
| Карточка букета | 🔵 | 🔵 | 🔵 | — | spec |
| Продать | 🔵 | 🔵 | 🔵 | — | spec |
| Вход (OTP) | 🔵 | 🔵 | 🔵 | — | spec |
| Сделка + чат | 🔵 | 🔵 | 🔵 | — | spec |
| Отзыв | 🔵 | 🔵 | 🔵 | — | spec |
| Профиль | 🔵 | 🔵 | 🔵 | — | spec |
| Админ/модерация | n/a | n/a | 🔵 | — | spec |

## Components (canon)
| Component | Status | Notes |
|---|---|---|
| Button / IconButton | 🔵 | all states required |
| Input / Textarea / Select / OtpInput | 🔵 | |
| BouquetCard (+FreshnessBadge,+LikeButton) | 🔵 | hero component |
| FreshnessIndicator | 🔵 | colour + icon (a11y) |
| PhotoUploader | 🔵 | 1–5, progress |
| DealStatusStepper | 🔵 | escrow states |
| ChatBubble / ChatInput | 🔵 | |
| RatingStars / ReviewItem / SellerBadge | 🔵 | |
| BottomNav / TopAppBar / FeedSectionHeader | 🔵 | |
| Money / Badge / Avatar / Skeleton / Toast / Modal / BottomSheet | 🔵 | |
