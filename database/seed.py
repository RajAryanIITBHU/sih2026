"""
RailSync Database Seeder
Seeds PostgreSQL with corridor infrastructure, assets, timetables, and forecasts.
"""

import os
import sys
import json
import time
from pathlib import Path
import psycopg2
from psycopg2.extras import execute_batch
from dotenv import load_dotenv

# Ensure UTF-8 output on Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

# Load environment variables
load_dotenv()

DB_HOST = os.getenv("POSTGRES_HOST", "localhost")
DB_PORT = int(os.getenv("POSTGRES_PORT", "5432"))
DB_NAME = os.getenv("POSTGRES_DB", "railsync")
DB_USER = os.getenv("POSTGRES_USER", "postgres")
DB_PASSWORD = os.getenv("POSTGRES_PASSWORD", "postgres")

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
SCHEMA_FILE = BASE_DIR / "database" / "schema.sql"


def get_connection(retries: int = 10, delay: float = 2.0):
    """Establishes connection to PostgreSQL with retry logic."""
    for attempt in range(1, retries + 1):
        try:
            conn = psycopg2.connect(
                host=DB_HOST,
                port=DB_PORT,
                dbname=DB_NAME,
                user=DB_USER,
                password=DB_PASSWORD,
            )
            return conn
        except psycopg2.OperationalError as e:
            if attempt == retries:
                raise RuntimeError(f"Could not connect to PostgreSQL after {retries} attempts: {e}")
            print(f"[Attempt {attempt}/{retries}] Waiting for PostgreSQL at {DB_HOST}:{DB_PORT}...")
            time.sleep(delay)


def run_schema(conn):
    """Executes the DDL schema to ensure tables exist."""
    print("Applying schema from database/schema.sql...")
    with open(SCHEMA_FILE, "r", encoding="utf-8") as f:
        schema_sql = f.read()
    with conn.cursor() as cur:
        cur.execute(schema_sql)
    conn.commit()
    print("Schema applied successfully.")


def load_json(filename: str):
    """Reads a JSON file from the data directory."""
    filepath = DATA_DIR / filename
    if not filepath.exists():
        print(f"Warning: {filepath} not found.")
        return []
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)


def seed_stations(conn, data):
    query = """
    INSERT INTO stations (station_id, code, name, division, zone, lat, lon, platforms, km_marker)
    VALUES (%(station_id)s, %(code)s, %(name)s, %(division)s, %(zone)s, %(lat)s, %(lon)s, %(platforms)s, %(km_marker)s)
    ON CONFLICT (station_id) DO UPDATE SET
        code = EXCLUDED.code,
        name = EXCLUDED.name,
        division = EXCLUDED.division,
        zone = EXCLUDED.zone,
        lat = EXCLUDED.lat,
        lon = EXCLUDED.lon,
        platforms = EXCLUDED.platforms,
        km_marker = EXCLUDED.km_marker;
    """
    with conn.cursor() as cur:
        execute_batch(cur, query, data)
    conn.commit()
    print(f"  [OK] stations: {len(data)} rows seeded")


def seed_tracks(conn, data):
    query = """
    INSERT INTO tracks (track_id, from_station_id, to_station_id, name, length_km, track_type, max_speed_kmh, electrification, criticality, status)
    VALUES (%(track_id)s, %(from_station_id)s, %(to_station_id)s, %(name)s, %(length_km)s, %(track_type)s, %(max_speed_kmh)s, %(electrification)s, %(criticality)s, %(status)s)
    ON CONFLICT (track_id) DO UPDATE SET
        from_station_id = EXCLUDED.from_station_id,
        to_station_id = EXCLUDED.to_station_id,
        name = EXCLUDED.name,
        length_km = EXCLUDED.length_km,
        track_type = EXCLUDED.track_type,
        max_speed_kmh = EXCLUDED.max_speed_kmh,
        electrification = EXCLUDED.electrification,
        criticality = EXCLUDED.criticality,
        status = EXCLUDED.status;
    """
    with conn.cursor() as cur:
        execute_batch(cur, query, data)
    conn.commit()
    print(f"  [OK] tracks: {len(data)} rows seeded")


