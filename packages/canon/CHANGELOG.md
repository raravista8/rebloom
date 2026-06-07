# Changelog — @rebloom/canon

All notable changes per export. Newest first. SemVer. (`CANON_PACKAGE_TZ.md §7`)

## [0.9.0] — 2026-06-07 — Design-pass: метро-ориентир, фильтры (метро-мультивыбор + типы цветов), карточки/листинг/форма, единая веб-шапка `PdWebNav` + бургер-драйвер

> Большой визуально-копирайтный апдейт клиентских поверхностей + **новый общий компонент шапки `PdWebNav`** (бар + бургер-драйвер; источник правды для лендинга, каталога и десктоп-экранов). Полная спека — **`CANON_HANDOFF_design-pass.md`** (§0–§12). Прототип-референс в `reference/prototypes/` — единственный источник правды; `src/` сконвертирован из него. JS-бандлы `dist/*.mjs/.cjs` собирает потребитель (`npm run build`).

### ⚠️ Новые data-поля (параллельная backend-задача — `CANON_HANDOFF §0`, для API_CONTRACT)
- **`metro`** — станция метро у объявления (`listing_card`/`listing`), в `POST /listings`; фильтр **`metro[]`** в `/feed`+`/search` с семантикой **OR** («любая из выбранных»). Справочник станций+цвета линий (msk+spb) — `PD_METRO`, `PD_METRO_LINES`, `PD_CITY_METRO` в `src/feed/feed.jsx`. Города без метро → fallback на район.
- **`flower_types[]`** — типы цветов у объявления (фиксированный справочник `PD_FLOWERS`); мультивыбор в форме; фильтр `flower_types[]` (**OR**).
- **«Показать N букетов»** в моб. панели фильтров — счётчик результатов под текущие фильтры до применения (клиентский счёт или count-эндпоинт). [verify]

### Added
- **`src/primitives/web-nav.jsx` → `PdWebNav`** — единая веб-шапка: бар (бренд · город · поиск · уведомления · избранное · аватар · CTA «Опубликовать букет») + бургер→драйвер на мобайле (профиль, город, ссылки, CTA). `auth-aware`-ready (`authed` prop: гость видит «Войти»). Экспортится в `./catalog` и `./marketing`. Источник правды для всех web-шапок.
- **`src/primitives/kit.jsx`** — `PdMetroPicker` (поиск + список станций с цветами линий; режим `multi` с чекбоксами/тегами для фильтров) и `PdFlowerPicker` (мультивыбор типов цветов). Экспорт через `./forms`.
- **`src/feed/feed.jsx`** — справочник метро (`PD_METRO`, `PD_METRO_LINES`, `PD_METRO_INDEX`, `PD_CITY_METRO`, `pdMetroLines`), компоненты `PdMetroLabel`/`PdMetroDots`, списки цветов (`PD_FLOWERS`, `PD_FLOWER_FILTERS`). Экспорт через `./feed`.

### Changed
- **`src/catalog/catalog.jsx`** — фильтры: + метро (мультивыбор) + тип цветов; моб. панель «Все фильтры» (раскрывается из чипа «Фильтры»); сортировка-дропдаун на мобайле; размеры подписаны (S·до 7 / M·7–15 / L·15–25 / XL·25+). Шапка → `PdWebNav` (была inline). Карточки: «Размер L», станция метро вместо города, рейтинг у имени.
- **`src/feed/feed.jsx`** — `PD_FRESH_META`: подписи «Свежий / 1–2 дня / 3+ дня» (enum `today|d1_2|d3_plus` не менялся). `PdCard`: «Размер L», метро вместо города, рейтинг вплотную к имени, ellipsis для длинного имени. Сид-данные дополнены `metro`/`flowers`.
- **`src/screens/discovery.jsx`** (листинг) — город + станция метро; «Самовывоз у м. …»; продавец явно подписан + сделки отдельной статой; состав = текст через «·»; тихая icon-кнопка «Поделиться»; убрана подпись про двор/станцию; цена убрана с кнопок; ровный мета-блок.
- **`src/screens/sell-login.jsx`** (форма) — `PdMetroPicker` вместо «Района»; `PdFlowerPicker` (необязательно); «Когда букет подарили»; убран хинт про 700–1 300 ₽.
- **`src/screens/desktop.jsx`** — те же правки листинга/формы на десктопе; шапка приведена к canon; «Букет M» (без района); «10 месяцев на площадке».
- **`src/screens/deal-notifications.jsx`** — «Букет M» (район не сливается с названием).
- **`src/feed/feed-desktop.jsx`** + **`src/marketing/landing.jsx`** — шапка: «Избранное» (сердце) + CTA «Опубликовать букет»; живой каталог лендинга: метро-мультивыбор + фильтр типов цветов.
- **`dist/canon.css`** — пересобран из источников (pd.css, pd-auth.css, pd-settings.css, pd-web.css, pd-land.css, pd-catalog.css, pd-seo.css). Новое: `.pd-metro/.pd-mdots`, `.pd-mpick*` (+ multi: чекбоксы/футер), `.pd-flowerpick/.pd-fbchip`, `.pd-sharebtn`, `.pd-sellercard/.pd-seller-deals`, `.pd-buy-meta/.pd-buy-spec/.pd-buy-loc`, `.pd-flowerlist`, `.pdc-sortdd`, `.pdc-panel*` (моб. панель фильтров), `.pdc-metrotag`, `.pdl-drawer*` (бургер-драйвер); шапка `.pdw-nav*` приведена к canon; `.pd-size` сделан тихим.

### Reference / prototypes
- Перевендорены из Claude Design: `pd-feed.jsx`, `pd-kit.jsx`, `pd-catalog.jsx`, `pd-webnav.jsx` (новый), `pd-scr-1/2/3.jsx`, `pd-scr-desktop.jsx`, `pd-feed-desktop.jsx`, `pd-land.jsx` + CSS. `src/` байт-в-байт сконвертирован из них (ESM-обёртка: `window`-глобалы → import/export).

### Build / consumer
- JS-бандлы (`dist/*.mjs/.cjs/.d.ts`) НЕ включены — потребитель собирает `npm run build` (tsup). `src/` + `tsup.config.ts` + `package.json` (`exports.*.require → .cjs`, 0.8.1) + `dist/canon.css` + `tokens/` готовы. `web/`-хэндролл (`WebChrome`, `BouquetCard`, `ListingDetail`, `SellForm`, `LandingHome`) портируется руками после вендоринга (`CANON_HANDOFF §11`); `WebChrome` → портировать `PdWebNav`, сохранив `useMe()`-auth-aware.

