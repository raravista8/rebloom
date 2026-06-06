# PLAYBOOK — Design-system round-trip (Claude Design ⇄ code)

> **Why this exists.** The UI is authored in **Claude Design** and lands in the web app **only** as a
> versioned, vendored package — never hand-transcribed. This file is the durable, project-agnostic
> contract + procedure + the failure modes that bite every single export. **Read before** any task
> that touches the design system: a new export, a re-vendor, or wiring a canon component into the app.
> **When in doubt, the one rule that subsumes the rest:** never hand-edit the package `src/` — round-trip it.

Stack assumed (same family as the source repo): **Next.js App Router + Tailwind + a vendored design-system
package (`@scope/canon`) built with tsup + Playwright pixel-diff + Capacitor wrap**. Placeholders:
`<project>` (code-name), `@scope/canon` (the package), `web/` (consumer app),
`docs/<DOC>.md` (handoff docs).

---

## 0. The model in one paragraph

Design rendered + verified in **Claude Design** is the **single source of truth** for UI. It ships to code as a
SemVer npm package vendored at `packages/canon/`. `web/` **imports** components and **composes** around them —
it does not fork, re-skin, or re-author them. Because the same web build is wrapped by Capacitor into
iOS/Android, "what was drawn and verified" is the runtime everywhere — **parity is by construction**, not by
re-implementation. Any visual change = a new package version (a round-trip), not a local patch.

Two roles, two docs:
- **Claude Design (produces UI)** works from the **BRIEF** (`docs/<DESIGN_BRIEF>.md` + states/motion/screens).
- **Code agent (consumes UI)** works from the **PACKAGE CONTRACT** (`docs/<CANON_PACKAGE_TZ>.md`) + the vendoring procedure below.

---

## 1. The package contract (what Claude Design must deliver, what code vendors)

### 1.1 Directory layout (`packages/canon/`)
```
packages/canon/
  src/            # component sources (TSX/JSX) — SINGLE SOURCE, edited ONLY by Claude Design
  dist/           # built bundle — COMMITTED to the repo (consumer does not re-author design)
  tokens/         # tailwind-preset (ts) + css-vars (theme.css) — design tokens
  package.json
  CHANGELOG.md    # version history (prepend a section per export)
  README.md       # entry-point map + import examples
```

### 1.2 `package.json` essentials
- `name`, `version` (SemVer), `description` (terse "what changed").
- `type: "module"`, `sideEffects: ["**/*.css"]` (so JS tree-shakes but CSS is preserved).
- `files`: `["dist", "tokens", "src", "README.md", "CHANGELOG.md", ...handoff .md]`.
- `exports` — a map keyed by entry group (`.`, `./buttons`, `./cards`, `./forms`, `./feed`, `./deal`,
  `./auth`, `./admin`, `./motion`, `./tokens`, `./tokens/tailwind-preset`, `./canon.css`). Each JS entry has
  `types` / `import` (`.mjs`) / `require` (`.cjs`). CSS entries map straight to a file
  (`"./canon.css": "./dist/canon.css"`).
- `peerDependencies`: `react`, `react-dom` (range matching `web/`); `tailwindcss` peer (optional).
- Animation lib (e.g. Framer Motion) → `dependencies` (it ships inside the components), `external` in the build.

### 1.3 Tokens contract (theming stays central)
- Components use **semantic** Tailwind tokens (roles like `surface`, `border`, `text-muted`, `primary`,
  `accent`, `success`, `warning`, `danger`, `focus-ring`) — **never raw hex** in component code.
- `tokens/tailwind-preset.ts` is consumed by `web/tailwind.config` via `presets: [...]`.
- `tokens/theme.css` exposes CSS vars so the palette/scale can be re-themed in one place.
- Motion tokens too (`duration.fast/base/slow`, `easing.standard/decelerate/accelerate/spring`,
  `press-scale`, `card-hover-lift`, `stagger-step`) — components reference tokens, not magic numbers.

### 1.4 Every export zip MUST contain (`export/canon-X.Y.Z-pkg/`)
Everything in §1.1 (`src/`, `dist/`, `tokens/`, `package.json`, `CHANGELOG.md`, `README.md`) **plus**:
- **baseline screenshots** of changed screens/components (device-framed) → drop into `web/tests/visual/`.
- a **screen-index delta** (which screens added/changed + status).
- a 1–5 bullet "what changed" note → seeds the CHANGELOG section.

