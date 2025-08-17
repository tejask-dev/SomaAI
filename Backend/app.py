from flask import Flask
from flask_cors import CORS
from config import SECRET_KEY

from routes.session import session_bp
from routes.chat import chat_bp
from routes.lesson import lesson_bp
from routes.faq import faq_bp
from routes.language import language_bp
from routes.health import health_bp
from routes.tts import tts_bp
from routes.admin import admin_bp

app = Flask(__name__)
app.secret_key = SECRET_KEY
CORS(app)

app.register_blueprint(session_bp)
app.register_blueprint(chat_bp)
app.register_blueprint(lesson_bp)
app.register_blueprint(faq_bp)
app.register_blueprint(language_bp)
app.register_blueprint(health_bp)
app.register_blueprint(tts_bp)
app.register_blueprint(admin_bp)

if __name__ == "__main__":
    app.run(debug=True)