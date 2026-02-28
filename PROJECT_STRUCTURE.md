# VulAI - Project Architecture & Structure

## Complete Project Tree

```
VulAi/
├── 📋 Root Documentation
│   ├── README.md                    # Main project overview
│   ├── ARCHITECTURE.md              # System design & module breakdown
│   ├── SETUP.md                     # Development setup guide
│   ├── API.md                       # API reference & examples
│   ├── DEPLOYMENT.md                # Production deployment guide
│   ├── .gitignore
│   └── docker-compose.yml           # Full-stack orchestration
│
├── 🔧 backend/                       # FastAPI Backend Application
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                 # FastAPI entry point
│   │   ├── config.py               # Environment configuration
│   │   ├── logging_config.py       # Logging setup
│   │   │
│   │   ├── api/                    # API Layer
│   │   │   ├── __init__.py
│   │   │   ├── routes.py           # Endpoint definitions
│   │   │   └── schemas.py          # Pydantic models
│   │   │
│   │   ├── engines/                # Security Analysis Engines
│   │   │   ├── __init__.py
│   │   │   ├── static_analyzer.py  # Pattern-based detection
│   │   │   ├── llm_analyzer.py     # Claude-powered analysis
│   │   │   └── rules.py            # Vulnerability rules
│   │   │
│   │   ├── scoring/                # Risk Scoring Engine
│   │   │   ├── __init__.py
│   │   │   ├── risk_scorer.py      # Weighted scoring logic
│   │   │   └── scoring_rules.py    # Severity mappings
│   │   │
│   │   ├── models/                 # Business Data Models
│   │   │   ├── __init__.py
│   │   │   ├── vulnerability.py    # Finding & Score classes
│   │   │   └── report.py           # Report model (future)
│   │   │
│   │   ├── reporting/              # Report Generation
│   │   │   ├── __init__.py
│   │   │   ├── report_builder.py   # JSON report construction
│   │   │   └── formatter.py        # Output formatting (future)
│   │   │
│   │   └── utils/                  # Shared Utilities
│   │       ├── __init__.py
│   │       ├── exceptions.py       # Custom exceptions
│   │       └── constants.py        # App constants (future)
│   │
│   ├── tests/                       # Test Suite
│   │   ├── __init__.py
│   │   ├── conftest.py             # pytest configuration
│   │   ├── test_api.py             # API endpoint tests
│   │   ├── test_static_analyzer.py # Static analyzer tests
│   │   ├── test_llm_analyzer.py    # LLM analyzer tests
│   │   └── test_scoring.py         # Risk scorer tests
│   │
│   ├── requirements.txt            # Python dependencies
│   ├── .env.example                # Environment template
│   ├── Dockerfile                  # Container image
│   └── docker-compose.yml          # Local dev environment
│
├── 💻 vscode-extension/             # VSCode Extension
│   ├── src/
│   │   ├── extension.ts            # Extension entry point
│   │   │
│   │   ├── client/                 # Backend API Client
│   │   │   ├── api.ts              # HTTP client wrapper
│   │   │   └── types.ts            # TypeScript interfaces
│   │   │
│   │   ├── ui/                     # UI Components
│   │   │   ├── diagnostics.ts      # Inline code diagnostics
│   │   │   ├── status_bar.ts       # Security score display
│   │   │   ├── webview.ts          # Detail report panel (future)
│   │   │   └── commands.ts         # Command handlers (future)
│   │   │
│   │   ├── features/               # Core Features
│   │   │   ├── analyzer.ts         # Analysis orchestrator
│   │   │   ├── refactor.ts         # Secure code generation
│   │   │   └── watcher.ts          # File change listener (future)
│   │   │
│   │   └── utils/                  # Utilities
│   │       └── logger.ts           # Extension logging
│   │
│   ├── test/
│   │   ├── extension.test.ts       # Extension tests
│   │   └── refactor.test.ts        # Refactor tests
│   │
│   ├── package.json                # Node.js dependencies
│   ├── tsconfig.json               # TypeScript configuration
│   ├── jest.config.json            # Jest test configuration
│   ├── webpack.config.js           # Bundler configuration
│   ├── .vscodeignore               # Files to exclude
│   └── .eslintrc.json              # Linter config (future)
│
└── 📚 docs/ (future)
    ├── CONTRIBUTING.md
    ├── ROADMAP.md
    ├── SECURITY.md
    └── TROUBLESHOOTING.md
```

