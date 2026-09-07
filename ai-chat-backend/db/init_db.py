import sqlite3

def init_db():
    conn = sqlite3.connect("database.db")
    c = conn.cursor()

    # chats table (must match models/chat_model.py)
    c.execute("""
    CREATE TABLE IF NOT EXISTS chats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        title TEXT,
        created_at TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
    """)

    # messages table (must match models/message_model.py)
    c.execute("""
    CREATE TABLE IF NOT EXISTS messages (
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
