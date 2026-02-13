from utils.db_utils import get_connection

def create_table():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT DEFAULT 'user'
    )
    """)
    conn.commit()
    conn.close()

def create_user(email, password, role='user'):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO users (email, password, role)
    VALUES (?, ?, ?)
    """, (email, password, role))
    conn.commit()
    conn.close()

def get_user_by_email(email):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT id, email, password, role FROM users WHERE email = ?
    """, (email,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def get_user_by_id(user_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT id, email, password, role FROM users WHERE id = ?
    """, (user_id,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def get_all_users():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT id, email, role FROM users
    """)
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def update_user_role(user_id, role):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    UPDATE users SET role = ? WHERE id = ?
    """, (role, user_id))
    conn.commit()
    conn.close()
