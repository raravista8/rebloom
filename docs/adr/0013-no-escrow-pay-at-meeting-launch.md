# ADR-0013: Launch without escrow — «оплата при встрече» (no online payments at MVP)

Date: 2026-06-05
Status: Accepted (supersedes the escrow-at-launch parts of ADR-0003, ADR-0005, ADR-0010 for the MVP)

## Context
ADR-0003 put escrow (ЮKassa «Безопасная сделка») at the centre of the product: the platform held buyer
funds and released them to the seller minus commission. That carries the heaviest launch cost and risk —
payment-provider onboarding/KYC, 54-ФЗ fiscalization through an agent, ФЗ-115 AML, PCI scope, a money
ledger, payouts, refunds, chargebacks, and the entire escrow-integrity threat surface (SECURITY T-02/T-03).
For a cold-start C2C board the binding constraint is **liquidity (supply + first deals)**, not payment
sophistication. Holding money also makes us a payment agent with the compliance weight that implies.

The product decision (owner + Claude Design canon **0.5.0**, `HANDOFF_0.5.0_no-online-payment.md`): **launch
without escrow and without online payments.** People agree in chat and pay **at the meeting** (cash /
direct transfer), like a classified-ads board. The platform never touches, holds, or returns money.

## Decision
1. **No money flows through the platform at MVP.** Remove escrow, acquiring, payouts, commission, refunds,
   chargebacks, and the ЮKassa webhook from the product surface (API + UI).
2. **New deal state machine:** `agreed → meeting → done` (+ `problem`, `cancelled`). The platform records
   an agreement and a pickup hand-off, not a payment.
   - `POST /api/deals {listing_id, delivery_method}` → `agreed`, opens the deal chat («Написать продавцу»).
   - `POST /api/deals/{id}/share-point` (seller) → `meeting`; exact pickup address revealed to the buyer.
   - `POST /api/deals/{id}/confirm-receipt` (buyer) → `done`; mutual reviews open.
   - `POST /api/deals/{id}/report {reason, photo_ids[]}` → `problem` (replaces `/dispute`).
   - `POST /api/deals/{id}/cancel {reason?}` → `cancelled`; listing → `active`.
   - `POST /api/account/transfer-details {card_last4?, phone?}` — seller's payout details for the **direct**
     P2P transfer (informational only; not processed by us).
3. **Trust without money:** pay-at-meeting (no prepayment to lose) · pickup-only nearby · real reviews &
   rating · verified login (OTP/OAuth) · content moderation · reports. Conflicts become **reports**
   (support/moderation warns/limits/blocks a party or takes the listing down) — support never moves money.
4. **Payment code stays in-repo but DORMANT, not deleted.** `core/payments/`, `core/deals/ledger.py`,
   `infrastructure/yookassa.py` and their unit tests remain green but are **decoupled from the launch
   flow**: the deal service never calls them, and the payment/webhook routes are **not registered**. They
   are the basis for re-enablement, not dead weight. Rationale: reversible, preserves ~10 tested
   protected-path tasks, and matches «монетизация — отдельный ADR post-MVP».
5. **Admin finance/analytics** are recomputed from deals, not the ledger: `deal_turnover_kopecks`
   (estimate over `done` deals at listing price) + `deals_by_status{}` + average ticket. No GMV/commission
   KPI. Cancelling/stopping a deal is a status change with audit, **no 4-eyes** (no money moves).
6. **Compliance scope shrinks at MVP:** no PCI (no card data ever), no 54-ФЗ-through-agent, no ФЗ-115 AML —
   these return with monetization. ФЗ-152 (PII) is unchanged and still fully in scope.

## Alternatives considered
- **Keep escrow at launch (ADR-0003 as-is)** — rejected for MVP: maximal compliance/integration cost and
  risk for a product whose first problem is liquidity, not payment trust. Re-evaluated at monetization.
- **Hard-delete all payment code** — rejected: destroys tested, audited money modules the monetization
  ADR will rebuild from; dormant-and-flagged is reversible at near-zero carrying cost.
- **Platform-processed payment without hold (instant pass-through)** — still makes us a payment agent
  (54-ФЗ/115-ФЗ/PCI) without the escrow safety; no net benefit over pay-at-meeting for MVP.

## Consequences
Positive: far smaller launch surface (no acquiring/KYC/fiscalization/PCI), no escrow-integrity threat class
to defend (T-02/T-03 out of MVP scope), faster path to first real deals; the residual money-loss risk is
borne P2P at the meeting (no prepayment), mitigated by reviews/rating/moderation/reports.
Negative: no platform payment guarantee — a buyer can be no-showed or a seller stiffed at the meeting; we
mitigate with reputation + reports, not refunds. **No commission revenue at MVP** — monetization is a
separate ADR (paid promotion/featured listings/commission), which re-enables the dormant payment path.
Neutral: `delivery_method` stays `self_pickup` (courier deferred, ADR-0008); the `price_kopecks` on a deal
is the listing's reference price, not a charge.

## Verification
`tests/unit/deals/test_deal_state_machine.py` rewritten for `agreed→meeting→done/problem/cancelled` (legal
transitions only; no payment hooks). `tests/integration/test_deal_flow_no_escrow.py`: create→agreed opens
chat; share-point reveals address only after agreement (T-13 preserved); confirm-receipt→done opens reviews;
report→problem; cancel→cancelled frees the listing. Dormant payment modules keep their own unit tests green.
Alembic data migration maps legacy statuses (`created→agreed, paid_held→meeting, released→done,
disputed→problem, refunded→cancelled, cancelled→cancelled`). `API_CONTRACT.md` updated; `make typecheck lint test` green.
