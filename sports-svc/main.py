from fastapi import (FastAPI, HTTPException)
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, text
from sqlalchemy.exc import IntegrityError
import os
import httpx

app = FastAPI(title="sports-svc")

origins = [
    "http://localhost:3000",  # tu frontend en desarrollo
    "http://127.0.0.1:3000",
    "http://frontend:80",  # frontend en Docker
    "http://campuswell-frontend-1:80",  # nombre del contenedor
    # "https://tudominio.com"  # si luego tienes producción
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,         # or ["*"] para permitir todos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


DB_URL = (
    f"mysql+pymysql://{os.getenv('MYSQL_USER')}"
    f":{os.getenv('MYSQL_PASSWORD')}@mysql:3306/{os.getenv('MYSQL_DATABASE')}"
)
engine = create_engine(DB_URL, pool_pre_ping=True)

PSYCH_BASE = os.getenv('PSYCH_BASE', 'http://psych-svc:8081')
http_client = httpx.Client(timeout=5.0)

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

@app.post("/events")
def create_event(event: EventIn):
    with engine.begin() as cn:
        result = cn.execute(
            text("INSERT INTO events(name,type,date,location) VALUES (:name,:type,:date,:location)"),
            {
                "name": event.name,
                "type": event.type,
                "date": event.date,
                "location": event.location
            },
        )
        event_id = result.lastrowid
    return {"id": event_id, "name": event.name, "type": event.type, "date": event.date, "location": event.location}

@app.post("/registrations")
def add_registration(student_id: int, event_id: int):
    # verify student in psych-svc
    try:
        resp = http_client.get(f"{PSYCH_BASE}/api/students/{student_id}")
    except Exception:
        raise HTTPException(status_code=502, detail="psych_unreachable")
    if resp.status_code != 200:
        raise HTTPException(status_code=400, detail="student_not_found")

    try:
        with engine.begin() as cn:
            result = cn.execute(
                text(
                    """
                    INSERT IGNORE INTO registrations(student_id,event_id)
                    VALUES (:s,:e)
                    """
                ),
                {"s": student_id, "e": event_id},
            )
            if result.rowcount == 1:
                return {"ok": True}
            exists = cn.execute(
                text("SELECT 1 FROM registrations WHERE student_id=:s AND event_id=:e LIMIT 1"),
                {"s": student_id, "e": event_id},
            ).first()
            if exists:
                raise HTTPException(status_code=409, detail="registration_exists")
            raise HTTPException(status_code=400, detail="invalid_event")
    except IntegrityError as e:
        code = None
        try:
            code = e.orig.args[0]
        except Exception:
            pass
        msg = str(getattr(e, "orig", e))
        if code == 1452 or "1452" in msg:
            raise HTTPException(status_code=400, detail="invalid_event")
        if code == 1062 or "1062" in msg:
            raise HTTPException(status_code=409, detail="registration_exists")
        raise HTTPException(status_code=500, detail="db_error")
    return {"ok": True}

@app.get("/health")
def health():
    try:
        # Test database connection
        with engine.begin() as cn:
            cn.execute(text("SELECT 1"))
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        return {"status": "error", "database": "disconnected", "error": str(e)}

@app.get("/debug/db")
def debug_db():
    try:
        with engine.begin() as cn:
            # Test basic connection
            result = cn.execute(text("SELECT 1 as test"))
            test_result = result.fetchone()
            
            # Check if tables exist
            tables = cn.execute(text("SHOW TABLES")).fetchall()
            table_names = [list(row.values())[0] for row in tables]
            
            # Count records in each table
            counts = {}
            for table in table_names:
                count_result = cn.execute(text(f"SELECT COUNT(*) as count FROM {table}"))
                counts[table] = count_result.fetchone()[0]
            
            return {
                "status": "ok",
                "connection_test": test_result[0] if test_result else None,
                "tables": table_names,
                "record_counts": counts
            }
    except Exception as e:
        return {"status": "error", "error": str(e)}
