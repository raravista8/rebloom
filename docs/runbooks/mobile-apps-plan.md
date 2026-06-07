# MOBILE APPS — детальный план iOS/Android (на попозже)

> План превращения web-сборки в нативные приложения, отдельно для iOS и Android, с грабли/практиками
> из ресёрча (2026-06). Парный док — `store-submission.md`. **Альтернатива — `pwa-launch-plan.md`
> (Plan B: PWA + пуши, без сторов/Mac/аккаунтов, запуск за дни).** Архитектура — ADR-0004 (один
> web-кодбейс, Capacitor-обёртка). **Статус: не начато.** Источники — в конце.

## 0. Твоя модель — верна, с одним нюансом
Да: **логику и дизайн меняешь свободно сейчас; приложение — тонкая обёртка вокруг web**, и я её пишу один
раз. Нюансы: (1) «как подключить web» — это **решение из двух стратегий** (§1); (2) **нативные** изменения
(новый плагин/permission, правка `capacitor.config`, иконка, версия Capacitor) требуют релиза в стор —
но это редко. Web-правки (UI/дизайн/флоу/копирайт) — без пересборки нативки.

## 1. ⚠️ ГЛАВНОЕ РЕШЕНИЕ: как приложение получает web
Сейчас в `mobile/capacitor.config.ts` стоит **A (server.url)**. Ресёрч показал, что это рискованный путь —
вот развилка:

**A. `server.url` → грузит живой `peredarim.ru` (текущий конфиг).**
- ✅ Мгновенные апдейты (один web-деплой = все платформы), ноль app-сборки web.
- ❌ **Официально НЕ рекомендован Capacitor для прода.** Риски: (1) **Apple 4.2 «lazy wrapper»** —
  отказ за «просто сайт в обёртке»; (2) **плагин↔натив version-mismatch** — один web-бандл отдаётся всем
  установленным нативным версиям; bump плагина/нативного конфига → у юзеров со старым бинарём web ломается
  (плагин-вызовы падают/фичи исчезают); (3) **service worker** может блокировать инъекцию Capacitor на
  Android (плагины перестают работать); (4) нужна сеть + аккуратный offline-фоллбэк.

**B. Bundled web + OTA (рекомендуется).** Web-сборка лежит ВНУТРИ приложения; апдейты web-слоя — по воздуху
через **Capgo** (OTA), без ревью стора.
- ✅ Store-safe, версии синхронны (web-бандл едет с нативным), OTA даёт быстрые апдейты как у server.url, но
  безопасно: e2e-шифрование, code-signing, instant rollback, поэтапные раскатки, CI/CD (~$12/мес).
- ❌ Нужна **app-сборка web** (SPA/static без SSR-страниц) — это **спайк**: Next.js App Router c `cookies()`/
  middleware чисто `output:'export'` не экспортится; но app-экраны клиентские (фетчат API) → отдельный
  app-таргет-build реалистичен (SEO-страницы в приложении не нужны). OTA — отдельный publish-шаг (не буквально
  тот же `peredarim.ru`-деплой, но тоже без ревью).
- **НЕ Appflow** — закрывается в 2026; Capgo (open-source, активный) — выбор.

**Рекомендация:** для денежно/ПДн-маркетплейса + прохождения ревью — **B (bundled + Capgo OTA)**. server.url
держать как fast-MVP-фоллбэк с принятыми рисками. Финализировать после **спайка app-build** (~50–100K токенов:
оценить, насколько чисто Next-клиентские роуты собираются в bundle). Это первый технический шаг.

## 2. Чтобы НЕ быть «lazy wrapper» (Apple 4.2 / Google) — чеклист из ресёрча
Ревьюеры палят обёртку по: браузерным loading-барам, web-гамбургеру вместо нативной навигации, отсутствию
push/гео, браузерному «You are offline». Закрываем:
- Запуск **сразу на полезный контент** (не белый экран); нативные **сплэш + иконка**; матч status-bar к UI;
  **safe-areas**; клавиатура не закрывает инпут; корректный **Android back**; внешние ссылки → системный браузер.
- **Реальные нативные фичи:** push, геолокация (самовывоз), камера (фото на `/sell`), share, haptics — это и
  есть «native integration», снимающее 4.2.
- **App-offline-state** (не браузерный): свой экран «нет сети» + retry.
- **Demo-креды ревьюеру:** вход по OTP → дать тестовый аккаунт + способ получить код (console-reveal/фиксированный
  тест-OTP для ревью-номера). Без этого Apple/Google не залогинятся → отказ.
- **Удаление аккаунта** (есть `/api/me/delete` ✓) — обязательно, раз есть регистрация.
- Тест на **реальном iPhone + Android** перед сабмитом.

