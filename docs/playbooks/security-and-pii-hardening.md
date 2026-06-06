# PLAYBOOK — Pre-launch security & PII hardening (small data-handling web product)

> **Why this exists.** A small web product that holds personal data ships to real users
> exactly once unprepared, and the cleanup is expensive. This is the durable, reusable
> pre-launch hardening checklist — driven by a STRIDE-style threat model — for the stack
> family: Next.js/Tailwind front + a vendored design-system package + Playwright visual
> tests + FastAPI/SQLAlchemy + Postgres + Redis + Docker Compose + Caddy on a single VPS,
> scaling out to managed services later.
> **When to read:** before first real-user launch; before touching auth/admin/secrets/
> PII/backups; when wiring a new sensitive column; when standing up a new box.
>
> House rule throughout: **fail-secure**. On any ambiguous error in a money/critical path,
> stay in the safe state (held / denied / not-revealed) — never auto-advance.

---

## 0. Threat-model first (don't skip to the checklist)

Hardening without a threat model is cargo-culting. Spend an hour producing a
**STRIDE-per-interaction** table before the checklist — it's what makes every item below
*justified* instead of superstition. Minimum viable structure (mirror it in `docs/<SECURITY>.md`):

- **Assets & trust boundaries.** Draw the boundaries: edge (TLS/rate-limit), app (private
  net), data (DB/cache/object-store), external providers (payments/SMS/email/etc).
  Threats cluster at boundary crossings — *any external input*, *any data/money access*,
  *any external-service call*.
- **STRIDE rows** (Spoofing/Tampering/Repudiation/Info-disclosure/DoS/Elevation): for each
  interaction, write `vector → outcome → motivation`, a likelihood/impact rating, a
  **specific** mitigation, and a **named verifying control** (a test file, a header check).
  *Rule: every high-impact row must have an automated test.*
- **OWASP Top-10 mapping.** One row per category with "applies? / why / mitigation here /
  owner / how verified". Forces you to confront access-control (A01) and misconfig (A02),
  the two that actually bite small teams.
- **Accepted risks register.** Decisions, not gaps. "Single payment provider — lock-in
  accepted, mitigated by a port." "Redis/PG internal-only auth deferred to scale-out."
  Writing it down stops a future session from "fixing" a deliberate trade-off, and stops
  you pretending a known gap is closed.

The rest of this doc is the *operational residue* of that model — the controls that small
teams most often leave as config-drift, half-wired, or "we'll do it before launch" and
then don't.

---

## 1. Admin surface — RBAC + TOTP 2FA + IP-allowlist, ENFORCED (not config-drift)

The admin/operator surface is the highest-value target (PII, money, user edits). Three
controls, and the failure mode is that one of them is *configured but inert*.

- **RBAC + resource-ownership.** Default-deny routing. Roles (`admin`/`moderator`/
  `support`/read-only-`analyst`) gate actions; object-level ownership checks on every
  resource route (the IDOR guard). The read-only analyst role sees **aggregates only — no
  PII/IP**.
- **TOTP 2FA on by default in code.** `ADMIN_2FA_REQUIRED=true`; do not "temporarily"
  disable on prod for convenience. The 2FA seed itself is a secret at rest — see §3.
- **IP-allowlist that is actually checked.** The classic footgun: `ADMIN_IP_ALLOWLIST` sits
  in `.env` and a dependency *reads it but never compares*. Wire it into the admin
  dependency so it is **enforced**, and document the semantics explicitly:
  - empty allowlist = allow any (the dev default) — make that intentional, not accidental;
  - behind a reverse proxy, take the **leftmost** `X-Forwarded-For` entry as the client IP
    (the proxy appends the real IP first), and only trust that header because traffic can't
    reach the app except through your proxy.
  - It sits **on top of** session + TOTP + RBAC, never instead of.
- **Audit-log every admin action** (actor, target, reason, request-id) to an append-only
  sink. Destructive/PII/money actions require a mandatory `reason` field; money actions
  above a threshold require **4-eyes** (a second admin).

