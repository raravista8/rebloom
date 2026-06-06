# PLAYBOOK — Visual & layout regression testing for a design-system web app

> **Why this exists.** Pixel-perfect UI fidelity is a real acceptance gate when the UI
> is vendored from an external design system (a `@scope/canon`-style package) and the
> app must render byte-identical on web + (Capacitor-wrapped) mobile. This playbook is
> the durable, stack-transferable recipe: how to layer the tests so the deterministic
> ones catch the most bugs and the flaky ones catch the rest, how to keep baselines
> sane across OSes, and the build/cache/auth gotchas that silently make tests lie.
> **Read before** standing up a Playwright visual suite or debugging a flaky/false diff.

> **Stack assumption:** Next.js (App Router) + Tailwind + a design-system package
> vendored from Claude Design, driven by Playwright, deployed via Docker Compose/Caddy.
> Generalize the framing, keep the substance. Paths use `<project>/web/...`.

---

## 0. TL;DR (the load-bearing rules)

1. **Two layers.** (1) deterministic DOM/functional specs + **geometry guards** that NEVER flake — reach for these FIRST. (2) **pixel-diff** (`toHaveScreenshot`) for true visual fidelity — can flake on fonts/AA, use sparingly.
2. **Geometry guard beats pixel-diff.** A `scrollWidth ≤ clientWidth` assertion is deterministic and OS-independent; a screenshot is not. Express a regression as a geometry invariant whenever you can, and only fall back to a pixel baseline for "does it actually *look* right".
3. **One canonical mobile width = the device reference** (e.g. 375px = iPhone). Add ONE desktop project. Don't sprinkle ad-hoc viewports.
4. **Pixel baselines are generated on the CI OS (Linux), never committed from a dev machine** — macOS/Windows font rendering differs → guaranteed false diffs. Regenerate via a `workflow_dispatch` that runs `--update-snapshots` and commits the `*-linux.png`.
5. **A bot push does NOT trigger CI** (anti-recursion). After the baseline workflow pushes PNGs, push an **empty commit** to actually run the diff job.
6. **Three silent liars:** stale framework build cache (`.next/cache` bundles old design-package CSS) → `rm -rf` it before building; a reused dev server masks changes → run a **fresh** server in CI mode; lint per-file cache passes warm locally but fails cache-cold in CI.
7. **Auth-gated routes need a seeded session cookie** (`storageState`) or every spec redirects to `/login` and "passes" against the wrong page.

---

## 1. The two-layer model

The suite is split by *flakiness class*, not by screen. Both layers live under
`web/tests/visual/`.

### Layer 1 — deterministic DOM / functional specs + geometry guards (PREFER THESE)

These assert structure and measurements via `page.evaluate`/locators. They never
flake on font rendering, anti-aliasing, or sub-pixel layout, so they're safe to gate CI
hard. Three flavours:

**(a) Functional / data-state specs** — mock the API at the network layer and assert
the right DOM appears. This is where you cover the collection lifecycle
(loaded / empty / no-results / error / offline) without a backend:

```ts
// feed.spec.ts — stub the API, assert the rendered state
test('empty: no listings → empty note', async ({ page }) => {
  await page.route('**/api/feed**', (r) =>
    r.fulfill({ status: 200, contentType: 'application/json',
      body: JSON.stringify({ ok: true, data: { items: [], next_cursor: null } }) }));
  await page.goto('/');
  await expect(page.getByText(/no listings yet/)).toBeVisible();
});

test('offline: feed error → retry CTA', async ({ page }) => {
  await page.route('**/api/feed**', (r) => r.abort('failed'));   // simulate network down
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Retry' })).toBeVisible();
});
```

**(b) Geometry guards** — deterministic layout invariants. These caught the bugs that
shipped *unseen* because the suite was mobile-only and nobody screenshotted desktop: a
clamped split, clipped headings, the mobile tree rendering on desktop. Keep them as
reusable helpers:

