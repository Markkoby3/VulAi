/**
 * Analyzer orchestrator - coordinates analysis workflow
 */

import * as vscode from 'vscode';
import { VulAIClient, AnalyzeResponse } from '../client/api';
import { ExtensionLogger } from '../utils/logger';
import { DiagnosticsManager } from '../ui/diagnostics';
import { StatusBarManager } from '../ui/status_bar';

export class SecurityAnalyzer {
    private client: VulAIClient;
    private logger: ExtensionLogger;
    private diagnosticsManager: DiagnosticsManager;
    private statusBar: StatusBarManager;
    private lastReport: AnalyzeResponse | null = null;

    constructor(client: VulAIClient, logger: ExtensionLogger) {
        this.client = client;
        this.logger = logger;
        this.diagnosticsManager = new DiagnosticsManager(logger);
        this.statusBar = new StatusBarManager(logger);
    }

    async analyzeDocument(document: vscode.TextDocument) {
        try {
            this.statusBar.showAnalyzing();

            const language = this.mapLanguageId(document.languageId);
            const code = document.getText();

            // Call backend API
            const response = await this.client.analyze({
                code,
                language,
                filename: document.fileName
            });

            this.lastReport = response;

            // Update UI
            this.diagnosticsManager.updateDiagnostics(document, response.findings);
            this.statusBar.updateScore(response.score.overall, response.score.grade);

            this.logger.info(
                `Analysis complete: ${response.score.overall} (${response.score.grade}) - ` +
                `${response.findings.length} findings`
            );

        } catch (error) {
            this.logger.error(`Analysis error: ${error}`);
            this.statusBar.showError();
            vscode.window.showErrorMessage(`VulAI Analysis failed: ${error}`);
        }
    }

    async generateRefactor(document: vscode.TextDocument, findingId?: string) {
        try {
            if (!this.lastReport || !findingId) {
                vscode.window.showWarningMessage('No finding selected for refactoring');
                return;
            }

            const finding = this.lastReport.findings.find(f => f.id === findingId);
            if (!finding) {
                vscode.window.showErrorMessage('Finding not found');
                return;
            }

            const language = this.mapLanguageId(document.languageId);
            const code = document.getText();

            // Call refactor API
            const response = await this.client.refactor({
                code,
                finding_id: findingId,
                language
            });

            // Show refactored code in diff view
            const refactorUri = vscode.Uri.parse('vulai-refactor://refactored');
            await vscode.workspace.openTextDocument(refactorUri);

            vscode.window.showInformationMessage(
                `Refactored code generated:\n${response.explanation}`
            );

        } catch (error) {
            this.logger.error(`Refactor error: ${error}`);
            vscode.window.showErrorMessage(`VulAI Refactoring failed: ${error}`);
        }
    }

    showDetailedReport() {
        if (!this.lastReport) {
            vscode.window.showWarningMessage('No analysis results available');
            return;
        }

        // Create detailed report panel
        const panel = vscode.window.createWebviewPanel(
            'vulai-report',
            'VulAI Security Report',
            vscode.ViewColumn.Beside,
            { enableScripts: true }
        );

        panel.webview.html = this.generateReportHTML(this.lastReport);
    }

    private generateReportHTML(report: AnalyzeResponse): string {
        const findingsHTML = report.findings
            .map(f => `
                <div class="finding finding-${f.severity.toLowerCase()}">
                    <h4>${f.type}</h4>
                    <p><strong>Line ${f.line}:</strong> ${f.message}</p>
                    <p><strong>Severity:</strong> ${f.severity}</p>
                    <p><strong>Remediation:</strong> ${f.remediation || 'N/A'}</p>
                </div>
            `)
            .join('');

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: monospace; margin: 20px; }
                    .score-box { padding: 20px; background: #f0f0f0; border-radius: 8px; margin-bottom: 20px; }
                    .grade { font-size: 48px; font-weight: bold; }
                    .finding { margin: 10px 0; padding: 10px; border-radius: 4px; }
                    .finding-critical { background: #ffcdd2; }
                    .finding-high { background: #ffe0b2; }
                    .finding-medium { background: #fff9c4; }
                    .finding-low { background: #c8e6c9; }
                </style>
            </head>
            <body>
                <h2>VulAI Security Report</h2>
                <div class="score-box">
                    <div class="grade">${report.score.grade}</div>
                    <p>Overall Score: ${report.score.overall}/100</p>
                    <p>Critical: ${report.score.critical_count} | High: ${report.score.high_count} | Medium: ${report.score.medium_count} | Low: ${report.score.low_count}</p>
                </div>
                <h3>Findings (${report.findings.length})</h3>
                ${findingsHTML}
            </body>
            </html>
        `;
    }

    private mapLanguageId(languageId: string): string {
        const mapping: Record<string, string> = {
            'python': 'python',
            'javascript': 'javascript',
            'typescript': 'javascript',
            'java': 'java',
            'csharp': 'csharp',
            'go': 'go',
            'rust': 'rust',
            'php': 'php',
            'cpp': 'cpp',
            'c': 'c'
        };
        return mapping[languageId] || languageId;
    }
}