> Verify after wiring: hit an admin route from a non-allowlisted IP and confirm denial;
> confirm a non-2FA session is rejected; confirm the analyst role can't read a PII field.
> An untested allowlist is the same as no allowlist.

---

## 2. Reveal / debug flags on prod — hard-guard, warn loudly, REVERT at launch

Staging boxes routinely need a "reveal the secret so we can test without the real provider
wired" affordance — e.g. logging the plaintext OTP/magic-link when no SMS/email provider
exists yet. This is a foot-cannon if it survives to real users. The pattern that contains it:

- **A single boolean is not enough.** A reveal flag (`*_REVEAL_OTP=true`) must do **nothing
  on its own in prod**. Gate it behind a *second, explicit* prod-acknowledgement
  (`*_REVEAL_OTP_ALLOW_PROD=true`). One stray flag in a real deploy then cannot silently
  leak secrets. Encode this in config, not docs:

  ```python
  @property
  def otp_reveal_active(self) -> bool:
      if self.app_env == "local":
          return True                       # local always reveals
      # prod needs BOTH the reveal flag AND the explicit prod ack
      return self.reveal_otp and (self.app_env != "prod" or self.reveal_otp_allow_prod)
  ```

- **Log a loud WARNING while a reveal is active**, every relevant request — so it can't hide
  in a quiet box. The revealed value's other protections (random, single-use, rate-limited)
  must remain; only its *visibility to log-holders* changes.
- **Keep a "testing-only states LIVE on prod" register** (a section in your ops doc). Any
  affordance you flip on to test against the real box — OTP reveal, demo/seed data, a
  feature flag forced on — goes in this register with a **REVERT-before-real-users** flag.
  At launch, walk the register to zero. Typical entries:
  - reveal flags → remove **both** the flag and its prod-ack;
  - demo/seed data (test users/content) → wipe;
  - any "forced on for the demo" feature flag → reset to its real default.

---

## 3. Encryption-at-rest for sensitive columns + graceful decrypt-on-read migration

Sensitive free-text columns (addresses, geo, 2FA seeds, anything 🔒 in your data model) get
app-side **AES-256-GCM** field encryption *on top of* disk/managed-DB at-rest encryption.
GCM authenticates, so a tampered token fails closed (raises) rather than returning forged
plaintext.

**Field cipher** — a tiny, versioned, self-describing token. Layout
`base64( version(1) ‖ nonce(12) ‖ ciphertext+tag )`, fresh random 96-bit nonce per call,
32-byte key from a base64 env secret:

```python
_VERSION, _NONCE_LEN = b"\x01", 12

class AesGcmCipher:                          # implements a FieldCipher port
    def __init__(self, key: bytes) -> None:
        if len(key) != 32: raise ValueError("key must be 32 bytes (AES-256)")
        self._aes = AESGCM(key)
    def encrypt(self, pt: str) -> str:
        nonce = os.urandom(_NONCE_LEN)
        return base64.b64encode(_VERSION + nonce + self._aes.encrypt(nonce, pt.encode(), None)).decode()
    def decrypt(self, tok: str) -> str:
        raw = base64.b64decode(tok)
        if raw[:1] != _VERSION: raise ValueError("unsupported cipher version")
        return self._aes.decrypt(raw[1:1+_NONCE_LEN], raw[1+_NONCE_LEN:], None).decode()
```

- **Key resolution fails closed in prod.** Missing key in prod → `raise` at startup; only
  a *deterministic, derived* (never random) dev key when the env is unset locally, so dev
  restarts can still decrypt their own rows. The version byte gives you a future key-rotation
  path without re-reading every token blind.

**Graceful decrypt-on-read migration (the part teams get wrong).** When you add encryption
to a column that already holds plaintext (legacy rows, seed data), you cannot flip
read-path to "always decrypt" — old rows will raise. Two non-negotiable steps:

1. **Expand/contract the column first.** Ciphertext (base64) is *longer* than the raw value
   — widen the column in an additive migration (e.g. `64 → 256`) BEFORE writing any
   ciphertext. A pure widen is order-safe against the old running code (it accepts shorter
   values fine), so a rolling deploy / code rollback never needs a schema rollback.
