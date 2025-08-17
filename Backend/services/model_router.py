import requests
from config import OPENROUTER_API_KEY_PRIMARY, OPENROUTER_API_KEY_SECONDARY

# Model names as required by OpenRouter
MISTRAL_NEMO_MODEL = "mistralai/mistral-nemo:free"
LLAMA3_70B_MODEL = "meta-llama/llama-3.3-70b-instruct:free"

def route_chat(session, message, intent, safety_flags):
    """
    Route chat messages to the correct model based on intent and safety.
    """
    model = MISTRAL_NEMO_MODEL
    api_key = OPENROUTER_API_KEY_PRIMARY

    # Fallback for sensitive topics or safety concerns
    sensitive_intents = {"consent", "assault_support", "emergency"}
    if intent in sensitive_intents or "low_confidence" in safety_flags:
        model = LLAMA3_70B_MODEL
        api_key = OPENROUTER_API_KEY_SECONDARY or OPENROUTER_API_KEY_PRIMARY

    # Prepare prompt with full conversation history
    prompt = session["history"] + [{"role": "user", "content": message}]
    payload = {
        "model": model,
        "messages": prompt,
        "response_format": {"type": "text"},
        "temperature": 0.5,
        "max_tokens": 512
    }
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    try:
        resp = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            json=payload,
            headers=headers,
            timeout=20
        )
        resp.raise_for_status()
        data = resp.json()
        content = data["choices"][0]["message"]["content"]
        confidence = 0.86  # You can implement a real confidence function if desired.
        return content, model, confidence
    except Exception as e:
        print("OpenRouter API error:", e)
        return (
            "Sorry, I'm having trouble right now. Here is some information from our FAQ.",
            model,
            0.5
        )

def generate_lesson(session, topic):
    """
    Generate a lesson using the Mistral Nemo model.
    """
    prompt = session["history"] + [
        {"role": "user", "content": f"Generate a micro-lesson in JSON about: {topic}"}
    ]
    payload = {
        "model": MISTRAL_NEMO_MODEL,
        "messages": prompt,
        "response_format": {"type": "json_object"},
        "temperature": 0.5,
        "max_tokens": 800
    }
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY_PRIMARY}",
        "Content-Type": "application/json"
    }
    try:
        resp = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            json=payload,
            headers=headers,
            timeout=20
        )
        resp.raise_for_status()
        data = resp.json()
        lesson_json = data["choices"][0]["message"]["content"]
        # Parse JSON if returned as a string
        import json
        if isinstance(lesson_json, str):
            lesson_json = json.loads(lesson_json)
        return lesson_json, "mistral_nemo"
    except Exception as e:
        print("OpenRouter API error (lesson):", e)
        # Fallback: return blank lesson
        return {
            "title": topic,
            "intro": "",
            "key_points": [],
            "myths_vs_facts": [],
            "summary": ""
        }, "mistral_nemo"