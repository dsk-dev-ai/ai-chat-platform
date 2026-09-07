from flask import Blueprint, jsonify, request
from services.history_service import get_chat_history
from models.chat_model import get_chats_by_user, get_chat_by_id, create_chat
from utils.auth_utils import get_user_id_from_token

history_bp = Blueprint("history", __name__)

@history_bp.route("/history/<int:chat_id>")
def history(chat_id):
    user_id = get_user_id_from_token()
    if not user_id:
        return jsonify({"error": "Authentication required"}), 401

    chat = get_chat_by_id(chat_id)
    if not chat or chat["user_id"] != user_id:
        return jsonify({"error": "Chat not found"}), 404

    return jsonify(get_chat_history(chat_id))

@history_bp.route("/chats")
def get_user_chats():
    user_id = get_user_id_from_token()
    if not user_id:
        return jsonify({"error": "Authentication required"}), 401
    chats = get_chats_by_user(user_id)
    return jsonify(chats)

@history_bp.route("/chats", methods=["POST"])
def create_user_chat():
    user_id = get_user_id_from_token()
    if not user_id:
        return jsonify({"error": "Authentication required"}), 401
    data = request.get_json()
    title = data.get("title", "New Chat")
    chat_id = create_chat(user_id, title)
    return jsonify({"chat_id": chat_id})
