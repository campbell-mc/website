# CHRIS-OS Web App — Cloud Run deployment

FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.30.1 --activate
WORKDIR /app

# Stage 1: Install all dependencies
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json apps/web/
COPY packages/db/package.json packages/db/
COPY packages/shared/package.json packages/shared/
COPY packages/connectors/package.json packages/connectors/
COPY packages/engines/package.json packages/engines/
RUN pnpm install --frozen-lockfile

# Stage 2: Build
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

WORKDIR /app/apps/web
RUN npx next build

# Debug: show where server.js ends up
RUN find /app/apps/web/.next/standalone -name "server.js" -type f 2>/dev/null || echo "No server.js in standalone"
RUN ls -la /app/apps/web/.next/standalone/ 2>/dev/null || echo "No standalone dir"
RUN ls -la /app/apps/web/.next/standalone/apps/web/ 2>/dev/null || echo "No apps/web in standalone"

# Stage 3: Production runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=8080

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the standalone output — server.js is at the monorepo root level
# because outputFileTracingRoot is set to ../../
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

USER nextjs
EXPOSE 8080
CMD ["node", "apps/web/server.js"]
