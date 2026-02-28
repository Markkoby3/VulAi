"""
Security risk scoring and grading logic
"""

import logging
from typing import List
from app.models.vulnerability import Finding, SecurityScore

logger = logging.getLogger("vulai")


class RiskScorer:
    """
    Computes weighted security scores from vulnerabilities.
    Produces 0-100 score and A-F letter grade.
    """

    # Severity weights (impact on final score)
    SEVERITY_WEIGHTS = {
        "CRITICAL": 100,
        "HIGH": 75,
        "MEDIUM": 50,
        "LOW": 10
    }

    # Grade thresholds
    GRADE_THRESHOLDS = {
        "A": 80,
        "B": 60,
        "C": 40,
        "D": 20,
        "F": 0
    }

    def compute_score(self, findings: List[Finding]) -> SecurityScore:
        """
        Compute security score from findings.
        Score = 100 - sum(weighted_issues)
        """

        # Count by severity
        severity_counts = {
            "CRITICAL": 0,
            "HIGH": 0,
            "MEDIUM": 0,
            "LOW": 0
        }

        total_weighted_impact = 0.0

        for finding in findings:
            severity_counts[finding.severity] += 1
            weight = self.SEVERITY_WEIGHTS.get(finding.severity, 10)
            # Apply confidence multiplier
            impact = weight * finding.confidence
            total_weighted_impact += impact

        # Calculate score (starts at 100, decreases with issues)
        # Each impact point subtracts directly (more aggressive)
        weighted_impact = min(total_weighted_impact, 100)
        score = max(0, 100 - int(weighted_impact))

        # Determine grade
        grade = self._score_to_grade(score)

        logger.info(
            f"Score: {score} ({grade}) - "
            f"Critical: {severity_counts['CRITICAL']}, "
            f"High: {severity_counts['HIGH']}, "
            f"Medium: {severity_counts['MEDIUM']}, "
            f"Low: {severity_counts['LOW']}"
        )

        return SecurityScore(
            overall=score,
            grade=grade,
            critical_count=severity_counts["CRITICAL"],
            high_count=severity_counts["HIGH"],
            medium_count=severity_counts["MEDIUM"],
            low_count=severity_counts["LOW"]
        )

    def _score_to_grade(self, score: int) -> str:
        """Convert numeric score to letter grade"""
        if score >= self.GRADE_THRESHOLDS["A"]:
            return "A"
        elif score >= self.GRADE_THRESHOLDS["B"]:
            return "B"
        elif score >= self.GRADE_THRESHOLDS["C"]:
            return "C"
        elif score >= self.GRADE_THRESHOLDS["D"]:
            return "D"
        else:
            return "F"
