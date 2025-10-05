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
echo "MySQL should be ready (health check passed)"\n\
echo "Testing database connection..."\n\
if mysql -h"$MYSQL_HOST" -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" -e "USE $MYSQL_DATABASE; SHOW TABLES;" 2>/dev/null; then\n\
  echo "✅ Database ready - executing seeds..."\n\
  echo "Running seed.py (events)..."\n\
  python seed.py || echo "⚠️ Events seed failed"\n\
  echo "Running seed_registrations.py..."\n\
  python seed_registrations.py || echo "⚠️ Registrations seed failed"\n\
  echo "✅ Seeds completed - starting service..."\n\
else\n\
  echo "❌ Database not ready - starting service without seeds"\n\
fi\n\
echo "🚀 Starting sports service..."\n\
exec uvicorn main:app --host 0.0.0.0 --port 8082' > /app/start.sh

RUN chmod +x /app/start.sh
CMD ["/app/start.sh"]