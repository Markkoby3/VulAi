"""
Static vulnerability analyzer using pattern matching
"""

import re
import logging
from typing import List
from app.models.vulnerability import Finding
from app.engines.rules import get_rules_for_language

logger = logging.getLogger("vulai")


class StaticAnalyzer:
    """Fast pattern-based vulnerability detection"""

    def analyze(self, code: str, language: str) -> List[Finding]:
        """
        Analyze code using pattern matching rules.
        Returns list of vulnerabilities found.
        """
        findings: List[Finding] = []
        rules = get_rules_for_language(language)

        lines = code.split('\n')

        for rule in rules:
            for line_num, line in enumerate(lines, start=1):
                for pattern in rule.patterns:
                    try:
                        if re.search(pattern, line, re.IGNORECASE):
                            finding = Finding(
                                id=f"{rule.rule_id}_{line_num}",
                                vulnerability_type=rule.vulnerability_type,
                                severity=rule.severity,
                                confidence=0.85,  # Pattern match confidence
                                line=line_num,
                                column=len(line) - len(line.lstrip()),
                                message=rule.description,
                                code_snippet=line.strip(),
                                remediation=rule.remediation,
                                cwe=rule.cwe
                            )
                            findings.append(finding)
                            break  # Don't match same line twice
                    except re.error:
                        logger.warning(f"Invalid regex pattern: {pattern}")

        return findings
