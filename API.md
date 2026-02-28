# VulAI API Reference

## Base URL

```
http://localhost:8000/api
```

## Authentication

Currently no authentication. Future versions will support API keys.

## Rate Limiting

No rate limits in MVP. Future: 100 requests/minute per IP

## Endpoints

### 1. Analyze Code

**Endpoint:** `POST /api/analyze`

Performs full security analysis with static + LLM findings.

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "code": "string (required)",
  "language": "string (required)",
  "filename": "string (optional)",
  "context": {
    // optional metadata
  }
}
```

**Supported Languages:**
- python
- javascript / typescript
- java
- csharp
- go
- rust
- php
- cpp
- c

**Response:**
```json
{
  "findings": [
    {
      "id": "SQL_001_42",
      "type": "SQL_INJECTION",
      "severity": "CRITICAL",
      "confidence": 0.95,
      "line": 42,
      "column": 0,
      "message": "SQL query constructed from unsanitized user input",
      "code_snippet": "query = f\"SELECT * FROM users WHERE id = {user_id}\"",
      "remediation": "Use parameterized queries or prepared statements",
      "secure_example": "db.query('SELECT * FROM users WHERE id = ?', [user_id])",
      "cwe": "CWE-89",
      "references": ["https://owasp.org/www-community/attacks/SQL_Injection"]
    }
  ],
  "score": {
    "overall": 32,
    "grade": "F",
    "critical_count": 2,
    "high_count": 3,
    "medium_count": 1,
    "low_count": 0
  },
  "metadata": {
    "analysis_time_ms": 1250,
    "static_issues": 4,
    "llm_insights": 2,
    "languages_detected": ["python"],
    "model_used": "claude-opus"
  }
}
```

**Example:**
```bash
curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "code": "password = \"secret123\"",
    "language": "python",
    "filename": "config.py"
  }'
```

### 2. Generate Refactor

**Endpoint:** `POST /api/refactor`

Generates secure refactored code for a specific vulnerability.

**Request Body:**
```json
{
  "code": "string (required)",
  "finding_id": "string (required)",
  "language": "string (required)",
  "context": {} // optional
}
```

**Response:**
```json
{
  "original_code": "query = f\"SELECT * FROM users WHERE id = {user_id}\"",
  "refactored_code": "db.query('SELECT * FROM users WHERE id = ?', [user_id])",
  "explanation": "Replaced f-string concatenation with parameterized query",
  "security_improvement": "CRITICAL → RESOLVED",
  "explanation_markdown": "# Security Improvement\n\n## Issue\nSQL Injection vulnerability...\n## Fix\n..."
}
```

**Example:**
```bash
curl -X POST http://localhost:8000/api/refactor \
  -H "Content-Type: application/json" \
  -d '{
    "code": "query = f\"SELECT * FROM users WHERE id = {user_id}\"",
    "finding_id": "SQL_001_1",
    "language": "python"
  }'
```

### 3. Get Security Score

**Endpoint:** `POST /api/score`

Quick security scoring without detailed findings (faster).

**Request Body:**
```json
{
  "code": "string (required)",
  "language": "string (required)"
}
```

**Response:**
```json
{
  "score": 72,
  "grade": "C",
  "summary": "Code has moderate security issues",
  "breakdown": {
    "critical": 0,
    "high": 2,
    "medium": 5,
    "low": 3
  }
}
```

**Example:**
```bash
curl -X POST http://localhost:8000/api/score \
  -H "Content-Type: application/json" \
  -d '{
    "code": "import os\nos.system(f\"ls {user_input}\")",
    "language": "python"
  }'
```

### 4. Health Check

**Endpoint:** `GET /health`

Check if backend is running.

**Response:**
```json
{
  "status": "ok",
  "service": "VulAI Backend",
  "version": "0.1.0"
}
```

**Example:**
```bash
curl http://localhost:8000/health
```

## Error Responses

### 400 Bad Request
```json
{
  "detail": "Validation error: code is required"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Analysis failed: LLM API timeout"
}
```

## Data Types

### Severity Levels
- `CRITICAL` - Exploitable vulnerability, immediate risk
- `HIGH` - Serious vulnerability, should be fixed soon
- `MEDIUM` - Moderate risk, should be addressed
- `LOW` - Low severity, informational

### Vulnerability Types
- `SQL_INJECTION`
- `COMMAND_INJECTION`
- `CODE_INJECTION`
- `HARDCODED_SECRET`
- `SHELL_INJECTION`
- `UNSAFE_API_USAGE`
- `MISSING_INPUT_VALIDATION`
- `CROSS_SITE_SCRIPTING`
- `PATH_TRAVERSAL`
- `INSECURE_DESERIALIZATION`
- `LOGIC_FLAW`
- `ARCHITECTURE_ISSUE`

## Example Workflows

### Complete Analysis Flow

```bash
# 1. Analyze code
curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "code": "password = input(\"Enter password: \")\nwith open(\"creds.txt\", \"w\") as f:\n  f.write(password)",
    "language": "python"
  }' | jq '.findings[0].id'

# 2. Take finding ID and generate refactor
curl -X POST http://localhost:8000/api/refactor \
  -H "Content-Type: application/json" \
  -d '{
    "code": "password = input(\"Enter password: \")\nwith open(\"creds.txt\", \"w\") as f:\n  f.write(password)",
    "finding_id": "SECRET_001_2",
    "language": "python"
  }' | jq '.refactored_code'
```

### Bulk Scoring

```bash
# Score multiple files
for file in *.py; do
  code=$(cat "$file")
  score=$(curl -s -X POST http://localhost:8000/api/score \
    -H "Content-Type: application/json" \
    -d "{\"code\": \"$code\", \"language\": \"python\"}" | jq '.score')
  echo "$file: $score"
done
```

## Rate Limits (Future)

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1234567890
```

## Pagination (Future)

For endpoints returning large results:
```
?page=1&limit=50
```

## Filtering (Future)

Filter findings by severity:
```
/analyze?severity=CRITICAL,HIGH
```

## Webhooks (Future)

Register webhooks for analysis results:
```json
{
  "event": "analysis.complete",
  "url": "https://your-app.com/webhooks/vulai",
  "secret": "webhook-secret"
}
```

## SDK Support (Roadmap)

- Python: `pip install vulai-sdk`
- JavaScript: `npm install @vulai/sdk`
- Go: Coming soon
- Rust: Coming soon

## OpenAPI/Swagger

Full interactive API documentation:
```
http://localhost:8000/docs
```

Alternative (ReDoc):
```
http://localhost:8000/redoc
```

---

**Last Updated:** 2025-02-26
**API Version:** 0.1.0 (MVP)