```ts
/** Every matched element must not be clipping its own text. */
async function expectNoClip(loc: Locator): Promise<void> {
  for (let i = 0; i < await loc.count(); i++) {
    const [scrollW, clientW, text] = await loc.nth(i).evaluate(
      (e) => [e.scrollWidth, e.clientWidth, (e.textContent || '').trim()]);
    expect(scrollW, `clipped horizontally: "${text}"`).toBeLessThanOrEqual(clientW + 1);
  }
}

/** The page must not overflow the viewport horizontally. */
async function expectNoHorizontalOverflow(page: Page): Promise<void> {
  const over = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth);
  expect(over, 'horizontal overflow (px)').toBeLessThanOrEqual(2);  // +1–2px slack for rounding
}
```

High-value guard assertions, all deterministic:
- **No-clip:** `scrollWidth ≤ clientWidth (+1)` on every heading/price/brand element — catches one-word-per-line clamps and ellipsised text.
- **No horizontal overflow:** `documentElement.scrollWidth - innerWidth ≤ 2` — catches a stray full-bleed element busting the layout.
- **Full-width split spans the column:** `boundingBox().width > 1000` on a desktop split that must NOT be clamped to a narrow card (a stray `max-width` on a wrapper once clamped it).
- **Right tree mounts:** assert the desktop chrome is present AND the mobile chrome is absent (`expect(page.locator('.mobile-bottomnav')).toHaveCount(0)`) — catches "mobile tree rendered on desktop" when a responsive switch (`useIsDesktop`/container-query) regresses.
- **No dead links:** `expect(footer.locator('a[href="#"]')).toHaveCount(0)` + assert real routes resolve — catches a vendored design footer shipping placeholder hrefs.

**(c) Smoke** — one trivial "the shell mounts" spec per critical route, independent of
any API, so a white-screen crash fails fast and loudly.

### Layer 2 — pixel-diff (`toHaveScreenshot`)

The only thing that actually verifies *"it looks like the design"*. Configured once,
globally:

```ts
// playwright.config.ts
expect: {
  toHaveScreenshot: {
    maxDiffPixelRatio: 0.02,   // ≤2% (your design DoD); ratio, not absolute count
    animations: 'disabled',    // freeze CSS/spring animations so reveals don't flake
    caret: 'hide',             // no blinking text caret
  },
},
```

Per-spec, also kill motion at the page level and wait for the network to settle so
lazy images/fonts are in before the shot:

```ts
test('home landing', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });   // belt-and-suspenders vs config
  await page.route('**/api/feed**', (r) => ok(r, { items: [...], next_cursor: null }));
  await page.goto('/');
  await expect(page.locator('.card').first()).toBeVisible();  // gate on real content
  await page.waitForLoadState('networkidle');                 // fonts/images settled
  await expect(page).toHaveScreenshot('home-landing.png');
});
```

Pixel-diff hygiene:
- **Stub every external image** (avatars, CDN/proxy images) with an inline data-URI or a routed SVG so the shot is hermetic — a CDN hiccup must not fail a layout test.
- **Mask or stub anything non-deterministic** (live counters, timestamps, "N online"). Prefer stubbing the data over `mask:` so the surrounding layout still diffs.
- **Gate the screenshot on real content being visible** before `toHaveScreenshot`, or you'll baseline a skeleton/spinner.
- Keep the baseline set **small and high-value** (landing, a card detail, the auth chooser). Every screen does NOT need a pixel baseline — most are better covered by Layer 1.

### The governing principle

> **Geometry guard is deterministic; pixel-diff can flake. Prefer the guard.**
> If a regression can be phrased as "this element must not clip / overflow / collapse",
> write the measurement assertion. Reserve pixel baselines for fidelity you can't
> express numerically. When a pixel test flakes, the first question is "could a
> geometry guard have caught this instead?"

---

## 2. Viewport convention (mobile-first + one desktop project)

Define exactly two Playwright projects. The mobile width is the **device reference**,
not a generic "small":

