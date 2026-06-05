import { test, expect, type Route } from '@playwright/test';

const PHOTO = 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%221%22%20height%3D%221%22/%3E';

function deal(status: string) {
  return {
    id: 'd1',
    status,
    listing: { id: 'l1', photo_thumb_url: PHOTO, price_kopecks: 99000 },
    role: 'buyer',
    counterparty: { id: 's1', display_name: 'Аня', seller_rating: 4.9 },
    delivery_method: 'self_pickup',
    created_at: '2026-06-04T15:00:00Z',
  };
}
function json(route: Route, data: unknown) {
  return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, data }) });
}

test('review: validation then submit → спасибо', async ({ page }) => {
  await page.route('**/api/deals/d1', (r) => json(r, deal('done')));
  await page.route('**/api/deals/d1/review', (r) => json(r, { id: 'r1', score: 5, text: 'ok' }));
  await page.goto('/deal/d1/review');
  await expect(page.getByText('Оцените Аня')).toBeVisible();
  await page.getByRole('button', { name: 'Отправить отзыв' }).click();
  await expect(page.getByText('Напишите пару слов об опыте')).toBeVisible();
  await page.getByLabel('Текст отзыва').fill('Свежий букет, спасибо!');
  await page.getByRole('button', { name: 'Отправить отзыв' }).click();
  await expect(page.getByText('Спасибо за отзыв!')).toBeVisible();
});

test('report: reason required, then submit → back to deal', async ({ page }) => {
  await page.route('**/api/deals/d1/report', (r) => json(r, deal('problem')));
  await page.route('**/api/deals/d1', (r) => json(r, deal('problem')));
  await page.route('**/api/deals/d1/messages', (r) => json(r, { items: [], next_cursor: null }));
  await page.goto('/deal/d1/dispute/new');
  await page.getByRole('button', { name: 'Отправить жалобу' }).click();
  await expect(page.getByText('Выберите причину')).toBeVisible();
  await page.getByText('Повреждён').click();
  await page.getByRole('button', { name: 'Отправить жалобу' }).click();
  await page.waitForURL('**/deal/d1');
});
