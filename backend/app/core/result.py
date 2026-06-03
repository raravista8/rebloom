"""A tiny ``Result[T, E]`` type.

The domain returns ``Result`` instead of raising; exceptions are raised only at
the API boundary (CLAUDE.md §4, ARCHITECTURE §12). Hand-rolled to avoid adding a
runtime dependency (CLAUDE.md §6 — no new runtime dep without an ADR).
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Generic, NoReturn, TypeGuard, TypeVar

T = TypeVar("T")
E = TypeVar("E")


@dataclass(frozen=True, slots=True)
class Ok(Generic[T]):
    """A successful result carrying ``value``."""

    value: T

    def is_ok(self) -> bool:
        return True

    def is_err(self) -> bool:
        return False

    def unwrap(self) -> T:
        return self.value


@dataclass(frozen=True, slots=True)
class Err(Generic[E]):
    """A failed result carrying ``error``."""

    error: E

    def is_ok(self) -> bool:
        return False

    def is_err(self) -> bool:
        return True

    def unwrap(self) -> NoReturn:
        raise ValueError(f"called unwrap() on an Err: {self.error!r}")


type Result[T, E] = Ok[T] | Err[E]


def is_ok(result: Result[T, E]) -> TypeGuard[Ok[T]]:
    """Narrowing guard so callers can branch with full typing."""
    return isinstance(result, Ok)


def is_err(result: Result[T, E]) -> TypeGuard[Err[E]]:
    return isinstance(result, Err)
