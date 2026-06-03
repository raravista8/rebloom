# ADR-0007: Authentication — passwordless phone + SMS OTP, server-side sessions
Date: 2026-06-03
Status: Proposed

## Context
RF marketplace audience expects phone-login, not email/password. Money app needs instantly revocable sessions and strong abuse controls. TG channel needs identity linked to a verified account.

## Decision
We will authenticate via **phone number + 6-digit SMS OTP** (passwordless). Sessions are **opaque server-side tokens in Redis** (short TTL + refresh, revocable), cookie `HttpOnly; Secure; SameSite=Lax`; mobile uses secure storage. Admin uses additional **TOTP 2FA**. Telegram id links only to an OTP-verified account.

## Alternatives considered
- **Long-lived JWT** — rejected: hard to revoke promptly for a money app.
- **External IdP (Auth0/Clerk)** — rejected: PII residency (ФЗ-152) + cost + RF availability.
- **Email/password** — rejected: poor fit for audience, weaker UX.

## Consequences
Positive: low-friction RU UX, revocable sessions, strong lockout controls.
Negative: SMS cost + deliverability dependency (mitigated by rate-limits, retries, provider fallback).
Neutral: OTP policy centralized in `core/auth`.

## Verification
`test_otp_bruteforce.py`, session-revocation test, admin-2FA test green; OTP rate-limit/lockout enforced (FR-001..003).
