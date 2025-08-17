from flask import Blueprint, request, jsonify
from config import ALLOWED_LANGS
from services.session_store import create_session
from services.safety import localized_system_prompt

session_bp = Blueprint("session", __name__)

@session_bp.route("/api/session", methods=["POST"])
def new_session():
    data = request.get_json() or {}
    lang = data.get("language")
    reading = data.get("reading_level", "simple")
    if lang not in ALLOWED_LANGS:
        return jsonify({"error": "Unsupported language"}), 400
    session = create_session(lang, reading)
    # Seed history with localized system prompt
    session["history"].append({"role": "system", "content": localized_system_prompt(lang, reading)})
    msg = {
        "en": "Session created. Hello!",
        "fr": "Session créée. Bonjour !",
        "pt": "Sessão criada. Olá!",
        "es": "Sesión creada. ¡Hola!",
        "sw": "Kikao kimeundwa. Habari!",
        "hi": "सत्र बनाया गया। नमस्ते!"
    }.get(lang, "Session created.")
    return jsonify({
        "session_id": session["session_id"],
        "language": lang,
        "message": msg
    })