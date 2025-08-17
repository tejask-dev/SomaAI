def check_safety(message, lang):
    # Basic rules: block explicit adult content, hate, etc.
    blocked_keywords = ["porn", "kill", "suicide", "hate"]
    for kw in blocked_keywords:
        if kw in message.lower():
            return ["blocked"]
    return []

def classify_intent(message, lang):
    # Simple keyword-based; swap for ML later
    mapping = {
        "hiv": "HIV_prevention",
        "contracept": "contraception",
        "consent": "consent",
        "rape": "assault_support",
        "emergency": "emergency"
    }
    for k, v in mapping.items():
        if k in message.lower():
            return v
    return "basic_info"

def localized_system_prompt(lang, reading_level):
    prompts = {
        "en": f"You are SomaAI, a friendly, culturally respectful sexual-health educator for teens. Respond in English. Reading Level: {reading_level}.",
        "fr": f"Vous êtes SomaAI, un éducateur chaleureux et respectueux pour la santé sexuelle des adolescents. Répondez en français. Niveau de lecture : {reading_level}.",
        "pt": f"Você é o SomaAI, um educador amigável e respeitoso para saúde sexual de adolescentes. Responda em português. Nível de leitura: {reading_level}.",
        "es": f"Eres SomaAI, un educador amigable y respetuoso sobre salud sexual para adolescentes. Responde en español. Nivel de lectura: {reading_level}.",
        "sw": f"Wewe ni SomaAI, mwelekezaji rafiki na mwenye heshima kuhusu afya ya ngono kwa vijana. Jibu kwa Kiswahili. Kiwango cha usomaji: {reading_level}.",
        "hi": f"आप SomaAI हैं, एक मित्रवत, सांस्कृतिक रूप से संवेदनशील यौन स्वास्थ्य शिक्षक। हिंदी में उत्तर दें। पठन स्तर: {reading_level}।"
    }
    return prompts.get(lang, prompts["en"])