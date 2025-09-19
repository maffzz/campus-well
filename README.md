# 🏫 CampusWell - Sistema de Bienestar Estudiantil

## 📋 Descripción del Proyecto

CampusWell es una aplicación de microservicios diseñada para el bienestar estudiantil, que incluye gestión de citas psicológicas, hábitos de vida, eventos deportivos y análisis de tendencias de estrés.

## 🏗️ Arquitectura del Sistema

El sistema está compuesto por **5 microservicios** que se comunican entre sí:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │  Aggregator     │    │   Analytics     │
│   (React/Vue)   │◄───┤   Service       │◄───┤   Service       │
│                 │    │   (Port 8080)   │    │   (Port 8084)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                    ┌─────────┼─────────┐
                    │         │         │
            ┌───────▼───┐ ┌───▼───┐ ┌───▼───┐
            │  Psych    │ │Sports │ │Habits │
            │ Service   │ │Service│ │Service│
            │(Port 8081)│ │(8082) │ │(8083) │
            └───────────┘ └───────┘ └───────┘
                    │         │         │
            ┌───────▼───┐ ┌───▼───┐ ┌───▼───┐
            │PostgreSQL │ │ MySQL │ │MongoDB│
            │ Database  │ │Database│ │Database│
            └───────────┘ └───────┘ └───────┘
```

## 🚀 Inicio Rápido

### Prerrequisitos
- Docker y Docker Compose
- Node.js (para desarrollo local)
- Java 21+ (para desarrollo local)
- Python 3.12+ (para desarrollo local)

### 1. Clonar y Configurar
```bash
git clone <repository-url>
cd campuswell
```

### 2. Configurar Variables de Entorno
Crear archivo `.env` en la raíz del proyecto:
```bash
# Database Configuration
# MySQL (para sports-svc)
MYSQL_DATABASE=campuswell
MYSQL_USER=campus
MYSQL_PASSWORD=campus

# PostgreSQL (para psych-svc)
POSTGRES_DB=campuswell
POSTGRES_USER=campus
POSTGRES_PASSWORD=campus

# Service URLs (para desarrollo local)
PSYCH_BASE=http://localhost:8081
SPORTS_BASE=http://localhost:8082
HABITS_BASE=http://localhost:8083

# JWT Configuration
JWT_SECRET=your-secret-key-here

# AWS Configuration (para analytics-svc)
AWS_REGION=us-east-1
ATHENA_DB=campuswell_analytics
ATHENA_OUTPUT=s3://your-bucket/athena-results/
```

### 3. Ejecutar el Sistema
```bash
# Iniciar todos los servicios
docker compose up -d

# Ver logs
docker compose logs -f

# Verificar estado
docker compose ps
```

### 4. Verificar que Todo Funciona
```bash
# Health checks
curl http://localhost:8080/health  # Aggregator
curl http://localhost:8081/api/health  # Psych
curl http://localhost:8082/health  # Sports
curl http://localhost:8083/health  # Habits
curl http://localhost:8084/health  # Analytics
```

## 🎯 Desarrollo del Frontend

### ¿Por qué Solo el Aggregator Service?

**El frontend solo debe consumir el `aggregator-svc` (puerto 8080)** por las siguientes razones:

1. **Punto de Entrada Único**: El aggregator actúa como API Gateway
2. **Agregación de Datos**: Combina información de múltiples servicios
3. **Simplificación**: El frontend no necesita conocer la arquitectura interna
4. **Mantenibilidad**: Cambios en microservicios no afectan el frontend
5. **Seguridad**: Un solo punto de autenticación y autorización

### API Endpoints para el Frontend

#### Base URL: `http://localhost:8080`

