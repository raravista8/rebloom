# CLAUDE_CODE_HANDOFF — canon 0.2.0 → `web/`

What Claude Design shipped in **0.2.0** and **the exact logic Claude Code must write** in `web/`
to make it production-ready. The canon package is the **single source of truth** for markup, classes
and visual states — never re-implement components by hand (`CANON_PACKAGE_TZ §1, §10`). This file tells
you the *behaviour* to wire around them: a **fast catalog**, **working filters**, and **live form
hover/focus/validation states**.

---

## 0. What's new in 0.2.0 (vendor these first)

| Area | New / changed | Source |
|------|---------------|--------|
| Marketing landing | `PdLanding`, `PdLandingNav` (`@rebloom/canon/marketing`) — hero, live catalog teaser, how-it-works, reviews, escrow, objections, app, split CTA, footer | `src/marketing/landing.jsx` |
| Catalog | `PdCatalog` (`@rebloom/canon/catalog`) — sidebar/sheet filters + sort + pagination | `src/catalog/catalog.jsx` |
| **Responsive** | landing + catalog now switch layout via **container queries** (`@container`), not a hard-coded class — see §4 | `canon.css` |
| Forms | real `:focus-within` + `:hover` states baked into `canon.css` (inputs, checkbox, size, seg, switch, oauth) | `canon.css` |
| Brand | login/desktop screens now use the «Соцветие» mark (was a gift glyph); header/catalog mark pinned **terracotta**, footer stays white (inverse) | `auth.jsx`, `canon.css` |
| Heart icon | replaced the lopsided like/favourite heart with a clean symmetric path everywhere | `feed.jsx`, `kit.jsx`, `auth.jsx`, `landing.jsx` |
| Favicon | full set generated from the mark → `dist/favicon/` (svg, ico, 16/32/180/192/512, webmanifest) | `dist/favicon/` |

Import map:
```tsx
import { PdLanding } from '@rebloom/canon/marketing';
import { PdCatalog } from '@rebloom/canon/catalog';
import '@rebloom/canon/canon.css';
```
Both new entries are registered in `package.json` exports and `tsup.config.ts` — `npm run build` emits
`dist/marketing.*` and `dist/catalog.*`.

---

## 1. Mental model — what the canon gives you vs. what you write

The prototype components are **presentational** and **prop-driven for storybook**:
- A `platform` / `plat` prop picks chrome.
- A `state` prop (`'rest' | 'invalid' | 'verifying' | 'locked' | 'submitting' | 'focus'`) **forces** a
  visual state so every state is drawable on one canvas.

