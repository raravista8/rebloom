import { test, expect, type Locator, type Page, type Route } from '@playwright/test';

// Desktop layout coverage (runs in the desktop-1280 project). The functional suite
// is 360-only, so desktop regressions shipped unseen: a clamped auth split, clipped
// headings, the whole mobile tree rendering on desktop. These are DETERMINISTIC
// geometry assertions (no pixel baselines → no OS-font flakiness): nothing is clipped
// horizontally, the desktop tree actually mounts, and nothing overflows the viewport.

const PHOTO =
  'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22300%22%20height%3D%22300%22%3E%3Crect%20width%3D%22300%22%20height%3D%22300%22%20fill%3D%22%23e7d6c4%22/%3E%3C/svg%3E';
const ok = (r: Route, data: unknown) =>
  r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, data }) });

/** Every matched element must not be clipping its own text (overflow hidden). */
async function expectNoClip(loc: Locator): Promise<void> {
  const n = await loc.count();
  for (let i = 0; i < n; i++) {
    const el = loc.nth(i);
    const [scrollW, clientW, text] = await el.evaluate((e) => [e.scrollWidth, e.clientWidth, (e.textContent || '').trim()]);
    expect(scrollW, `clipped horizontally: "${text}"`).toBeLessThanOrEqual(clientW + 1);
  }
}

/** The page must not overflow the viewport horizontally. */
async function expectNoHorizontalOverflow(page: Page): Promise<void> {
  const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(over, 'horizontal overflow (px)').toBeLessThanOrEqual(2);
}

