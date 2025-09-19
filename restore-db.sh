#!/bin/bash
echo "🔄 Restaurando base de datos..."

if [ -z "$1" ]; then
    echo "❌ Error: Debe especificar el archivo de backup"
    echo "Uso: ./restore-db.sh <archivo.sql>"
    echo ""
    echo "Archivos de backup disponibles:"
    ls -la backups/*.sql 2>/dev/null || echo "No hay archivos de backup en el directorio 'backups'"
    exit 1
fi

BACKUP_FILE=$1

# Verificar que el archivo existe
if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Error: El archivo $BACKUP_FILE no existe"
    exit 1
fi

# Verificar que MySQL esté corriendo
if ! docker compose -f docker-compose.prod.yml ps mysql | grep -q "Up"; then
    echo "❌ Error: MySQL no está corriendo"
    exit 1
fi

# Confirmar restauración
echo "⚠️  ADVERTENCIA: Esta operación reemplazará todos los datos actuales"
echo "📁 Archivo a restaurar: $BACKUP_FILE"
echo "📊 Tamaño del archivo: $(du -h $BACKUP_FILE | cut -f1)"
echo ""
read -p "¿Estás seguro de que quieres continuar? (y/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Operación cancelada"
    exit 1
fi

# Crear backup de seguridad antes de restaurar
echo "💾 Creando backup de seguridad antes de restaurar..."
./backup-db.sh

# Restaurar base de datos
echo "🔄 Restaurando base de datos desde $BACKUP_FILE..."
docker exec -i campuswell-mysql-1 mysql -u root -p${MYSQL_ROOT_PASSWORD:-root} ${MYSQL_DATABASE:-campuswell} < $BACKUP_FILE

if [ $? -eq 0 ]; then
    echo "✅ Base de datos restaurada exitosamente desde $BACKUP_FILE"
else
    echo "❌ Error al restaurar la base de datos"
    exit 1
fi
