import { defineConfig, devices } from '@playwright/test';

// Visual-regression + smoke harness (T2.2). Mobile-first: the primary viewport is a
// phone (DESIGN_BRIEF §1). Pixel-diff baselines are added per screen; this config
// boots the production build and drives a real browser so we verify canon renders
// end-to-end. ≤2% diff threshold is enforced via toHaveScreenshot maxDiffPixelRatio.
export default defineConfig({
  testDir: './tests/visual',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'line' : 'list',
  expect: {
    // ≤2% pixel difference (CLAUDE.md UI DoD). Freeze animations so framer-motion
    // reveals/springs don't make shots flaky.
    toHaveScreenshot: { maxDiffPixelRatio: 0.02, animations: 'disabled', caret: 'hide' },
  },
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    // A dummy `session` cookie so middleware.ts (the server-side auth gate) lets the
    // authed routes (/sell, /deal, /admin, …) render in the harness. Tests still mock
    // the APIs; the gate only checks cookie presence. Public-route specs are unaffected.
    storageState: './tests/visual/_session-state.json',
  },
  projects: [
    {
      // Functional/DOM specs run mobile-first; they own the admin desktop cases
      // inline via test.use(). `desktop.spec.ts` is for the desktop project only.
      name: 'mobile-375',
      use: { ...devices['Pixel 5'], viewport: { width: 375, height: 800 } },
      testIgnore: '**/desktop.spec.ts',
    },
    {
      // Desktop layout coverage — the suite was 360-only, so desktop regressions
      // (clamped split, clipped text, mobile-tree-on-desktop) shipped unseen.
      // `pixel.spec.ts` runs in BOTH projects → mobile + desktop baselines.
      name: 'desktop-1280',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 900 } },
      testMatch: ['**/desktop.spec.ts', '**/pixel.spec.ts'],
    },
  ],
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
