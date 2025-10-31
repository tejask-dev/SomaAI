"""
Advanced Reading Level Adaptation Service
Adapts AI responses to match user's reading level preference
"""
import re
from typing import List
from utils.logger import logger

def _simplify_text(text: str) -> str:
    """
    Simplify text for easier reading
    - Replace complex words with simpler alternatives
    - Shorten long sentences
    - Break up complex structures
    """
    # Simple word replacements for common complex terms
    replacements = {
        r'\butilize\b': 'use',
        r'\bapproximately\b': 'about',
        r'\bconsequently\b': 'so',
        r'\bfurthermore\b': 'also',
        r'\bnevertheless\b': 'but',
        r'\bhowever\b': 'but',
        r'\balthough\b': 'but',
        r'\bregarding\b': 'about',
        r'\bpreviously\b': 'before',
        r'\binitially\b': 'first',
        r'\bfrequently\b': 'often',
        r'\boccasionally\b': 'sometimes',
        r'\bessential\b': 'important',
        r'\bnecessary\b': 'needed',
        r'\bsignificant\b': 'important',
        r'\bconsiderable\b': 'a lot of',
    }
    
    simplified = text
    for pattern, replacement in replacements.items():
        simplified = re.sub(pattern, replacement, simplified, flags=re.IGNORECASE)
    
    # Break up very long sentences (simple heuristic)
    sentences = re.split(r'[.!?]+\s+', simplified)
    simplified_sentences = []
    
    for sentence in sentences:
        if len(sentence) > 100:
            # Try to split at commas if sentence is too long
            parts = re.split(r',\s+', sentence)
            if len(parts) > 1:
                simplified_sentences.extend([p + ',' if i < len(parts) - 1 else p 
                                           for i, p in enumerate(parts)])
            else:
                simplified_sentences.append(sentence)
        else:
            simplified_sentences.append(sentence)
    
    return '. '.join(simplified_sentences)


def _enrich_text(text: str) -> str:
    """
    Enrich text with more detail and context
    - Add explanatory phrases
    - Include more context
    - Use more precise terminology
    """
    # Don't over-enrich if already detailed
    if len(text) > 500:
        return text
    
    # Add connecting phrases for flow
    enriched = text
    
    # Enhance with context markers (simple approach)
    # In a real implementation, this would use AI to add appropriate detail
    
    return enriched


def adapt_reading_level(answer: str, lang: str, reading_level: str) -> str:
    """
    Adapt answer text to match reading level
    
    Args:
        answer: Original answer text
        lang: Language code
        reading_level: "simple", "detailed", or "standard"
    
    Returns:
        Adapted answer text
    """
    if not answer:
        return answer
    
    try:
        if reading_level == "simple":
            adapted = _simplify_text(answer)
            logger.info("Text simplified", original_length=len(answer), 
                       adapted_length=len(adapted))
            return adapted
            
        elif reading_level == "detailed":
            adapted = _enrich_text(answer)
            logger.info("Text enriched", original_length=len(answer), 
                       adapted_length=len(adapted))
            return adapted
            
        else:
            # Standard - return as-is
            return answer
            
    except Exception as e:
        logger.error("Error adapting reading level", error=e, reading_level=reading_level)
        # Return original on error
        return answer