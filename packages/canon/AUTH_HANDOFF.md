# AUTH_HANDOFF — экраны входа/регистрации + подключение всех ID

> `@rebloom/canon` · код-нейм `rebloom` · бренд «Передарим». Адресат — **Claude Code (`web/` + Capacitor-обёртки)**.
> Источник правды — этот пакет. Ручная переразметка в `web/` запрещена (`CANON_PACKAGE_TZ.md §1, §10`): берём компоненты canon и **подключаем** их к роутам, провайдерам и API.
> Связано: `AUTH.md`, `FLOWS.md` (FLOW-0), `API_CONTRACT.md §2`, `INTERACTION_STATES.md`, `SECURITY.md`, `ADR-0008`.

---

## 0. Что было сломано на проде (root cause)

`web/` остался на **легаси-логине «только телефон + OTP»** и не перешёл на OAuth-first canon (есть с 0.1.0). Два симптома — одна причина:
- **Мобайл `/login`:** нет кнопок ID (Яндекс/Sber/VK/T-ID) — рендерился старый phone-only экран.
- **Десктоп `/login`:** рендерился **адаптивный мобильный** `AuthPhone plat="web"`, отцентрованный внутри маркетплейс-шапки `WebShell`, вместо **десктопного сплита** `AuthDesktop*` (брендовая панель + карточка).

Фикс: перейти на `AuthChooser`/`AuthDesktop*` по карте роутов (§2) и завести все ID (§4). Нужные экраны уже в пакете; 0.3.0 добавил недостающие пропсы (`prov`, `slots`) и десктопные варианты link/error/blocked.

---

## 1. Импорты из canon

```ts
import {
  // адаптивные (mobile web + iOS/Android): принимают plat
  AuthChooser, AuthOAuthSheet, AuthPhone, AuthOtp,
  AuthRegister, AuthLink, AuthWelcome, AuthError, AuthBlocked,
  // десктопные (сплит-лейаут, всегда desktop)
  AuthDesktopChooser, AuthDesktopOAuth, AuthDesktopPhone, AuthDesktopOtp,
  AuthDesktopRegister, AuthDesktopWelcome,
  AuthDesktopLink, AuthDesktopError, AuthDesktopBlocked, // ← новые в 0.3.0
} from '@rebloom/canon/auth';
import '@rebloom/canon/canon.css';
```

**Пропсы:**
| Проп | Значения | Где |
|---|---|---|
| `plat` | `ios \| android \| web \| desktop` | только адаптивные — переключает хром платформы (`ADR-0008`) |
| `state` | phone: `rest\|invalid` · otp: `typing\|verifying\|invalid\|locked` · register: `rest\|invalid\|submitting` | формы (`INTERACTION_STATES.md`) |
| `prov` | `ya \| sber \| vk \| tid` | `AuthOAuthSheet`, **`AuthDesktopOAuth`** (0.3.0) — какой провайдер в consent |
| `slots` | `{ ya:<…/>, sber:<…/>, vk:<…/>, tid:<…/>, apple:<…/> }` | `AuthChooser`, `AuthDesktopChooser`, `AuthOAuthSheet`, `AuthDesktopOAuth` — официальные кнопки SDK (см. §4.4) |
| `offline` | `boolean` | `AuthError`, `AuthDesktopError` |

> ⚠️ Не форкать разметку в `web/`. Нехватка пропа/слота = заявка на новую версию canon, не патч в `web/`.

---

## 2. Карта роутов → компонентов (ГЛАВНОЕ)

Платформа определяется один раз и прокидывается вниз.
- **iOS/Android:** `Capacitor.getPlatform()` → адаптивные компоненты с нужным `plat`.
- **Веб:** `desktop` при `min-width: 960px` И не-тач; иначе `web`. Через media-/container-query, **не** по user-agent.

| Под-роут | iOS | Android | Mobile web | **Desktop** |
|---|---|---|---|---|
| `/login` (выбор) | `AuthChooser plat="ios"` | `…android` | `…web` | **`AuthDesktopChooser`** |
| `/login` (OAuth-consent) | `AuthOAuthSheet plat="ios" prov` | `…android` | `…web` | **`AuthDesktopOAuth prov`** |
| `/login/phone` | `AuthPhone plat="ios"` | `…android` | `…web` | **`AuthDesktopPhone`** |
| `/login/otp` | `AuthOtp plat="ios"` | `…android` | `…web` | **`AuthDesktopOtp`** |
| `/login/register` | `AuthRegister plat="ios"` | `…android` | `…web` | **`AuthDesktopRegister`** |
| `/login/link` | `AuthLink plat="ios"` | `…android` | `…web` | **`AuthDesktopLink`** |
| `/login/welcome` | `AuthWelcome plat="ios"` | `…android` | `…web` | **`AuthDesktopWelcome`** |
| ошибка / нет сети | `AuthError plat=… [offline]` | … | … | **`AuthDesktopError [offline]`** |
| доступ ограничен | `AuthBlocked plat="ios"` | … | … | **`AuthDesktopBlocked`** |

