from flask import Blueprint, request, jsonify
from services.ollama_service import ask_ai

chat_bp = Blueprint("chat", __name__)

@chat_bp.route("/api/chat", methods=["POST"])
def chat():
    data = request.json
    message = data["message"]

    reply = ask_ai(message)

    return jsonify({
        "reply": reply
    })
