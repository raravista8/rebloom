# mobile/ — Capacitor wrapper (Передарим iOS/Android)

The native apps are a thin Capacitor shell around the **live web app**
(`https://peredarim.ru`) — one codebase, no native UI (ADR-0004). Because the web is a
server-rendered Next.js app, we use `server.url` (not a static export): the WebView
loads the deployed site and reaches device features via Capacitor plugins.

Full store flow (App Store / Google Play / RuStore): `docs/runbooks/store-submission.md`.

## Build quickstart

Prerequisites: **iOS** → a Mac with Xcode + Apple Developer Program ($99/yr).
**Android** → Android Studio + Google Play Console ($25) and/or RuStore + УКЭП.

```bash
cd mobile
npm install

# generate the native projects (once; ios needs a Mac)
npx cap add ios
npx cap add android

# after any config/plugin change, or to pull the latest:
npx cap sync

# iOS — opens Xcode → set Team/signing → Product ▸ Archive → Distribute (App Store)
npx cap open ios

# Android — opens Android Studio → Build ▸ Generate Signed Bundle (.aab) → upload
npx cap open android
```

There is **no `web` build/export step** here — the app loads the live deployment, so a
`git push` + redeploy of `web/` updates the app content instantly (OTA-like), within
store rules. A new native release is only needed for plugin/permission/icon changes.

## Per-platform config done after `cap add`
- **Icons / splash**: `npx @capacitor/assets generate` (drop a 1024×1024 logo).
- **Permissions** (Info.plist / AndroidManifest): camera (фото букета), location
  (самовывоз), push (статус сделки) — wire the matching usage strings.
- **Push**: APNs key (iOS) + FCM `google-services.json` (Android).
- Payments are external ЮKassa (physical goods) — **no Apple IAP / Play Billing**.
