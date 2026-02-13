from flask import Blueprint, request, jsonify
from utils.auth_utils import get_user_id_from_token
from models.user_model import get_all_users, update_user_role

admin_bp = Blueprint("admin", __name__)

@admin_bp.route("/users", methods=["GET"])
def get_users():
    user_id = get_user_id_from_token()
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    # TODO: Check if user is admin
    users = get_all_users()
    return jsonify(users)

@admin_bp.route("/users/<int:user_id>/role", methods=["PUT"])
def update_user_role_route(user_id):
    current_user_id = get_user_id_from_token()
    if not current_user_id:
        return jsonify({"error": "Unauthorized"}), 401
    # TODO: Check if current user is admin
    data = request.json
    role = data.get("role")
    if not role:
        return jsonify({"error": "Role required"}), 400
    update_user_role(user_id, role)
    return jsonify({"message": "Role updated successfully"})
