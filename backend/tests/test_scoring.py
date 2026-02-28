"""
Tests for the risk scoring engine
"""

import pytest
from app.scoring.risk_scorer import RiskScorer
from app.models.vulnerability import Finding


def test_risk_scorer_initialization():
    """Test that risk scorer can be initialized"""
    scorer = RiskScorer()
    assert scorer is not None


def test_score_no_findings():
    """Test scoring with no findings"""
    scorer = RiskScorer()
    findings = []

    score = scorer.compute_score(findings)

    assert score.overall == 100
    assert score.grade == "A"
    assert score.critical_count == 0
    assert score.high_count == 0
    assert score.medium_count == 0
    assert score.low_count == 0


def test_score_single_critical_finding():
    """Test scoring with one critical finding"""
    scorer = RiskScorer()
    finding = Finding(
        id="CRIT_001",
        vulnerability_type="SQL_INJECTION",
        severity="CRITICAL",
        confidence=1.0,
        line=1,
        column=0,
        message="SQL injection"
    )

    score = scorer.compute_score([finding])

    assert score.critical_count == 1
    assert score.overall < 100
    assert score.grade == "F"  # 100 - 100 = 0


def test_score_multiple_findings():
    """Test scoring with multiple findings"""
    scorer = RiskScorer()
    findings = [
        Finding("CRIT_1", "SQL_INJECTION", "CRITICAL", 0.95, 1, 0, "SQL injection"),
        Finding("HIGH_1", "COMMAND_INJECTION", "HIGH", 0.90, 2, 0, "Command injection"),
        Finding("MED_1", "UNSAFE_API_USAGE", "MEDIUM", 0.80, 3, 0, "Unsafe API"),
        Finding("LOW_1", "LOGIC_FLAW", "LOW", 0.70, 4, 0, "Logic flaw"),
    ]

    score = scorer.compute_score(findings)

    assert score.critical_count == 1
    assert score.high_count == 1
    assert score.medium_count == 1
    assert score.low_count == 1
    assert score.overall < 100


def test_score_grade_boundaries():
    """Test that score to grade conversion is correct"""
    scorer = RiskScorer()

    # Create findings with controlled total impact
    # Each CRITICAL = 100 weight * confidence
    findings_critical = [
        Finding(f"C{i}", "SQL_INJECTION", "CRITICAL", 0.05, 1, 0, "")
        for i in range(5)  # Total impact: 5 * 100 * 0.05 = 25
    ]

    score = scorer.compute_score(findings_critical)

    # Score = 100 - 25 = 75 (grade B)
    assert score.grade in ["A", "B"]  # Should be good score


def test_score_f_grade_with_many_critical():
    """Test that many critical findings result in F grade"""
    scorer = RiskScorer()

    findings = [
        Finding(f"C{i}", "SQL_INJECTION", "CRITICAL", 0.95, i+1, 0, "")
        for i in range(5)  # Multiple critical issues
    ]

    score = scorer.compute_score(findings)

    assert score.grade == "F"
    assert score.overall < 20


def test_confidence_affects_score():
    """Test that confidence multiplier affects final score"""
    scorer = RiskScorer()

    # High confidence critical
    finding_high = [Finding("H", "SQL_INJECTION", "CRITICAL", 1.0, 1, 0, "")]
    score_high = scorer.compute_score(finding_high)

    # Low confidence critical
    finding_low = [Finding("L", "SQL_INJECTION", "CRITICAL", 0.5, 1, 0, "")]
    score_low = scorer.compute_score(finding_low)

    # Higher confidence should result in lower score
    assert score_high.overall < score_low.overall


def test_score_returns_valid_range():
    """Test that score is always between 0 and 100"""
    scorer = RiskScorer()

    # Test with extreme findings
    extreme_findings = [
        Finding(f"EX{i}", "SQL_INJECTION", "CRITICAL", 0.99, i+1, 0, "")
        for i in range(20)
    ]

    score = scorer.compute_score(extreme_findings)

    assert 0 <= score.overall <= 100
    assert score.grade in ["A", "B", "C", "D", "F"]
