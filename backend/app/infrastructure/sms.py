"""SMS sender adapter (SmsSender port).

Local/dev uses :class:`ConsoleSmsSender` (logs masked; reveals the code only when
``reveal_code`` is set, i.e. APP_ENV=local). A real RF provider (SMS.ru / MTS
Exolve) adapter is added when credentials exist (ARCHITECTURE §8).
"""

from __future__ import annotations

import logging

from app.core.auth.schemas import mask_phone

logger = logging.getLogger("rebloom.sms")


class ConsoleSmsSender:
    def __init__(self, *, reveal_code: bool = False) -> None:
        self._reveal = reveal_code

    def send_code(self, phone: str, code: str) -> None:
        if self._reveal:
            logger.info("DEV SMS → %s: code=%s", mask_phone(phone), code)
        else:
            logger.info("SMS OTP sent → %s", mask_phone(phone))
