"""
Tests for the static analyzer
"""

import pytest
from app.engines.static_analyzer import StaticAnalyzer


def test_static_analyzer_initialization():
    """Test that static analyzer can be initialized"""
    analyzer = StaticAnalyzer()
    assert analyzer is not None


def test_detect_sql_injection(sample_vulnerable_code):
    """Test SQL injection detection"""
    analyzer = StaticAnalyzer()
    findings = analyzer.analyze(sample_vulnerable_code, "python")

    assert len(findings) > 0
    sql_findings = [f for f in findings if "SQL" in f.vulnerability_type]
    assert len(sql_findings) > 0
    assert sql_findings[0].severity == "CRITICAL"


def test_detect_hardcoded_secret(sample_vulnerable_code):
    """Test hardcoded secret detection"""
    analyzer = StaticAnalyzer()
    findings = analyzer.analyze(sample_vulnerable_code, "python")

    secret_findings = [f for f in findings if "SECRET" in f.vulnerability_type]
    assert len(secret_findings) > 0
    assert secret_findings[0].severity == "CRITICAL"


def test_detect_command_injection(sample_vulnerable_code):
    """Test command injection detection"""
    analyzer = StaticAnalyzer()
    findings = analyzer.analyze(sample_vulnerable_code, "python")

    cmd_findings = [f for f in findings if "COMMAND" in f.vulnerability_type]
    assert len(cmd_findings) > 0
    assert cmd_findings[0].severity == "CRITICAL"


def test_safe_code_has_fewer_findings(sample_safe_code):
    """Test that safe code has fewer/no critical findings"""
    analyzer = StaticAnalyzer()
    findings = analyzer.analyze(sample_safe_code, "python")

    critical_findings = [f for f in findings if f.severity == "CRITICAL"]
    assert len(critical_findings) == 0


def test_finding_has_required_fields(sample_vulnerable_code):
    """Test that findings have all required fields"""
    analyzer = StaticAnalyzer()
    findings = analyzer.analyze(sample_vulnerable_code, "python")

    assert len(findings) > 0
    finding = findings[0]

    assert hasattr(finding, 'id')
    assert hasattr(finding, 'vulnerability_type')
    assert hasattr(finding, 'severity')
    assert hasattr(finding, 'confidence')
    assert hasattr(finding, 'line')
    assert hasattr(finding, 'message')


def test_empty_code_returns_no_findings():
    """Test that empty code returns no findings"""
    analyzer = StaticAnalyzer()
    findings = analyzer.analyze("", "python")

    assert len(findings) == 0


def test_code_without_vulnerabilities():
    """Test code with no obvious vulnerabilities"""
    safe_code = """
def add(a, b):
    return a + b

result = add(5, 3)
print(f"Result: {result}")
"""
    analyzer = StaticAnalyzer()
    findings = analyzer.analyze(safe_code, "python")

    # Should have no critical findings
    critical = [f for f in findings if f.severity == "CRITICAL"]
    assert len(critical) == 0
