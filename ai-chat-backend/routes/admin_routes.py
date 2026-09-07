from flask import Blueprint, request, jsonify
from utils.auth_utils import get_user_id_from_token
from models.user_model import get_all_users, update_user_role, get_user_by_id

admin_bp = Blueprint("admin", __name__)


def require_admin():
    """Return the current user id if they are a DB-confirmed admin, else None."""
    user_id = get_user_id_from_token()
    if not user_id:
        return None
    user = get_user_by_id(user_id)
    if not user or user.get("role") != "admin":
        return None
    return user_id

@admin_bp.route("/users", methods=["GET"])
def get_users():
    if not require_admin():
        return jsonify({"error": "Unauthorized"}), 401
    users = get_all_users()
    return jsonify(users)

@admin_bp.route("/users/<int:user_id>/role", methods=["PUT"])
def update_user_role_route(user_id):
    if not require_admin():
        return jsonify({"error": "Unauthorized"}), 401
    data = request.json
    role = data.get("role")
    if not role:
        return jsonify({"error": "Role required"}), 400
    update_user_role(user_id, role)
    return jsonify({"message": "Role updated successfully"})
