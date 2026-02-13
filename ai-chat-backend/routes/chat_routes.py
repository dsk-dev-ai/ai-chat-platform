from flask import Blueprint, request, jsonify
from services.ollama_service import ask_llm
from services.history_service import save_message
from services.limit_service import allowed
from utils.auth_utils import get_user_id_from_token
from models.chat_model import get_chat_by_id, update_chat_title

chat_bp = Blueprint("chat", __name__)

@chat_bp.route("/chat", methods=["POST"])
def chat():
    data = request.json

    chat_id = data["chat_id"]
    user_msg = data["message"]

    user_id = get_user_id_from_token()
    if not allowed(user_id):
        return jsonify({"error": "Daily chat limit reached. Upgrade your plan to continue chatting."}), 429

    save_message(chat_id, "user", user_msg, user_id)

    # Generate topic if chat title is still "New Chat"
    chat = get_chat_by_id(chat_id)
    if chat and chat["title"] == "New Chat":
        # Use first 50 characters of user message as topic, or generate via LLM
        topic = user_msg[:50].strip()
        if len(topic) < 10:  # If too short, try to generate a better title
            try:
                topic_prompt = f"Generate a short, concise title (max 10 words) for a conversation starting with: '{user_msg}'"
                topic = ask_llm(topic_prompt)[:50].strip()
            except:
                pass  # Fallback to original
        update_chat_title(chat_id, topic)

    reply = ask_llm(user_msg)

    save_message(chat_id, "ai", reply, user_id)

    return jsonify({"reply": reply})

@chat_bp.route("/free-chat", methods=["POST"])
def free_chat():
    data = request.json
    user_msg = data["message"]

    # For free chat, no user_id, so no limit check (handled in frontend)
    reply = ask_llm(user_msg)

    return jsonify({"reply": reply})
