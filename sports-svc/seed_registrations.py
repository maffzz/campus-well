from sqlalchemy import create_engine, text
from faker import Faker
import os, random

MYSQL_HOST = os.getenv('MYSQL_HOST', 'localhost')
DB_URL = (
    f"mysql+pymysql://{os.getenv('MYSQL_USER','campus')}:"
    f"{os.getenv('MYSQL_PASSWORD','campus')}@{MYSQL_HOST}:3306/"
    f"{os.getenv('MYSQL_DATABASE','campuswell')}"
)

fake = Faker()

def load_event_ids(cn):
    rows = cn.execute(text("SELECT id FROM events"))
    return [r[0] for r in rows]

def seed_registrations(num_rows: int = 20000, max_student_id: int = 5000):
    engine = create_engine(DB_URL, pool_pre_ping=True)
    inserted = 0
    with engine.begin() as cn:
        event_ids = load_event_ids(cn)
        if not event_ids:
            raise RuntimeError("No events found. Seed events first.")
        batch = []
        while inserted < num_rows:
            student_id = random.randint(1, max_student_id)
            event_id = random.choice(event_ids)
            batch.append({'s': student_id, 'e': event_id})
            if len(batch) >= 1000:
                cn.execute(
                    text("""
                        INSERT IGNORE INTO registrations(student_id,event_id)
                        VALUES (:s,:e)
                    """),
                    batch
                )
                inserted += len(batch)
                batch.clear()
        if batch:
            cn.execute(
                text("""
                    INSERT IGNORE INTO registrations(student_id,event_id)
                    VALUES (:s,:e)
                """),
                batch
            )
            inserted += len(batch)
    print(f"Inserted (attempted) {inserted} registrations")

if __name__ == '__main__':
    seed_registrations()