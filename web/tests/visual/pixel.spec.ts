import { test, expect, type Route } from '@playwright/test';

// REAL pixel-diff regression (toHaveScreenshot ≤2%, animations disabled, reduced
// motion). Runs in BOTH projects → mobile-375 + desktop-1280 baselines per screen,
// so any layout change (clamp, clip, mobile-tree-on-desktop, spacing) fails CI.
// Baselines are generated on Linux by the `visual-baselines` workflow (macOS↔Linux
// font rendering differs) — never commit locally-generated PNGs.

const PHOTO =
  'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22300%22%20height%3D%22300%22%3E%3Crect%20width%3D%22300%22%20height%3D%22300%22%20fill%3D%22%23e7d6c4%22/%3E%3C/svg%3E';
const ok = (r: Route, data: unknown) =>
  r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, data }) });

const card = (id: string, price: number) => ({
  id, photo_thumb_url: PHOTO, size: 'M', freshness: 'today', price_kopecks: price, city_id: 'msk',
  like_count: 12, liked: false, seller: { id: 's' + id, display_name: 'Аня', seller_rating: 4.9 },
});

test('login chooser', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/login');
  await expect(page.locator('.pa')).toBeVisible();
  await expect(page.locator('[data-provider="tid"]')).toBeVisible();
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot('login-chooser.png');
});

test('home landing', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route('**/api/feed**', (r) =>
    ok(r, { items: [card('1', 69000), card('2', 125000), card('3', 210000), card('4', 89000)], next_cursor: null }),
  );
  // The landing metro bar fetches GET /api/geo/metro — mock it so networkidle settles.
  await page.route('**/api/geo/metro**', (r) =>
    ok(r, { stations: [{ id: 'msk-kurskaya', name: 'Курская', lines: [{ name: 'Кольцевая', color: '#894E35' }] }] }),
  );
  await page.goto('/');
  await expect(page.locator('.pdl-nav')).toBeVisible();
  await expect(page.locator('.pdl-catgrid .pd-card').first()).toBeVisible();
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot('home-landing.png');
});

test('listing detail', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  // Logged-in viewer → WebChrome shows the авторизованный toolbar (this is the
  // baselined state). A guest sees «Войти» instead — guarded in desktop.spec.ts.
  await page.route('**/api/me', (r) =>
    ok(r, { id: 'u', display_name: 'Аня', phone_masked: 'x', city_id: 'msk', roles: ['buyer'], seller_rating: 5, deals_count: 0 }),
  );
  await page.route('**/api/listings/l1', (r) =>
    ok(r, {
      id: 'l1', photos: [{ card_url: PHOTO, full_url: PHOTO }, { card_url: PHOTO, full_url: PHOTO }],
      size: 'M', freshness: 'today', price_kopecks: 190000, city_id: 'msk', status: 'active',
      like_count: 8, liked: false, seller: { id: 's1', display_name: 'Аня', seller_rating: 4.9, deals_count: 12 },
    }),
  );
  await page.goto('/l/l1');
  await expect(page.getByText('Оплата при встрече.')).toBeVisible();
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot('listing-detail.png');
});

test('catalog', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  // /catalog = imported canon PdCatalog shell (filters/sort/states) + web's BouquetCard
  // via renderCard (real photo + wired like). Logged-in header. Browse-first grid.
  await page.route('**/api/me', (r) =>
    ok(r, { id: 'u', display_name: 'Аня', phone_masked: 'x', city_id: 'msk', roles: ['buyer'], seller_rating: 5, deals_count: 0 }),
  );
  await page.route('**/api/geo/metro**', (r) =>
    ok(r, { stations: [{ id: 'msk-sokol', name: 'Сокол', lines: [{ name: 'Замоскворецкая', color: '#2DBE2C' }] }] }),
  );
  await page.route('**/api/feed**', (r) =>
    ok(r, { items: [card('1', 69000), card('2', 125000), card('3', 210000), card('4', 89000)], next_cursor: null }),
  );
  await page.goto('/catalog');
  await expect(page.locator('.pdc-grid .pd-card').first()).toBeVisible();
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot('catalog.png');
});