> **A "docs-only" zip (only `.md`, no `src/ dist/ tokens/ package.json`) is UNVENDORABLE.** You cannot diff,
> cannot rebuild, cannot install. Reject it and demand a full package. (When this happens, visible copy fixes
> get hand-applied web-side as temporary overrides — and stay blocked for any change that lives *inside* an
> imported component until the real package arrives.) Make "full package, not docs-only" an explicit
> acceptance line in the export TZ.

---

## 2. The BRIEF essentials (what to put in the design TZ)

These are the non-negotiables that make the output verifiable and consistent. Put them in `docs/<DESIGN_BRIEF>.md`.

- **One web interface, mobile-first.** Primary viewport is a phone (360–414 dp); desktop is adaptive *on top*,
  not the other way around. The same build wraps to iOS/Android — no separate native mockups.
- **Device-framed preview per screen** (phone frame) with a screenshot → that screenshot is the pixel-diff baseline.
- **Semantic tokens only** (§1.3) — roles not raw colors; one accent + dedicated state colors; soft radii;
  delicate shadows. Exact values live in tokens, never hardcoded in components.
- **Exhaustive interaction states are mandatory** (a screen/component is *not done* until every applicable
  state is drawn). See §2.1.
- **Buttons are enabled by default.** `disabled` only when (a) the action is in-flight (anti-double-submit) or
  (b) a hard objective precondition is physically unmet. **The "grey button until the form is valid" pattern
  is banned** — keep the CTA active, validate inline on press/blur. Applies to every CTA.
- **A11y WCAG 2.1 AA:** text contrast ≥ 4.5:1; visible `focus-visible` ring (from the `focus-ring` token);
  touch targets ≥ 44×44px; never convey meaning by color alone (pair color with icon/text).
- **Motion ships *inside* the package** (§5) — `web/` never hand-adds animations.
- **Copy conventions live in the brief** (§2.2) — they're brand rules the design tool must honor.

### 2.1 The state matrix (drill into `docs/<INTERACTION_STATES>.md`)
- **Components:** `rest` (= active default) / `hover` (pointer only) / `focus-visible` / `pressed` /
  `selected` / `loading` / `disabled` (rare) / `error`. Hover is **pointer-only** — on touch show `pressed`.
- **Inputs:** `rest → hover → focus → filled → valid → invalid (+message under field) → disabled → read-only`;
  plus icon/prefix, clear button, char counter where a limit exists. Validation shows **on press/blur**, it
  does not pre-disable the button.
  - **OTP / one-time-code inputs use the system keyboard**, not a custom on-screen numpad — set
    `autocomplete="one-time-code"` + `inputmode="numeric"` so the platform offers autofill and the numeric pad.
- **Collections (feed/search/lists) — all of them:** `idle` → `loading` (skeleton, not a bare spinner) →
  `loaded` → `empty` → `no-results` → `loading-more` → `end-of-list` → `error` → `offline`.
  - **`empty` ≠ `no-results`.** `empty` = no data at all, no query/filter set → friendly empty-state + CTA.
    `no-results` = a query/filter returned 0 → distinct screen ("nothing found for …") + suggestions
    (clear filters / widen scope / similar). Different copy, different actions.
- **Bind data-driven states to the API contract**, don't invent statuses. The backend returns enough to
  distinguish them: echo the `applied` query/filters (so `empty` vs `no-results` is decidable),
  `next_cursor: null` for `end-of-list`, stable error codes for `unavailable / locked / forbidden /
  not_found / rate_limited / moderation_pending / content_blocked / internal`, and `offline` is client-side.

### 2.2 Copy conventions (examples of the brand-rule class that belongs in the brief)
These are *examples* — the point is that this kind of editorial rule is the brief's job, and it must be
enforced **inside canon** for any wholesale-imported screen (§4), because `web/` can't patch component text.
- **No trailing periods in headings/sub-headings.** Titles and eyebrow/sub lines read as labels, not sentences
  → strip the final `.`. (Whole batches of `.pds-h2-sub` / hero subs have shipped with stray periods and had
  to be fixed *in the source* because the consumer imports those screens wholesale.)
- **No money/legally-stale copy.** If the product made a scope decision (e.g. "the platform touches no money"),
  scrub contradicting strings everywhere — meta, OG, **and** body: no "escrow / fund hold / prepay / commission
  X%" wording. A single stale CTA line ("commission 5%") sitting in a component is a real bug, because it
  renders on prod and contradicts the adjacent copy. Catch it field-by-field at export review.
- **Body copy must be snippet-safe out of context.** The hero H1 + first paragraph may be lifted by a search
  engine *regardless of the meta description* — they must read on-brand and accurate standalone. (Search
  engines reject long keyword-stuffed meta descriptions and substitute a body sentence; an off-message body
  line then becomes your snippet.)
