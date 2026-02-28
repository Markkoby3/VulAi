"""
Tests for the FastAPI routes
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app


@pytest.fixture
def client():
    """Create a test client"""
    return TestClient(app)


def test_health_endpoint(client):
    """Test health check endpoint"""
    response = client.get("/health")

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "service" in data
    assert "version" in data


def test_root_endpoint(client):
    """Test root endpoint"""
    response = client.get("/")

    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "docs" in data


def test_analyze_endpoint_structure(client):
    """Test that analyze endpoint exists and has correct structure"""
    code = "x = 1 + 2"
    payload = {
        "code": code,
        "language": "python"
    }

    response = client.post("/api/analyze", json=payload)

    assert response.status_code == 200
    data = response.json()

    # Check response structure
    assert "findings" in data
    assert "score" in data
    assert "metadata" in data

    # Check score structure
    assert "overall" in data["score"]
    assert "grade" in data["score"]
    assert "critical_count" in data["score"]
    assert "high_count" in data["score"]
    assert "medium_count" in data["score"]
    assert "low_count" in data["score"]


def test_analyze_detects_sql_injection(client):
    """Test that analyze endpoint detects SQL injection"""
    code = 'query = f"SELECT * FROM users WHERE id = {user_id}"'
    payload = {
        "code": code,
        "language": "python"
    }

    response = client.post("/api/analyze", json=payload)

    assert response.status_code == 200
    data = response.json()

    # Should have findings
    assert len(data["findings"]) > 0

    # Check for SQL injection
    sql_findings = [f for f in data["findings"] if "SQL" in f["type"]]
    assert len(sql_findings) > 0


def test_analyze_with_filename(client):
    """Test analyze with filename parameter"""
    code = "password = 'secret'"
    payload = {
        "code": code,
        "language": "python",
        "filename": "config.py"
    }

    response = client.post("/api/analyze", json=payload)

    assert response.status_code == 200
    data = response.json()
    assert "metadata" in data


def test_analyze_requires_code(client):
    """Test that code parameter is required"""
    payload = {
        "language": "python"
    }

    response = client.post("/api/analyze", json=payload)

    assert response.status_code == 422  # Validation error


def test_analyze_requires_language(client):
    """Test that language parameter is required"""
    payload = {
        "code": "x = 1"
    }

    response = client.post("/api/analyze", json=payload)

    assert response.status_code == 422  # Validation error


def test_score_endpoint(client):
    """Test score endpoint"""
    payload = {
        "code": "x = 1 + 2",
        "language": "python"
    }

    response = client.post("/api/score", json=payload)

    assert response.status_code == 200
    data = response.json()

    assert "score" in data
    assert "grade" in data
    assert "summary" in data
    assert "breakdown" in data


def test_score_returns_valid_grades(client):
    """Test that score returns valid A-F grades"""
    payload = {
        "code": "def hello(): pass",
        "language": "python"
    }

    response = client.post("/api/score", json=payload)

    assert response.status_code == 200
    data = response.json()
    assert data["grade"] in ["A", "B", "C", "D", "F"]
    assert 0 <= data["score"] <= 100


def test_refactor_endpoint_exists(client):
    """Test that refactor endpoint exists"""
    payload = {
        "code": "query = f'SELECT * FROM users WHERE id = {id}'",
        "finding_id": "SQL_001_1",
        "language": "python"
    }

    response = client.post("/api/refactor", json=payload)

    # Should return 200 or error, but endpoint should exist
    assert response.status_code in [200, 400, 500]


def test_finding_structure(client):
    """Test that findings have correct structure"""
    code = 'query = f"SELECT * FROM users WHERE id = {user_id}"'
    payload = {
        "code": code,
        "language": "python"
    }

    response = client.post("/api/analyze", json=payload)

    assert response.status_code == 200
    data = response.json()

    if len(data["findings"]) > 0:
        finding = data["findings"][0]

        assert "id" in finding
        assert "type" in finding
        assert "severity" in finding
        assert "confidence" in finding
        assert "line" in finding
        assert "message" in finding