```ts
projects: [
  {
    // Functional/DOM specs run mobile-first. ONE canonical width = the device
    // reference (e.g. 375 = iPhone). NOT 360/Android — pick one and commit.
    name: 'mobile-375',
    use: { ...devices['Pixel 5'], viewport: { width: 375, height: 800 } },
    testIgnore: '**/desktop.spec.ts',
  },
  {
    // Desktop layout coverage — without this, desktop regressions ship unseen.
    name: 'desktop-1280',
    use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 900 } },
    testMatch: ['**/desktop.spec.ts', '**/pixel.spec.ts'],  // desktop guards + pixel in both
  },
],
```

- **Functional specs run only in `mobile-375`** (mobile is the dominant target). A desktop case needed inline goes in a `test.describe('desktop', () => { test.use({ viewport: ... }); ... })` block.
- **`desktop.spec.ts` is desktop-only** (geometry guards for the wide layout).
- **`pixel.spec.ts` runs in BOTH projects** → you get `mobile-375` + `desktop-1280` baselines per screen, so a clamp/clip/spacing change on either viewport fails.
- **Why the exact mobile width matters for baselines:** pixel baselines belong to the mobile reference project. A change gated behind a desktop-only responsive branch won't move the mobile baseline — and vice-versa. Know which project owns the baseline you expect to change.

---

## 3. Baseline discipline (the #1 source of false failures)

### Generate baselines on the CI OS, never on a dev machine

macOS/Windows render fonts (hinting, sub-pixel AA) differently from Linux. A baseline
committed from a Mac will diff against the Linux CI render by **way more than 2%** for
zero real change. Playwright auto-suffixes snapshots with the platform
(`name-project-{platform}.png`), so a dev-generated `*-darwin.png` is simply **never
used by CI** — only `*-linux.png` (or your runner's OS) counts. Don't be fooled by a
green local run.

> ⚠️ Dev machines will happily write `*-darwin.png` files when you run the suite
> locally. They're dead weight — CI ignores them. Either `.gitignore` the non-CI-OS
> suffix or accept the clutter, but **never** rely on a darwin/win baseline passing.

### Regenerate via a manual `workflow_dispatch`

A dedicated workflow runs on the CI OS, updates snapshots, and commits them to the
triggering branch:

```yaml
# .github/workflows/visual-baselines.yml
name: visual-baselines
on: workflow_dispatch          # manual trigger only
jobs:
  update:
    runs-on: ubuntu-latest      # MUST match the OS your CI diff job runs on
    permissions: { contents: write }
    defaults: { run: { working-directory: web } }
    steps:
      - uses: actions/checkout@v4
        with: { ref: ${{ github.ref_name }} }
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: npm, cache-dependency-path: web/package-lock.json }
      - run: npm ci
      - run: npm run build
      - run: npx playwright install --with-deps chromium
      - run: npx playwright test --update-snapshots
      - name: Commit baselines
        run: |
          git config user.name  "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add tests/visual || true          # add the DIR — see gotcha below
          if git diff --cached --quiet; then echo "no changes";
          else git commit -m "test(web): update visual baselines" \
               && git push origin HEAD:${{ github.ref_name }}; fi
```

Dispatch it: `gh workflow run visual-baselines.yml --ref <branch>`.

### Baseline gotchas (learned the hard way)

- **`git add` can't use bash `**` globs** in many shells (no globstar by default) — **add the directory** (`git add tests/visual`), not `tests/visual/**/*.png`, or the new `*-snapshots/` PNGs are silently skipped and the commit is empty.
- **The bot's token push does NOT trigger CI** (GitHub anti-recursion: a `GITHUB_TOKEN`-authored push won't start new workflow runs). So after the baseline workflow commits, **the diff verification never runs**. Fix: push an **empty commit** to kick CI — `git commit --allow-empty -m "ci: run visual diff" && git push`.
- **Always regenerate baselines after touching a screenshotted screen** (or re-vendoring the design package — its CSS changes the render). Dispatch the workflow as part of the change, in the same PR, so reviewers see the new PNGs.
- **A baseline IS a reviewable artifact.** A reviewer should eyeball the committed PNG diff, not rubber-stamp it — `--update-snapshots` will happily "fix" a real regression into a new baseline.

---

## 4. Build / cache / server gotchas — the silent liars

