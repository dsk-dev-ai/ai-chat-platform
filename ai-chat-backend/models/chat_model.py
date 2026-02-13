from utils.db_utils import get_connection

def create_table():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS chats(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        title TEXT,
        created_at TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
    """)
    conn.commit()
    conn.close()

def create_chat(user_id, title):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO chats (user_id, title, created_at)
    VALUES (?, ?, strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
    """, (user_id, title))
    chat_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return chat_id

def get_chats():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT id, user_id, title, created_at FROM chats
    ORDER BY created_at DESC
    """)
    rows = cursor.fetchall()
    conn.close()

    return [{
        "id": r["id"],
        "userId": r["user_id"],
        "title": r["title"],
        "createdAt": r["created_at"]
    } for r in rows]

def get_chats_by_user(user_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT id, title, created_at FROM chats
    WHERE user_id = ?
    ORDER BY created_at DESC
    """, (user_id,))
    rows = cursor.fetchall()
    conn.close()

    return [{
        "id": r["id"],
        "title": r["title"],
        "createdAt": r["created_at"]
    } for r in rows]

def get_chat_by_id(chat_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT id, title, created_at FROM chats WHERE id = ?
    """, (chat_id,))
    row = cursor.fetchone()
    conn.close()

    return {
        "id": row["id"],
        "title": row["title"],
        "createdAt": row["created_at"]
    } if row else None

def update_chat_title(chat_id, title):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    UPDATE chats SET title = ? WHERE id = ?
    """, (title, chat_id))
    conn.commit()
    conn.close()
