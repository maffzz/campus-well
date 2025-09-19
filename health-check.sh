#!/bin/bash
echo "🔍 Verificando salud de los servicios de CampusWell..."
echo "====================================================="

# Contadores
total_services=5
healthy_services=0

# Verificar cada servicio
echo -n "🔍 Aggregator Service (puerto 8080): "
if curl -s http://localhost:8080/health > /dev/null 2>&1; then
    echo "✅ OK"
    ((healthy_services++))
else
    echo "❌ ERROR"
fi

echo -n "🔍 Psych Service (puerto 8081): "
if curl -s http://localhost:8081/api/health > /dev/null 2>&1; then
    echo "✅ OK"
    ((healthy_services++))
else
    echo "❌ ERROR"
fi

echo -n "🔍 Sports Service (puerto 8082): "
if curl -s http://localhost:8082/health > /dev/null 2>&1; then
    echo "✅ OK"
    ((healthy_services++))
else
    echo "❌ ERROR"
fi

echo -n "🔍 Habits Service (puerto 8083): "
if curl -s http://localhost:8083/health > /dev/null 2>&1; then
    echo "✅ OK"
    ((healthy_services++))
else
    echo "❌ ERROR"
fi

echo -n "🔍 Analytics Service (puerto 8084): "
if curl -s http://localhost:8084/health > /dev/null 2>&1; then
    echo "✅ OK"
    ((healthy_services++))
else
    echo "❌ ERROR"
fi

echo ""
echo "📊 Resumen: $healthy_services/$total_services servicios funcionando"

if [ $healthy_services -eq $total_services ]; then
    echo "🎉 ¡Todos los servicios están funcionando correctamente!"
    exit 0
else
    echo "⚠️  Algunos servicios no están funcionando. Revisa los logs con: ./logs.sh"
    exit 1
fi
