import jwt
from datetime import datetime, timedelta, timezone
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "default_secret_key_for_testing")

email = "test@example.com"

token = jwt.encode({
    "email": email,
    "exp": datetime.now(timezone.utc) + timedelta(minutes=1)
}, SECRET_KEY, algorithm="HS256")

print(f"Registration token for {email}: {token}")
