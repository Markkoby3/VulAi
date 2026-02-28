/**
 * Vulnerable JavaScript/Node.js code - for demo purposes only
 * This file intentionally contains security vulnerabilities
 * to demonstrate VulAI's detection and refactoring capabilities.
 */

const express = require('express');
const sqlite3 = require('sqlite3');
const { exec } = require('child_process');
const fs = require('fs');

const app = express();
app.use(express.json());

// Vulnerability 1: Hardcoded Credentials
const DB_USERNAME = 'admin';
const DB_PASSWORD = 'password123';
const SECRET_KEY = 'sk-test-1234567890abcdefghijklmno';

// Vulnerability 2: SQL Injection
app.get('/api/user/:id', (req, res) => {
  const userId = req.params.id;
  const db = new sqlite3.Database(':memory:');

  // VULNERABLE: Direct string concatenation in SQL
  const query = `SELECT * FROM users WHERE id = ${userId}`;

  db.all(query, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Vulnerability 3: Command Injection
app.post('/api/process-file', (req, res) => {
  const filename = req.body.filename;

  // VULNERABLE: User input directly in exec() command
  exec(`file ${filename}`, (error, stdout, stderr) => {
    if (error) {
      res.status(500).json({ error: error.message });
    }
    res.json({ result: stdout });
  });
});

// Vulnerability 4: Path Traversal
app.get('/api/file/:path', (req, res) => {
  const filepath = req.params.path;

  // VULNERABLE: No validation allows ../../etc/passwd type attacks
  fs.readFile(`/data/${filepath}`, 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: err.message });
    }
    res.json({ content: data });
  });
});

// Vulnerability 5: Code Injection via eval
app.post('/api/calc', (req, res) => {
  const expression = req.body.expression;

  // VULNERABLE: eval() executes arbitrary code
  try {
    const result = eval(expression);
    res.json({ result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Vulnerability 6: Authentication Bypass
app.post('/api/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const db = new sqlite3.Database(':memory:');

  // VULNERABLE: SQL injection + weak authentication
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

  db.get(query, (err, user) => {
    if (user) {
      // VULNERABLE: Storing password in session/response
      res.json({
        authenticated: true,
        user: user,
        password: password  // Never do this!
      });
    } else {
      res.json({ authenticated: false });
    }
  });
});

// Vulnerability 7: Insecure Cookie Usage
app.post('/api/session', (req, res) => {
  const userId = req.body.userId;

  // VULNERABLE: Insecure cookie - should have httpOnly, secure, sameSite flags
  res.cookie('sessionId', userId, {
    // Missing httpOnly, secure, sameSite flags
    expires: new Date(Date.now() + 3600000)
  });

  res.json({ sessionId: userId });
});

// Vulnerability 8: Prototype Pollution
app.post('/api/update-user', (req, res) => {
  const userData = req.body;
  const user = { name: '', email: '' };

  // VULNERABLE: Direct object assignment allows prototype pollution
  for (const key in userData) {
    user[key] = userData[key];  // __proto__, constructor allowed!
  }

  res.json({ user });
});

// Vulnerability 9: Logging Sensitive Data
app.use((req, res, next) => {
  // VULNERABLE: Logging entire request/response including credentials
  console.log('Request:', JSON.stringify(req.body));
  console.log('Headers:', req.headers);
  console.log('Authorization:', req.headers.authorization);
  next();
});

// Vulnerability 10: Unsafe Redirect
app.get('/api/redirect', (req, res) => {
  const url = req.query.url;

  // VULNERABLE: No validation of redirect URL - open redirect
  res.redirect(url);
});

// Vulnerability 11: Insecure Deserialization
app.post('/api/deserialize', (req, res) => {
  const serializedData = req.body.data;

  // VULNERABLE: eval() on user input (double vulnerability)
  const data = eval(`(${serializedData})`);

  res.json({ deserialized: data });
});

// Vulnerability 12: Missing Security Headers
app.get('/api/resource', (req, res) => {
  // VULNERABLE: No security headers set
  res.json({ data: 'sensitive' });
  // Missing: Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, etc.
});

// Vulnerability 13: Race Condition in File Upload
const uploadedFiles = new Map();

app.post('/api/upload', (req, res) => {
  const filename = req.body.filename;
  const content = req.body.content;

  // VULNERABLE: No locking - multiple uploads can overwrite each other
  if (uploadedFiles.has(filename)) {
    return res.status(409).json({ error: 'File exists' });
  }

  // VULNERABLE: Time of check - time of use (TOCTOU) race condition
  uploadedFiles.set(filename, content);

  res.json({ uploaded: filename });
});

// Start server - VULNERABLE: No HTTPS, insecure configuration
app.listen(3000, '0.0.0.0', () => {
  console.log('Server listening on port 3000');
  console.log('Database password:', DB_PASSWORD);  // Logging secrets!
});
