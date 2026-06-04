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
    // ≤2% pixel difference (CLAUDE.md UI DoD).
    toHaveScreenshot: { maxDiffPixelRatio: 0.02 },
  },
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'mobile-360',
      use: { ...devices['Pixel 5'], viewport: { width: 360, height: 800 } },
    },
  ],
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
