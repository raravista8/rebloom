import { test, expect } from '@playwright/test';

// Home = marketing landing + live catalog (canon PdLanding, ./marketing). The shell
// (nav brand, hero, catalog/safety sections) renders independent of /api/feed — which
// has no backend in CI. Catalog data-states live in feed.spec.ts.
test('home renders the landing shell (brand + hero + catalog)', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.pdl')).toBeVisible();
  // scope to the nav: the burger drawer (portaled to <body>) also carries a `.pdl-brand`
  await expect(page.locator('.pdl-nav .pdl-brand')).toBeVisible();
  await expect(page.locator('#catalog')).toBeVisible();
  await expect(page.locator('#safety')).toBeVisible();
});
