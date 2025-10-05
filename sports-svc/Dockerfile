FROM python:3.12-slim
WORKDIR /app

RUN apt-get update && apt-get install -y default-mysql-client && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8082

# Create startup script
RUN echo '#!/bin/bash\n\
echo "Starting sports service..."\n\
echo "Waiting for MySQL..."\n\
max_attempts=30\n\
attempt=0\n\
while [ $attempt -lt $max_attempts ]; do\n\
  if mysqladmin ping -h"$MYSQL_HOST" -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" --silent 2>/dev/null; then\n\
    echo "MySQL is ready - executing seeds..."\n\
    python seed.py\n\
    python seed_registrations.py\n\
    echo "Seeds completed - starting service..."\n\
    break\n\
  else\n\
    echo "Waiting for MySQL... (attempt $((attempt+1))/$max_attempts)"\n\
  fi\n\
  sleep 10\n\
  attempt=$((attempt+1))\n\
done\n\
echo "Starting sports service..."\n\
uvicorn main:app --host 0.0.0.0 --port 8082' > /app/start.sh

RUN chmod +x /app/start.sh
CMD ["/app/start.sh"]