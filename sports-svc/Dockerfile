FROM python:3.12-slim
WORKDIR /app

RUN apt-get update && apt-get install -y default-mysql-client && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8082

# Create startup script
RUN echo '#!/bin/bash\n\
echo "=== Sports Service Startup ==="\n\
echo "Environment variables:"\n\
echo "MYSQL_HOST=$MYSQL_HOST"\n\
echo "MYSQL_USER=$MYSQL_USER"\n\
echo "MYSQL_DATABASE=$MYSQL_DATABASE"\n\
echo "Waiting for MySQL to be ready..."\n\
max_attempts=50\n\
attempt=0\n\
while [ $attempt -lt $max_attempts ]; do\n\
  echo "Attempt $((attempt+1))/$max_attempts: Testing MySQL connection..."\n\
  echo "Testing: mysqladmin ping -h$MYSQL_HOST -u$MYSQL_USER -p$MYSQL_PASSWORD"\n\
  if mysqladmin ping -h"$MYSQL_HOST" -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" --silent 2>/dev/null; then\n\
    echo "✅ MySQL is up - testing database..."\n\
    if mysql -h"$MYSQL_HOST" -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" -e "USE $MYSQL_DATABASE; SHOW TABLES;" 2>/dev/null; then\n\
      echo "✅ Database ready - executing seeds..."\n\
      echo "Running seed.py (events)..."\n\
      python seed.py || echo "⚠️ Events seed failed"\n\
      echo "Running seed_registrations.py..."\n\
      python seed_registrations.py || echo "⚠️ Registrations seed failed"\n\
      echo "✅ Seeds completed - starting service..."\n\
      break\n\
    else\n\
      echo "Database not ready yet..."\n\
    fi\n\
  else\n\
    echo "MySQL not responding..."\n\
  fi\n\
  sleep 5\n\
  attempt=$((attempt+1))\n\
done\n\
if [ $attempt -eq $max_attempts ]; then\n\
  echo "❌ Failed to connect to MySQL after $max_attempts attempts"\n\
  echo "Starting service anyway..."\n\
fi\n\
echo "🚀 Starting sports service..."\n\
exec uvicorn main:app --host 0.0.0.0 --port 8082' > /app/start.sh

RUN chmod +x /app/start.sh
CMD ["/app/start.sh"]