import os
import secrets
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv(
        "SECRET_KEY",
        secrets.token_hex(32)   # 🔥 auto-generate strong key
    )

    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    USE_OPENAI = os.getenv("USE_OPENAI", "false").lower() == "true"
    MODEL = os.getenv("OLLAMA_MODEL", "llama3")

    DB_PATH = "database.db"

    COMPANY_EMAIL = "dx9439331245@gmail.com"  # ⚠ remove + symbol
    EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD", "")
