"""Payments domain — provider port (ЮKassa behind it, ADR-0003).

Card data never enters this package or its adapters — only provider ids/statuses
(SECURITY §1, T-07).
"""