2. **Decrypt-on-read falls back, does not raise.** On read, try to decrypt; on
   `ValueError`/`InvalidTag` (a legacy plaintext row, or an unreadable value), **return it
   as-is and log a warning** — then re-encrypt it on the next write. A real legacy value
   still works downstream; a genuinely corrupt value yields a safe failure (e.g. a bad 2FA
   seed → verify fails closed), not a 500.

   ```python
   try:
       return self._cipher.decrypt(value)
   except (ValueError, InvalidTag):
       _log.warning("field not decryptable; treating as legacy plaintext")
       return value                          # re-encrypted on next set_*()
   ```

> Key rotation = re-encrypt every row (read-old → write-new); plan it, because a leaked key
> means the column is compromised. Store the key off the box (§3 secrets, §5 backups).

---

## 4. Secrets discipline

- **Secrets live ONLY** in the VM's `.env` (mode `0600`, owned by the deploy user) or a
  secret store — **never in git**. Commit `.env.example` with empty values + inline notes;
  real `.env` is `.gitignore`'d.
- **No secrets in code defaults, logs, error messages, or LLM prompts.** A "dev-insecure"
  default for a signing key is fine *only* if prod resolution fails closed when it's unset.
- **Scan and keep scanning.** `gitleaks` + a baseline-tracking secret scanner in pre-commit
  AND in CI. After any suspected leak, run `gitleaks` over the **full history**, not just
  the working tree.
- **Generation recipes belong next to the var** in `.env.example`, e.g.:
  ```bash
  # 32-byte base64 field-encryption key:
  python3 -c "import os,base64; print(base64.b64encode(os.urandom(32)).decode())"
  openssl rand -base64 32     # session/signing secret
  openssl rand -base64 48     # backup encryption passphrase
  ```
- **Rotation:** provider API/webhook keys ~90 days; immediate revoke on incident. Keep a
  short rotation runbook (which secret invalidates what — see §7).
- **Client-side secrets don't exist.** OAuth client secrets / PKCE verifiers never touch the
  browser (backend-mediated flow); `state` is single-use server-side; `redirect_uri` is on a
  server allowlist. A `NEXT_PUBLIC_*` var is *baked into the web bundle at build time* — only
  put non-secret values (analytics IDs) there, and remember it requires a **rebuild** to change.

---

## 5. SSH hardening (and the lockout caveat)

Order matters; the failure mode is locking yourself out of your only box.

- **Key-only auth.** `PasswordAuthentication no` + `KbdInteractiveAuthentication no`. Back up
  the old sshd config first (`/etc/ssh/sshd_config.bak.<ts>`).
- **`fail2ban`** with the sshd jail active; put your own admin IP in `ignoreip` so a fat-
  fingered key never bans you.
- **No-root / non-root deploy user is the goal, but it's the highest-lockout-risk step** —
  defer it if root is already key-only + fail2ban'd, and track it as an *open* item rather
  than pretending it's done. When you do switch to a `deploy` user, remember to flip any
  systemd unit `User=root` → `deploy` (and put `deploy` in the `docker` group).
- **NON-NEGOTIABLE: verify a fresh connection in a second terminal BEFORE disconnecting the
  one that made the change.** If the new session authenticates, you're safe; if not, you
  still have the open session to revert. Never apply an sshd change and close your only door.
- **Firewall:** allow `22, 80, 443` and nothing else. Internal services (DB/cache/app) ride
  the private/compose network and are never published to the host — see §6.

---

## 6. The Docker-DNAT firewall-bypass footgun

Docker installs its own iptables DNAT rules that are evaluated **before** a host firewall
like `ufw` — so a compose `ports: ["5432:5432"]` publishes Postgres to the **public**
internet even though `ufw` "denies" 5432. This is the single most common way a small team
silently exposes its database.

- **Dev/CI compose: bind every published port to loopback** — `127.0.0.1:5432:5432`,
  `127.0.0.1:6379:6379`, etc. You still connect via `127.0.0.1`, but the port is unreachable
  from off-box regardless of the host firewall.
