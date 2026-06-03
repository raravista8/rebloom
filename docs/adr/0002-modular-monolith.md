# ADR-0002: Modular monolith with hexagonal high-risk core
Date: 2026-06-03
Status: Proposed

## Context
<5 engineers, money requires single-transaction invariants, many cohesive domains (listings, deals, payments, reviews, moderation). Microservices would add distributed sagas and operational load with no day-1 benefit.

## Decision
We will ship a **modular monolith**: internal modules `auth, users, listings, photos, likes, feed, deals, payments, delivery, reviews, moderation, notifications, admin`. High-risk modules (`payments, deals, auth, listings(content), reviews, moderation`) follow **hexagonal (ports & adapters)**; CRUD modules stay thin layered.

## Alternatives considered
- **Microservices** — rejected: distributed money transactions, ops overhead, premature for the team/scale.
- **Big-ball-of-mud monolith** — rejected: money + PII need enforced boundaries.

## Consequences
Positive: simple deploy, ACID money paths, clear module seams, future extraction possible.
Negative: cannot scale a single module independently (acceptable; scale API horizontally).
Neutral: dependency rule `core/** !-> infrastructure/**` enforced.

## Verification
`import-linter` contract: `app.core` forbidden from importing `app.infrastructure`; modules communicate via service interfaces; CI fails on violation.