- **Localized/non-ASCII copy** is real text, not lorem; keep canonical strings in a `COPY` doc.

---

## 3. The reusable EXPORT PROMPT (fill-in template for the design tool)

Keep this as a copy-paste block. Fill the `<…>` slots, attach the brief + state/motion docs, and hand it to
Claude Design. It encodes every acceptance gate that has bitten a vendoring.

```
TZ — full export of @scope/canon <X.Y.Z>

GOAL
Deliver a COMPLETE package export/canon-<X.Y.Z>-pkg/ per the package contract — NOT docs-only.
Must contain: src/, dist/ (including the concatenated dist/canon.css AND dist/favicon/ AND dist/img/),
tokens/, package.json (version bumped to <X.Y.Z>), CHANGELOG.md (prepend a section listing the changes
below), README.md, and device-framed baseline screenshots of every changed screen.

CHANGES IN THIS VERSION  (one bullet each; this becomes the CHANGELOG)
- <component/file> — <what changed> (<class/selector touched>)
- ...

CONSTRAINTS (do not regress)
- Mobile-first; phone viewport primary; desktop adaptive on top. Device-framed preview + screenshot per changed screen.
- Semantic tokens only — no raw hex in components. Theme via tokens/theme.css; preset via tokens/tailwind-preset.
- Every changed component ships ALL applicable states (rest/hover/focus-visible/pressed/selected/loading/disabled/error;
  inputs incl. invalid+message; collections incl. empty vs no-results vs end-of-list/error/offline).
- Buttons enabled by default; disabled only in-flight or hard precondition. No "grey until valid".
- A11y AA: contrast ≥4.5:1, visible focus-ring, targets ≥44px, never color-only meaning.
- Motion lives INSIDE components (CSS transitions / @keyframes; Framer Motion for spring/stagger/shared-element),
  exported via ./motion; prefers-reduced-motion honored. web/ adds no animations by hand.
- Responsive switching uses @container container-queries on the component's own width — NOT a hard-coded
  desktop class the consumer must set. (Consumer never sets `.x--desk`.)
- Visibility toggles are real CSS rules in the stylesheet — not inline display:none / opacity:0 added consumer-side.
- Internal navigation takes link props (href / links=[{label,href}]) — never hardcode .html preview paths
  (they 404 in the real router).
- COPY: no trailing periods in headings/subs; no money/legally-stale strings; body copy snippet-safe out of context.

BUILD DISCIPLINE (these reset every export — KEEP them in the source)
- tsup outExtension({format}) => ({ js: format==='esm' ? '.mjs' : '.cjs' }).
- package.json exports.*.require → ./dist/X.cjs  (NOT .js).
- esbuild charset:'ascii' so non-ASCII escapes to \uXXXX; leave ASCII component markers (e.g. "PdBtn") greppable.

ACCEPTANCE (DoD)
- zip has src/ AND dist/ (not just .md); dist/canon.css contains the new rules; dist/favicon/ + dist/img/ present.
- diff of zip src/ vs vendored src/ shows EXACTLY the listed changes — the version label is not trusted.
- package.json version = <X.Y.Z>; CHANGELOG section present; baselines for changed screens attached.
- After vendoring: web/ `npm run test:visual` ≤ 2%.
```

---

## 4. Vendoring procedure (code agent — the round-trip)

Run in order. Every step exists because skipping it has broken a build.

1. **Verify the diff is real — never trust the version label.** Diff the zip's `src/` against the vendored
   `src/`; read the zip CHANGELOG and confirm each claimed change actually landed. (A new version number
   shipping *old* code is a known failure.)
   ```bash
   diff -ru packages/canon/src/ <unzip>/src/
   ```
   - **Unzip gotcha:** if the export contains non-ASCII (e.g. Cyrillic) filenames under `reference/prototypes/`,
     macOS `unzip` can abort *before* `src/` extracts ("disk full?" / Bad file descriptor). Exclude them:
     `unzip -o -x "*/reference/prototypes/*" <zip> -d <dir>` — the prototypes aren't needed to vendor.
2. **Copy changed `src/*` (and `tokens/*`)** into `packages/canon/`.
3. **Bump `package.json`** version + description; **prepend** a CHANGELOG section.
4. **Re-apply the build-config fixes the export reset** (§5.1) — `tsup.config.ts` `outExtension` and
   `package.json` `exports.*.require → .cjs`. Then build, then **re-copy the assets the build wiped** (§5.2):
   ```bash
   cd packages/canon && npm run build
   # tsup clean:true just wiped the concatenated css + favicon/img — restore from the export's dist/:
   cp <unzip>/dist/canon.css dist/canon.css
   cp -R <unzip>/dist/favicon dist/favicon
   cp -R <unzip>/dist/img     dist/img
   ```