## [0.8.2] — 2026-06-06 — Fact-fix: SafeDeal «Почему так безопаснее» rewritten no-escrow (ADR-0013) — closes a prototype↔canon drift the SEO audit caught

> **Why a release for a copy change.** The SEO-аудит (2026-06) flagged `/bezopasnaya-sdelka`: a search engine can ignore `<meta>` and surface a body paragraph as the snippet — and this body was **factually wrong**. The «Почему так безопаснее» section still carried **эскроу-проза** that describes a flow the MVP does not have (**ADR-0013**: платформа не держит, не проводит и не возвращает деньги — нет автозакрытия с релизом, нет денежного спора/возврата). The kicker: the **prototype was already fixed** in 0.8.1 (`reference/prototypes/pd-seo.jsx` shipped the no-escrow copy), but the **canonical `src/marketing/seo.jsx` — the file `web/` actually vendors — was never updated.** So прод kept serving stale escrow text. 0.8.2 syncs the canon source to the prototype.

### Changed — `src/marketing/seo.jsx` · `PdSafeDeal` → секция «Почему так безопаснее»
- **Kept** the two intro paragraphs (already correct: «когда платишь при встрече… продавец получает деньги только в обмен на букет… как на любой доске объявлений»; rating/reviews).
- **Removed** both escrow H3 blocks and their lists — they described escrow / auto-release / refund / money-dispute, none of which exist:
  - ~~«Когда деньги уходят продавцу»~~ (нажали «Подтвердить получение» → деньги; «прошёл срок ожидания… сделка закрывается автоматически»).
  - ~~«Когда деньги возвращаются вам»~~ (возврат денег; «открываете спор с фото»; «Поддержка встаёт на вашу сторону по итогам разбора»).
- **Replaced** with the no-escrow message, in two H3 blocks matching the prototype:
  - **«Несколько простых правил»** — meet in a public place, check before paying, chat in-deal, don't send any prepay/deposit.
  - **«Если что-то не так»** — seller no-show / didn't hand over / not-as-listed → **you simply don't pay; money never moves until the bouquet is in your hands, nothing to refund**; report misbehavior to support → warning / restriction / block + the listing is removed; rating & reviews stay with the seller and protect the next buyers.
- **Terminology guardrails (ADR-0013).** «Подтвердить получение» exists as a deal step (moves the deal to `done` and opens reviews) but **does not release money** — copy no longer links it to money. No «деньги уходят/возвращаются», «срок ожидания», «спор» (в денежном смысле), «автозакрытие с релизом», «эскроу», «комиссия». No trailing periods on H2/H3.
- The **FAQ** block on the same page was already correct (no money-escrow claims) — **untouched**.

### Synced — prototype reference
- `reference/prototypes/pd-seo.jsx` + `Передарим · SEO-страницы.html` re-vendored from Claude Design so the prototype and canon `src/` are byte-identical in this section (the «Если что-то не так» bullets were tightened to spell out «возвращать нечего» / «объявление снимем» / «берегут следующих покупателей»).

### Baselines
- Refreshed `/bezopasnaya-sdelka`: **`baselines/desk-09-safe-deal.png`** and **`baselines/mob-28-safe-deal.png`**. Text-only change inside the same layout → expect well under the **`npm run test:visual` ≤ 2%** gate after vendoring.

### Unchanged
- No CSS, token, build, or API changes. `dist/canon.css`, `tokens/`, the cjs build fix and `exports.*.require` → `.cjs` (from 0.8.1) carry over untouched. JS `dist/` bundles are produced by the consumer's build (`CANON_PACKAGE_TZ.md §9 step 4`).

## [0.8.1] — 2026-06-06 — FULL package of the auth-polish set (0.8.0 was docs-only) — folds every 0.8.0 change into `src/` + prebuilt `dist/canon.css`, ships assets, closes 0.7.0 burger-route debt, bakes in the cjs build fix

> **Read first.** 0.8.0 shipped **docs-only** (4 `.md`, no `src/ dist/ tokens/ package.json`), so the consumer had to hand-apply the visible bits in `web/` with temporary overrides, and component-internal fixes stayed blocked. **0.8.1 is the real package** per `CANON_PACKAGE_TZ.md §3/§8`: `src/`, prebuilt `dist/canon.css`, `tokens/`, `package.json` (0.8.1), assets, baselines, docs. After vendoring, `web/` can delete its temp overrides (globals.css 0.8.0 block, the `next.config.mjs` photo rewrite, the SEO-burger hide).
>
> Companion deep-dives in this package: **`OTP_KEYBOARD_AUTOFILL.md`** (keyboard-raise + SMS AutoFill logic, mock-vs-prod) and **`VISUAL_TEXT_CHANGES_0.8.0.md`** (every visual/text change, screen-by-screen).

### Post-review prod fixes (CSS, folded into this package)
Two desktop issues surfaced on прод after the auth-polish set and are fixed here in `src/styles/canon.css` **and** prebuilt `dist/canon.css`:

- **Login aside — background photo invisible.** `img/hero-lacybird.png` is a bouquet on a light‑gray backdrop; at the old `.pad-aside .pad-photo{opacity:.16}` over the terracotta gradient it washed out to nothing. Now the photo renders at **full opacity** (`z-index:0`) with the terracotta as a **semi-transparent overlay on top** — `.pad-aside::after{background:linear-gradient(155deg,rgba(196,80,50,.86),rgba(150,52,34,.96));z-index:1}` — so the bouquet reads as a rich tinted texture and the white headline (z-index:2) stays legible. The `<img class="pad-photo">` element is kept (asset path resolves page-relative, same convention as every other canon image); ship `hero-lacybird.png` at the login route.
- **Desktop catalog filter stacked vertically.** The inline filter row was gated only on the JS `.pdl--desk` modifier, which прод wasn't applying → groups stacked. Moved the row layout into the existing **`@container pdl (min-width:900px)`** block (`.pdl-filters{flex-direction:row;flex-wrap:wrap}` + `.pdl-flabel{flex-basis:auto}`), so it's driven by the `.pdl` **container width**, not the platform class — correct on прод desktop regardless of the modifier, and still stacks in narrow mobile frames. The old `.pdl--desk .pdl-filters` rule is kept (harmless).
  - ⚠️ Separately: прод renders «0 свежих букетов в **Москва**» / «В **Москва** пока нет» — the city isn't declined. Canon hardcodes the locative («в Москве»); `web/` is interpolating a nominative variable. **web/ fix:** feed a pre-declined locative (see the city справочник, `seo.jsx` `CITIES_FULL[].loc`), don't decline algorithmically.