#### 1. **Vista General del Bienestar**
```http
GET /wellbeing/{student_id}/overview
```
**Respuesta:**
```json
{
  "student": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "career": "Computer Science",
    "cohort": "2024"
  },
  "appointments": [
    {
      "id": 1,
      "studentId": 1,
      "psychologist": "Dr. García",
      "date": "2024-02-15T10:00:00Z",
      "status": "CONFIRMED"
    }
  ],
  "habits": [
    {
      "_id": "68cdd8323ddc567609e287b7",
      "studentId": 1,
      "sleepHours": 8,
      "exerciseMinutes": 30,
      "mood": "good",
      "date": "2024-01-15T00:00:00.000Z"
    }
  ]
}
```

#### 2. **Sistema de Recomendaciones**
```http
POST /wellbeing/recommendation?student_id={student_id}
```
**Respuesta:**
```json
{
  "avg_mood": 4.0,
  "suggested_event": {
    "id": 1,
    "name": "Basketball Tournament",
    "type": "sport",
    "date": "2024-02-15T18:00:00",
    "location": "Sports Complex"
  }
}
```

#### 3. **Health Check**
```http
GET /health
```

### Ejemplo de Integración Frontend (React)

```javascript
// services/api.js
const API_BASE_URL = 'http://localhost:8080';

export const api = {
  // Obtener vista general del bienestar
  getWellbeingOverview: async (studentId) => {
    const response = await fetch(`${API_BASE_URL}/wellbeing/${studentId}/overview`);
    return response.json();
  },

  // Obtener recomendaciones
  getRecommendations: async (studentId) => {
    const response = await fetch(
      `${API_BASE_URL}/wellbeing/recommendation?student_id=${studentId}`,
      { method: 'POST' }
    );
    return response.json();
  }
};

// Componente React
import React, { useState, useEffect } from 'react';
import { api } from './services/api';

function StudentDashboard({ studentId }) {
  const [wellbeing, setWellbeing] = useState(null);
  const [recommendations, setRecommendations] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [wellbeingData, recData] = await Promise.all([
          api.getWellbeingOverview(studentId),
          api.getRecommendations(studentId)
        ]);
        setWellbeing(wellbeingData);
        setRecommendations(recData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, [studentId]);

  return (
    <div>
      <h1>Bienestar de {wellbeing?.student?.name}</h1>
      {/* Renderizar datos */}
    </div>
  );
}
```

## 🚀 Configuración para Despliegue

### 1. Archivos de Configuración Necesarios

#### A. Variables de Entorno de Producción
Crear `.env.production`:
```bash
# Database Configuration
MYSQL_DATABASE=campuswell_prod
MYSQL_USER=campus_prod
MYSQL_PASSWORD=secure_password_here

# Service URLs (para producción)
PSYCH_BASE=http://psych-svc:8081
SPORTS_BASE=http://sports-svc:8082
HABITS_BASE=http://habits-svc:8083

# JWT Configuration
JWT_SECRET=production-secret-key-here

# AWS Configuration
AWS_REGION=us-east-1
ATHENA_DB=campuswell_analytics_prod
ATHENA_OUTPUT=s3://your-production-bucket/athena-results/
```

