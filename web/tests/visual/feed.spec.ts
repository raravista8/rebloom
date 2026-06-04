import { test, expect, type Route } from '@playwright/test';

// Home feed data-state coverage (INTERACTION_STATES §4) via /api/feed stubbing —
// no backend needed. Covers loaded / empty / offline distinctly.

const PHOTO =
  'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%221%22%20height%3D%221%22/%3E';

function card(id: string, price_kopecks: number) {
  return {
    id,
    photo_thumb_url: PHOTO,
    size: 'M',
    freshness: 'today',
    price_kopecks,
    city_id: 'msk',
    like_count: 3,
    liked: false,
    seller: { id: 's1', display_name: 'Аня', seller_rating: 4.8 },
  };
}

function envelope(items: unknown[]) {
  return JSON.stringify({ ok: true, data: { items, next_cursor: null, applied: { city_id: 'msk' } } });
}

async function stubFeed(route: Route, freshItems: unknown[], likedItems: unknown[]) {
  const liked = route.request().url().includes('section=liked');
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: envelope(liked ? likedItems : freshItems),
  });
}

test('loaded: renders both sections with cards', async ({ page }) => {
  await page.route('**/api/feed**', (r) => stubFeed(r, [card('f1', 180000)], [card('l1', 250000)]));
  await page.goto('/');
  await expect(page.getByText('Самые свежие')).toBeVisible();
  await expect(page.getByText('Самые залайканные')).toBeVisible();
  await expect(page.locator('.pd-card')).toHaveCount(2);
  await expect(page.getByText('1 800 ₽')).toBeVisible();
  await expect(page.getByText('2 500 ₽')).toBeVisible();
});

test('empty: no listings in city → empty state CTA', async ({ page }) => {
  await page.route('**/api/feed**', (r) => stubFeed(r, [], []));
  await page.goto('/');
  await expect(page.getByText('Здесь пока пусто')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Опубликовать букет' })).toBeVisible();
});

test('offline: network failure → offline state with retry', async ({ page }) => {
  await page.route('**/api/feed**', (r) => r.abort('failed'));
  await page.goto('/');
  await expect(page.getByText('Нет соединения')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Повторить' })).toBeVisible();
});
