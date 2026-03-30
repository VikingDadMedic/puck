FROM node:22-alpine AS base
RUN apk update && apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare yarn@1.22.19 --activate

# ---------------------------------------------------------------------------
# Stage 1 — install dependencies & build via Turborepo
# ---------------------------------------------------------------------------
# The full monorepo is required because @puckeditor/core is resolved through
# tsconfig path aliases rather than package.json dependencies.
FROM base AS builder
WORKDIR /app

COPY package.json yarn.lock .yarnrc ./
COPY packages/ ./packages/
COPY apps/travel-studio/ ./apps/travel-studio/
# Workspace stubs so yarn install can resolve the full dependency graph
COPY apps/demo/package.json ./apps/demo/package.json
COPY apps/docs/package.json ./apps/docs/package.json
COPY recipes/next/package.json ./recipes/next/package.json
COPY recipes/next-ai/package.json ./recipes/next-ai/package.json
COPY recipes/remix/package.json ./recipes/remix/package.json
COPY recipes/remix-ai/package.json ./recipes/remix-ai/package.json
COPY recipes/react-router/package.json ./recipes/react-router/package.json
COPY recipes/react-router-ai/package.json ./recipes/react-router-ai/package.json
COPY turbo.json ./
COPY lerna.json ./

RUN yarn install --frozen-lockfile --network-timeout 600000
RUN yarn turbo run build --filter=travel-studio

# ---------------------------------------------------------------------------
# Stage 2 — minimal production runner
# ---------------------------------------------------------------------------
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/apps/travel-studio/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/travel-studio/.next/static ./apps/travel-studio/.next/static

# Public assets (create empty dir if source doesn't exist)
RUN mkdir -p ./apps/travel-studio/public

USER nextjs

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/health || exit 1

CMD ["node", "apps/travel-studio/server.js"]
