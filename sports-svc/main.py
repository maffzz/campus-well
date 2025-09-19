from fastapi import (FastAPI)
from pydantic import BaseModel
from sqlalchemy import create_engine, text
import os

app = FastAPI(title="sports-svc")

DB_URL = (
    f"mysql+pymysql://{os.getenv('MYSQL_USER')}:"
    f"{os.getenv('MYSQL_PASSWORD')}@mysql:3306/{os.getenv('MYSQL_DATABASE')}"
)
engine = create_engine(DB_URL, pool_pre_ping=True)

class EventIn(BaseModel):
    name: str
    type: str
    date: str
    location: str

@app.get("/events")
def list_events(type: str | None = None):
    q = "SELECT id,name,type,date,location FROM events" + (" WHERE type=:t" if type else "")
    with engine.begin() as cn:
        rows = cn.execute(text(q), {"t": type} if type else {}).mappings().all()
    return list(rows)

@app.post("/registrations")
def add_registration(student_id: int, event_id: int):
    with engine.begin() as cn:
        cn.execute(
            text("INSERT INTO registrations(student_id,event_id) VALUES (:s,:e)"),
            {"s": student_id, "e": event_id},
        )
    return {"ok": True}

@app.get("/health")
def health():
    return {"status": "ok"}