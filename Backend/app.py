import os
from flask import Flask, jsonify
from flask_cors import CORS
from config import SECRET_KEY, CORS_ORIGINS, IS_PRODUCTION, DEBUG

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

# Restrict CORS to allowed origins only — never use CORS(app) with no restrictions
CORS(app, resources={
    r"/api/*": {
        "origins": CORS_ORIGINS,
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization", "X-API-Key"],
        "max_age": 600,
    }
})


@app.after_request
def add_security_headers(response):
    """Apply security headers to every response."""
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
    if IS_PRODUCTION:
        # HSTS: force HTTPS for one year including subdomains
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains; preload"
    return response


# Global error handlers — never leak stack traces or internal detail
@app.errorhandler(404)
def not_found(_e):
    return jsonify({"error": "Resource not found"}), 404


@app.errorhandler(405)
def method_not_allowed(_e):
    return jsonify({"error": "Method not allowed"}), 405


@app.errorhandler(500)
def internal_error(_e):
    return jsonify({"error": "An internal error occurred"}), 500


app.register_blueprint(session_bp)
app.register_blueprint(chat_bp)
app.register_blueprint(lesson_bp)
app.register_blueprint(faq_bp)
app.register_blueprint(language_bp)
app.register_blueprint(health_bp)
app.register_blueprint(tts_bp)
app.register_blueprint(admin_bp)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    # debug=True must never run in production — guarded by config
    app.run(host="0.0.0.0", port=port, debug=DEBUG)