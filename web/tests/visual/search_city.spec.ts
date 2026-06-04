import { test, expect, type Route } from '@playwright/test';

const PHOTO = 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%221%22%20height%3D%221%22/%3E';
function json(route: Route, data: unknown) {
  return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, data }) });
}
function card(id: string, price: number) {
  return { id, photo_thumb_url: PHOTO, size: 'M', freshness: 'today', price_kopecks: price, city_id: 'msk', like_count: 1, liked: false, seller: { id: 's', display_name: 'Аня', seller_rating: 5 } };
}

test('search: idle → results', async ({ page }) => {
  await page.route('**/api/search**', (r) => json(r, { items: [card('l1', 90000)], next_cursor: null, applied: { q: 'розы', city_id: 'msk' } }));
  await page.goto('/search');
  await expect(page.getByText('Введите название букета')).toBeVisible();
  await page.getByLabel('Поиск').fill('розы');
  await expect(page.locator('.pd-card')).toHaveCount(1);
});

test('search: no-results distinct from idle', async ({ page }) => {
  await page.route('**/api/search**', (r) => json(r, { items: [], next_cursor: null, applied: { q: 'пионы пионовидные', city_id: 'msk' } }));
  await page.goto('/search');
  await page.getByLabel('Поиск').fill('пионы пионовидные');
  await expect(page.getByText('Ничего не нашлось')).toBeVisible();
  await expect(page.getByText('пионы пионовидные')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Сбросить фильтры' })).toBeVisible();
});

test('city: list with current marked, pick navigates home', async ({ page }) => {
  await page.route('**/api/feed**', (r) => json(r, { items: [], next_cursor: null, applied: { city_id: 'spb' } }));
  await page.goto('/city');
  await expect(page.getByText('Москва')).toBeVisible();
  await expect(page.getByText('Санкт-Петербург')).toBeVisible();
  await page.getByText('Санкт-Петербург').click();
  await page.waitForURL((url) => url.pathname === '/');
  expect(await page.evaluate(() => document.cookie.includes('city=spb'))).toBe(true);
});
