"""
Advanced Session Management Service
Enhanced session storage with TTL, cleanup, and better tracking
"""
import uuid
import time
from typing import Optional, Dict, Any
from threading import Lock
from utils.logger import logger

# Session storage (in-memory, swap for Redis in production)
_sessions: Dict[str, Dict[str, Any]] = {}
_session_lock = Lock()

# Session configuration
SESSION_TTL = 3600 * 4  # 4 hours
CLEANUP_INTERVAL = 300  # Clean up every 5 minutes
_last_cleanup = time.time()


def _cleanup_expired_sessions():
    """Remove expired sessions (called periodically)"""
    global _last_cleanup
    current_time = time.time()
    
    # Only cleanup if interval has passed
    if current_time - _last_cleanup < CLEANUP_INTERVAL:
        return
    
    _last_cleanup = current_time
    
    with _session_lock:
        expired_keys = [
            sid for sid, session in _sessions.items()
            if current_time - session.get("created_at", 0) > SESSION_TTL
        ]
        
        for key in expired_keys:
            del _sessions[key]
            logger.info("Session expired and removed", session_id=key[:8])
        
        if expired_keys:
            logger.info("Cleanup completed", expired_count=len(expired_keys),
                       remaining_sessions=len(_sessions))


def create_session(language: str, reading_level: str = "simple", 
                   model_router: str = "mistral_first") -> Dict[str, Any]:
    """
    Create a new session with enhanced tracking
    
    Args:
        language: Session language code
        reading_level: User's preferred reading level
        model_router: Model routing strategy
    
    Returns:
        Session dictionary
    """
    session_id = str(uuid.uuid4())
    now = int(time.time())
    
    session = {
        "session_id": session_id,
        "language": language,
        "model_router": model_router,
        "history": [],
        "reading_level": reading_level,
        "safety_flags": [],
        "counters": {
            "tokens": 0,
            "messages": 0,
            "ai_responses": 0
        },
        "created_at": now,
        "last_activity": now,
        "metadata": {
            "ip_address": None,  # Can be set if tracking is needed
            "user_agent": None,
            "intents_used": []
        }
    }
    
    with _session_lock:
        _sessions[session_id] = session
    
    logger.info("Session created", session_id=session_id[:8], language=language,
               reading_level=reading_level)
    
    # Periodic cleanup
    _cleanup_expired_sessions()
    
    return session


def get_session(session_id: str) -> Optional[Dict[str, Any]]:
    """
    Get session by ID, update last activity
    
    Args:
        session_id: Session identifier
    
    Returns:
        Session dictionary or None if not found/expired
    """
    _cleanup_expired_sessions()
    
    with _session_lock:
        session = _sessions.get(session_id)
        
        if session:
            # Check if expired
            current_time = time.time()
            if current_time - session.get("created_at", 0) > SESSION_TTL:
                del _sessions[session_id]
                logger.info("Session expired during get", session_id=session_id[:8])
                return None
            
            # Update last activity
            session["last_activity"] = current_time
            return session
    
    return None


def update_session(session_id: str, data: Dict[str, Any]) -> bool:
    """
    Update session with new data
    
    Args:
        session_id: Session identifier
        data: Dictionary of data to update
    
    Returns:
        True if updated, False if session not found
    """
    _cleanup_expired_sessions()
    
    with _session_lock:
        if session_id not in _sessions:
            logger.warning("Attempt to update non-existent session", 
                         session_id=session_id[:8])
            return False
        
        _sessions[session_id].update(data)
        _sessions[session_id]["last_activity"] = int(time.time())
        return True


def reset_session(session_id: str, language: str, reading_level: str = "simple") -> bool:
    """
    Reset session (clear history, update language/reading level)
    
    Args:
        session_id: Session identifier
        language: New language code
        reading_level: New reading level
    
    Returns:
        True if reset, False if session not found
    """
    with _session_lock:
        session = _sessions.get(session_id)
        if not session:
            return False
        
        session["language"] = language
        session["reading_level"] = reading_level
        session["history"] = []
        session["safety_flags"] = []
        session["counters"] = {"tokens": 0, "messages": 0, "ai_responses": 0}
        session["created_at"] = int(time.time())
        session["last_activity"] = int(time.time())
        
        logger.info("Session reset", session_id=session_id[:8], language=language)
        return True


def delete_session(session_id: str) -> bool:
    """
    Delete a session
    
    Args:
        session_id: Session identifier
    
    Returns:
        True if deleted, False if not found
    """
    with _session_lock:
        if session_id in _sessions:
            del _sessions[session_id]
            logger.info("Session deleted", session_id=session_id[:8])
            return True
        return False


def get_session_stats() -> Dict[str, Any]:
    """
    Get statistics about active sessions
    
    Returns:
        Dictionary with session statistics
    """
    _cleanup_expired_sessions()
    
    with _session_lock:
        active_sessions = len(_sessions)
        total_messages = sum(s.get("counters", {}).get("messages", 0) 
                           for s in _sessions.values())
        
        # Group by language
        languages = {}
        for session in _sessions.values():
            lang = session.get("language", "unknown")
            languages[lang] = languages.get(lang, 0) + 1
        
        return {
            "active_sessions": active_sessions,
            "total_messages": total_messages,
            "sessions_by_language": languages,
            "oldest_session_age": min(
                (time.time() - s.get("created_at", time.time()) 
                 for s in _sessions.values()),
                default=0
            )
        }