#### B. Docker Compose para Producción
Crear `docker-compose.prod.yml`:
```yaml
version: "3.9"
services:
  mysql:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: ${MYSQL_DATABASE}
      MYSQL_USER: ${MYSQL_USER}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
    ports: ["3306:3306"]
    healthcheck:
      test: ["CMD","mysqladmin","ping","-h","localhost"]
      interval: 10s
      timeout: 5s
      retries: 5
    volumes:
      - mysql_data:/var/lib/mysql
      - ./init-db.sql:/docker-entrypoint-initdb.d/init-db.sql
    restart: unless-stopped

  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: ${POSTGRES_DB:-campuswell}
      POSTGRES_USER: ${POSTGRES_USER:-campus}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-campus}
    ports: ["5434:5432"]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U campus -d campuswell"]
      interval: 10s
      timeout: 5s
      retries: 5
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  mongo:
    image: mongo:7
    ports: ["27017:27017"]
    volumes:
      - mongo_data:/data/db
    restart: unless-stopped

  sports-svc:
    build: ./sports-svc
    environment:
      - MYSQL_DATABASE=${MYSQL_DATABASE}
      - MYSQL_USER=${MYSQL_USER}
      - MYSQL_PASSWORD=${MYSQL_PASSWORD}
    depends_on:
      mysql:
        condition: service_healthy
    ports: ["8082:8082"]
    restart: unless-stopped

  psych-svc:
    build: ./psych-svc
    environment:
      - POSTGRES_DB=${POSTGRES_DB:-campuswell}
      - POSTGRES_USER=${POSTGRES_USER:-campus}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-campus}
    depends_on:
      postgres:
        condition: service_healthy
    ports: ["8081:8081"]
    restart: unless-stopped

  habits-svc:
    build: ./habits-svc
    environment:
      - MONGODB_URI=mongodb://mongo:27017/${MYSQL_DATABASE}
    depends_on:
      - mongo
    ports: ["8083:8083"]
    restart: unless-stopped

  aggregator-svc:
    build: ./aggregator-svc
    environment:
      - PSYCH_BASE=${PSYCH_BASE}
      - SPORTS_BASE=${SPORTS_BASE}
      - HABITS_BASE=${HABITS_BASE}
      - JWT_SECRET=${JWT_SECRET}
    ports: ["8080:8080"]
    restart: unless-stopped

  analytics-svc:
    build: ./analytics-svc
    environment:
      - AWS_REGION=${AWS_REGION}
      - ATHENA_DB=${ATHENA_DB}
      - ATHENA_OUTPUT=${ATHENA_OUTPUT}
    ports: ["8084:8084"]
    restart: unless-stopped

volumes:
  mysql_data:
  mongo_data:
  postgres_data:
```

#### C. Nginx Reverse Proxy (Opcional)
Crear `nginx.conf`:
```nginx
events {
    worker_connections 1024;
}

http {
    upstream aggregator {
        server aggregator-svc:8080;
    }

    server {
        listen 80;
        server_name your-domain.com;

        location /api/ {
            proxy_pass http://aggregator/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location / {
            root /usr/share/nginx/html;
            index index.html;
            try_files $uri $uri/ /index.html;
        }
    }
}
```

#### D. Dockerfile para Frontend
Crear `frontend/Dockerfile`:
```dockerfile
# Build stage
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 2. Scripts de Despliegue

#### A. Script de Inicio
Crear `start.sh`:
```bash
#!/bin/bash
echo "🚀 Iniciando CampusWell..."

# Cargar variables de entorno
if [ -f .env.production ]; then
    export $(cat .env.production | xargs)
fi

# Iniciar servicios
docker compose -f docker-compose.prod.yml up -d

echo "✅ CampusWell iniciado correctamente"
echo "📊 Dashboard: http://localhost:8080"
echo "🔍 Health: http://localhost:8080/health"
```

#### B. Script de Parada
Crear `stop.sh`:
```bash
#!/bin/bash
echo "🛑 Deteniendo CampusWell..."
docker compose -f docker-compose.prod.yml down
echo "✅ CampusWell detenido"
```

#### C. Script de Logs
Crear `logs.sh`:
```bash
#!/bin/bash
docker compose -f docker-compose.prod.yml logs -f
```

### 3. Configuración de Base de Datos

#### A. Backup de Base de Datos
Crear `backup-db.sh`:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker exec campuswell-mysql-1 mysqldump -u root -proot campuswell > backup_${DATE}.sql
echo "✅ Backup creado: backup_${DATE}.sql"
```

#### B. Restore de Base de Datos
Crear `restore-db.sh`:
```bash
#!/bin/bash
if [ -z "$1" ]; then
    echo "Uso: ./restore-db.sh <archivo.sql>"
    exit 1
fi

docker exec -i campuswell-mysql-1 mysql -u root -proot campuswell < $1
echo "✅ Base de datos restaurada desde $1"
```

