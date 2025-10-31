"""
Admin Route
Provides access to system metrics and administration functions
"""
from flask import Blueprint, jsonify, request
from services.telemetry import get_metrics, reset_metrics
from services.session_store import get_session_stats
from utils.logger import logger

admin_bp = Blueprint("admin", __name__)

# Simple API key authentication (replace with proper auth in production)
ADMIN_API_KEY = "change_this_in_production"

def _check_auth():
    """Simple authentication check"""
    api_key = request.headers.get("X-API-Key") or request.args.get("api_key")
    return api_key == ADMIN_API_KEY


@admin_bp.route("/api/admin/metrics", methods=["GET"])
def metrics():
    """
    Get comprehensive system metrics
    Requires authentication via X-API-Key header or api_key query parameter
    """
    if not _check_auth():
        logger.warning("Unauthorized metrics access attempt", 
                      ip=request.remote_addr)
        return jsonify({"error": "Unauthorized"}), 401
    
    try:
        metrics_data = get_metrics()
        return jsonify(metrics_data)
    except Exception as e:
        logger.error("Error getting metrics", error=e)
        return jsonify({"error": "Failed to retrieve metrics"}), 500


@admin_bp.route("/api/admin/metrics/reset", methods=["POST"])
def reset_metrics_endpoint():
    """
    Reset all metrics (use with caution)
    Requires authentication
    """
    if not _check_auth():
        return jsonify({"error": "Unauthorized"}), 401
    
    try:
        reset_metrics()
        logger.info("Metrics reset via admin endpoint", ip=request.remote_addr)
        return jsonify({"message": "Metrics reset successfully"})
    except Exception as e:
        logger.error("Error resetting metrics", error=e)
        return jsonify({"error": "Failed to reset metrics"}), 500


@admin_bp.route("/api/admin/sessions", methods=["GET"])
def session_stats():
    """
    Get session statistics
    Requires authentication
    """
    if not _check_auth():
        return jsonify({"error": "Unauthorized"}), 401
    
    try:
        stats = get_session_stats()
        return jsonify(stats)
    except Exception as e:
        logger.error("Error getting session stats", error=e)
        return jsonify({"error": "Failed to retrieve session stats"}), 500