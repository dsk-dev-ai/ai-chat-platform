from services.limit_service import FREE_CHAT_LIMIT, FREE_CHAT_WINDOW, free_chat_allowed


def test_free_chat_allowed_under_limit():
    assert free_chat_allowed("1.2.3.4") is True


def test_free_chat_allowed_blocks_after_limit():
    ip = "10.0.0.1"
    for _ in range(FREE_CHAT_LIMIT):
        assert free_chat_allowed(ip) is True
    assert free_chat_allowed(ip) is False


def test_free_chat_limits_are_per_ip():
    busy = "192.168.0.1"
    for _ in range(FREE_CHAT_LIMIT):
        free_chat_allowed(busy)
    assert free_chat_allowed("192.168.0.2") is True


def test_free_chat_window_resets_progress(monkeypatch):
    import services.limit_service as limit_service

    ip = "10.1.1.1"
    now = 1000.0

    def fake_time():
        return now

    monkeypatch.setattr(limit_service.time, "time", fake_time)

    for _ in range(FREE_CHAT_LIMIT):
        assert free_chat_allowed(ip) is True
    assert free_chat_allowed(ip) is False

    now += FREE_CHAT_WINDOW + 1
    assert free_chat_allowed(ip) is True