  # syntax=docker/dockerfile:1.7

  # ---------- Stage 1: build ----------
  FROM node:22-alpine AS builder

  WORKDIR /app

  # Copia apenas dependências primeiro (cache)
  COPY package.json package-lock.json* ./

  RUN npm install

  # Copia o resto do projeto
  COPY . .

  # Gera rotas ANTES do build (ESSENCIAL)
  RUN npx @tanstack/router-cli generate

  # Builda o projeto
  RUN npm run build

  # ---------- Stage 2: runtime ----------
  FROM nginx:1.27-alpine

  # Config nginx SPA
  RUN printf 'server {\n\
    listen 80;\n\
    server_name _;\n\
    root /usr/share/nginx/html/client;\n\
    index index.html;\n\
    location / {\n\
      try_files $uri $uri/ /index.html;\n\
    }\n\
  }\n' > /etc/nginx/conf.d/default.conf

  # Copia build
  COPY --from=builder /app/dist /usr/share/nginx/html

  EXPOSE 80
  CMD ["nginx", "-g", "daemon off;"]