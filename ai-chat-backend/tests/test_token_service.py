from services.token_service import count_tokens


def test_count_tokens_empty():
    assert count_tokens("") == 0


def test_count_tokens_whitespace():
    assert count_tokens("   ") == 0


def test_count_tokens_single_word():
    assert count_tokens("hello") == 1


def test_count_tokens_multiple_words():
    assert count_tokens("how are you today friends") == 5