import { test, expect, type Route } from '@playwright/test';

// Admin is desktop-first (ADMIN_DESIGN_BRIEF) — drive these at a desktop viewport.
test.use({ viewport: { width: 1280, height: 900 } });

function ok(route: Route, data: unknown) {
  return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, data }) });
}
async function asAdmin(route: Route) {
  return ok(route, { admin: true, user: {} });
}

test('finance: KPIs + reconcile', async ({ page }) => {
  await page.route('**/api/admin/whoami', asAdmin);
  await page.route('**/api/admin/finance**', (r) => ok(r, { gmv_kopecks: 100000000, commission_kopecks: 10000000, payout_kopecks: 60000000, refund_kopecks: 5000000, held_kopecks: 25000000, deals_by_status: { released: 100 } }));
  await page.goto('/admin/finance');
  await expect(page.getByRole('heading', { name: 'Финансы' })).toBeVisible();
  await expect(page.getByText('Комиссия площадки')).toBeVisible();
  await expect(page.getByText(/Сверка ledger сходится/)).toBeVisible();
});

test('users: table + search', async ({ page }) => {
  await page.route('**/api/admin/whoami', asAdmin);
  await page.route('**/api/admin/users**', (r) => ok(r, { items: [{ id: 'u1', display_name: 'Аня', city_id: 'msk', status: 'active', seller_rating: 4.9, listings_count: 3 }] }));
  await page.goto('/admin/users');
  await expect(page.getByText('Аня')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Блокировать' })).toBeVisible();
});

test('fraud: signal with risk score', async ({ page }) => {
  await page.route('**/api/admin/whoami', asAdmin);
  await page.route('**/api/admin/fraud**', (r) => ok(r, { items: [{ id: 'f1', type: 'multi_account', score: 80, status: 'open', user_id: 'u1abcdef' }] }));
  await page.goto('/admin/fraud');
  await expect(page.getByText('Мульти-аккаунт по IP/устройству')).toBeVisible();
  await expect(page.getByText('80')).toBeVisible();
});

test('reports: list', async ({ page }) => {
  await page.route('**/api/admin/whoami', asAdmin);
  await page.route('**/api/admin/reports**', (r) => ok(r, { items: [{ id: 'r1', target_type: 'listing', target_id: 'l1', reason: 'Чужие фото', status: 'open' }] }));
  await page.goto('/admin/reports');
  await expect(page.getByText('Чужие фото')).toBeVisible();
  await expect(page.getByRole('link', { name: /Открыть объявление/ })).toBeVisible();
});