**Критично:** на desktop `/login*` — **`AuthDesktop*`**, НЕ `Auth* plat="web"`. Десктопный экран — **самостоятельная страница** со своим сплитом; НЕ оборачивать в маркетплейс-`WebShell` (поиск, «Продать букет»).

---

## 3. Поток FLOW-0

```
/login (AuthChooser / AuthDesktopChooser)
 ├ [OAuth] → consent (sheet / попап) → /start → authorize → /callback → {user, is_new}
 │    ├ is_new=false → welcome → витрина
 │    ├ is_new=true  → register → PATCH /api/me → welcome
 │    └ номер уже привязан → link
 └ [Телефон] → /login/phone → otp/request → /login/otp (typing→verifying)
        → otp/verify → {user, is_new} → (register если new) → welcome
Крайние: oauth_failed → Error; offline → Error offline; otp_locked → Otp locked (1ч); блок → Blocked.
```
Каждый шаг — во всех состояниях, кнопки активны по умолчанию.

---

## 4. Подключение всех ID

### 4.1 Архитектура (обязательно)
**Authorization Code + PKCE через бэкенд.** Фронт не хранит секреты и не парсит провайдерские токены:
```
кнопка → POST /api/auth/oauth/{provider}/start { redirect_uri } → { authorize_url, state }
       → открыть authorize_url (desktop: попап · mobile: in-app browser/redirect)
       → провайдер → наш redirect_uri?code&state
       → POST /api/auth/oauth/{provider}/callback { code, state } → { user, is_new } (+ session cookie)
```
Эндпоинты — `API_CONTRACT.md §2` (FR-005). Ошибки: `oauth_failed`, `rate_limited`, `validation_error`.

### 4.2 Маппинг ключей (canon ↔ API)
| canon `prov` | API `{provider}` | бренд |
|---|---|---|
| `ya` | **`yandex`** | Яндекс ID |
| `sber` | `sber` | Sber ID |
| `vk` | `vk` | VK ID |
| `tid` | `tid` | T-ID (Т-Банк) |
| `apple` | `apple` | Apple (iOS only) |

### 4.3 Где показывать
- **Desktop / Android / mobile web:** Яндекс ID (primary, сверху), Sber ID, VK ID, T-ID.
- **iOS:** сверху добавляется **Apple** (требование App Store), затем остальные.
- Порядок/набор зашиты в `OauthList` по `plat` — не дублировать в `web/`, управлять лишь включением провайдеров (конфиг/фиче-флаг). Госуслуги/ЕСИА — не в MVP.

### 4.4 Официальные кнопки через `slots` (0.3.0)
Маркеры в макетах — **плейсхолдеры** (цвет бренда + буква). На проде кнопки обязаны соответствовать брендбуку и SDK каждого провайдера; часть из них — **динамические виджеты SDK** (нельзя просто перерисовать).

Передавайте `slots` в `AuthChooser`/`AuthDesktopChooser` — canon отрендерит ваш виджет вместо плейсхолдера (стиль `.pa-oauthbtn--slot` — пустой full-width контейнер). Без форка:
```tsx
<AuthChooser plat={plat} slots={{
  ya:   <YandexLoginButton/>,   // Яндекс SDK / suggest
  sber: <SberIdButton/>,        // брендбук Sber ID
  vk:   <VkidOneTap/>,          // @vkid/sdk One Tap
  tid:  <TidButton/>,           // официальная кнопка T-ID
  // apple добавляется только на iOS (нативный лист Capacitor)
}}/>
```
Каждый виджет инициирует **тот же** бэкенд-flow §4.1 (или silent-token → наш `/callback`). У строк есть `data-provider` для аналитики/таргетинга.

**Заметки по провайдерам** (точные `client_id`/`redirect_uri`/scopes — из кабинетов провайдеров, конфигурируются на **бэкенде**; на фронт приходят через `/start`, секреты в бандл не вшивать):

| Провайдер | Протокол | Кнопка / SDK | Scopes (мин.) | Заметка |
|---|---|---|---|---|
| Яндекс ID | OAuth 2.0 | «Войти с Яндекс ID» (Yandex SDK) | `login:info`, `login:email`; телефон — по доступу | `oauth.yandex.ru` |
| Sber ID | OIDC | кнопка по брендбуку Sber ID | `openid`, `name`, `phone`, `email` | фикс. `redirect_uri` + `state`/`nonce` |
| VK ID | OAuth 2.0 / VK ID SDK | **VK ID One Tap** (`@vkid/sdk`) | профиль; телефон — по правам | silent-token → бэкенд обменивает |
| T-ID (Т-Банк) | OAuth 2.0 / OIDC | официальная кнопка T-ID | профиль; телефон — по правам | `redirect_uri` + `state` в кабинете |
| Apple | Sign in with Apple | нативный лист iOS (Capacitor) / кнопка по HIG | `name`, `email` (м.б. private-relay) | **только iOS**, в вебе/Android не показывать |

