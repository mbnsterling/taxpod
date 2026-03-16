##### DEPENDENCIES

FROM --platform=linux/amd64 node:20-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY prisma ./
COPY package.json package-lock.json* ./
RUN npm ci

##### BUILDER

FROM --platform=linux/amd64 node:20-alpine AS builder
ARG NEXT_PUBLIC_APP_URL
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
RUN npx prisma@6.19.2 generate
RUN SKIP_ENV_VALIDATION=1 npm run build

##### MIGRATOR
# Dedicated image for running `prisma migrate deploy` at deploy time.
# Uses node:20-alpine (has a shell + openssl) so the Prisma CLI works correctly.
# Migrations must NEVER run at Docker build time — DATABASE_URL is not
# available then, and baking it into an image layer is a security risk.

FROM --platform=linux/amd64 node:20-alpine AS migrator
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

ARG DATABASE_URL
ARG DIRECT_URL

ENV DATABASE_URL=$DATABASE_URL
ENV DIRECT_URL=$DIRECT_URL

COPY --from=deps /app/node_modules ./node_modules
COPY prisma ./prisma

CMD ["node", "node_modules/prisma/build/index.js", "migrate", "deploy"]

##### RUNNER

FROM --platform=linux/amd64 node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
