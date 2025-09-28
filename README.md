# 🏫 CampusWell - Sistema de Bienestar Estudiantil

[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.java.com/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)

## 📋 Descripción

CampusWell es una plataforma integral de microservicios diseñada para mejorar el bienestar estudiantil universitario. El sistema integra servicios de psicología, deportes, hábitos de vida y análisis de datos para proporcionar una experiencia completa de apoyo estudiantil.

## ✨ Características Principales

- 🧠 **Gestión de Citas Psicológicas** - Sistema completo de citas y seguimiento
- 🏃 **Eventos Deportivos** - Organización y registro en actividades deportivas
- 📊 **Seguimiento de Hábitos** - Monitoreo de sueño, ejercicio y estado de ánimo
- 📈 **Analytics Avanzado** - Análisis de tendencias de estrés y bienestar
- 🔗 **API Agregadora** - Endpoints que combinan datos de múltiples servicios
- 🎨 **Frontend Moderno** - Interfaz React con diseño responsivo

## 🏗️ Arquitectura del Sistema

### Microservicios

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React)                        │
│                         Port: 3000                             │
└─────────────────────┬───────────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────────┐
│                   Aggregator Service                            │
│                      Port: 8080                                │
│  • /wellbeing/{id}/overview                                    │
│  • /wellbeing/recommendation                                   │
└─────┬───────────────┬───────────────┬───────────────────────────┘
      │               │               │
┌─────▼─────┐ ┌───────▼─────┐ ┌──────▼─────┐ ┌─────────────────┐
│Psych Svc  │ │Sports Svc   │ │Habits Svc  │ │Analytics Svc    │
│Port: 8081 │ │Port: 8082   │ │Port: 8083  │ │Port: 8084       │
│PostgreSQL │ │MySQL        │ │MongoDB     │ │AWS Athena       │
└───────────┘ └─────────────┘ └────────────┘ └─────────────────┘
```

### Tecnologías Utilizadas

| Servicio | Tecnología | Base de Datos | Puerto |
|----------|------------|---------------|--------|
| Frontend | React + Tailwind CSS | - | 3000 |
| Aggregator | Python + FastAPI | - | 8080 |
| Psychology | Java + Spring Boot | PostgreSQL | 8081 |
| Sports | Python + FastAPI | MySQL | 8082 |
| Habits | Node.js + NestJS | MongoDB | 8083 |
| Analytics | Python + FastAPI | AWS Athena | 8084 |

## 🚀 Instalación y Configuración

### Prerrequisitos

- **Docker** 20.10+
- **Docker Compose** 2.0+
- **Git**

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd campuswell
```

### 2. Configurar Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```bash
# Database Configuration
MYSQL_DATABASE=campuswell
MYSQL_USER=campus
MYSQL_PASSWORD=campus
POSTGRES_DB=campuswell
POSTGRES_USER=campus
POSTGRES_PASSWORD=campus

# Service URLs (para Docker)
PSYCH_BASE=http://psych-svc:8081
SPORTS_BASE=http://sports-svc:8082
HABITS_BASE=http://habits-svc:8083

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
docker-compose up -d

# Verificar estado de los servicios
docker-compose ps

# Ver logs en tiempo real
docker-compose logs -f
```

### 4. Verificar Instalación

```bash
# Verificar que todos los servicios estén funcionando
curl http://localhost:3000  # Frontend
curl http://localhost:8080/health  # Aggregator
curl http://localhost:8081/api/health  # Psychology
curl http://localhost:8082/health  # Sports
curl http://localhost:8083/health  # Habits
curl http://localhost:8084/health  # Analytics
```

## 📚 Documentación de API

### Endpoints Principales

#### Aggregator Service (Puerto 8080)

```bash
# Vista general del bienestar de un estudiante
GET /wellbeing/{student_id}/overview

# Recomendaciones personalizadas
POST /wellbeing/recommendation
{
  "student_id": 1
}

# Estado de salud del servicio
GET /health
```

#### Psychology Service (Puerto 8081)

```bash
# Obtener estudiante
GET /api/students/{id}

# Crear estudiante
POST /api/students
{
  "name": "Juan Pérez",
  "email": "juan@university.edu",
  "career": "Computer Science",
  "cohort": "2024"
}

# Historial de citas
GET /api/students/{id}/history

# Crear cita
POST /api/appointments
{
  "studentId": 1,
  "psychologist": "Dr. Smith",
  "date": "2024-02-15T10:00:00Z",
  "status": "PENDING"
}
```

#### Sports Service (Puerto 8082)

```bash
# Listar eventos
GET /events?type=sport

# Crear evento
POST /events
{
  "name": "Basketball Tournament",
  "type": "sport",
  "date": "2024-02-15T18:00:00",
  "location": "Sports Complex"
}

# Registrar en evento
POST /registrations?student_id=1&event_id=1
```

#### Habits Service (Puerto 8083)

```bash
# Obtener hábitos de estudiante
GET /habits/{student_id}

# Crear hábito
POST /habits
{
  "studentId": 1,
  "sleepHours": 8,
  "exerciseMinutes": 30,
  "mood": "good",
  "date": "2024-01-15T00:00:00.000Z"
}
```

#### Analytics Service (Puerto 8084)

```bash
# Tendencias de estrés
GET /analytics/stress-trends

