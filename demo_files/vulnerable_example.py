"""
Vulnerable Python code - for demo purposes only
This script intentionally contains security vulnerabilities
to demonstrate VulAI's detection and refactoring capabilities.
"""

import os
import sqlite3
import subprocess
from flask import Flask, request

app = Flask(__name__)

# Vulnerability 1: Hardcoded Secret
API_KEY = "sk-proj-1234567890abcdefghijklmnop"
DATABASE_PASSWORD = "admin123"

# Vulnerability 2: Unsafe Database Query (SQL Injection)
def get_user_by_id(user_id):
    """Get user from database - vulnerable to SQL injection"""
    db = sqlite3.connect(':memory:')
    # VULNERABLE: Direct string concatenation in SQL query
    query = f"SELECT * FROM users WHERE id = {user_id}"
    results = db.execute(query).fetchall()
    return results


# Vulnerability 3: Command Injection
def process_file(filename):
    """Process a file - vulnerable to command injection"""
    # VULNERABLE: User input directly in os.system()
    command = f"file {filename}"
    os.system(command)

    # VULNERABLE: Subprocess with shell=True
    result = subprocess.run(f"ls -la {filename}", shell=True, capture_output=True)
    return result.stdout


# Vulnerability 4: Code Injection
@app.route('/eval', methods=['POST'])
def unsafe_eval():
    """Evaluate code from user input - EXTREMELY DANGEROUS"""
    user_code = request.json.get('code', '')

    # VULNERABLE: Direct eval of user input
    result = eval(user_code)
    return {'result': result}


# Vulnerability 5: Missing Input Validation
@app.route('/login', methods=['POST'])
def login():
    """Login endpoint without proper validation"""
    username = request.json.get('username')
    password = request.json.get('password')

    # No validation - directly used in query (SQL injection)
    db = sqlite3.connect(':memory:')
    query = f"SELECT * FROM users WHERE username = '{username}' AND password = '{password}'"
    user = db.execute(query).fetchone()

    if user:
        return {'authenticated': True, 'user': user}
    return {'authenticated': False}


# Vulnerability 6: Insecure Logging
@app.route('/process', methods=['POST'])
def process_request():
    """Process request - logs sensitive data"""
    api_key = request.headers.get('Authorization')
    user_data = request.json

    # VULNERABLE: Logging sensitive information
    print(f"Processing request from user: {user_data}")
    print(f"API Key: {api_key}")  # Never log API keys!

    return {'status': 'processed'}


# Vulnerability 7: Unsafe File Operations
def read_user_file(filename):
    """Read user-specified file - path traversal vulnerability"""
    # VULNERABLE: No validation of filename - allows path traversal
    with open(f'/data/{filename}', 'r') as f:
        return f.read()


# Vulnerability 8: Race Condition
def transfer_funds(from_account, to_account, amount):
    """Transfer funds between accounts - vulnerable to race condition"""
    db = sqlite3.connect(':memory:')

    # VULNERABLE: Check-then-act without locking
    balance = db.execute(f"SELECT balance FROM accounts WHERE id = {from_account}").fetchone()

    if balance[0] >= amount:
        # Multiple threads could execute between these lines
        db.execute(f"UPDATE accounts SET balance = balance - {amount} WHERE id = {from_account}")
        db.execute(f"UPDATE accounts SET balance = balance + {amount} WHERE id = {to_account}")
        db.commit()
        return True
    return False


if __name__ == '__main__':
    # VULNERABLE: Running in debug mode with host=0.0.0.0
    app.run(debug=True, host='0.0.0.0', port=5000)
