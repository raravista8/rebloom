import { test, expect } from '@playwright/test';

// Scaffold smoke: proves the whole pipeline renders in a real browser —
// canon ESM transpile, 'use client' hydration, framer-motion, CSS-var tokens,
// Golos Text. Per-screen pixel-diff baselines are added in T2.2 as screens land.
test('home renders the canon витрина', async ({ page }) => {
  await page.goto('/');
  // canon scopes its theme to .pd-root[data-pd-theme]
  await expect(page.locator('.pd-root').first()).toBeVisible();
  // top feed section header from the canon screen
  await expect(page.getByText('Самые свежие').first()).toBeVisible();
});
