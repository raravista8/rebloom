import { test, expect, type Route } from '@playwright/test';

function json(route: Route, data: unknown, ok = true, status = 200) {
  return route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(ok ? { ok: true, data } : { ok: false, error: data }) });
}
const me = { id: 'u1', display_name: 'Аня Петрова', phone_masked: '+7 999 •••', city_id: 'msk', roles: ['seller'], seller_rating: 4.9, deals_count: 23 };

test('notifications: list', async ({ page }) => {
  await page.route('**/api/notifications', (r) =>
    json(r, { items: [{ id: 'n1', kind: 'deal_status', title: 'Букет оплачен', body: 'Деньги в безопасной сделке', read: false, created_at: '2026-06-04T15:00:00Z' }], next_cursor: null }),
  );
  await page.goto('/notifications');
  await expect(page.getByText('Букет оплачен')).toBeVisible();
  await expect(page.locator('.pd-bottomnav')).toBeVisible();
});

test('notifications: empty', async ({ page }) => {
  await page.route('**/api/notifications', (r) => json(r, { items: [], next_cursor: null }));
  await page.goto('/notifications');
  await expect(page.getByText('Пока тихо')).toBeVisible();
});

test('me: account rows + logout present', async ({ page }) => {
  await page.route('**/api/me', (r) => json(r, me));
  await page.goto('/me');
  await expect(page.getByText('Аня Петрова')).toBeVisible();
  await expect(page.getByText('Профиль продавца')).toBeVisible();
  await expect(page.getByText('Выйти')).toBeVisible();
});

test('me: anonymous → войти prompt', async ({ page }) => {
  await page.route('**/api/me', (r) => json(r, 'unauthorized', false, 401));
  await page.goto('/me');
  await expect(page.getByText('Войдите, чтобы видеть свой профиль')).toBeVisible();
});

test('delete account: confirm required → done', async ({ page }) => {
  await page.route('**/api/me/delete', (r) => json(r, { scheduled_at: '2026-07-04T00:00:00Z' }));
  await page.goto('/settings/delete');
  await page.getByRole('button', { name: 'Удалить аккаунт' }).click();
  await expect(page.getByText('Подтвердите согласие')).toBeVisible();
  await page.getByText('Понимаю последствия').click();
  await page.getByRole('button', { name: 'Удалить аккаунт' }).click();
  await expect(page.getByText('Аккаунт отключён')).toBeVisible();
});
