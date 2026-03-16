##### DEPENDENCIES

FROM --platform=linux/amd64 node:20-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Install Prisma Client
COPY prisma ./

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

##### BUILDER

FROM --platform=linux/amd64 node:20-alpine AS builder
ARG DATABASE_URL
ARG NEXT_PUBLIC_APP_URL
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# ENV NEXT_TELEMETRY_DISABLED 1
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
RUN npx prisma@6.19.2 generate

RUN SKIP_ENV_VALIDATION=1 npm run build

##### RUNNER

FROM --platform=linux/amd64 node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

# ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Install Prisma 6 globally for migrations
RUN npm install -g prisma@6.19.2

RUN prisma migrate deploy

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
