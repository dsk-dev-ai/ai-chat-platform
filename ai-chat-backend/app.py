from flask import Flask
from flask_cors import CORS

from routes.auth_routes import auth_bp
from routes.chat_routes import chat_bp
from routes.history_routes import history_bp
from routes.user_routes import user_bp
from routes.admin_routes import admin_bp

from models.user_model import create_table as user_table
from models.chat_model import create_table as chat_table
from models.message_model import create_table as msg_table

app = Flask(__name__)
CORS(app)

print(app.url_map)

# Initialize database tables
try:
    user_table()
    chat_table()
    msg_table()
except Exception as e:
    print(f"Error initializing database tables: {e}")
    

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api')
app.register_blueprint(chat_bp, url_prefix='/api')
app.register_blueprint(history_bp, url_prefix='/api')
app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(admin_bp, url_prefix='/api')

# Error handlers
@app.errorhandler(400)
def bad_request(error):
    return {"error": "Bad request"}, 400

@app.errorhandler(404)
def not_found(error):
    return {"error": "Not found"}, 404

@app.errorhandler(500)
def internal_error(error):
    return {"error": "Internal server error"}, 500

if __name__ == "__main__":
    app.run(debug=True)
