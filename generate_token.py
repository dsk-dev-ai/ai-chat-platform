import os
import sys
import jwt
from datetime import datetime, timedelta, timezone

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "ai-chat-backend"))
from config import Config

SECRET_KEY = Config.SECRET_KEY

email = "test@example.com"

token = jwt.encode({
    "email": email,
    "exp": datetime.now(timezone.utc) + timedelta(minutes=1)
}, SECRET_KEY, algorithm="HS256")

print(f"Registration token for {email}: {token}")