def seed_assets(conn, data):
    query = """
    INSERT INTO assets (asset_id, name, department, asset_type, track_id, location_km, health_score, failure_probability, rul_days, criticality, last_inspection_date, overdue_days)
    VALUES (%(asset_id)s, %(name)s, %(department)s, %(asset_type)s, %(track_id)s, %(location_km)s, %(health_score)s, %(failure_probability)s, %(rul_days)s, %(criticality)s, %(last_inspection_date)s, %(overdue_days)s)
    ON CONFLICT (asset_id) DO UPDATE SET
        name = EXCLUDED.name,
        department = EXCLUDED.department,
        asset_type = EXCLUDED.asset_type,
        track_id = EXCLUDED.track_id,
        location_km = EXCLUDED.location_km,
        health_score = EXCLUDED.health_score,
        failure_probability = EXCLUDED.failure_probability,
        rul_days = EXCLUDED.rul_days,
        criticality = EXCLUDED.criticality,
        last_inspection_date = EXCLUDED.last_inspection_date,
        overdue_days = EXCLUDED.overdue_days;
    """
    with conn.cursor() as cur:
        execute_batch(cur, query, data)
    conn.commit()
    print(f"  ✓ assets: {len(data)} rows seeded")


def seed_trains(conn, data):
    query = """
    INSERT INTO trains (train_id, train_name, train_type, origin, destination, priority, max_speed_kmh, current_station_id, next_station_id, status)
    VALUES (%(train_id)s, %(train_name)s, %(train_type)s, %(origin)s, %(destination)s, %(priority)s, %(max_speed_kmh)s, %(current_station_id)s, %(next_station_id)s, %(status)s)
    ON CONFLICT (train_id) DO UPDATE SET
        train_name = EXCLUDED.train_name,
        train_type = EXCLUDED.train_type,
        origin = EXCLUDED.origin,
        destination = EXCLUDED.destination,
        priority = EXCLUDED.priority,
        max_speed_kmh = EXCLUDED.max_speed_kmh,
        current_station_id = EXCLUDED.current_station_id,
        next_station_id = EXCLUDED.next_station_id,
        status = EXCLUDED.status;
    """
    with conn.cursor() as cur:
        execute_batch(cur, query, data)
    conn.commit()
    print(f"  ✓ trains: {len(data)} rows seeded")


def seed_timetable(conn, data):
    query = """
    INSERT INTO timetable_slots (slot_id, train_id, track_id, from_station_id, to_station_id, scheduled_departure, scheduled_arrival, direction, is_critical, corridor_window_available)
    VALUES (%(slot_id)s, %(train_id)s, %(track_id)s, %(from_station_id)s, %(to_station_id)s, %(scheduled_departure)s, %(scheduled_arrival)s, %(direction)s, %(is_critical)s, %(corridor_window_available)s)
    ON CONFLICT (slot_id) DO UPDATE SET
        train_id = EXCLUDED.train_id,
        track_id = EXCLUDED.track_id,
        from_station_id = EXCLUDED.from_station_id,
        to_station_id = EXCLUDED.to_station_id,
        scheduled_departure = EXCLUDED.scheduled_departure,
        scheduled_arrival = EXCLUDED.scheduled_arrival,
        direction = EXCLUDED.direction,
        is_critical = EXCLUDED.is_critical,
        corridor_window_available = EXCLUDED.corridor_window_available;
    """
    with conn.cursor() as cur:
        execute_batch(cur, query, data)
    conn.commit()
    print(f"  ✓ timetable_slots: {len(data)} rows seeded")


def seed_crews(conn, data):
    query = """
    INSERT INTO crews (crew_id, gang_name, department, base_station_id, headcount, lead_supervisor, skills, available, shift_start, shift_end)
    VALUES (%(crew_id)s, %(gang_name)s, %(department)s, %(base_station_id)s, %(headcount)s, %(lead_supervisor)s, %(skills)s, %(available)s, %(shift_start)s, %(shift_end)s)
    ON CONFLICT (crew_id) DO UPDATE SET
        gang_name = EXCLUDED.gang_name,
        department = EXCLUDED.department,
        base_station_id = EXCLUDED.base_station_id,
        headcount = EXCLUDED.headcount,
        lead_supervisor = EXCLUDED.lead_supervisor,
        skills = EXCLUDED.skills,
        available = EXCLUDED.available,
        shift_start = EXCLUDED.shift_start,
        shift_end = EXCLUDED.shift_end;
    """
    with conn.cursor() as cur:
        execute_batch(cur, query, data)
    conn.commit()
    print(f"  ✓ crews: {len(data)} rows seeded")


