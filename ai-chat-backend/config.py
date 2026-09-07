import os
import secrets
import sys
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    SECRET_KEY = secrets.token_hex(32)
    print(
        "WARNING: SECRET_KEY is not set in the environment. "
        "Using a randomly generated key - sessions and tokens will be "
        "invalidated on every restart. Set SECRET_KEY in .env.",
        file=sys.stderr
    )

class Config:
    SECRET_KEY = SECRET_KEY

    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    USE_OPENAI = os.getenv("USE_OPENAI", "false").lower() == "true"
    MODEL = os.getenv("OLLAMA_MODEL", "llama3")

    DB_PATH = "database.db"

    COMPANY_EMAIL = "dx9439331245@gmail.com"  # ⚠ remove + symbol
    EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD", "")
