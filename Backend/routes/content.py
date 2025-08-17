from flask import Blueprint, jsonify, request
import json
import os

content_bp = Blueprint('content', __name__)

FAQ_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'faq.json')

def load_faq():
    with open(FAQ_PATH, 'r', encoding='utf-8') as f:
        return json.load(f)

@content_bp.route('/api/faq', methods=['GET'])
def get_faq():
    faq = load_faq()
    return jsonify(faq)

@content_bp.route('/api/faq/search', methods=['GET'])
def search_faq():
    query = request.args.get('q', '').lower().strip()
    if not query:
        return jsonify({"error": "Missing query"}), 400
    faq = load_faq()
    # Simple keyword search; pick first match
    for item in faq:
        if query in item['question'].lower():
            return jsonify(item)
    # Fallback: return best match by word overlap
    best = None
    most_overlap = 0
    for item in faq:
        overlap = len(set(query.split()) & set(item['question'].lower().split()))
        if overlap > most_overlap:
            best = item
            most_overlap = overlap
    return jsonify(best) if best else jsonify({})