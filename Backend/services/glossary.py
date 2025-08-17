import os
import json

def load_glossary(lang):
    path = os.path.join("glossary", f"glossary_{lang}.json")
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {}

def inject_glossary(text, lang):
    glossary = load_glossary(lang)
    for term, definition in glossary.items():
        if term in text:
            # Only replace first occurrence
            text = text.replace(term, f"{term} ({definition})", 1)
    return text