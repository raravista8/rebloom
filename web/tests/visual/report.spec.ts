import { test, expect, type Route } from '@playwright/test';

function json(route: Route, data: unknown) {
  return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, data }) });
}

test('report listing: reason required → submit → спасибо', async ({ page }) => {
  await page.route('**/api/reports', (r) => json(r, { report_id: 'rep1' }));
  await page.goto('/l/l1/report');
  await page.getByRole('button', { name: 'Отправить жалобу' }).click();
  await expect(page.getByText('Выберите причину')).toBeVisible();
  await page.getByText('Чужие фотографии').click();
  await page.getByRole('button', { name: 'Отправить жалобу' }).click();
  await expect(page.getByText('Спасибо, мы проверим')).toBeVisible();
});

test('report user: distinct reasons', async ({ page }) => {
  await page.goto('/u/u1/report');
  await expect(page.getByText('Мошенничество')).toBeVisible();
  await expect(page.getByText('Грубость или оскорбления')).toBeVisible();
});