## 3. iOS — пошагово
**Предусловия (owner):** Apple Developer Program ($99/год; РФ-верификация — дни–недели), **Mac** (или облачный
Mac-CI: Codemagic/MacStadium) — без него iOS не собрать/подписать.
1. **Контент-стратегия** (§1) — bundle+OTA или server.url.
2. `npx cap add ios` (уже сгенерён) → `cap sync`; `appId ru.peredarim.app`, иконка/сплэш (нативные).
3. **Info.plist:** usage-строки `NSCameraUsageDescription`/`NSLocationWhenInUseUsageDescription`/push; **ATS**
   (App Transport Security) — только HTTPS; Podfile `platform :ios, '15.0'`+.
4. **Push:** `@capacitor-firebase/messaging` (НЕ стандартный — см. §5); Push entitlement; APNs-ключ → Firebase.
5. **Подпись:** distribution-сертификат + provisioning profile (App Store Connect / Xcode automatic signing).
6. **Сборка:** Xcode → Archive → Distribute, или **Fastlane** `gym` + `pilot` → **TestFlight** (internal → external).
7. **App Store Connect:** app record (имя «Передарим», RU-локаль), **App Privacy nutrition labels** (телефон/гео/
   фото/идентификаторы — согласовать с `PRIVACY_152FZ.md`), скриншоты, возрастной рейтинг, privacy-policy URL.
8. **Review notes:** C2C-маркетплейс; **оплата при встрече (ADR-0013), НЕ IAP**; тестовый аккаунт + сценарий;
   подчеркнуть device-фичи (камера/гео/пуш). Финансовое/маркетплейс + новый аккаунт → ревью **5–7 раб. дней**;
   риск 4.2 → закрыт §2.
9. Submit → ожидание; при отказе 4.2 — усилить нативные фичи, повторить.

## 4. Android — пошагово
**Предусловия (owner):** Google Play Console ($25 разово; верификация РФ-аккаунта до ~2 нед). **RuStore: физлицам
и самозанятым публиковать НЕЛЬЗЯ — нужен ИП или юрлицо** (с 2026-02 даже монетизация самозанятым отключена);
аккаунт RuStore = VK ID + форма, УКЭП/ЭЦП нужна для монетизации (нам не нужна — оплаты в приложении нет, ADR-0013,
но **сам факт публикации требует ИП/юрлица**).
1. **Контент-стратегия** (§1).
2. `npx cap add android` (**ещё не сделано** — одна команда) → `cap sync`.
3. **AndroidManifest:** permissions только используемые (CAMERA/ACCESS_FINE_LOCATION/POST_NOTIFICATIONS);
   **network-security-config** — только HTTPS (`cleartext=false`, `allowMixedContent=false` уже в конфиге);
   targetSdk актуальный (Capacitor 8 → Android Studio 2025.2.1+, SDK API 24+).
4. **Push:** тот же unified FCM (см. §5); `google-services.json` от Firebase.
5. **Подпись:** **Play App Signing** (Google держит app-signing-key, у тебя upload-key — рекомендовано, 90%+
   новых приложений) + **upload keystore** (keytool RSA-2048, **бэкап обязателен** — потеря = нельзя обновлять);
   креды НЕ в `build.gradle` → `keystore.properties`/env/CI-secrets. Загружаем **AAB** (не APK) — Google
   пере-подписывает.
6. **Сборка:** Android Studio (Build → Generate Signed Bundle), или **Fastlane `supply`**; треки **internal →
   closed → open → production** с **поэтапной раскаткой %**.
7. **Play Console:** **Data Safety** форма, content rating, target API level, privacy-policy URL, скриншоты (RU).
8. **RuStore (после регистрации ИП/юрлица):** загрузить AAB/APK, метаданные (RU), скриншоты, политика; ревью дни.
9. (Опц.) **Прямой APK** как фоллбэк для RF-Android без Google Play.

## 5. Push — критическая грабля (из ресёрча)
Стандартный `@capacitor/push-notifications` на **iOS отдаёт нативный APNs-токен (hex), НЕ FCM-токен** → если шлёшь
через Firebase, **тишина**. Решение: **`@capacitor-firebase/messaging`** (делает swizzling, даёт **единый
FCM-токен** на обеих платформах). APNs-ключ грузить в **тот самый** Firebase-проект (точные Team ID + Key ID,
вкладка Messaging). iOS Podfile ≥ 15.0. Android: **FCM high-priority** (иначе Doze режет доставку). Бэкенд: эндпоинт
хранить device-токены (на юзера) + слать через FCM (один провайдер для обеих платформ). Это самый жирный код-кусок
мобильной работы.

## 6. Частые ошибки (ресёрч)
1. **server.url «lazy wrapper»** → Apple 4.2-отказ + плагин↔натив mismatch (§1) → предпочесть bundled+OTA или
   жёстко закрыть §2.
