# MOBILE APPS — план iOS/Android из мобильного веба (на попозже)

> Оценка и фазинг превращения web-сборки в нативные приложения. Парный док —
> `store-submission.md` (процесс публикации). Архитектура — ADR-0004 (один web-кодбейс,
> Capacitor-обёртка). **Статус: не начато; план на будущее.**

## TL;DR
Обёртка — лёгкая часть и уже наполовину сделана. **Узкое место — не токены, а аккаунты / Mac /
ревью сторов.** Чистого кодинга **0.5–2 дня (~200–500K токенов)**; календарь до «в сторах» —
**2–5 недель** (доминируют верификация аккаунтов + ревью + наличие Mac).

## Ключевое архитектурное решение (уже принято)
`mobile/capacitor.config.ts` → **`server.url = https://peredarim.ru`**: нативная оболочка грузит
**живой сайт** + нативные плагины через JS-мост. НЕ static-export (Next.js — SSR с `cookies()`, чисто
статикой не экспортируется). Снимает самый большой техриск. Следствие для апдейтов — см. §«Обновление
дизайна» ниже.

## Состояние сейчас
- `mobile/` заскаффолен: `capacitor.config.ts` (appId `ru.peredarim.app`, server.url, allowNavigation
  заперт на `peredarim.ru`), **iOS-проект сгенерён**, `www/` (fallback-страница), плагины в
  `package.json`: camera, geolocation, haptics, preferences, push-notifications, share.
- **Android-проект ещё НЕ сгенерён** (`npx cap add android` — одна команда).
- Device-фичи в web почти не подключены (web деградирует — это ок для браузера, нативно дотачивается).

## Что осталось из кода (мои токены) — мало-средне
| Задача | ~Токены | Нужен владелец |
|---|---|---|
| `cap add android` + иконки/сплэш/permissions (iOS+Android) | 40K | — |
| Плагины в web (камера на `/sell`, гео на самовывозе, share, haptics) — feature-detect | 120K | — |
| **Push** (APNs key + Firebase/FCM + бэкенд device-токенов + отправка) | 150–250K | Firebase/APNs |
| Offline-фоллбэк, deep links (нотификация→экран), CI-сборка (Fastlane) | 100K | — |

**Итого ~200–500K, 1–3 сессии.** Отложить push в v1 → нижняя граница (~200K, одна сессия).

## Что НЕ решается токенами (узкое место, календарь)
- **Аккаунты+деньги:** Apple Developer ($99/год) · Google Play ($25 разово) · RuStore (через
  **УКЭП/ЭЦП**). РФ-верификация: дни–недели.
- **Mac** (или облачный Mac / CI типа Codemagic) — **обязателен** для iOS-сборки и подписи.
- **Подписи:** iOS distribution cert + provisioning profile; Android upload keystore (**бэкап обязателен**
  — потеря = невозможность обновлять).
- **Push-инфра:** APNs-ключ (Apple) + Firebase/FCM-проект (Android).
- **Ревью сторов:** Apple для финанс/маркетплейс + новый аккаунт → **5–7 раб. дней** (+ риск отказа
  Guideline 4.2 «это просто сайт» → ещё цикл); Google часы–дни (верификация до ~2 нед); RuStore дни.

## Фазинг
- **Фаза 1 — Android debug-APK (без аккаунтов и Mac).** `cap add android` + плагины + offline-страница →
  собираемый APK, сайдлоад на реальный Android-телефон, щупаем живое приложение. Нужен Android SDK/Studio
  локально или CI-сборка. **~150–250K, 1 сессия.**
- **Фаза 2 — iOS + TestFlight** (нужен Mac + Apple Developer).
- **Фаза 3 — сабмиты** в App Store / Google Play / RuStore (аккаунты + УКЭП + метаданные/скриншоты/
  privacy-labels ФЗ-152 + ревью-ноты — детали в `store-submission.md`).

## Риск, который закрыть до сабмита
server.url = WebView на живой сайт → Apple может придраться (4.2 «minimum functionality / просто сайт»).
Митигация (ADR-0004 принял остаточный риск): реальные device-фичи (камера на `/sell`, гео на самовывозе,
push, share, haptics) — поэтому их и включаем перед сабмитом; + транзакционный маркетплейс, не брошюра.

## Обновление дизайна = ОДИН web-деплой (главный payoff)
Приложения **грузят живой `peredarim.ru`**, поэтому **обычный web-деплой обновляет мобильный веб + iOS +
Android одновременно**, без пересборки приложений и **без ре-ревью сторов**. Пайплайн тот же, что и сейчас:
**Claude Design → vendor canon → обвязка web → деплой `peredarim.ru` → все платформы на следующем запуске.**
- **Мгновенно, без стора:** любой web — UI, дизайн-canon, копирайт, флоу, JS/CSS, новые экраны/роуты (≈99%
  дизайн-работы). Встроенный OTA по построению.
- **Нужен релиз в стор (ре-ревью):** только **нативное** — bump Capacitor, новый плагин/permission, правка
  `capacitor.config` (server.url/allowNavigation), иконка/сплэш, target OS. Редко (config стабилен).