### Now actually in source (was docs-only in 0.8.0)
All of the following previously lived only in prose; 0.8.1 lands them in `src/` and (for CSS) in the prebuilt `dist/canon.css`:

- **Login background photo** (`src/auth/auth.jsx`, `DeskShell`): `.pad-photo` `src` `img/1561181286-d3fee7d55364.jpg` (404 on prod) → **`img/hero-lacybird.png`** (the served landing-hero photo). Asset shipped at `dist/img/hero-lacybird.png`.
- **Official T‑ID mark** (`src/auth/auth.jsx`, `src/styles/canon.css`): `PROV.tid` now carries `img:'img/oauth/tid.svg'`; `OAuthBtn` renders `<img class="mkimg">` when `img` set. CSS `.pa-oauthbtn .mark.pa-mk-tid{background:transparent;width:auto;border-radius:0}` + `.pa-mk-tid .mkimg{height:26px}`. Asset shipped at `dist/img/oauth/tid.svg`.
- **No provider pre-selected** (`OauthList`): dropped the `primary` flag on the first row (Яндекс web/desktop, Apple iOS).
- **Chooser divider** «быстрее всего через сервис» → **«или»**.
- **Welcome CTA** «Продать букет» → **«Опубликовать букет»**.
- **Consent spacing fix** — two-class selector **`.pa .pa-consent`** (margin-top 30px, line-height 1.7) to outrank the reset `.pa p{margin:0}` (specificity bug, same class as 0.6.3 `.pdl-*`). In `src/styles/canon.css` **and** `dist/canon.css`.
- **Consent checkbox** `.pd-check .t{padding-top:3px}`; **`.pd-notice{text-wrap:pretty}`** — both in src + dist CSS.
- **`AuthOtpFill`** — new exported auth screen: OTP step with the system keyboard raised, **no footer** (keyboard owns the bottom inset). Device-frame harness (`reference/prototypes/ios-frame.jsx`/`android-frame.jsx`) gained `kbdAutofill` → surfaces the SMS code in the **system keyboard's suggestion strip** (iOS QuickType / Android Gboard chip). Keyboard stays the **stock OS QWERTY** — the custom numpad draft was reverted. Full prod mapping (`autocomplete="one-time-code"` + Android WebOTP) in `OTP_KEYBOARD_AUTOFILL.md`.
- **No-trailing-period rule** applied across titles/subtitles: auth, landing (`src/marketing/landing.jsx`, 3× `.pdl-sub`), SEO (`src/marketing/seo.jsx`, 5× `.pds-h2-sub`), settings (`src/settings/settings.jsx`, 5× `.pdss-sub`), admin mobile (`src/admin/mobile.jsx`, 3× confirm-sheet `.sub`). Body copy, captions and long error/blocked text keep punctuation. Full list in `VISUAL_TEXT_CHANGES_0.8.0.md §D`.

### Fixed — 0.7.0 debt: `PdMobileMenu` route props
- `MobileMenu` (`src/marketing/landing.jsx`) now accepts an optional **`links`** prop: `const links = linksProp || (auth ? AUTH_LINKS : GUEST_LINKS)`. The default `GUEST_LINKS` still point at `*.html` prototype paths, but `web/` can now pass real routes (`links=[{icon,label,sub,href}]`) instead of hiding the burger. Threaded through the SEO shell so the wholesale-imported pages can pass it too: **`PdGeoPage` / `PdSafeDeal` / `PdBlogIndex` / `PdBlogArticle`** all take an optional **`menuLinks`** prop → `Shell` → `SeoNav` → `PdMobileMenu`. This unblocks the temporary SEO-burger hide in `web/`.

### Build (§3 — do NOT regress)
- **`tsup.config.ts`** now sets `outExtension({format}) => ({ js: format==='esm' ? '.mjs' : '.cjs' })`. Under `"type":"module"`, default cjs output `.js` is parsed as ESM → `require()` breaks; emitting `.cjs` fixes it.
- **`package.json`** `exports.*.require` repointed `./dist/X.js` → **`./dist/X.cjs`** for every entry. Version → **0.8.1**.

### Audited — no change needed
- **«комиссия сервиса 5%»** — searched all of `src/marketing/`; this canon's landing final-CTA does **not** contain a 5% commission line. It already messages «Оплата при встрече» / «Опубликовать букет», consistent with **ADR-0013** (платформа денег не касается). The 5% copy the consumer flagged came from a divergent canon, not this source — **nothing to revert here.** If a real 5% fee is ever introduced it needs an ADR + a collection mechanism (pay-at-meeting is P2P; the platform never touches the money).
- **catalog / feed / screens / nav** titles & subtitles were already period-free.

### Acceptance (per §4 of the consumer TZ)
- zip contains `src/` **and** `dist/`; `dist/canon.css` carries the 3 CSS fixes (`.pa .pa-consent`, `.pd-check .t`, `.pd-notice`) + the T‑ID mark rules. ✔
- `src/` diff vs vendored = exactly the §1–§2 set above. ✔
- `version` = 0.8.1; `exports.*.require` → `.cjs`. ✔
- After vendoring run `npm run build` (emits `dist/*.mjs|.cjs|.d.ts`) then `npm run test:visual` (≤ 2% vs baselines). Note: JS `dist/` bundles are produced by the consumer's build (`CANON_PACKAGE_TZ.md §9 step 4`); only `dist/canon.css` + assets are prebuilt here.

## [0.7.0] — 2026-06-06 — Mobile burger menu (drawer): guest + authorized · new component `PdMobileMenu`

Adds the previously-missing **expanded burger state**. Before this, `.pdl-nav-burger` shipped as a dead trigger — visible on mobile, no panel behind it, so the whole site nav was unreachable on a phone. Now there's a real right-side **drawer** with two content sets (guest / authorized), reused by both the marketing landing (`./marketing` · `PdLanding`) and the SEO pages (`PdGeoPage` / `PdSafeDeal` / blog). New public export **`PdMobileMenu`** from `./marketing`. See **`BURGER_MENU.md`** for the full guest/auth logic, anatomy, and route map.

