from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import boto3, os, time

app = FastAPI(title='analytics-svc')

# ===== CORS =====
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    # "https://tudominio.com"  # si tienes producción
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===== Athena client =====
athena = boto3.client('athena', region_name=os.getenv('AWS_REGION'))
DB  = os.getenv('ATHENA_DB')
OUT = os.getenv('ATHENA_OUTPUT')

# ===== Queries =====
SQL_STRESS = """
SELECT date_trunc('week', date) wk, count(*) confirmed
FROM psych_appointments
WHERE status='CONFIRMED'
GROUP BY 1 ORDER BY 1
"""

SQL_AGE_RANGE = """
SELECT
  CASE
    WHEN age BETWEEN 18 AND 24 THEN '18-24'
    WHEN age BETWEEN 25 AND 34 THEN '25-34'
    WHEN age BETWEEN 35 AND 44 THEN '35-44'
    WHEN age BETWEEN 45 AND 54 THEN '45-54'
    ELSE '55+'
  END AS age_range,
  COUNT(*) as num_students
FROM students
GROUP BY 1
ORDER BY 1
"""

# ===== Endpoints =====
@app.get('/analytics/stress-trends')
def stress():
    q = athena.start_query_execution(
        QueryString=SQL_STRESS,
        QueryExecutionContext={'Database': DB},
        ResultConfiguration={'OutputLocation': OUT}
    )
    qid = q['QueryExecutionId']
    while True:
        s = athena.get_query_execution(QueryExecutionId=qid)['QueryExecution']['Status']['State']
        if s in ('SUCCEEDED', 'FAILED', 'CANCELLED'):
            break
        time.sleep(1)
    if s != 'SUCCEEDED':
        return {'error': s}
    res = athena.get_query_results(QueryExecutionId=qid)
    rows = [[c.get('VarCharValue') for c in r['Data']] for r in res['ResultSet']['Rows']][1:]
    return {'rows': rows}

@app.get('/analytics/age-range')
def age_range():
    q = athena.start_query_execution(
        QueryString=SQL_AGE_RANGE,
        QueryExecutionContext={'Database': DB},
        ResultConfiguration={'OutputLocation': OUT}
    )
    qid = q['QueryExecutionId']
    while True:
        s = athena.get_query_execution(QueryExecutionId=qid)['QueryExecution']['Status']['State']
        if s in ('SUCCEEDED', 'FAILED', 'CANCELLED'):
            break
        time.sleep(1)
    if s != 'SUCCEEDED':
        return {'error': s}
    res = athena.get_query_results(QueryExecutionId=qid)
    rows = [[c.get('VarCharValue') for c in r['Data']] for r in res['ResultSet']['Rows']][1:]
    return {'rows': rows}

@app.get('/health')
def health():
    return {"status":"ok"}
