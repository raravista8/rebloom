# RUNBOOK — сборка и релиз приложений в сторы · Передарим (`rebloom`)

> Как из единого web-build (`web/`, Next.js + `@rebloom/canon`) собрать и выпустить iOS/Android через **Capacitor**, и опубликовать в **App Store + Google Play + RuStore**. Связано с ADR-0004 (web-runtime + Capacitor), DEPLOYMENT, PRIVACY_152FZ, LEGAL.

## 0. Что важно знать заранее (РФ-специфика)
- Публикуемся минимум в **три** стора: **App Store**, **Google Play**, **RuStore** (RuStore критичен для RF-Android-аудитории, у части которой нет Google Play). Опционально позже — Huawei AppGallery, Xiaomi GetApps.
- **RuStore:** верификация разработчика и настройка монетизации — через **УКЭП/ЭЦП** (квалифицированная электронная подпись). `[verify актуальные требования RuStore]`
- **App Store:** строгий ревью; для приложений с **финансовым функционалом** (у нас эскроу/платежи) и новых аккаунтов проверка может занимать **5–7 рабочих дней** (вместо 24–48 ч). Закладывать время. `[verify]`
- **Google Play:** быстрее, но верификация аккаунта (особенно RF без юрлица) — до ~2 недель. Сбор $25 (разово). `[verify]`
- **Платежи:** товар **физический** (живые букеты) → оплата через **внешний ЮKassa/СБП**, НЕ Apple IAP и НЕ Google Play Billing (для физтовара это разрешено). Чётко указать в ревью-нотах.
- RF developer-аккаунты Apple/Google могут иметь ограничения по оплате/верификации — `[verify]`; RuStore как обязательный канал снижает риск.

## 1. Предусловия (один раз)
- **Apple Developer Program** (аккаунт, $99/год), **Mac** или облачный Mac/CI для iOS-сборки и подписи.
- **Google Play Console** (аккаунт, $25 разово).
- **RuStore Console** + **УКЭП/ЭЦП**.
- **Подписи/ключи (хранить в секрет-сторе, НЕ в git):**
  - iOS: distribution-сертификат + provisioning profile (через App Store Connect / Xcode).
  - Android: **upload keystore** (.jks). ⚠️ Потеря keystore = невозможность обновлять приложение — бэкап обязателен; Google может управлять app-signing key (Play App Signing).
- Привязка к `web/`: `capacitor.config.ts` указывает на прод-сборку `web/`; bundle/application id (напр. `ru.peredarim.app`).

## 2. Сборка (из единого web-build)
```bash
# 1. собрать web (Next.js → статическая/экспортируемая сборка для wrapper)
cd web && npm run build && npm run export   # или next build (по конфигу)
# 2. синхронизировать в нативные проекты Capacitor
cd ../mobile && npx cap sync
# 3a. iOS: открыть и архивировать
npx cap open ios        # Xcode → Product > Archive → Distribute (App Store / Ad Hoc)
# 3b. Android: собрать подписанный AAB
npx cap open android    # Android Studio → Generate Signed Bundle (.aab)
# или через CLI/Fastlane/CI
```
- **Версионирование:** на каждый релиз поднимать `version` (semver) + `build number` (iOS) / `versionCode` (Android). Один web-build → одинаковый UI на всех платформах.
- **CI (рекомендуется):** Fastlane (iOS `gym`+`pilot`, Android `supply`) или облачная сборка; ключи — из секрет-стора CI.

## 3. App Store / TestFlight
1. App Store Connect → новый app record (bundle id, имя «Передарим», RU-локаль).
2. Загрузить сборку (Xcode/Transporter) → **TestFlight** (internal → external тест).
3. Метаданные: описание, **ключевые слова (до 100 символов)**, скриншоты под устройства (реальные экраны), иконка, возрастной рейтинг (учесть 18+ для платежей `[verify]`).
4. **App Privacy** (nutrition labels): задекларировать сбор данных (телефон, геолокация, фото, IP, идентификаторы) — согласовать с `PRIVACY_152FZ.md`; URL политики конфиденциальности (из `LEGAL`).
5. **Review notes:** объяснить C2C-маркетплейс, эскроу, что оплата физтовара идёт через ЮKassa (не IAP); дать тестовый аккаунт + сценарий; подчеркнуть реальные device-фичи (камера/гео/пуш) — снимает риск Guideline 4.2/4.3.
6. Submit → ожидать (финансовое приложение → до 5–7 дней).

## 4. Google Play
1. Play Console → новый app, **Play App Signing** (upload key).
2. Треки: **internal testing → closed → open → production** с **поэтапной раскаткой (%)**.
3. **Data Safety** форма (что собираем/зачем), content rating, target API level (актуальный), privacy policy URL.
4. Скриншоты/иконка/описание (RU). Загрузить AAB. Submit → ревью (часы–дни).

## 5. RuStore
1. Регистрация/верификация разработчика через **УКЭП/ЭЦП**; монетизация (если нужна) — тоже УКЭП.
2. Загрузить AAB/APK, метаданные (RU), скриншоты, политика конфиденциальности.
3. Submit → ревью (прямолинейнее, чем Apple). После — ссылка на установку.
4. (Опц.) Прямое распространение APK как фоллбэк для RF-Android.

## 6. OTA-обновления (быстрые правки без ревью)
- UI/JS-изменения (это web!) можно катить **OTA** через Capacitor Live Updates (Appflow) или `@capgo/capacitor-updater` — без полного ревью стора, в рамках правил (нельзя менять нативное поведение/обходить ревью).
- Нативные изменения (плагины, права, версия Capacitor) → полноценный релиз через сторы.

## 7. Релиз-чеклист
- [ ] version/build подняты во всех таргетах
- [ ] web-build зелёный, `npm run test:visual` ≤2%
- [ ] privacy policy + data safety/labels актуальны (ФЗ-152)
- [ ] review-ноты + тестовый аккаунт готовы (особенно Apple)
- [ ] подписи валидны; Android keystore забэкаплен
- [ ] поэтапная раскатка (Play %); TestFlight прогон
- [ ] фича-флаги новых функций выставлены

## 8. Rollback
- Play: остановить поэтапную раскатку / откатить на предыдущий релиз.
- App Store: нельзя «откатить» — выпустить хотфикс-версию; для срочного — OTA-откат JS.
- RuStore: снять/заменить версию.
- Серверное/деньги — не зависят от сторов (web + backend), правятся независимо.

## 9. Где задачи
Epic E9 (T9.1–T9.3): Capacitor-обёртка, плагины (камера/гео/пуш/share), этот чеклист публикации.
