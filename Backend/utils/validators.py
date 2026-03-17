"""
Input Validation Utilities
Validates and sanitizes user inputs before they are processed.

Design notes:
- Messages are sent to an external LLM (OpenRouter), NOT to a SQL database.
  The original SQL-injection pattern was overly aggressive and broke legitimate
  multilingual input (French apostrophes, semicolons in sentences, etc.).
  SQL injection is not a relevant attack surface here. We defend instead against
  XSS/script injection, oversized payloads, and unexpected types.
- All sanitization strips script/HTML tags; content is never rendered as raw HTML.
"""
import re
from typing import Tuple, Optional
from utils.logger import logger


class InputValidator:
    """Validates and sanitizes user inputs."""

    # Size limits
    MAX_MESSAGE_LENGTH = 2000
    MAX_TOPIC_LENGTH = 200
    MIN_MESSAGE_LENGTH = 1

    # Only block patterns that would be dangerous when reflected in HTML or
    # executed as code.  Deliberately NOT blocking single-quotes, semicolons,
    # or percent signs — those are valid in French, Portuguese, Swahili, etc.
    SCRIPT_PATTERN = re.compile(
        r'<\s*script|javascript\s*:|on\w+\s*=|<\s*iframe|<\s*object|<\s*embed',
        re.IGNORECASE
    )

    @staticmethod
    def validate_message(message: str) -> Tuple[bool, Optional[str]]:
        """Validate a chat message. Returns (is_valid, error_message)."""
        if not message or not isinstance(message, str):
            return False, "Message must be a non-empty string"

        message = message.strip()

        if len(message) < InputValidator.MIN_MESSAGE_LENGTH:
            return False, "Message is too short"

        if len(message) > InputValidator.MAX_MESSAGE_LENGTH:
            return False, f"Message exceeds maximum length of {InputValidator.MAX_MESSAGE_LENGTH} characters"

        if InputValidator.SCRIPT_PATTERN.search(message):
            logger.warning("Potential script injection attempt detected", preview=message[:50])
            return False, "Invalid content detected in message"

        return True, None

    @staticmethod
    def sanitize_message(message: str) -> str:
        """Strip script tags and HTML from a message before storage/display."""
        # Remove script blocks first
        message = re.sub(r'<script[^>]*>.*?</script>', '', message, flags=re.IGNORECASE | re.DOTALL)
        # Strip remaining HTML tags
        message = re.sub(r'<[^>]+>', '', message)
        return message.strip()

    @staticmethod
    def validate_session_id(session_id: str) -> Tuple[bool, Optional[str]]:
        """Validate that a session ID is a properly-formatted UUID."""
        if not session_id or not isinstance(session_id, str):
            return False, "Session ID must be a non-empty string"

        uuid_pattern = re.compile(
            r'^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
            re.IGNORECASE
        )
        if not uuid_pattern.match(session_id):
            return False, "Invalid session ID format"

        return True, None

    @staticmethod
    def validate_language(lang: str, allowed_langs: list) -> Tuple[bool, Optional[str]]:
        """Validate that a language code is in the allowed list."""
        if not lang or not isinstance(lang, str):
            return False, "Language must be a non-empty string"

        if lang not in allowed_langs:
            return False, f"Unsupported language. Allowed: {', '.join(allowed_langs)}"

        return True, None

    @staticmethod
    def validate_topic(topic: str) -> Tuple[bool, Optional[str]]:
        """Validate a lesson topic string."""
        if not topic or not isinstance(topic, str):
            return False, "Topic must be a non-empty string"

        topic = topic.strip()

        if len(topic) < InputValidator.MIN_MESSAGE_LENGTH:
            return False, "Topic is too short"

        if len(topic) > InputValidator.MAX_TOPIC_LENGTH:
            return False, f"Topic exceeds maximum length of {InputValidator.MAX_TOPIC_LENGTH} characters"

        if InputValidator.SCRIPT_PATTERN.search(topic):
            return False, "Invalid content detected in topic"

        return True, None


validator = InputValidator()

