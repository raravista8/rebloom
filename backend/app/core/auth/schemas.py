"""Auth request schemas + phone normalization.

Phone is normalized to RU E.164 (``+7XXXXXXXXXX``) so every store/key/lookup is
canonical. We never echo a raw phone back unmasked.
"""

from __future__ import annotations

import re

from pydantic import BaseModel, ConfigDict, Field

_NON_DIGIT = re.compile(r"\D")


def normalize_phone(raw: str) -> str | None:
    """Return canonical ``+7XXXXXXXXXX`` or ``None`` if not a plausible RU number."""
    digits = _NON_DIGIT.sub("", raw)
    if len(digits) == 11 and digits[0] == "8":
        digits = "7" + digits[1:]
    if len(digits) == 11 and digits[0] == "7":
        return "+" + digits
    if len(digits) == 10 and digits[0] == "9":
        return "+7" + digits
    return None


def mask_phone(phone: str) -> str:
    """``+79161234567`` → ``+7•••••••67`` (last 2 kept) for logs/UI (T-07)."""
    if len(phone) < 4:
        return "•" * len(phone)
    return phone[:2] + "•" * (len(phone) - 4) + phone[-2:]


class OtpRequestIn(BaseModel):
    model_config = ConfigDict(extra="forbid")
    phone: str = Field(min_length=5, max_length=20)


class OtpVerifyIn(BaseModel):
    model_config = ConfigDict(extra="forbid")
    phone: str = Field(min_length=5, max_length=20)
    code: str = Field(min_length=4, max_length=8)
