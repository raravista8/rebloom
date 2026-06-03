"""Content moderation domain (MODERATION.md, SECURITY T-05/T-15).

Pure: text normalization + denylist matching. The lexicon DATA is loaded from
config by infrastructure and injected — banned terms never live in code or docs.
"""
