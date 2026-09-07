import hmac
import secrets
import jwt
from datetime import datetime, timedelta, timezone
from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash

from models.user_model import get_user_by_email
from utils.db_utils import get_connection
from config import Config

auth_bp = Blueprint("auth", __name__)


# One-time registration codes, stored server-side (memory only).
# NOTE: These are lost on restart and are not persisted. For production,
# store them in a database or send them via real email.
_pending_registration_codes = {}
CODE_TTL = timedelta(minutes=10)


def get_valid_registration_code(email):
    pending = _pending_registration_codes.get(email)
    if not pending:
        return None
    if pending["expires"] < datetime.now(timezone.utc):
        del _pending_registration_codes[email]
        return None
    return pending["code"]


# ================= SEND VERIFICATION =================

@auth_bp.route("/send-verification", methods=["POST"])
def send_verification():
    data = request.json or {}
    email = (data.get("email") or "").strip()

    if not email:
        return jsonify({"error": "Email required"}), 400

    if get_user_by_email(email):
        return jsonify({"error": "User already exists"}), 400

    # Generate a random one-time registration code server-side.
    # This is NOT a signed JWT - it is a single-use code bound to this email
    # and cannot be minted by the client.
    code = secrets.token_hex(6)
    _pending_registration_codes[email] = {
        "code": code,
        "expires": datetime.now(timezone.utc) + CODE_TTL
    }

    return jsonify({
        "message": "Registration code generated. Enter it to complete your registration.",
        "code": code,
        "expires_in": "10 minutes"
    })


# ================= REGISTER =================

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json or {}
    email = (data.get("email") or "").strip()
    password = data.get("password")
    code = data.get("code") or data.get("token")  # accept both for frontend compat

    if not email or not password or not code:
        return jsonify({"error": "Email, password, and registration code required"}), 400

    # Validate the one-time registration code before creating a user
    stored_code = get_valid_registration_code(email)
    if not stored_code or not hmac.compare_digest(str(stored_code), str(code)):
        return jsonify({"error": "Invalid or expired registration code"}), 400

    if get_user_by_email(email):
        return jsonify({"error": "User already exists"}), 400

    db = get_connection()
    try:
        db.execute(
            "INSERT INTO users (email, password) VALUES (?, ?)",
            (email, generate_password_hash(password))
        )
        db.commit()
        del _pending_registration_codes[email]  # consume the one-time code
        return jsonify({"message": "Registered successfully"})
    except Exception:
        db.rollback()
        return jsonify({"error": "Registration failed"}), 400
    finally:
        db.close()


# ================= LOGIN =================

@auth_bp.route("/auth/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    user = get_user_by_email(email)

    if not user:
        return jsonify({"error": "Invalid credentials"}), 401

    if not check_password_hash(user["password"], password):
        return jsonify({"error": "Invalid credentials"}), 401

    # Generate login JWT token (24 hours)
    token = jwt.encode({
        "user_id": user["id"],
        "exp": datetime.now(timezone.utc) + timedelta(hours=24)
    }, Config.SECRET_KEY, algorithm="HS256")

    return jsonify({"token": token})


# ================= LOGOUT =================

@auth_bp.route("/auth/logout", methods=["POST"])
def logout():
    return jsonify({"message": "Logged out successfully"})
