# ADR-0008: Hybrid delivery — self-pickup default + integrated Яндекс Доставка
Date: 2026-06-03
Status: Proposed

## Context
Flowers are perishable + hyper-local (same-day). Operator chose hybrid: self-pickup default + optional integrated courier. Address PII must not leak before payment.

## Decision
We will support **self-pickup** (deal chat + on-demand coarse→exact geo gated by `paid_held`) and **optional courier** via **Яндекс Доставка API** (claim creation + tracking) behind a `DeliveryProvider` port. Courier failure keeps the deal `paid_held` and offers pickup/cancel (FR-032).

## Alternatives considered
- **Self-pickup only** — rejected: limits liquidity for perishable goods.
- **Integrated courier only** — rejected: cost + over-engineering for casual sales.
- **Own courier fleet** — rejected: out of scope.

## Consequences
Positive: flexibility, same-day option, PII-safe address gating.
Negative: external dependency on Яндекс Доставка (availability/coverage). [verify: API, coverage of all 10 cities, pricing].
Neutral: provider swappable via port.

## Verification
`DeliveryProvider` Protocol + adapter; `test_address_disclosure_gate.py` (no exact address pre-payment); claim-failure fallback test (FR-032).
