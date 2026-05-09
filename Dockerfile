FROM node:22-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG VITE_API_URL=http://localhost:3001
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

EXPOSE 8787

CMD ["npx", "wrangler", "dev", "--local", "--ip", "0.0.0.0", "--port", "8787"]
