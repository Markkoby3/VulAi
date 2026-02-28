"""
Claude API client for security vulnerability analysis
"""

import asyncio
import logging
from typing import Optional
import anthropic

logger = logging.getLogger("vulai")


class ClaudeClient:
    """
    Wrapper for Claude API with security analysis capabilities
    """

    def __init__(self, api_key: str, model: str = "claude-opus-4-20250514", timeout: int = 30):
        self.api_key = api_key
        self.model = model
        self.timeout = timeout
        self.client = anthropic.Anthropic(api_key=api_key)
        logger.info(f"Claude client initialized with model: {model}")

    async def analyze_code_for_vulnerabilities(
        self, code: str, language: str, existing_findings: list
    ) -> dict:
        """
        Use Claude to perform context-aware vulnerability analysis

        Args:
            code: Source code to analyze
            language: Programming language
            existing_findings: Static analysis findings to augment

        Returns:
            dict with:
            - insights: List of additional vulnerabilities found
            - severity_adjustments: Confidence score updates
            - explanations: Detailed risk explanations
        """

        # Format existing findings for context
        findings_context = self._format_findings(existing_findings)

        prompt = f"""Analyze this {language} code for security vulnerabilities and logic flaws that go beyond static patterns.

CODE:
```{language}
{code}
```

EXISTING STATIC FINDINGS:
{findings_context}

Your task:
1. Identify security vulnerabilities in the code (logic flaws, unsafe patterns, architectural issues)
2. Assess if the static findings are accurate
3. Find additional vulnerabilities that static analysis missed
4. Provide confidence scores (0.0-1.0) for severity
5. Explain the security risk in detail

Return a JSON object with:
{{
    "additional_findings": [
        {{
            "vulnerability_type": "TYPE (e.g., LOGIC_FLAW, UNSAFE_ARCHITECTURE)",
            "severity": "CRITICAL|HIGH|MEDIUM|LOW",
            "confidence": 0.0-1.0,
            "line_hint": "approximate line or function name",
            "message": "Detailed explanation of the vulnerability",
            "remediation": "How to fix it",
            "cwe": "Related CWE if applicable"
        }}
    ],
    "static_findings_assessment": {{
        "accurate_count": number,
        "false_positive_count": number,
        "notes": "Assessment of static findings quality"
    }},
    "overall_risk_assessment": "Brief summary"
}}"""

        try:
            # Call Claude synchronously (for async support, would need async client)
            message = self.client.messages.create(
                model=self.model,
                max_tokens=2048,
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            )

            # Extract response text
            response_text = message.content[0].text

            # Parse JSON from response
            import json
            try:
                # Try to extract JSON from the response
                json_start = response_text.find('{')
                json_end = response_text.rfind('}') + 1
                if json_start >= 0 and json_end > json_start:
                    json_str = response_text[json_start:json_end]
                    result = json.loads(json_str)
                    logger.info(f"Claude analysis complete: {len(result.get('additional_findings', []))} additional findings")
                    return result
                else:
                    logger.warning("No JSON found in Claude response")
                    return {"additional_findings": [], "overall_risk_assessment": response_text[:200]}
            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse Claude JSON response: {e}")
                return {"additional_findings": [], "overall_risk_assessment": response_text[:200]}

        except anthropic.APIError as e:
            logger.error(f"Claude API error: {e}")
            raise

    async def generate_secure_refactor(
        self, vulnerable_code: str, vulnerability_type: str, language: str, explanation: str
    ) -> dict:
        """
        Generate a secure refactored version of vulnerable code

        Args:
            vulnerable_code: The vulnerable code snippet
            vulnerability_type: Type of vulnerability
            language: Programming language
            explanation: Explanation of the vulnerability

        Returns:
            dict with:
            - refactored_code: Secure version
            - explanation: Why this is safer
            - security_improvement: Brief assessment
        """

        prompt = f"""Generate a secure, refactored version of this vulnerable {language} code.

VULNERABILITY: {vulnerability_type}
EXPLANATION: {explanation}

VULNERABLE CODE:
```{language}
{vulnerable_code}
```

Requirements:
1. Fix the vulnerability completely
2. Maintain the original functionality
3. Use best practices for {language}
4. Add explanatory comments if helpful
5. Keep the code clean and professional

Return a JSON object with:
{{
    "refactored_code": "The secure refactored code",
    "explanation": "Why this approach is more secure",
    "security_improvement": "What vulnerability was fixed",
    "best_practices_applied": ["list", "of", "practices"]
}}"""

        try:
            message = self.client.messages.create(
                model=self.model,
                max_tokens=2048,
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            )

            response_text = message.content[0].text

            import json
            try:
                json_start = response_text.find('{')
                json_end = response_text.rfind('}') + 1
                if json_start >= 0 and json_end > json_start:
                    json_str = response_text[json_start:json_end]
                    result = json.loads(json_str)
                    logger.info(f"Claude refactor generated successfully")
                    return result
                else:
                    logger.warning("No JSON found in refactor response")
                    return {
                        "refactored_code": vulnerable_code,
                        "explanation": response_text[:200],
                        "security_improvement": vulnerability_type
                    }
            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse refactor JSON: {e}")
                return {
                    "refactored_code": vulnerable_code,
                    "explanation": response_text[:200],
                    "security_improvement": vulnerability_type
                }

        except anthropic.APIError as e:
            logger.error(f"Claude API error during refactor: {e}")
            raise

    def _format_findings(self, findings: list) -> str:
        """Format findings for Claude context"""
        if not findings:
            return "No static findings"

        formatted = []
        for f in findings:
            formatted.append(
                f"- Line ~{f.get('line', '?')}: {f.get('type', 'UNKNOWN')} - {f.get('message', '')}"
            )
        return "\n".join(formatted)

    def health_check(self) -> bool:
        """Check if Claude API is accessible"""
        try:
            message = self.client.messages.create(
                model=self.model,
                max_tokens=10,
                messages=[
                    {
                        "role": "user",
                        "content": "Say 'OK'"
                    }
                ]
            )
            return message.stop_reason == "end_turn"
        except Exception as e:
            logger.error(f"Claude health check failed: {e}")
            return False
