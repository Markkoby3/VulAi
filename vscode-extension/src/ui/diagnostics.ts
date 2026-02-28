/**
 * Diagnostics management for displaying vulnerabilities inline
 */

import * as vscode from 'vscode';
import { Finding } from '../client/api';
import { ExtensionLogger } from '../utils/logger';

export class DiagnosticsManager {
    private diagnosticsCollection: vscode.DiagnosticCollection;
    private logger: ExtensionLogger;

    constructor(logger: ExtensionLogger) {
        this.logger = logger;
        this.diagnosticsCollection = vscode.languages.createDiagnosticCollection('vulai');
    }

    updateDiagnostics(document: vscode.TextDocument, findings: Finding[]) {
        const diagnostics: vscode.Diagnostic[] = [];

        for (const finding of findings) {
            // Create range (1-indexed line to 0-indexed)
            const line = Math.max(0, finding.line - 1);
            const column = finding.column || 0;

            const range = new vscode.Range(
                new vscode.Position(line, column),
                new vscode.Position(line, column + 40)
            );

            // Determine severity
            const severity = this.getSeverityLevel(finding.severity);

            // Build message
            const message = `${finding.type}: ${finding.message}`;

            const diagnostic = new vscode.Diagnostic(range, message, severity);
            diagnostic.code = finding.id;
            diagnostic.source = 'VulAI';

            // Add remediation as related information
            if (finding.remediation) {
                diagnostic.relatedInformation = [
                    new vscode.DiagnosticRelatedInformation(
                        new vscode.Location(document.uri, range),
                        `Fix: ${finding.remediation}`
                    )
                ];
            }

            diagnostics.push(diagnostic);
        }

        this.diagnosticsCollection.set(document.uri, diagnostics);
    }

    clear() {
        this.diagnosticsCollection.clear();
    }

    private getSeverityLevel(severity: string): vscode.DiagnosticSeverity {
        switch (severity) {
            case 'CRITICAL':
            case 'HIGH':
                return vscode.DiagnosticSeverity.Error;
            case 'MEDIUM':
                return vscode.DiagnosticSeverity.Warning;
            case 'LOW':
            default:
                return vscode.DiagnosticSeverity.Information;
        }
    }
}
