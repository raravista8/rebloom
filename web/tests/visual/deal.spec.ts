import { test, expect, type Route } from '@playwright/test';

const PHOTO = 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%221%22%20height%3D%221%22/%3E';

function deal(status: string, over: Record<string, unknown> = {}) {
  return {
    id: 'd1',
    status,
    listing: { id: 'l1', photo_thumb_url: PHOTO, price_kopecks: 99000 },
    role: 'buyer',
    counterparty: { id: 's1', display_name: 'Аня', seller_rating: 4.9 },
    delivery_method: 'self_pickup',
    created_at: '2026-06-04T15:00:00Z',
    ...over,
  };
}

function json(route: Route, data: unknown) {
  return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, data }) });
}

function msg(id: string, body: string, mine: boolean, held = false) {
  return { id, sender_id: mine ? 'me' : 's1', body, held, mine, created_at: '2026-06-04T15:01:00Z' };
}

test('meeting: pay-at-meeting notice + chat + address + confirm CTA', async ({ page }) => {
  await page.route('**/api/deals/d1', (r) => json(r, deal('meeting')));
  await page.route('**/api/deals/d1/messages', (r) => json(r, { items: [msg('m1', 'Можно забрать после 18:00 🌸', false)], next_cursor: null }));
  await page.route('**/api/deals/d1/delivery', (r) => json(r, { revealed: true, address: 'Двор, Тверская 12' }));
  await page.goto('/deal/d1');
  await expect(page.getByText('Встреча назначена.')).toBeVisible();
  await expect(page.getByText('Можно забрать после 18:00 🌸')).toBeVisible();
  await expect(page.getByText('Двор, Тверская 12')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Подтвердить получение' })).toBeEnabled();
});

test('confirm receipt → done + review CTA', async ({ page }) => {
  let confirmed = false;
  await page.route('**/api/deals/d1', (r) => json(r, deal(confirmed ? 'done' : 'meeting')));
  await page.route('**/api/deals/d1/messages', (r) => json(r, { items: [], next_cursor: null }));
  await page.route('**/api/deals/d1/delivery', (r) => json(r, { revealed: true, address: 'Двор' }));
  await page.route('**/api/deals/d1/confirm-receipt', (r) => {
    confirmed = true;
    return json(r, deal('done'));
  });
  await page.goto('/deal/d1');
  await page.getByRole('button', { name: 'Подтвердить получение' }).click();
  await expect(page.getByText('Готово!')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Оценить продавца' })).toBeVisible();
});

test('problem: report notice + chat input', async ({ page }) => {
  await page.route('**/api/deals/d1', (r) => json(r, deal('problem')));
  await page.route('**/api/deals/d1/messages', (r) => json(r, { items: [msg('s1', 'Поддержка подключилась', false)], next_cursor: null }));
  await page.goto('/deal/d1');
  await expect(page.getByText('Жалоба на рассмотрении.')).toBeVisible();
  await expect(page.getByPlaceholder('Сообщение…')).toBeVisible();
});
