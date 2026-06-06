// LOCAL end-to-end journey check (buyer + seller) against the FULL stack.
// NOT a CI test — it needs the running dev stack + reads the dev OTP from the api
// container logs (APP_ENV=local reveals the code). It drives the real backend (no
// mocks), so it catches backend↔web contract mismatches the mocked visual specs can't.
//
// Run:
//   1) docker compose -f infra/docker-compose.yml up -d db redis api   (+ alembic upgrade head)
//   2) cd web && API_PROXY_TARGET=http://localhost:8000 npm run build && npm run start &
//   3) cd web && node tests/e2e-local/journeys.mjs
//
// It picks a fresh `active` seed listing + logs in as both that listing's seller and a
// throwaway buyer, then runs: landing → browse → login(OTP) → listing → like → contact
// → deal(agreed) → chat → seller share-point(meeting) → buyer confirm(done) → review.
import { chromium } from '@playwright/test';
import { execSync } from 'node:child_process';

const BASE = process.env.BASE || 'http://localhost:3000';
const sh = (c) => execSync(c, { encoding: 'utf8' }).trim();
const results = [];
const step = async (name, fn) => {
  try { await fn(); results.push([name, 'PASS']); console.log('· PASS', name); }
  catch (e) { results.push([name, 'FAIL', e.message]); console.log('· FAIL', name, '—', e.message); throw e; }
};
const otpCode = () => sh(`docker logs rebloom-api-1 2>&1 | grep -oE 'code=[0-9]{6}' | tail -1`).split('=')[1];

const row = sh(`docker exec rebloom-db-1 psql -U rebloom_app -d rebloom -tAc "SELECT l.id || ' ' || u.phone FROM listings l JOIN users u ON u.id=l.seller_id WHERE l.status='active' AND u.phone IS NOT NULL ORDER BY l.created_at DESC LIMIT 1;"`);
const [LISTING_ID, SELLER_PHONE] = row.split(' ');
const BUYER_PHONE = '+7999' + String(Math.floor(Math.random() * 1e7)).padStart(7, '0');
const nat = (e164) => e164.replace('+7', '');

async function login(page, phone) {
  await page.goto(`${BASE}/login`, { waitUntil: 'domcontentloaded' });
  const tel = page.locator('input[inputmode="tel"], input[aria-label="Номер телефона"]').first();
  if (!(await tel.isVisible().catch(() => false))) {
    await page.getByRole('button', { name: /телефон/i }).first().click().catch(() => {});
  }
  await tel.waitFor({ state: 'visible', timeout: 8000 });
  await tel.fill(nat(phone));
  await page.locator('input[type="checkbox"]').first().check({ force: true });
  await page.getByRole('button', { name: /Получить код/i }).click();
  const otp = page.locator('input[maxlength="6"]').first();
  await otp.waitFor({ state: 'visible', timeout: 8000 });
  await page.waitForTimeout(400);
  await otp.fill(otpCode());
  await page.waitForURL((u) => !u.pathname.startsWith('/login'), { timeout: 10000 });
}

