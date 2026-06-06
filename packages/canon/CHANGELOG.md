# Changelog — @rebloom/canon

All notable changes per export. Newest first. SemVer. (`CANON_PACKAGE_TZ.md §7`)
Full history for ≤0.7.0 lives in the `canon-0.7.0-pkg/CHANGELOG.md`; this file carries the **0.8.0** delta.

## [0.8.0] — 2026-06-06 — Auth polish: OTP keyboard + SMS AutoFill state, login photo, official T‑ID mark, consent spacing fix · global typographic rule (no trailing period in titles/subtitles)

A focused pass on the **registration & login** surface (`auth` · `reference/prototypes/pd-auth.{jsx,css}`) plus two cross-cutting fixes that touch shared CSS (`pd.css`) and a **project-wide microcopy convention**. Two deep-dive companions ship with this package:

- **`OTP_KEYBOARD_AUTOFILL.md`** — the keyboard-raising + SMS-code AutoFill logic, prototype-harness vs. production-web, exactly what to implement in `web/`.
- **`VISUAL_TEXT_CHANGES_0.8.0.md`** — an exhaustive, screen-by-screen list of every visual and textual change (incl. the login background photo).

---

### Added — OTP “keyboard up + SMS AutoFill” state (`AuthOtpFill` + device-frame harness)

- New screen component **`AuthOtpFill`** (`pd-auth.jsx`) — the code-entry step shown **with the on-screen keyboard raised** and a partially-typed code. It is intentionally **chrome-light**: a back affordance, the «Введите код» title, the masked-phone sub, the `PdOtp` cells (default `4127`) and the resend/​«Изменить номер» line. **No footer button** — on a real device the keyboard occupies the bottom, so a pinned CTA would be hidden behind it.
- New artboards in `Передарим · Вход.html`: **«Код · клавиатура + автоподстановка»** for iOS (`a-otp-kbd`) and Android (`an-otp-kbd`), via new `mobK` / `andrK` helpers that mount the screen inside a device frame with `keyboard` + `kbdAutofill="4127"`.
- **Device-frame harness** (`reference/prototypes/ios-frame.jsx`, `android-frame.jsx`) gained a `kbdAutofill` prop on `IOSDevice` / `AndroidDevice`, forwarded to `IOSKeyboard` / `AndroidKeyboard`. When set, the **system keyboard** renders the SMS code in its **suggestion strip** — iOS QuickType bar shows `4127` + «Из сообщений»; Android Gboard shows a chip `✉ 4127 · Из сообщений`. **This is a mock for communicating the state — it is the real OS keyboard layout, not a custom one** (see the doc; an earlier draft drew a bespoke numeric pad and was reverted).

### Fixed — login split-aside had no background photo on prod (`pd-auth.jsx`)

- The desktop login aside (`.pad-aside .pad-photo`) referenced `img/1561181286-d3fee7d55364.jpg`, which **does not exist on prod** → blank aside. Re-pointed to the **hero photo `img/hero-lacybird.png`** (already shipped/served, used by the landing hero). Styling unchanged (`opacity:.16`, `object-fit:cover`).

### Fixed — consent-line spacing was a silent no-op (specificity), `.pa .pa-consent` (`pd-auth.css`)

- Same cascade trap documented in **0.6.3** for `.pdl-*`: the reset **`.pa p { margin:0 }`** `(0,0,1,1)` outranks single-class **`.pa-consent`** `(0,0,1,0)`, so every `margin-top` on the consent line resolved to `0`. Re-asserted with the two-class selector **`.pa .pa-consent`** `(0,0,2,0)` → `margin-top:30px` now lands on both the mobile chooser and the desktop card. `line-height` raised `1.55→1.7`.

### Fixed — consent checkbox text rode high against the box (`pd.css`)

- `.pd-check .t` gains `padding-top:3px` so the first text line optically centers against the 22px checkbox (the box is taller than the 12.5px line).

### Fixed — `PdNotice` dropped an ugly one-word last line (`pd.css`)

- Added **`text-wrap:pretty`** to `.pd-notice` (inherited, so it reaches the text span). Kills the orphan on the desktop «Доступ ограничен» info notice and balances every notice body.

