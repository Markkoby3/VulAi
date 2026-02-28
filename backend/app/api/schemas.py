"""
Pydantic schemas for request/response validation
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum


class SeverityLevel(str, Enum):
    """Vulnerability severity levels"""
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"


class VulnerabilityType(str, Enum):
    """Types of vulnerabilities"""
    SQL_INJECTION = "SQL_INJECTION"
    COMMAND_INJECTION = "COMMAND_INJECTION"
    CODE_INJECTION = "CODE_INJECTION"
    HARDCODED_SECRET = "HARDCODED_SECRET"
    SHELL_INJECTION = "SHELL_INJECTION"
    UNSAFE_API_USAGE = "UNSAFE_API_USAGE"
    MISSING_INPUT_VALIDATION = "MISSING_INPUT_VALIDATION"
    CROSS_SITE_SCRIPTING = "CROSS_SITE_SCRIPTING"
    PATH_TRAVERSAL = "PATH_TRAVERSAL"
    INSECURE_DESERIALIZATION = "INSECURE_DESERIALIZATION"
    LOGIC_FLAW = "LOGIC_FLAW"
    ARCHITECTURE_ISSUE = "ARCHITECTURE_ISSUE"


class AnalyzeRequest(BaseModel):
    """Request to analyze code for vulnerabilities"""
    code: str = Field(..., description="Code to analyze", min_length=1)
    language: str = Field(..., description="Programming language (python, javascript, java, etc)", min_length=1)
    filename: Optional[str] = Field(None, description="Filename for context")
    context: Optional[Dict[str, Any]] = Field(None, description="Additional context")


class Finding(BaseModel):
    """A security finding/vulnerability"""
    id: str = Field(..., description="Unique finding ID")
    type: VulnerabilityType = Field(..., description="Type of vulnerability")
    severity: SeverityLevel = Field(..., description="Severity level")
    confidence: float = Field(..., description="Confidence (0-1)")
    line: int = Field(..., description="Line number (1-indexed)")
    column: int = Field(0, description="Column number (0-indexed)")
    message: str = Field(..., description="Human-readable description")
    code_snippet: Optional[str] = Field(None, description="Vulnerable code snippet")
    remediation: Optional[str] = Field(None, description="How to fix this issue")
    secure_example: Optional[str] = Field(None, description="Example of secure code")
    cwe: Optional[str] = Field(None, description="CWE identifier")
    references: Optional[List[str]] = Field(None, description="Reference URLs")


class SecurityScore(BaseModel):
    """Security scoring summary"""
    overall: int = Field(..., description="Overall score (0-100)", ge=0, le=100)
    grade: str = Field(..., description="Letter grade (A-F)")
    critical_count: int = Field(..., description="Number of critical issues")
    high_count: int = Field(..., description="Number of high issues")
    medium_count: int = Field(..., description="Number of medium issues")
    low_count: int = Field(..., description="Number of low issues")


class AnalysisMetadata(BaseModel):
    """Metadata about the analysis"""
    analysis_time_ms: int = Field(..., description="Analysis time in milliseconds")
    static_issues: int = Field(..., description="Issues found by static analysis")
    llm_insights: int = Field(..., description="Additional insights from LLM")
    languages_detected: List[str] = Field(..., description="Detected programming languages")
    model_used: Optional[str] = Field(None, description="LLM model used")


class AnalyzeResponse(BaseModel):
    """Response from code analysis"""
    findings: List[Finding] = Field(..., description="List of findings")
    score: SecurityScore = Field(..., description="Security score")
    metadata: AnalysisMetadata = Field(..., description="Analysis metadata")


class RefactorRequest(BaseModel):
    """Request to generate secure refactored code"""
    code: str = Field(..., description="Original code", min_length=1)
    finding_id: str = Field(..., description="ID of the vulnerability to fix")
    language: str = Field(..., description="Programming language")
    context: Optional[Dict[str, Any]] = Field(None, description="Additional context")


class RefactorResponse(BaseModel):
    """Response with refactored secure code"""
    original_code: str = Field(..., description="Original vulnerable code")
    refactored_code: str = Field(..., description="Refactored secure code")
    explanation: str = Field(..., description="Explanation of changes")
    security_improvement: str = Field(..., description="Summary of improvement (e.g., 'CRITICAL → RESOLVED')")
    explanation_markdown: Optional[str] = Field(None, description="Detailed explanation in markdown")


class ScoreRequest(BaseModel):
    """Request to get security score for code"""
    code: str = Field(..., description="Code to score", min_length=1)
    language: str = Field(..., description="Programming language", min_length=1)


class ScoreResponse(BaseModel):
    """Response with security score"""
    score: int = Field(..., description="Security score (0-100)", ge=0, le=100)
    grade: str = Field(..., description="Letter grade (A-F)")
    summary: str = Field(..., description="Human-readable summary")
    breakdown: Dict[str, int] = Field(..., description="Breakdown by severity")


class HealthCheckResponse(BaseModel):
    """Health check response"""
    status: str = Field(..., description="Service status")
    service: str = Field(..., description="Service name")
    version: str = Field(..., description="Service version")
