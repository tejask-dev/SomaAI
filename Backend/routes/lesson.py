from flask import Blueprint, request, jsonify
from services.session_store import get_session
from services.model_router import generate_lesson
from services.youtube import get_lesson_videos

lesson_bp = Blueprint("lesson", __name__)

@lesson_bp.route("/api/lesson", methods=["POST"])
def lesson():
    data = request.get_json() or {}
    session_id = data.get("session_id")
    topic = data.get("topic", "")
    if not session_id or not topic:
        return jsonify({"error": "Missing session or topic"}), 400
    session = get_session(session_id)
    if not session:
        return jsonify({"error": "Session not found"}), 404

    lesson_json, model_used = generate_lesson(session, topic)
    videos = get_lesson_videos(topic, session["language"])
    # Optionally, add TTS here if enabled

    return jsonify({
        "lesson": lesson_json,
        "videos": videos,
        "model_used": model_used
    })