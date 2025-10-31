"""
Advanced Model Router
Intelligently routes requests to appropriate AI models based on query complexity,
intent, safety requirements, and context.
"""
import requests
import time
import re
import json
from typing import Tuple, Optional
from config import OPENROUTER_API_KEY_PRIMARY, OPENROUTER_API_KEY_SECONDARY
from utils.logger import logger
from utils.cache import cache

# Model names as required by OpenRouter
MISTRAL_NEMO_MODEL = "mistralai/mistral-nemo:free"
LLAMA3_70B_MODEL = "meta-llama/llama-3.3-70b-instruct:free"

# API configuration
OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"
REQUEST_TIMEOUT = 30
MAX_RETRIES = 2


def _estimate_query_complexity(message: str, history_length: int) -> str:
    """
    Estimate query complexity to determine appropriate model
    Returns: "simple", "medium", or "complex"
    """
    # Check message length
    if len(message) > 500:
        return "complex"
    
    # Check for complex questions
    complex_indicators = [
        r'\b(why|how|explain|describe|compare|analyze|evaluate|discuss)\b',
        r'\b(what is|what are|what causes|what happens)\b',
        r'\?.*\?',  # Multiple questions
    ]
    
    message_lower = message.lower()
    complex_count = sum(1 for pattern in complex_indicators if re.search(pattern, message_lower))
    
    # Check history length (longer conversations may need better context understanding)
    if history_length > 15:
        return "complex"
    
    if complex_count >= 2 or len(message) > 300:
        return "complex"
    elif complex_count >= 1 or len(message) > 150:
        return "medium"
    else:
        return "simple"


def _calculate_confidence(data: dict, model: str) -> float:
    """
    Calculate confidence score based on response metadata
    """
    try:
        # Base confidence varies by model
        base_confidence = 0.90 if "llama-3.3-70b" in model else 0.85
        
        # Check for finish reason
        finish_reason = data.get("choices", [{}])[0].get("finish_reason", "")
        if finish_reason == "stop":
            # Full response generated
            return base_confidence
        elif finish_reason == "length":
            # Response was truncated
            return base_confidence * 0.8
        else:
            return base_confidence * 0.7
    except Exception:
        return 0.80


def _select_model(intent: str, safety_flags: list, complexity: str, message: str) -> Tuple[str, str]:
    """
    Intelligently select the best model for the query
    Returns: (model_name, api_key)
    """
    # Always use advanced model for sensitive topics
    sensitive_intents = {"consent", "assault_support", "emergency", "crisis"}
    if intent in sensitive_intents or "blocked_context" in safety_flags:
        logger.info("Using advanced model for sensitive topic", intent=intent, model=LLAMA3_70B_MODEL)
        return LLAMA3_70B_MODEL, OPENROUTER_API_KEY_SECONDARY or OPENROUTER_API_KEY_PRIMARY
    
    # Use advanced model for complex queries
    if complexity == "complex":
        logger.info("Using advanced model for complex query", complexity=complexity, model=LLAMA3_70B_MODEL)
        return LLAMA3_70B_MODEL, OPENROUTER_API_KEY_SECONDARY or OPENROUTER_API_KEY_PRIMARY
    
    # Use advanced model if safety flags indicate concerns
    if "low_confidence" in safety_flags or "needs_review" in safety_flags:
        logger.info("Using advanced model for safety review", flags=safety_flags, model=LLAMA3_70B_MODEL)
        return LLAMA3_70B_MODEL, OPENROUTER_API_KEY_SECONDARY or OPENROUTER_API_KEY_PRIMARY
    
    # Default to faster model for simple queries
    logger.info("Using standard model for query", complexity=complexity, model=MISTRAL_NEMO_MODEL)
    return MISTRAL_NEMO_MODEL, OPENROUTER_API_KEY_PRIMARY


