# WHAT CHANGED — canon 0.6.3 (basis for the CHANGELOG section)

Landing-only patch (`./marketing` · `PdLanding`). Pure presentation pass on the **lower landing**
(how-it-works → escrow → objections → app → final CTA) plus a real spacing-cascade fix. No structural
or route changes; no token changes.

## ⚠️ The fix that explains all the «padding» complaints
The global reset **`.pd-root p, .pd-root h1, .pd-root h2 { margin:0 }`** has specificity `(0,0,1,1)` and
**outranks** the single-class `.pdl-h2` / `.pdl-sub` / `.pdl-h1` / `.pdl-lead` `(0,0,1,0)`. So every
kicker→heading→subtitle gap was actually `0` and the only separation was line-leading — earlier margin
tweaks on those classes were silently dead. Re-asserted with **two-class selectors that win** and unified
to a consistent **14px** gap everywhere (`.pdl-sechead .pdl-h2/.pdl-sub`, `.pdl-app-in .pdl-h2/.pdl-sub`,
new `.pdl-hero .pdl-h1/.pdl-lead`).

## Changes

1. **«Как это работает» steps** — bigger cards/badges/type; a **connector chevron** threads 1→2→3 into a
   journey; the **buyer** step (3) flips its badge/tag from terracotta to fresh-green; role tags are pills;
   hover lift. Copy: step-1 body → «Вам подарили букет, он порадовал и уже не нужен.»

2. **Escrow (dark) block** — warm terracotta radial glow on the dark field; flow items restacked
   (badge-on-top) with enlarged gold badges + connector chevron + hover; **trust note redesigned** from an
   icon-left card (read as a 4th step on mobile, broken optical vertical) into a captioned gold-tint callout
   with the heart inline above the heading. *(markup change: `.pdl-esafe` → `.pdl-esafe-h` heading row + body)*

3. **Objections «А вдруг…»** — «?» token moved above the question (full-width, `text-wrap:balance`) to kill
   the ragged breaks beside the inline badge; circular badge; bigger type + padding; hover lift.

4. **Final split CTA** — buttons pinned to the bottom so both align; **buyer card** white → (green, rejected
   as clashing) → **warm oat/sand `#ECE4D6`** pairing cleanly with the terracotta seller; deeper seller
   gradient + shadow; one-line eyebrow labels; bigger body; hover lift.

5. **Catalog filters on mobile** — stack the bar: each label on its own line above its chips
   (`.pdl-flabel{ flex-basis:100% }`); `.pdl--desk` restores the inline row.

6. **Reviews copy** — gender fix: buyer card «Взяла…» → «**Взял**…», Вера → **Артём** (Екатеринбург);
   seller card Никита → **Юлия** (Москва).

7. **Section-header spacing fix** — see the call-out above; 14px heading→subtitle gap unified across
   catalog / how / escrow / reviews / objections heads, the app block, and the hero.

---

**Authoritative:** `reference/prototypes/pd-land.{jsx,css}` are byte-current. `src/marketing/landing.jsx`,
`dist/canon.css` and `src/styles/canon.css` re-synced. Rebuild `dist/*.js` via `npm run build`.
Landing-scoped — nothing else changed since 0.6.2.
