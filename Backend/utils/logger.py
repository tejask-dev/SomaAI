"""
Advanced Logging Utility
Provides structured logging with different log levels and formatting
"""
import logging
import sys
from datetime import datetime
from typing import Optional

class AdvancedLogger:
    """Enhanced logger with structured logging and performance tracking"""
    
    def __init__(self, name: str, level: int = logging.INFO):
        self.logger = logging.getLogger(name)
        self.logger.setLevel(level)
        
        # Prevent duplicate handlers
        if not self.logger.handlers:
            handler = logging.StreamHandler(sys.stdout)
            handler.setLevel(level)
            
            formatter = logging.Formatter(
                '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                datefmt='%Y-%m-%d %H:%M:%S'
            )
            handler.setFormatter(formatter)
            self.logger.addHandler(handler)
    
    def info(self, message: str, **kwargs):
        """Log info message with optional context"""
        context = " | ".join([f"{k}={v}" for k, v in kwargs.items()])
        self.logger.info(f"{message} {context}" if context else message)
    
    def error(self, message: str, error: Optional[Exception] = None, **kwargs):
        """Log error with exception details"""
        context = " | ".join([f"{k}={v}" for k, v in kwargs.items()])
        error_msg = f"{message} {context}" if context else message
        if error:
            error_msg += f" | Error: {str(error)}"
        self.logger.error(error_msg, exc_info=error is not None)
    
    def warning(self, message: str, **kwargs):
        """Log warning message"""
        context = " | ".join([f"{k}={v}" for k, v in kwargs.items()])
        self.logger.warning(f"{message} {context}" if context else message)
    
    def debug(self, message: str, **kwargs):
        """Log debug message"""
        context = " | ".join([f"{k}={v}" for k, v in kwargs.items()])
        self.logger.debug(f"{message} {context}" if context else message)
    
    def performance(self, operation: str, duration: float, **kwargs):
        """Log performance metrics"""
        context = " | ".join([f"{k}={v}" for k, v in kwargs.items()])
        self.logger.info(f"PERF | {operation} took {duration:.3f}s {context}")

# Global logger instance
logger = AdvancedLogger("SomaAI")

