"""Finance summary derived from the append-only ledger (ADMIN_BACKEND_TZ §API,
FR-070, SECURITY T-17). The ledger is the single source of truth for money —
this never writes, only aggregates, so reports can't be tampered with."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Protocol


class FinanceRepo(Protocol):
    def ledger_totals(self, since: str | None, until: str | None) -> dict[str, int]:
        """Sum of ``amount_kopecks`` per ledger kind in the window (kind → sum)."""
        ...

    def deals_by_status(self, since: str | None, until: str | None) -> dict[str, int]:
        """Deal counts per status for deals created in the window."""
        ...


@dataclass(frozen=True, slots=True)
class FinanceSummary:
    gmv_kopecks: int  # total turnover paid into escrow (sum of holds)
    commission_kopecks: int  # platform revenue realized on release
    payout_kopecks: int  # paid out to sellers
    refund_kopecks: int  # returned to buyers
    held_kopecks: int  # current escrow balance (must be ≥ 0)
    deals_by_status: dict[str, int]

    def to_api(self) -> dict[str, Any]:
        return {
            "gmv_kopecks": self.gmv_kopecks,
            "commission_kopecks": self.commission_kopecks,
            "payout_kopecks": self.payout_kopecks,
            "refund_kopecks": self.refund_kopecks,
            "held_kopecks": self.held_kopecks,
            "deals_by_status": self.deals_by_status,
        }


class FinanceService:
    def __init__(self, repo: FinanceRepo) -> None:
        self._repo = repo

    def summary(self, since: str | None = None, until: str | None = None) -> FinanceSummary:
        totals = self._repo.ledger_totals(since, until)
        gmv = totals.get("hold", 0)
        commission = totals.get("commission", 0)
        payout = totals.get("payout", 0)
        refund = totals.get("refund", 0)
        # Escrow identity: what entered minus everything that left is still held.
        held = gmv - commission - payout - refund
        return FinanceSummary(
            gmv_kopecks=gmv,
            commission_kopecks=commission,
            payout_kopecks=payout,
            refund_kopecks=refund,
            held_kopecks=held,
            deals_by_status=self._repo.deals_by_status(since, until),
        )
