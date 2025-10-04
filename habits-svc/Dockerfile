# ===== Etapa 1: Build =====
FROM node:20-slim AS builder
WORKDIR /app
# Copiamos package.json primero para aprovechar la cache
COPY package*.json ./
RUN npm ci
# Copiamos el código fuente
COPY . .
# Compilamos el proyecto (ajusta el comando si tu build es diferente)
RUN npm run build

# ===== Etapa 2: Runtime =====
FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
# Copiamos SOLO los artefactos de build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/seed.js ./seed.js

RUN echo '#!/bin/bash\n\
echo "Waiting for MongoDB to be ready..."\n\
while ! nc -z mongo 27017; do\n\
  echo "MongoDB is unavailable - sleeping"\n\
  sleep 2\n\
done\n\
echo "MongoDB is up - executing seed script"\n\
node seed.js\n\
echo "Starting habits service..."\n\
node dist/main.js' > /app/start.sh

RUN chmod +x /app/start.sh
RUN apt-get update && apt-get install -y netcat-openbsd && rm -rf /var/lib/apt/lists/*
EXPOSE 8083
CMD ["/app/start.sh"]