These make a green run meaningless. Each has bitten real CI.

### 4.1 Stale framework build cache bundles OLD design-package CSS

The framework caches compiled CSS/modules (`.next/cache` for Next.js). After you
re-vendor the design package or `npm install` a new version, an incremental build can
**reuse the cached old CSS** — the page renders the previous design and your diff
either falsely passes or falsely fails. **Blow the cache before building when the
design package changed:**

```bash
rm -rf web/.next/cache    # nuke stale compiled CSS from the vendored package
npm run build
```

CI does a cold `npm ci` + fresh build so it's usually safe there; the trap is local
"why does my baseline still show the old look" debugging.

### 4.2 A reused dev/start server masks changes

Playwright's `webServer.reuseExistingServer` is convenient locally but **a stale
already-running server serves the OLD bundle** — your change never appears, the test
"passes". Config it off in CI and run a fresh server when verifying a change:

```ts
webServer: {
  command: 'npm run start',           // serve the production build, not `next dev`
  url: 'http://localhost:3000',
  reuseExistingServer: !process.env.CI,  // CI ALWAYS spins a fresh server
  timeout: 120_000,
},
```

When verifying locally, force a clean run: `CI=1 npm run test:visual` (also enables
`forbidOnly`, retries, line reporter — the same shape as CI). A reused warm `next start`
is the single most common "but it works on my machine".

### 4.3 Lint per-file cache: warm-local green, cold-CI red

`next lint`/ESLint cache results per file (`.next/cache/eslint`). Rules that depend on
the **route graph** (e.g. `@next/next/no-html-link-for-pages`) only re-fire when the
graph changes — but a warm local cache won't re-lint untouched files, so adding a new
**root-level dynamic route** can make a rule newly flag *pre-existing* `<a href>` links
that CI (cache-cold) catches and local (cache-warm) misses. This isn't a visual test,
but it lands in the same `web` CI job and reds the build. Verify cold before pushing:

```bash
rm -rf web/.next/cache/eslint && npm run lint   # reproduce the cold-CI lint locally
```

### 4.4 `/version` (or any build stamp) reports the wrong thing

If you confirm "what's deployed" by a build stamp, know which service it reflects. A
web-only deploy can leave an API-owned `/version` on the old commit — verify the web
bundle by its image timestamp or by grepping a marker out of the served chunk, not the
stamp.

---

## 5. Auth-gated routes need a seeded session

If a server-side middleware redirects unauthenticated requests to `/login`, then EVERY
spec hitting an authed route (`/sell`, `/deal`, `/admin`, …) silently lands on the
login page and may still "pass" trivial assertions — against the wrong page. Seed a
dummy session cookie via `storageState` so the gate lets the harness through (the
middleware checks **presence**; the specs still mock the data APIs):

```ts
// playwright.config.ts
use: {
  baseURL: 'http://localhost:3000',
  storageState: './tests/visual/_session-state.json',
},
```

```json
// tests/visual/_session-state.json — minimal cookie that satisfies the auth gate
{ "cookies": [ {
  "name": "session", "value": "visual-test-session",
  "domain": "localhost", "path": "/", "expires": -1,
  "httpOnly": true, "secure": false, "sameSite": "Lax"
} ], "origins": [] }
```

- `secure: false` because the harness is plain-HTTP `localhost` — a `secure` cookie would be dropped.
- The gate only checks the cookie **exists**; real authz is mocked at the API layer, so this is safe and doesn't weaken any production check.
- Public/marketing specs are unaffected (no cookie needed). If you test the *login redirect itself*, do it in a context with `storageState` cleared.

---

## 6. CI wiring (the `web` job order)

Run the cheap deterministic gates before the browser, and the visual job last:

```yaml
- run: npm ci
- run: npm run lint        # cold cache in CI — catches route-graph lint (see §4.3)
- run: npx tsc --noEmit
- run: npm run test        # unit (vitest) if present
- run: npm audit --audit-level=high
- run: npm run build       # fresh build → no stale .next/cache (see §4.1)
- run: npx playwright install --with-deps chromium
- run: npm run test:visual # Layer 1 (functional + geometry) + Layer 2 (pixel ≤ threshold)
```

