import { test, expect } from '@playwright/test';

// OAuth-first login (AUTH_HANDOFF). /login opens at the canon chooser (ID buttons +
// phone); the phone branch leads to the canon-styled controlled phone/OTP step.

test('login opens at the chooser with ID buttons + phone', async ({ page }) => {
  await page.goto('/login');
  await expect(page.locator('.pa')).toBeVisible();
  await expect(page.locator('[data-provider="ya"]')).toBeVisible();
  await expect(page.locator('[data-provider="sber"]')).toBeVisible();
  await expect(page.locator('[data-provider="vk"]')).toBeVisible();
  await expect(page.locator('[data-provider="tid"]')).toBeVisible();
  await expect(page.locator('[data-provider="phone"]')).toBeVisible();
});

test('phone branch: chooser → phone step renders, CTA enabled', async ({ page }) => {
  await page.goto('/login');
  await page.locator('[data-provider="phone"]').click();
  await expect(page.getByRole('heading', { name: 'Вход по телефону' })).toBeVisible();
  await expect(page.locator('.pd-input .pre')).toHaveText('+7');
  await expect(page.getByRole('button', { name: 'Получить код' })).toBeEnabled();
});

test('typing a phone keeps the CTA enabled and formats the number', async ({ page }) => {
  await page.goto('/login');
  await page.locator('[data-provider="phone"]').click();
  const input = page.getByLabel('Номер телефона');
  await input.fill('9991245803');
  await expect(input).toHaveValue('999 124-58-03');
  await expect(page.getByRole('button', { name: 'Получить код' })).toBeEnabled();
});
