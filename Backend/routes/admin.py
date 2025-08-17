from flask import Blueprint, jsonify
from services.telemetry import get_metrics

admin_bp = Blueprint("admin", __name__)

@admin_bp.route("/api/admin/metrics", methods=["GET"])
def metrics():
    # TODO: Add authentication
    return jsonify(get_metrics())