"""
Input Validation Utilities
Advanced validation and sanitization for user inputs
"""
import re
from typing import Tuple, Optional
from utils.logger import logger

class InputValidator:
    """Advanced input validator with sanitization"""
    
    # Maximum lengths
    MAX_MESSAGE_LENGTH = 2000
    MAX_TOPIC_LENGTH = 200
    MIN_MESSAGE_LENGTH = 1
    
    # Pattern for detecting potentially malicious content
    SCRIPT_PATTERN = re.compile(r'<script|javascript:|onerror=|onload=', re.IGNORECASE)
    SQL_INJECTION_PATTERN = re.compile(r"('|(\\')|(--)|(;)|(\*)|(\%))", re.IGNORECASE)
    
    @staticmethod
    def validate_message(message: str) -> Tuple[bool, Optional[str]]:
        """
        Validate and sanitize user message
        Returns: (is_valid, error_message)
        """
        if not message or not isinstance(message, str):
            return False, "Message must be a non-empty string"
        
        # Trim whitespace
        message = message.strip()
        
        if len(message) < InputValidator.MIN_MESSAGE_LENGTH:
            return False, "Message is too short"
        
        if len(message) > InputValidator.MAX_MESSAGE_LENGTH:
            return False, f"Message exceeds maximum length of {InputValidator.MAX_MESSAGE_LENGTH} characters"
        
        # Check for script injection attempts
        if InputValidator.SCRIPT_PATTERN.search(message):
            logger.warning("Potential script injection detected", message_preview=message[:50])
            return False, "Invalid characters detected in message"
        
        # Check for SQL injection (if using database later)
        if InputValidator.SQL_INJECTION_PATTERN.search(message):
            logger.warning("Potential SQL injection detected", message_preview=message[:50])
            return False, "Invalid characters detected in message"
        
        return True, None
    
    @staticmethod
    def sanitize_message(message: str) -> str:
        """Sanitize message by removing potentially dangerous content"""
        # Remove script tags
        message = re.sub(r'<script[^>]*>.*?</script>', '', message, flags=re.IGNORECASE | re.DOTALL)
        # Remove HTML tags (basic)
        message = re.sub(r'<[^>]+>', '', message)
        # Trim whitespace
        return message.strip()
    
    @staticmethod
    def validate_session_id(session_id: str) -> Tuple[bool, Optional[str]]:
        """Validate session ID format"""
        if not session_id or not isinstance(session_id, str):
            return False, "Session ID must be a non-empty string"
        
        # UUID format validation (basic check)
        uuid_pattern = re.compile(r'^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$', re.IGNORECASE)
        if not uuid_pattern.match(session_id):
            return False, "Invalid session ID format"
        
        return True, None
    
    @staticmethod
    def validate_language(lang: str, allowed_langs: list) -> Tuple[bool, Optional[str]]:
        """Validate language code"""
        if not lang or not isinstance(lang, str):
            return False, "Language must be a non-empty string"
        
        if lang not in allowed_langs:
            return False, f"Unsupported language. Allowed: {', '.join(allowed_langs)}"
        
        return True, None
    
    @staticmethod
    def validate_topic(topic: str) -> Tuple[bool, Optional[str]]:
        """Validate lesson topic"""
        if not topic or not isinstance(topic, str):
            return False, "Topic must be a non-empty string"
        
        topic = topic.strip()
        
        if len(topic) < InputValidator.MIN_MESSAGE_LENGTH:
            return False, "Topic is too short"
        
        if len(topic) > InputValidator.MAX_TOPIC_LENGTH:
            return False, f"Topic exceeds maximum length of {InputValidator.MAX_TOPIC_LENGTH} characters"
        
        return True, None

validator = InputValidator()

