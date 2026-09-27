import time
from contextlib import contextmanager
from typing import Generator
import psycopg2
from psycopg2 import pool
from psycopg2.extras import RealDictCursor
from backend.config import settings

_db_pool: pool.SimpleConnectionPool | None = None


def init_db_pool(minconn: int = 1, maxconn: int = 10, retries: int = 5, delay: float = 2.0):
    global _db_pool
    if _db_pool is not None:
        return _db_pool

    for attempt in range(1, retries + 1):
        try:
            _db_pool = pool.SimpleConnectionPool(
                minconn,
                maxconn,
                host=settings.POSTGRES_HOST,
                port=settings.POSTGRES_PORT,
                dbname=settings.POSTGRES_DB,
                user=settings.POSTGRES_USER,
                password=settings.POSTGRES_PASSWORD,
            )
            print("Database connection pool initialized.")
            return _db_pool
        except psycopg2.OperationalError as e:
            if attempt == retries:
                raise RuntimeError(f"Could not connect to PostgreSQL after {retries} attempts: {e}")
            print(f"[Attempt {attempt}/{retries}] Waiting for database...")
            time.sleep(delay)


def close_db_pool():
    global _db_pool
    if _db_pool is not None:
        _db_pool.closeall()
        _db_pool = None
        print("Database connection pool closed.")


@contextmanager
def get_db_cursor() -> Generator[RealDictCursor, None, None]:
    """Provides a database cursor that returns rows as Python dictionaries."""
    global _db_pool
    if _db_pool is None:
        init_db_pool()

    conn = _db_pool.getconn()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            yield cur
            conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        _db_pool.putconn(conn)
