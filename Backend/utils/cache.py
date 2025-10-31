"""
Response Caching Utility
Simple in-memory cache for frequently asked questions
"""
import hashlib
import time
from typing import Optional, Dict, Any
from threading import Lock

class ResponseCache:
    """Thread-safe in-memory cache for API responses"""
    
    def __init__(self, ttl_seconds: int = 3600, max_size: int = 1000):
        """
        Initialize cache
        Args:
            ttl_seconds: Time to live for cache entries in seconds
            max_size: Maximum number of cache entries
        """
        self.cache: Dict[str, Dict[str, Any]] = {}
        self.ttl = ttl_seconds
        self.max_size = max_size
        self.lock = Lock()
    
    def _generate_key(self, prefix: str, *args, **kwargs) -> str:
        """Generate cache key from arguments"""
        # Create a deterministic string from args and kwargs
        key_data = f"{prefix}:{str(args)}:{str(sorted(kwargs.items()))}"
        return hashlib.md5(key_data.encode()).hexdigest()
    
    def get(self, prefix: str, *args, **kwargs) -> Optional[Any]:
        """Get cached value if exists and not expired"""
        key = self._generate_key(prefix, *args, **kwargs)
        
        with self.lock:
            if key not in self.cache:
                return None
            
            entry = self.cache[key]
            
            # Check if expired
            if time.time() > entry['expires_at']:
                del self.cache[key]
                return None
            
            return entry['value']
    
    def set(self, prefix: str, value: Any, *args, **kwargs):
        """Set cache value with TTL"""
        key = self._generate_key(prefix, *args, **kwargs)
        
        with self.lock:
            # Evict oldest if cache is full
            if len(self.cache) >= self.max_size and key not in self.cache:
                oldest_key = min(self.cache.keys(), key=lambda k: self.cache[k]['expires_at'])
                del self.cache[oldest_key]
            
            self.cache[key] = {
                'value': value,
                'expires_at': time.time() + self.ttl,
                'created_at': time.time()
            }
    
    def clear(self):
        """Clear all cache entries"""
        with self.lock:
            self.cache.clear()
    
    def cleanup_expired(self):
        """Remove expired entries (call periodically)"""
        current_time = time.time()
        with self.lock:
            expired_keys = [
                key for key, entry in self.cache.items()
                if current_time > entry['expires_at']
            ]
            for key in expired_keys:
                del self.cache[key]
        
        return len(expired_keys)

# Global cache instance
cache = ResponseCache(ttl_seconds=1800)  # 30 minutes default TTL

