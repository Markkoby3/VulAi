"""
LLM-powered security analyzer for context-aware vulnerability detection
"""

import logging
import asyncio
import json
from typing import List, Dict, Any
from app.models.vulnerability import Finding
from app.config import Settings

logger = logging.getLogger("vulai")
settings = Settings()


class LLMAnalyzer:
    """
    Uses Claude to augment static analysis with semantic/logic understanding.
    Detects architecture issues, logic flaws, and context-aware problems.
    """

    def __init__(self):
        self.client = None
        self._initialize_client()

    def _initialize_client(self):
        """Initialize the LLM client"""
        if settings.llm_provider == "anthropic":
            try:
                import anthropic
                self.client = anthropic.Anthropic(api_key=settings.llm_api_key)
                logger.info("Claude client initialized successfully")
            except ImportError:
                logger.warning("Anthropic SDK not installed")
                self.client = None
            except Exception as e:
                logger.warning(f"Failed to initialize Claude client: {e}")
                self.client = None

    async def analyze(self, code: str, static_findings: List[Finding], language: str) -> List[Finding]:
        """
        Augment static findings with LLM analysis.
        Detect logic flaws, architecture issues, and generate remediations.
        """
        if not self.client:
            logger.warning("LLM client not available, returning static findings only")
            return static_findings

        try:
            # Format existing findings for context
            findings_context = self._format_findings(static_findings)

            prompt = f"""Analyze this {language} code for security vulnerabilities.

Code:
```{language}
{code}
```

Already found issues:
{findings_context}

Identify:
1. Additional security issues the static analysis missed (logic flaws, architecture problems)
2. Improved remediation guidance
3. Any CWE mappings

Respond ONLY with valid JSON:
{{
    "additional_findings": [
        {{
            "vulnerability_type": "TYPE",
            "severity": "CRITICAL|HIGH|MEDIUM|LOW",
            "confidence": 0.0-1.0,
            "line": 1,
            "column": 0,
            "message": "Description",
            "remediation": "How to fix",
            "cwe": "CWE-XXX"
        }}
    ],
    "assessment": "brief summary"
}}"""

            # Call Claude via API
            response = await self._call_llm(prompt)

            # Parse response and extract new findings
            llm_findings = self._parse_llm_response(response, code, language)

            # Merge with static findings (avoiding duplicates)
            all_findings = self._merge_findings(static_findings, llm_findings)

            logger.info(f"LLM analysis complete: found {len(llm_findings)} additional issues")

            return all_findings

        except Exception as e:
            logger.error(f"LLM analysis error: {str(e)}")
            return static_findings  # Fallback to static findings

    async def generate_refactor(self, code: str, finding_id: str, language: str) -> Dict[str, Any]:
        """
        Generate a secure refactored version of the code.
        """
        if not self.client:
            raise Exception("LLM client not available")

        try:
            prompt = f"""You are a security expert. Refactor this {language} code to fix the security issue.

Original code:
```{language}
{code}
```

Finding ID: {finding_id}

Provide a secure refactored version.

Respond ONLY with valid JSON:
{{
    "refactored_code": "secure code here",
    "explanation": "what was changed",
    "security_improvement": "summary",
    "best_practices": ["practice1", "practice2"]
}}"""

            response = await self._call_llm(prompt)
            return self._parse_refactor_response(response, code)

        except Exception as e:
            logger.error(f"Refactor generation error: {str(e)}")
            raise

    async def _call_llm(self, prompt: str) -> str:
        """Call Claude API synchronously (wrapped for async context)"""
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, self._call_llm_sync, prompt)

    def _call_llm_sync(self, prompt: str) -> str:
        """Synchronous LLM call"""
        try:
            response = self.client.messages.create(
                model=settings.llm_model,
                max_tokens=2000,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            return response.content[0].text
        except Exception as e:
            logger.error(f"Claude API call failed: {e}")
            raise

    def _format_findings(self, findings: List[Finding]) -> str:
        """Format findings for LLM context"""
        if not findings:
            return "None"

        formatted = []
        for f in findings:
            formatted.append(f"- Line {f.line}: {f.vulnerability_type} ({f.severity}) - {f.message}")
        return "\n".join(formatted)

    def _parse_llm_response(self, response: str, original_code: str, language: str) -> List[Finding]:
        """Parse LLM response and extract findings"""
        try:
            # Extract JSON from response
            json_start = response.find('{')
            json_end = response.rfind('}') + 1

            if json_start < 0 or json_end <= json_start:
                logger.warning("No JSON found in LLM response")
                return []

            json_str = response[json_start:json_end]
            data = json.loads(json_str)

            findings = []
            for finding_data in data.get('additional_findings', []):
                try:
                    finding = Finding(
                        id=f"LLM_{finding_data.get('vulnerability_type', 'UNKNOWN')}_{len(findings)}",
                        vulnerability_type=finding_data.get('vulnerability_type', 'UNKNOWN'),
                        severity=finding_data.get('severity', 'MEDIUM'),
                        confidence=float(finding_data.get('confidence', 0.7)),
                        line=int(finding_data.get('line', 1)),
                        column=int(finding_data.get('column', 0)),
                        message=finding_data.get('message', 'Logic flaw detected'),
                        remediation=finding_data.get('remediation', 'Review code for security best practices'),
                        cwe=finding_data.get('cwe', '')
                    )
                    findings.append(finding)
                except Exception as e:
                    logger.warning(f"Failed to parse finding: {e}")
                    continue

            logger.info(f"Parsed {len(findings)} findings from LLM response")
            return findings

        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse LLM JSON response: {e}")
            return []
        except Exception as e:
            logger.error(f"Error parsing LLM response: {e}")
            return []

    def _parse_refactor_response(self, response: str, original_code: str) -> Dict[str, Any]:
        """Parse refactor response from LLM"""
        try:
            # Extract JSON from response
            json_start = response.find('{')
            json_end = response.rfind('}') + 1

            if json_start < 0 or json_end <= json_start:
                logger.warning("No JSON found in refactor response")
                return {
                    "original_code": original_code,
                    "refactored_code": original_code,
                    "explanation": "Could not parse Claude response",
                    "security_improvement": "Unknown"
                }

            json_str = response[json_start:json_end]
            data = json.loads(json_str)

            refactored = {
                "original_code": original_code,
                "refactored_code": data.get('refactored_code', original_code),
                "explanation": data.get('explanation', 'Security improvement applied'),
                "security_improvement": data.get('security_improvement', 'Code hardened')
            }

            logger.info("Successfully generated refactored code via Claude")
            return refactored

        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse refactor JSON: {e}")
            return {
                "original_code": original_code,
                "refactored_code": original_code,
                "explanation": f"Parse error: {str(e)}",
                "security_improvement": "Failed to refactor"
            }
        except Exception as e:
            logger.error(f"Error in refactor parsing: {e}")
            return {
                "original_code": original_code,
                "refactored_code": original_code,
                "explanation": str(e),
                "security_improvement": "Error occurred"
            }

    def _merge_findings(self, static: List[Finding], llm: List[Finding]) -> List[Finding]:
        """Merge static and LLM findings, avoiding duplicates"""
        # Create a set of static finding signatures
        static_sigs = {(f.line, f.vulnerability_type) for f in static}

        # Add LLM findings that don't duplicate static findings
        merged = list(static)
        for llm_finding in llm:
            sig = (llm_finding.line, llm_finding.vulnerability_type)
            if sig not in static_sigs:
                merged.append(llm_finding)

        return merged

