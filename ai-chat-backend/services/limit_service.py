import sqlite3
from datetime import datetime
from utils.db_utils import get_connection

def allowed(user_id=None):
    if user_id is None:
        # For free chat, allow up to 5 messages per session (simplified, no session tracking)
        return True

    # For logged-in users, check daily limit (20 messages/day)
    conn = get_connection()
    try:
        today = datetime.now().date().isoformat()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT COUNT(*) FROM messages
            WHERE user_id = ? AND DATE(created_at) = ?
        """, (user_id, today))
        count = cursor.fetchone()[0]
        return count < 20
    except Exception as e:
        print(f"Limit check error: {e}")
        return False
    finally:
        conn.close()
