#!/bin/bash
echo "🛑 Deteniendo CampusWell..."

# Parar servicios
docker compose -f docker-compose.prod.yml down

echo "✅ CampusWell detenido"
echo ""
echo "Para limpiar volúmenes (CUIDADO: elimina datos):"
echo "docker compose -f docker-compose.prod.yml down -v"
