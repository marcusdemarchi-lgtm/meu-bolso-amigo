# syntax=docker/dockerfile:1.7

# ---------- Stage 1: build ----------
FROM oven/bun:1.1-alpine AS builder
WORKDIR /app

# Install deps (cache-friendly)
COPY package.json bun.lockb* bunfig.toml* ./
RUN bun install --frozen-lockfile || bun install

# Copy source and build
COPY . .
RUN bun run build

# ---------- Stage 2: runtime ----------
# Vite build outputs static assets in /app/dist (client) — serve with nginx
FROM nginx:1.27-alpine AS runtime

# SPA fallback: route everything to index.html so TanStack Router handles routing
RUN printf 'server {\n\
  listen 80;\n\
  server_name _;\n\
  root /usr/share/nginx/html;\n\
  index index.html;\n\
  location / {\n\
    try_files $uri $uri/ /index.html;\n\
  }\n\
  location ~* \\.(js|css|png|jpg|jpeg|gif|svg|ico|webp|woff2?)$ {\n\
    expires 30d;\n\
    add_header Cache-Control "public, immutable";\n\
  }\n\
}\n' > /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
