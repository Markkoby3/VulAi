# VulAI Setup & Development Guide

## Prerequisites

- **Python 3.11+** (for backend)
- **Node.js 18+** (for VSCode extension)
- **Docker & Docker Compose** (for containerized deployment)
- **Anthropic API Key** (for Claude access)
- **Git** (for version control)

## Backend Setup

### 1. Install Python Dependencies

```bash
cd backend
python -m venv venv

# Activate virtual environment
# On MacOS/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate

# Install packages
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
# Copy example configuration
cp .env.example .env

# Edit .env and add your credentials
# Required: LLM_API_KEY=your_anthropic_api_key
```

### 3. Run Backend

```bash
# Development mode (with auto-reload)
python -m uvicorn app.main:app --reload

# Production mode
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Backend will be available at: `http://localhost:8000`

**Check it's working:**
```bash
curl http://localhost:8000/health
```

### 4. View API Documentation

Open: `http://localhost:8000/docs`

## VSCode Extension Setup

### 1. Install Node Dependencies

```bash
cd vscode-extension
npm install
```

### 2. Build Extension

```bash
# Development build (watch mode)
npm run webpack-watch

# Production build
npm run package
```

### 3. Launch Extension

In VSCode:
1. Open the `vscode-extension` folder
2. Press `F5` to launch in development mode
3. The extension opens in a new VSCode window

### 4. Test Extension

In the extension's VSCode window:
- Open a Python, JavaScript, or other supported language file
- Press `Ctrl+Shift+V` to analyze
- You should see security findings highlighted inline
- Check the status bar for security score

## Docker Development

### Run Full Stack

```bash
# Build and start containers
docker-compose up -d

# Check logs
docker-compose logs -f backend

# Stop
docker-compose down
```

### Backend Container
- Available at: `http://localhost:8000`
- Auto-reloads on code changes
- Volume-mounted for development

### Custom Backend-Only Image

```bash
# Build
docker build -t vulai-backend backend/

# Run
docker run -p 8000:8000 \
  -e BACKEND_HOST=0.0.0.0 \
  -e LLM_API_KEY=sk-... \
  vulai-backend
```

## Testing

### Backend Tests

```bash
cd backend

# Run all tests
pytest tests/

# Run with coverage
pytest --cov=app tests/

# Run specific test file
pytest tests/test_static_analyzer.py
```

### VSCode Extension Tests

```bash
cd vscode-extension

# Run tests
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

## Debugging

### Backend Debugging

Using VSCode:
1. Install Python extension
2. Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Python: FastAPI",
      "type": "python",
      "request": "launch",
      "module": "uvicorn",
      "args": ["app.main:app", "--reload"],
      "jinja": true,
      "cwd": "${workspaceFolder}/backend"
    }
  ]
}
```

Then press `F5` to debug.

### Extension Debugging

- Debugging is built-in when launching with `F5`
- Use VS Code's built-in debugging (breakpoints, watch, etc.)
- Output is in the Debug Console

## Common Issues

### Backend won't start
```
ModuleNotFoundError: No module named 'app'
```
→ Make sure you're in the `backend/` directory and have activated the venv

### LLM API errors
```
401 Unauthorized
```
→ Check your `LLM_API_KEY` in `.env`

### Extension doesn't analyze code
→ Check that backend is running: `curl http://localhost:8000/health`
→ Check extension settings: `Ctrl+,` → search for "vulai"

### Docker build fails
→ Ensure Docker is running
→ Check disk space: `docker system prune`

## Architecture Overview

```
┌─────────────────────┐
│  VSCode Extension   │ (TypeScript)
│   ├─ UI Components  │
│   ├─ API Client     │
│   └─ Handlers       │
└──────────┬──────────┘
           │ REST API (JSON)
      ┌────▼────┐
      │ FastAPI │ (Python 3.11)
      │Backend  │
      ├─────────┤
      │ Engines │
      │ ├─Stat  │
      │ ├─LLM   │
      │ └─Risk  │
      └─────────┘
```

## Next Steps

1. ✅ **Local Development** - Everything above
2. 📝 **Build MVP Features** - See ROADMAP.md
3. 🧪 **Write Tests** - Ensure quality
4. 🐳 **Deploy** - See DEPLOYMENT.md
5. 📦 **Package Extension** - Publish to VSCode marketplace

## Quick Reference

| Task | Command |
|------|---------|
| Start backend | `cd backend && python -m uvicorn app.main:app --reload` |
| Start extension | `cd vscode-extension && npm run webpack-watch` (then `F5` in VSCode) |
| Run tests | `cd backend && pytest` / `cd vscode-extension && npm test` |
| Build Docker | `docker-compose up` |
| View API docs | `http://localhost:8000/docs` |
| Check health | `curl http://localhost:8000/health` |

## Documentation Files

- `ARCHITECTURE.md` - System design & module breakdown
- `API.md` - API reference & examples
- `DEPLOYMENT.md` - Production deployment guide
- `CONTRIBUTING.md` - Contribution guidelines

## Support

- Check logs: Backend logs in terminal, extension logs in VSCode Output panel
- Read API docs: http://localhost:8000/docs
- File issues: GitHub Issues

---

**Happy coding! 🚀**
