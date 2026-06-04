"""SECURITY T-02 — ЮKassa webhook: signature + IP + re-fetch + idempotency."""

from __future__ import annotations

import json
from collections.abc import Iterator

import pytest
from app.api.deals import get_deal_service
from app.api.webhooks.yookassa import WebhookConfig, get_webhook_config
from app.core.deals.ledger import LedgerEntry, escrow_balance
from app.core.deals.service import DealService
from app.core.payments.webhook import sign
from app.main import create_app
from fastapi import FastAPI
from fastapi.testclient import TestClient

from tests.fakes import FakeDealRepository, FakeListingReader, FakePaymentProvider

pytestmark = pytest.mark.security

SECRET = "whsec_test"


@pytest.fixture
def ctx() -> Iterator[tuple[TestClient, FakeDealRepository, FakePaymentProvider, str]]:
    app: FastAPI = create_app()
    deals, listings, payments = FakeDealRepository(), FakeListingReader(), FakePaymentProvider()
    service = DealService(deals, listings, payments, 1000)
    listings.seed("L", "seller", price=100_000, status="active")
    deal, _url = service.create_deal("buyer", "L", "self_pickup").value  # type: ignore[union-attr]
    app.dependency_overrides[get_deal_service] = lambda: service
    app.dependency_overrides[get_webhook_config] = lambda: WebhookConfig(SECRET, ())
    yield TestClient(app), deals, payments, deal.id


def _post(client: TestClient, yk_payment_id: str, secret: str | None = SECRET) -> object:
    body = json.dumps(
        {"event": "payment.succeeded", "object": {"id": yk_payment_id, "status": "succeeded"}}
    ).encode()
    headers = {"Content-Type": "application/json"}
    if secret is not None:
        headers["X-Webhook-Signature"] = sign(body, secret)
    return client.post("/api/webhooks/yookassa", content=body, headers=headers)


def _balance(deals: FakeDealRepository, deal_id: str) -> int:
    return escrow_balance([LedgerEntry(deal_id, k, a) for k, a in deals.ledger(deal_id)])


def test_valid_signature_marks_paid(
    ctx: tuple[TestClient, FakeDealRepository, FakePaymentProvider, str],
) -> None:
    client, deals, _pay, deal_id = ctx
    resp = _post(client, f"yk_{deal_id}")
    assert resp.status_code == 200
    assert deals.get(deal_id).status == "paid_held"  # type: ignore[union-attr]
    assert _balance(deals, deal_id) == 100_000


def test_bad_signature_is_rejected(
    ctx: tuple[TestClient, FakeDealRepository, FakePaymentProvider, str],
) -> None:
    client, deals, _pay, deal_id = ctx
    resp = _post(client, f"yk_{deal_id}", secret="wrong")
    assert resp.status_code == 401
    assert deals.get(deal_id).status == "created"  # not moved


def test_replay_is_idempotent(
    ctx: tuple[TestClient, FakeDealRepository, FakePaymentProvider, str],
) -> None:
    client, deals, _pay, deal_id = ctx
    _post(client, f"yk_{deal_id}")
    _post(client, f"yk_{deal_id}")  # replayed
    assert deals.get(deal_id).status == "paid_held"
    assert _balance(deals, deal_id) == 100_000  # single hold, not doubled


def test_ambiguous_status_stays_held_secure(
    ctx: tuple[TestClient, FakeDealRepository, FakePaymentProvider, str],
) -> None:
    client, deals, pay, deal_id = ctx
    pay.status = "pending"  # re-fetch says not succeeded → never flip (A10)
    resp = _post(client, f"yk_{deal_id}")
    assert resp.status_code == 200
    assert deals.get(deal_id).status == "created"


def test_non_allowlisted_ip_rejected() -> None:
    app = create_app()
    deals, listings, payments = FakeDealRepository(), FakeListingReader(), FakePaymentProvider()
    app.dependency_overrides[get_deal_service] = lambda: DealService(
        deals, listings, payments, 1000
    )
    app.dependency_overrides[get_webhook_config] = lambda: WebhookConfig("", ("203.0.113.1",))
    resp = TestClient(app).post("/api/webhooks/yookassa", content=b"{}")
    assert resp.status_code == 403  # TestClient host is not allowlisted
