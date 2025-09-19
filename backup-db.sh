#!/bin/bash
echo "💾 Creando backup de la base de datos..."

# Crear directorio de backups si no existe
mkdir -p backups

# Generar nombre de archivo con timestamp
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="backups/backup_${DATE}.sql"

# Verificar que MySQL esté corriendo
if ! docker compose -f docker-compose.prod.yml ps mysql | grep -q "Up"; then
    echo "❌ Error: MySQL no está corriendo"
    exit 1
fi

# Crear backup
echo "📦 Creando backup en $BACKUP_FILE..."
docker exec campuswell-mysql-1 mysqldump -u root -p${MYSQL_ROOT_PASSWORD:-root} ${MYSQL_DATABASE:-campuswell} > $BACKUP_FILE

if [ $? -eq 0 ]; then
    echo "✅ Backup creado exitosamente: $BACKUP_FILE"
    echo "📁 Tamaño del archivo: $(du -h $BACKUP_FILE | cut -f1)"
else
    echo "❌ Error al crear el backup"
    exit 1
fi