5. **Verify a NEW build compiled — by content markers, not the label.** Non-ASCII is escaped to `\uXXXX`, so
   grep for ASCII component markers in the built bundle:
   ```bash
   grep -q "PdBtn" packages/canon/dist/index.mjs   # or any known component name from this version
   node -e "require('@scope/canon/buttons')"        # sanity: cjs require resolves (catches .js/.cjs regressions)
   ```
6. **Cache-bust install into the consumer** (the bundler won't follow `file:` symlinks — `--install-links` is
   mandatory):
   ```bash
   cd web && rm -rf node_modules/@scope/canon && npm cache clean --force \
     && npm install --install-links file:../packages/canon --force
   ```
   - **The one-off `--install-links` flag does NOT survive `npm ci` / CI installs.** Set `install-links=true`
     in the consumer's `.npmrc` so `npm ci` (and any clean CI install) materializes the `file:` design-system
     dep too — otherwise CI re-installs it as an unfollowed symlink and the bundler can't see it.
7. **Reconcile consumer adapters** that key off canon classes/selectors/`href`s (wrappers in `web/components/`
   may depend on a class name or markup that a major bump changed). See §6 for hand-rolled screens.
8. **Bump version strings** in the trackers (`SCREEN_INDEX`, `VISUAL_COVERAGE`, `web/CLAUDE.md`).
9. **Verify:** `cd web && npm run test:visual` — diff ≤ 2% against the new baselines.

**DoD:** `web/` builds clean; visual ≤ 2%; new-version markers present in the installed `dist/`; version +
CHANGELOG + trackers updated; **zero hand-edits in `src/`.**

---

## 5. Build-config gotchas (they recur on EVERY export)

### 5.1 The export resets build config — re-apply, ideally fix at source
Each delivery tends to ship a regressed build config. Two specific resets, every time:
- **`tsup.config.ts` missing `outExtension`** → under `"type":"module"`, tsup's default cjs output is `.js`,
  which Node then treats as ESM → `require()` breaks. Force:
  ```ts
  outExtension({ format }) { return { js: format === 'esm' ? '.mjs' : '.cjs' }; }
  ```
- **`package.json` `exports.*.require` pointing at `.js`** instead of `.cjs` → same breakage from the other
  side. Point every `require` at `./dist/X.cjs`.
- Put a comment in both files asking the design tool to keep them, and re-apply on the rare miss. Verify with
  a real `require()` and a `web/` build.

### 5.2 `tsup clean:true` wipes the concatenated CSS + favicon/img on every build
The build emits **per-entry** CSS (`buttons.css`, `feed.css`, …) but **NOT** the concatenated `dist/canon.css`
that `web/` imports (`@scope/canon/canon.css`), and `clean:true` deletes `dist/favicon/` and `dist/img/` too.
**After `npm run build`, re-copy `dist/canon.css` + `dist/favicon/` + `dist/img/` from the export's `dist/`**
(step 4) — every time, or the consumer's styles/icons/images break.

### 5.3 Non-ASCII escaping ⇒ verify by markers
`esbuild charset:'ascii'` escapes non-ASCII to `\uXXXX` in the bundle (by design — keeps output ASCII-clean).
Consequence: you can't eyeball localized strings to confirm a fresh build. **Grep for ASCII component markers**
(`PdBtn`, `AdminFraud`, …) in `dist/*.mjs` — present markers prove the new code compiled. The version label
proves nothing.

### 5.4 Motion must arrive in the package, not be hand-added
Animations live inside components (CSS transitions / `@keyframes`; an animation lib for spring/stagger/
shared-element). `web/` **never** writes animations by hand — any motion change is a new package version.
`prefers-reduced-motion` is built into the components. Pixel-diff checks the **end frames** (rest/hover/
pressed/focus); motion itself is verified by a checklist + (if available) a short demo clip.

---

## 6. Hand-rolled vs imported screens — the trap that hides for multiple versions

Some screens are **imported wholesale** from canon (`<GeoPage>`, `<SafeDeal>`, `<Blog*>`) → a re-vendor
propagates **everything** (markup, copy, CSS). But some screens (often the **home landing** and **auth**) are
**hand-rolled in `web/`** — they *borrow* canon's CSS classes (via the imported `canon.css`) but the JSX is
the consumer's own copy. The consequences:

