# Web image — Next.js 15 + @rebloom/canon (the one UI; also the Capacitor source).
# Build context = repo root: `docker build -f web/Dockerfile .`
# canon is vendored at packages/canon and linked via file:../packages/canon +
# .npmrc install-links (materialized into node_modules). See deploy-single-box.md.
FROM node:20-slim

WORKDIR /app
# Dependency manifest + the vendored canon, so `npm ci` can resolve file:../packages/canon.
COPY packages/canon ./packages/canon
COPY web/package.json web/package-lock.json web/.npmrc ./web/

WORKDIR /app/web
RUN npm ci --install-links

# App source, then production build.
COPY web/ ./
# Yandex Metrica counter id is a NEXT_PUBLIC_* var → Next inlines it into the client
# bundle at build time, so it MUST be present here. Empty default → Metrica stays inert
# (dev/CI builds send nothing). Set via compose build-arg from the VM .env on prod.
ARG NEXT_PUBLIC_YM_COUNTER_ID=""
ENV NEXT_PUBLIC_YM_COUNTER_ID=$NEXT_PUBLIC_YM_COUNTER_ID
RUN npm run build

ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    NEXT_TELEMETRY_DISABLED=1
EXPOSE 3000
# `next start` serves the build (the home/listing routes are dynamic — cookies()).
CMD ["npm", "run", "start"]
