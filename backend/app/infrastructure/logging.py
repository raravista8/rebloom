"""Structured JSON logging with PII redaction at the formatter (SECURITY §8, T-07).

Masking happens here — not at call sites — so phones/emails can never leak into
the log store even if a developer logs them by accident. Card data / secrets are
never logged at all (CLAUDE.md §6).
"""

from __future__ import annotations

import json
import logging
import re

_EMAIL = re.compile(r"[\w.+-]+@[\w-]+\.[\w.-]+")
# Long digit runs with separators — RU phones etc. (over-masks deliberately).
_PHONE = re.compile(r"\+?\d[\d\s()\-]{8,}\d")


def redact(text: str) -> str:
    text = _EMAIL.sub("[EMAIL]", text)
    return _PHONE.sub("[PHONE]", text)


class JsonRedactingFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        payload: dict[str, object] = {
            "ts": self.formatTime(record, "%Y-%m-%dT%H:%M:%S%z"),
            "level": record.levelname,
            "logger": record.name,
            "msg": redact(record.getMessage()),
        }
        request_id = getattr(record, "request_id", None)
        if request_id:
            payload["request_id"] = request_id
        if record.exc_info:
            payload["exc"] = redact(self.formatException(record.exc_info))
        return json.dumps(payload, ensure_ascii=False)


def configure_logging(level: str = "INFO") -> None:
    handler = logging.StreamHandler()
    handler.setFormatter(JsonRedactingFormatter())
    root = logging.getLogger()
    root.handlers = [handler]
    root.setLevel(level.upper())
