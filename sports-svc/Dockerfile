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
echo "Waiting for MySQL to be ready..."\n\
max_attempts=20\n\
attempt=0\n\
while [ $attempt -lt $max_attempts ]; do\n\
  if mysqladmin ping -h"$MYSQL_HOST" -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" --silent 2>/dev/null; then\n\
    echo "✅ MySQL is up - testing database..."\n\
    if mysql -h"$MYSQL_HOST" -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" -e "USE $MYSQL_DATABASE; SHOW TABLES;" 2>/dev/null; then\n\
      echo "✅ Database ready - executing seeds..."\n\
      echo "Running seed.py (events)..."\n\
      timeout 60 python seed.py || echo "⚠️ Events seed failed or timed out"\n\
      echo "Running seed_registrations.py..."\n\
      timeout 60 python seed_registrations.py || echo "⚠️ Registrations seed failed or timed out"\n\
      echo "✅ Seeds completed - starting service..."\n\
      break\n\
    else\n\
      echo "Database not ready yet..."\n\
    fi\n\
  else\n\
    echo "MySQL not responding (attempt $((attempt+1))/$max_attempts)"\n\
  fi\n\
  sleep 5\n\
  attempt=$((attempt+1))\n\
done\n\
echo "🚀 Starting sports service..."\n\
uvicorn main:app --host 0.0.0.0 --port 8082' > /app/start.sh

RUN chmod +x /app/start.sh
CMD ["/app/start.sh"]