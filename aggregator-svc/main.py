from fastapi import FastAPI
import httpx, os

app = FastAPI(title="aggregator-svc")

PSY = os.getenv('PSYCH_BASE','http://psych-svc:8081')
SPO = os.getenv('SPORTS_BASE','http://sports-svc:8082')
HAB = os.getenv('HABITS_BASE','http://habits-svc:8083')

client = httpx.Client(timeout=5.0)

@app.get('/wellbeing/{student_id}/overview')
def overview(student_id:int):
    s = client.get(f"{PSY}/api/students/{student_id}").json()
    h = client.get(f"{PSY}/api/students/{student_id}/history").json()
    r = client.get(f"{HAB}/habits/{student_id}").json()
    return {"student": s, "appointments": h, "habits": r}

@app.post('/wellbeing/recommendation')
def rec(student_id:int):
    habits = client.get(f"{HAB}/habits/{student_id}").json()
    # Convert mood strings to numeric values for calculation
    mood_values = []
    for habit in habits:
        mood = habit.get('mood', '')
        if mood == 'excellent': mood_values.append(5)
        elif mood == 'good': mood_values.append(4)
        elif mood == 'neutral': mood_values.append(3)
        elif mood == 'bad': mood_values.append(2)
        elif mood == 'terrible': mood_values.append(1)
        else: mood_values.append(3)  # default to neutral
    
    avg_mood = sum(mood_values) / max(1, len(mood_values))
    events = client.get(f"{SPO}/events?type=sport").json()
    suggestion = events[0] if events else None
    return {"avg_mood": avg_mood, "suggested_event": suggestion}

@app.get('/health')
def health():
    return {"status":"ok"}