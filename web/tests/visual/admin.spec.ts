import { test, expect, type Route } from '@playwright/test';

function ok(route: Route, data: unknown) {
  return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, data }) });
}
function err(route: Route, code: string, status: number) {
  return route.fulfill({ status, contentType: 'application/json', body: JSON.stringify({ ok: false, error: code }) });
}
const overview = { online: 12, dau: 340, mau: 5200, users_total: 8800, gmv_kopecks: 125000000, commission_kopecks: 12500000, deals_by_status: { released: 210, paid_held: 14 }, users_by_city: { msk: 5000, spb: 1800 }, users_by_platform: { web: 4000, ios: 3000 } };

test('overview: KPIs render (already 2FA)', async ({ page }) => {
  await page.route('**/api/admin/whoami', (r) => ok(r, { admin: true, user: {} }));
  await page.route('**/api/admin/overview', (r) => ok(r, overview));
  await page.goto('/admin');
  await expect(page.getByRole('heading', { name: 'Обзор' })).toBeVisible();
  await expect(page.getByText('1 250 000 ₽')).toBeVisible(); // GMV
  await expect(page.getByText('Комиссия')).toBeVisible();
});

test('denied for non-staff', async ({ page }) => {
  await page.route('**/api/admin/whoami', (r) => err(r, 'forbidden', 403));
  await page.route('**/api/me', (r) => ok(r, { id: 'u', display_name: 'Аня', phone_masked: 'x', city_id: 'msk', roles: ['buyer'], seller_rating: 5, deals_count: 0 }));
  await page.goto('/admin');
  await expect(page.getByText('Доступ к админке только для модераторов')).toBeVisible();
});

test('2FA prompt → verify → overview', async ({ page }) => {
  let verified = false;
  await page.route('**/api/admin/whoami', (r) => (verified ? ok(r, { admin: true, user: {} }) : err(r, 'forbidden', 403)));
  await page.route('**/api/me', (r) => ok(r, { id: 'u', display_name: 'Мод', phone_masked: 'x', city_id: 'msk', roles: ['moderator'], seller_rating: 0, deals_count: 0 }));
  await page.route('**/api/admin/2fa/verify', (r) => {
    verified = true;
    return ok(r, { verified_2fa: true });
  });
  await page.route('**/api/admin/overview', (r) => ok(r, overview));
  await page.goto('/admin');
  await expect(page.getByText('Введите код из приложения')).toBeVisible();
  await page.getByLabel('Код 2FA').fill('123456');
  await page.getByRole('button', { name: 'Войти' }).click();
  await expect(page.getByRole('heading', { name: 'Обзор' })).toBeVisible();
});

test('moderation: approve removes item → queue empty', async ({ page }) => {
  await page.route('**/api/admin/whoami', (r) => ok(r, { admin: true, user: {} }));
  let resolved = false;
  await page.route('**/api/admin/moderation/queue**', (r) => ok(r, { items: resolved ? [] : [{ id: 'lst12345', type: 'listing', created_at: '2026-06-04T12:00:00Z', size: 'M', freshness: 'today', price_kopecks: 99000, city_id: 'msk' }] }));
  await page.route(/\/api\/admin\/moderation\/lst12345$/, (r) => {
    resolved = true;
    return ok(r, { status: 'approved' });
  });
  await page.goto('/admin/moderation');
  await expect(page.getByText(/Размер M/)).toBeVisible();
  await page.getByRole('button', { name: 'Одобрить' }).click();
  await expect(page.getByText('Очередь пуста')).toBeVisible();
});
