import jwt

from config import Config
from routes import chat_routes
from services.limit_service import FREE_CHAT_LIMIT


def _auth_header(user_id):
    token = jwt.encode({"user_id": user_id}, Config.SECRET_KEY, algorithm="HS256")
    return {"Authorization": f"Bearer {token}"}


def test_chat_requires_authentication(app_client):
    res = app_client.post("/api/chat", json={"chat_id": 1, "message": "hello"})
    assert res.status_code == 401
    assert res.get_json()["error"] == "Authentication required"


def test_chat_requires_chat_id_and_message(app_client):
    res = app_client.post("/api/chat", json={"message": "hello"}, headers=_auth_header(1))
    assert res.status_code == 400
    assert res.get_json()["error"] == "chat_id and message are required"


def test_free_chat_validates_message(app_client):
    res = app_client.post("/api/free-chat", json={})
    assert res.status_code == 400
    assert res.get_json()["error"] == "message required"


def test_free_chat_rate_limit_blocks_after_limit(app_client, monkeypatch):
    monkeypatch.setattr(chat_routes, "ask_llm", lambda prompt: "fake reply")

    payload = {"message": "hello"}
    for _ in range(FREE_CHAT_LIMIT):
        res = app_client.post("/api/free-chat", json=payload)
        assert res.status_code == 200
        assert res.get_json()["reply"] == "fake reply"

    res = app_client.post("/api/free-chat", json=payload)
    assert res.status_code == 429
    assert res.get_json()["error"] == "Free chat limit reached. Please try again later."