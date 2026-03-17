"""
Admin Route
Provides access to system metrics and administration functions.

Authentication: X-API-Key header (preferred) or api_key query param.
Key comparison uses hmac.compare_digest to prevent timing-based key leakage.
"""
import hmac
from flask import Blueprint, jsonify, request
from config import ADMIN_API_KEY
from services.telemetry import get_metrics, reset_metrics
from services.session_store import get_session_stats
from utils.logger import logger
from utils.rate_limiter import admin_limiter

admin_bp = Blueprint("admin", __name__)


def _get_client_ip() -> str:
    """Return the real client IP, respecting X-Forwarded-For if set."""
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.remote_addr or "unknown"


def _check_auth() -> bool:
    """
    Validate the API key using a constant-time comparison so that a
    timing side-channel cannot be used to brute-force the key.
    """
    api_key = request.headers.get("X-API-Key") or request.args.get("api_key")
    if not api_key or not ADMIN_API_KEY:
        return False
    return hmac.compare_digest(api_key.encode(), ADMIN_API_KEY.encode())


def _admin_guard():
    """Apply rate limiting then auth check.  Returns an error response or None."""
    ip = _get_client_ip()
    allowed, _ = admin_limiter.is_allowed(ip)
    if not allowed:
        logger.warning("Admin endpoint rate limit exceeded", ip=ip)
        return jsonify({"error": "Too many requests"}), 429

    if not _check_auth():
        logger.warning("Unauthorized admin access attempt", ip=ip)
        return jsonify({"error": "Unauthorized"}), 401

    return None


@admin_bp.route("/api/admin/metrics", methods=["GET"])
def metrics():
    """Return comprehensive system metrics. Requires X-API-Key authentication."""
    guard = _admin_guard()
    if guard:
        return guard

    try:
        return jsonify(get_metrics())
    except Exception as e:
        logger.error("Error getting metrics", error=e)
        return jsonify({"error": "Failed to retrieve metrics"}), 500


@admin_bp.route("/api/admin/metrics/reset", methods=["POST"])
def reset_metrics_endpoint():
    """Reset all metrics counters. Requires X-API-Key authentication."""
    guard = _admin_guard()
    if guard:
        return guard

    try:
        reset_metrics()
        logger.info("Metrics reset via admin endpoint", ip=_get_client_ip())
        return jsonify({"message": "Metrics reset successfully"})
    except Exception as e:
        logger.error("Error resetting metrics", error=e)
        return jsonify({"error": "Failed to reset metrics"}), 500


@admin_bp.route("/api/admin/sessions", methods=["GET"])
def session_stats():
    """Return session statistics. Requires X-API-Key authentication."""
    guard = _admin_guard()
    if guard:
        return guard

    try:
        return jsonify(get_session_stats())
    except Exception as e:
        logger.error("Error getting session stats", error=e)
        return jsonify({"error": "Failed to retrieve session stats"}), 500