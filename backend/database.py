import duckdb
import os
from pathlib import Path

DB_PATH = Path(__file__).parent / "invoice_ledger.duckdb"


def get_connection() -> duckdb.DuckDBPyConnection:
    if not DB_PATH.exists():
        raise FileNotFoundError(
            f"Database not found at {DB_PATH}. "
            "Please run: cd data && dbt seed && dbt run"
        )
    return duckdb.connect(str(DB_PATH), read_only=True)


def query(sql: str, params: list = None) -> list[dict]:
    conn = get_connection()
    try:
        result = conn.execute(sql, params or [])
        columns = [desc[0] for desc in result.description]
        rows = result.fetchall()
        return [dict(zip(columns, row)) for row in rows]
    finally:
        conn.close()
