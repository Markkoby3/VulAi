"""
Custom exceptions for VulAI
"""


class VulAIException(Exception):
    """Base exception for VulAI"""
    pass


class AnalysisError(VulAIException):
    """Error during code analysis"""
    pass


class LLMError(VulAIException):
    """Error from LLM service"""
    pass


class ConfigError(VulAIException):
    """Configuration error"""
    pass
