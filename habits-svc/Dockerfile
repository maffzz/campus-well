FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist/ ./dist/
COPY seed.js ./seed.js
EXPOSE 8083
CMD ["node","dist/src/main.js"]
