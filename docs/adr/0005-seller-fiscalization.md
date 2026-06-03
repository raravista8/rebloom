# ADR-0005: Seller = any individual; optional self-employed (самозанятый) onboarding
Date: 2026-06-03
Status: Proposed

## Context
FunPay-style: any individual sells received bouquets (personal property). RF tax: sale of personal property by individuals is generally not НДФЛ-taxable; platform commission is the platform's taxable revenue. 54-ФЗ receipts arise when the platform acts as payment agent. Frequent/high-volume sellers may need self-employed status.

## Decision
We will onboard sellers as **plain individuals** by default; ЮKassa «Безопасная сделка» issues the buyer-facing fiscal receipt as needed. We will **offer optional самозанятость linkage** (auto income registration via provider/ФНС) for sellers exceeding a volume/frequency threshold, surfaced as a prompt, not a barrier.

## Alternatives considered
- **Mandatory self-employed for all sellers** — rejected: kills the casual "sold my gifted bouquet" funnel (PRD Persona 1).
- **No fiscalization at all** — rejected: platform-as-payment-agent triggers 54-ФЗ.

## Consequences
Positive: lowest friction onboarding; compliant receipts via provider.
Negative: legal nuance around personal-property resale must be confirmed. [verify: налоговая квалификация перепродажи б/у имущества физлицами; пороги самозанятости].
Neutral: threshold + prompt configurable.

## KYC / ФЗ-115
High-value/frequent payouts trigger provider-side KYC; suspicious payout patterns feed fraud (SECURITY T-18). Thresholds `[verify]`.

## Verification
Receipt issued on `released` (test asserts `fiscal_receipt_id` set); self-employed prompt fires past threshold; legal sign-off recorded in `docs/legal/`.
