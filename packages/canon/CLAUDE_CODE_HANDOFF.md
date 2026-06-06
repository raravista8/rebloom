# CLAUDE_CODE_HANDOFF — canon 0.2.0 / 0.4.0 → `web/`

What Claude Design shipped in **0.2.0** and **the exact logic Claude Code must write** in `web/`
to make it production-ready. The canon package is the **single source of truth** for markup, classes
and visual states — never re-implement components by hand (`CANON_PACKAGE_TZ §1, §10`). This file tells
you the *behaviour* to wire around them: a **fast catalog**, **working filters**, and **live form
hover/focus/validation states**.

---

## 0·6·2 — READ FIRST (the hero that never reached prod + desktop city picker)

> **Why this is at the top.** 0.6.0 rewrote the landing hero, but prod **kept rendering the old hero**
> (eyebrow «Вторая жизнь букетов», H1 «…дешевле цветочного магазина», no photo, «от 690 ₽ / −60%»). Cause:
> `web/` was built off the **meta-contract table (§8.3), whose H1 was still the pre-0.6.0 string**, so the
> visible hero copy/photo/price were never re-vendored. The component was right; the contract wasn't. §8.3 is
> now fixed. **Before shipping, diff every field below against the live page — these are the exact values
> that must appear.**

### 0.1 Hero fields — canonical values (component `PdLanding` → `Hero`, classes `pdl-*`)

| Field | Class | Must read exactly |
|---|---|---|
| Eyebrow | `.pdl-kicker` | **Люди передаривают свои букеты** (leaf icon) — *not* «Вторая жизнь букетов» |
| H1 | `.pdl-h1` | **Свежие букеты *напрямую от людей*, в 2–3 раза дешевле магазина** (`напрямую от людей` in `<em>`; «2–3 раза» nowrap) — *not* «…дешевле цветочного магазина» |
| Lede / subtitle | `.pdl-lead` | **«Букет подарили, он порадовал и уже не нужен.»** (bold lead-in) + «Вместо мусорки свежие цветы за полцены находят нового хозяина. Выставьте свой за минуту или заберите чужой.» |
| Photo | `.pdl-herophoto img` | real bouquet `hero-lacybird.png` (wire the CDN asset) — prod was rendering an **empty card** |
| Price tag | `.pdl-pricetag` | old **«17 200 ₽ в цветочной»** → new **«от 4 500 ₽»**, badge **«−74% дешевле»** — *not* «2 490 ₽ → от 690 ₽ / −60%» |
| Live count | `.pdl-livecount` | «128 букетов от людей рядом» |

These are **content the component already ships** — you are not re-typing them, you are making sure your build
renders `PdLanding` (and `generateMetadata`) instead of a stale hand-written hero. If any of the above shows the
old value in prod, the page is **not** on canon ≥0.6.0.

### 0.2 Desktop city picker (`NavCity` + `.pdl-citymenu`)

The header city selector «📍 Москва ▾» is a **desktop popover**, not the mobile full-screen «Город» page prod
fell back to. Canon ships: anchored dropdown under the trigger, the **10 cities** with live counts +
checkmark on the active city (no search — they all fit), open/close on the trigger (second click closes),
outside-click + `Esc` to dismiss. It sits **immediately after the brand in both header states** (guest +
authorized). In `web/`: replace the static `CITY_LIST` with the real dictionary (`PD_GEO_CITIES`, §8.2),
persist the choice (cookie/geo), and route selection to `/[city]`. Keep it a popover on desktop; the mobile
full-screen list stays for narrow viewports only.

---

## 0. What's new in 0.2.0 (vendor these first)

| Area | New / changed | Source |
|------|---------------|--------|
| Marketing landing | `PdLanding`, `PdLandingNav` (`@rebloom/canon/marketing`) — hero, live catalog teaser, how-it-works, reviews, safe-deal, objections, app, split CTA, footer | `src/marketing/landing.jsx` |
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
- Don't compute Russian city declensions algorithmically — use the data table (§8).
- Don't ship the design-time DOM typographer to prod — use `nbsp()` at SSR/build (§8).

