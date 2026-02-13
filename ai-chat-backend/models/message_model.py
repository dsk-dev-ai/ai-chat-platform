import sqlite3
from utils.db_utils import get_connection

def create_table():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS messages(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        chat_id INTEGER,
        user_id INTEGER,
        role TEXT,
        content TEXT,
        created_at TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
    """)

    conn.commit()
    conn.close()

def add_message(chat_id, role, content):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO messages (chat_id, role, content, created_at)
    VALUES (?, ?, ?, strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
    """, (chat_id, role, content))
    conn.commit()
    conn.close()

def get_messages_by_chat_id(chat_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT role, content, created_at FROM messages
    WHERE chat_id = ?
    ORDER BY created_at ASC
    """, (chat_id,))
    rows = cursor.fetchall()
    conn.close()

    return [{
        "role": r["role"],
        "content": r["content"],
        "createdAt": r["created_at"]
    } for r in rows]
