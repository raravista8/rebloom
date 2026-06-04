import { test, expect } from '@playwright/test';

// Login renders the canon-styled phone step (composed from canon primitives +
// controlled inputs). No backend needed for the initial render.
test('login phone step renders', async ({ page }) => {
  await page.goto('/login');
  await expect(page.locator('.pd-root.pa')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Вход по телефону' })).toBeVisible();
  // canon-classed phone input with the +7 prefix
  await expect(page.locator('.pd-input .pre')).toHaveText('+7');
  // primary CTA is enabled by default (INTERACTION_STATES §1)
  await expect(page.getByRole('button', { name: 'Получить код' })).toBeEnabled();
});

test('typing a phone keeps the CTA enabled and formats the number', async ({ page }) => {
  await page.goto('/login');
  const input = page.getByLabel('Номер телефона');
  await input.fill('9991245803');
  await expect(input).toHaveValue('999 124-58-03');
  await expect(page.getByRole('button', { name: 'Получить код' })).toBeEnabled();
});
