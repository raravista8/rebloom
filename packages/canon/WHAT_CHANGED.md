# WHAT CHANGED — canon 0.4.0 (basis for the CHANGELOG section)

1. **Public SEO/marketing surface added (`./marketing`).** Converts the semantic-core work (`reference/peredarim-seo-yadro.md`) into canon: `PdGeoPage` (city SEO landing, one template → 10 cities), `PdSafeDeal` («Безопасная сделка», trust cluster), `PdBlogIndex`/`PdBlogArticle` (supply warm-up blog), `PdSeoMeta` (meta-plate preview). Strategy = intercept «дешёвые/свежие цветы рядом»; city in Title/H1 only (Директ via geo-targeting, not keywords).

2. **City declensions are DATA, not computed.** `PD_GEO_CITIES` carries `nom/loc/gen` + `districts` + `metro` per city. Copy auto-drops «у метро» where `metro:false` (Челябинск/Красноярск/Уфа). `web/` swaps in the production declension table + live counts (esp. «Санкт-Петербург», «Нижний Новгород»).

3. **Pickup-only applied across customer UI.** `DeliveryToggle` (Самовывоз/Курьер) removed from buy/deal screens → static «Самовывоз рядом» row; landing copy and footer de-delivered. Courier is deferred behind `delivery.courier=off` (growth lever #1); backend `delivery_method` contract kept forward-compatible — nothing deleted, just hidden.

4. **Two reusable design-system additions (whole canon benefits).**
   - **Heading→subheading spacing tokens** `--pds-gap-eyebrow/-deck/-lede/-sechead/-qa` (mobile + `.pds--desk` step-up) — one token per relationship, no ad-hoc margins. Includes the specificity fix: rules scoped under `.pds` to beat `.pd-root p{margin:0}` (0,1,1), which otherwise silently zeroes single-class margins.
   - **Intrinsic card grid** `--pds-card-min` + `repeat(auto-fill, minmax(min(100%, …),1fr))` + `min-width:0` children — never overflows; self-collapses to 1-up on narrow mobile, 4-up desktop.

5. **`nbsp()` SSR typographer.** Pure string→string helper (glues short prepositions/conjunctions + numbers, keeps dashes/middots off line-start) replaces the design-time DOM walker for prod — crawler-visible, no layout shift. `web/` applies at SSR/build (`CLAUDE_CODE_HANDOFF.md §5`).

6. **`PdLandingFooter` exported** — landing footer reused by all marketing pages instead of duplicated.
