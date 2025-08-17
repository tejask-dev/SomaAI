from flask import Blueprint, request, jsonify
from services.session_store import get_session, update_session
from services.model_router import route_chat
from services.safety import check_safety, classify_intent
from services.reading_level import adapt_reading_level
from services.glossary import inject_glossary

chat_bp = Blueprint("chat", __name__)

@chat_bp.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json() or {}
    session_id = data.get("session_id")
    message = data.get("message", "")
    if not session_id or not message or len(message) > 1000:
        return jsonify({"error": "Invalid input"}), 400

    session = get_session(session_id)
    if not session:
        return jsonify({"error": "Session not found"}), 404

    # Pre-filter (safety)
    safety_flags = check_safety(message, session["language"])
    if "blocked" in safety_flags:
        return jsonify({"error": "Message violates safety policy."}), 403

    # Intent classification
    intent = classify_intent(message, session["language"])

    # Add user message to history
    session["history"].append({"role": "user", "content": message})

    # Model routing
    ai_resp, model_used, confidence = route_chat(session, message, intent=intent, safety_flags=safety_flags)
    
    # Post-process: reading-level adaptation and glossary
    answer_simple, answer_detailed = adapt_reading_level(ai_resp, session["language"], "simple"), adapt_reading_level(ai_resp, session["language"], "detailed")
    answer_simple = inject_glossary(answer_simple, session["language"])
    answer_detailed = inject_glossary(answer_detailed, session["language"])

    # Add AI message to history (simple version for context)
    session["history"].append({"role": "assistant", "content": answer_simple})
    session["counters"]["messages"] += 1
    # Add tokens logic if needed

    # Trim history if too long (e.g. keep last 10 turns)
    session["history"] = session["history"][-20:]

    return jsonify({
        "answer_simple": answer_simple,
        "answer_detailed": answer_detailed,
        "model_used": model_used,
        "confidence": confidence,
        "reading_level": session["reading_level"]
    })