### Added — `PdMobileMenu` drawer (`src/marketing/landing.jsx`)
- **Right-anchored sheet + scrim.** `width:min(88%,360px)`, slides in over a dimmed backdrop. Open via burger tap; close via the ✕, a scrim tap, or **Esc**. Focus moves to the close button on open. Honors `prefers-reduced-motion` (no transform/opacity transition).
- **Containment.** `.pdl` now carries `position:relative`; the drawer is `position:absolute; inset:0` against it, so the sheet covers exactly the **app/viewport frame** — not the full (taller) scroll document. (Earlier `position:fixed` resolved against the layout viewport and escaped framed/scaled contexts.)
- **Guest content:** inline-expanding city picker → site nav (Каталог букетов / Как это работает / Безопасная сделка / Приложение) → footer with the primary CTA «Опубликовать букет» + «Войти».
- **Authorized content:** profile row (avatar · «Профиль и отзывы» · rating) → city picker → account sections (Каталог букетов · Избранное `12` · Мои букеты · Сделки и чат `2` · Уведомления • · Настройки) → footer with the CTA + «Выйти из аккаунта». **No search field** in the drawer (search lives in the top bar).
- **Wiring:** `Nav` (landing, both `auth` states) and `SeoNav` (SEO pages) hold a `menu` boolean, render the burger with `aria-expanded` + `onClick`, and mount `<PdMobileMenu>` as a **sibling of `<header>`** (not inside the sticky nav) so absolute containment resolves against `.pdl`.

### Changed — burger links are now route-absolute (`landing.jsx`)
- Guest drawer links no longer use bare in-page anchors (`#how` / `#safety` / `#app`) — those 404'd when the burger was opened on a non-landing page (catalog / SEO). They now point at absolute targets: **Как это работает → landing `#how`**, **Приложение → landing `#app`**, **Безопасная сделка → the dedicated SafeDeal page** (`PdSafeDeal`, was an in-landing anchor), **Каталог букетов → catalog**. (In `reference/prototypes/*` these are the `.html` preview filenames; in `web/` map to `/`, `/#how`, `/#app`, `/bezopasnaya-sdelka`, `/catalog`.)
- Vocabulary aligned to the **website** lexicon: the first drawer item is **«Каталог букетов»** in *both* guest and authorized states (an earlier draft labeled the authorized one «Лента», which matched neither the site’s «Каталог» nor the app’s «Главная»).

### Changed — reviews copy: kill residual escrow-era phrasing (`landing.jsx`)
- Two testimonials still leaned on the pre-pivot online-payment model. Rewritten to be unmistakably **pay-on-meeting / no-prepayment**:
  - **Тимур (покупатель):** → «Никакой предоплаты: договорились в чате, встретились у метро и я заплатил уже на месте, когда увидел букет. Всё честно.»
  - **Марина (продавец):** → «Опубликовала за минуту с телефона. Покупатель забрал букет в тот же вечер и расплатился при встрече, наличными.»

### CSS (`src/styles/canon.css` + `dist/canon.css`)
- New block after the `.pdl-nav-burger` rules: `.pdl{position:relative}`, `.pdl-drawer` / `-scrim` / `-panel` / `-top` / `-x` / `-body` / `-prof` / `-city` (+ inline list) / `-nav` / `-row` (icon · text · badge · dot · chevron) / `-foot` / `-note` / `-text`, plus a `prefers-reduced-motion` guard. Burger trigger stays `display:none` ≥900px, so the drawer is mobile-only. **No token changes.**

### Notes for the consumer
- New export `PdMobileMenu` (`./marketing`). Rebuild `dist/*.js` via `npm run build`. `reference/prototypes/pd-land.{jsx,css}` and `pd-seo.jsx` are byte-current with the design source. Design-system tab gains a «Мобильное меню · бургер» specimen (guest + authorized, live).

## [0.6.3] — 2026-06-06 — Landing visual polish: steps / escrow / objections / final CTA + section-header spacing fix

Landing-only patch (`./marketing` · `PdLanding`). `reference/prototypes/pd-land.{jsx,css}` are byte-current; `src/marketing/landing.jsx` + `dist/canon.css` + `src/styles/canon.css` re-synced — rebuild `dist/*.js` via `npm run build`. Pure presentation pass on the lower landing (how-it-works → escrow → objections → app → final CTA) plus a real spacing-cascade fix; **no structural/route changes**.

### Fixed — section-header spacing was silently a no-op (root cause of every «паддинг тесный»)
- The global reset **`.pd-root p, .pd-root h1, .pd-root h2 { margin:0 }`** has specificity `(0,0,1,1)` and therefore **outranks** the single-class `.pdl-h2` / `.pdl-sub` / `.pdl-h1` / `.pdl-lead` `(0,0,1,0)`. Result: every kicker→heading→subtitle gap resolved to `0` and the only visible separation was line-leading — so prior margin tweaks on those classes never took effect.
- Re-asserted the rhythm with **two-class selectors that win the cascade**: `.pdl-sechead .pdl-h2` + `.pdl-sechead .pdl-sub` (14px), `.pdl-app-in .pdl-h2` + `.pdl-app-in .pdl-sub` (14px), and new `.pdl-hero .pdl-h1` + `.pdl-hero .pdl-lead` (14px). One consistent **14px** heading→subtitle gap across catalog / how / escrow / reviews / objections section heads, the app block, and the hero. `.pdl-h2` base `line-height 1.1→1.14` for multi-line mobile headings.

### Changed — «Как это работает» steps (`.pdl-step`)
- Bigger cards (desk padding `30→38px`, radius `18→20`), bigger number badge (`42→58px` desk, radius `18`, font `27`), bigger `h3` (`19→24px` desk) and body (`14.5→16px` desk).
- Reads as a journey now: a **connector chevron** threads cards 1→2→3 (`.pdl-step:not(:last-child)::after`, pinned to the badge row at `top:67px`).
- **Role colour-coding** — seller steps keep terracotta badge/tag; the **buyer** step (3) flips to fresh-green (`.pdl-step:last-child .pdl-stepn` / `.pdl-seller-tag`). Role tags are now pills, seller = terracotta, buyer = green (were uniform green squares).
- Hover lift (`translateY(-4px)` + soft shadow).
- Copy: step-1 body → «Вам подарили букет, он порадовал и уже не нужен.» (`landing.jsx`).

