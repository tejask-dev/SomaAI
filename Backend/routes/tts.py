from flask import Blueprint, request, jsonify
from config import ENABLE_TTS

tts_bp = Blueprint("tts", __name__)

@tts_bp.route("/api/tts", methods=["POST"])
def tts():
    if not ENABLE_TTS:
        return jsonify({"error": "TTS not enabled"}), 404
    data = request.get_json() or {}
    text = data.get("text", "")
    lang = data.get("lang", "en")
    # Stub: return fake audio URL
    return jsonify({"audio_url": f"https://fake-audio.somaai/{lang}/hash_of_{text[:10]}.mp3"})