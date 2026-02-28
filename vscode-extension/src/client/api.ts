/**
 * API client for communicating with VulAI backend
 */

import axios, { AxiosInstance } from 'axios';
import { ExtensionLogger } from '../utils/logger';

export interface AnalyzeRequest {
    code: string;
    language: string;
    filename?: string;
    context?: Record<string, unknown>;
}

export interface Finding {
    id: string;
    type: string;
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    confidence: number;
    line: number;
    column: number;
    message: string;
    code_snippet?: string;
    remediation?: string;
    secure_example?: string;
    cwe?: string;
}

export interface AnalyzeResponse {
    findings: Finding[];
    score: {
        overall: number;
        grade: string;
        critical_count: number;
        high_count: number;
        medium_count: number;
        low_count: number;
    };
    metadata: {
        analysis_time_ms: number;
        static_issues: number;
        llm_insights: number;
        languages_detected: string[];
        model_used?: string;
    };
}

export interface RefactorRequest {
    code: string;
    finding_id: string;
    language: string;
    context?: Record<string, unknown>;
}

export interface RefactorResponse {
    original_code: string;
    refactored_code: string;
    explanation: string;
    security_improvement: string;
}

export class VulAIClient {
    private client: AxiosInstance;
    private logger: ExtensionLogger;

    constructor(baseURL: string, logger: ExtensionLogger) {
        this.logger = logger;
        this.client = axios.create({
            baseURL: `${baseURL}/api`,
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Add error handler
        this.client.interceptors.response.use(
            response => response,
            error => {
                this.logger.error(`API error: ${error.message}`);
                throw error;
            }
        );
    }

    async analyze(request: AnalyzeRequest): Promise<AnalyzeResponse> {
        this.logger.info(`Analyzing ${request.language} code`);
        try {
            const response = await this.client.post<AnalyzeResponse>('/analyze', request);
            return response.data;
        } catch (error) {
            this.logger.error(`Analysis failed: ${error}`);
            throw error;
        }
    }

    async refactor(request: RefactorRequest): Promise<RefactorResponse> {
        this.logger.info(`Generating refactor for finding: ${request.finding_id}`);
        try {
            const response = await this.client.post<RefactorResponse>('/refactor', request);
            return response.data;
        } catch (error) {
            this.logger.error(`Refactoring failed: ${error}`);
            throw error;
        }
    }

    async getScore(code: string, language: string) {
        this.logger.info(`Getting security score for ${language} code`);
        try {
            const response = await this.client.post('/score', { code, language });
            return response.data;
        } catch (error) {
            this.logger.error(`Score request failed: ${error}`);
            throw error;
        }
    }

    async healthCheck(): Promise<boolean> {
        try {
            const response = await this.client.get('/health');
            return response.status === 200;
        } catch {
            return false;
        }
    }
}
