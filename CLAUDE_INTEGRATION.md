# Claude API Integration - Quick Start Guide

## ✅ What's Implemented

VulAI now has **Claude-powered security analysis** integrated into its core engine:

- **Context-Aware Detection:** Claude analyzes code logic and semantics beyond static patterns
- **LLM-Generated Refactors:** Secure code suggestions powered by Claude Opus
- **Confidence Scoring:** AI-driven confidence calculations for each finding
- **Production-Ready:** Type-safe, async-enabled, proper error handling

---

## 🚀 Setup (5 Minutes)

### 1. Get Your Claude API Key

1. Go to [https://console.anthropic.com](https://console.anthropic.com)
2. Create an account or sign in
3. Navigate to **API Keys**
4. Create a new API key
5. Copy the key (starts with `sk-ant-...`)

### 2. Configure Environment

Create or update `.env` in the `backend/` directory:

```bash
# Backend Configuration
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000

# Claude API Configuration
LLM_PROVIDER=anthropic
LLM_API_KEY=sk-ant-YOUR_API_KEY_HERE
LLM_MODEL=claude-opus-4-20250514

# Logging
DEBUG=false
LOG_LEVEL=INFO
ENABLE_LOGGING=true
```

**Never commit your API key to git!**

### 3. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

This includes:
- `anthropic>=0.7.6` - Claude SDK
- `fastapi>=0.104.1` - Web framework
- `pydantic>=2.5.0` - Type validation
- All testing dependencies

### 4. Start the Backend

```bash
cd backend
python -m uvicorn app.main:app --reload
```

You should see:

```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete
INFO:vulai: Activating VulAI extension...
INFO:vulai: Claude client initialized successfully
```

---

## 💻 How It Works

### Analysis Pipeline

```
User Code
    ↓
[StaticAnalyzer] → Fast pattern matching (10ms)
    ↓
[LLMAnalyzer] → Claude context analysis (2-3s)
    ↓
[RiskScorer] → Weighted vulnerability scoring
    ↓
[ReportBuilder] → Structured JSON response
    ↓
VSCode Extension → Inline highlights + security grade
```

### API Endpoints

#### POST `/api/analyze`

Scan code for vulnerabilities with Claude augmentation.

**Request:**
```bash
curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "code": "import os\nuser_id = input(\"ID: \")\nos.system(f\"ls {user_id}\")",
    "language": "python"
  }'
```

**Response:**
```json
{
  "findings": [
    {
      "id": "SQL_001_1",
      "type": "COMMAND_INJECTION",
      "severity": "CRITICAL",
      "confidence": 0.95,
      "line": 3,
      "column": 0,
      "message": "User input directly in os.system() call",
      "remediation": "Use subprocess.run() with list arguments",
      "cwe": "CWE-78"
    },
    {
      "id": "LLM_UNSAFE_ARCHITECTURE_0",
      "type": "UNSAFE_ARCHITECTURE",
      "severity": "HIGH",
      "confidence": 0.85,
      "line": 2,
      "column": 0,
      "message": "Direct user input without validation",
      "remediation": "Add input validation before system command"
    }
  ],
  "score": {
    "overall": 15,
    "grade": "F",
    "critical_count": 1,
    "high_count": 1,
    "medium_count": 0,
    "low_count": 0
  },
  "metadata": {
    "analysis_time_ms": 2500,
    "static_issues": 1,
    "llm_insights": 1,
    "languages_detected": ["python"],
    "model_used": "claude-opus-4-20250514"
  }
}
```

#### POST `/api/refactor`

Generate secure refactored code for a vulnerability.

**Request:**
```bash
curl -X POST http://localhost:8000/api/refactor \
  -H "Content-Type: application/json" \
  -d '{
    "code": "os.system(f\"ls {user_id}\")",
    "finding_id": "CMD_001",
    "language": "python"
  }'
```

**Response:**
```json
{
  "original_code": "os.system(f\"ls {user_id}\")",
  "refactored_code": "import subprocess\nresult = subprocess.run(['ls', user_id], capture_output=True, text=True)\noutput = result.stdout",
  "explanation": "Replaced dangerous os.system() with subprocess.run() using list syntax. This prevents shell injection attacks because the command and arguments are passed separately.",
  "security_improvement": "CRITICAL → RESOLVED"
}
```

#### GET `/health`

Check backend health and Claude connectivity.

```bash
curl http://localhost:8000/health
```

Response:
```json
{
  "status": "ok",
  "service": "VulAI",
  "version": "0.1.0"
}
```

---

## 🧪 Testing

### Run All Tests

```bash
cd backend
pytest tests/ -v
```

Expected output:
```
tests/test_api.py::test_analyze_endpoint_structure PASSED        [ 11%]
tests/test_api.py::test_analyze_detects_sql_injection PASSED     [ 14%]
...
======================== 27 passed in 2.15s ========================
```

### Test Claude Integration Specifically

```bash
python -c "
from app.engines.llm_analyzer import LLMAnalyzer
import asyncio

async def test():
    analyzer = LLMAnalyzer()
    code = 'x = input(); os.system(f\"cmd {x}\")'
    findings = await analyzer.analyze(code, [], 'python')
    print(f'LLM found {len(findings)} issues')

asyncio.run(test())
"
```

### Manual API Testing

```bash
# 1. Start backend
python -m uvicorn app.main:app --reload

# 2. In another terminal, test the endpoint
curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "code": "password = \"secret123\"",
    "language": "python"
  }' | python -m json.tool
```

---

## 📊 What Claude Analyzes

Claude's analysis **complements** static analysis:

### Static Analysis (Built-in)
- SQL Injection patterns
- Hardcoded secrets (regex-based)
- Command injection patterns
- Code injection (`eval`, `exec`)
- Fast (10-50ms)

### Claude Analysis (Added)
- Logic flaws and security architecture issues
- Unsafe patterns beyond regex
- Missing input validation
- Insecure data handling
- Race conditions
- Dependency vulnerabilities
- Contextual remediation guidance
- Slower (~2-3 seconds per request)

### Example: Logic Flaw Detection

**Static Analyzer:** Sees no pattern match → No finding

**Claude Analyzer:** Sees context → Detects issue

```python
# Code
user_auth = check_password(user, password)
if user_auth == True:  # Logic flaw!
    grant_access()

# Static: ✓ Detects if regex pattern matches
# Claude: ✓ Detects non-strict comparison logic flaw
```

---

## ⚙️ Configuration

### Backend Configuration (`backend/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `BACKEND_HOST` | `localhost` | Server host |
| `BACKEND_PORT` | `8000` | Server port |
| `LLM_PROVIDER` | `anthropic` | LLM provider (only `anthropic` supported) |
| `LLM_API_KEY` | (required) | Your Claude API key |
| `LLM_MODEL` | `claude-opus-4-20250514` | Claude model version |
| `DEBUG` | `false` | Enable debug mode |
| `LOG_LEVEL` | `INFO` | Logging level (DEBUG, INFO, WARNING, ERROR) |

### Advanced Configuration

Modify `backend/app/config.py` for fine-tuning:

```python
class Config:
    # Analysis timeout (seconds)
    analysis_timeout: int = 30

    # Severity weights for scoring
    severity_weights: Dict[str, float] = {
        "CRITICAL": 100,
        "HIGH": 75,
        "MEDIUM": 50,
        "LOW": 10
    }

    # Grade thresholds
    grade_thresholds: Dict[str, int] = {
        "A": 80,
        "B": 60,
        "C": 40,
        "D": 20,
        "F": 0
    }
```

---

## 🔧 Troubleshooting

### "Claude client not available"

**Issue:** LLM layer is disabled

**Cause:** `LLM_API_KEY` not set or Anthropic SDK not installed

**Fix:**
```bash
# 1. Set API key
export LLM_API_KEY=sk-ant-your-key-here

# 2. Install Anthropic SDK
pip install anthropic

# 3. Restart backend
```

### "Claude API error: invalid_request_error"

**Issue:** Invalid API key or model name

**Cause:** Wrong API key format or unsupported model

**Fix:**
```bash
# Verify API key format (should start with sk-ant-)
# Use correct model: claude-opus-4-20250514
```

### Analysis is slow (>10 seconds)

**Issue:** Claude API is taking too long

**Cause:** Network latency or API overload

**Fix:**
```python
# Adjust timeout in backend/app/config.py
ANALYSIS_TIMEOUT = 60  # Increase from 30

# Or skip LLM analysis for quick scores:
# POST /api/score → Static analysis only (~100ms)
```

### "No JSON found in Claude response"

**Issue:** Response parsing failed

**Cause:** Claude returned non-JSON response

**Fix:** This is handled gracefully—backend falls back to static findings with a log warning

---

## 📈 Performance

### Latency Profile

```
Code Input
  ↓
StaticAnalyzer: ~10-50ms
  ↓
LLMAnalyzer:   ~2000-3000ms  ← Claude API call
  ↓
RiskScorer:    ~5-10ms
  ↓
ReportBuilder: ~1-5ms
──────────────────────────
TOTAL:         ~2100-3100ms per request
```

### Optimization Tips

1. **Use `/api/score` for quick feedback:** Only static analysis (~50ms)
2. **Cache results:** Store findings for identical code
3. **Batch requests:** Multiple files in one call
4. **Async processing:** Background analysis for non-blocking UX

---

## 🔐 Security Best Practices

1. **Never commit API keys**
   ```bash
   # Good
   export LLM_API_KEY=sk-ant-...

   # Bad
   LLM_API_KEY=sk-ant-... in .env (if not in .gitignore)
   ```

2. **Use environment variables**
   ```python
   from os import getenv
   api_key = getenv("LLM_API_KEY")
   ```

3. **Rotate API keys regularly**
   - Go to Anthropic Console
   - Delete old keys
   - Create new ones

4. **Monitor API usage**
   - Check Anthropic Console for usage patterns
   - Set up cost alerts

---

## 📚 Architecture

### LLM Integration Points

**1. StaticAnalyzer (Fast)**
- Location: `app/engines/static_analyzer.py`
- Input: Code, language
- Output: Pattern-based findings
- Time: ~10-50ms

**2. LLMAnalyzer (Smart)**
- Location: `app/engines/llm_analyzer.py`
- Input: Code, static findings, language
- Uses: Claude Opus via Anthropic SDK
- Output: Enhanced findings with LLM insights
- Time: ~2-3 seconds

**3. RiskScorer (Weighted)**
- Location: `app/scoring/risk_scorer.py`
- Input: All findings (static + LLM)
- Output: Security score (0-100), grade (A-F)
- Time: ~5-10ms

**4. ReportBuilder (JSON)**
- Location: `app/reporting/report_builder.py`
- Input: Findings + score + metadata
- Output: AnalyzeResponse JSON
- Time: ~1-5ms

---

## 🚀 Next Steps

1. **Run the backend:**
   ```bash
   cd backend && python -m uvicorn app.main:app --reload
   ```

2. **Test a request:**
   ```bash
   curl -X POST http://localhost:8000/api/analyze \
     -H "Content-Type: application/json" \
     -d '{"code": "password = \"secret\"", "language": "python"}'
   ```

3. **Build VSCode Extension:**
   See `vscode-extension/SETUP.md`

4. **Deploy to production:**
   See `DEPLOYMENT.md`

---

## 📞 Support

- **Documentation:** See `ARCHITECTURE.md`, `API.md`
- **Tests:** `cd backend && pytest tests/ -v`
- **API Docs:** `http://localhost:8000/docs`
- **Issues:** Check logs in `backend/app/logging_config.py`

---

**Claude is now powering your security analysis! 🚀**
