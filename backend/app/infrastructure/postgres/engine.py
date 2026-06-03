"""SQLAlchemy engines — writer (primary) and reader (replica).

The read-replica is provisioned day-1 (MVP decision): read-only queries
(feed/search) use :data:`reader_engine`; everything that mutates state uses
:data:`writer_engine`. When no replica DSN is configured, ``reader_url`` falls
back to the primary (see :class:`app.config.Settings`).
"""

from __future__ import annotations

from collections.abc import Iterator
from contextlib import contextmanager

from sqlalchemy import create_engine, text
from sqlalchemy.engine import Engine
from sqlalchemy.orm import Session, sessionmaker

from app.config import get_settings

_settings = get_settings()
_CONNECT_ARGS = {"connect_timeout": 3}

writer_engine: Engine = create_engine(
    _settings.database_url, pool_pre_ping=True, connect_args=_CONNECT_ARGS
)
reader_engine: Engine = create_engine(
    _settings.reader_url, pool_pre_ping=True, connect_args=_CONNECT_ARGS
)

SessionWriter = sessionmaker(bind=writer_engine, class_=Session, expire_on_commit=False)
SessionReader = sessionmaker(bind=reader_engine, class_=Session, expire_on_commit=False)


@contextmanager
def writer_session() -> Iterator[Session]:
    """Transactional unit of work against the primary (commit/rollback/close)."""
    session = SessionWriter()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


@contextmanager
def reader_session() -> Iterator[Session]:
    """Read-only session against the replica (no commit)."""
    session = SessionReader()
    try:
        yield session
    finally:
        session.close()


def check_primary() -> bool:
    """Readiness probe — the writable primary must be reachable."""
    try:
        with writer_engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return True
    except Exception:
        return False
