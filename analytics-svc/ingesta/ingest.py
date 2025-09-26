import os, requests, pandas as pd, boto3, datetime as dt

BASE=os.getenv("BASE_URL", "http://localhost:8080")
ENDPOINT=os.getenv("ENDPOINT", "/events")
S3_BUCKET=os.getenv("S3_BUCKET")
S3_PREFIX=os.getenv("S3_PREFIX", "ingesta")
REGION=os.getenv("AWS_REGION", "us-east-1")

session=boto3.session.Session(region_name=REGION)
s3=session.client("s3")

r=requests.get(BASE+ENDPOINT, timeout=60)
r.raise_for_status()
data=r.json()
df=pd.json_normalize(data)

now=dt.datetime.utcnow().strftime("%Y%m%d_%H%M%S")
key=f"{S3_PREFIX}/extract_date={now[:8]}/{S3_PREFIX}_{now}.csv"
tmp="/tmp/out.csv"
df.to_csv(tmp, index=False)
s3.upload_file(tmp, S3_BUCKET, key)
print({"uploaded":key,"rows":len(df)})


