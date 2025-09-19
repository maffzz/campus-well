# 📚 Ejemplos de Uso de la API CampusWell

## 🎯 Endpoints Principales

### Base URL
```
http://localhost:8080
```

## 📋 Ejemplos de Peticiones

### 1. Vista General del Bienestar

**Endpoint:** `GET /wellbeing/{student_id}/overview`

```bash
curl -X GET "http://localhost:8080/wellbeing/1/overview" \
  -H "Content-Type: application/json"
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

### 2. Sistema de Recomendaciones

**Endpoint:** `POST /wellbeing/recommendation?student_id={student_id}`

```bash
curl -X POST "http://localhost:8080/wellbeing/recommendation?student_id=1" \
  -H "Content-Type: application/json"
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

### 3. Health Check

**Endpoint:** `GET /health`

```bash
curl -X GET "http://localhost:8080/health"
```

**Respuesta:**
```json
{
  "status": "ok"
}
```

## 💻 Ejemplos de Código

### JavaScript (Vanilla)

```javascript
// Función para obtener vista general
async function getWellbeingOverview(studentId) {
  try {
    const response = await fetch(`http://localhost:8080/wellbeing/${studentId}/overview`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Función para obtener recomendaciones
async function getRecommendations(studentId) {
  try {
    const response = await fetch(
      `http://localhost:8080/wellbeing/recommendation?student_id=${studentId}`,
      { method: 'POST' }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Uso
getWellbeingOverview(1).then(data => {
  console.log('Bienestar:', data);
});

getRecommendations(1).then(data => {
  console.log('Recomendaciones:', data);
});
```

### React (con Hooks)

```jsx
import React, { useState, useEffect } from 'react';

function StudentDashboard({ studentId }) {
  const [wellbeing, setWellbeing] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        const [wellbeingData, recData] = await Promise.all([
          fetch(`http://localhost:8080/wellbeing/${studentId}/overview`).then(r => r.json()),
          fetch(`http://localhost:8080/wellbeing/recommendation?student_id=${studentId}`, {
            method: 'POST'
          }).then(r => r.json())
        ]);

        setWellbeing(wellbeingData);
        setRecommendations(recData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      loadData();
    }
  }, [studentId]);

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <h1>Dashboard del Estudiante</h1>
      {wellbeing && (
        <div>
          <h2>{wellbeing.student.name}</h2>
          <p>Email: {wellbeing.student.email}</p>
          <p>Carrera: {wellbeing.student.career}</p>
          
          <h3>Hábitos Recientes</h3>
          {wellbeing.habits.map((habit, index) => (
            <div key={index}>
              <p>Fecha: {new Date(habit.date).toLocaleDateString()}</p>
              <p>Sueño: {habit.sleepHours} horas</p>
              <p>Ejercicio: {habit.exerciseMinutes} minutos</p>
              <p>Estado de ánimo: {habit.mood}</p>
            </div>
          ))}
        </div>
      )}
      
      {recommendations && (
        <div>
          <h3>Recomendaciones</h3>
          <p>Estado de ánimo promedio: {recommendations.avg_mood}/5.0</p>
          {recommendations.suggested_event && (
            <div>
              <h4>Evento Recomendado</h4>
              <p>{recommendations.suggested_event.name}</p>
              <p>Fecha: {new Date(recommendations.suggested_event.date).toLocaleString()}</p>
              <p>Ubicación: {recommendations.suggested_event.location}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;
```

### Vue.js

```vue
<template>
  <div class="student-dashboard">
    <h1>Dashboard del Estudiante</h1>
    
    <div v-if="loading">Cargando...</div>
    
    <div v-else-if="wellbeing">
      <h2>{{ wellbeing.student.name }}</h2>
      <p>Email: {{ wellbeing.student.email }}</p>
      <p>Carrera: {{ wellbeing.student.career }}</p>
      
      <h3>Hábitos Recientes</h3>
      <div v-for="(habit, index) in wellbeing.habits" :key="index">
        <p>Fecha: {{ new Date(habit.date).toLocaleDateString() }}</p>
        <p>Sueño: {{ habit.sleepHours }} horas</p>
        <p>Ejercicio: {{ habit.exerciseMinutes }} minutos</p>
        <p>Estado de ánimo: {{ habit.mood }}</p>
      </div>
      
      <div v-if="recommendations">
        <h3>Recomendaciones</h3>
        <p>Estado de ánimo promedio: {{ recommendations.avg_mood }}/5.0</p>
        <div v-if="recommendations.suggested_event">
          <h4>Evento Recomendado</h4>
          <p>{{ recommendations.suggested_event.name }}</p>
          <p>Fecha: {{ new Date(recommendations.suggested_event.date).toLocaleString() }}</p>
          <p>Ubicación: {{ recommendations.suggested_event.location }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StudentDashboard',
  props: {
    studentId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      wellbeing: null,
      recommendations: null,
      loading: true
    }
  },
  async mounted() {
    await this.loadData();
  },
  methods: {
    async loadData() {
      try {
        this.loading = true;
        
        const [wellbeingResponse, recResponse] = await Promise.all([
          fetch(`http://localhost:8080/wellbeing/${this.studentId}/overview`),
          fetch(`http://localhost:8080/wellbeing/recommendation?student_id=${this.studentId}`, {
            method: 'POST'
          })
        ]);
        
        this.wellbeing = await wellbeingResponse.json();
        this.recommendations = await recResponse.json();
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>
```

### Python (con requests)

```python
import requests
import json

class CampusWellAPI:
    def __init__(self, base_url="http://localhost:8080"):
        self.base_url = base_url
    
    def get_wellbeing_overview(self, student_id):
        """Obtiene la vista general del bienestar de un estudiante"""
        response = requests.get(f"{self.base_url}/wellbeing/{student_id}/overview")
        response.raise_for_status()
        return response.json()
    
    def get_recommendations(self, student_id):
        """Obtiene recomendaciones para un estudiante"""
        response = requests.post(
            f"{self.base_url}/wellbeing/recommendation",
            params={"student_id": student_id}
        )
        response.raise_for_status()
        return response.json()
    
    def get_health(self):
        """Verifica el estado de salud de la API"""
        response = requests.get(f"{self.base_url}/health")
        response.raise_for_status()
        return response.json()

# Uso
api = CampusWellAPI()

# Obtener vista general
wellbeing = api.get_wellbeing_overview(1)
print("Bienestar:", json.dumps(wellbeing, indent=2))

# Obtener recomendaciones
recommendations = api.get_recommendations(1)
print("Recomendaciones:", json.dumps(recommendations, indent=2))
```

## 🔧 Configuración de CORS

Si tienes problemas de CORS, asegúrate de que el frontend esté configurado correctamente:

### React (package.json)
```json
{
  "proxy": "http://localhost:8080"
}
```

### Nginx (para producción)
```nginx
location /api/ {
    proxy_pass http://aggregator-svc:8080/;
    add_header 'Access-Control-Allow-Origin' '*' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
    add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range' always;
}
```

## 🚨 Manejo de Errores

```javascript
async function safeApiCall(apiFunction) {
  try {
    const result = await apiFunction();
    return { success: true, data: result };
  } catch (error) {
    console.error('API Error:', error);
    return { 
      success: false, 
      error: error.message || 'Error desconocido' 
    };
  }
}

// Uso
const result = await safeApiCall(() => getWellbeingOverview(1));
if (result.success) {
  console.log('Datos:', result.data);
} else {
  console.error('Error:', result.error);
}
```

## 📊 Monitoreo y Debugging

### Verificar Estado de la API
```bash
# Health check
curl http://localhost:8080/health

# Verificar todos los servicios
./health-check.sh
```

### Logs en Tiempo Real
```bash
# Ver logs de todos los servicios
./logs.sh

# Ver logs de un servicio específico
docker compose logs -f aggregator-svc
```

## 🎯 Próximos Pasos

1. **Implementar autenticación** (JWT tokens)
2. **Agregar validación de datos** en el frontend
3. **Implementar cache** para mejorar rendimiento
4. **Agregar tests** para el frontend
5. **Configurar CI/CD** para despliegue automático
