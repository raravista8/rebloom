# ADR-0003: Payments — ЮKassa «Безопасная сделка» + Сплит + СБП (escrow, FunPay-style)
Date: 2026-06-03
Status: Proposed

## Context
Platform holds buyer funds in escrow and pays out to **any individual seller** (FunPay model), with platform commission and 54-ФЗ receipts. Card data must never touch our backend (minimize PCI scope). RF jurisdiction (ФЗ-115 AML/KYC on provider side). Operator asked to compare providers.

## Decision
We will use **ЮKassa**: «Безопасная сделка» (escrow hold/release for C2C) + Сплитование (commission split) + СБП (low-fee acceptance) + онлайн-касса (54-ФЗ). Payouts to seller card / ЮMoney. Provider tokenizes cards. We integrate behind a `PaymentProvider` port.

## Alternatives considered
- **CloudPayments** — rejected as primary: best native mobile SDK but higher fees (~3.5%) and no equivalent C2C escrow product; kept as future native-payment-sheet fallback.
- **Т-Касса (Т-Банк)** — viable; kept as secondary acquirer behind the same port for redundancy.
- **PayAnyWay / Mandarin / Paygine** — specialized marketplace split/escrow but smaller ecosystem & integrations; rejected for MVP.

## Consequences
Positive: purpose-built C2C escrow, payouts to physical persons & self-employed, 54-ФЗ handled, #1 RF reach, СБП cheap. [verify: «Безопасная сделка» commission up to ~4.5%].
Negative: single-provider lock-in (mitigated by port); ~4.5% on escrow flow.
Neutral: webhooks must be signature-verified + idempotent (see SECURITY T-02/T-03).

## Verification
`PaymentProvider` Protocol in `core/payments/ports.py`; ЮKassa adapter in `infrastructure/yookassa.py`; `test_webhook_signature.py` + `test_double_release_race.py` green; no card fields in any schema/log.