---

## 8. Marketing / SEO pages (canon 0.4.0 · `./marketing`)

New public surface from `@rebloom/canon/marketing`: `PdGeoPage`, `PdSafeDeal`, `PdBlogIndex`, `PdBlogArticle`,
`PdSeoMeta`, plus `PD_GEO_CITIES` and `nbsp`. Strategy + full spec: `SEO_MARKETING_CANON_TZ.md` (folded here);
semantic core: `reference/peredarim-seo-yadro.md`.

### 8.1 Routes (Next.js App Router)
| Route | Render | Notes |
|---|---|---|
| `/[city]` | **SSG** `generateStaticParams` over 10 slugs | white-list city slugs (must not shadow `/sell`,`/login`,`/deal`,`/u`,`/l`,`/settings`,`/admin`,`/search`); `notFound()` for unknown |
| `/bezopasnaya-sdelka` | SSG | static |
| `/blog` · `/blog/[slug]` | SSG | `generateStaticParams` over articles |

`<PdGeoPage data={city} platform={desktopOrWeb} />` — `platform` from viewport/UA (or render desktop + let
container CSS adapt). Catalog inside is a **teaser with working sample filters**; wire it to the real city
catalog query like §2/§3 (URL state → server filter → keyset pagination).

### 8.2 City data — declensions are DATA
`PD_GEO_CITIES` is a **placeholder**. Replace with the production table; never compute case forms:
```ts
type CityData = { id:string; nom:string; loc:string; gen:string; count:number; metro:boolean;
  districts:{name:string;count:number}[] };
```
`metro:false` (Челябинск/Красноярск/Уфа) auto-drops «у метро» copy. Counts must be live.

### 8.3 Meta contract (`generateMetadata` per page)
| Page | Title | Description / H1 |
|---|---|---|
| `/` | `Свежие букеты в 2–3 раза дешевле магазина \| Передарим` | H1: «Свежие букеты напрямую от людей, в 2–3 раза дешевле магазина» (eyebrow «Люди передаривают свои букеты»; lede/photo/price per §0.1). **Title intentionally ≠ H1** — Title keeps the keyword snippet, H1 carries the C2C message. |
| `/[city]` | `Дешёвые свежие букеты в {loc} — самовывоз рядом \| Передарим` | H1: «Дешёвые свежие букеты в {loc} — самовывоз рядом» |
| `/bezopasnaya-sdelka` | `Безопасная сделка — оплата при встрече \| Передарим` | H1: «Платите за букет, только когда забрали егоко после того, как вы забрали букет» |
| `/blog` | `Блог «Передарима» — что делать с подаренным букетом \| Передарим` | H1: «Что делать с букетом, который уже подарили» |
| `/blog/[slug]` | `{Заголовок} \| Передарим` | H1 = заголовок |
| `/l/[id]` | `{Цветы} за {цена} ₽ рядом, {район} — самовывоз \| Передарим` | `alt`: «свежий букет {цветы} недорого, {район}» |

Also: JSON-LD (`ItemList`+`BreadcrumbList` on geo, `Product`/`Offer` on card, `FAQPage`/`Article` on safe-deal/blog);
`sitemap.xml` (10 geo + safe-deal + blog); `canonical` per page; city in Title/H1 **only** — Директ via geo-targeting.

### 8.4 Typography — `nbsp()` at SSR/build
Apply `nbsp(text)` to headings/ledes/sub-headings on the **server** (pure string→string), not via a client
DOM walker — crawler-visible, no layout shift. It glues short prepositions/conjunctions + numbers and keeps
dashes/middots off line-start. Spacing tokens `--pds-gap-*` and intrinsic grid `--pds-card-min` are in
`tokens/theme.css`; keep `.pds-grid > * { min-width:0 }` (prevents mobile overflow).

### 8.5 Pickup-only
Front always sends `delivery_method=self_pickup`; keep courier code behind `delivery.courier=off`. Buy/deal
screens already show the static «Самовывоз рядом» row (canon) instead of `DeliveryToggle`.

— end —