def _call_openrouter_api(payload: dict, headers: dict, retry_count: int = 0) -> Tuple[Optional[str], Optional[Exception]]:
    """
    Call OpenRouter API with retry logic
    Returns: (response_content, error)
    """
    try:
        start_time = time.time()
        resp = requests.post(
            OPENROUTER_API_URL,
            json=payload,
            headers=headers,
            timeout=REQUEST_TIMEOUT
        )
        duration = time.time() - start_time
        
        logger.performance("OpenRouter API call", duration, model=payload.get("model"), 
                          status_code=resp.status_code)
        
        resp.raise_for_status()
        data = resp.json()
        content = data["choices"][0]["message"]["content"]
        
        return content, None
        
    except requests.exceptions.Timeout as e:
        logger.error("OpenRouter API timeout", error=e, retry_count=retry_count)
        if retry_count < MAX_RETRIES:
            logger.info("Retrying OpenRouter API call", retry_count=retry_count + 1)
            time.sleep(1)  # Brief delay before retry
            return _call_openrouter_api(payload, headers, retry_count + 1)
        return None, e
        
    except requests.exceptions.RequestException as e:
        logger.error("OpenRouter API request error", error=e, status_code=getattr(e.response, 'status_code', None))
        if retry_count < MAX_RETRIES and getattr(e.response, 'status_code', None) in [429, 500, 502, 503, 504]:
            logger.info("Retrying OpenRouter API call after error", retry_count=retry_count + 1)
            time.sleep(2)  # Longer delay for server errors
            return _call_openrouter_api(payload, headers, retry_count + 1)
        return None, e
        
    except Exception as e:
        logger.error("Unexpected error in OpenRouter API call", error=e)
        return None, e


def route_chat(session: dict, message: str, intent: str, safety_flags: list) -> Tuple[str, str, float]:
    """
    Advanced chat routing with intelligent model selection and error handling.
    
    Args:
        session: Session dictionary with history and metadata
        message: User message
        intent: Detected intent classification
        safety_flags: List of safety flags
    
    Returns:
        (response_content, model_used, confidence_score)
    """
    start_time = time.time()
    
    # Estimate query complexity
    history_length = len(session.get("history", []))
    complexity = _estimate_query_complexity(message, history_length)
    
    # Select appropriate model
    model, api_key = _select_model(intent, safety_flags, complexity, message)
    
    # Check cache for similar queries (simple queries only)
    if complexity == "simple":
        cached_response = cache.get("chat_response", message=message[:100], intent=intent, model=model)
        if cached_response:
            logger.info("Cache hit for chat response", intent=intent)
            return cached_response, model, 0.90
    
    # Prepare enhanced prompt with context
    prompt = session.get("history", []).copy()
    
    # Add user message
    prompt.append({"role": "user", "content": message})
    
    # Configure temperature based on intent (lower for sensitive topics)
    temperature = 0.4 if intent in {"consent", "assault_support", "emergency"} else 0.6
    
    # Configure max_tokens based on complexity
    max_tokens_map = {
        "simple": 400,
        "medium": 600,
        "complex": 800
    }
    max_tokens = max_tokens_map.get(complexity, 512)
    
    payload = {
        "model": model,
        "messages": prompt,
        "response_format": {"type": "text"},
        "temperature": temperature,
        "max_tokens": max_tokens,
        "top_p": 0.9,
        "frequency_penalty": 0.1,
        "presence_penalty": 0.1
    }
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://somaai.org",
        "X-Title": "SomaAI Health Education"
    }
    
    # Call API with retry logic
    content, error = _call_openrouter_api(payload, headers)
    
    if error or not content:
        logger.error("Failed to get AI response", error=error, intent=intent)
        
        # Fallback response
        fallback_responses = {
            "en": "I apologize, but I'm having technical difficulties right now. Please try again in a moment, or check our FAQ section for immediate information.",
            "fr": "Je m'excuse, mais j'ai des difficultés techniques en ce moment. Veuillez réessayer dans un instant, ou consultez notre section FAQ pour des informations immédiates.",
            "pt": "Desculpe, mas estou com dificuldades técnicas no momento. Por favor, tente novamente em um instante ou verifique nossa seção de FAQ para informações imediatas.",
            "es": "Lo siento, pero estoy teniendo dificultades técnicas en este momento. Por favor, intente nuevamente en un momento o consulte nuestra sección de preguntas frecuentes para obtener información inmediata.",
            "sw": "Samahani, lakini nina shida za kiufundi hivi sasa. Tafadhali jaribu tena baadaye, au angalia sehemu yetu ya maswali ya mara kwa mara kwa taarifa za haraka.",
            "hi": "माफ करें, लेकिन अभी मुझे तकनीकी कठिनाइयों का सामना करना पड़ रहा है। कृपया कुछ समय बाद पुनः प्रयास करें, या तत्काल जानकारी के लिए हमारे FAQ अनुभाग देखें।"
        }
        lang = session.get("language", "en")
        fallback_msg = fallback_responses.get(lang, fallback_responses["en"])
        
        return fallback_msg, model, 0.3
    
    # Calculate confidence (simplified - using base confidence)
    confidence = 0.90 if "llama-3.3-70b" in model else 0.85
    
    # Cache simple responses
    if complexity == "simple":
        cache.set("chat_response", content, message=message[:100], intent=intent, model=model)
    
    duration = time.time() - start_time
    logger.performance("route_chat complete", duration, model=model, complexity=complexity, 
                      intent=intent, confidence=confidence)
    
    return content, model, confidence

