# PLAN B — запуск как PWA с пушами (вместо/до нативных приложений)

> Альтернатива нативным приложениям (`mobile-apps-plan.md` = Plan A): запуститься как **PWA**
> (устанавливаемое web-приложение) с **рабочими пуш-уведомлениями** на iOS и Android. Почти всё —
> web/бэкенд (моя зона, тестируемо), **без Mac, аккаунтов разработчика, сторов, ревью, ИП**. Ресёрч
> 2026-06; источники в конце. Архитектура — ADR-0004 (один web-кодбейс).

## 0. TL;DR — когда брать Plan B
- **Плюсы:** запуск за **дни** (не недели), ноль внешних блокеров (Mac/$99/$25/УКЭП/ИП/ревью сторов),
  мгновенные апдейты (это и есть web), переиспользует наш `core/notifications` + порт `PushProvider`.
- **Главный минус (iOS):** пуши работают **только если пользователь установил PWA на экран «Домой»** →
  охват пуша на iOS ~в 10–15× меньше нативного (шаг установки). На Android — гладко.
- **Рекомендация:** **Plan B как запуск сейчас**, нативные приложения (Plan A) — позже; web-push и
  нативный push могут сосуществовать, а manifest/SW/WebPushProvider переиспользуются.

## 1. Что PWA даёт и чего НЕ даёт
**Даёт:** установку на «Домой» (иконка, сплэш, standalone-режим без браузерного UI); **web-push**
(Android везде; iOS — см. §2); offline (service-worker кэш, опц.); камера (`getUserMedia` на `/sell`),
гео (`geolocation` на самовывозе), share (`navigator.share`) — через web-API с permission.
**НЕ даёт:** присутствия/находимости в сторах; на iOS — **silent/background push, Background Sync,
Live Activities, Time-Sensitive** (Apple не отдаёт PWA); фоновое обновление контента.

## 2. ⚠️ iOS push — реальность (ключевой нюанс)
- Web Push на iOS с **16.4+** (март 2023). **ТОЛЬКО для PWA, добавленной на «Домой»** (Safari → Поделиться →
  «На экран Домой»). Открытая вкладка Safari **не** имеет доступа к `PushManager`.
- ~95%+ iPhone на iOS 16+ (нач. 2026); iOS 26 — сайты с «Домой» по умолчанию открываются как web-app.
- **Safari 18.4** — Declarative Web Push (упрощённый путь, можно без service worker для базового пуша).
- **EU-DMA:** в ЕС Apple сломала standalone-PWA → там пуша нет. **Нас (РФ) не касается.**
- **Android:** стандартный Web Push + VAPID, работает и во вкладке, и в установленной PWA — без трения.
- **Вывод:** iOS-пуш стоит **шага установки** → делаем явный, мягкий install-онбординг (§5) и просим
  permission на value-moment, а не на загрузке.

## 3. Архитектура (встаёт в существующие notifications)
Стандартный Web Push (VAPID), без сторонних сервисов:
1. **VAPID-ключи** (public/private) — генерим один раз; private = секрет (env).
2. **Клиент:** регистрируем **service worker** → запрашиваем permission → `pushManager.subscribe({
   userVisibleOnly:true, applicationServerKey: VAPID_PUBLIC })` → шлём **subscription** (endpoint + p256dh/auth)
   на бэкенд.
3. **Бэкенд:** хранит `push_subscription` на юзера; при событии шлёт через **Web Push protocol** (библиотека
   **`pywebpush`**, Python), подписывая VAPID → POST на endpoint subscription. **Встаёт адаптером
   `WebPushProvider` под уже существующий порт `PushProvider` + outbox** (`core/notifications`, T12.1) — триггеры
   (смена статуса сделки, новое сообщение, и т.д.) уже разведены, просто получают новый канал доставки.
4. **Service worker:** событие `push` → `showNotification` (заголовок/тело/иконка/deeplink); `notificationclick`
   → открыть нужный экран (`/deal/[id]` и т.п.).
5. **Чистка:** при ответе push-сервиса 404/410 (endpoint протух) — удалять subscription. Периодически валидировать.

## 4. Шаги реализации
1. **PWA-манифест** (`app/manifest.ts` / `manifest.webmanifest`): name «Передарим», short_name, **иконки**
   192/512 + **maskable**, theme/background-color, `display:'standalone'`, `start_url`, scope, lang `ru`.
   Прилинковать в `<head>` (Next.js metadata).
2. **Service worker** (Next.js App Router → **Serwist** (преемник `next-pwa`) или ручной SW): push + минимальный
   offline-shell (app-страница/«нет сети»); правильный scope + заголовки (`Service-Worker-Allowed`).
