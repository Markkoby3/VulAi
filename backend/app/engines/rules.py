"""
Vulnerability detection rules for static analysis
"""

from typing import List, Dict, Any
from dataclasses import dataclass


@dataclass
class DetectionRule:
    """A vulnerability detection rule"""
    rule_id: str
    vulnerability_type: str
    severity: str
    patterns: List[str]  # Regex patterns to match
    description: str
    remediation: str
    cwe: str


# Vulnerability detection rules
RULES: List[DetectionRule] = [
    DetectionRule(
        rule_id="SQL_001",
        vulnerability_type="SQL_INJECTION",
        severity="CRITICAL",
        patterns=[
            r"f['\"]SELECT.*\{.*\}",  # f-strings in SQL
            r"\.format\(.*\)\s*in\s+(execute|query)",  # .format() in SQL
            r"\".*\+\s*\w+\s*\+.*\".*execute",  # String concatenation
        ],
        description="SQL query constructed with unsanitized user input",
        remediation="Use parameterized queries or prepared statements",
        cwe="CWE-89"
    ),
    DetectionRule(
        rule_id="CMD_001",
        vulnerability_type="COMMAND_INJECTION",
        severity="CRITICAL",
        patterns=[
            r"os\.system\(.*['\"].*\{.*['\"]",  # f-strings in os.system
            r"os\.system\(['\"].*\+.*['\"]",    # string concat in os.system
            r"subprocess\.(call|run|popen)\(.*['\"].*\{",
            r"subprocess\.(call|run|popen)\(.*['\"].*\+",
            r"exec\(.*['\"].*\{",
            r"popen\(.*['\"].*\{",
        ],
        description="Command constructed from user input",
        remediation="Use subprocess.run() with list arguments instead of shell execution",
        cwe="CWE-78"
    ),
    DetectionRule(
        rule_id="SECRET_001",
        vulnerability_type="HARDCODED_SECRET",
        severity="CRITICAL",
        patterns=[
            r"(password|api_key|secret|token|auth)\s*=\s*['\"][a-zA-Z0-9_\-]*['\"]",
            r"\.password\s*=\s*['\"][^'\"]+['\"]",
        ],
        description="Potential hardcoded secret in source code",
        remediation="Move secrets to environment variables or secure configuration",
        cwe="CWE-798"
    ),
    DetectionRule(
        rule_id="CODE_001",
        vulnerability_type="CODE_INJECTION",
        severity="CRITICAL",
        patterns=[
            r"eval\(",
            r"exec\(",
            r"__import__\(",
        ],
        description="Dangerous code execution function",
        remediation="Avoid eval/exec; use safer alternatives",
        cwe="CWE-95"
    ),
]


def get_rules_for_language(language: str) -> List[DetectionRule]:
    """Get applicable rules for a specific language"""
    # For now, return all rules (can be language-specific later)
    return RULES