- **Prod compose: publish NO host ports at all** for data/app services. Only the edge proxy
  (Caddy) binds `80/443`; everything else talks over the internal compose network.
- Verify from *another machine*: `nc -vz <vps-ip> 5432` must refuse/time out.

---

## 7. Off-box encrypted backups + the quarterly RESTORE DRILL

> **Money/PII live on the box → off-box encrypted backups are mandatory, and an untested
> backup is not a backup.**

- **Pipeline:** `pg_dump` (inside the DB container) → `gzip -9` → `openssl aes-256` → push
  to an **off-box** object store on a **different provider/region** from the VPS → prune
  older than a retention window. Nothing sensitive persists on local disk (write to `/tmp`,
  upload, `rm`).
- **Scheduling:** a **systemd timer** beats host-cron — `OnCalendar=daily` + `Persistent=true`
  fires a catch-up run after downtime instead of silently skipping a missed tick;
  `RandomizedDelaySec` spreads load. (If you migrate from cron, delete the cron line so they
  don't double-run.)
- **The encryption key (`BACKUP_ENC_KEY`) is unrecoverable if lost** — every artifact is
  encrypted with it. Keep a copy **off the server** (password manager), exactly like a mobile
  signing keystore. The backup object-store credential should be a **dedicated least-privilege
  key scoped to the backup bucket only**, in the deploy user's config (off-git).
- **The restore drill is the whole point. Quarterly, non-negotiable.** Build the restore
  script so a drill **cannot** clobber prod: default target is a **throwaway** DB
  (`*_verify`), and it **refuses** to target the live DB without an explicit
  `--i-understand-this-overwrites-prod` flag (which then demands you type the live DB name).
  - **Compare row counts** of core tables (and especially the money/ledger source-of-truth
    table) restored-vs-live. A backup that *loads but is short on rows* is a silent failure —
    the restored counts should equal prod **as of the dump timestamp** (≤ current prod).
  - Drop the throwaway DB when done.
  - For a real disaster-recovery overwrite, after the restore **verify the money ledger
    reconciles** before resuming any payouts.
- **What's NOT in a DB dump:** uploaded files/photos live in a separate volume — either add
  them to the off-box sync (`rclone sync`) or explicitly accept re-upload-on-loss for MVP.
  Legally-required financial data is retained by law — never purge those backups without
  sign-off.

> Until the owner supplies the off-box remote + keys, the timer can be installed but the job
> exits non-zero — i.e. **NO working backups yet**. Track that as an *open, owner-blocked*
> item, not "backups done".

---

## 8. PII redaction at the log formatter (not at call sites)

- Mask PII (`[PHONE]`, `[EMAIL]`, `[ADDRESS]`) in the **log formatter**, centrally — never
  rely on every `log.info` call to remember. A call-site approach leaks the first time
  someone forgets.
- Structured JSON logs + a correlation/request id. Never log card data, secrets, full
  provider payloads, or raw PII; no stack traces to clients.
- Send **nothing un-masked to an LLM** — tag user content (`<user_content>`) and treat model
  output as untrusted (never execute it; fail-closed to manual review).
- A dedicated, longer-retention **audit sink** for security events (auth, privilege changes,
  payouts/refunds, moderation, admin actions, data exports) separate from app logs.

---

## 9. Edge & misconfig (A02)

- **Security headers at the edge** (one global proxy block, applied to web + api uniformly):
  HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`,
  `X-Frame-Options: SAMEORIGIN`, strip `Server`/`X-Powered-By`.
- **CSP ships Report-Only first** (logs violations, blocks nothing); enforce only after you
  confirm zero real violations in browser consoles, then tighten `script-src` (drop
  `'unsafe-inline'` via nonce/hash). Verify served headers with a real request
  (`curl -skI https://<domain>/ | grep -i 'content-security\|x-frame\|x-powered'`).
- **Edge config bind-mount gotcha:** if the proxy config is a single-file bind mount, a
  `git pull` replaces it via rename → new inode → the running container keeps the **old**
  inode, so an in-place `reload` re-reads the stale file. After a config change you must
  recreate the container (`up -d --force-recreate <proxy>`), not just reload.
- No debug mode in prod; `extra='forbid'` on all request/config schemas (reject unknown
  fields); validate webhook signatures + source-IP allowlist + **re-fetch status from the
  provider** before any state change; idempotent webhook processing by provider id.

---

## 10. Fail-secure money/critical paths

- On any payment/payout/provider error or ambiguous response, the resource **stays in the
  safe held/denied state** — never auto-release/refund/advance on a timeout.
- No release/refund without a state-machine transition + idempotency key + audit entry.
- Money is **integer minor units** (kopecks/cents), never float; the release path is a single
  DB transaction with row locks (`SELECT … FOR UPDATE`) so a retried webhook + a concurrent
  confirm release **exactly once**.
- Daily reconciliation of the append-only ledger vs the provider balance; non-zero drift →
  freeze payouts + incident.

---

## 11. Data-breach runbook (TEMPLATE — neutralize the specific regulator)

Keep this as `docs/runbooks/data-breach.md`. Substitute `<REGULATOR>` and the legal windows
for your jurisdiction (e.g. GDPR = 72h to the supervisory authority; many regimes also
require an initial notice within ~24h — **confirm with counsel and fill the real windows**).

> **When it's an incident:** unauthorized DB/backup/`.env` access; a leaked dump or disk
> snapshot; compromised admin or SSH/root; a secret in a public place (git/log/CI); an
> `AUDIT_LOG` anomaly (mass PII export, access from an unexpected geo/IP); any
> confirmed/credible leak. **When in doubt, treat it as an incident.**

1. **First 60 min — CONTAINMENT** (keep a timestamped UTC action journal — you need it for
   the notice + post-mortem):
   - **Freeze money/critical paths** (fail-secure — nothing releases/refunds).
   - **Revoke all sessions** (flush the session store) → everyone re-authenticates.
   - **Cut the vector:** leaked secret → rotate (§ below); compromised SSH/box → rotate SSH
     keys, `firewall default deny`, check `last`/`authorized_keys`, bring up an isolated
     snapshot replica; leaked backup → rotate `BACKUP_ENC_KEY` + close remote access;
     compromised admin → block the account, reset its 2FA, review its audit trail.
   - **Preserve evidence BEFORE changing anything:** copy logs, the append-only audit log,
     and a current DB snapshot to isolated storage. Don't overwrite.
   - **Scope it:** which tables/fields/rows, how many subjects, exactly which PII. *If the
     sensitive columns were field-encrypted (§3) and the field key did NOT leak, they stay
     unreadable — downgrade severity; if the key leaked, treat them as disclosed.*
2. **Notify `<REGULATOR>` + subjects** within the legal window `[verify with counsel]`:
   what happened, probable cause, harm, which PII + how many subjects, measures taken; a
   follow-up notice with investigation results; notify affected users (push/email) without
   echoing specific data, with guidance. Log everything to the audit sink + incident journal.
   *Pre-fill the responsible-person + regulator contact + notice template now, not mid-fire.*
3. **Rotate secrets/keys** by what's affected (recreate the relevant services after):
   session/signing key (invalidates sessions), field-encryption key (⚠️ requires
   re-encrypting existing rows — and means that data is compromised if it leaked), DB/cache
   passwords, backup key, every provider key (revoke in their console first), SSH/deploy keys
   (+ CI secrets). Re-run `gitleaks` to confirm nothing's in git.
4. **Recover** from the off-box encrypted backup, verify integrity (audit/ledger reconcile),
   apply the patch that closes the vector, re-run the security check + header/firewall
   verification, then lift the incident only once the vector is confirmed closed and data is
   intact.
5. **Post-mortem within a week** (blameless): timeline, root cause, what worked/didn't, what
   changes (control/alert/test), notification status. File remediation tasks; update this
   runbook with what you learned.
6. **Prevention (keep green or the incident costs more):** at-rest disk/DB encryption,
   scheduled off-box encrypted backups + tested restore, alerts on failed-login spikes / PII-
   export anomalies / webhook-signature failures, admin 2FA + IP-allowlist, SSH
   key-only/no-root/fail2ban, retention jobs purging IP/sessions, reveal flags off on prod.

---

## 12. "Deferred to scale-out" — the accepted-risk pattern

On a single box, some controls are genuine *accepted risk*, not negligence — write them down
as such so they're a deliberate trade-off with a trigger, not a forgotten gap:

- **Internal-only datastore auth** (cache `requirepass`, DB TLS) — accepted while the
  datastores are *internal-only* (not internet-exposed; dev ports loopback-bound per §6).
  **Trigger to revisit: when they move to managed/multi-host.**
- **Disk-at-rest encryption** — single-box plain filesystem is unencrypted at rest; mitigated
  by field-encryption on the most sensitive columns (§3). Trigger: LUKS, or move Postgres to
  a managed provider (which encrypts at rest + gives HA/PITR).
- **HA / read-replica / CDN** — single box trades availability for cost at MVP SLO; each is a
  config-only swap later (point a DSN at the managed service), no `core/**` rewrite, because
  external effects sit behind ports/adapters.

The discipline: an accepted risk has a **named trigger** for when it stops being acceptable.
Without the trigger it's just an excuse.

---

## 13. Copy-pasteable LAUNCH CHECKLIST

```
THREAT MODEL
[ ] STRIDE-per-interaction table exists; every high-impact row has an automated test
[ ] OWASP Top-10 mapping filled; accepted-risks register written with triggers

ADMIN SURFACE
[ ] RBAC default-deny + object-ownership checks on every resource route (IDOR tested)
[ ] TOTP 2FA required on prod (not disabled "temporarily")
[ ] IP-allowlist ENFORCED in the admin dependency (tested from a non-allowlisted IP)
[ ] read-only analyst role cannot read PII/IP (tested)
[ ] every admin action audit-logged (actor/target/reason/request-id); 4-eyes on big money

REVEAL / DEBUG FLAGS
[ ] reveal flags require an explicit prod-ack (single bool does nothing in prod)
[ ] loud WARNING logs while any reveal is active
[ ] "testing-only states live on prod" register walked to ZERO (reveal off, seed/demo wiped)

ENCRYPTION AT REST
[ ] sensitive columns AES-256-GCM field-encrypted; key fails closed in prod, off-box copy
[ ] column widened (expand/contract) before writing ciphertext
[ ] decrypt-on-read falls back on legacy plaintext (warns, re-encrypts) — does NOT raise

SECRETS
[ ] all secrets only in VM .env (0600) / secret store; .env.example committed, real .env ignored
[ ] gitleaks in pre-commit AND CI; full-history scan clean
[ ] no secrets in code defaults/logs/errors/LLM prompts; client carries no secrets
[ ] rotation plan documented (which secret invalidates what)

SSH / NETWORK
[ ] key-only auth (password + keyboard-interactive off); fail2ban with own IP in ignoreip
[ ] fresh SSH connection verified BEFORE closing the session that changed sshd
[ ] firewall allows only 22/80/443
[ ] dev/CI compose ports bound to 127.0.0.1; prod publishes NO data/app host ports
[ ] verified from another machine: DB/cache ports refuse off-box (Docker-DNAT bypass closed)

BACKUPS
[ ] off-box encrypted backup to a DIFFERENT provider/region; key stored off the box
[ ] scheduled via systemd timer (daily, Persistent=true catch-up)
[ ] QUARTERLY restore drill run: restore into throwaway DB, row-counts vs prod match
[ ] restore script refuses to overwrite live without an explicit flag
[ ] files/photos volume durability decided (off-box sync OR accept re-upload-on-loss)

LOGGING / EDGE / MONEY
[ ] PII redaction at the log formatter; separate audit sink; no PII to LLM un-masked
[ ] security headers at edge; CSP Report-Only → verified zero violations before enforce
[ ] webhooks: signature + IP allowlist + re-fetch status + idempotent
[ ] money paths fail-secure (held on ambiguity), integer minor units, row-locked single tx
[ ] daily ledger reconciliation green

RUNBOOK
[ ] data-breach runbook filled with the REAL regulator + legal windows + responsible person
```
