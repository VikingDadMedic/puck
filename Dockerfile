FROM node:20-alpine AS base
RUN apk update && apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare yarn@1.22.19 --activate

# Stage 1: Install + build in one layer to preserve Yarn workspace symlinks
FROM base AS builder
WORKDIR /app

COPY package.json yarn.lock .yarnrc ./
COPY packages/ ./packages/
COPY apps/demo/ ./apps/demo/
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
RUN yarn turbo run build --filter=demo

# Stage 2: Production runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/apps/demo/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/demo/.next/static ./apps/demo/.next/static

# Copy public assets if they exist (using a wildcard to avoid failure when absent)
COPY --from=builder /app/apps/demo/publi[c] ./apps/demo/public

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

CMD ["node", "apps/demo/server.js"]