test('login: full-width canon split, brand + headline not clipped', async ({ page }) => {
  await page.goto('/login');
  const pad = page.locator('.pad'); // canon desktop auth split mounts after useIsDesktop
  await expect(pad).toBeVisible();
  expect((await pad.boundingBox())!.width).toBeGreaterThan(1000); // not clamped to 460px
  await expectNoClip(page.locator('.pad-brand'));
  await expectNoClip(page.locator('.pad-hl'));
  await expect(page.locator('[data-provider="ya"]')).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

test('home: desktop landing chrome (not the mobile tree)', async ({ page }) => {
  await page.route('**/api/feed**', (r) => ok(r, { items: [], next_cursor: null }));
  await page.goto('/');
  await expect(page.locator('.pdl')).toBeVisible();
  await expect(page.locator('.pdl-nav')).toBeVisible(); // desktop nav, not the mobile TopBar/BottomNav
  await expect(page.locator('.pd-bottomnav')).toHaveCount(0);
  await expectNoHorizontalOverflow(page);
});

test('listing: two-column detail, price/title not clipped', async ({ page }) => {
  await page.route('**/api/listings/l1', (r) =>
    ok(r, {
      id: 'l1',
      photos: [{ card_url: PHOTO, full_url: PHOTO }],
      size: 'M', freshness: 'today', price_kopecks: 190000, city_id: 'msk', status: 'active',
      like_count: 8, liked: false, seller: { id: 's1', display_name: 'Аня', seller_rating: 4.9, deals_count: 12 },
    }),
  );
  await page.goto('/l/l1');
  await expect(page.locator('.pdw-2col')).toBeVisible(); // canon desktop two-column
  await expectNoClip(page.locator('.pdw-buy .price'));
  await expectNoHorizontalOverflow(page);
});

// Regression: WebChrome must reflect auth state. A guest (no session → /api/me 401)
// must NOT see the logged-in toolbar (notifications/deals/profile-avatar) — it showed
// the авторизованный chrome unconditionally before, so a guest looked "logged in".
test('listing as guest: WebChrome shows «Войти», not the logged-in toolbar', async ({ page }) => {
  await page.route('**/api/me', (r) =>
    r.fulfill({ status: 401, contentType: 'application/json', body: JSON.stringify({ ok: false, error: 'unauthorized' }) }),
  );
  await page.route('**/api/listings/l1', (r) =>
    ok(r, {
      id: 'l1', photos: [{ card_url: PHOTO, full_url: PHOTO }],
      size: 'M', freshness: 'today', price_kopecks: 190000, city_id: 'msk', status: 'active',
      like_count: 8, liked: false, seller: { id: 's1', display_name: 'Аня', seller_rating: 4.9, deals_count: 12 },
    }),
  );
  await page.goto('/l/l1');
  const nav = page.locator('.pdw-nav');
  await expect(nav.getByRole('link', { name: 'Войти' })).toBeVisible();
  await expect(nav.locator('.pdw-avatar')).toHaveCount(0); // no profile avatar for a guest
  await expect(nav.locator('a[href="/notifications"]')).toHaveCount(0); // no bell/deals
  await expect(nav.locator('.pdw-cta')).toHaveCount(1); // «Продать букет» stays (bounces to /login)
});

test('deal: desktop chrome renders, no overflow', async ({ page }) => {
  await page.route('**/api/deals/d1', (r) =>
    ok(r, { deal: { id: 'd1', status: 'meeting', listing: { id: 'l1', photo_thumb_url: PHOTO, price_kopecks: 99000 }, role: 'buyer', counterparty: { id: 's1', display_name: 'Аня', seller_rating: 4.9 }, delivery_method: 'self_pickup', created_at: '2026-06-04T15:00:00Z' } }),
  );
  await page.route('**/api/deals/d1/messages', (r) => ok(r, { messages: [], next_cursor: null }));
  await page.route('**/api/deals/d1/delivery', (r) => ok(r, { revealed: false, address: null }));
  await page.goto('/deal/d1');
  await expect(page.locator('.pd-web')).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

test('profile: desktop chrome renders, no overflow', async ({ page }) => {
  await page.route('**/api/users/u1', (r) =>
    ok(r, { user: { id: 'u1', display_name: 'Аня Петрова', seller_rating: 4.9, deals_count: 23, city_id: 'msk' }, reviews: [], active_listings: [] }),
  );
  await page.goto('/u/u1');
  await expect(page.locator('.pd-web')).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

// SEO marketing pages (canon ./marketing, 0.4.0). Stub the Unsplash-proxied teaser
// images so the guard is hermetic; layout is CSS-driven (aspect-ratio boxes) so it
// holds regardless. Catches desktop overflow / clipped headings on the geo lander —
// the highest-value organic surface.
test('geo city page: desktop landing, H1 not clipped, no overflow', async ({ page }) => {
  await page.route('**/img/**', (r) =>
    r.fulfill({ status: 200, contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"/>' }),
  );
  await page.goto('/moskva');
  await expect(page.locator('.pds--desk')).toBeVisible(); // desktop variant mounts (useIsDesktop)
  await expect(page.locator('h1.pds-h1')).toContainText('Москве');
  await expectNoClip(page.locator('h1.pds-h1'));
  await expectNoHorizontalOverflow(page);
});

test('safe-deal page: desktop renders, no overflow', async ({ page }) => {
  await page.goto('/bezopasnaya-sdelka');
  await expect(page.locator('.pds--desk')).toBeVisible();
  await expect(page.locator('h1.pds-h1')).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

// Footer regression: every footer link must resolve to a real route — no dead
// `href="#"` (canon's PdLandingFooter ships them; we replace it with SiteFooter).
test('home footer: real links only, no dead href="#"', async ({ page }) => {
  await page.route('**/api/feed**', (r) => ok(r, { items: [], next_cursor: null }));
  await page.goto('/');
  const foot = page.locator('.pdl-foot');
  await expect(foot).toBeVisible();
  expect(await foot.locator('a[href="#"]').count()).toBe(0);
  await expect(foot.locator('a[href="/sell"]')).toHaveCount(1);
  await expect(foot.locator('a[href="/bezopasnaya-sdelka"]')).toHaveCount(1);
  await expect(foot.locator('a[href="/legal/privacy"]')).toHaveCount(1);
});

test('SEO page footer: canon dead footer hidden, real footer shown', async ({ page }) => {
  await page.route('**/img/**', (r) =>
    r.fulfill({ status: 200, contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"/>' }),
  );
  await page.goto('/moskva');
  // No VISIBLE dead links (the baked canon footer is display:none; SiteFooter is real).
  expect(await page.locator('.pdl-foot a[href="#"]:visible').count()).toBe(0);
  await expect(page.locator('.pdl-foot a[href="/spb"]:visible')).toBeVisible();
});