### Changed — official **T‑ID** mark on the OAuth button (`pd-auth.jsx`, `pd-auth.css`, `img/oauth/tid.svg`)

- The T‑ID provider mark was a letter placeholder («Т» on yellow). Replaced with the **official T‑ID badge** extracted from the Tinkoff/T‑Bank brand asset (`img/oauth/tid.svg` — dark pill, yellow shield, white “ID”). `PROV.tid` now carries `img`; `OAuthBtn` renders an `<img class="mkimg">` when `img` is present. CSS: `.pa-oauthbtn .mark.pa-mk-tid{background:transparent;width:auto;border-radius:0}` + `.pa-mk-tid .mkimg{height:26px}` (two-class selector to beat `.pa-oauthbtn .mark{width:28px}`).
- The other three marks (Яндекс «Я» / red, Сбер «С» / green, VK «VK» / blue) remain brand-colour letterforms — **placeholders**; in прод swap for official SDK buttons/badges (see provider brandbooks). Apple keeps its glyph.

### Changed — no provider selected by default (`pd-auth.jsx`)

- `OauthList` no longer flags the first provider as `primary`. Previously Яндекс (web/desktop) and Apple (iOS) rendered with the dark `--primary` border, reading as a pre-selected default. All methods now share the same neutral weight.

### Changed — chooser divider copy (`pd-auth.jsx`)

- The mobile chooser divider «быстрее всего через сервис» (ambiguous — “what service?”) → plain **«или»**, matching the desktop chooser.

### Changed — welcome CTA verb (`pd-auth.jsx`)

- Welcome screen secondary CTA «Продать букет» → **«Опубликовать букет»**, aligning with the verb used everywhere else (nav, landing, drawer).

### Changed — microcopy convention: **no trailing period in titles & subtitles** (project-wide)

New canon rule: **headings (`h1`–`h4`, kickers/eyebrows) and subtitle/tagline slots (`*-sub`, `*-tag`, `*-lead`, sheet `.sub`) do not end in a period.** Body copy, multi-paragraph helper text, captions (`pdam-readonly`), and long error/blocked descriptions keep normal punctuation. Internal sentence periods inside a multi-sentence subtitle are kept; only the **terminal** period is removed. Stripped in this pass:

- **auth** (`pd-auth.jsx`): desktop aside headline + lead; «Выберите удобный способ, за пару секунд» / «Подтвердите вход в открывшемся окне»; «Пришлём код подтверждения по SMS»; «Так вас увидят покупатели. Это займёт минуту»; mobile hero sub; OAuth-sheet sub «Свежие букеты со скидкой».
- **landing** (`pd-land.jsx`): the three section `.pdl-sub` leads (catalog / safe-deal / app).
- **SEO** (`pd-seo.jsx`): five `.pds-h2-sub` section subs (geo catalog / districts / occasions / other cities / how-the-deal-works).
- **settings** (`pd-settings.jsx`): all five `.pdss-sub` page subs (profile / logins / notifications / sessions / privacy).
- **admin mobile** (`pd-admin-mobile.jsx`): the three confirm-sheet `.sub` lines (unpublish / cancel-deal / block-user). `pdam-readonly` captions left intact.
- **catalog / feed / screens / nav** audited — titles/subtitles already clean, no change.

### Notes for the consumer (`web/`)

- **Keyboard/AutoFill is not a component you build.** In `web/`, the OTP field implements `autocomplete="one-time-code"` + `inputmode="numeric"` (+ Android SMS Retriever) and the **OS** renders the real keyboard and the “From Messages” suggestion. The `*-kbd` artboards exist only to **specify** that state. Full mapping in `OTP_KEYBOARD_AUTOFILL.md`.
- Port the auth source changes into `src/auth/auth.jsx` and the CSS deltas into `src/styles/canon.css` (`.pa .pa-consent`, `.pd-check .t`, `.pd-notice`, `.pa-mk-tid`), then rebuild `dist/*.js` / `dist/canon.css`. `reference/prototypes/*` in this package are byte-current with the design source.
- Ship `img/oauth/tid.svg`. Confirm `img/hero-lacybird.png` is served at the login route.
- Apply the no-trailing-period rule to any new title/subtitle strings going forward.
