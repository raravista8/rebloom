"""The hand-rolled ``Result`` type behaves like Ok/Err."""

from __future__ import annotations

import pytest
from app.core.errors import VALIDATION_ERROR, DomainError
from app.core.result import Err, Ok, Result, is_err, is_ok


def _divide(a: int, b: int) -> Result[int, DomainError]:
    if b == 0:
        return Err(DomainError(VALIDATION_ERROR, "division by zero"))
    return Ok(a // b)


def test_ok_path() -> None:
    result = _divide(10, 2)
    assert is_ok(result)
    assert result.unwrap() == 5
    assert result.is_ok() and not result.is_err()


def test_err_path() -> None:
    result = _divide(10, 0)
    assert is_err(result)
    assert result.is_err() and not result.is_ok()
    assert result.error.code == VALIDATION_ERROR


def test_unwrap_err_raises() -> None:
    result = _divide(1, 0)
    assert isinstance(result, Err)
    with pytest.raises(ValueError):
        result.unwrap()
