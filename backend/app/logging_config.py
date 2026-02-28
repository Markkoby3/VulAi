"""
Logging configuration for VulAI
"""

import logging
import sys
from app.config import Settings

settings = Settings()


def setup_logging():
    """Configure logging for the application"""

    if not settings.enable_logging:
        return logging.getLogger("vulai")

    # Create logger
    logger = logging.getLogger("vulai")
    logger.setLevel(settings.log_level)

    # Console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(settings.log_level)

    # Formatter
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    console_handler.setFormatter(formatter)

    # Add handler
    if not logger.handlers:
        logger.addHandler(console_handler)

    return logger
