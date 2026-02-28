@echo off
REM VulAI Demo Startup Script (Windows)
REM Starts backend and extension for live demo

setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║              🔥 VulAI Demo Environment Setup 🔥               ║
echo ╚════════════════════════════════════════════════════════════════╝

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python not found. Please install Python 3.8+
    exit /b 1
)
echo [OK] Python found

REM Check if Node is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js not found. Please install Node.js 16+
    exit /b 1
)
echo [OK] Node.js found

REM Check if API key is configured
if not exist "backend\.env" (
    echo [WARNING] backend\.env not found
    echo Creating template...
    (
        echo LLM_API_KEY=sk-ant-YOUR-API-KEY-HERE
        echo LLM_PROVIDER=anthropic
        echo LLM_MODEL=claude-opus-4-20250514
        echo BACKEND_HOST=0.0.0.0
        echo BACKEND_PORT=8000
        echo DEBUG=false
        echo LOG_LEVEL=INFO
    ) > backend\.env
    echo [ERROR] Created backend\.env - please add your Claude API key
    exit /b 1
)

findstr "LLM_API_KEY" backend\.env >nul
if errorlevel 1 (
    echo [ERROR] LLM_API_KEY not configured in backend\.env
    exit /b 1
)
echo [OK] API key configured

echo.
echo Installing backend dependencies...
cd backend
pip install -q -r requirements.txt
if errorlevel 1 (
    echo [WARNING] Some dependencies may not have installed
)
cd ..
echo [OK] Backend dependencies ready

echo.
echo Installing extension dependencies...
cd vscode-extension
call npm install -q
if errorlevel 1 (
    echo [WARNING] Some npm packages may not have installed
)
cd ..
echo [OK] Extension dependencies ready

echo.
echo ═══════════════════════════════════════════════════════════════
echo 🚀 Starting VulAI Backend (Keep this window open)
echo ═══════════════════════════════════════════════════════════════
echo.

cd backend

REM Start backend in new window
start cmd /k "title VulAI Backend && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

REM Wait for backend to start
timeout /t 3 /nobreak

cd ..

echo.
echo Checking backend health...
curl -s http://localhost:8000/health >nul
if errorlevel 1 (
    echo [ERROR] Backend failed to start
    exit /b 1
)
echo [OK] Backend is running at http://localhost:8000

echo.
echo ═══════════════════════════════════════════════════════════════
echo 🎨 Starting VSCode Extension
echo ═══════════════════════════════════════════════════════════════
echo.

cd vscode-extension

REM Try to open VSCode
where code >nul 2>&1
if errorlevel 1 (
    echo [WARNING] VSCode not found in PATH
    echo Please manually run: code vscode-extension\
) else (
    echo Opening VSCode...
    start code .
)

cd ..

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║              ✅ VulAI Demo Environment Ready ✅                 ║
echo ╚════════════════════════════════════════════════════════════════╝

echo.
echo Next steps:
echo   1. In VSCode, press F5 to launch the extension
echo   2. Open a Python file (demo_files\vulnerable_example.py)
echo   3. Press Ctrl+Shift+V to analyze code
echo   4. Watch VulAI find vulnerabilities!

echo.
echo Helpful URLs:
echo   Backend API docs: http://localhost:8000/docs
echo   Backend health:   http://localhost:8000/health
echo   Demo files:       demo_files\
echo   Demo guide:       LIVE_DEMO_GUIDE.md

echo.
echo To stop everything:
echo   - Close this window (backend will stop)
echo   - Close VSCode window (extension will stop)

echo.
echo Press Ctrl+C to stop the backend at any time.
pause