### 4.5 Экран согласия
Показываем: какой аккаунт, какие данные (**имя+фото, телефон, email**), «Разрешить и войти» / «Отмена». Копирайт — в canon, не менять.
- Мобайл: `AuthOAuthSheet plat={…} prov={…}` (bottom-sheet).
- Десктоп: `AuthDesktopOAuth prov={…}` — UI-обвязка попап-окна (host берётся из `PROV_HOST` по `prov`). Реальный код/токен — из настоящего окна провайдера; canon-обвязка = визуальный каркас состояния «подтвердите в открывшемся окне».

---

## 5. Телефон + SMS-OTP (равноправный фолбэк)

1. `/login/phone` — `AuthPhone`/`AuthDesktopPhone`: поле `+7`, чекбокс 152-ФЗ (обяз.) → `POST /api/consent` при первом входе (FR-004). «Получить код» → `POST /api/auth/otp/request {phone}` → `{sent, retry_after_sec}`. `state="invalid"` — неполный номер.
2. `/login/otp` — `AuthOtp`/`AuthDesktopOtp`: `typing` (таймер ресенда из `retry_after_sec`, «Изменить номер») → `verifying` (`POST /api/auth/otp/verify`) → успех `{user, is_new}`; `invalid` (`validation_error`, «Осталось попыток: N»); `locked` (`otp_locked`, FR-003 — таймер **1 час**).

---

## 6. Знакомство нового пользователя
Только при `is_new=true`. `/login/register` — `AuthRegister`/`AuthDesktopRegister`: имя (обяз.), фото (опц.), город; `rest/invalid/submitting`; сохранение → `PATCH /api/me {display_name, city_id, avatar?}` (FR-006) → welcome.

## 7. Номер уже привязан (link)
`/login/link` — `AuthLink`/`AuthDesktopLink`: войти привычным способом + «Продолжить по SMS-коду». Привязки — `GET/POST/DELETE /api/account/link/{provider}` (≥1 способ обязателен).

## 8. Финал / крайние
| Экран | Компонент | Триггер |
|---|---|---|
| Готово | `AuthWelcome`/`AuthDesktopWelcome` | успех → витрина |
| Не удалось войти | `AuthError`/`AuthDesktopError` | `oauth_failed` |
| Нет сети | `…Error offline` | offline |
| Доступ ограничен | `AuthBlocked`/`AuthDesktopBlocked` | блокировка (FLOW-8) |

---

## 9. API-биндинг (`API_CONTRACT.md §2`)
`oauth/{provider}/start`·`/callback` · `otp/request`·`/verify` · `POST /api/consent` · `PATCH /api/me` · `account/link/{provider}` · `auth/logout`.
`user`: `{id, display_name, phone_masked, city_id, roles[], seller_rating, deals_count, linked_providers[]}`.
Ошибки: `validation_error`, `otp_locked`, `rate_limited`, `oauth_failed` → RU-текст + дизайн-состояние (`§7`, `INTERACTION_STATES.md §6`). Без «выдуманных» статусов.

## 10. Безопасность (`SECURITY.md`)
OAuth state + PKCE, anti-CSRF; `state` валидируется на бэкенде. Привязка — по верифицированному телефону/email. Сессия — cookie `HttpOnly; Secure; SameSite=Lax`; mobile — secure storage. Привязка/отвязка/смена телефона → `AUDIT_LOG`. `redirect_uri` — из allowlist. Секреты — только на бэкенде.

## 11. Критерии приёмки
- [ ] Desktop `/login*` — `AuthDesktop*` (сплит), не мобильная карточка в `WebShell`.
- [ ] Mobile `/login` — `AuthChooser` с кнопками ID (легаси phone-only снят).
- [ ] Все ID проходят `start → authorize → callback → {user, is_new}` и роутятся по `is_new`.
- [ ] `slots` отдают официальные кнопки провайдеров (Apple — только iOS); плейсхолдеров на проде нет.
- [ ] Телефон/OTP: все состояния, таймеры из `retry_after_sec`, lock 1ч.
- [ ] 152-ФЗ фиксируется (`/api/consent`) при первом входе.
- [ ] Новый юзер → «Знакомство» (`PATCH /api/me`); существующий → welcome.
- [ ] `oauth_failed`/offline/`otp_locked`/блок — правильные экраны (desktop-варианты тоже).
- [ ] Безопасность §10 выполнена.
- [ ] `npm run test:visual` ≤ 2% к baseline auth.
