# Backend image — api / workers / bot share this image (OPERATIONS §2).
# Build context is the repo root: `docker build -f backend/Dockerfile .`
FROM python:3.12-slim AS base

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    POETRY_VERSION=1.8.3 \
    POETRY_VIRTUALENVS_CREATE=false

WORKDIR /app

# curl for the container healthcheck; psycopg ships a binary wheel (no libpq-dev).
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/* \
    && pip install "poetry==${POETRY_VERSION}"

# Install deps first (cache layer) — only main group, no dev tooling in prod.
COPY backend/pyproject.toml backend/poetry.lock ./
RUN poetry install --only main --no-root --no-interaction

COPY backend/ ./

# Build stamp (OPERATIONS §1) — overridden at build time.
ARG BUILD_VERSION=dev
ARG BUILD_TIME=unknown
ENV BUILD_VERSION=${BUILD_VERSION} BUILD_TIME=${BUILD_TIME}

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