### Changed — escrow (dark) block (`.pdl-escrow` / `.pdl-eflow` / `.pdl-esafe`)
- **Warm radial glow** on the dark field (terracotta 16% from top-right) instead of flat ink, for depth.
- Flow items **restacked vertically** (badge on top, like the steps); badges enlarged (`32→46px`, radius `14`, font `20`, gold + drop glow), `h4` `15.5→19px`, body `13.5→15px`; gold connector chevron threads 1→2→3; hover lift.
- **Trust note redesigned.** Previously an icon-left card that, when stacked on mobile, read as a 4th numbered step and broke the optical vertical (heart centred against tall multi-line text). Now a **captioned callout**: heart inline with the bold heading on the first line (`.pdl-esafe-h`), body below at the same left edge; surface is a faint **gold tint** (was green-tinted, then frosted), icon `28→22px`. **Markup change** in `landing.jsx`: `.pdl-esafe` now contains `<p class="pdl-esafe-h"><HeartHands/><b>…</b></p>` + a separate `<p>` body.

### Changed — objections «А вдруг…» (`.pdl-objc`)
- The «?» token moved **above** the question (column layout) so each heading gets the full card width and wraps evenly (`text-wrap:balance`) — fixes the ragged hanging-indent breaks beside the inline badge. Badge is now a `38px` circle. Bigger question (`16.5→19.5px` desk) and body (`14.5→16.5px` desk), more padding, hover lift.

### Changed — final split CTA (`.pdl-finalc`)
- Cards are flex columns with the button **pinned to the bottom** (`.pdl-finalc > :last-child{ margin-top:auto }`) so both CTAs align regardless of copy length.
- **Buyer card recoloured** white → (green, rejected as clashing with its terracotta button) → **warm oat/sand `#ECE4D6`**, so it pairs cohesively with the terracotta seller card. Seller card gets a deeper gradient + drop shadow. Eyebrow labels `12→13px`, forced one line (`white-space:nowrap`); body `15→16.5px` desk. Hover lift on both.

### Changed — catalog filters on mobile (`.pdl-filters`)
- On narrow containers the bar **stacks**: each group’s label sits on its own line above its chips (`.pdl-flabel{ flex-basis:100% }`), groups stacked vertically — no more chips wrapping raggedly under the labels. `.pdl--desk` restores the single inline row.

### Changed — reviews copy (`landing.jsx`)
- Fixed two gender mismatches: the buyer card «Взяла… к свиданию» → masculine «**Взял**…», author Вера → **Артём** (Екатеринбург); the seller card author Никита → **Юлия** (Москва).

### Notes for the consumer
- `dist/canon.css` + `src/styles/canon.css` updated across the whole landing block (steps, escrow + esafe, objections, final CTA, filters, section-header / hero / app spacing). `src/marketing/landing.jsx` updated (esafe markup, step-1 copy, two review entries).
- **No token changes.** Patch is landing-scoped — no other surface touched since 0.6.2.

## [0.6.2] — 2026-06-06 — Hero vendoring fix + desktop city popover + header consistency

Landing-only patch (`./marketing` · `PdLanding`). `reference/prototypes/pd-land.{jsx,css}` are byte-current; `src/marketing/landing.jsx` + `dist/canon.css` + `src/styles/canon.css` re-synced — rebuild `dist/*.js` via `npm run build`. **`CLAUDE_CODE_HANDOFF.md §0` is the acceptance checklist for this version — read it before vendoring.**

### Fixed — hero never reached prod (the reason for this version)
- **Hero contract corrected.** 0.6.0 changed the hero in the component, but prod kept rendering the **old** hero (eyebrow «Вторая жизнь букетов», H1 «…дешевле цветочного магазина», no photo, «от 690 ₽ / −60%»). The `web/` build followed the **meta-contract table (§8.3), whose H1 was still the pre-0.6.0 string**, so eyebrow / H1 / lede / photo / price tag were never re-vendored. **§8.3 H1 is now synced to the component** and §0 lists every hero field with its canonical value so this can't silently regress.
- No visual change to the canon hero itself — the canonical values are exactly those authored in 0.6.0 (eyebrow «Люди передаривают свои букеты»; H1 «Свежие букеты *напрямую от людей*, в 2–3 раза дешевле магазина»; lede «Букет подарили…»; photo `hero-lacybird.png`; price `17 200 ₽ → от 4 500 ₽`, badge `−74%`; live-count «128 букетов от людей рядом»).

### Added — desktop city picker
- **`.pdl-citymenu` popover.** The header «📍 Москва ▾» (`.pdl-nav-city`) now opens an anchored desktop dropdown: the full list of all 10 cities with live counts + checkmark on the current city (no search field — all rows fit without scrolling). Replaces the **mobile full-screen «Город» page** that prod was rendering on desktop. New `NavCity` wrapper owns open/close + selection; the outside-click/Esc ref sits on the wrapper (button + menu) so a **second click on the trigger reliably closes** it; `align` (`l`/`r`) flips the anchor edge. `web/` wires the real city dictionary + persisted geo (see HANDOFF §8.2). Entrance animation animates **transform only** (no opacity) so SSR / paused-frame renders are never invisible.

### Changed — header consistency
- **City selector position unified.** Now sits immediately after the brand in **both** guest and authorized headers (the guest header previously placed it on the right by «Войти»). One position across states.
- **Authorized-header CTA → «Опубликовать букет».** The landing header preview used the in-app verb «Продать букет» while the rest of the marketing surface says «Опубликовать букет»; on the landing the brand voice wins. **In-app** authenticated surfaces (feed/catalog/sell) intentionally keep «Продать букет».

### Fixed — avatar ring
- **`.pdl-nav-ava`** is a `<button>` that never reset its UA border, leaving a dark ring around the terracotta avatar. Added `border:none; padding:0; cursor:pointer`.

### Notes for the consumer
- `dist/canon.css` + `src/styles/canon.css` updated (`.pdl-citymenu*`, `.pdl-cityrow*`, `.pdl-nav-city` hover/open/chev, `.pdl-nav-ava` border reset). No token changes.
- Patch is landing-scoped — no other surface touched since 0.6.1.

## [0.6.1] — 2026-06-05 — Landing hero: mobile layout, header city selector, trust trim

Landing-only patch (`./marketing` · `PdLanding`). `reference/prototypes/pd-land.{jsx,css}` are byte-current; `src/marketing/landing.jsx` + `dist/canon.css` re-synced — rebuild `dist/*.js` via `npm run build`.

