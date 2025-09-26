FROM python:3.12-slim
RUN pip install --no-cache-dir requests boto3 pandas
WORKDIR /app
COPY ingest.py .
CMD ["python","ingest.py"]