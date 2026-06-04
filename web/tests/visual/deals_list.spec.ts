import { test, expect, type Route } from '@playwright/test';

function json(route: Route, data: unknown) {
  return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, data }) });
}
function deal(id: string, status: string, amount: number, role = 'buyer') {
  return {
    id,
    status,
    role,
    listing: { id: 'L' },
    counterparty: { id: 's1' },
    amount_kopecks: amount,
    commission_kopecks: Math.round(amount * 0.1),
    delivery_method: 'self_pickup',
    created_at: '2026-06-04T15:00:00Z',
  };
}

test('deals: list of my deals', async ({ page }) => {
  await page.route('**/api/deals?**', (r) => json(r, { items: [deal('d1', 'paid_held', 99000), deal('d2', 'released', 150000, 'seller')], next_cursor: null }));
  await page.goto('/deals');
  await expect(page.getByText('Букет · 990 ₽')).toBeVisible();
  await expect(page.getByText('Букет · 1 500 ₽')).toBeVisible();
  await expect(page.getByText('в эскроу')).toBeVisible();
  await expect(page.locator('.pd-bottomnav')).toBeVisible();
});

test('deals: empty state', async ({ page }) => {
  await page.route('**/api/deals?**', (r) => json(r, { items: [], next_cursor: null }));
  await page.goto('/deals');
  await expect(page.getByText('Пока нет сделок')).toBeVisible();
});
