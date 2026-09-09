import config


def test_config_has_secret_key():
    assert isinstance(config.Config.SECRET_KEY, str)
    assert len(config.Config.SECRET_KEY) >= 32


def test_config_default_model():
    assert config.Config.MODEL == "llama3"


def test_config_use_openai_defaults_false():
    assert config.Config.USE_OPENAI is False


def test_config_db_path():
    assert config.Config.DB_PATH == "database.db"