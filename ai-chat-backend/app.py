from flask import Flask
from flask_cors import CORS
from routes.auth_routes import auth_bp
from routes.chat_routes import chat_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(auth_bp)
app.register_blueprint(chat_bp)

@app.route("/")
def home():
    return {"status": "AI Chat Backend Running"}

if __name__ == "__main__":
    app.run(debug=True)