Operational notes:
- **`retries: process.env.CI ? 1 : 0`** in config — one retry absorbs genuine pixel flake (slow navigation/font load) without hiding a hard failure. If a *geometry* guard needs a retry, that's a real bug, not flake.
- **Visual jobs flake on slow first navigation.** Re-run just the failed job (`gh run rerun <run-id> --failed`) before assuming a real diff; if it passes on retry it was flake, if it fails twice it's real.
- **No required-status-check protection ⇒ a red visual job can still be merged.** Always confirm `gh pr checks <N>` is all-green *before* `gh pr merge` — a `gh merge` will land even with a red check, and a bad `playwright.config`/baseline merged red breaks `main` for everyone.
- **Gate the visual job behind file existence** if the web app is scaffolded later than the repo (a `detect` job that only runs `web` when `web/package.json` exists), so an empty skeleton doesn't red CI.
- Install **only the browser you test** (`chromium`) with `--with-deps` — full multi-browser install is slow and pointless for a single-render fidelity check.

---

## 7. When you re-vendor the design package — visual checklist

Because the design system is the source of truth and is vendored as a package, every
re-vendor can move the render. Tie these to the vendoring procedure. Full procedure: see
`playbooks/design-system-handoff.md` (canonical):

1. `rm -rf web/.next/cache` then rebuild — defeat stale-CSS (§4.1).
2. Re-run `npm run test:visual` (`CI=1` for a fresh server, §4.2) and READ the diffs.
3. **Distinguish CSS-propagated vs hand-ported changes.** If part of a screen is hand-rolled in `web/` (not a direct package import), CSS from the package propagates automatically but JSX/markup changes do NOT — diff the live render against the package's reference, field by field, don't assume "re-vendored → screen updated".
4. If the new render is the intended design → dispatch `visual-baselines.yml` to regenerate Linux baselines (§3), in the same PR.
5. Push an **empty commit** so the diff job actually runs against the new baselines (§3, bot-push gotcha).
6. Bump the design-package version string everywhere it's tracked (coverage tracker, screen index, `web/CLAUDE.md`) so a future session knows what's live.

---

## 8. Anti-patterns (don't)

- ❌ Commit baselines from macOS/Windows. They're never used by Linux CI and rot.
- ❌ Pixel-diff a screen that a geometry guard could cover — you trade a deterministic check for a flaky one.
- ❌ Screenshot before content is visible — you baseline a skeleton/spinner.
- ❌ Let live counters/timestamps/online-counts into a pixel shot unmasked → eternal flake.
- ❌ Trust a warm local `lint`/`test:visual` (reused server, warm eslint cache) as proof CI will pass — run `CI=1` / clear caches.
- ❌ `git add tests/visual/**/*.png` in the baseline workflow (globstar off → empty commit). Add the directory.
- ❌ Assume the bot's baseline push triggered CI — it didn't; push an empty commit.
- ❌ Merge with a red visual check because branch protection didn't block it — check `gh pr checks` yourself.
- ❌ Run authed-route specs without a seeded session cookie — they redirect to login and "pass" the wrong page.
- ❌ Sprinkle ad-hoc viewports — two projects (one mobile reference + one desktop), period.

---

## 9. One-glance command reference

```bash
# Run the full visual suite as CI does (fresh server, retries, forbidOnly):
CI=1 npm run test:visual

# Reproduce the cold-CI lint locally (route-graph rules):
rm -rf web/.next/cache/eslint && npm run lint

# Defeat stale design-package CSS before a build:
rm -rf web/.next/cache && npm run build

# Regenerate Linux pixel baselines (then push an empty commit to run the diff):
gh workflow run visual-baselines.yml --ref <branch>
git commit --allow-empty -m "ci: run visual diff" && git push

# Re-run only a flaky visual job:
gh run rerun <run-id> --failed

# Update a single baseline locally (caveat: writes a non-CI-OS PNG, CI ignores it):
npx playwright test pixel.spec.ts --update-snapshots
```
