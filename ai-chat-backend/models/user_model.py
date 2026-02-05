import sqlite3

def create_user_table():
    conn = sqlite3.connect("database.db")
    conn.execute("""
    CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password TEXT,
        plan TEXT DEFAULT 'free',
        daily_count INTEGER DEFAULT 0
    )
    """)
    conn.close()
