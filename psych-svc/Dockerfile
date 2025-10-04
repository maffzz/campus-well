# ===== Etapa 1: Build =====
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /app

# Copia pom.xml primero para aprovechar la cache
COPY pom.xml .
# Descarga dependencias (cache)
RUN mvn dependency:go-offline

# Copia el resto del código
COPY src ./src

# Compila el proyecto y genera el JAR
RUN mvn clean package -DskipTests

# ===== Etapa 2: Runtime =====
FROM eclipse-temurin:21-jre
WORKDIR /app

# Install PostgreSQL client for health checks
RUN apt-get update && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*

# Copiamos el jar generado en la etapa de build
COPY --from=builder /app/target/psych-svc-0.0.1.jar app.jar

# Create startup script
RUN echo '#!/bin/bash\n\
echo "Waiting for PostgreSQL to be ready..."\n\
while ! pg_isready -h postgres -p 5432 -U campus; do\n\
  echo "PostgreSQL is unavailable - sleeping"\n\
  sleep 2\n\
done\n\
echo "PostgreSQL is up - starting psych service..."\n\
java -jar /app/app.jar --server.port=8081 --server.address=0.0.0.0' > /app/start.sh

RUN chmod +x /app/start.sh
EXPOSE 8081
CMD ["/app/start.sh"]
