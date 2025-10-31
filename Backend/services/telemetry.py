"""
Advanced Telemetry and Metrics Service
Real-time tracking of system usage and performance
"""
from services.session_store import get_session_stats
from utils.logger import logger
from collections import defaultdict
from threading import Lock
import time

# In-memory metrics storage
_metrics = {
    "total_requests": 0,
    "total_sessions_created": 0,
    "total_messages_processed": 0,
    "total_errors": 0,
    "intent_counts": defaultdict(int),
    "language_counts": defaultdict(int),
    "model_usage": defaultdict(int),
    "safety_blocks": 0,
    "rate_limit_hits": 0,
    "start_time": time.time()
}
_metrics_lock = Lock()


def record_request():
    """Record an API request"""
    with _metrics_lock:
        _metrics["total_requests"] += 1


def record_session_created(language: str):
    """Record a new session creation"""
    with _metrics_lock:
        _metrics["total_sessions_created"] += 1
        _metrics["language_counts"][language] += 1


def record_message(intent: str = None, model: str = None):
    """Record a message being processed"""
    with _metrics_lock:
        _metrics["total_messages_processed"] += 1
        if intent:
            _metrics["intent_counts"][intent] += 1
        if model:
            _metrics["model_usage"][model] += 1


def record_error():
    """Record an error"""
    with _metrics_lock:
        _metrics["total_errors"] += 1


def record_safety_block():
    """Record a safety filter block"""
    with _metrics_lock:
        _metrics["safety_blocks"] += 1


def record_rate_limit():
    """Record a rate limit hit"""
    with _metrics_lock:
        _metrics["rate_limit_hits"] += 1


def get_metrics() -> dict:
    """
    Get comprehensive system metrics
    
    Returns:
        Dictionary with system metrics
    """
    with _metrics_lock:
        # Get session stats
        session_stats = get_session_stats()
        
        # Calculate uptime
        uptime_seconds = time.time() - _metrics["start_time"]
        uptime_hours = uptime_seconds / 3600
        
        # Calculate request rate
        requests_per_minute = (_metrics["total_requests"] / uptime_seconds * 60) if uptime_seconds > 0 else 0
        
        # Get top intents (limit to top 10)
        top_intents = dict(sorted(
            _metrics["intent_counts"].items(),
            key=lambda x: x[1],
            reverse=True
        )[:10])
        
        # Get top languages
        top_languages = dict(sorted(
            _metrics["language_counts"].items(),
            key=lambda x: x[1],
            reverse=True
        ))
        
        # Get model usage stats
        model_usage = dict(_metrics["model_usage"])
        
        return {
            # Request stats
            "total_requests": _metrics["total_requests"],
            "requests_per_minute": round(requests_per_minute, 2),
            "uptime_hours": round(uptime_hours, 2),
            
            # Session stats
            "total_sessions_created": _metrics["total_sessions_created"],
            "active_sessions": session_stats.get("active_sessions", 0),
            
            # Message stats
            "total_messages_processed": _metrics["total_messages_processed"],
            "messages_per_session": round(
                _metrics["total_messages_processed"] / max(_metrics["total_sessions_created"], 1),
                2
            ),
            
            # Language distribution
            "top_languages": top_languages,
            
            # Intent distribution
            "top_intents": top_intents,
            
            # Model usage
            "model_usage": model_usage,
            
            # Error and safety stats
            "total_errors": _metrics["total_errors"],
            "error_rate": round(
                (_metrics["total_errors"] / max(_metrics["total_requests"], 1)) * 100,
                2
            ),
            "safety_blocks": _metrics["safety_blocks"],
            "rate_limit_hits": _metrics["rate_limit_hits"],
            
            # Session details
            "sessions_by_language": session_stats.get("sessions_by_language", {}),
            "oldest_session_age_hours": round(
                session_stats.get("oldest_session_age", 0) / 3600,
                2
            )
        }


def reset_metrics():
    """Reset all metrics (use with caution)"""
    with _metrics_lock:
        _metrics.update({
            "total_requests": 0,
            "total_sessions_created": 0,
            "total_messages_processed": 0,
            "total_errors": 0,
            "intent_counts": defaultdict(int),
            "language_counts": defaultdict(int),
            "model_usage": defaultdict(int),
            "safety_blocks": 0,
            "rate_limit_hits": 0,
            "start_time": time.time()
        })
        logger.info("Metrics reset")