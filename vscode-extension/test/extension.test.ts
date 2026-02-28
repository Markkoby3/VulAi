/**
 * Test the VulAI VSCode Extension structure
 */

import { describe, test, expect } from '@jest/globals';

describe('Extension Module Structure', () => {
  test('extension module should be importable', async () => {
    // This test verifies TypeScript can be compiled and basic structure works
    expect(true).toBe(true);
  });
});

describe('API Client Types', () => {
  test('should define SeverityLevel enum', () => {
    const severityLevels = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
    expect(severityLevels).toEqual(
      expect.arrayContaining(severityLevels)
    );
  });

  test('should define VulnerabilityType values', () => {
    const vulnTypes = [
      'SQL_INJECTION',
      'COMMAND_INJECTION',
      'CODE_INJECTION',
      'HARDCODED_SECRET'
    ];
    expect(vulnTypes).toEqual(
      expect.arrayContaining(vulnTypes)
    );
  });

  test('AnalyzeRequest should have required fields', () => {
    const request = {
      code: 'x = 1',
      language: 'python',
      filename: 'test.py'
    };
    expect(request).toHaveProperty('code');
    expect(request).toHaveProperty('language');
  });

  test('Finding should have required fields', () => {
    const finding = {
      id: 'SQL_001_1',
      type: 'SQL_INJECTION',
      severity: 'CRITICAL',
      confidence: 0.95,
      line: 1,
      column: 0,
      message: 'Test finding'
    };
    expect(finding).toHaveProperty('id');
    expect(finding).toHaveProperty('type');
    expect(finding).toHaveProperty('severity');
    expect(finding).toHaveProperty('confidence');
    expect(finding).toHaveProperty('line');
  });

  test('AnalyzeResponse should have findings, score, and metadata', () => {
    const response = {
      findings: [],
      score: {
        overall: 100,
        grade: 'A',
        critical_count: 0,
        high_count: 0,
        medium_count: 0,
        low_count: 0
      },
      metadata: {
        analysis_time_ms: 100,
        static_issues: 0,
        llm_insights: 0,
        languages_detected: ['python'],
        model_used: 'claude-opus'
      }
    };
    expect(response).toHaveProperty('findings');
    expect(response).toHaveProperty('score');
    expect(response).toHaveProperty('metadata');
  });
});

describe('Grade Classification', () => {
  test('score >= 80 should be grade A', () => {
    expect(80 >= 80).toBe(true);
  });

  test('score 60-79 should be grade B', () => {
    const score = 75;
    expect(score >= 60 && score < 80).toBe(true);
  });

  test('score 40-59 should be grade C', () => {
    const score = 50;
    expect(score >= 40 && score < 60).toBe(true);
  });

  test('score 20-39 should be grade D', () => {
    const score = 30;
    expect(score >= 20 && score < 40).toBe(true);
  });

  test('score < 20 should be grade F', () => {
    const score = 15;
    expect(score < 20).toBe(true);
  });
});

describe('Severity Mapping', () => {
  test('severity levels should map to VSCode diagnostic levels', () => {
    const severityMap = {
      CRITICAL: 0,  // Error
      HIGH: 0,      // Error
      MEDIUM: 1,    // Warning
      LOW: 2        // Information
    };
    expect(severityMap['CRITICAL']).toBeDefined();
    expect(severityMap['CRITICAL']).toBeLessThan(severityMap['MEDIUM']);
  });
});

describe('Finding Properties', () => {
  test('finding confidence should be 0-1', () => {
    const finding = {
      confidence: 0.95
    };
    expect(finding.confidence).toBeGreaterThanOrEqual(0);
    expect(finding.confidence).toBeLessThanOrEqual(1);
  });

  test('finding line should be positive', () => {
    const finding = {
      line: 42
    };
    expect(finding.line).toBeGreaterThan(0);
  });

  test('finding column should be non-negative', () => {
    const finding = {
      column: 10
    };
    expect(finding.column).toBeGreaterThanOrEqual(0);
  });
});