def generate_lesson(session: dict, topic: str) -> Tuple[dict, str]:
    """
    Generate a comprehensive lesson using advanced AI model.
    Enhanced with better prompts and error handling.
    """
    start_time = time.time()
    
    # Use advanced model for lesson generation (better structure and accuracy)
    model = LLAMA3_70B_MODEL
    api_key = OPENROUTER_API_KEY_SECONDARY or OPENROUTER_API_KEY_PRIMARY
    
    lang = session.get("language", "en")
    reading_level = session.get("reading_level", "simple")
    
    # Enhanced lesson generation prompt
    lesson_prompt = f"""Generate a comprehensive, age-appropriate educational lesson about "{topic}" for adolescents.
    
Requirements:
- Language: {lang}
- Reading Level: {reading_level}
- Format: JSON only
- Be accurate, culturally sensitive, and supportive

JSON Structure:
{{
    "title": "Lesson title in {lang}",
    "intro": "Engaging introduction paragraph",
    "key_points": ["Point 1", "Point 2", "Point 3-5 total"],
    "myths_vs_facts": [
        {{"myth": "Common misconception", "fact": "Evidence-based fact"}},
        {{"myth": "Another myth", "fact": "Correct information"}}
    ],
    "summary": "Concise summary paragraph",
    "resources": ["Resource 1", "Resource 2"]
}}

Generate the lesson now:"""
    
    prompt = session.get("history", []) + [
        {"role": "user", "content": lesson_prompt}
    ]
    
    payload = {
        "model": model,
        "messages": prompt,
        "response_format": {"type": "json_object"},
        "temperature": 0.7,
        "max_tokens": 1200,
        "top_p": 0.9
    }
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://somaai.org",
        "X-Title": "SomaAI Health Education"
    }
    
    try:
        content, error = _call_openrouter_api(payload, headers)
        
        if error or not content:
            logger.error("Failed to generate lesson", error=error, topic=topic)
            raise Exception("Lesson generation failed")
        
        # Parse JSON response
        lesson_json = json.loads(content) if isinstance(content, str) else content
        
        # Validate and ensure required fields
        required_fields = ["title", "intro", "key_points", "myths_vs_facts", "summary"]
        for field in required_fields:
            if field not in lesson_json:
                lesson_json[field] = [] if "s" in field else ""
        
        # Add resources if missing
        if "resources" not in lesson_json:
            lesson_json["resources"] = []
        
        duration = time.time() - start_time
        logger.performance("generate_lesson complete", duration, topic=topic, model=model)
        
        return lesson_json, model
        
    except json.JSONDecodeError as e:
        logger.error("Failed to parse lesson JSON", error=e, topic=topic)
        # Fallback structured lesson
        return {
            "title": topic,
            "intro": f"This lesson covers important information about {topic}.",
            "key_points": [
                "Please check our FAQ section for detailed information.",
                "Feel free to ask specific questions in the chat."
            ],
            "myths_vs_facts": [],
            "summary": "For more information, please use our chat feature or browse our FAQ.",
            "resources": []
        }, model
        
    except Exception as e:
        logger.error("Error generating lesson", error=e, topic=topic)
        # Fallback lesson structure
        return {
            "title": topic,
            "intro": "",
            "key_points": [],
            "myths_vs_facts": [],
            "summary": "",
            "resources": []
        }, model