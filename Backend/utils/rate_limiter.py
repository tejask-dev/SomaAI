"""
Rate Limiting Utility
Thread-safe in-memory rate limiters using a sliding window algorithm.
Separate limiters are provided for different endpoint categories so that
abuse on one endpoint cannot starve another.
"""
import time
from typing import Dict, Tuple
from collections import defaultdict
from threading import Lock


class RateLimiter:
    """Thread-safe sliding-window rate limiter."""

    def __init__(self, max_requests: int = 60, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window = window_seconds
        self.requests: Dict[str, list] = defaultdict(list)
        self.lock = Lock()

    def is_allowed(self, identifier: str) -> Tuple[bool, int]:
        """
        Check whether the identifier is within rate limits.
        Returns (is_allowed, remaining_requests).
        """
        current_time = time.time()

        with self.lock:
            # Expire old entries outside the sliding window
            self.requests[identifier] = [
                t for t in self.requests[identifier]
                if current_time - t < self.window
            ]

            if len(self.requests[identifier]) >= self.max_requests:
                return False, 0

            self.requests[identifier].append(current_time)
            remaining = self.max_requests - len(self.requests[identifier])
            return True, remaining

    def get_remaining(self, identifier: str) -> int:
        """Return how many requests remain in the current window."""
        current_time = time.time()
        with self.lock:
            self.requests[identifier] = [
                t for t in self.requests[identifier]
                if current_time - t < self.window
            ]
            return max(0, self.max_requests - len(self.requests[identifier]))

    def reset(self, identifier: str):
        """Clear the request history for an identifier (e.g., after a ban lifts)."""
        with self.lock:
            self.requests.pop(identifier, None)


# ---------------------------------------------------------------------------
# Named limiters — use the right one for the right endpoint category.
# All default to IP-based identification so that creating a new session
# cannot bypass rate limits.
# ---------------------------------------------------------------------------

# General chat messages (per session_id, relaxed)
rate_limiter = RateLimiter(max_requests=30, window_seconds=60)

# Session creation (per IP, strict — prevents bot-driven session farming)
session_limiter = RateLimiter(max_requests=10, window_seconds=60)

# Lesson generation (per IP, strict — expensive AI operation)
lesson_limiter = RateLimiter(max_requests=5, window_seconds=60)

# Admin endpoints (per IP, moderate)
admin_limiter = RateLimiter(max_requests=20, window_seconds=60)

