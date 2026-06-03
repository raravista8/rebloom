"""Domain core — pure business logic.

**NEVER import ``app.infrastructure``** from here (enforced by import-linter,
see ``.importlinter`` and ADR-0002). External effects are reached through
``ports`` (``typing.Protocol``) implemented by adapters in ``app/infrastructure``.
"""
