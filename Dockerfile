# syntax=docker/dockerfile:1.7

# ---------- Stage 1: build ----------
FROM node:22-alpine AS builder
WORKDIR /app

# Install deps (cache-friendly)
COPY package.json package-lock.json* ./
RUN npm install

# Copy source and build (gera dist/ com Worker + assets para Cloudflare)
COPY . .
RUN npm run build

# ---------- Stage 2: runtime ----------
# Roda o Worker compilado usando Wrangler (workerd) — o projeto compila
# para Cloudflare Workers (não para Node SSR nem para SPA estática),
# então precisamos do runtime do Worker para servir o SSR corretamente.
FROM node:22-alpine AS runtime
WORKDIR /app

# Apenas o necessário para rodar o wrangler
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json* ./
COPY --from=builder /app/wrangler.jsonc ./wrangler.jsonc
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 8080

# wrangler dev serve o Worker buildado localmente em modo produção
# --ip 0.0.0.0 para aceitar conexões externas ao container
# --port 8080 porta exposta
CMD ["npx", "wrangler", "dev", "--ip", "0.0.0.0", "--port", "8080", "--local"]