- **Нюансы:** новый UI виден на **следующем холодном старте** приложения (WebView кэширует; можно добавить
  version-check/принудительный reload); **откат = откат web-деплоя** (платформы связаны — нельзя держать
  приложение на старом UI при новом вебе без feature-flags); рендер WKWebView(iOS)/Blink(Android) ≈
  Chromium-теста, но движки чуть разные → пиксель-парити «по построению» (один DOM/CSS), мелкие
  WebKit-дельты ловит ручной device-QA.
- **Верификация = та же:** `npm run test:visual` зелёный = парити на всех платформах (один build, один DOM).

## Тестирование (сценарии + безопасность)
Базовый принцип: **приложение = живой web в WebView**, поэтому ~90% тестов — это уже существующий
web/бэкенд-сьют, плюс тонкая нативная прослойка сверху.

### Сценарии (functional) — в основном уже автоматизированы
- **Playwright-спеки** (функциональные + флоу) в Chromium на **mobile-375 = эталон iPhone** — это и есть
  UI-сценарии приложения (тот же DOM/CSS, что рендерит WebView): логин/продать/купить/чат/каталог/фильтры.
- **`npm run test:visual`** (пиксель + геометрия) на mobile-375 = рендер приложения.
- **`pytest`** unit/integration/contract = тот же API, что дёргает приложение.
- → **CI-гейты web-деплоя = регресс-сьют приложения по построению** (каждый деплой = апдейт приложения).

### Нативная прослойка (web-тесты НЕ покрывают)
- **Плагины** (камера/гео/пуш/share/haptics) — в Chromium не дёрнуть → **unit на feature-detect/degrade**
  (ветка «натив» vs web-деградация) + **ручной device-QA / device-farm** для железа.
- **Конфиг WebView**: `server.url`-allowlist, `cleartext:false`, mixed-content off — ревью + смоук на эмуляторе.
- **Deep links / пуш→экран / offline-фоллбэк** — эмулятор/девайс.

### Безопасность — слоями
**Унаследовано (в CI + `SECURITY.md`):** тесты угроз T-01..18 (OTP-брутфорс, IDOR/authz, contact-leak,
PII-маскирование, модерация), `make security-check` (bandit/pip-audit/npm audit/gitleaks), auth-aware
(`useMe`/гость-хедер), middleware-гейтинг — защищает и приложение (бэкенд+web те же).

**Нативный чек-лист (новая поверхность):**
- Сессия: кука HttpOnly+Secure в WebView; токены (если добавим) → `@capacitor/preferences` (Keychain/
  Keystore); нет токена в plaintext/логах.
- **Navigation-allowlist:** WebView не уходит никуда кроме `peredarim.ru`; внешнее (ЮKassa dormant, legal) →
  системный браузер (анти-фишинг).
- Транспорт только HTTPS (ATS iOS / network-security-config Android); опц. **cert-pinning** vs MITM `[decision]`.
- **Least-privilege permissions** (только камера/гео/пуш + usage-строки; никаких лишних — стор+ФЗ-152).
- Пуш без PII в теле (NOTIFICATIONS.md).
- Supply-chain: плагины = npm-деп → `npm audit` + пины + ADR на рантайм-деп.
- **MobSF** по собранному APK/IPA (права/секреты/конфиг — мобильный аналог bandit) — если есть сборка.
- DAST: OWASP ZAP по `peredarim.ru` покрывает API-поверхность.
- Опц. хардненинг (блок скриншотов на чувствительных экранах, root/jailbreak-детект) — post-MVP `[decision]`.

### Конкретный прогон (когда соберём приложения)
1. **Pre-build (автомат):** весь CI — Playwright mobile-375, visual-regression, pytest + тесты угроз, `security-check`.
2. **Нативная проводка (код):** unit на degrade/«натив» + **ревью конфига** (allowlist, cleartext-off, least-priv, нет секретов в `capacitor.config`/бандле).
3. **Бинарь:** MobSF по APK/IPA + `npm audit` плагинов.
4. **Эмулятор (без Mac):** Android-эмулятор — смоук сценариев + пути плагинов + navigation-allowlist + offline.
5. **Ручной device-чек-лист** (только железо): камера→загрузка, гео→самовывоз, пуш→deep-link, share,
   внешняя ссылка→системный браузер, сессия persist / logout-revoke.
6. **Device-farm (опц.):** Firebase Test Lab (Android) / BrowserStack — кросс-девайс + парити WebKit/Blink.

### Что НЕ могу сам (честные границы)
- **Реальный iPhone / Mac** → iOS-натив, WKWebView-квирки, TestFlight = владелец / облачный Mac-CI / ручной QA.
- **Железо сенсоров** (камера/GPS/пуш по-настоящему) — девайс или device-farm.
- **Ревью сторов** + пентест подписанного бинаря на jailbroken-девайсе — внешнее/специалист.

**Итог:** автоматизирую п.1–3 + Android-эмулятор (4) + готовлю ручной чек-лист (5); реальный-iPhone/Mac/
сторы/сенсоры — вне меня. Сценарии ≈ существующий web/e2e на mobile-375 + device-смоук плагинов;
безопасность = полный backend/web threat-model + CI **плюс** нативный чек-лист (allowlist, cleartext-off,
secure-storage, least-priv, no-PII-push, MobSF).
