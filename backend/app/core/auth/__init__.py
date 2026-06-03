"""Authentication domain — phone+OTP login, sessions (ADR-0007, SECURITY §5).

Hexagonal: effects (SMS, OTP store, sessions) are reached through ``ports``
(``typing.Protocol``); this package never imports ``app.infrastructure``.
"""