# Análisis por rango de edad
GET /analytics/age-range
```

## 🛠️ Desarrollo

### Estructura del Proyecto

```
campuswell/
├── frontend/                    # Aplicación React
│   ├── src/
│   │   ├── components/         # Componentes React
│   │   ├── pages/             # Páginas principales
│   │   ├── services/          # Servicios de API
│   │   └── config.js          # Configuración
│   ├── Dockerfile
│   └── nginx.conf
├── aggregator-svc/             # Servicio agregador
│   ├── main.py
│   ├── requirements.txt
│   └── Dockerfile
├── psych-svc/                  # Servicio de psicología
│   ├── src/main/java/
│   ├── pom.xml
│   └── Dockerfile
├── sports-svc/                 # Servicio de deportes
│   ├── main.py
│   ├── requirements.txt
│   ├── init-db.sql            # Inicialización DB MySQL
│   └── Dockerfile
├── habits-svc/                 # Servicio de hábitos
│   ├── src/
│   ├── package.json
│   └── Dockerfile
├── analytics-svc/              # Servicio de analíticas
│   ├── main.py
│   ├── requirements.txt
│   └── Dockerfile
├── docker-compose.yml          # Configuración principal
├── .env                        # Variables de entorno
└── README.md
```

### Comandos de Desarrollo

```bash
# Construir un servicio específico
docker-compose build <service-name>

# Reiniciar un servicio
docker-compose restart <service-name>

# Ver logs de un servicio
docker-compose logs -f <service-name>

# Ejecutar comandos en un contenedor
docker-compose exec <service-name> <command>

# Acceder a la base de datos
docker-compose exec mysql mysql -u campus -pcampus campuswell
docker-compose exec postgres psql -U campus -d campuswell
docker-compose exec mongo mongo campuswell
```

### Scripts de Utilidad

```bash
# Verificar salud de todos los servicios
./health-check.sh

# Ver logs de todos los servicios
./logs.sh

# Crear backup de la base de datos
./backup-db.sh

# Restaurar backup
./restore-db.sh <backup-file.sql>
```

## 🧪 Testing

### Pruebas de API

El proyecto incluye colecciones de Postman para cada microservicio:

- `aggregator-svc/postman_aggregator.collection.json`
- `psych-svc/postman_psych.collection.json`
- `sports-svc/postman_sports.collection.json`
- `habits-svc/postman_habits.collection.json`

### Pruebas de Integración

```bash
# Ejecutar todas las pruebas de salud
curl -s http://localhost:8080/health && \
curl -s http://localhost:8081/api/health && \
curl -s http://localhost:8082/health && \
curl -s http://localhost:8083/health && \
curl -s http://localhost:8084/health
```

## 🚀 Despliegue

### Despliegue Local

```bash
# Usar configuración de producción
docker-compose up -d

# Verificar despliegue
docker-compose ps
```

### Despliegue en Producción

1. **Configurar variables de entorno de producción**
2. **Configurar AWS credentials para Analytics Service**
3. **Ajustar configuración de red y puertos**
4. **Configurar SSL/TLS si es necesario**

```bash
# Ejemplo de despliegue con variables de producción
export MYSQL_PASSWORD=secure_password
export POSTGRES_PASSWORD=secure_password
export JWT_SECRET=very_secure_secret
docker-compose up -d
```

## 📊 Monitoreo y Logs

### Verificación de Salud

```bash
# Script automatizado de verificación
./health-check.sh
```

### Logs

```bash
# Ver todos los logs
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f <service-name>

# Ver logs con timestamp
docker-compose logs -f -t
```

## 🔧 Troubleshooting

### Problemas Comunes

#### 1. Error de Conexión a Base de Datos

```bash
# Verificar que las bases de datos estén funcionando
docker-compose ps | grep -E "(mysql|postgres|mongo)"

# Verificar logs de base de datos
docker-compose logs mysql
docker-compose logs postgres
docker-compose logs mongo
```

#### 2. Error de CORS

```bash
# Verificar configuración de CORS en cada microservicio
# Los servicios están configurados para permitir:
# - http://localhost:3000 (desarrollo)
# - http://frontend:80 (Docker)
```

#### 3. Puerto en Uso

```bash
# Verificar puertos en uso
netstat -tulpn | grep -E "(3000|8080|8081|8082|8083|8084)"

# Cambiar puertos en docker-compose.yml si es necesario
```

### Comandos de Limpieza

```bash
# Limpiar contenedores parados
docker-compose down

# Limpiar volúmenes (CUIDADO: elimina datos)
docker-compose down -v

# Limpiar imágenes no utilizadas
docker system prune -a
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Autores

- **Mafer Lazón** - *Backend y Frontend* - [maffzz](https://github.com/maffzz)
- **Annemarie Saldarriaga** - *Backend y Frontend* - [AnnieSld](https://github.com/AnnieSld)
- **Martin Bonilla** - *Despliegue* - [marbs23](https://github.com/marbs23)
- **Ana Huapaya** - *Despliegue* - [ana17hy](https://github.com/ana17hy)
- **Juan Renato Flores** - *Despliegue* - [jfloredev](https://github.com/jfloredev)

## 🙏 Agradecimientos

- Profe Geraldo Colchado
- Rimac Seguros: La mejor compañía de seguros del Perú

---

**CampusWell** - Mejorando el bienestar estudiantil a través de la tecnología 🎓✨
