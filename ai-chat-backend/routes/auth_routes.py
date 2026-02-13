import jwt
from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash

from models.user_model import get_user_by_email
from utils.db_utils import get_connection
from config import Config

auth_bp = Blueprint("auth", __name__)


# ================= SEND VERIFICATION =================

@auth_bp.route("/send-verification", methods=["POST"])
def send_verification():
    data = request.json
    email = data.get("email")

    if not email:
        return jsonify({"error": "Email required"}), 400

    # Generate verification token (10 min expiry)
    token = jwt.encode(
        {
            "email": email,
            "exp": datetime.utcnow() + timedelta(minutes=10)
        },
        Config.SECRET_KEY,
        algorithm="HS256"
    )

    return jsonify({
        "message": "Copy this token to complete your registration",
        "token": token
    })


# ================= REGISTER =================

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    token = data.get("token")

    if not email or not password or not token:
        return jsonify({"error": "Email, password, and token required"}), 400

    # Verify token
    try:
        payload = jwt.decode(token, Config.SECRET_KEY, algorithms=["HS256"])
        if payload["email"] != email:
            return jsonify({"error": "Token email mismatch"}), 400
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token expired"}), 400
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 400

    if get_user_by_email(email):
        return jsonify({"error": "User already exists"}), 400

    db = get_connection()
    try:
        db.execute(
            "INSERT INTO users (email, password) VALUES (?, ?)",
            (email, generate_password_hash(password))
        )
        db.commit()
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
        "exp": datetime.utcnow() + timedelta(hours=24)
    }, Config.SECRET_KEY, algorithm="HS256")

    return jsonify({"token": token})


# ================= LOGOUT =================

@auth_bp.route("/auth/logout", methods=["POST"])
def logout():
    return jsonify({"message": "Logged out successfully"})
