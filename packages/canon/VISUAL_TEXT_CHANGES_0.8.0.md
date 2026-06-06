# Visual & text changes — canon 0.8.0

Exhaustive, change-by-change. Pairs with `CHANGELOG.md` (rationale) and
`OTP_KEYBOARD_AUTOFILL.md` (the keyboard state). Grouped by surface. Every item notes the **file**,
the **selector/string**, **before → after**, and **why**.

Legend: 🎨 visual · ✍️ text/microcopy · 🐛 fix

---

## A. Login / registration (`auth` · `pd-auth.jsx`, `pd-auth.css`)

### 🐛 A1 — Login background photo (the reported prod bug)
- **Where:** desktop split login, brand aside — `DeskShell` → `<img class="pad-photo">`.
- **Before:** `src="img/1561181286-d3fee7d55364.jpg"` — **not deployed on prod**, so the terracotta
  aside rendered with **no photo** behind the headline.
- **After:** `src="img/hero-lacybird.png"` — the **same “lacy bird” bouquet photo used by the landing
  hero**, which is already served in prod.
- **Unchanged:** CSS `.pad-aside .pad-photo{ position:absolute; inset:0; opacity:.16; object-fit:cover; width:100%; height:100% }`. The photo is a faint texture under the gradient, not a focal image.
- **Ship:** ensure `img/hero-lacybird.png` is reachable from the login route.

### 🎨 A2 — Official T‑ID provider mark
- **Where:** OAuth button list, T‑ID row — `PROV.tid`, `OAuthBtn`, `.pa-mk-tid`.
- **Before:** letter placeholder «Т» on a yellow `#FFDD2D` rounded square (`.pa-mk-tid{background:#FFDD2D;color:#222}`).
- **After:** the **official T‑ID badge** `img/oauth/tid.svg` (dark `#303030` pill · yellow shield · white “ID”), extracted from the Tinkoff/T‑Bank button asset. `PROV.tid` gains `img:'img/oauth/tid.svg'`; `OAuthBtn` renders `<img class="mkimg">` when `img` is set. CSS:
  `.pa-oauthbtn .mark.pa-mk-tid{ background:transparent; width:auto; border-radius:0 }`
  `.pa-mk-tid .mkimg{ height:26px; width:auto; display:block }`
  (two-class selector to outrank `.pa-oauthbtn .mark{width:28px;height:28px}`.)
- **Note:** Яндекс / Сбер / VK marks stay brand-colour **letter placeholders** (Я/red, С/green, VK/blue); Apple keeps its glyph. In prod, swap all for official SDK buttons per provider brandbooks.

### 🎨 A3 — No provider pre-selected
- **Where:** `OauthList`.
- **Before:** first row flagged `primary` → dark `--text` border + shadow (Яндекс on web/desktop, Apple on iOS), reading as a chosen default.
- **After:** all rows neutral (`['ya',false]…`, `['apple',false]…`). No method looks pre-selected.

### ✍️ A4 — Chooser divider copy
- **Where:** `AuthChooser` (mobile) — `.pa-or`.
- **Before:** «быстрее всего через сервис» (ambiguous — “what service?”).
- **After:** **«или»** (matches the desktop chooser divider).

### ✍️ A5 — Welcome secondary CTA
- **Where:** `WelcomeBody`.
- **Before:** «Продать букет».
- **After:** **«Опубликовать букет»** (the verb used in nav, landing, drawer, footer).

### 🐛 A6 — Consent line spacing (silent no-op fixed)
- **Where:** `.pa-consent` (mobile chooser + desktop card).
- **Bug:** the reset `.pa p{margin:0}` `(0,0,1,1)` outranked `.pa-consent` `(0,0,1,0)`, so `margin-top` was always `0` — earlier 16px/24px/30px edits did nothing (computed `0px`, verified live).
- **After:** selector raised to **`.pa .pa-consent`** `(0,0,2,0)` → `margin-top:30px` now applies; `line-height 1.55→1.7`. Same class of bug fixed for `.pdl-*` in 0.6.3.

### 🐛 A7 — Consent checkbox text alignment
- **Where:** `.pd-check .t` (shared, used by the phone-consent checkbox).
- **Before:** first text line sat high against the 22px box.
- **After:** `padding-top:3px` optically centers the first line against the box.

