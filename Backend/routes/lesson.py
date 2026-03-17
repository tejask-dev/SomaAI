from flask import Blueprint, request, jsonify
from services.session_store import get_session
from services.model_router import generate_lesson
from services.youtube import get_lesson_videos
from utils.validators import validator
from utils.rate_limiter import lesson_limiter
from utils.logger import logger

lesson_bp = Blueprint("lesson", __name__)


def _get_client_ip() -> str:
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.remote_addr or "unknown"


@lesson_bp.route("/api/lesson", methods=["POST"])
def lesson():
    """Generate an AI lesson for a given topic and session."""
    # IP-based rate limit — lesson generation is an expensive AI operation
    ip = _get_client_ip()
    allowed, _ = lesson_limiter.is_allowed(ip)
    if not allowed:
        logger.warning("Lesson rate limit exceeded", ip=ip)
        return jsonify({"error": "Too many lesson requests. Please wait a moment."}), 429

    data = request.get_json() or {}
    session_id = data.get("session_id")
    topic = data.get("topic", "")

    # Validate session ID
    is_valid, err = validator.validate_session_id(session_id)
    if not is_valid:
        return jsonify({"error": err or "Invalid session ID"}), 400

    # Validate topic
    is_valid, err = validator.validate_topic(topic)
    if not is_valid:
        return jsonify({"error": err or "Invalid topic"}), 400

    session = get_session(session_id)
    if not session:
        return jsonify({"error": "Session not found or expired"}), 404

    try:
        lesson_json, model_used = generate_lesson(session, topic)
        videos = get_lesson_videos(topic, session["language"])

        return jsonify({
            "lesson": lesson_json,
            "videos": videos,
            "model_used": model_used,
        })
    except Exception as e:
        logger.error("Error generating lesson", error=e, topic=topic[:50])
        return jsonify({"error": "Failed to generate lesson. Please try again."}), 500