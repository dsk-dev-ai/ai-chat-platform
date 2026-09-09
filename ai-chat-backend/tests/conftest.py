import os
import sys

import pytest

BACKEND_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BACKEND_ROOT not in sys.path:
    sys.path.insert(0, BACKEND_ROOT)

import utils.db_utils as db_utils  # noqa: E402


@pytest.fixture()
def app_client(monkeypatch, tmp_path):
    """Flask test client backed by an isolated, throwaway SQLite database."""
    db_path = tmp_path / "test.db"
    monkeypatch.setattr(db_utils, "DATABASE", str(db_path))

    import models.user_model
    import models.chat_model
    import models.message_model

    models.user_model.create_table()
    models.chat_model.create_table()
    models.message_model.create_table()

    from app import app

    app.config.update(TESTING=True)
    return app.test_client()