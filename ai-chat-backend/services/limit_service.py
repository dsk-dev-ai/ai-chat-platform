import sqlite3
from datetime import datetime
from collections import defaultdict
import time
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


# In-memory per-IP rate limiting for the unauthenticated /free-chat endpoint.
# Reset on restart; acceptable for a learning app (not a distributed limiter).
_free_chat_log = defaultdict(list)
FREE_CHAT_LIMIT = 5       # max requests per IP
FREE_CHAT_WINDOW = 600    # seconds (10 minutes)

def free_chat_allowed(ip):
    now = time.time()
    cutoff = now - FREE_CHAT_WINDOW
    recent = [t for t in _free_chat_log[ip] if t > cutoff]
    if len(recent) >= FREE_CHAT_LIMIT:
        _free_chat_log[ip] = recent
        return False
    recent.append(now)
    _free_chat_log[ip] = recent
    return True
