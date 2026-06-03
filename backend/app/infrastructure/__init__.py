"""Infrastructure adapters — the only place external effects live.

Postgres, Redis, object storage, ЮKassa, Яндекс Доставка, SMS, logging.
Adapters implement ``ports`` (``typing.Protocol``) defined inside ``app.core``;
``app.core`` must never import this package (import-linter enforced).
"""
