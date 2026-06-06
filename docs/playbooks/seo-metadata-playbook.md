# SEO / metadata hygiene — Next.js App Router (RU market: Yandex + Google)

> **Why this exists.** Indexable pages live or die by what the engine *shows* in the SERP snippet, and the engine often ignores your `<meta description>` and pulls a sentence from the page body instead — especially **Yandex**. This playbook captures the durable, transferable rules + the exact failure modes from a real SEO audit so a future session ships snippet-safe, non-duplicate, canonical, structured pages the first time.
> **When to read:** before adding/editing any crawlable route (home, geo/landing templates, blog, FAQ/legal), before touching `app/robots.ts` / `app/sitemap.ts` / `generateMetadata` / JSON-LD, and whenever you add a new **private/auth** route (it must be excluded from the index in two places).

Stack assumed: **Next.js App Router + Tailwind + a vendored design-system package (`@scope/canon`)**, SSG/SSR public pages, Playwright visual tests, served behind Caddy on one VPS. Single-locale RU MVP, brand «<Project>», origin `<https://project.tld>`.

> **Placeholders:** «<Project>» = the customer-facing brand; «<project>» = the engineering code-name (these are deliberately distinct — brand ≠ code-name). The Russian example strings below are illustrative `<domain>` samples — substitute your own product noun; the rules they demonstrate (≤160 chars, no colon/keyword-lists, body-fallback) are what's universal.

---

## 0. The core lesson (read first) — the engine may ignore your meta description

A search engine (Yandex especially, Google often) **rejects a meta description it deems low-quality and synthesizes the snippet from the page body** instead. "Low-quality" in practice =

- **too long** (multi-sentence, >~160 chars),
- **a colon-led keyword list** (`<товар>: <синоним>, <синоним>, <синоним>, доставка, дёшево…`),
- **keyword-stuffed / over-optimized** (city names + every synonym crammed in),
- **duplicated** across many pages.

When it does this, it grabs *whatever sentence on the page best matches the query* — frequently your hero subhead or first paragraph, **out of context**. A sibling project shipped a long keyword-stuffed description and got an off-message body sentence shown as its snippet for weeks. So the two rules that fall out of this:

**(a) Meta description = ONE tight sentence, ≤ ~160 chars.** No colon lists. No 2–3-sentence pile-ups. One claim, one value prop, plain language.

```ts
// GOOD — one sentence, ~120 chars, reads as a snippet
description: 'Свежие букеты напрямую от людей — в 2–3 раза дешевле магазина. Самовывоз рядом, оплата при встрече.'

// BAD — multi-sentence, keyword-stuffed, will be rejected → body sentence shown instead
description: 'Свежие букеты рядом с вами в 2–3 раза дешевле цветочного. Самовывоз у дома, безопасная сделка с защитой денег. Заберите букет за полцены или передайте свой.'
```

**(b) First-screen body copy must itself be snippet-safe.** Because the engine may use the **hero `<h1>` + first `<p>`** regardless of your meta, that copy has to read on-brand, accurate, and self-contained **out of context**. Treat the first paragraph as a potential SERP snippet, not just decoration. If your hero subhead would embarrass you as a Google result, fix the body — not just the meta.

> Corollary: meta and body are **two independent snippet sources**. Auditing only `<meta>` is half the job; the body fallback is the other half (§7).

---

## 1. Per-page metadata contract (every indexable page)

Each crawlable route MUST set, via `generateMetadata` (dynamic) or `export const metadata` (static):

1. **`title`** — commercial value-first, brand at the tail: `Свежие букеты в 2–3 раза дешевле магазина | <Project>` (not brand-first — brand-first titles bleed commercial demand). Keep ≤ ~60 chars before truncation.
2. **`description`** — the one ≤160-char sentence (§0a), **unique per page** (§2).
3. **Self-referential `canonical`** — `alternates: { canonical: abs('/path') }`. Absolute URL, points at *itself*.
4. **`openGraph`** — `{ title, description, url, type, siteName, locale }`. `type: 'website'` for landings/indexes, `'article'` for blog posts / content pages. OG description may be a *shorter* variant but must carry the same message.

```ts
export async function generateMetadata({ params }): Promise<Metadata> {
  const item = bySlug((await params).slug);
  if (!item) return {};                       // unknown slug → empty (page 404s anyway)
  const url = abs(`/path/${item.id}`);
  const title = `${item.h} | <Project>`;
  const description = oneTightSentence(item);  // ≤160, unique
  return {
    title, description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'article', siteName: '<Project>', locale: 'ru_RU' },
  };
}
```

- **Root layout sets the defaults + `metadataBase`** so all relative canonical/OG/sitemap URLs resolve to the absolute origin. Per-page `canonical` overrides the layout default — **never** let pages inherit the layout's canonical (that points every page at `/`).

```ts
// app/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),            // origin for canonical/OG/sitemap
  title: '<Project> — <tagline>',
  description: '<one tight default sentence>',
  // icons / manifest …
};
```

