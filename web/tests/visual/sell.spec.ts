import { test, expect, type Route } from '@playwright/test';

function json(route: Route, data: unknown, ok = true, status = 200) {
  return route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(ok ? { ok: true, data } : { ok: false, error: data }),
  });
}

const me = { id: 'u1', display_name: 'Аня', phone_masked: '+7 999 •••', city_id: 'msk', roles: ['seller'], seller_rating: 5, deals_count: 0 };

// The metro picker (msk → metro section) now fetches GET /api/geo/metro on mount —
// mock it so the publish form is hermetic.
test.beforeEach(async ({ page }) => {
  await page.route('**/api/geo/metro**', (r) =>
    json(r, { stations: [{ id: 'msk-kurskaya', name: 'Курская', lines: [{ name: 'Кольцевая', color: '#894E35' }] }] }),
  );
});

test('auth gate: unauthenticated → redirected to login', async ({ page }) => {
  await page.route('**/api/me', (r) => json(r, 'unauthorized', false, 401));
  await page.goto('/sell');
  await page.waitForURL('**/login**');
  // /login opens at the OAuth-first chooser (AUTH_HANDOFF)
  await expect(page.locator('[data-provider="phone"]')).toBeVisible();
});

test('validation: publish without photo/price shows inline errors', async ({ page }) => {
  await page.route('**/api/me', (r) => json(r, { user: me }));
  await page.goto('/sell');
  // form rendered once /me resolves (the publish button exists only in the form phase)
  await expect(page.getByText('Фото букета')).toBeVisible();
  await page.getByRole('button', { name: 'Опубликовать букет' }).click();
  await expect(page.getByText('Добавьте хотя бы одно фото букета')).toBeVisible();
  await expect(page.getByText('Укажите цену')).toBeVisible();
});

test('publish success: photo → price → опубликован', async ({ page }) => {
  await page.route('**/api/me', (r) => json(r, { user: me }));
  await page.route('**/api/photos', (r) => json(r, { photo_id: 'p1', upload_url: '/api/photos/p1/upload' }));
  await page.route('**/api/photos/*/upload', (r) => json(r, { variants: {} }));
  await page.route('**/api/listings', (r) =>
    json(r, { id: 'newl', photos: [], size: 'M', freshness: 'today', price_kopecks: 99000, city_id: 'msk', status: 'active', like_count: 0, liked: false, seller: { id: 'u1', display_name: 'Аня', seller_rating: 5 } }),
  );
  await page.goto('/sell');
  await page.setInputFiles('input[type=file]', { name: 'b.jpg', mimeType: 'image/jpeg', buffer: Buffer.from([0xff, 0xd8, 0xff, 0xe0]) });
  await expect(page.locator('.pd-upcell .cover')).toBeVisible();
  await page.getByLabel('Цена в рублях').fill('990');
  await page.getByRole('button', { name: 'Опубликовать букет' }).click();
  await expect(page.getByText('Букет опубликован')).toBeVisible();
  await expect(page.getByRole('link', { name: 'К букету' })).toBeVisible();
});
