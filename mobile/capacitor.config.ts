import type { CapacitorConfig } from '@capacitor/cli';

// Передарим — one web codebase, wrapped by Capacitor (ADR-0004). The web app is a
// SERVER-rendered Next.js app (dynamic routes use cookies()), so it can't be a static
// export — instead the native shell loads the LIVE deployed site and uses native
// plugins (camera/geo/push/share) via the JS bridge. `webDir` is only a fallback page
// shown if the server is unreachable.
const config: CapacitorConfig = {
  appId: 'ru.peredarim.app',
  appName: 'Передарим',
  webDir: 'www',
  server: {
    url: 'https://peredarim.ru',
    // Only allow navigation to our own origin; everything else opens in the system
    // browser (ЮKassa payment pages, legal docs hosted elsewhere, etc.).
    allowNavigation: ['peredarim.ru'],
    cleartext: false,
  },
  ios: {
    contentInset: 'always',
    // Pull-to-refresh disabled — it's an app, not a browser.
    scrollEnabled: true,
  },
  android: {
    allowMixedContent: false,
  },
};

export default config;
