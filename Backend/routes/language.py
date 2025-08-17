from flask import Blueprint, request, jsonify
from config import ALLOWED_LANGS
from services.session_store import get_session, reset_session
from services.safety import localized_system_prompt

language_bp = Blueprint("language", __name__)

@language_bp.route("/api/language", methods=["POST"])
def switch_language():
    data = request.get_json() or {}
    session_id = data.get("session_id")
    lang = data.get("language")
    if not session_id or lang not in ALLOWED_LANGS:
        return jsonify({"error": "Invalid input"}), 400
    session = get_session(session_id)
    if not session:
        return jsonify({"error": "Session not found"}), 404
    reset_session(session_id, lang)
    # Seed
    session["history"].append({"role": "system", "content": localized_system_prompt(lang, session["reading_level"])})
    msg = {
        "en": "Language changed to English. New conversation started.",
        "fr": "Langue changée en français. Nouvelle conversation.",
        "pt": "Idioma alterado para Português. Nova conversa iniciada.",
        "es": "Idioma cambiado a español. Nueva conversación.",
        "sw": "Lugha imebadilishwa. Mazungumzo mapya yameanza.",
        "hi": "भाषा हिंदी में बदल गई है। नई बातचीत शुरू हुई।"
    }.get(lang, "Language changed. New conversation.")
    return jsonify({"message": msg})