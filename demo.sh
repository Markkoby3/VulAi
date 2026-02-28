#!/bin/bash
# VulAI Demo Startup Script
# Starts backend and extension in one command

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║              🔥 VulAI Demo Environment Setup 🔥               ║"
echo "╚════════════════════════════════════════════════════════════════╝"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo -e "\n${YELLOW}✓ Checking prerequisites...${NC}"

if ! command -v python3 &> /dev/null; then
    echo -e "${RED}✗ Python 3 not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Python 3 found${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js found${NC}"

if ! command -v code &> /dev/null; then
    echo -e "${YELLOW}⚠ VSCode not in PATH (you may need to launch manually)${NC}"
fi

# Get API key
echo -e "\n${YELLOW}✓ Configuration${NC}"

if [ -f "backend/.env" ]; then
    if grep -q "LLM_API_KEY" backend/.env; then
        echo -e "${GREEN}✓ API key found in backend/.env${NC}"
    else
        echo -e "${RED}✗ API key not configured in backend/.env${NC}"
        echo "Please add: LLM_API_KEY=sk-ant-YOUR-KEY-HERE"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠ backend/.env not found${NC}"
    echo "Creating template..."
    cat > backend/.env << EOF
LLM_API_KEY=sk-ant-YOUR-API-KEY-HERE
LLM_PROVIDER=anthropic
LLM_MODEL=claude-opus-4-20250514
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
DEBUG=false
LOG_LEVEL=INFO
EOF
    echo -e "${YELLOW}Created backend/.env - please add your API key${NC}"
    exit 1
fi

# Install backend dependencies
echo -e "\n${YELLOW}✓ Installing backend dependencies...${NC}"
cd backend
pip install -q -r requirements.txt 2>/dev/null || pip install -r requirements.txt
cd ..
echo -e "${GREEN}✓ Backend dependencies installed${NC}"

# Install extension dependencies
echo -e "\n${YELLOW}✓ Installing extension dependencies...${NC}"
cd vscode-extension
npm install -q > /dev/null 2>&1 || npm install
echo -e "${GREEN}✓ Extension dependencies installed${NC}"
cd ..

# Start backend
echo -e "\n${GREEN}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}🚀 Starting VulAI Backend (Terminal 1)${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"

cd backend

# Start in background
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Check if backend started successfully
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo -e "${RED}✗ Backend failed to start${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Backend running (PID: $BACKEND_PID)${NC}"
echo -e "${GREEN}✓ API docs available at http://localhost:8000/docs${NC}"

cd ..

# Start extension
echo -e "\n${GREEN}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}🎨 Starting VulAI VSCode Extension (Terminal 2)${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"

cd vscode-extension

# Open in VSCode and launch with F5
echo -e "${YELLOW}Opening VSCode...${NC}"
code . || echo "VSCode not found in PATH. Please open manually: code vscode-extension/"

cd ..

# Summary
echo -e "\n${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║              ✅ VulAI Demo Environment Ready ✅                 ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"

echo -e "\n${YELLOW}Next steps:${NC}"
echo "1. In VSCode, press F5 to launch the extension"
echo "2. Open a Python file (or use demo_files/vulnerable_example.py)"
echo "3. Press Ctrl+Shift+V to analyze code"
echo "4. Watch the magic happen! ✨"

echo -e "\n${YELLOW}Helpful URLs:${NC}"
echo "  Backend API docs:    http://localhost:8000/docs"
echo "  Backend health:      http://localhost:8000/health"
echo "  Demo files:          demo_files/"
echo "  Demo guide:          LIVE_DEMO_GUIDE.md"

echo -e "\n${YELLOW}To stop everything later:${NC}"
echo "  kill $BACKEND_PID  # Stop backend"
echo "  Close VSCode window  # Stop extension"

echo -e "\n${GREEN}Backend process running with PID: $BACKEND_PID${NC}"

# Keep script running so Ctrl+C stops everything
trap "kill $BACKEND_PID" EXIT
wait
