# Playbooks — universal, reusable engineering practices

> A project-agnostic library distilled from a real production build. These are the
> **hard-won, non-obvious lessons that the original project spec did NOT contain** — the
> things we only learned by shipping (design-system round-trips, pixel-perfect testing,
> SEO snippet traps, security/PII hardening, single-box deploy gotchas, agent scaffolding).
> Drop them into a **new** project's docs from day 1 so you don't re-derive them.

## Who/what this is for
- **Stack family** (assumed by every doc): Next.js App Router + Tailwind + a design-system
  package **vendored from Claude Design** + Playwright visual tests; FastAPI/SQLAlchemy +
  Postgres + Redis; Docker Compose + Caddy on a single VPS → config-only managed scale-out.
  (Wrapped to iOS/Android via Capacitor — same web build.)
- **Reader:** a Claude Code agent + the founder bootstrapping the next project.
- **Not a framework, not theory** — concrete commands, thresholds, config snippets, and the
  exact failure modes that bit us, generalized so they transfer.

## The library

| # | Doc | Read it when… |
|---|---|---|
| 1 | **[agent-project-scaffold.md](agent-project-scaffold.md)** | **Day 0.** Setting up the repo: nested `CLAUDE.md` hierarchy, the 4 behavioral principles, protected paths, hard rules, handoff-doc decoupling, parallelization map, one-task→one-PR cadence, the durable-OPERATIONS-file habit. Start here. |
| 2 | **[design-system-handoff.md](design-system-handoff.md)** | Any UI. The Claude Design ⇄ code round-trip: package contract, the reusable **export prompt**, the vendoring procedure, and the build-config/CSS/hand-rolled-screen gotchas that recur every export. |
| 3 | **[visual-regression-testing.md](visual-regression-testing.md)** | Wiring pixel-perfect tests. The two-layer model (deterministic geometry guards + pixel-diff), Linux-baseline discipline, and the build/cache/server "silent liars". |
| 4 | **[seo-metadata-playbook.md](seo-metadata-playbook.md)** | Any indexable page. The core lesson — a search engine can **ignore your meta and show body copy** — plus the robots⇔sitemap⇔canonical invariant, JSON-LD, and a 3-dimension audit checklist. |
| 5 | **[security-and-pii-hardening.md](security-and-pii-hardening.md)** | Before launch (and when touching auth/PII/money). Threat-model-first; a copy-pasteable pre-launch hardening checklist + a data-breach runbook template. |
| 6 | **[deploy-and-ops.md](deploy-and-ops.md)** | Any deploy/CI/infra work. Single-box Compose+Caddy discipline, the deploy gotchas (background-build-then-up, one-shot migrations, /version stamp, bind-mount inode), and the env-only scale-out ladder. |

## Conventions
- **Placeholders:** `<project>` = engineering code-name; `<Project>` = customer-facing brand
  (they differ on purpose); `@scope/canon` = the vendored design-system package; `<domain>` =
  your product domain; `<provider>` / `<region>` / `<REGULATOR>` = substitute your own.
  Illustrative non-English example strings are samples — swap your product noun.
- **House style:** terse, scannable, "learned the hard way"; each doc opens with a 2-line
  "why this exists / when to read".
- `design-system-handoff.md` is the **canonical** source for the vendoring procedure; other
  docs point to it rather than re-stating it.

## How to use in a new project
1. Copy `docs/playbooks/` into the new repo.
2. Skim **#1** and lift the `CLAUDE.md` hierarchy + behavioral principles first.
3. Substitute the placeholders for your project as you adopt each doc.
4. Keep them living — when the next project teaches you something new, write it back here.
