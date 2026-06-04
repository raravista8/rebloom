"""Deals & escrow domain — the money core (SECURITY §1, ADR-0003).

Invariants (guardrail: escrow breaks = 0): append-only ledger that never goes
negative and settles to 0 at a terminal state; a state machine with one legal
release path. Effects (ЮKassa, repo) are reached through ports.
"""
