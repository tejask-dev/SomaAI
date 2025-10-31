"""
Rate Limiting Utility
Simple in-memory rate limiter for API endpoints
"""
import time
from typing import Dict, Tuple
from collections import defaultdict
from threading import Lock

class RateLimiter:
    """Thread-safe rate limiter using token bucket algorithm"""
    
    def __init__(self, max_requests: int = 100, window_seconds: int = 60):
        """
        Initialize rate limiter
        Args:
            max_requests: Maximum requests per window
            window_seconds: Time window in seconds
        """
        self.max_requests = max_requests
        self.window = window_seconds
        self.requests: Dict[str, list] = defaultdict(list)
        self.lock = Lock()
    
    def is_allowed(self, identifier: str) -> Tuple[bool, int]:
        """
        Check if request is allowed
        Args:
            identifier: Unique identifier (e.g., session_id, IP address)
        Returns:
            (is_allowed, remaining_requests)
        """
        current_time = time.time()
        
        with self.lock:
            # Clean up old requests outside the window
            self.requests[identifier] = [
                req_time for req_time in self.requests[identifier]
                if current_time - req_time < self.window
            ]
            
            # Check if limit exceeded
            if len(self.requests[identifier]) >= self.max_requests:
                remaining = 0
                return False, remaining
            
            # Add current request
            self.requests[identifier].append(current_time)
            remaining = self.max_requests - len(self.requests[identifier])
            
            return True, remaining
    
    def get_remaining(self, identifier: str) -> int:
        """Get remaining requests for identifier"""
        current_time = time.time()
        
        with self.lock:
            # Clean up old requests
            self.requests[identifier] = [
                req_time for req_time in self.requests[identifier]
                if current_time - req_time < self.window
            ]
            
            return max(0, self.max_requests - len(self.requests[identifier]))
    
    def reset(self, identifier: str):
        """Reset rate limit for identifier"""
        with self.lock:
            if identifier in self.requests:
                del self.requests[identifier]

# Global rate limiter instance
rate_limiter = RateLimiter(max_requests=60, window_seconds=60)  # 60 requests per minute