### 4. Monitoreo y Logs

#### A. Health Check Script
Crear `health-check.sh`:
```bash
#!/bin/bash
echo "🔍 Verificando salud de los servicios..."

services=("8080" "8081" "8082" "8083" "8084")
for port in "${services[@]}"; do
    if curl -s http://localhost:$port/health > /dev/null; then
        echo "✅ Servicio en puerto $port: OK"
    else
        echo "❌ Servicio en puerto $port: ERROR"
    fi
done
```

#### B. Logs Centralizados
Crear `logs-centralized.sh`:
```bash
#!/bin/bash
echo "📋 Logs centralizados de CampusWell"
echo "=================================="
docker compose -f docker-compose.prod.yml logs --tail=50
```

### 5. Estructura de Archivos para Despliegue

```
campuswell/
├── README.md
├── docker-compose.yml              # Desarrollo
├── docker-compose.prod.yml         # Producción
├── .env                           # Variables desarrollo
├── .env.production                # Variables producción
├── init-db.sql                    # Inicialización DB
├── nginx.conf                     # Configuración Nginx
├── start.sh                       # Script inicio
├── stop.sh                        # Script parada
├── logs.sh                        # Script logs
├── health-check.sh                # Verificación salud
├── backup-db.sh                   # Backup DB
├── restore-db.sh                  # Restore DB
├── frontend/                      # Aplicación frontend
│   ├── Dockerfile
│   ├── package.json
│   └── src/
├── aggregator-svc/                # Servicio agregador
├── psych-svc/                     # Servicio psicológico
├── sports-svc/                    # Servicio deportivo
├── habits-svc/                    # Servicio hábitos
└── analytics-svc/                 # Servicio análisis
```

## 🔧 Comandos Útiles

### Desarrollo
```bash
# Iniciar en modo desarrollo
docker compose up -d

# Ver logs en tiempo real
docker compose logs -f

# Reconstruir un servicio específico
docker compose build psych-svc
docker compose up -d psych-svc

# Parar todos los servicios
docker compose down
```

### Producción
```bash
# Iniciar en modo producción
./start.sh

# Verificar salud
./health-check.sh

# Ver logs
./logs.sh

# Parar servicios
./stop.sh
```

## 📚 Documentación de APIs

### Swagger/OpenAPI
- **Aggregator Service**: http://localhost:8080/docs
- **Psych Service**: http://localhost:8081/swagger-ui.html
- **Sports Service**: http://localhost:8082/docs
- **Habits Service**: http://localhost:8083/api
- **Analytics Service**: http://localhost:8084/docs

## 🐛 Troubleshooting

### Problemas Comunes

1. **Error de conexión a base de datos**
   ```bash
   # Verificar que MySQL esté corriendo (sports-svc)
   docker compose ps mysql
   docker compose logs mysql
   
   # Verificar que PostgreSQL esté corriendo (psych-svc)
   docker compose ps postgres
   docker compose logs postgres
   
   # Verificar que MongoDB esté corriendo (habits-svc)
   docker compose ps mongo
   docker compose logs mongo
   ```

2. **Servicios no responden**
   ```bash
   # Verificar salud de todos los servicios
   ./health-check.sh
   
   # Reiniciar servicios
   docker compose restart
   ```

3. **Problemas de memoria**
   ```bash
   # Limpiar contenedores no utilizados
   docker system prune -a
   
   # Ver uso de recursos
   docker stats
   ```

## 📞 Soporte

Para reportar problemas o solicitar ayuda:
1. Verificar logs: `./logs.sh`
2. Ejecutar health check: `./health-check.sh`
3. Revisar documentación de APIs
4. Contactar al equipo de desarrollo

---

**¡CampusWell está listo para el desarrollo del frontend! 🎉**
