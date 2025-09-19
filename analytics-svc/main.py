from fastapi import FastAPI
import boto3, os, time

app = FastAPI(title='analytics-svc')

athena = boto3.client('athena', region_name=os.getenv('AWS_REGION'))
DB  = os.getenv('ATHENA_DB')
OUT = os.getenv('ATHENA_OUTPUT')

SQL_STRESS = """
SELECT date_trunc('week', date) wk, count(*) confirmed
FROM psych_appointments
WHERE status='CONFIRMED'
GROUP BY 1 ORDER BY 1
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

@app.get('/health')
def health():
    return {"status":"ok"}