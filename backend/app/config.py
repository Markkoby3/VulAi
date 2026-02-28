"""
Configuration management for VulAI backend
"""

import os
from pydantic_settings import BaseSettings
from typing import Optional, Dict


class Settings(BaseSettings):
    """Application settings from environment variables and defaults"""

    # Server configuration
    backend_host: str = os.getenv("BACKEND_HOST", "localhost")
    backend_port: int = int(os.getenv("BACKEND_PORT", 8000))
    debug: bool = os.getenv("DEBUG", "false").lower() == "true"

    # LLM configuration
    llm_provider: str = os.getenv("LLM_PROVIDER", "anthropic")
    llm_api_key: Optional[str] = os.getenv("LLM_API_KEY")
    llm_model: str = os.getenv("LLM_MODEL", "claude-opus-4-20250514")

    # Analysis configuration
    analysis_timeout: int = int(os.getenv("ANALYSIS_TIMEOUT", 30))
    enable_caching: bool = os.getenv("ENABLE_CACHING", "true").lower() == "true"

    # Logging
    log_level: str = os.getenv("LOG_LEVEL", "INFO")
    enable_logging: bool = os.getenv("ENABLE_LOGGING", "true").lower() == "true"

    # Security scoring weights
    severity_weights: Dict[str, float] = {
        "CRITICAL": 100.0,
        "HIGH": 75.0,
        "MEDIUM": 50.0,
        "LOW": 10.0
    }

    class Config:
        env_file = ".env"
        case_sensitive = False