- **For a hand-rolled screen, CSS propagates automatically on re-vendor (same class names), but JSX changes do
  NOT.** You must **hand-port** the markup/copy changes into the `web/` component. "Vendored canon → screen
  updated" is FALSE for these.
- **This can hide for several versions.** A hero rework can sit in the canon source while prod still renders
  the OLD hand-rolled hero, because the `web/` copy was authored from a lagging meta-contract table, not the
  live component. **Fix:** on any change to a hand-rolled screen, diff **every field** against the canon
  source's "READ FIRST" checklist — hero eyebrow / H1 / lede / photo / price tag / live-count — field by
  field. Don't trust "the component was updated."
- **Prefer to eliminate hand-rolls.** A screen that's a real canon import can't drift; a hand-rolled one always
  can. If the design tool can expose the screen as an importable component with the props you need, take that
  over a hand port.

### 6.1 Responsive: `@container` container-queries, not a JS/CSS class the consumer must set
Modern canon switches layout on the **component's own width** via `@container` at a breakpoint (e.g. 900px),
**not** a hard-coded `.x--desk` class. The consumer root carries the container (`container-type: inline-size`)
and **never sets the desktop class**. Pitfalls:
- When a patch changes nav-element *visibility* at desktop, confirm the rule lives in the **`@container` block**,
  not only under a `.x--desk` selector — otherwise the element vanishes on the live page (the consumer never
  sets that class).
- Don't wrap the container in a shrink-to-fit parent — container queries need a **real width**.
- Don't add viewport `@media` breakpoints that fight the container queries.

### 6.2 Containment trap: `container-type` is a containing block for `fixed` too
A component built for a **fixed-height device frame** (e.g. an off-canvas drawer parked at `translateX(100%)`,
`position:absolute`) misbehaves inside a **scrolling document** whose root has `container-type: inline-size` —
because a container is a containing block for **both** `absolute` AND `fixed`. The drawer then anchors to the
*full document height* (footer off-screen), and the parked off-screen panel extends `scrollWidth` → horizontal-
overflow guards fail everywhere. **Fix:** portal the overlay to `<body>` + `position:fixed` (escapes the
container) and add a consumer override to clip the parked panel (`.drawer { overflow:hidden }`).

### 6.3 Visibility = a real CSS rule, not inline `display:none`/`opacity:0`
Hiding an element belongs in the stylesheet (a real selector), not a consumer-side inline `display:none` or
`opacity:0` slapped on at the call site. Inline hacks (a) still occupy layout / extend `scrollWidth` in the
off-screen case, (b) are invisible to anyone reading the CSS, (c) get clobbered on the next render. If canon
needs an element hidden in a context, that's a canon CSS rule (or a prop), round-tripped.

### 6.4 Route links as props, never hardcoded `.html`
Canon components default to **preview** `.html` paths (the design tool's own preview routing). Imported into a
real router those **404**. The component must accept link props (`href` / `links=[{label, sub, href}]`); the
consumer passes **real routes** (`/catalog`, `/safe-deal`, `/#how`). Until the prop exists, you're forced to
hide that nav consumer-side — which is exactly the kind of debt that blocks a feature across versions. Make
"internal nav via props" an export acceptance line.

---

## 7. Quick reference — the checklist that prevents 90% of the pain

**Receiving an export:**
- [ ] Full package, not docs-only (`src/` + `dist/` + `tokens/` + `package.json` present).
- [ ] `diff -ru` of zip `src/` vs vendored `src/` matches the claimed CHANGELOG — label not trusted.
- [ ] Baseline screenshots for changed screens included.

**Building + vendoring:**
- [ ] `tsup outExtension` (`.mjs`/`.cjs`) + `exports.*.require → .cjs` re-applied.
- [ ] After build: `dist/canon.css` + `dist/favicon/` + `dist/img/` re-copied (clean wiped them).
- [ ] ASCII component markers present in `dist/*.mjs`; `require()` of an entry resolves.
- [ ] Installed with `--install-links --force` after `rm -rf node_modules/@scope/canon`.

**Reconciling the consumer:**
- [ ] Hand-rolled screens: JSX changes hand-ported (CSS auto-propagated); hero fields diffed field-by-field.
- [ ] Responsive visibility lives in the `@container` block, not a `.x--desk`-only selector.
- [ ] No consumer-side inline `display:none`/`opacity` hacks; no surviving hardcoded `.html` links.
- [ ] Copy: no trailing periods in headings; no money/legally-stale strings in meta/OG/body.

**Verifying:**
- [ ] `npm run test:visual` ≤ 2%; trackers + version strings bumped.
- [ ] Zero hand-edits in `packages/canon/src/`.
