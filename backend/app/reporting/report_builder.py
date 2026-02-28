"""
Report building and formatting
"""

from typing import List, Dict, Any
from app.models.vulnerability import Finding, SecurityScore
from app.api.schemas import AnalyzeResponse, Finding as FindingSchema, AnalysisMetadata


class ReportBuilder:
    """Builds structured vulnerability reports"""

    def build_response(
        self,
        findings: List[Finding],
        score: SecurityScore,
        metadata: Dict[str, Any]
    ) -> AnalyzeResponse:
        """Build a structured analysis response"""

        # Convert Finding objects to Pydantic schemas
        finding_schemas = [self._finding_to_schema(f) for f in findings]

        # Build metadata
        metadata_schema = AnalysisMetadata(
            analysis_time_ms=metadata.get("analysis_time_ms", 0),
            static_issues=metadata.get("static_issues", 0),
            llm_insights=metadata.get("llm_insights", 0),
            languages_detected=metadata.get("languages_detected", []),
            model_used=metadata.get("model_used")
        )

        return AnalyzeResponse(
            findings=finding_schemas,
            score={
                "overall": score.overall,
                "grade": score.grade,
                "critical_count": score.critical_count,
                "high_count": score.high_count,
                "medium_count": score.medium_count,
                "low_count": score.low_count
            },
            metadata=metadata_schema
        )

    def _finding_to_schema(self, finding: Finding) -> FindingSchema:
        """Convert internal Finding to Pydantic schema"""
        return FindingSchema(
            id=finding.id,
            type=finding.vulnerability_type,
            severity=finding.severity,
            confidence=finding.confidence,
            line=finding.line,
            column=finding.column,
            message=finding.message,
            code_snippet=finding.code_snippet,
            remediation=finding.remediation,
            secure_example=finding.secure_example,
            cwe=finding.cwe,
            references=finding.references
        )
