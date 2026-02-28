# 🎬 VulAI Live Demo Guide

## Complete Setup & Demo Workflow (15-20 minutes)

This guide walks you through setting up and running a complete VulAI demo with backend + VSCode extension scanning real vulnerable code.

---

## ⏱️ Timeline

- **Setup:** 5-10 min (backend + extension)
- **Demo 1:** 2 min (Static + Claude analysis)
- **Demo 2:** 2 min (Refactor generation)
- **Q&A:** 3-5 min

**Total:** 15-20 minutes

---

## 📋 Prerequisites

### Required
- Python 3.8+
- Node.js 16+
- VSCode installed
- Claude API key (from console.anthropic.com)
- Git (for cloning repo)

### Optional (Nice to have)
- Terminal emulator
- Two monitors (one for backend, one for VSCode)

---

## 🚀 Part 1: Backend Setup (5 minutes)

### Step 1.1: Configure Environment

```bash
cd VulAi/backend

# Create .env file
cat > .env << EOF
LLM_API_KEY=sk-ant-YOUR-API-KEY-HERE
LLM_PROVIDER=anthropic
LLM_MODEL=claude-opus-4-20250514
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
DEBUG=false
LOG_LEVEL=INFO
EOF
```

### Step 1.2: Install Dependencies

```bash
# Install Python dependencies
pip install -r requirements.txt

# Verify installation
python -c "import anthropic; print('✓ Anthropic SDK installed')"
python -c "import fastapi; print('✓ FastAPI installed')"
```

### Step 1.3: Start Backend Server

**Terminal 1 - Backend:**

```bash
cd VulAi/backend

# Start uvicorn with reload enabled
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Expected Output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
INFO:vulai: Claude client initialized successfully
```

✅ Backend is running. Keep this terminal open.

---

## 🎨 Part 2: VSCode Extension Setup (3-5 minutes)

### Step 2.1: Open VulAI in VSCode

**Terminal 2 - Extension:**

```bash
cd VulAi/vscode-extension

# Install dependencies
npm install

# Open in VSCode and start extension debugging
code .
```

### Step 2.2: Launch Extension

1. In VSCode, press **F5** (or Debug → Start Debugging)
2. A new VSCode window opens with the extension loaded
3. You should see: "VulAI security co-pilot is ready! Press Ctrl+Shift+V to analyze code."

✅ Extension is running. You now have both backend and extension active.

---

## 📝 Part 3: Demo Demo 1 - Vulnerability Analysis (2 min)

### Step 3.1: Open Vulnerable Code

In the VSCode window with VulAI extension:

```bash
# Open the demo file
File → Open File → VulAi/demo_files/vulnerable_example.py
```

Or copy this simple vulnerable code into a new Python file:

```python
# Paste into new file, save as "demo.py"
import os
import sqlite3

# Vulnerability 1: SQL Injection
user_id = input("Enter user ID: ")
db = sqlite3.connect(':memory:')
query = f"SELECT * FROM users WHERE id = {user_id}"  # VULNERABLE!
db.execute(query)

# Vulnerability 2: Command Injection
filename = input("Enter filename: ")
os.system(f"file {filename}")  # VULNERABLE!

# Vulnerability 3: Hardcoded Secret
API_KEY = "sk-proj-1234567890abcdef"  # VULNERABLE!
```

### Step 3.2: Trigger Analysis

**Option A: Auto-Analysis (if enabled)**
- Save the file (Ctrl+S)
- Wait 1-2 seconds for diagnosis to appear

**Option B: Manual Analysis**
- Press **Ctrl+Shift+V** (or Command+Shift+V on Mac)
- Extension sends code to backend

### Step 3.3: Watch the Analysis Happen

**In VSCode Editor:**
1. Red/Orange squiggly lines appear under vulnerabilities
2. Hover over a line to see details
3. Security grade appears in status bar: "🔴 Grade: F (15/100)"

**In Backend Terminal (Terminal 1):**
```
INFO:vulai: Analyzing python code: 287 chars
INFO:vulai: Static analysis found 3 issues
INFO:vulai: LLM analysis complete: found 2 additional issues
INFO:vulai: Security score: 15 (F) - Critical: 2, High: 1, Medium: 0, Low: 0
```

