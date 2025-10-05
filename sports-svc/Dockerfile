FROM python:3.12-slim
WORKDIR /app

RUN apt-get update && apt-get install -y default-mysql-client && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8082

# Create startup script
RUN echo '#!/bin/bash\n\
echo "Waiting for MySQL to be ready..."\n\
max_attempts=60\n\
attempt=0\n\
while [ $attempt -lt $max_attempts ]; do\n\
  if mysqladmin ping -h"$MYSQL_HOST" -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" --silent; then\n\
    echo "MySQL is up - testing connection..."\n\
    if mysql -h"$MYSQL_HOST" -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" -e "USE $MYSQL_DATABASE; SHOW TABLES;" 2>/dev/null; then\n\
      echo "Database connection successful - executing seed scripts"\n\
      python seed.py\n\
      python seed_registrations.py\n\
      echo "Starting sports service..."\n\
      uvicorn main:app --host 0.0.0.0 --port 8082\n\
      exit 0\n\
    else\n\
      echo "Database not ready yet - waiting..."\n\
    fi\n\
  fi\n\
  echo "MySQL is unavailable - sleeping (attempt $((attempt+1))/$max_attempts)"\n\
  sleep 5\n\
  attempt=$((attempt+1))\n\
done\n\
echo "MySQL failed to start after $max_attempts attempts - starting service anyway"\n\
uvicorn main:app --host 0.0.0.0 --port 8082' > /app/start.sh

RUN chmod +x /app/start.sh
CMD ["/app/start.sh"]