#!/bin/bash
echo "🚀 Iniciando CampusWell..."

# Cargar variables de entorno
if [ -f .env.production ]; then
    echo "📋 Cargando variables de producción..."
    export $(cat .env.production | xargs)
else
    echo "⚠️  Archivo .env.production no encontrado, usando variables por defecto"
fi

# Iniciar servicios
echo "🐳 Iniciando contenedores..."
docker compose -f docker-compose.prod.yml up -d

# Esperar a que los servicios estén listos
echo "⏳ Esperando a que los servicios estén listos..."
sleep 30

# Verificar salud de los servicios
echo "🔍 Verificando salud de los servicios..."
./health-check.sh

echo ""
echo "✅ CampusWell iniciado correctamente"
echo "📊 Dashboard: http://localhost:8080"
echo "🔍 Health: http://localhost:8080/health"
echo "📚 API Docs: http://localhost:8080/docs"
echo ""
echo "Para ver logs: ./logs.sh"
echo "Para parar: ./stop.sh"
