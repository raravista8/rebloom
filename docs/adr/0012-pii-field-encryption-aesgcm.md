# ADR-0012: PII field encryption at rest with AES-256-GCM (`cryptography`)

Date: 2026-06-04
Status: Accepted

## Context
SECURITY T-10 / A04 require sensitive columns — meeting/pickup **addresses** and exact **geo** — to be encrypted at rest, app-side (AES-256-GCM), on top of managed-Postgres at-rest encryption. This is also the foundation of the address-disclosure gate (T-13, FR-030): an exact pickup address is stored only encrypted and revealed only to the active counterparty after `paid_held`. Python's stdlib has HMAC/SHA but **no AES**, so an authenticated-encryption primitive needs a vetted library. Adding a runtime dependency requires an ADR (CLAUDE.md Hard Rules).

## Decision
Add **`cryptography`** (pyca) and use **AES-256-GCM** via a `FieldCipher` port (`core/crypto/ports.py`) with the adapter in `infrastructure/crypto.py`. The cipher:
- 256-bit key from env `PII_ENC_KEY` (base64 of 32 bytes), held only in the VM `.env` / secret-store (SECURITY §6), rotated 90d (A04).
- a fresh random 96-bit nonce per encryption; the stored token is `base64(nonce ‖ ciphertext ‖ tag)`.
- GCM gives confidentiality **and** integrity — a tampered ciphertext fails to decrypt (raises), so we never return forged plaintext.
- key versioning by a 1-byte prefix on the token, so rotation can decrypt old + encrypt new without a migration.

Only address/geo go through the cipher for now. Phone stays plaintext (it's the login key and is masked in logs); card data never touches us (ЮKassa, ADR-0003).

## Alternatives considered
- **`pycryptodome`** — viable, but `cryptography` is the de-facto pyca standard, better maintained, with a hazmat AESGCM one-liner.
- **Postgres `pgcrypto`** — keeps the key reachable from SQL and ties crypto to the DB; app-side keeps the key out of the DB blast radius (T-10).
- **Fernet (in `cryptography`)** — AES-128-CBC+HMAC; we want AES-256-GCM per SECURITY A04, so use AESGCM directly.
- **No encryption (rely on managed at-rest only)** — rejected: a DB/backup compromise would expose addresses in the clear (T-10 H-impact).

## Consequences
Positive: addresses/geo unreadable in a DB/backup dump; tamper-evident; key out of the DB; rotation without schema change; underpins the T-13 disclosure gate.
Negative: a new native dep (wheels, larger image) + key-management burden (lose the key ⇒ lose the ciphertexts — backup `PII_ENC_KEY` like the Android keystore).
Neutral: `cryptography` is Apache-2.0/BSD (license allowlist OK), pinned in `poetry.lock`, scanned by `pip-audit` in CI.

## Verification
`tests/unit/crypto/test_field_cipher.py`: encrypt→decrypt roundtrip (incl. Cyrillic), distinct nonces per call, tamper → decrypt raises. `tests/integration/test_address_gate.py`: address ciphertext at rest ≠ plaintext; revealed only post-`paid_held` to the counterparty (T-13). `cryptography` pinned in `poetry.lock`; `pip-audit` green.
