# VulAI — System Architecture

## System Overview

VulAI is a modular, multi-tier DevSecOps co-pilot that combines:
- **Static Analysis Engine** → Fast pattern-based vulnerability detection
- **LLM Security Layer** → Context-aware AI analysis & remediation
- **Risk & Scoring Engine** → Weighted vulnerability classification
- **Report Builder** → Structured vulnerability output
- **FastAPI Backend** → REST API serving VSCode client
- **VSCode Extension** → Native IDE integration

---

## 1. Module Boundaries & Separation of Concerns

```
┌─────────────────────────────────────────────────────────────┐
│                     VSCode Extension                         │
│                (Client Layer - UI & Diagnostics)            │
└──────────────────────┬──────────────────────────────────────┘
                       │ REST API (HTTP/JSON)
┌──────────────────────▼──────────────────────────────────────┐
│                    FastAPI Backend                           │
├──────────────────────────────────────────────────────────────┤
│                   API Layer (Routing)                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Endpoints:                                         │   │
│  │  POST /analyze    - Scan code for vulnerabilities  │   │
│  │  GET  /score      - Get security score              │   │
│  │  POST /refactor   - Generate secure rewrite         │   │
│  │  GET  /health     - Health check                    │   │
│  └─────────────────────────────────────────────────────┘   │
├──────────────────────────────────────────────────────────────┤
│            Core Security Analysis Engines                    │
│  ┌──────────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Static Analysis  │  │ LLM Layer    │  │ Risk Scorer  │  │
│  │ (Pattern Rules)  │  │ (Claude API) │  │ (Weighting)  │  │
│  └──────────────────┘  └──────────────┘  └──────────────┘  │
├──────────────────────────────────────────────────────────────┤
│            Infrastructure & Support                          │
│  ┌──────────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Report Builder   │  │ Config Mgmt  │  │ Logger       │  │
│  └──────────────────┘  └──────────────┘  └──────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

---

## 2. Folder Structure

```
VulAi/
├── backend/                           # FastAPI application root
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                   # FastAPI app entry point
│   │   ├── config.py                 # Configuration & env vars
│   │   ├── logging_config.py         # Logging setup
│   │   │
│   │   ├── api/                      # API layer
│   │   │   ├── __init__.py
│   │   │   ├── routes.py             # All endpoint definitions
│   │   │   └── schemas.py            # Pydantic request/response models
│   │   │
│   │   ├── engines/                  # Core analysis engines
│   │   │   ├── __init__.py
│   │   │   ├── static_analyzer.py    # Pattern-based vulnerability detection
│   │   │   ├── llm_analyzer.py       # LLM-powered context analysis
│   │   │   └── rules.py              # Vulnerability rule definitions
│   │   │
│   │   ├── scoring/                  # Risk scoring & classification
│   │   │   ├── __init__.py
│   │   │   ├── risk_scorer.py        # Vulnerability weighting logic
│   │   │   └── scoring_rules.py      # Severity mappings & formulas
│   │   │
│   │   ├── reporting/                # Report generation
│   │   │   ├── __init__.py
│   │   │   ├── report_builder.py     # JSON report construction
│   │   │   └── formatter.py          # Output formatting
│   │   │
│   │   ├── models/                   # Data models (business logic)
│   │   │   ├── __init__.py
│   │   │   ├── vulnerability.py      # Vulnerability class
│   │   │   ├── finding.py            # Finding/Issue class
│   │   │   └── report.py             # Report class
│   │   │
│   │   └── utils/                    # Shared utilities
│   │       ├── __init__.py
│   │       ├── constants.py          # App-wide constants
│   │       └── exceptions.py         # Custom exceptions
│   │
│   ├── tests/                        # Unit & integration tests
│   │   ├── __init__.py
│   │   ├── conftest.py               # pytest configuration
│   │   ├── test_api.py               # API endpoint tests
│   │   ├── test_static_analyzer.py   # Static analyzer tests
│   │   ├── test_llm_analyzer.py      # LLM analyzer tests
│   │   └── test_scoring.py           # Scoring logic tests
│   │
│   ├── requirements.txt              # Python dependencies
│   ├── Dockerfile                    # Container image
│   ├── docker-compose.yml            # Local dev environment
│   └── .env.example                  # Environment variables template
│
├── vscode-extension/                 # VSCode extension root
│   ├── src/
│   │   ├── extension.ts              # Extension entry point
│   │   ├── config.ts                 # Extension configuration
│   │   │
│   │   ├── client/                   # VSCode API client
│   │   │   ├── api.ts                # HTTP client to backend
│   │   │   └── types.ts              # TypeScript type definitions
│   │   │
│   │   ├── ui/                       # UI components & diagnostics
│   │   │   ├── diagnostics.ts        # Inline code diagnostics
│   │   │   ├── status_bar.ts         # Security score display
│   │   │   ├── webview.ts            # Detailed report panel
│   │   │   └── commands.ts           # Command palette actions
│   │   │
│   │   ├── features/                 # Feature implementations
│   │   │   ├── analyzer.ts           # Orchestrates analysis workflow
│   │   │   ├── refactor.ts           # Secure code refactor handler
│   │   │   └── watcher.ts            # File change listener
│   │   │
│   │   └── utils/                    # Utilities
│   │       └── logger.ts             # Extension logging
│   │
│   ├── test/
│   │   ├── extension.test.ts         # Extension tests
│   │   └── refactor.test.ts          # Refactor logic tests
│   │
│   ├── package.json                  # Node dependencies
│   ├── tsconfig.json                 # TypeScript configuration
│   ├── webpack.config.js             # Bundler configuration
│   ├── extension.manifest.json        # VSCode manifest
│   └── .vscodeignore                 # Files to exclude from bundle
│
├── docs/                             # Documentation
│   ├── API.md                        # API reference
│   ├── ARCHITECTURE.md               # This file
│   ├── SETUP.md                      # Development setup
│   └── DEPLOYMENT.md                 # Production deployment
│
├── .gitignore
├── README.md
├── LICENSE
└── docker-compose.yml                # Full-stack orchestration
```

---

## 3. API Contracts

### Request/Response Schema

**Endpoint: `POST /analyze`**
```json
// REQUEST
{
  "code": "string (code to analyze)",
  "language": "string (python, javascript, etc)",
  "filename": "string (for context)",
  "context": "object (optional metadata)"
}