## Architecture Overview

### System Diagram

```
┌─────────────────────────────────────────────────────────┐
│                  Developer Workstation                   │
│  ┌────────────────────────────────────────────────────┐ │
│  │         VSCode + VulAI Extension                   │ │
│  │  ┌──────────────────────────────────────────────┐ │ │
│  │  │ Editor with inline diagnostics & score       │ │ │
│  │  │ ✓ Highlights issues on specific lines        │ │ │
│  │  │ ✓ Shows severity (🔴 Critical, 🟠 High)    │ │ │
│  │  │ ✓ Displays A-F security grade               │ │ │
│  │  │ ✓ One-click refactor generation              │ │ │
│  │  └──────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────┘ │
│                         │                               │
│                    HTTP/JSON API                        │
│                         │                               │
└─────────────────────────┼───────────────────────────────┘
                          │
                 ┌────────▼────────┐
                 │  VulAI Backend  │ (FastAPI)
                 │   (Python)      │
                 └────────┬────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
   ┌────▼─────┐  ┌──────▼──────┐  ┌───────▼────────┐
   │  Static  │  │     LLM     │  │  Risk Scorer   │
   │ Analyzer │  │  Analyzer   │  │  & Reporter    │
   │          │  │             │  │                │
   │ Identify │  │ Claude API  │  │ Weighted risk  │
   │ patterns │  │             │  │ calculation    │
   │ (fast)   │  │ Context-    │  │                │
   │          │  │ aware logic │  │ Output JSON    │
   └──────────┘  │ flaws       │  │ & grades       │
                 └─────────────┘  └────────────────┘
                          │
                          ▼
                 ┌────────────────┐
                 │  JSON Report   │
                 │  ┌──────────┐  │
                 │  │Findings  │  │
                 │  │Score     │  │
                 │  │Metadata  │  │
                 │  └──────────┘  │
                 └────────────────┘
```

### Module Dependencies

```
Extension
│
├─ API Client
│  └─ VSCode Axios/HTTP
│
├─ Analyzer (Orchestrator)
│  ├─ Diagnostics Manager
│  ├─ Status Bar Manager
│  └─ Logger
│
└─ Features
   ├─ Analyzer Feature
   ├─ Refactor Feature
   └─ Watcher Feature

Backend
│
├─ FastAPI App
│  └─ Routes
│     ├─ POST /analyze
│     ├─ POST /refactor
│     ├─ POST /score
│     └─ GET /health
│
├─ Static Analyzer
│  └─ Rules Engine
│
├─ LLM Analyzer
│  └─ Claude API Client
│
├─ Risk Scorer
│  └─ Severity Weights
│
└─ Report Builder
   └─ Response Serializer
```

## Key Design Principles

### 1. **Separation of Concerns**
- Each module has a single responsibility
- Static analyzer ≠ LLM analyzer ≠ Scoring
- UI ≠ API ≠ Business logic

### 2. **Modular & Replaceable**
- Static analyzer can be swapped with Semgrep, Bandit, etc.
- LLM analyzer can be swapped with other AI providers
- Each engine has clear input/output contracts

### 3. **Production-Grade**
- Typed responses (Pydantic)
- Structured logging
- Error handling
- Configuration management
- Containerized deployment

### 4. **Developer Experience**
- VSCode native integration
- Real-time feedback
- Visual highlighting
- Clear explanations
- One-click fixes

## Pillar-to-Code Mapping

### Pillar 1: AI Integration
- **Implementation:** `backend/app/engines/llm_analyzer.py`
- **Config:** `backend/app/config.py` (LLM_PROVIDER, LLM_API_KEY)
- **Contract:** `POST /api/analyze` endpoint

