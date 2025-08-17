import uuid
import time

# For hackathon: just a dict. Swap for Redis in prod.
_sessions = {}

def create_session(language, reading_level="simple", model_router="mistral_first"):
    session_id = str(uuid.uuid4())
    now = int(time.time())
    session = {
        "session_id": session_id,
        "language": language,
        "model_router": model_router,
        "history": [],
        "reading_level": reading_level,
        "safety_flags": [],
        "counters": {"tokens": 0, "messages": 0},
        "created_at": now
    }
    _sessions[session_id] = session
    return session

def get_session(session_id):
    return _sessions.get(session_id)

def update_session(session_id, data):
    if session_id in _sessions:
        _sessions[session_id].update(data)

def reset_session(session_id, language, reading_level="simple"):
    session = _sessions.get(session_id)
    if session:
        session["language"] = language
        session["reading_level"] = reading_level
        session["history"] = []
        session["safety_flags"] = []
        session["counters"] = {"tokens": 0, "messages": 0}
        session["created_at"] = int(time.time())