import { test, expect } from '@playwright/test';

// Home = marketing landing + live catalog (canon PdLanding, ./marketing). The shell
// (nav brand, hero, catalog/safety sections) renders independent of /api/feed — which
// has no backend in CI. Catalog data-states live in feed.spec.ts.
test('home renders the landing shell (brand + hero + catalog)', async ({ page }) => {
  // The landing metro bar fetches GET /api/geo/metro (lib/metro.ts) — mock it for hermeticity.
  await page.route('**/api/geo/metro**', (r) =>
    r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, data: { stations: [] } }) }),
  );
  await page.goto('/');
  await expect(page.locator('.pdl')).toBeVisible();
  // scope to the nav: the burger drawer (portaled to <body>) also carries a `.pdl-brand`
  await expect(page.locator('.pdl-nav .pdl-brand')).toBeVisible();
  await expect(page.locator('#catalog')).toBeVisible();
  await expect(page.locator('#safety')).toBeVisible();
});
