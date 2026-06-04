# RUNBOOK — собрать и запустить iOS-приложение «Передарим» (Capacitor)

> Нативное iOS-приложение — это **тонкая Capacitor-обёртка вокруг живого сайта**
> `https://peredarim.ru` (ADR-0004): один веб-кодбейс, нативного UI нет. WebView
> грузит задеплоенный сайт, а к камере/гео/пушам ходит через плагины. Полный путь
> публикации в три стора — `store-submission.md`; здесь — локальная сборка/запуск.

## 0. Что нужно (один раз)
- **Mac + Xcode** (есть, 26.3). Открой Xcode хотя бы раз → прими лицензию.
- **Node 20** (есть) и **CocoaPods** (`brew install cocoapods`).
- **Apple ID**. Для запуска на симуляторе/своём iPhone хватает бесплатного.
  Для TestFlight / App Store — **Apple Developer Program ($99/год)**.
- Командная строка Xcode: `sudo xcode-select -s /Applications/Xcode.app/Contents/Developer`.

## 1. Сгенерировать iOS-проект (один раз)
```bash
cd /Users/pavelshumilin/rebloom/mobile
npm install                 # ставит Capacitor + плагины
npx cap add ios             # создаёт mobile/ios/ (Xcode-проект) + pod install
npx cap sync ios            # синхронизирует конфиг/плагины
```
> `webDir` (`www/`) — только заглушка офлайн; приложение грузит `server.url =
> https://peredarim.ru` из `capacitor.config.ts`. **Собирать `web/` не нужно.**

## 2. Открыть в Xcode и запустить
```bash
npx cap open ios            # откроет mobile/ios/App/App.xcworkspace
```
В Xcode:
1. Слева выбери проект **App** → таргет **App** → вкладка **Signing & Capabilities**.
2. Поставь галку **Automatically manage signing**, в **Team** выбери свой Apple ID
   (Add Account… если нужно). **Bundle Identifier** = `ru.peredarim.app`
   (если занят при публикации — поменяй, напр. `ru.peredarim.app2`).
3. Вверху выбери устройство: **симулятор** (напр. iPhone 16) или свой подключённый iPhone.
4. Нажми **▶ Run** (⌘R). Соберётся и запустится — внутри откроется `peredarim.ru`.

Всё. Это уже рабочее приложение (просмотр ленты, карточки, и т.д.). Вход по OTP
заработает, когда на проде будет подключён SMS-провайдер.

## 3. Права устройства (Info.plist) — чтобы работали камера/гео
WebView просит доступ только если в `Info.plist` есть строки назначения. Открой
`mobile/ios/App/App/Info.plist` (в Xcode правым кликом → Open As → Source) и добавь:
```xml
<key>NSCameraUsageDescription</key>
<string>Чтобы сфотографировать букет для объявления.</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>Чтобы выбрать фото букета из галереи.</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>Чтобы показать букеты и точку самовывоза рядом с вами.</string>
```
(Пуши добавим, когда настроим APNs — не нужно для первого запуска.)

## 4. Иконка и сплеш (по желанию, перед публикацией)
```bash
cd mobile
npm i -D @capacitor/assets
# положи лого 1024×1024 в mobile/assets/icon.png и фон в assets/splash.png
npx @capacitor/assets generate --ios
npx cap sync ios
```

## 5. TestFlight / App Store (когда будет Developer-аккаунт)
1. Вверху выбери устройство **Any iOS Device (arm64)**.
2. **Product ▸ Archive** → откроется Organizer.
3. **Distribute App ▸ App Store Connect ▸ Upload**.
4. На [appstoreconnect.apple.com](https://appstoreconnect.apple.com): создай приложение
   (bundle `ru.peredarim.app`), залей метаданные/скриншоты/политику конфиденциальности,
   раздай в **TestFlight**, потом отправь на ревью.
5. **Ревью-ноты** (важно для финтех-приложения): C2C-маркетплейс, эскроу, оплата
   физического товара через **ЮKassa (не Apple IAP)**, тестовый аккаунт + сценарий,
   реальные device-фичи (камера/гео) — снимает риск Guideline 4.2/4.3.

## 6. Обновления контента — без новой сборки
Приложение грузит живой сайт, поэтому `git push` + редеплой `web/` **мгновенно**
обновляет контент в приложении (OTA-стиль, в рамках правил сторов). Новый бинарь нужен
только при смене плагинов/прав/иконок/версии Capacitor.

## 7. Если что-то ломается
- `pod install` падает → `cd mobile/ios/App && pod repo update && pod install`.
- Xcode 26 + Capacitor 6: если таргет деплоймента ниже минимального — в проекте App
  подними **iOS Deployment Target** до 14.0+.
- «Untrusted Developer» на iPhone → Settings ▸ General ▸ VPN & Device Management →
  доверь своему сертификату.
- Белый экран → проверь, что `peredarim.ru` открывается в Safari (TLS/делегирование ок).