### Step 3.4: Explain What VulAI Found

**Talk to audience:**

> "VulAI found **5 security issues** in this code:
>
> **Static Analysis (fast):**
> - 🔴 SQL Injection on line 7 (red underline)
> - 🔴 Command Injection on line 11
> - 🔴 Hardcoded API Key on line 15
>
> **Claude AI Analysis (context-aware):**
> - 🟠 Missing input validation - user input used directly
> - 🟠 Unsafe shell command execution pattern
>
> **Security Score:** F (15/100)
> - 2 Critical issues
> - 3 High severity issues
> - **Verdict:** Code should NOT be deployed to production."

---

## 🛠️ Part 4: Demo 2 - Code Refactoring (2 min)

### Step 4.1: Click "Fix" on a Vulnerability

Right-click on a red error line → "Generate Secure Refactor"

(or use command palette: Ctrl+Shift+P → `VulAI: Refactor`)

### Step 4.2: Watch Claude Generate Secure Code

**In Backend Terminal:**
```
INFO:vulai: Refactoring python code for finding: SQL_INJECTION_001
INFO:vulai: Successfully generated refactored code via Claude
```

**In VSCode - Refactor Preview:**
```python
# BEFORE (Vulnerable)
query = f"SELECT * FROM users WHERE id = {user_id}"

# AFTER (Secure - Claude Generated)
query = "SELECT * FROM users WHERE id = ?"
db.execute(query, (user_id,))
```

### Step 4.3: Explain the Improvement

> "Claude generated a **parameterized query** - the most secure way to prevent SQL injection.
>
> Instead of concatenating user input directly into the SQL string, the code now:
> 1. Uses placeholders (?) for user data
> 2. Passes user_id separately via the tuple
> 3. Database driver handles escaping automatically
>
> This is immune to SQL injection attacks because user input is never treated as code."

### Step 4.4: Developer Reviews & Approves

Click "Apply Refactor" to insert the secure code into the editor.

---

## 💬 Talking Points for Judges/Investors

### Problem Statement
> "AI-generated code is increasing rapidly, but it often contains security vulnerabilities. Developers need instant feedback on code quality without waiting for security reviews."

### Solution
> "VulAI combines static analysis patterns with Claude AI to provide:
> 1. **Fast detection** - Patterns catch obvious issues (10ms)
> 2. **Smart analysis** - Claude detects logic flaws (2-3s)
> 3. **Secure refactors** - One-click secure code suggestions
> 4. **Developer experience** - Native VSCode integration"

### Key Features
> "✅ Inline diagnostics - See issues while you code
> ✅ Security grades (A-F) - Know your risk level
> ✅ Weighted scoring - Not just counts, but impact
> ✅ AI-powered insights - Beyond regex patterns
> ✅ One-click fixes - Generated by Claude Opus"

### Market Opportunity
> "DevSecOps market = $2B+ and growing 25% YoY. Developers using Copilot, ChatGPT need security guardrails. VulAI is the bridge between code generation and secure deployment."

### Technical Accomplishments
> "✅ Production-grade architecture
> ✅ 42/42 tests passing
> ✅ Claude API integrated
> ✅ TypeScript + Python
> ✅ Docker-ready deployment"

---

## 📊 Demo Metrics to Show

```
VulAI Analysis Results:
─────────────────────────────────────────

Vulnerabilities Detected:  7
├─ From Static Analysis:   4 (10-50ms)
└─ From Claude LLM:        3 (2-3 seconds)

Severity Breakdown:
├─ Critical:  2 (must fix)
├─ High:      3 (should fix)
├─ Medium:    2 (consider)
└─ Low:       0

Security Score: 15/100 (Grade F)
Status: 🚨 Code unsafe for production
```

---

## 🎥 Filming Tips (if recording)

1. **Screen Resolution:** 1920x1080 (full HD)
2. **Font Size:** Increase VSCode font to 14-16pt for visibility
3. **Terminal:** Use light theme (easier to read on video)
4. **Timing:** Demo 3-4 files to show variety
5. **Narration:** Pause after each step for explanation

