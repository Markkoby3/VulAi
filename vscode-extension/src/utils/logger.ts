/**
 * Extension logger utility
 */

import * as vscode from 'vscode';

export class ExtensionLogger {
    private outputChannel: vscode.OutputChannel;
    private prefix: string;

    constructor(name: string) {
        this.prefix = name;
        this.outputChannel = vscode.window.createOutputChannel(name);
    }

    info(message: string) {
        this.log('INFO', message);
    }

    warn(message: string) {
        this.log('WARN', message);
    }

    error(message: string) {
        this.log('ERROR', message);
    }

    debug(message: string) {
        this.log('DEBUG', message);
    }

    private log(level: string, message: string) {
        const timestamp = new Date().toLocaleTimeString();
        const logMessage = `[${timestamp}] [${level}] ${message}`;
        this.outputChannel.appendLine(logMessage);
        console.log(logMessage);
    }

    show() {
        this.outputChannel.show();
    }

    dispose() {
        this.outputChannel.dispose();
    }
}
