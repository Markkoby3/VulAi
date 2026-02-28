/**
 * Status bar management - displays security score
 */

import * as vscode from 'vscode';
import { ExtensionLogger } from '../utils/logger';

export class StatusBarManager {
    private statusBarItem: vscode.StatusBarItem;
    private logger: ExtensionLogger;

    constructor(logger: ExtensionLogger) {
        this.logger = logger;
        this.statusBarItem = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Right,
            100
        );
        this.statusBarItem.text = '$(shield) VulAI: Ready';
        this.statusBarItem.command = 'vulai.showReport';
        this.statusBarItem.show();
    }

    updateScore(score: number, grade: string) {
        const icon = this.getIconForGrade(grade);
        const color = this.getColorForGrade(grade);

        this.statusBarItem.text = `$(shield) VulAI: ${score} (${grade}) ${icon}`;
        this.statusBarItem.color = color;
    }

    showAnalyzing() {
        this.statusBarItem.text = '$(loading~spin) VulAI: Analyzing...';
    }

    showError() {
        this.statusBarItem.text = '$(error) VulAI: Error';
        this.statusBarItem.color = '#ff0000';
    }

    private getIconForGrade(grade: string): string {
        switch (grade) {
            case 'A':
                return '✓';
            case 'B':
                return '△';
            case 'C':
                return '!';
            case 'D':
            case 'F':
                return '✕';
            default:
                return '?';
        }
    }

    private getColorForGrade(grade: string): string {
        switch (grade) {
            case 'A':
                return '#4CAF50';  // Green
            case 'B':
                return '#8BC34A';  // Light green
            case 'C':
                return '#FFC107';  // Amber
            case 'D':
                return '#FF9800';  // Orange
            case 'F':
                return '#F44336';  // Red
            default:
                return '#999999';
        }
    }
}
