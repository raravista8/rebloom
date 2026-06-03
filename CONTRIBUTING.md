# Contributing — Передарим (`rebloom`)

> **Before any change, read `CLAUDE.md` §0 (Behavioral principles).** Every task: think before coding (state assumptions, ask when unclear), simplicity first, surgical changes (each diff line traces to the request), goal-driven (write the test, then pass it).

## Workflow (trunk-based)
0. **Первая ветка проекта** (скелет, задача T0.1):
   ```bash
   git checkout main && git pull
   git checkout -b feat/e0-project-skeleton
   ```
   Далее — одна задача = одна ветка от `main`.
1. Branch from `main`: `feat/<scope>-<short>`, `fix/<scope>-<short>`, `chore/...` (например `feat/auth-otp` для T1.1, `feat/deals-escrow` для T5.1).
2. Keep PRs small — one task ≈ one PR (<500 LOC). Reference the TASKS id (e.g. `T5.2`).
3. Write the test first for protected paths (`core/{deals,payments,auth,moderation}`) — see TESTING §3.
4. `make lint typecheck test` must be green locally before pushing; protected path → `make security-check` too.
5. Open PR → CI (≈13 checks) must pass → review → `gh pr merge <N> --squash --delete-branch`.

## Commits (Conventional Commits)
`type(scope): summary` — types: feat, fix, chore, docs, refactor, test, perf, build, ci.
Example: `feat(deals): idempotent release with row lock (T5.4)`.
Never commit secrets/`.env`/TOTP seeds (pre-commit gitleaks + detect-secrets will block).

## PR template (paste into description)
```
## What & why
- Task: T<epic>.<seq>
- Summary:

## How verified
- [ ] make lint / typecheck / test green
- [ ] protected path? make security-check green + doc re-read + tests same commit
- [ ] UI? npm run test:visual ≤ 2%
- [ ] migration added if schema changed (expand/contract)
- [ ] diff is surgical (every line traces to the task)

## Risk / rollback
-
```

## Definition of Done
See `CLAUDE.md §7`. A task is not done until build clean + lint + typecheck + tests green, protected-path security-check green, UI visual ≤ 2%, diff surgical.

## New runtime dependency
Requires an ADR in `docs/adr/<NNNN>-<slug>.md` (CLAUDE.md §6). License must be in the allowlist (MIT/BSD/Apache-2.0/ISC) or justified by ADR.

## Canon (`@rebloom/canon`)
Never edit `packages/canon/src/*` by hand — it round-trips through Claude Design. To vendor a new version follow OPERATIONS §7.

## Troubleshooting
- Telegram bot can't connect from prod → expected; egress must go through the proxy (OPERATIONS §4).
- Visual regression flake → `gh run rerun <run-id> --failed`.
- Uploads inert → `S3_*` creds missing (OPERATIONS §4).
