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
EXPOSE 8083
CMD ["node","dist/main.js"]

