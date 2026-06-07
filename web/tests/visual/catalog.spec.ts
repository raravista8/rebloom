import { test, expect, type Route } from '@playwright/test';

// Каталог (/catalog) — PUBLIC, browse-first city catalog. canon 0.9.2: the IMPORTED
// PdCatalog (presentational + `renderCard` slot) renders the `.pdc-*` shell; web injects
// its own <BouquetCard/> via `renderCard` (real photo + wired LikeButton). Grid shown
// immediately from /api/feed; /api/search when a backend filter is set. Collection states
// + cursor load-more (INTERACTION_STATES §4). Runs in mobile-375 (functional project).

const PHOTO =
  'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%221%22%20height%3D%221%22/%3E';

function card(id: string, price_kopecks: number) {
  return {
    id,
    photo_thumb_url: PHOTO,
    size: 'M',
    freshness: 'today',
    price_kopecks,
    city_id: 'msk',
    metro: { id: 'msk-kurskaya', name: 'Курская', lines: [{ name: 'Кольцевая', color: '#894E35' }] },
    flower_types: ['roses'],
    like_count: 3,
    liked: false,
    seller: { id: 's1', display_name: 'Аня', seller_rating: 4.8 },
  };
}

function feedBody(items: unknown[], next_cursor: string | null = null) {
  return JSON.stringify({ ok: true, data: { items, next_cursor, applied: { city_id: 'msk' } } });
}

// Metro catalog arrives via GET /api/geo/metro (lib/metro.ts) — mock it so the
// picker/filters stay hermetic if a test opens «Все фильтры».
test.beforeEach(async ({ page }) => {
  await page.route('**/api/geo/metro**', (r: Route) =>
    r.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        ok: true,
        data: { stations: [{ id: 'msk-kurskaya', name: 'Курская', lines: [{ name: 'Кольцевая', color: '#894E35' }] }] },
      }),
    }),
  );
});

test('browse-first: catalog grid renders immediately from /api/feed (web BouquetCard)', async ({ page }) => {
  await page.route('**/api/feed**', (r: Route) =>
    r.fulfill({ status: 200, contentType: 'application/json', body: feedBody([card('f1', 99000), card('f2', 130000)]) }),
  );
  await page.goto('/catalog');
  // PdCatalog shell renders web's own cards (real photo + wired like) inside the grid.
  await expect(page.locator('.pdc .pdc-grid .pd-card')).toHaveCount(2);
  await expect(page.getByText('990 ₽')).toBeVisible();
  // metro is the location cue on the card
  await expect(page.getByText('Курская').first()).toBeVisible();
  // filter UI present (mobile chip bar with «Фильтры»)
  await expect(page.getByRole('button', { name: /Фильтры/ })).toBeVisible();
});

test('empty: no listings in city → empty state (not no-results)', async ({ page }) => {
  await page.route('**/api/feed**', (r: Route) =>
    r.fulfill({ status: 200, contentType: 'application/json', body: feedBody([]) }),
  );
  await page.goto('/catalog');
  await expect(page.getByText('Пока нет букетов')).toBeVisible();
});

test('load-more: cursor fetches the next page', async ({ page }) => {
  let call = 0;
  await page.route('**/api/feed**', (r: Route) => {
    call += 1;
    const body = call === 1 ? feedBody([card('f1', 99000)], 'c2') : feedBody([card('f2', 120000)], null);
    return r.fulfill({ status: 200, contentType: 'application/json', body });
  });
  await page.goto('/catalog');
  await expect(page.locator('.pdc .pdc-grid .pd-card')).toHaveCount(1);
  await page.getByRole('button', { name: 'Показать ещё' }).click();
  await expect(page.locator('.pdc .pdc-grid .pd-card')).toHaveCount(2);
  // end-of-list marker (canon `.pdc-end`) once the cursor runs out
  await expect(page.getByText(/Показали все букеты/)).toBeVisible();
});

test('no-results: a filter with 0 hits is distinct from empty', async ({ page }) => {
  await page.route('**/api/feed**', (r: Route) =>
    r.fulfill({ status: 200, contentType: 'application/json', body: feedBody([card('f1', 99000)]) }),
  );
  // selecting a flower chip switches to /api/search → 0 items → no-results
  await page.route('**/api/search**', (r: Route) =>
    r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, data: { items: [], next_cursor: null, total: 0, applied: { city_id: 'msk', filters: { flowers: ['peonies'] } } } }) }),
  );
  await page.goto('/catalog');
  await expect(page.locator('.pdc .pdc-grid .pd-card')).toHaveCount(1);
  // canon's mobile chip bar exposes the first 3 flower types as quick chips → «Пионы»
  await page.getByRole('button', { name: 'Пионы', exact: true }).click();
  await expect(page.getByText('Ничего не нашлось')).toBeVisible();
});

test('public: /catalog is reachable without auth (no login redirect)', async ({ page }) => {
  await page.route('**/api/feed**', (r: Route) =>
    r.fulfill({ status: 200, contentType: 'application/json', body: feedBody([card('f1', 99000)]) }),
  );
  await page.goto('/catalog');
  await expect(page).toHaveURL(/\/catalog$/);
  await expect(page.locator('.pdc')).toBeVisible();
});
