import sqlite3
from utils.db_utils import get_connection


def get_chat_history(chat_id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT role, content
        FROM messages
        WHERE chat_id = ?
        ORDER BY created_at ASC
        """,
        (chat_id,)
    )

    rows = cursor.fetchall()
    conn.close()

    return [
        {"role": r[0], "content": r[1]}
        for r in rows
    ]


def save_message(chat_id, role, content, user_id=None):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO messages (chat_id, user_id, role, content, created_at)
        VALUES (?, ?, ?, ?, datetime('now'))
        """,
        (chat_id, user_id, role, content)
    )

    conn.commit()
    conn.close()

def get_chat_history_with_user(chat_id, user_id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT role, content
        FROM messages
        WHERE chat_id = ? AND (user_id IS NULL OR user_id = ?)
        ORDER BY created_at ASC
        """,
        (chat_id, user_id)
    )

    rows = cursor.fetchall()
    conn.close()

    return [
        {"role": r[0], "content": r[1]}
        for r in rows
    ]
