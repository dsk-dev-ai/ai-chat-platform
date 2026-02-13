from flask import Blueprint, jsonify, request
import jwt
from config import Config
from models.user_model import get_user_by_id

user_bp = Blueprint("user", __name__)


@user_bp.route("/user/me", methods=["GET"])
def get_current_user():
    auth_header = request.headers.get("Authorization")

    if not auth_header:
        return jsonify({"error": "Missing token"}), 401

    try:
        token = auth_header.split(" ")[1]
        payload = jwt.decode(token, Config.SECRET_KEY, algorithms=["HS256"])
        user_id = payload["user_id"]
    except Exception:
        return jsonify({"error": "Invalid token"}), 401

    user = get_user_by_id(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    # ✅ FIXED HERE — use dictionary keys
    return jsonify({
        "id": user["id"],
        "email": user["email"],
        "role": user.get("role", "user")
    })
