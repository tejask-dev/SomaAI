import os
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY_PRIMARY = os.getenv("OPENROUTER_API_KEY_PRIMARY")
OPENROUTER_API_KEY_SECONDARY = os.getenv("OPENROUTER_API_KEY_SECONDARY")
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")
ENABLE_TTS = os.getenv("ENABLE_TTS", "false").lower() == "true"
ALLOWED_LANGS = os.getenv("ALLOWED_LANGS", "en,fr,pt,sw,es,hi").split(',')
SECRET_KEY = os.getenv("SECRET_KEY", "change_this_secret_for_prod")