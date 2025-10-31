"""
Advanced Session Route
Enhanced with validation, telemetry, and better error handling
"""
from flask import Blueprint, request, jsonify
from config import ALLOWED_LANGS
from services.session_store import create_session
from services.safety import localized_system_prompt
from services.telemetry import record_session_created, record_request
from utils.validators import validator
from utils.logger import logger

session_bp = Blueprint("session", __name__)

@session_bp.route("/api/session", methods=["POST"])
def new_session():
    """
    Create a new chat session with enhanced validation
    """
    record_request()
    
    try:
        data = request.get_json() or {}
        lang = data.get("language")
        reading = data.get("reading_level", "simple")
        
        # Validate language
        if not lang:
            return jsonify({"error": "Language is required"}), 400
        
        is_valid, error_msg = validator.validate_language(lang, ALLOWED_LANGS)
        if not is_valid:
            logger.warning("Invalid language in session creation", language=lang)
            return jsonify({"error": error_msg or "Unsupported language"}), 400
        
        # Validate reading level
        valid_reading_levels = ["simple", "detailed", "standard"]
        if reading not in valid_reading_levels:
            reading = "simple"  # Default to simple
            logger.info("Invalid reading level, defaulting to simple", provided=reading)
        
        # Create session
        session = create_session(lang, reading)
        
        # Seed history with localized system prompt
        system_prompt = localized_system_prompt(lang, reading)
        session["history"].append({"role": "system", "content": system_prompt})
        
        # Record telemetry
        record_session_created(lang)
        
        # Welcome messages
        welcome_messages = {
            "en": "Session created. Hello! I'm SomaAI, your health education companion. How can I help you today?",
            "fr": "Session créée. Bonjour ! Je suis SomaAI, votre compagnon d'éducation à la santé. Comment puis-je vous aider aujourd'hui ?",
            "pt": "Sessão criada. Olá! Sou o SomaAI, seu companheiro de educação em saúde. Como posso ajudá-lo hoje?",
            "es": "Sesión creada. ¡Hola! Soy SomaAI, tu compañero de educación para la salud. ¿Cómo puedo ayudarte hoy?",
            "sw": "Kikao kimeundwa. Habari! Mimi ni SomaAI, mwenzako wa elimu ya afya. Ninaweza kukusaidiaje leo?",
            "hi": "सत्र बनाया गया। नमस्ते! मैं SomaAI हूं, आपका स्वास्थ्य शिक्षा साथी। मैं आज आपकी कैसे मदद कर सकता हूं?"
        }
        
        welcome_msg = welcome_messages.get(lang, welcome_messages["en"])
        
        logger.info("Session created successfully", session_id=session["session_id"][:8], 
                   language=lang, reading_level=reading)
        
        return jsonify({
            "session_id": session["session_id"],
            "language": lang,
            "reading_level": reading,
            "message": welcome_msg
        })
        
    except Exception as e:
        logger.error("Error creating session", error=e)
        return jsonify({
            "error": "An error occurred while creating your session. Please try again."
        }), 500