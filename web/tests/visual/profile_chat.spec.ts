import { test, expect, type Route } from '@playwright/test';

const PHOTO = 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%221%22%20height%3D%221%22/%3E';

function json(route: Route, data: unknown, ok = true, status = 200) {
  return route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(ok ? { ok: true, data } : { ok: false, error: data }) });
}

const profile = (reviews: unknown[]) => ({
  user: { id: 'u1', display_name: 'Аня Петрова', seller_rating: 4.9, deals_count: 23, city_id: 'msk' },
  reviews,
  active_listings: [],
});

test('profile: header, rating, reviews', async ({ page }) => {
  await page.route('**/api/users/u1', (r) =>
    json(r, profile([{ id: 'r1', author_id: 'b1', score: 5, text: 'Букет был свежий, как на фото!', created_at: '2026-06-02T10:00:00Z' }])),
  );
  await page.goto('/u/u1');
  await expect(page.getByRole('heading', { name: 'Аня Петрова' })).toBeVisible();
  await expect(page.getByText('· 23 сделки')).toBeVisible();
  await expect(page.getByText('Букет был свежий, как на фото!')).toBeVisible();
});

test('profile: empty reviews', async ({ page }) => {
  await page.route('**/api/users/u1', (r) => json(r, profile([])));
  await page.goto('/u/u1');
  await expect(page.getByText('Отзывов пока нет.')).toBeVisible();
});

test('profile: not found', async ({ page }) => {
  await page.route('**/api/users/u1', (r) => json(r, 'not_found', false, 404));
  await page.goto('/u/u1');
  await expect(page.getByText('Профиль не найден.')).toBeVisible();
});

test('listing chat: empty then send a message', async ({ page }) => {
  await page.route('**/api/listings/l1', (r) =>
    json(r, { id: 'l1', photos: [{ card_url: PHOTO, full_url: PHOTO }], size: 'M', freshness: 'today', price_kopecks: 99000, city_id: 'msk', status: 'active', like_count: 0, liked: false, seller: { id: 's1', display_name: 'Аня', seller_rating: 5 } }),
  );
  await page.route('**/api/listings/l1/messages', (r) => {
    if (r.request().method() === 'POST') return json(r, { id: 'm1', sender_id: 'me', body: 'Здравствуйте! Букет ещё актуален?', held: false, mine: true, created_at: '2026-06-04T16:00:00Z' });
    return json(r, { items: [], next_cursor: null });
  });
  await page.goto('/l/l1/chat');
  await expect(page.getByText('Напишите продавцу')).toBeVisible();
  await page.getByPlaceholder('Сообщение…').fill('Здравствуйте! Букет ещё актуален?');
  await page.getByRole('button', { name: 'Отправить' }).click();
  await expect(page.getByText('Здравствуйте! Букет ещё актуален?')).toBeVisible();
});