2. **APNs↔FCM token confusion** → молчащие пуши → `@capacitor-firebase/messaging` (§5).
3. **Потеря upload-keystore** → невозможность обновлять → Play App Signing + бэкап keystore (§4).
4. **Appflow** (OTA) закрывается 2026 → Capgo.
5. **Service worker** блокирует инъекцию Capacitor (Android) → проверить/отключить SW в app-сборке.
6. **Не тестировать на реальных устройствах** → WKWebView(iOS)/Blink(Android)-квирки всплывают только на железе.
7. **RuStore от физлица/самозанятого** → отказ; нужен ИП/юрлицо.
8. Секреты подписи в `build.gradle`/репо → утечка → env/keystore.properties/CI-vault.

## 7. Фазинг + оценка
- **Спайк app-build (§1)** — оценить static/SPA-сборку клиентских роутов → решить A vs B. ~50–100K, 0.5 сессии.
- **Фаза 1 — Android debug-APK** (без аккаунтов/Mac): `cap add android` + плагины + offline-страница →
  сайдлоад на реальный Android. ~150–250K, 1 сессия. (Нужен Android SDK/Studio локально или CI.)
- **Фаза 2 — iOS + TestFlight** (нужен Mac + Apple Developer).
- **Фаза 3 — сабмиты** (Play + RuStore[нужен ИП] + App Store): метаданные/скриншоты/privacy-labels + ревью.
- **Push** — отдельный кусок (~150–250K), можно отложить в v1.
- **Итого код:** ~250–600K токенов, 1–3 сессии. **Календарь до сторов: 2–5 недель** (доминируют верификация
  аккаунтов, наличие Mac, ИП для RuStore, ревью — не токены).

## 8. Обновление дизайна = почти синхронно, без ревью стора (зависит от §1)
- **server.url:** один web-деплой `peredarim.ru` → мобильный веб + iOS + Android на следующем холодном старте.
- **bundled+OTA:** web-деплой + **OTA-publish (Capgo)** → все платформы без ревью стора; native-изменения → релиз.
- Оба сохраняют «дизайн едет без ревью». **Только нативное** (плагин/permission/конфиг/иконка/Capacitor) → стор.
- Нюансы: видно на следующем запуске (кэш; можно version-check + reload); откат связан (платформы на одном
  бандле); парити WKWebView/Blink ≈ Chromium-теста, мелкие дельты — ручной device-QA.

## 9. Тестирование (сценарии + безопасность)
Принцип: **приложение = web в WebView** → ~90% тестов = существующий web/бэкенд-сьют, плюс нативная прослойка.

**Сценарии (автомат):** Playwright функц.+флоу на **mobile-375 = эталон iPhone** (логин/продать/купить/чат/
каталог/фильтры — тот же DOM/CSS, что в WebView); `npm run test:visual`; `pytest` (тот же API). → CI-гейты
web-деплоя = регресс-сьют приложения по построению.

**Нативная прослойка:** unit на feature-detect/degrade (натив vs web) + ревью конфига + device-QA для железа.

**Безопасность (слоями):**
- *Унаследовано (в CI + `SECURITY.md`):* тесты угроз T-01..18, `make security-check` (bandit/pip-audit/npm
  audit/gitleaks), auth-aware (`useMe`), middleware-гейтинг.
- *Нативный чек-лист:* сессия HttpOnly+Secure (токены → Keychain/Keystore, не в логах); **navigation-allowlist**
  (WebView только `peredarim.ru`, внешнее → системный браузер); только HTTPS (ATS/network-security-config);
  опц. **cert-pinning**; **least-privilege permissions**; пуш без PII в теле; `npm audit` плагинов + ADR на деп;
  **MobSF** по APK/IPA (права/секреты/конфиг); DAST OWASP ZAP по `peredarim.ru`; опц. блок скриншотов/root-детект.

**Прогон:** (1) pre-build CI; (2) ревью конфига + unit; (3) MobSF по бинарю; (4) Android-эмулятор смоук;
(5) ручной device-чек-лист (камера/гео/пуш/share/внешние ссылки/сессия); (6) опц. Firebase Test Lab / BrowserStack.

**Границы (не могу сам):** реальный iPhone/Mac, железо сенсоров, ревью сторов, пентест бинаря на jailbroken →
владелец / device-farm / ручной QA.

## Источники (ресёрч 2026-06)
- Capacitor `server.url` не для прода / version-mismatch — GitHub Discussions #5075, Issue #6225; Capawesome
  «Right Way to Update Remotely».
- Apple 4.2 web-wrapper / как пройти — MobiLoud «Webview App Rejected», Apple Dev Forums.
- OTA Capgo vs Appflow (закрытие 2026) — capgo.app «Ultimate Guide to OTA», «vs Appflow».
- Push APNs↔FCM (`@capacitor-firebase/messaging`) — dev.to «Complete Guide to Capacitor Push», Capacitor Docs.
- Android Play App Signing / keystore — developer.android.com app-signing, Play Console Help «Use Play App Signing».
- RuStore физлицам/самозанятым нельзя (нужен ИП/юрлицо) — rustore.ru/developer/blog, ТАСС, Habr.
