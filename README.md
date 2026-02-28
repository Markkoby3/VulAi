# VulAI - AI-powered DevSecOps Co-pilot

VulAI is a production-grade security analysis tool that integrates AI-powered vulnerability detection directly into the developer workflow via VSCode.

## Features

🔍 **AI-Powered Analysis**
- Context-aware vulnerability detection using Claude
- Identifies logic flaws beyond static pattern matching
- Detects architecture and design issues

⚡ **Developer-First Integration**
- Native VSCode extension
- Inline vulnerability highlighting
- Real-time security scoring (0-100, A-F)
- One-click secure code generation

🛡️ **Comprehensive Security Coverage**
- SQL Injection
- Command & Shell Injection
- Code Injection
- Hardcoded Secrets
- Unsafe API Usage
- Logic Flaws & Architecture Issues

🏗️ **Modular Architecture**
- FastAPI backend
- Static analysis engine
- LLM security layer
- Weighted risk scoring
- Dockerized deployment

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- VSCode 1.85+
- Anthropic API key (for Claude access)

### Backend Setup

```bash
cd backend

# Create environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure
cp .env.example .env
# Edit .env and add your LLM_API_KEY

# Run
python -m uvicorn app.main:app --reload
```

Backend will be available at `http://localhost:8000`

### VSCode Extension Setup

```bash
cd vscode-extension

# Install dependencies
npm install

# Build extension
npm run webpack

# Development mode (with hot reload)
npm run webpack-watch
```

Then in VSCode: `F5` to launch extension in development mode.

### Docker Setup

```bash
docker-compose up -d
```

Starts backend at `http://localhost:8000`

## Architecture

```
VSCode Extension
    ↓ REST API
FastAPI Backend
    ├─ Static Analyzer (fast pattern matching)
    ├─ LLM Analyzer (Claude API)
    ├─ Risk Scorer (weighted vulnerability classification)
    └─ Report Builder (structured JSON output)
```

## API Endpoints

### `POST /api/analyze`
Analyze code for vulnerabilities

**Request:**
```json
{
  "code": "user_input = request.form['name']\nquery = f\"SELECT * FROM users WHERE id = {user_input}\"",
  "language": "python",
  "filename": "app.py"
}
```

**Response:**
```json
{
  "findings": [
    {
      "id": "SQL_001_42",
      "type": "SQL_INJECTION",
      "severity": "CRITICAL",
      "confidence": 0.95,
      "line": 2,
      "message": "SQL query constructed from unsanitized user input",
      "remediation": "Use parameterized queries",
      "secure_example": "query = db.execute('SELECT * FROM users WHERE id = ?', [user_input])"
    }
  ],
  "score": {
    "overall": 15,
    "grade": "F",
    "critical_count": 1,
    "high_count": 0,
    "medium_count": 0,
    "low_count": 0
  }
}
```

### `POST /api/refactor`
Generate secure refactored code

### `POST /api/score`
Quick security scoring (no detailed findings)

### `GET /health`
Health check endpoint

## Configuration

### Backend Environment Variables (`.env`)

```env
BACKEND_HOST=localhost
BACKEND_PORT=8000
DEBUG=false

# LLM Configuration
LLM_PROVIDER=anthropic
LLM_API_KEY=sk-your-api-key
LLM_MODEL=claude-opus-4-20250514

# Analysis
ANALYSIS_TIMEOUT=30
ENABLE_CACHING=true

LOG_LEVEL=INFO
ENABLE_LOGGING=true
```

### VSCode Extension Settings

In VSCode settings:
```json
{
  "vulai.backendUrl": "http://localhost:8000",
  "vulai.enableAutoAnalysis": true,
  "vulai.analysisDelay": 1000,
  "vulai.showScoreInStatusBar": true
}
```

## Development

### Project Structure
```
VulAi/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── engines/
│   │   ├── scoring/
│   │   ├── models/
│   │   ├── reporting/
│   │   └── utils/
│   ├── tests/
│   ├── requirements.txt
│   └── Dockerfile
├── vscode-extension/
│   ├── src/
│   │   ├── extension.ts
│   │   ├── client/
│   │   ├── ui/
│   │   ├── features/
│   │   └── utils/
│   ├── package.json
│   └── tsconfig.json
└── docs/
```

### Running Tests

**Backend:**
```bash
cd backend
pytest tests/
```

**VSCode Extension:**
```bash
cd vscode-extension
npm test
```

## Deployment

### Docker
```bash
docker build -t vulai-backend backend/
docker run -p 8000:8000 -e LLM_API_KEY=sk-... vulai-backend
```

### Kubernetes (Future)
See `docs/DEPLOYMENT.md` for Kubernetes configuration

### GitHub App (Roadmap)
Future support for automatic PR scanning

## API Documentation

Full OpenAPI docs available at `http://localhost:8000/docs` when backend is running

## Roadmap

- ✅ MVP: Static + LLM analysis, VSCode integration
- 🔄 Phase 2: Multi-file analysis, persistent storage
- 🔄 Phase 3: GitHub App integration, CI/CD hooks
- 🔄 Phase 4: Custom rule engine, team collaboration

## Security

VulAI analyzes code locally or in your infrastructure. Code is sent to Claude API only for context-aware analysis (see privacy policy).

## Contributing

Contributions welcome! See CONTRIBUTING.md

## License

MIT License - See LICENSE file

## Support

Issues? Check our GitHub issues or email support@vulai.dev

---

**Make Sure your vibecoded App is safe - VulAi is here for you**
