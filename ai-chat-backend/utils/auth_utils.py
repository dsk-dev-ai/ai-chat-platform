import jwt
from flask import request
from config import Config

def get_user_id_from_token():
    token = request.headers.get('Authorization')
    if not token:
        return None
    try:
        token = token.replace('Bearer ', '')
        payload = jwt.decode(token, Config.SECRET_KEY, algorithms=['HS256'])
        return payload['user_id']
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