### Changed — marketing landing
- **Mobile hero reworked.** The old stacked «text → photo below» read as a disjointed «bouquet at the bottom», and a tried full-bleed-photo-background overlay overlapped badly. Final: on narrow containers the **photo is a bounded banner on top** (`order:-1`, `aspect-ratio:16/9`, price tag + live-count chips contained inside the card), with the dark text block below. Scoped to `@container pdl (max-width:899.98px)` so the **desktop side-by-side hero is untouched**. (Inert `.pdl-heroscrim` span kept, `display:none`.)
- **Header city selector.** Guest nav gains a tappable «📍 Москва ▾» (`.pdl-nav-city`) so a visitor sees their city in the first seconds and can switch it. On **mobile** it sits where «Войти» was; **«Войти» moves under the hamburger** (`.pdl-nav-login` now `display:none` on mobile, shown on `.pdl--desk` + container ≥900). `web/` wires the real city picker + persisted geo.
- **Trust trimmed.** Removed «Рядом с домом» from the hero trust chips **and** the «Как это работает» advantages — both now read «В 2–3 раза дешевле · Оплата при встрече» (pickup is covered elsewhere; the chip duplicated the headline).

### Notes for the consumer
- `dist/canon.css` + `src/styles/canon.css` updated (mobile-hero container block, `.pdl-nav-login` visibility, `.pdl-heroscrim` base). No token changes.
- Patch is landing-scoped — no other surface touched since 0.6.0.

## [0.6.0] — 2026-06-05 — C2C-forward landing hero + settings без денег + copy pass

**Source of truth synced:** all changes were authored in the design prototypes; `reference/prototypes/*`
(and the new hero asset `reference/prototypes/img/hero-lacybird.png`) are byte-current. `src/*` and
`dist/canon.css` are re-converted from them — rebuild `dist/*.js` via `npm run build` (§9 step 4).

### Changed — settings (`./settings`)
- **«Способы оплаты» (payments) and «Самозанятость» (self-employment) removed entirely** — hub rows, mobile screens, desktop two-pane nav + panes, and module exports (`SettingsPayments`, `SettingsSelfEmployed` no longer exported). Rationale: in the current model the platform handles **no money** (pay-on-meeting, peer-to-peer), so a payouts/receipts surface was dangling. Hub group «Аккаунт» is now **Профиль · Способы входа** only. `web/` must drop the `/settings/payments` and `/settings/self-employed` routes.

### Changed — marketing landing (`./marketing` · `PdLanding`)
- **Hero re-led on the C2C story** (the platform under-communicated that real people resell their own gifted bouquets). Eyebrow → «Люди передаривают свои букеты»; **H1 «Свежие букеты _напрямую от людей_, в 2–3 раза дешевле магазина»** (accent on «напрямую от людей»); lede rewritten to spell out the mechanic («Букет подарили, он порадовал и уже не нужен. Вместо мусорки свежие цветы за полцены находят нового хозяина…»).
- **Hero composition fixed:** `text-wrap:balance` on `.pdl-h1`, desktop H1 `60→50px`, text column `1.08fr→1.16fr`, hero image top-aligned (`align-self:start`), and «2–3» kept on one line (`white-space:nowrap`) — kills the one-word-per-line ragging.
- **New hero asset + price proof:** `hero-lacybird.png` (premium studio bouquet); price tag `17 200 ₽ → от 4 500 ₽`, badge `−74%`; live-count «128 букетов от людей рядом».
- An interim seller-avatar trust row was added then **removed** per review (kept the headline carrying the message).

### Changed — SEO geo page (`./marketing` · `PdGeoPage`, `PdSeoMeta`)
- Geo hero **H1/intro mirror the landing**, city substituted: «Свежие букеты _напрямую от людей_ в {городе}, в 2–3 раза дешевле магазина» + «…находят нового хозяина в {городе}…». Visible `PdSeoMeta` **H1** synced; **Title/Description left as the keyword snippet** (Title ≠ H1 is intentional). «2–3» nowrap applied.

