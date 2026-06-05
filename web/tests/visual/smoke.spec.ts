import { test, expect } from '@playwright/test';

// Home shell renders in every fetch state (TopBar + BottomNav are always present,
// independent of the /api/feed result — which has no backend in CI). Data-state
// coverage (loaded/empty/offline) lives in feed.spec.ts via route stubbing.
test('home shell renders (brand + bottom nav)', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.pd-root')).toBeVisible();
  // Target the shell brand element specifically — getByText('Передарим') is ambiguous
  // (also matches the <head><title>Передарим — …</title>), which trips strict mode.
  await expect(page.locator('.pd-brand')).toBeVisible();
  await expect(page.locator('.pd-bottomnav')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Продать' })).toBeVisible();
});
