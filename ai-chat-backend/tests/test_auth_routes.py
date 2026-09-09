import hmac
from datetime import datetime, timedelta, timezone

from routes.auth_routes import (
    CODE_TTL,
    _pending_registration_codes,
    get_valid_registration_code,
)


def _seed_code(email, expires_at):
    code = "a1b2c3d4e5f6"
    _pending_registration_codes[email] = {"code": code, "expires": expires_at}
    return code


def test_get_valid_registration_code_returns_pending():
    code = _seed_code("user@example.com", datetime.now(timezone.utc) + CODE_TTL)
    assert get_valid_registration_code("user@example.com") == code


def test_get_valid_registration_code_expired_removed():
    _seed_code("expired@example.com", datetime.now(timezone.utc) - timedelta(seconds=1))
    assert get_valid_registration_code("expired@example.com") is None
    assert "expired@example.com" not in _pending_registration_codes


def test_get_valid_registration_code_missing_email():
    assert get_valid_registration_code("ghost@example.com") is None


def test_registration_flow(app_client):
    client = app_client

    res = client.post("/api/send-verification", json={"email": "jane@example.com"})
    assert res.status_code == 200
    body = res.get_json()
    assert body["code"]

    res = client.post(
        "/api/register",
        json={
            "email": "jane@example.com",
            "password": "supersecret",
            "code": body["code"],
        },
    )
    assert res.status_code == 200
    assert res.get_json()["message"] == "Registered successfully"


def test_register_rejects_wrong_code(app_client):
    client = app_client
    client.post("/api/send-verification", json={"email": "bob@example.com"})

    res = client.post(
        "/api/register",
        json={"email": "bob@example.com", "password": "pw", "code": "wrong-code"},
    )
    assert res.status_code == 400
    assert res.get_json()["error"] == "Invalid or expired registration code"


def test_register_requires_fields(app_client):
    res = app_client.post("/api/register", json={"email": "x@y.com"})
    assert res.status_code == 400
    assert res.get_json()["error"] == "Email, password, and registration code required"


def test_login_success(app_client):
    client = app_client

    # Register a user, then log in with the same credentials.
    res = client.post("/api/send-verification", json={"email": "login@example.com"})
    code = res.get_json()["code"]
    client.post(
        "/api/register",
        json={"email": "login@example.com", "password": "pw", "code": code},
    )

    res = client.post("/api/auth/login", json={"email": "login@example.com", "password": "pw"})
    assert res.status_code == 200
    token = res.get_json()["token"]
    assert len(token) > 10


def test_login_rejects_wrong_password(app_client):
    client = app_client

    res = client.post("/api/send-verification", json={"email": "wrongpw@example.com"})
    code = res.get_json()["code"]
    client.post(
        "/api/register",
        json={"email": "wrongpw@example.com", "password": "pw", "code": code},
    )

    res = client.post(
        "/api/auth/login", json={"email": "wrongpw@example.com", "password": "nope"}
    )
    assert res.status_code == 401


def test_login_requires_credentials(app_client):
    res = app_client.post("/api/auth/login", json={})
    assert res.status_code == 400
    assert res.get_json()["error"] == "Email and password required"


def test_get_user_id_from_token(app_client):
    import jwt
    from config import Config
    from utils.auth_utils import get_user_id_from_token

    from app import app

    token = jwt.encode(
        {"user_id": 42}, Config.SECRET_KEY, algorithm="HS256"
    )
    with app.test_request_context(headers={"Authorization": f"Bearer {token}"}):
        assert get_user_id_from_token() == 42

    with app.test_request_context():
        assert get_user_id_from_token() is None

    bad = jwt.encode({"user_id": 42}, "not-the-right-secret", algorithm="HS256")
    with app.test_request_context(headers={"Authorization": f"Bearer {bad}"}):
        assert get_user_id_from_token() is None