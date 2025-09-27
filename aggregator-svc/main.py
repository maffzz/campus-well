from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
import httpx, os

app = FastAPI(title="aggregator-svc")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://frontend:80", "http://campuswell-frontend-1:80"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# URLs de microservicios
PSY = os.getenv("PSYCH_BASE", "http://psych-svc:8081")
SPO = os.getenv("SPORTS_BASE", "http://sports-svc:8082")
HAB = os.getenv("HABITS_BASE", "http://habits-svc:8083")

client = httpx.Client(timeout=10.0, limits=httpx.Limits(max_connections=100, max_keepalive_connections=20))

@app.get("/wellbeing/{student_id}/overview")
def overview(student_id: int):
    """Resumen completo de un estudiante"""
    try:
        student = client.get(f"{PSY}/api/students/{student_id}").json()
        history = client.get(f"{PSY}/api/students/{student_id}/history").json()
        habits = client.get(f"{HAB}/habits/{student_id}").json()
        return {"student": student, "appointments": history, "habits": habits}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/wellbeing/recommendation")
def recommendation(student_id: int):
    """Recomendación de actividad según hábitos y estado de ánimo"""
    try:
        habits = client.get(f"{HAB}/habits/{student_id}").json()
        mood_values = []
        for h in habits:
            mood = h.get("mood", "neutral")
            mood_values.append({
                "excellent": 5,
                "good": 4,
                "neutral": 3,
                "bad": 2,
                "terrible": 1
            }.get(mood, 3))
        avg_mood = sum(mood_values) / max(1, len(mood_values))
        events = client.get(f"{SPO}/events?type=sport").json()
        suggestion = events[0] if events else None
        return {"avg_mood": avg_mood, "suggested_event": suggestion}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ========== EVENTOS ==========
@app.get("/events")
def list_events(type: str = None):
    """Listar eventos deportivos"""
    try:
        url = f"{SPO}/events" + (f"?type={type}" if type else "")
        return client.get(url).json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/events")
def create_event(event_data: dict = Body(...)):
    """Crear nuevo evento deportivo"""
    try:
        resp = client.post(f"{SPO}/events", json=event_data)
        resp.raise_for_status()
        return resp.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/registrations")
def register_for_event(student_id: int, event_id: int):
    """Registrar estudiante en evento"""
    try:
        resp = client.post(
            f"{SPO}/registrations",
            params={"student_id": student_id, "event_id": event_id}
        )
        resp.raise_for_status()
        return resp.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ========== CITAS ==========
@app.post("/appointments")
def create_appointment(appointment_data: dict = Body(...)):
    """Crear nueva cita psicológica"""
    try:
        resp = client.post(f"{PSY}/api/appointments", json=appointment_data)
        resp.raise_for_status()
        return resp.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ========== HÁBITOS ==========
@app.post("/habits")
def create_habit(habit_data: dict = Body(...)):
    """Crear nuevo hábito"""
    try:
        resp = client.post(f"{HAB}/habits", json=habit_data)
        resp.raise_for_status()
        return resp.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ========== HEALTH ==========
@app.get("/health")
def health():
    return {"status": "ok"}