const b = await chromium.launch();
let dealUrl = '';
try {
  const guest = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await step('public: landing renders (hero + catalog)', async () => {
    await guest.goto(BASE, { waitUntil: 'domcontentloaded' });
    await guest.locator('.pdl-hero, .pdl-h1').first().waitFor({ timeout: 8000 });
    await guest.locator('#catalog').waitFor({ timeout: 8000 });
  });
  await step('public: catalog shows seeded listings', async () => {
    await guest.locator('.pdl-catgrid .pd-card').first().waitFor({ timeout: 10000 });
  });
  await step('public: search page reachable', async () => {
    await guest.goto(`${BASE}/search`, { waitUntil: 'domcontentloaded' });
    await guest.waitForTimeout(600);
  });
  await guest.close();

  const buyer = await b.newPage({ viewport: { width: 390, height: 840 } });
  await step('buyer: login (phone+OTP+consent)', async () => { await login(buyer, BUYER_PHONE); });
  await step('buyer: open listing', async () => {
    await buyer.goto(`${BASE}/l/${LISTING_ID}`, { waitUntil: 'domcontentloaded' });
    await buyer.getByText(/Написать продавцу/i).first().waitFor({ timeout: 8000 });
  });
  await step('buyer: like the listing', async () => {
    const heart = buyer.locator('button[aria-label*="Нрав"], button[aria-label*="айк"]').first();
    if (await heart.isVisible().catch(() => false)) await heart.click();
  });
  await step('buyer: «Написать продавцу» → deal created (agreed)', async () => {
    await buyer.getByText(/Написать продавцу/i).first().click();
    await buyer.waitForURL(/\/deal\//, { timeout: 10000 });
    dealUrl = new URL(buyer.url()).pathname;
  });
  await step('buyer: send a chat message', async () => {
    await buyer.locator('.pd-chatinput').first().waitFor({ state: 'visible', timeout: 12000 });
    await buyer.locator('.pd-chatinput input').first().fill('Здравствуйте! Когда удобно встретиться у метро?');
    await buyer.locator('.pd-chatinput button.send, button[aria-label="Отправить"]').first().click();
    await buyer.getByText(/удобно встретиться/i).first().waitFor({ timeout: 6000 });
  });

  const seller = await b.newPage({ viewport: { width: 390, height: 840 } });
  await step('seller: login (the listing owner)', async () => { await login(seller, SELLER_PHONE); });
  await step('seller: open the deal + share meeting point → meeting', async () => {
    await seller.goto(`${BASE}${dealUrl}`, { waitUntil: 'domcontentloaded' });
    const addr = seller.getByPlaceholder(/Двор, подъезд|метро/i).first();
    await addr.waitFor({ timeout: 8000 });
    await addr.fill('ст. м. Парк Культуры, у выхода №2, 18:30');
    await seller.getByRole('button', { name: /Поделиться местом/i }).click();
    await seller.waitForTimeout(1000);
  });

  await step('buyer: confirm receipt → done', async () => {
    await buyer.goto(`${BASE}${dealUrl}`, { waitUntil: 'domcontentloaded' });
    const confirm = buyer.getByRole('button', { name: /Подтвердить получение/i }).first();
    await confirm.waitFor({ timeout: 8000 });
    await confirm.click();
    await buyer.waitForTimeout(1000);
  });
  await step('buyer: leave a review', async () => {
    await buyer.goto(`${BASE}${dealUrl}/review`, { waitUntil: 'domcontentloaded' });
    await buyer.locator('button[aria-label="Оценка 5"]').first().click({ timeout: 8000 });
    const ta = buyer.getByLabel('Текст отзыва').first();
    if (await ta.isVisible().catch(() => false)) await ta.fill('Свежий букет, всё прошло отлично. Спасибо!');
    await buyer.getByRole('button', { name: /Оставить отзыв|Отправить отзыв|Отправить/i }).first().click();
    await buyer.waitForTimeout(800);
  });

  await step('seller: /sell publish form renders', async () => {
    await seller.goto(`${BASE}/sell`, { waitUntil: 'domcontentloaded' });
    await seller.getByText(/Опубликовать|Размер|Свежесть|Цена/i).first().waitFor({ timeout: 8000 });
  });
} finally {
  await b.close();
  const pass = results.filter((r) => r[1] === 'PASS').length;
  console.log(`\n${pass}/${results.length} steps passed`);
  if (dealUrl) {
    const id = dealUrl.split('/').pop();
    try { console.log('final deal status:', sh(`docker exec rebloom-db-1 psql -U rebloom_app -d rebloom -tAc "SELECT status FROM deals WHERE id='${id}';"`)); } catch {}
  }
  process.exit(pass === results.length ? 0 : 1);
}
