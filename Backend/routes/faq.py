from flask import Blueprint, request, jsonify
import os
import json
from config import ALLOWED_LANGS

faq_bp = Blueprint("faq", __name__)

@faq_bp.route("/api/faq", methods=["GET"])
def faq():
    lang = request.args.get("lang", "en")
    if lang not in ALLOWED_LANGS:
        return jsonify({"error": "Unsupported language"}), 400
    path = os.path.join("data", f"faq_{lang}.json")
    try:
        with open(path, "r", encoding="utf-8") as f:
            return jsonify(json.load(f))
    except Exception:
        return jsonify([])  # fallback to empty