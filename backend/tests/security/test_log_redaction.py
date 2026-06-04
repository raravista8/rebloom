"""SECURITY T-07 / A09 — PII is masked at the log formatter, not call sites."""

from __future__ import annotations

import json
import logging

import pytest
from app.infrastructure.logging import JsonRedactingFormatter, redact

pytestmark = pytest.mark.security


def test_redact_masks_phone_and_email() -> None:
    assert "[PHONE]" in redact("call +7 916 123 45 67 now")
    assert "[EMAIL]" in redact("write ivan.petrov@example.com please")
    assert "9161234567" not in redact("phone 89161234567")


def test_formatter_emits_masked_json() -> None:
    record = logging.LogRecord(
        "rebloom.test", logging.INFO, __file__, 1, "user +79161234567 / a@b.com", None, None
    )
    out = json.loads(JsonRedactingFormatter().format(record))
    assert out["level"] == "INFO"
    assert out["logger"] == "rebloom.test"
    assert "[PHONE]" in out["msg"] and "[EMAIL]" in out["msg"]
    assert "79161234567" not in out["msg"] and "a@b.com" not in out["msg"]


def test_formatter_carries_request_id() -> None:
    record = logging.LogRecord("x", logging.WARNING, __file__, 1, "hello", None, None)
    record.request_id = "req-abc"  # type: ignore[attr-defined]
    out = json.loads(JsonRedactingFormatter().format(record))
    assert out["request_id"] == "req-abc"