- **One `abs()` / `SITE_URL` helper** is the single source of the origin (env-overridable, trailing-slash-stripped). robots, sitemap, canonical, and JSON-LD `url`/`@id` all import it so the host is consistent everywhere.

```ts
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://project.tld').replace(/\/$/, '');
export const abs = (p: string) => p.startsWith('http') ? p : `${SITE_URL}${p.startsWith('/') ? '' : '/'}${p}`;
```

---

## 2. Unique description per page — the templated-geo trap

**Reusing one description across N templated pages = duplicate-content / over-optimization signal.** The classic offender is a geo/landing template (`/[city]`, `/[region]`, `/[category]`) that emits the *same* description for all N slugs.

**Fix: a per-locale/per-slug template that actually varies the string** using data unique to each page (a declension, a region name, a count):

```ts
// 10 cities → 10 DISTINCT strings because city.loc varies
const description = `Свежие букеты в ${city.loc} — в 2–3 раза дешевле магазина. Самовывоз рядом, оплата при встрече.`;
```

- Vary by the most natural unique token (proper-cased place name in the correct grammatical case for RU — keep declensions as **authored data**, never string-munged).
- Keep the **city/keyword in `title` + `<h1>` only**, not stuffed into the description. For paid-search/regional targeting, geo is closed by *region targeting*, not city-in-keyword — so don't bloat copy with "{thing} {city}" permutations.
- Same rule for `title` and OG: the template must produce distinct strings per page.

---

## 3. JSON-LD structured data — per page type, matching visible content

Inject server-rendered JSON-LD so it's in the **static HTML** (crawler-visible). One tiny server component:

```tsx
// components/JsonLd.tsx — serialized into <script type="application/ld+json">
export default function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script type="application/ld+json"
      // built from our own constants (no user input) → safe; escape < to neutralize </script>
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />
  );
}
```

Pick the schema by page type, and **it MUST mirror what's visible on the page** (Google/Yandex penalize structured data that doesn't match on-page content):

| Page type | Schema(s) | Notes |
|---|---|---|
| Geo / category landing | `BreadcrumbList` + `ItemList` | ItemList items = the districts/categories actually rendered |
| FAQ / "how it works" / trust | `FAQPage` + `BreadcrumbList` | **Q&A text must be the literal visible copy** — keep the LD array in sync if design re-words it |
| Blog index | `Blog` (`blogPost[]`) + `BreadcrumbList` | post list mirrors rendered cards |
| Blog article | `Article` + `BreadcrumbList` | `headline`/`description` = visible title/excerpt |
| Home / global | `Organization` + `WebSite` | site-wide identity + (optionally) `SearchAction` |

- **`BreadcrumbList` on every deep page** — positions reflect the real nav path (Главная → Раздел → Эта страница), each `item` an absolute `abs()` URL.
- Build LD from **your own constants**, never raw user input (XSS via `</script>` — the `<` → `<` escape neutralizes it).
- **The "matches visible content" rule bites on canon/design-owned copy:** if the page body is a wholesale-imported design-system component and the FAQ/Article copy lives there, your hand-written JSON-LD will silently drift when Claude Design re-words the component. Leave a sync comment and re-check on every design re-vendor.

---

## 4. The robots ⇔ sitemap ⇔ canonical invariant

The three must agree on every URL. Two symmetric rules:

**Public SEO page** → indexable (no `noindex`) **AND** in `sitemap.ts` **AND** self-canonical.
**Private/auth/app route** → in `robots.ts` **disallow** **AND** absent from the sitemap (and ideally `noindex`).

```ts
// app/robots.ts — keep private surface out of the index
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: [
      '/admin', '/settings', '/me', '/sell', '/deal', '/deals', '/notifications', '/login',
    ]},
    sitemap: abs('/sitemap.xml'),
    host: abs('/'),
  };
}
```

```ts
// app/sitemap.ts — PUBLIC surface only; private routes intentionally excluded
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    entry('/', 1.0, 'daily'),
    entry('/trust-page', 0.6, 'monthly'),
    entry('/blog', 0.5, 'weekly'),
    ...GEO_SLUGS.map((s) => entry(`/${s}`, 0.8, 'daily')),     // templated geo
    ...ARTICLES.map((a) => entry(`/blog/${a.id}`, 0.4, 'monthly')),
    entry('/legal/terms', 0.3, 'yearly'),
    entry('/legal/privacy', 0.3, 'yearly'),
  ];
}
```

> **THE recurring miss: a NEW auth route must be added to BOTH `robots.ts` disallow AND kept out of the sitemap.** Adding `/wallet` or `/inbox` and forgetting robots leaks a private screen into the index. Make "update robots + sitemap" part of the same PR that adds any non-public route. Symmetrically, a new *public* SEO page must be **added to the sitemap and given a self-canonical** or it won't be discovered.

