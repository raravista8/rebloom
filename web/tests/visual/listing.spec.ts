import { test, expect, type Route } from '@playwright/test';

const PHOTO =
  'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%221%22%20height%3D%221%22/%3E';

function detail(over: Record<string, unknown> = {}) {
  return {
    id: 'l1',
    photos: [{ card_url: PHOTO, full_url: PHOTO }, { card_url: PHOTO, full_url: PHOTO }],
    size: 'M',
    freshness: 'today',
    price_kopecks: 190000,
    city_id: 'msk',
    status: 'active',
    like_count: 8,
    liked: false,
    seller: { id: 's1', display_name: 'Аня', seller_rating: 4.9, deals_count: 12 },
    ...over,
  };
}

function stub(route: Route, body: unknown, ok = true, status = 200) {
  return route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(ok ? { ok: true, data: body } : { ok: false, error: body }),
  });
}

test('loaded: price, pay-at-meeting notice, write-seller CTA', async ({ page }) => {
  await page.route('**/api/listings/l1', (r) => stub(r, detail()));
  await page.goto('/l/l1');
  await expect(page.getByText('Оплата при встрече.')).toBeVisible();
  await expect(page.getByText('Размер M · 7–15 шт.')).toBeVisible();
  await expect(page.getByRole('button', { name: /Написать продавцу · 1 900 ₽/ })).toBeEnabled();
});

test('sold: overlay + "смотреть свежие"', async ({ page }) => {
  await page.route('**/api/listings/l1', (r) => stub(r, detail({ status: 'sold' })));
  await page.goto('/l/l1');
  await expect(page.getByText('Уже продано')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Смотреть свежие букеты' })).toBeVisible();
});

test('not found: friendly message', async ({ page }) => {
  await page.route('**/api/listings/l1', (r) => stub(r, 'not_found', false, 404));
  await page.goto('/l/l1');
  await expect(page.getByText('Этого букета больше нет.')).toBeVisible();
});