def seed_goods_forecast(conn, data):
    query = """
    INSERT INTO goods_forecasts (forecast_id, rake_type, origin_station, destination_station, expected_track_id, forecast_entry_time, forecast_exit_time, tonnage, speed_restriction_kmh, flexibility_window_mins)
    VALUES (%(forecast_id)s, %(rake_type)s, %(origin_station)s, %(destination_station)s, %(expected_track_id)s, %(forecast_entry_time)s, %(forecast_exit_time)s, %(tonnage)s, %(speed_restriction_kmh)s, %(flexibility_window_mins)s)
    ON CONFLICT (forecast_id) DO UPDATE SET
        rake_type = EXCLUDED.rake_type,
        origin_station = EXCLUDED.origin_station,
        destination_station = EXCLUDED.destination_station,
        expected_track_id = EXCLUDED.expected_track_id,
        forecast_entry_time = EXCLUDED.forecast_entry_time,
        forecast_exit_time = EXCLUDED.forecast_exit_time,
        tonnage = EXCLUDED.tonnage,
        speed_restriction_kmh = EXCLUDED.speed_restriction_kmh,
        flexibility_window_mins = EXCLUDED.flexibility_window_mins;
    """
    with conn.cursor() as cur:
        execute_batch(cur, query, data)
    conn.commit()
    print(f"  ✓ goods_forecasts: {len(data)} rows seeded")


def seed_maintenance_requests(conn, data):
    query = """
    INSERT INTO maintenance_requests (request_id, source_system, department, asset_id, track_id, description, requested_date, preferred_window_start, preferred_window_end, duration_minutes, priority_score, urgency, status)
    VALUES (%(request_id)s, %(source_system)s, %(department)s, %(asset_id)s, %(track_id)s, %(description)s, %(requested_date)s, %(preferred_window_start)s, %(preferred_window_end)s, %(duration_minutes)s, %(priority_score)s, %(urgency)s, %(status)s)
    ON CONFLICT (request_id) DO UPDATE SET
        source_system = EXCLUDED.source_system,
        department = EXCLUDED.department,
        asset_id = EXCLUDED.asset_id,
        track_id = EXCLUDED.track_id,
        description = EXCLUDED.description,
        requested_date = EXCLUDED.requested_date,
        preferred_window_start = EXCLUDED.preferred_window_start,
        preferred_window_end = EXCLUDED.preferred_window_end,
        duration_minutes = EXCLUDED.duration_minutes,
        priority_score = EXCLUDED.priority_score,
        urgency = EXCLUDED.urgency,
        status = EXCLUDED.status;
    """
    with conn.cursor() as cur:
        execute_batch(cur, query, data)
    conn.commit()
    print(f"  ✓ maintenance_requests: {len(data)} rows seeded")


def seed_weather(conn, data):
    query = """
    INSERT INTO weather_reports (weather_id, station_id, temperature_c, rainfall_mm, wind_speed_kmh, visibility_km, condition, track_risk_factor, recorded_at)
    VALUES (%(weather_id)s, %(station_id)s, %(temperature_c)s, %(rainfall_mm)s, %(wind_speed_kmh)s, %(visibility_km)s, %(condition)s, %(track_risk_factor)s, %(recorded_at)s)
    ON CONFLICT (weather_id) DO UPDATE SET
        station_id = EXCLUDED.station_id,
        temperature_c = EXCLUDED.temperature_c,
        rainfall_mm = EXCLUDED.rainfall_mm,
        wind_speed_kmh = EXCLUDED.wind_speed_kmh,
        visibility_km = EXCLUDED.visibility_km,
        condition = EXCLUDED.condition,
        track_risk_factor = EXCLUDED.track_risk_factor,
        recorded_at = EXCLUDED.recorded_at;
    """
    with conn.cursor() as cur:
        execute_batch(cur, query, data)
    conn.commit()
    print(f"  ✓ weather_reports: {len(data)} rows seeded")


def main():
    print("=" * 50)
    print("RailSync Database Seeding Process Starting...")
    print(f"Connecting to database '{DB_NAME}' on {DB_HOST}:{DB_PORT}...")
    conn = get_connection()
    try:
        run_schema(conn)

        print("\nSeeding datasets from data/*.json:")
        seed_stations(conn, load_json("stations.json"))
        seed_tracks(conn, load_json("tracks.json"))
        seed_assets(conn, load_json("assets.json"))
        seed_trains(conn, load_json("trains.json"))
        seed_timetable(conn, load_json("timetable.json"))
        seed_crews(conn, load_json("crews.json"))
        seed_goods_forecast(conn, load_json("goods_forecast.json"))
        seed_maintenance_requests(conn, load_json("maintenance_requests.json"))
        seed_weather(conn, load_json("weather.json"))

        print("\nVerification counts:")
        tables = [
            "stations", "tracks", "assets", "trains",
            "timetable_slots", "crews", "goods_forecasts",
            "maintenance_requests", "weather_reports"
        ]
        with conn.cursor() as cur:
            for tbl in tables:
                cur.execute(f"SELECT COUNT(*) FROM {tbl};")
                count = cur.fetchone()[0]
                print(f"  - {tbl}: {count} records in database")

        print("\nAll seed data loaded successfully!")
        print("=" * 50)
    finally:
        conn.close()


if __name__ == "__main__":
    main()