- **Dynamic public segment must not shadow private routes.** A root-level `[slug]` catch-all (`app/[city]/page.tsx`) can collide with `/login`, `/admin`, etc. Use `export const dynamicParams = false` + `generateStaticParams()` over a whitelist so only known slugs render and everything else 404s; static routes win over the dynamic segment regardless, but the whitelist makes intent explicit.
- Sitemap `priority`/`changeFrequency` are hints — set sane values (home 1.0/daily, geo 0.8/daily, evergreen legal 0.3/yearly); don't agonize over them.

---

## 5. No stale / false / off-message claims — anywhere

A factual or legal claim that's no longer true is worse in SEO than missing copy: it's the snippet, the OG card, AND the structured data, all wrong. When the product model changes (pricing, a removed feature, a compliance posture), **sweep ALL four surfaces**:

1. `<meta description>` / `title`
2. `openGraph` title + description
3. visible **body** copy (incl. design-system-owned components)
4. **JSON-LD** (FAQ answers, Article description, ItemList names)

When a product-model change removes a feature or compliance posture (say the platform stops handling payment, or a price/guarantee claim changes), every surface must drop the now-false phrasing — meta, OG, the templated description, the FAQ JSON-LD answers, AND the design-system-owned body copy. Missing any one leaves a contradictory snippet live.

> Keep a single banned-phrases list for the current product model and grep all four surfaces before shipping.

---

## 6. Ship-time mechanics (SSR `<head>` vs client scripts; reindex)

- **Meta/canonical/OG/JSON-LD must be in the SSR `<head>` / static HTML** — that's the whole point. Verify with a raw fetch, not the browser (the browser shows post-hydration DOM):

```bash
curl -s https://project.tld/some-page | grep -iE '<title|name="description"|rel="canonical"|og:title|application/ld\+json'
curl -s https://project.tld/sitemap.xml | head
curl -s https://project.tld/robots.txt
```

- **`afterInteractive` / analytics scripts are client-only and are NOT in the SSR HTML.** A Yandex Metrica / GA tag injected via `next/script strategy="afterInteractive"` (or a client `'use client'` component) won't appear in `curl` output — that's correct, not a bug. Don't "fix" it by SSR-ing the tag; verify those by grepping the *client bundle* instead:

```bash
curl -s 'https://project.tld/_next/static/chunks/app/layout-*.js' | grep <counter-id>
```

- **After any metadata/body/structured-data change to a live URL, request reindex** so the engine re-reads it instead of waiting for the next crawl:
  - **Yandex.Webmaster** → *Индексирование → Переобход страниц* ("recrawl") — submit the changed URLs (daily quota).
  - **Google Search Console** → URL Inspection → *Request indexing* for each changed URL.
  - Resubmit `sitemap.xml` in both consoles when you add/remove public URLs.
- Visual-regression baselines won't catch SEO regressions (they screenshot the rendered viewport, not `<head>`). Add an explicit head/HTML assertion or the curl-grep above to CI/manual checklist if metadata correctness matters.

---

## 7. How to AUDIT an existing site — 3 dimensions, ~10 min

Run all three; a page passes only if all three are clean.

**1. Meta tags** (`curl … | grep` per indexable URL)
- `title` present, value-first, brand at tail, not truncated, **unique** per page.
- `description` = ONE sentence, ≤ ~160 chars, no colon-list, no keyword stuffing, **unique** per page (diff descriptions across templated geo/category pages — identical = fail).
- `rel="canonical"` present, **absolute**, **self-referential** (not pointing at `/`).
- `og:title` / `og:description` / `og:url` present and on-message.

**2. Body fallback** (does the page survive the engine ignoring your meta?)
- Read the hero `<h1>` + first `<p>` **out of context** — would it make an acceptable SERP snippet? If not, fix the body.
- No stale/false/off-model claims in the first screen (§5).
- The keyword you target lives in `title` + `<h1>` (and reads naturally), not jammed into prose.

**3. robots / sitemap / structured data**
- `robots.txt`: every private/auth route disallowed; public surface allowed; `Sitemap:` line present.
- `sitemap.xml`: every public SEO page present + self-canonical; **zero** private routes present.
- Invariant check: for each route, `in-sitemap == public == not-in-robots-disallow`. Any mismatch = bug.
- JSON-LD: correct `@type` per page type; **content matches what's visible**; absolute breadcrumb URLs; no stale claims.
- After fixes → request reindex (§6).

---

## 8. Checklist for a NEW indexable page (copy/paste)

- [ ] `title` value-first + brand tail, unique
- [ ] `description` one sentence ≤160, unique (varied if templated)
- [ ] hero `<h1>` + first `<p>` snippet-safe out of context, no stale claims
- [ ] self-referential absolute `canonical`
- [ ] `openGraph` {title, description, url, type, siteName, locale}
- [ ] JSON-LD for the page type, **matching visible content**, absolute breadcrumb URLs
- [ ] added to `app/sitemap.ts`
- [ ] NOT in `robots.ts` disallow (public) **/** IS in disallow + out of sitemap (private)
- [ ] `curl | grep` confirms meta/canonical/OG/LD in SSR HTML
- [ ] request reindex (Yandex.Webmaster recrawl + GSC request-indexing) after deploy