### Changed — admin (`./admin`)
- Жалоба resolution action **«Решить» → «Разобрать»** (desktop reports table + mobile complaint card).
- **Finance** plashka reworded: «Платежи **идут** между пользователями напрямую, площадка их не обрабатывает…» (de-em-dashed).
- **Overview KPI «Оборот сделок»** gains an «оценка по завершённым» caption — consistency with the Finance plashka (the platform can't see payments, so turnover is an estimate).

### Copy
- Interface text de-em-dashed across client app + admin (clause-connector «—» → comma/colon) per the reviewed copy revision; city normalized to Москва. SEO **H1/Title keep dashes** (snippet format — intentional). Sources: `glavnaya-seo-redacted.md`, prior `copy1-redacted.md`.

### Notes for the consumer
- `dist/canon.css` updated (landing hero block: balance/size/column/align + nowrap). `src/styles/canon.css` mirrors it.
- `src/marketing/seo.jsx` had pre-existing copy drift vs the prototypes in a few safe-deal/rules sentences — **`reference/prototypes/pd-seo.jsx` is authoritative** for this revision; reconcile on vendoring.
- New asset `hero-lacybird.png` lives under `reference/prototypes/img/`; wire the real CDN asset in `web/`.

## [0.5.0] — 2026-06-05 — Без онлайн-оплаты: модель «оплата при встрече» (убран эскроу)
- Сделка больше не проводит платежи: статусы `agreed → meeting → done` (+ `problem`, `cancelled`); эскроу/выплаты/комиссия/возвраты/чарджбэки удалены.
- Расчёт между пользователями напрямую при встрече (наличные/перевод). Споры → жалобы в поддержку/модерацию.
- Экран «Оплата не прошла» удалён. Лендинг/SEO/настройки/админка переописаны под оплату при встрече. Монетизация — отдельный ADR post-MVP.

## 0.4.0 — 2026-06-05 · marketing SEO pages (geo ×10 · safe-deal · blog) + pickup-only

**Adds the public SEO/marketing surface** that converts the semantic-core work into canon, and applies
the **pickup-only** product decision across customer-facing UI. Semantic core: `semantica_peredarim/peredarim-seo-yadro.md`.
Implementation spec for `web/`: `CLAUDE_CODE_HANDOFF.md §8`. Semantic core: `reference/peredarim-seo-yadro.md`.

### Added — `./marketing`
- **`PdGeoPage`** — city SEO landing template (`data: CityData`, `platform`). One template → 10 cities; city declensions (nom/loc/gen) + districts + `metro` flag are **data** (`PD_GEO_CITIES`), not computed. Sections: hero (eyebrow/H1/lede/trust), live catalog with working price·freshness filters, districts/cities/occasions interlinking, FAQ. Copy auto-drops «у метро» where `metro:false` (Челябинск/Красноярск/Уфа). Только Title/H1 несут город (Директ — таргетингом, ядро §2.3).
- **`PdSafeDeal`** — «Безопасная сделка»: 3-step «оплата при встрече» flow + «как безопасно купить с рук» + FAQ + CTA. Trust cluster; снимает возражение «обман».
- **`PdBlogIndex` / `PdBlogArticle`** — мини-блог (supply warm-up): 3 статьи + article template with «Опубликовать букет» CTA. Темы из ядра.
- **`PdSeoMeta`** — visible meta-plate (Title/Description/H1/alt preview); for `web/` the real meta goes via `generateMetadata` (§5 table).
- **`PdLandingFooter`** — landing footer now exported (reused by all marketing pages).
- **`nbsp(string)`** — SSR-safe typographer (pure string→string): glues short prepositions/conjunctions + numbers, keeps dashes/middots off line-start. Replaces the design-time DOM walker for prod (no layout shift, crawler-visible).

### Added — tokens (`tokens/theme.css`, `canon.css`)
- **Heading→subheading spacing system:** `--pds-gap-eyebrow / -deck / -lede / -sechead / -qa` (mobile base + `.pds--desk` step-up). One token per relationship — kills ad-hoc margins.
- **Intrinsic card grid:** `--pds-card-min` (240px) + `.pds-grid` `repeat(auto-fill, minmax(min(100%, var(--pds-card-min)), 1fr))` with `min-width:0` on children. Grid self-drops a column when cards won't fit → 1-up on narrow mobile, 4-up desktop; never overflows the viewport.

### Changed / Fixed — pickup-only
- **`DeliveryToggle` removed** from buy/deal screens (`screens/discovery.jsx`, `screens/desktop.jsx`): the «Самовывоз/Курьер» segmented control → a static **«Самовывоз рядом»** row. Courier deferred behind `delivery.courier=off` (growth lever; backend `delivery_method` contract kept forward-compatible).
- **Landing copy** (`marketing/landing.jsx`): «самовывоз или доставка по городу» → «самовывоз рядом / у дома или метро» (advantages + escrow step 2); footer link «Доставка и самовывоз» → «Самовывоз рядом».
- **Specificity fix (canon-wide gotcha):** heading-gap rules are scoped under `.pds` (`.pds .pds-intro`…) so they beat the global `.pd-root p{margin:0}` reset (0,1,1) — single-class rules silently collapsed to 0 otherwise.

### Notes for the consumer
- `./marketing` exports map unchanged structurally (entry re-exports new names) — rebuild `dist/*.js` via `npm run build` (§9 step 4); verify ASCII markers (`grep -l "PdGeoPage" dist/marketing.js`).
- `dist/canon.css` updated (appended `.pds-*` block). `tokens/theme.css` gained the `--pds-*` tokens.
- **City data is a placeholder** — `web/` replaces `PD_GEO_CITIES` with the real declension table (esp. «Санкт-Петербург», «Нижний Новгород») and live counts.
- **Typographer**: use `nbsp()` at SSR/build, not the client DOM walker — see `CLAUDE_CODE_HANDOFF.md §5`.

## 0.3.0 — 2026-06-05 · auth: OAuth ID on every platform + desktop split fix

**Fixes the broken login on prod** and finishes the OAuth wiring. Two prod symptoms, one root cause —
`web/` was on the **legacy phone-only** auth and never adopted the OAuth-first canon: mobile `/login`
showed *no* ID buttons (Яндекс/Sber/VK/T-ID), and desktop `/login` rendered the **adaptive mobile
card** (`AuthPhone plat="web"`) centered inside the marketplace `WebShell` instead of the **desktop
split** (`AuthDesktop*` → brand aside + card). The correct screens already shipped in 0.1.0 — this
version makes them adoptable and documents the exact wiring in `AUTH_HANDOFF.md`.

### Added
- **`AuthDesktopOAuth` `prov` prop** (`'ya' | 'sber' | 'vk' | 'tid'`) — desktop OAuth consent popup now renders the chosen provider (host + consent body), instead of being hard-pinned to Яндекс.
- **Official-button slots** on `OAuthBtn` / `OauthList` — new optional `slots` map (`{ ya:<…/>, vk:<…/> }`) and `slot` prop. When a provider's slot is supplied, canon renders that node (the real SDK widget — VK ID One Tap, Яндекс/Sber/T-ID branded button, native Apple) in place of the design placeholder. `web/` mounts SDK widgets here **without forking** the component. New `.pa-oauthbtn--slot` style (unstyled mount, full-width child, `min-height:50px`).
- **Desktop variants `AuthDesktopLink` / `AuthDesktopError` / `AuthDesktopBlocked`** — link-accounts, error/offline (`offline` prop), and access-blocked now have proper `DeskShell` split-layout versions, so desktop no longer falls back to `plat="web"` mobile cards.
- **`AUTH_HANDOFF.md`** — implementation spec for `web/`: platform→component route map (the desktop fix), full OAuth flow (backend-mediated Authorization Code + PKCE), per-provider notes (Яндекс ID / Sber ID / VK ID / T-ID / Apple-iOS), `prov`/`slots` usage, canon `ya`↔API `yandex` key mapping, phone/OTP states, consent (152-ФЗ), API binding, security, acceptance criteria.

### Changed / Fixed
- **Consent host** now derived from a single `PROV_HOST` map (consent header + desktop popup chrome agree); display-only — the real authorize URL comes from backend `/start`.
- `data-provider={k}` added to every OAuth row for analytics / SDK targeting in `web/`.

### Notes for the consumer
- `./auth` entry is `export *` — the new `AuthDesktopLink/Error/Blocked` are already exported; no exports-map change. `dist/canon.css` updated (`.pa-oauthbtn--slot`); rebuild `dist/*.js` via `npm run build` (§9 step 4).
- **Provider marks remain placeholders by default.** Prod MUST supply `slots` with official SDK widgets per each provider's brandbook — placeholders are not prod-ready (`AUTH_HANDOFF.md §4`).
- Desktop `AuthDesktop*` is a standalone page — do **not** wrap it in the marketplace `WebShell`/site header.

## 0.2.0 — 2026-06-05 · marketing site + catalog + responsive fix

**Adds the public site** (marketing landing + bouquet catalog) and fixes the responsive system that
made prod render mobile on every resolution. Ships the implementation spec in `CLAUDE_CODE_HANDOFF.md`.

### Added
- **Marketing landing** (`./marketing`) — `PdLanding`, `PdLandingNav`: hero with live-count + price proof, live catalog teaser (working sample filters), how-it-works, advantages, reviews, escrow (dark), objections, app badges, split seller/buyer CTA, footer. Guest + authorized header states in one render.
- **Catalog** (`./catalog`) — `PdCatalog`: sidebar (desktop) / chip-bar + sheet (mobile) filters (price · freshness · seller-rating · size), sort (свежие/дешевле/дороже/рейтинг), «Показать ещё» pagination, empty state.
- **Favicon set** — `dist/favicon/` (terracotta tile + «Соцветие» + amber center): `favicon.svg`, `favicon.ico`, `favicon-16/32`, `apple-touch-icon` (180), `icon-192/512`, `site.webmanifest`.
- **`CLAUDE_CODE_HANDOFF.md`** — exact logic for `web/`: fast catalog (URL state · server-side filter + keyset pagination · RSC/streaming · skeletons · image CDN · prefetch), filter behaviour, and form hover/focus/validation/OTP state machines.

### Changed / Fixed
- **Responsive breakpoints (the prod bug).** Landing + catalog switched layout *only* via a forced `.pdl--desk`/`.pdc--desk` class (set by the prototype `platform` prop). With no width breakpoints, prod fell back to the mobile base at every resolution. Now driven by **container queries** (`@container`, 900px; catalog grid → 4-col at 1180px) so one markup is correct on phone and desktop. The `--desk` class is kept as a static-prototype fallback.
- **Form interaction states** baked into `canon.css`: real `:focus-within` rings on `.pd-input` (danger variant preserved), plus `:hover` on inputs/checkbox/size-select/segmented/switch and `:hover`+`:focus-visible` on OAuth rows. Components now carry focus/hover out of the box — stop forcing `state="focus"` in prod.
- **Brand mark on login** — auth (mobile + desktop) now uses the «Соцветие» mark instead of the gift glyph; desktop aside brand gets the mark + flex alignment.
- **Brand mark color** — header/catalog mark pinned terracotta (`.pdl-brand svg`), wordmark stays dark; footer stays white (inverse lockup). Resolves the black-header vs terracotta-login inconsistency.
- **Heart icon** — replaced the asymmetric like/favourite/welcome heart path with a clean symmetric one across feed, kit, auth, landing.
- **Copy** — landing + catalog microcopy de-em-dashed to match the reviewed copy revision.

### Notes for the consumer
- New entries registered in `package.json` exports and `tsup.config.ts` → `npm run build` emits `dist/marketing.*` and `dist/catalog.*`.
- `dist/canon.css` updated (landing + catalog + responsive + form states); `dist/*.js|.d.ts` still built by your `npm run build` (§9 step 4).
- Container queries need a width-bearing parent for `.pdl`/`.pdc` — see `CLAUDE_CODE_HANDOFF.md §4`.

## 0.1.0 — 2026-06-04 · first canon export

**Initial canon.** Full client + operator-admin UI extracted from the reviewed Claude Design
prototypes into a versioned package with semantic tokens and in-package motion.

### Added
- **Tokens** — `tokens/theme.css` (semantic `--pd-*` CSS vars, direction «Воздух»/A), `tokens/tailwind-preset.ts`, `tokens/motion.ts` (durations/easings/springs + Framer variants + reduced-motion helper, per `MOTION.md`).
- **Primitives** (`./buttons`, `./cards`, `./forms`) — PdBtn, PdChip, PdCard, PdAvatar, PdFreshness, PdLikeBtn, PdGallery, PdField, PdInput, PdOtp, PdSeg, PdSizeSel, PdStars, PdSwitch, PdNotice, PdEmpty, PdSkelCard, PdStepper, PdBubble, PdScreen, PdToast, PdI (icon set).
- **Feed** (`./feed`) — PdFeed (adaptive mobile), PdFeedDesktop, top/bottom nav, section heads, themes metadata.
- **Listing / Search / Profile / Deal** (`./screens`, `./deal`) — vitrina (loading/empty), listing (+sold), search (no-results), profile (+review form), deal (paid_held/disputed/released), payment-failed, notifications (+empty/offline); desktop compositions.
- **Auth** (`./auth`) — OAuth (Яндекс/Sber/VK/T-ID; Apple·iOS) + phone/OTP (typing/verifying/invalid/locked), знакомство, account-link, welcome, error/offline, access-blocked (FLOW-8) — mobile + desktop.
- **Settings** (`./settings`) — hub, profile, logins/привязки, payments, notifications, privacy (152-ФЗ), sessions, self-employment (FLOW-7), delete-account + OTP confirm (FLOW-9).
- **Admin** (`./admin`) — desktop overview/KPI, users (+drill), listings, deals (+cancel/4-eyes), finance/ledger, antifraud (+cluster), reactive moderation (+remove sheet), reports; plus the full mobile admin set.
- **Styles** — `dist/canon.css` prebuilt; hover/press/focus, skeleton-shimmer, like-pop, sheet, reduced-motion all in CSS.
- Build contract: `tsup.config.ts` (one bundle per entry point, ASCII charset for Cyrillic escaping), `tsconfig.json`, full `package.json` exports map.

### Copy
- All interface copy reflects the reviewed copy revision (city normalized to Москва; em-dash clause-connectors removed; reworded buttons «Сохранить и продолжить» / «Повторить вход» / «Повторить оплату» / «Оставить в ленте»; OTP-lock and self-employment microcopy). Source: `copy-redacted.md`.

### Notes for the consumer
- `dist/*.js|.d.ts` are produced by `npm run build` during vendoring (§9 step 4); only `dist/canon.css` is prebuilt in this zip.
- Baselines for pixel-diff are under `baselines/`; screen status in `SCREEN_INDEX_DELTA.md`.
- This is the **first** export → bumps the consumer's tracked canon version `0.0.0 → 0.1.0` (`SCREEN_INDEX.md`, `VISUAL_COVERAGE.md`, `web/CLAUDE.md`).