// RESPONSE
{
  "findings": [
    {
      "id": "CVE-2024-001",
      "type": "SQL_INJECTION",
      "severity": "CRITICAL",
      "confidence": 0.95,
      "line": 42,
      "column": 15,
      "message": "User input directly concatenated in SQL query",
      "code_snippet": "query = f\"SELECT * FROM users WHERE id = {user_id}\"",
      "remediation": "Use parameterized queries or ORM",
      "secure_example": "query = db.query('SELECT * FROM users WHERE id = ?', [user_id])"
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
    "languages_detected": ["python"]
  }
}
```

**Endpoint: `POST /refactor`**
```json
// REQUEST
{
  "code": "string (code to refactor)",
  "finding_id": "string (vulnerability ID to fix)",
  "language": "string"
}

// RESPONSE
{
  "original_code": "string",
  "refactored_code": "string",
  "explanation": "string (why this is safer)",
  "security_improvement": "CRITICAL → RESOLVED"
}
```

**Endpoint: `GET /score`**
```json
// REQUEST (query params)
?code=<base64_encoded>&language=python

// RESPONSE
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

---

## 4. Core Engine Interfaces

### Static Analyzer
```python
class StaticAnalyzer:
    def analyze(self, code: str, language: str) -> List[Finding]:
        """
        Fast pattern-based vulnerability detection.
        Returns immediate findings without LLM calls.
        """
        pass
```

### LLM Analyzer
```python
class LLMAnalyzer:
    async def analyze(self, code: str, findings: List[Finding]) -> List[Finding]:
        """
        Augment static findings with LLM context analysis.
        Detect logic flaws, architecture issues, semantic problems.
        """
        pass
```

### Risk Scorer
```python
class RiskScorer:
    def compute_score(self, findings: List[Finding]) -> SecurityScore:
        """
        Weighted vulnerability scoring.
        Returns: overall_score (0-100), grade (A-F), breakdown.
        """
        pass
```

---

## 5. VSCode Extension Architecture

### Core Workflow
1. **User opens a file** → Watcher detects change
2. **Extension sends code to backend** → `/analyze` endpoint
3. **Backend returns findings** → Extension displays diagnostics
4. **User clicks "Fix"** → Extension calls `/refactor` endpoint
5. **Backend generates secure code** → Extension applies changes

### Diagnostic Integration
- Each vulnerability → VSCode Diagnostic at exact line/column
- Severity mapping → Error, Warning, Information levels
- Hover text → Detailed explanation + remediation link

### Status Bar
- Real-time security score display (0-100, A-F grade)
- Color-coded (🔴 F, 🟠 D/C, 🟡 B, 🟢 A)
- Click to open detailed report panel

---

## 6. Configuration Management

### Environment Variables (`.env`)
```
BACKEND_PORT=8000
BACKEND_HOST=localhost

LLM_PROVIDER=anthropic
LLM_API_KEY=sk-...
LLM_MODEL=claude-opus

ANALYSIS_TIMEOUT=30
ENABLE_LOGGING=true
LOG_LEVEL=INFO
```

### App Config (`config.py`)
```python
class Config:
    backend_port: int = 8000
    llm_provider: str = "anthropic"
    analysis_timeout: int = 30
    enable_caching: bool = True
    severity_weights: Dict[str, float] = {
        "CRITICAL": 100,
        "HIGH": 75,
        "MEDIUM": 50,
        "LOW": 10
    }
```

---

## 7. Data Flow

### Analysis Request
```
VSCode Extension
  ↓ (code, language)
FastAPI /analyze
  ↓
StaticAnalyzer (fast, pattern-based)
  ↓
LLMAnalyzer (context-aware, async)
  ↓
RiskScorer (weighted vulnerabilities)
  ↓
ReportBuilder (structured JSON)
  ↓ (findings + score)
VSCode Extension (diagnostics + panel)
```

---

## 8. Deployment Architecture

### Local Development
- `docker-compose up` → Backend + optional services
- VSCode runs extension locally
- Hot reload enabled for both backend & extension

### Production
- Backend → Containerized FastAPI (ECR/Docker Hub)
- Database → PostgreSQL (for persistence)
- Cache → Redis (for analysis caching)
- LLM → Claude API (Anthropic)
- VSCode Extension → Published to marketplace

### Roadmap (Future)
- GitHub App integration
- CI/CD pipeline scanning
- Multi-file analysis
- Batch reporting
- Custom rule definition

---

## 9. Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **FastAPI** | Async, typed, production-ready, excellent for DevTools |
| **Pydantic Models** | Type safety, automatic validation, OpenAPI docs |
| **Modular Engines** | Easy to replace static → other tools, LLM → other APIs |
| **VSCode Native** | Huge developer market, seamless workflow integration |
| **JSON Reports** | Machine-readable, tool-friendly, dashboard-compatible |
| **Async Analysis** | LSP-like responsiveness, non-blocking UX |
| **Weighted Scoring** | Realistic risk assessment, not just counts |

---

## 10. Scalability & Future

### Today (MVP)
- Single backend instance
- Stateless API
- In-memory analysis cache
- Direct LLM calls

### Phase 2
- Load balancer + multiple backend instances
- Redis for distributed caching
- PostgreSQL for finding storage & history
- Batch analysis queue

### Phase 3
- GitHub App integration
- PR/MR security gates
- Custom rule engine
- Webhook triggers

---

## Next Steps

1. ✅ **Architecture** (THIS DOC)
2. 📋 **API Contracts** (Generate OpenAPI spec)
3. 🗂️ **Folder Structure** (Initialize git repo + directories)
4. 🔧 **Backend Scaffold** (FastAPI + engines)
5. 🎨 **VSCode Extension** (TypeScript setup)
6. 🧪 **Tests** (Pytest + Jest)
7. 🐳 **Containerization** (Docker + compose)
8. 🚀 **Deployment** (Kubernetes ready)
