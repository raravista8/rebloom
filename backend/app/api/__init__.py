"""API layer — thin FastAPI routers (validation + authz + call service).

No domain logic lives here; routers translate between HTTP and the domain
services and wrap every response in the ``{ok, data}`` / ``{ok, error}``
envelope (API_CONTRACT §0).
"""
