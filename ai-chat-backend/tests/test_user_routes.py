import jwt

from config import Config
from models.user_model import create_user


def _auth_header(user_id):
    token = jwt.encode({"user_id": user_id}, Config.SECRET_KEY, algorithm="HS256")
    return {"Authorization": f"Bearer {token}"}


def test_user_me_success(app_client):
    create_user("me@example.com", "hashed", role="admin")

    res = app_client.get("/api/user/me", headers=_auth_header(1))
    assert res.status_code == 200
    body = res.get_json()
    assert body["email"] == "me@example.com"
    assert body["role"] == "admin"


def test_user_me_missing_token(app_client):
    res = app_client.get("/api/user/me")
    assert res.status_code == 401
    assert res.get_json()["error"] == "Missing token"


def test_user_me_invalid_token(app_client):
    res = app_client.get("/api/user/me", headers=_auth_header(999))
    assert res.status_code == 404
    assert res.get_json()["error"] == "User not found"