### ✍️ A8 — No trailing period in auth titles/subtitles
| Slot | Before → After |
|------|----------------|
| `.pad-hl` (desktop aside headline) | «…подаренным цветам.» → «…подаренным цветам» |
| `.pad-hlsub` (aside lead) | «…отзывы взаимные.» → «…отзывы взаимные» |
| `.pa-tag` (desktop chooser) | «…за пару секунд.» → «…за пару секунд» |
| `.pa-tag` (desktop OAuth) | «…в открывшемся окне.» → «…в открывшемся окне» |
| `.pa-sub` (phone) | «…по SMS.» → «…по SMS» |
| `.pa-sub` (register) | «…Это займёт минуту.» → «…Это займёт минуту» |
| `Hero sub` (mobile chooser) | «…для подаренных цветов.» → «…для подаренных цветов» |
| `Hero sub` (OAuth sheet) | «Свежие букеты со скидкой.» → «Свежие букеты со скидкой» |

> Kept: `WelcomeBody` exclamation «С возвращением, Катя!»; long error/blocked/link **body** paragraphs and the scope helper texts retain normal punctuation.

---

## B. OTP keyboard state (`auth` + device frames) — see `OTP_KEYBOARD_AUTOFILL.md`
- 🎨 **New** `AuthOtpFill` screen (keyboard up, no footer).
- 🎨 iOS QuickType bar shows `4127` + «Из сообщений»; Android Gboard shows chip `✉ 4127 · Из сообщений`.
- 🎨 Keyboard is the **stock OS QWERTY** (custom numpad reverted).
- 🎨 New artboards «Код · клавиатура + автоподстановка» (iOS `a-otp-kbd`, Android `an-otp-kbd`).

---

## C. Shared components (`pd.css`)

### 🐛 C1 — `PdNotice` text wrap
- **Where:** `.pd-notice`.
- **Before:** info/danger notice bodies could drop a single short word to a last line (orphan) — seen on desktop «Доступ ограничен».
- **After:** `text-wrap:pretty` (inherited → reaches the text span). Balances all notice bodies.

---

## D. Microcopy convention — no trailing period in titles/subtitles (project-wide)

**Rule:** headings (`h1`–`h4`, kickers/eyebrows) and subtitle/tagline slots (`*-sub`, `*-tag`,
`*-lead`, sheet `.sub`) **do not end in a period**. Body copy, multi-paragraph helper text, captions
(`pdam-readonly`), long error/blocked descriptions keep punctuation. Only the **terminal** period is
removed; internal sentence periods stay.

### Landing (`pd-land.jsx`) — `.pdl-sub`
- «…лучшие разбирают за часы.» → «…за часы»
- «…вы платите, только когда увидели букет вживую.» → «…вживую»
- «…пока его не забрали.» → «…не забрали»

### SEO (`pd-seo.jsx`) — `.pds-h2-sub`
- «…лучшие разбирают за часы.» → «…за часы»
- «…без поездок через весь город.» → «…весь город»
- «…подберите свежий букет за полцены.» → «…за полцены»
- «…крупнейших городах России, выберите свой.» → «…выберите свой»
- «Три шага, без предоплаты и посредников.» → «…и посредников»

### Settings (`pd-settings.jsx`) — `.pdss-sub`
- profile «…на витрине и в сделках.» → «…в сделках»
- logins «…должен оставаться активным.» → «…активным»
- notifications «…отключить нельзя.» → «…нельзя»
- sessions «…действие логируется.» → «…логируется»
- privacy «…управление вашими данными.» → «…данными»

### Admin mobile (`pd-admin-mobile.jsx`) — confirm-sheet `.sub`
- unpublish «…отредактировать и обжаловать.» → «…обжаловать»
- cancel-deal «…стороны получат уведомление. Необратимо.» → «…Необратимо»
- block-user «…Причина попадёт в audit-log.» → «…audit-log»
- `pdam-readonly` captions **unchanged** (they’re footnote captions, not subtitles).

### Audited, no change
- **catalog** (`pd-catalog.jsx`), **feed** (`pd-feed.jsx`, `pd-feed-desktop.jsx`), **screens**
  (`pd-scr-1/2/3/desktop.jsx`), **nav** (`pd-nav.jsx`) — titles/subtitles already period-free.

---

## E. Provider brandbook references (for the real OAuth buttons)
- Яндекс ID — `yandex.ru/dev/id/doc/ru/codes/buttons-design` · `yandex.ru/company/rules/logotype`
- Сбер ID — `developers.sber.ru/docs/ru/sberid/overview` · JS SDK `github.com/SberID/js-sdk`
- VK ID — `id.vk.ru/about/faq/business/vkid/authorization_button/30001`
- T‑ID — `tinkoff.github.io/tinkoff-id/widget-button/` (badge asset already extracted → `img/oauth/tid.svg`)
