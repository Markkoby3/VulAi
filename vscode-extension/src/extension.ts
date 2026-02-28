/**
 * VulAI VSCode Extension Entry Point
 *
 * Initializes the security analysis co-pilot within VSCode
 */

import * as vscode from 'vscode';
import { VulAIClient } from './client/api';
import { SecurityAnalyzer } from './features/analyzer';
import { ExtensionLogger } from './utils/logger';

let context: vscode.ExtensionContext;
let logger: ExtensionLogger;
let client: VulAIClient;
let analyzer: SecurityAnalyzer;

export async function activate(extensionContext: vscode.ExtensionContext) {
    context = extensionContext;
    logger = new ExtensionLogger('VulAI');

    logger.info('Activating VulAI extension...');

    try {
        // Initialize configuration
        const config = vscode.workspace.getConfiguration('vulai');
        const backendUrl = config.get<string>('backendUrl') || 'http://localhost:8000';

        // Initialize core components
        client = new VulAIClient(backendUrl, logger);
        analyzer = new SecurityAnalyzer(client, logger);

        // Register commands
        registerCommands();

        // Register event listeners
        registerEventListeners();

        logger.info('VulAI extension activated successfully');

        // Show welcome message
        vscode.window.showInformationMessage('VulAI security co-pilot is ready! Press Ctrl+Shift+V to analyze code.');

    } catch (error) {
        logger.error(`Failed to activate extension: ${error}`);
        vscode.window.showErrorMessage('Failed to activate VulAI extension');
    }
}

function registerCommands() {
    // Analyze current file
    context.subscriptions.push(
        vscode.commands.registerCommand('vulai.analyze', async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showWarningMessage('No editor active');
                return;
            }
            await analyzer.analyzeDocument(editor.document);
        })
    );

    // Generate refactor
    context.subscriptions.push(
        vscode.commands.registerCommand('vulai.refactor', async (args: unknown) => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showWarningMessage('No editor active');
                return;
            }
            await analyzer.generateRefactor(editor.document, (args as Record<string, string>).findingId);
        })
    );

    // Show detailed report
    context.subscriptions.push(
        vscode.commands.registerCommand('vulai.showReport', async () => {
            analyzer.showDetailedReport();
        })
    );
}

function registerEventListeners() {
    const config = vscode.workspace.getConfiguration('vulai');
    const enableAutoAnalysis = config.get<boolean>('enableAutoAnalysis') || true;
    const analysisDelay = config.get<number>('analysisDelay') || 1000;

    if (enableAutoAnalysis) {
        // Analyze on file open
        context.subscriptions.push(
            vscode.window.onDidChangeActiveTextEditor(async (editor) => {
                if (editor && isSupportedLanguage(editor.document.languageId)) {
                    setTimeout(() => {
                        analyzer.analyzeDocument(editor.document);
                    }, analysisDelay);
                }
            })
        );

        // Analyze on save
        context.subscriptions.push(
            vscode.workspace.onDidSaveTextDocument(async (document) => {
                const editor = vscode.window.activeTextEditor;
                if (editor && editor.document === document && isSupportedLanguage(document.languageId)) {
                    setTimeout(() => {
                        analyzer.analyzeDocument(document);
                    }, analysisDelay);
                }
            })
        );
    }

    // Configuration change listener
    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration((e) => {
            if (e.affectsConfiguration('vulai')) {
                logger.info('VulAI configuration changed');
            }
        })
    );
}

function isSupportedLanguage(languageId: string): boolean {
    const supported = ['python', 'javascript', 'typescript', 'java', 'csharp', 'go', 'rust', 'php'];
    return supported.includes(languageId);
}

export function deactivate() {
    logger.info('Deactivating VulAI extension');
}
