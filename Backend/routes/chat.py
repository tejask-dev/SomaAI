"""
Advanced Chat Route
Enhanced with validation, rate limiting, error handling, and all advanced features
"""
from flask import Blueprint, request, jsonify
from services.session_store import get_session, update_session
from services.model_router import route_chat
from services.safety import check_safety, classify_intent, localized_system_prompt
from services.reading_level import adapt_reading_level
from services.glossary import inject_glossary
from services.telemetry import record_request, record_message, record_error, record_safety_block, record_rate_limit
from utils.validators import validator
from utils.rate_limiter import rate_limiter
from utils.logger import logger
import time

chat_bp = Blueprint("chat", __name__)

@chat_bp.route("/api/chat", methods=["POST"])
def chat():
    """
    Advanced chat endpoint with comprehensive validation and error handling
    """
    start_time = time.time()
    record_request()
    
    try:
        # Parse and validate request
        data = request.get_json() or {}
        session_id = data.get("session_id")
        message = data.get("message", "")
        lang = data.get("language")
        
        # Validate session ID
        is_valid, error_msg = validator.validate_session_id(session_id)
        if not is_valid:
            logger.warning("Invalid session ID", error=error_msg)
            return jsonify({"error": error_msg or "Invalid session ID"}), 400
        
        # Validate message
        is_valid, error_msg = validator.validate_message(message)
        if not is_valid:
            logger.warning("Invalid message", error=error_msg)
            return jsonify({"error": error_msg or "Invalid message"}), 400
        
        # Rate limiting
        is_allowed, remaining = rate_limiter.is_allowed(session_id)
        if not is_allowed:
            logger.warning("Rate limit exceeded", session_id=session_id[:8])
            record_rate_limit()
            return jsonify({
                "error": "Rate limit exceeded. Please wait a moment before sending another message.",
                "retry_after": 60
            }), 429
        
        # Get session
        session = get_session(session_id)
        if not session:
            logger.warning("Session not found", session_id=session_id[:8])
            return jsonify({"error": "Session not found or expired. Please create a new session."}), 404
        
        # Validate language if provided
        if lang:
            from config import ALLOWED_LANGS
            is_valid, error_msg = validator.validate_language(lang, ALLOWED_LANGS)
            if not is_valid:
                logger.warning("Invalid language", error=error_msg)
                return jsonify({"error": error_msg}), 400
        
        # Update language if changed
        if lang and lang != session.get("language"):
            session["language"] = lang
            # Remove any previous system prompts and insert new one
            session["history"] = [m for m in session["history"] if m.get("role") != "system"]
            system_prompt = localized_system_prompt(lang, session.get("reading_level", "simple"))
            session["history"].insert(0, {"role": "system", "content": system_prompt})
            update_session(session_id, {"language": lang, "history": session["history"]})
        
        # Get context for context-aware safety checking
        recent_messages = [m.get("content", "") for m in session.get("history", [])[-5:] 
                          if m.get("role") == "user"]
        
        # Advanced safety check with context
        safety_flags = check_safety(message, session.get("language", "en"), context=recent_messages)
        if "blocked" in safety_flags:
            logger.warning("Message blocked by safety filter", 
                         session_id=session_id[:8], message_preview=message[:50])
            record_safety_block()
            return jsonify({
                "error": "Your message could not be processed due to content policy restrictions. Please rephrase your question in an educational context."
            }), 403
        
        # Advanced intent classification
        intent = classify_intent(message, session.get("language", "en"))
        
        # Track intent in session metadata
        if intent not in session.get("metadata", {}).get("intents_used", []):
            metadata = session.get("metadata", {})
            intents_used = metadata.get("intents_used", [])
            intents_used.append(intent)
            metadata["intents_used"] = intents_used
            session["metadata"] = metadata
        
        # Add user message to history
        session["history"].append({"role": "user", "content": message})
        
        # Route to appropriate AI model with advanced routing
        ai_resp, model_used, confidence = route_chat(
            session, message, intent=intent, safety_flags=safety_flags
        )
        
        # Adapt reading levels
        answer_simple = adapt_reading_level(
            ai_resp, session.get("language", "en"), "simple"
        )
        answer_detailed = adapt_reading_level(
            ai_resp, session.get("language", "en"), "detailed"
        )
        
        # Inject glossary terms
        answer_simple = inject_glossary(answer_simple, session.get("language", "en"))
        answer_detailed = inject_glossary(answer_detailed, session.get("language", "en"))
        
        # Add AI response to history
        session["history"].append({"role": "assistant", "content": answer_simple})
        
        # Update counters
        session["counters"]["messages"] = session.get("counters", {}).get("messages", 0) + 1
        session["counters"]["ai_responses"] = session.get("counters", {}).get("ai_responses", 0) + 1
        
        # Trim history to last 20 messages (keep system prompt)
        system_msgs = [m for m in session["history"] if m.get("role") == "system"]
        other_msgs = [m for m in session["history"] if m.get("role") != "system"]
        session["history"] = system_msgs + other_msgs[-20:]
        
        # Save session
        update_session(session_id, {
            "history": session["history"],
            "counters": session["counters"],
            "metadata": session.get("metadata", {})
        })
        
        # Record successful message processing
        record_message(intent=intent, model=model_used)
        
        duration = time.time() - start_time
        logger.performance("chat endpoint", duration, session_id=session_id[:8], 
                         intent=intent, model=model_used)
        
        return jsonify({
            "answer_simple": answer_simple,
            "answer_detailed": answer_detailed,
            "model_used": model_used,
            "confidence": confidence,
            "reading_level": session.get("reading_level", "simple"),
            "intent": intent
        })
        
    except Exception as e:
        logger.error("Unexpected error in chat endpoint", error=e)
        record_error()
        return jsonify({
            "error": "An unexpected error occurred. Please try again.",
            "details": str(e) if logger.logger.level == logger.logger.DEBUG else None
        }), 500