3. **Web-push клиент** (`lib/push.ts`): register SW, permission-flow (на value-moment), subscribe, отправка
   subscription на бэкенд; **standalone-детект** (`navigator.standalone`/`display-mode: standalone`).
4. **iOS install-онбординг** (§5): детект iOS-Safari-не-standalone → подсказка «Поделиться → На экран Домой».
5. **Бэкенд:** `WebPushProvider` (через `pywebpush`, VAPID) + миграция `push_subscription` (user_id, endpoint,
   p256dh, auth, ua, created_at) + endpoint `POST /api/me/push/subscribe` / `DELETE …/unsubscribe` + чистка
   протухших + wire в outbox. **`pywebpush` — рантайм-деп → нужен ADR** (правило CLAUDE.md: нет рантайм-депа без ADR).
6. **Копирайт/согласие:** пуш-permission — отдельное мягкое согласие; пуши без PII в теле (правило
   NOTIFICATIONS.md); deeplink на экран, не данные в URL.

## 5. UX установки и permission (критично для конверсии)
- **Android/Chrome:** ловим `beforeinstallprompt` → своя кнопка «Установить приложение»; permission на пуш — на
  value-moment (после первой сделки/лайка), не на первом экране.
- **iOS/Safari:** `beforeinstallprompt` НЕТ → показываем **инструкцию** «Поделиться ⬆️ → На экран Домой»
  (детект iOS + не-standalone); пуш-permission просим **уже внутри установленной PWA** (иначе `PushManager`
  недоступен) + после явного действия пользователя.
- Не спамить промптом: один раз, с возможностью «позже», уважать отказ.

## 6. Тестирование
- **Playwright (автомат):** наличие/корректность manifest; регистрация SW; subscribe-flow (мок `pushManager`);
  состояния permission (default/granted/denied); install-подсказка для iOS-ветки (эмуляция UA/standalone).
- **Бэкенд (pytest):** `WebPushProvider` (VAPID-подпись, отправка — замокать HTTP), хранение/удаление
  subscription, чистка 404/410, wire в outbox (дедуп per event+channel — уже есть).
- **Реальные устройства (ручной чек-лист):** Android — установка + пуш приходит (foreground/background/закрыто);
  iOS 16.4+ — Add-to-Home-Screen → permission → пуш приходит; notificationclick → нужный экран; протухание.
- Безопасность (§7) — в чек-лист.

## 7. Безопасность
- **VAPID private key** — секрет (env, не в git); ротация по инциденту.
- **Subscription endpoint** — чувствительно (привязка к юзеру/устройству) → хранить как PII-смежное, доступ
  по сессии владельца; не логировать целиком.
- **Пуш без PII** в теле (NOTIFICATIONS.md) — заголовок/короткий текст + deeplink, не данные.
- Наследует весь backend/web threat-model + CI (`SECURITY.md`); `pywebpush` через `npm/pip-audit` + ADR.
- Согласие на пуши — версионируется (ФЗ-152, как consent).

## 8. Оценка
| Кусок | ~Токены |
|---|---|
| Манифест + иконки (maskable) | 40K |
| Service worker (push + offline-shell) | 80K |
| Web-push клиент + permission/install UX + iOS-онбординг | 100K |
| Бэкенд `WebPushProvider` + `push_subscription` миграция + endpoints + ADR `pywebpush` + чистка | 120K |
| Тесты (Playwright + pytest) | 60K |

**Итого ~250–400K токенов, 1–2 сессии. Календарь — дни** (нет внешних блокеров). Почти всё делаю и **тестирую
сам**; только финальный «пуш реально пришёл на iPhone/Android» — ручной device-смоук.

## 9. Переход на натив позже (Plan A) — без потерь
manifest, иконки, service-worker-логика и **`WebPushProvider`/`push_subscription`** переиспользуются; нативные
пуши (APNs/FCM) добавятся как **второй** `PushProvider`-адаптер — web-push и нативный push сосуществуют (юзер на
PWA получает web-push, юзер из стора — нативный). То есть Plan B — не тупик, а первый слой того же контура.

## Источники (2026-06)
- iOS web push только для home-screen PWA (16.4+), Safari 18.4 Declarative, EU-DMA — magicbell.com «PWA iOS
  Limitations 2026», mobiloud.com «Do PWAs Work on iOS 2026», academy.insiderone.com «Web Push for Mobile Safari».
- Архитектура VAPID/SW/pywebpush + чистка протухших — MDN «Re-engageable Notifications & Push», magicbell.com
  «Push Notifications in PWAs», dev.to «Notifications in PWAs using web push».
- Охват ~10–15× меньше натива, нет iOS background/silent/Live Activities — mobiloud/brainhub/magicbell (выше).
