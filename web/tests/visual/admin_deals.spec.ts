import { test, expect, type Route } from '@playwright/test';

test.use({ viewport: { width: 1280, height: 900 } });

function ok(route: Route, data: unknown) {
  return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, data }) });
}
function deal(id: string, status: string) {
  return { id, status, role: 'seller', listing: { id: 'L' }, counterparty: { id: 'b1' }, amount_kopecks: 99000, commission_kopecks: 9900, delivery_method: 'self_pickup', created_at: '2026-06-04T12:00:00Z' };
}

test('admin deals: table + dispute resolution', async ({ page }) => {
  await page.route('**/api/admin/whoami', (r) => ok(r, { admin: true, user: {} }));
  let resolved = false;
  await page.route('**/api/admin/deals?**', (r) => ok(r, { items: [deal('dlong1234', resolved ? 'released' : 'disputed'), deal('dlong5678', 'paid_held')] }));
  await page.route('**/api/admin/deals', (r) => ok(r, { items: [deal('dlong1234', resolved ? 'released' : 'disputed'), deal('dlong5678', 'paid_held')] }));
  await page.route(/\/api\/admin\/deals\/dlong1234\/resolve$/, (r) => {
    resolved = true;
    return ok(r, { deal: deal('dlong1234', 'released') });
  });

  await page.goto('/admin/deals');
  await expect(page.getByRole('heading', { name: 'Сделки' })).toBeVisible();
  await expect(page.getByText('990 ₽').first()).toBeVisible();
  // resolve the disputed deal
  await page.getByRole('button', { name: 'Разрешить' }).click();
  await page.getByPlaceholder('причина').fill('возврат покупателю — несвежий');
  await page.locator('select').selectOption('refund');
  await page.getByRole('button', { name: 'OK' }).click();
  await expect(page.getByText('завершена').first()).toBeVisible();
});