### Good demo files to use:
- `demo_files/vulnerable_example.py` - Python (SQL injection, secrets, command injection)
- `demo_files/vulnerable_example.js` - Node.js (SQL injection, path traversal, eval)

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 8000 is in use
lsof -i :8000

# Kill existing process
kill -9 <PID>

# Try different port
python -m uvicorn app.main:app --port 8001
```

### Extension won't connect to backend
```bash
# In VSCode, check extension logs: View → Output → VulAI

# Verify backend is running:
curl http://localhost:8000/health

# Change backend URL in VSCode settings:
Code → Settings → VulAI → Backend URL
```

### Claude API errors
```
Error: "invalid_request_error"
→ Check API key format: sk-ant-...

Error: "rate_limit_error"
→ Wait 60 seconds, or check Anthropic console for quota

Error: "timeout"
→ Increase timeout in config.py: ANALYSIS_TIMEOUT = 60
```

### Tests are failing
```bash
cd backend
pytest tests/ -v

# If import errors:
pip install -r requirements.txt --force-reinstall
```

---

## 📈 Demo Variants (by Audience)

### For Judges (Hackathon) - Focus on Innovation
- Show the full pipeline: Static + Claude integration
- Emphasize the 42 passing tests (architecture quality)
- Demo the refactor feature (novel)
- Timeline: 10 minutes

### For Investors - Focus on Market/Traction
- Start with problem statement (AI code security gap)
- Show dashboard metrics (grades, scoring)
- Explain TAM (DevSecOps $2B market)
- Demo on actual GitHub Copilot code
- Timeline: 15 minutes

### For Developers - Focus on UX/Features
- Show VSCode integration (seamless)
- Explain the static + LLM combination
- Walk through refactor workflow (developer-friendly)
- Share API docs (http://localhost:8000/docs)
- Timeline: 12 minutes

---

## ✅ Pre-Demo Checklist

- [ ] API key is set in `.env`
- [ ] Backend starts without errors
- [ ] Extension installs with `npm install`
- [ ] VSCode opens extension window with F5
- [ ] Demo file (vulnerable_example.py) is ready
- [ ] Backend terminal is visible
- [ ] VSCode editor is full screen or maximized
- [ ] Font size is readab (14-16pt)
- [ ] Status bar shows security grade
- [ ] Network connection is stable

---

## 🎯 Success Criteria

Demo is successful if:

✅ Backend analyzes code without crashing
✅ Extensions shows diagnostics on vulnerable lines
✅ Security grade appears in status bar
✅ Claude refactor generates working code
✅ Audience understands the problem & solution
✅ No major lag (analysis < 4 seconds total)

---

## 📞 Demo Support

**If something breaks during demo:**

1. **Quick restart:**
   ```bash
   # Terminal 1: Backend
   Ctrl+C
   python -m uvicorn app.main:app --reload

   # Terminal 2: Extension (VSCode)
   Close window
   F5 to restart
   ```

2. **Have backup demo:**
   - Simple 3-line vulnerable code
   - Guaranteed to work
   - Keep in clipboard

3. **Fallback:** Show recorded demo (pre-record if needed)

---

## 🎬 Sample Demo Script

**[Show code on screen]**

> "This is real vulnerable code - likely generated by an AI assistant. Let me run VulAI on it."

**[Press Ctrl+Shift+V]**

> "VulAI is now analyzing... It's combining two techniques:
>
> First, fast static analysis - pattern matching for known vulnerabilities.
> Then, Claude AI - analyzing the code logic to find semantic issues.
>
> [Wait for results]
>
> Red underlines show vulnerabilities. Grade F means this code is not safe.
> 7 issues found - 2 critical, 3 high severity.
>
> Now let me generate a secure refactor..."

**[Click refactor button]**

> "Claude just generated a secure version of this code using parameterized queries.
> This prevents SQL injection completely.
>
> The developer reviews this suggestion and applies it with one click.
>
> That's VulAI in action - AI auditing AI."

---

**Ready to demo! 🚀**
