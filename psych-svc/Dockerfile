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

# Copiamos el jar generado en la etapa de build
COPY --from=builder /app/target/psych-svc-0.0.1.jar app.jar

EXPOSE 8081

# 👇 Aquí el cambio importante: bind-address en 0.0.0.0
ENTRYPOINT ["java","-jar","/app/app.jar","--server.port=8081","--server.address=0.0.0.0"]