### Pillar 2: DevTools Engineering
- **Implementation:** `vscode-extension/src/`
- **Diagnostics:** `src/ui/diagnostics.ts`
- **Status Bar:** `src/ui/status_bar.ts`
- **Analyzer:** `src/features/analyzer.ts`

### Pillar 3: Security Awareness
- **Static Rules:** `backend/app/engines/rules.py`
- **Scoring:** `backend/app/scoring/risk_scorer.py`
- **Vulnerability Types:** `backend/app/api/schemas.py`

### Pillar 4: Modular System Design
- **Engine Separation:** `backend/app/engines/`, `scoring/`, `reporting/`
- **API Contracts:** `backend/app/api/schemas.py`
- **Clear Boundaries:** Each module has distinct responsibility

### Pillar 5: Production-Grade Structure
- **Docker:** `Dockerfile`, `docker-compose.yml`
- **Config:** `config.py`, `.env.example`
- **Logging:** `logging_config.py`
- **Types:** Pydantic models throughout

### Pillar 6: Product-Market Fit
- **Target Users:** Developers using AI code generation
- **Value Prop:** "VulAI is the AI that audits AI"
- **Workflow:** Integrated directly in VSCode
- **Outcome:** Reduced security risk, improved code quality

## Data Flow Examples

### Vulnerability Analysis Flow

```
User opens code file
    ↓
Extension auto-triggers analysis (Ctrl+Shift+V)
    ↓
Sends: { code, language } to POST /api/analyze
    ↓
Backend: StaticAnalyzer.analyze() → finds pattern matches
    ↓
Backend: LLMAnalyzer.analyze() → adds context-aware insights
    ↓
Backend: RiskScorer.compute_score() → weighted vulnerability assessment
    ↓
Backend: ReportBuilder.build_response() → structured JSON
    ↓
Returns: { findings: [...], score: {...}, metadata: {...} }
    ↓
Extension: DiagnosticsManager updates inline highlights
    ↓
Extension: StatusBarManager shows security grade
    ↓
Developer sees: Line 42 🔴 SQL Injection | Grade: F (15/100)
```

### Code Refactoring Flow

```
Developer clicks "Fix" on vulnerability
    ↓
Extension sends: { code, finding_id } to POST /api/refactor
    ↓
Backend: LLMAnalyzer.generate_refactor()
    ↓
Claude generates secure code alternative
    ↓
Returns: { refactored_code, explanation, improvement }
    ↓
Extension opens diff view
    ↓
Developer accepts changes
    ↓
Code updated with secure version
```

## Testing Strategy

### Backend Tests
- **Unit:** Individual functions (static analyzer, risk scorer)
- **Integration:** API endpoints → full pipeline
- **Location:** `backend/tests/`

### Extension Tests
- **Unit:** Components (diagnostics, status bar)
- **Feature:** End-to-end analysis flow
- **Location:** `vscode-extension/test/`

## Deployment Architecture

### Development
```
VSCode (F5 launch)
  └─ Extension (TypeScript, hot reload)
      └─ http://localhost:8000
         └─ Backend (Python, uvicorn reload)
            └─ Static Analyzer + LLM API
```

### Production
```
VSCode Extension (Published to Marketplace)
  └─ https://api.vulai.dev
     └─ Kubernetes Cluster
        ├─ Load Balancer
        ├─ N x Backend Pods
        └─ Secrets (LLM_API_KEY)
```

## Next: Implementation Roadmap

### Phase 1: MVP (Current)
✅ Architecture design
✅ Folder structure
✅ API contracts
→ **Next:** Build & test all components

### Phase 2: Enhancement
- Multi-file analysis
- Custom rule definition
- Performance optimization
- PostgreSQL for persistence

### Phase 3: Integration
- GitHub App integration
- CI/CD pipeline scanning
- PR/MR security gates

### Phase 4: Platform
- SDK for other languages
- Team collaboration features
- Advanced reporting

---

**Project Status:** Architecture Complete
**Ready For:** Implementation
**Last Updated:** 2025-02-26
