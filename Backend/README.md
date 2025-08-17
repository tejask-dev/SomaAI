# Sexual Health Chatbot Backend

## Features

- AI chat via OpenRouter API (`/api/chat`)
- Preloaded FAQ (`/api/faq`)
- FAQ search (`/api/faq/search?q=...`)
- Health check (`/api/health`)
- Session context (per user, in-memory)
- CORS enabled (for frontend)

## Setup

1. `git clone ...`
2. `cd backend`
3. `pip install -r requirements.txt`
4. Add your OpenRouter API key to `.env`
5. `python app.py`

## Endpoints

- `POST /api/chat`
  - `{ "message": "...", "session_id": "..." }`
- `GET /api/faq`
- `GET /api/faq/search?q=your+question`
- `GET /api/health`

## Recommended Free Model

- `"openai/gpt-3.5-turbo"` (fast, reliable, 30+ free messages/day)
- See [OpenRouter free models](https://openrouter.ai/docs#models)

## Tips

- For hackathons, in-memory session is fine. Use a DB for production.
- See the `services/ai_service.py` for model config.