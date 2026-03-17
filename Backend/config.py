import os
import sys
import secrets
from dotenv import load_dotenv

load_dotenv()

FLASK_ENV = os.getenv("FLASK_ENV", "development")
IS_PRODUCTION = FLASK_ENV == "production"

OPENROUTER_API_KEY_PRIMARY = os.getenv("OPENROUTER_API_KEY_PRIMARY")
OPENROUTER_API_KEY_SECONDARY = os.getenv("OPENROUTER_API_KEY_SECONDARY")
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")
ENABLE_TTS = os.getenv("ENABLE_TTS", "false").lower() == "true"
ALLOWED_LANGS = os.getenv("ALLOWED_LANGS", "en,fr,pt,sw,es,hi").split(',')
DEBUG = not IS_PRODUCTION

# SECRET_KEY: required in production, auto-generated in development
SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    if IS_PRODUCTION:
        sys.exit("FATAL: SECRET_KEY environment variable is required in production. Aborting.")
    else:
        SECRET_KEY = secrets.token_hex(32)
        print("WARNING: SECRET_KEY not set. Generated a temporary key for this process. Set SECRET_KEY env var before deploying.")

# ADMIN_API_KEY: required in production, insecure default in development only
ADMIN_API_KEY = os.getenv("ADMIN_API_KEY")
if not ADMIN_API_KEY:
    if IS_PRODUCTION:
        sys.exit("FATAL: ADMIN_API_KEY environment variable is required in production. Aborting.")
    else:
        ADMIN_API_KEY = "dev-admin-key-unsafe"
        print("WARNING: ADMIN_API_KEY not set. Using insecure development default. Set ADMIN_API_KEY before deploying.")

# Allowed CORS origins — comma-separated in env var
_cors_default = "http://localhost:3000"
CORS_ORIGINS = [o.strip() for o in os.getenv("CORS_ORIGINS", _cors_default).split(',') if o.strip()]