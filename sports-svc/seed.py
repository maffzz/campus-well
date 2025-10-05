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

EVENT_TYPES = [
    'sport', 'wellness', 'social', 'academic'
]
LOCATIONS = [
    'Sports Complex', 'Main Field', 'Tennis Courts', 'Volleyball Court',
    'Swimming Pool', 'Library Room 101', 'Main Auditorium', 'Conference Room A'
]

def seed_events(num_rows: int = 20000):
    engine = create_engine(DB_URL, pool_pre_ping=True, connect_args={"auth_plugin": "mysql_native_password"})
    inserted = 0
    batch = []
    with engine.begin() as cn:
        while inserted < num_rows:
            name = f"{fake.word().title()} {fake.word().title()}"
            etype = random.choice(EVENT_TYPES)
            date = fake.date_time_between(start_date='-365d', end_date='+90d').strftime('%Y-%m-%d %H:%M:%S')
            location = random.choice(LOCATIONS)
            batch.append({
                'name': name,
                'type': etype,
                'date': date,
                'location': location,
            })
            if len(batch) >= 1000:
                cn.execute(
                    text("""
                        INSERT INTO events(name,type,date,location)
                        VALUES (:name,:type,:date,:location)
                    """),
                    batch
                )
                inserted += len(batch)
                batch.clear()
        if batch:
            cn.execute(
                text("""
                    INSERT INTO events(name,type,date,location)
                    VALUES (:name,:type,:date,:location)
                """),
                batch
            )
            inserted += len(batch)
    print(f"inserted {inserted} events")

if __name__ == '__main__':
    seed_events()