In `web/` you must **stop forcing `state`** and instead drive it from real interaction:
- focus ring → comes for free from CSS `:focus-within` (don't pass `state="focus"`);
- `state="invalid"` → pass it only when *your* validation says the field is invalid;
- `loading`/`disabled` on `PdBtn` → from your submit/mutation status.

So: **canon = look + every state; you = the state machine that decides which state is live.**

---

## 2. Catalog — make it load fast

`PdCatalog` today filters a baked-in array on the client and paginates with a `shown` counter. That is the
**design reference**. In prod, move the work to the server and treat the **URL as the source of truth**.

### 2.1 URL = state
Encode every filter + sort + page in `searchParams` so the page is shareable, SSR-able and back-button-safe:
```
/catalog/msk?price=1k2k&fresh=today&rating=48&size=M&sort=fresh&cursor=<id>
```
Param vocabulary (must match the canon chip values exactly):
| group | param | values | default (omit) |
|-------|-------|--------|----------------|
| price | `price` | `lt1k` `1k2k` `gt2k` | any |
| freshness | `fresh` | `today` `d1_2` | any |
| seller rating | `rating` | `45` `48` `5` | any |
| size | `size` | `S` `M` `L` `XL` | any |
| sort | `sort` | `fresh` `cheap` `exp` `rating` | `fresh` |

Single-select per group (clicking the active chip clears it → omit the param). This mirrors the prototype's
`toggle(k,v)`.

### 2.2 Server-side filtering + keyset pagination (the speed win)
Never ship the full table to the client. Translate params → one indexed query. Mapping (from the prototype
predicates in `catalog.jsx`):
```sql
-- price
lt1k → price < 1000
1k2k → price BETWEEN 1000 AND 2000
gt2k → price > 2000
-- freshness (bucket by listing age; "today" = bought today)
today → freshness_bucket = 'today'
d1_2  → freshness_bucket = 'd1_2'
-- rating
45 → seller_rating >= 4.5 ; 48 → >= 4.8 ; 5 → >= 5.0
-- size
S|M|L|XL → size = $1
-- sort
fresh → ORDER BY freshness_rank ASC, likes DESC      (freshness_rank: today=0,d1_2=1,d3_plus=2)
cheap → ORDER BY price ASC
exp   → ORDER BY price DESC
rating→ ORDER BY seller_rating DESC
```
Paginate with a **keyset/cursor** (`WHERE (sort_key, id) > (:cursor)` `LIMIT 24`), not `OFFSET` — O(1) deep
pages and stable under inserts. Index: `(freshness_rank, likes, id)`, `(price, id)`, `(seller_rating, id)`,
plus partial indexes per `city`. Return `{ items, nextCursor, total }`.

### 2.3 Render path (Next.js App Router assumed)
- **RSC + streaming.** The catalog list is a Server Component that reads `searchParams`, runs the query, and
  streams. First paint is server-rendered HTML — no client round-trip for the first screen.
- **Suspense + skeleton.** Wrap the grid in `<Suspense fallback={<CatalogSkeleton/>}>`; render `PdSkelCard`
  (already in canon) × page size. Key the Suspense boundary on the serialized filter string so changing a
  filter shows skeletons instead of a frozen list.
- **Cache.** The unfiltered first page per city is highly cacheable: `revalidate` (ISR) ~60s or edge-cache
  with `s-maxage=60, stale-while-revalidate=300`. Filtered queries: cache per normalized querystring with a
  short TTL.
- **Filter changes** = client transition: `router.replace(nextUrl, { scroll:false })` inside
  `useTransition()`; show `isPending` by dimming the grid (`opacity:.6; pointer-events:none`) — don't unmount.
  Debounce rapid chip toggles ~150ms and **abort** the stale request (`AbortController`).

### 2.4 Pagination UI
The canon renders **«Показать ещё»** (`.pdc-loadmore button`) when `shown < total`. Wire it two ways:
- click → fetch next cursor, append, update URL `cursor`;
- **prefetch on view** — an `IntersectionObserver` on the button fires the next-page fetch ~400px early so
  scrolling feels infinite. Keep the button as the no-JS / a11y fallback.
Restore scroll on back-nav (Next does this if you don't remount).

### 2.5 Images (the other half of "fast")
The grid is image-heavy — this is where LCP/CLS live:
- serve from an image CDN with `srcset`/`sizes` (or `next/image`); the cards are ~216–248px wide on desktop,
  half-viewport on mobile;
- **reserve space** — cards already use `aspect-ratio` (no layout shift); keep it;
- `loading="lazy"` + `decoding="async"` below the fold; eager-load only the first row;
- tiny blur/LQIP placeholder over `--pd-surface-2`;
- AVIF/WebP with JPEG fallback.

### 2.6 Count & active-filter badge
`.pdc-count` ("{N} букетов · фильтров: {k}") must read **`total` from the query meta**, not
`items.length` (which is only the loaded page). `k` = number of non-default params.

### 2.7 Empty state
When `total === 0` render `.pdc-empty` (canon markup) with the reset CTA → clears all params. Copy is baked:
«Ничего не нашлось. Попробуйте смягчить фильтры, например расширить цену или свежесть.»

---

## 3. Filters — exact behaviour

```ts
// URL-derived, no local mirror of filter state
const sp = useSearchParams();
const sel = {
  price:  sp.get('price')  ?? 'any',
  fresh:  sp.get('fresh')  ?? 'any',
  rating: sp.get('rating') ?? 'any',
  size:   sp.get('size')   ?? 'any',
};
const sort = sp.get('sort') ?? 'fresh';

function toggle(group: string, value: string) {
  const next = new URLSearchParams(sp);
  if (sel[group] === value) next.delete(group);   // clicking active chip clears it
  else next.set(group, value);
  next.delete('cursor');                           // any filter change resets pagination
  startTransition(() => router.replace(`?${next}`, { scroll: false }));
}
function reset() { startTransition(() => router.replace('?', { scroll:false })); }
```
- Active chip = add `.on` to `.pdc-fchip` / `.pdc-mchip` / `.pdc-sortbtn`. The canon CSS already styles `.on`,
  `:hover`, and focus — you only toggle the class.
- **Mobile bar** (`.pdc-mbar`) shows a subset (price chips + Сегодня + ★4,8+) plus a «Фильтры» entry that
  opens the **full filter sheet** (build the sheet from the same chip set; reuse `.pdc-fblock`).
- Reflect `sel`/`sort` back into the controls on every render so deep links and back/forward stay in sync.
- The landing's catalog teaser (`PdLanding` → `Catalog`) filters client-side over a small sample on purpose —
  leave it; its «Весь каталог букетов →» link points to `/catalog/<city>` where the real engine lives.

---

## 4. Responsive — container queries (read this, it bit prod before)

Landing + catalog **no longer rely on a `.pdl--desk` / `.pdc--desk` class**. Layout switches on the
component's **own width** via `@container` at **900px** (catalog grid bumps to 4-col at 1180px). One markup is
mobile on phones and desktop on wide screens — which is what fixes "prod always rendered mobile".

Requirements in `web/`:
- The element that carries `.pdl` / `.pdc` is a **container** (`container-type: inline-size`, set in
  canon.css). Its parent must give it a real width — **don't** wrap it in an `inline-block`/`width:max-content`
  shell, or the query reads the wrong size.
- Render **one** `<PdLanding />` (or `<PdCatalog />`) — don't branch on a server-detected `platform`. The nav
  ships both the desktop actions and the mobile burger in the DOM; CSS shows the right one. (If you must SSR a
  platform hint to avoid a flash, gate it on width, not UA.)
- Don't add viewport `@media` breakpoints that fight the container queries.

---

## 5. Forms — wire the hover/focus/validation states

Canon now ships the **visual** states (`:hover`, `:focus-within`, `:active`, `:disabled`, `.pd-input--invalid`,
OTP `cur/invalid/locked`, switch `on`). You write the **logic** that toggles them. Stop passing `state="focus"`
in prod — the focus ring is automatic via `:focus-within`.

### 5.1 `PdInput` / `PdField`
- Make controlled (`value` + `onChange`). Show the error only after blur or submit:
  `state={error ? 'invalid' : undefined}`, and pass `error` text to `PdField`.
- a11y: `aria-invalid`, `aria-describedby` → the `.pd-err` node; focus the first invalid field on submit.

### 5.2 Phone (`AuthPhone`)
- RU mask `+7 (XXX) XXX-XX-XX`; keep raw digits in state; `inputmode="tel"`.
- Valid = 10 national digits. Invalid copy is baked: «Похоже, в номере не хватает цифр».
- Consent checkbox (`.pd-check`) required → toggle `.on`; block submit until checked.
- Submit → `PdBtn loading disabled` while requesting the code, then route to OTP.

### 5.3 OTP (`AuthOtp` / `PdOtp`) — the fiddly one
Build 6 real inputs (canon renders cells; back them with inputs or a hidden field + per-cell display):
- `inputmode="numeric"`, `autocomplete="one-time-code"`, `maxlength=1` per cell;
- auto-advance on entry, backspace moves left, **paste** a full 6-digit code fills all cells;
- auto-submit when the 6th digit lands;
- **states**: `typing` → `verifying` (spinner + submit `loading disabled`, inputs locked) → on fail `invalid`
  (`.pd-otp.invalid`, decrement "Осталось попыток: N") → after N fails `locked` (`.pd-otp.locked`, disable
  submit, show cooldown).
- **timers**: resend countdown starts at `0:42` (disable «Отправить снова» until 0:00); lockout cooldown
  shows `mm:ss` (design shows `58:00`). Keep timers in a `useRef` interval; clear on unmount; persist the
  lock deadline server-side so a refresh can't bypass it.
- Verify/throttle server-side; never trust the client attempt counter.

### 5.4 Register (`AuthRegister`)
- Name required (error baked: «Укажите имя, его увидят покупатели»); city from a select; photo optional.
- Submit → `state="submitting"` (`PdBtn loading disabled`, copy «Сохраняем…»).

### 5.5 Buttons & switches
- `PdBtn`: while a mutation is in flight pass `loading disabled` — guarantees no double-submit; the spinner +
  dim are already styled.
- `PdSwitch` (settings): controlled + **optimistic** toggle, persist via mutation, roll back on error. Some
  toggles are non-disableable (deal-status notifications) — render them `on` and read-only.
- OAuth buttons (`.pa-oauthbtn`): hover/focus shipped; on click open the provider flow; the primary provider
  keeps `--primary` styling.

### 5.6 Auth flow (state machine)
```
chooser ──oauth──▶ provider consent ──ok──▶ welcome
   │                                   └─needs-profile─▶ register ─▶ welcome
   └─phone──▶ phone-entry ──code-sent──▶ otp ──verified──▶ (new? register : welcome)
                                          ├─invalid (attempts−−)
                                          └─locked (cooldown)
errors: error / offline / blocked are terminal screens with retry/appeal CTAs (canon provides them).
```
Drive each node's screen `state` prop from the machine; don't force states statically.

---

## 6. Favicon / brand install
Copy `dist/favicon/*` to the web root and add to `<head>`:
```html
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<link rel="icon" href="/favicon.ico" sizes="32x32" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<link rel="manifest" href="/site.webmanifest" />
<meta name="theme-color" content="#CF5638" />
```
The mark inherits `currentColor`: terracotta in headers, white on dark (footer/aside). Keep `.pdl-brand svg`
terracotta — don't let it fall back to text color.

---

## 7. Don'ts
- Don't fork canon components or hand-patch their CSS in `web/` — a change is a new canon version (round-trip).
- Don't pass `state="focus"`/force states in prod; let interaction drive them.
- Don't filter/paginate the full catalog on the client; URL → server query → cursor page.
- Don't wrap `.pdl`/`.pdc` in a shrink-to-fit container — container queries need a real width.
- Don't trust client OTP attempt counters or lock timers; enforce server-side.

— end —
