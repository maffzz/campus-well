from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import boto3, os, time

app = FastAPI(title='analytics-svc', root_path="/analytics")

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

athena = boto3.client('athena', region_name=os.getenv('AWS_REGION'))
DB  = os.getenv('ATHENA_DB')
OUT = os.getenv('ATHENA_OUTPUT')

SQL_STRESS = """
SELECT 
  date_format(
    date_trunc(
      'week',
      from_iso8601_timestamp(
        regexp_replace(date, '(\\.\\d+Z)$', 'Z')
      )
    ),
    '%Y-%m-%d'
  ) AS week_start,
  COUNT(*) AS confirmed
FROM psych
WHERE status = 'CONFIRMED'
GROUP BY 1
ORDER BY 1;
"""

SQL_AGE_RANGE = """
SELECT 
  mood,
  COUNT(*) AS total_registros,
  ROUND(AVG(sleephours), 2) AS avg_sleep,
  ROUND(AVG(exerciseminutes), 2) AS avg_exercise
FROM habits
GROUP BY mood
ORDER BY total_registros DESC
"""

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