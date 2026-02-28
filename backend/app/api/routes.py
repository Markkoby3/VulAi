"""
API route definitions
"""

from fastapi import APIRouter, HTTPException, BackgroundTasks
from app.api.schemas import (
    AnalyzeRequest, AnalyzeResponse,
    RefactorRequest, RefactorResponse,
    ScoreRequest, ScoreResponse
)
from app.engines.static_analyzer import StaticAnalyzer
from app.engines.llm_analyzer import LLMAnalyzer
from app.scoring.risk_scorer import RiskScorer
from app.reporting.report_builder import ReportBuilder
import logging

router = APIRouter()
logger = logging.getLogger("vulai")

# Initialize engines
static_analyzer = StaticAnalyzer()
llm_analyzer = LLMAnalyzer()
risk_scorer = RiskScorer()
report_builder = ReportBuilder()


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_code(request: AnalyzeRequest):
    """
    Analyze code for vulnerabilities.

    Combines static analysis with LLM-powered security insights.
    """
    try:
        logger.info(f"Analyzing {request.language} code: {len(request.code)} chars")

        # Step 1: Static analysis (fast)
        static_findings = static_analyzer.analyze(request.code, request.language)
        logger.info(f"Static analysis found {len(static_findings)} issues")

        # Step 2: LLM analysis (context-aware)
        llm_findings = await llm_analyzer.analyze(request.code, static_findings, request.language)
        logger.info(f"LLM analysis added {len(llm_findings) - len(static_findings)} insights")

        # Step 3: Scoring
        security_score = risk_scorer.compute_score(llm_findings)
        logger.info(f"Security score: {security_score.overall} ({security_score.grade})")

        # Step 4: Build report
        analysis_metadata = {
            "analysis_time_ms": 0,  # TODO: Track actual time
            "static_issues": len(static_findings),
            "llm_insights": len(llm_findings) - len(static_findings),
            "languages_detected": [request.language],
            "model_used": "claude-opus"
        }

        response = report_builder.build_response(
            findings=llm_findings,
            score=security_score,
            metadata=analysis_metadata
        )

        return response

    except Exception as e:
        logger.error(f"Analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@router.post("/refactor", response_model=RefactorResponse)
async def refactor_code(request: RefactorRequest):
    """
    Generate secure refactored code for a specific vulnerability.
    """
    try:
        logger.info(f"Refactoring {request.language} code for finding: {request.finding_id}")

        # Use LLM to generate secure refactor
        refactored = await llm_analyzer.generate_refactor(
            code=request.code,
            finding_id=request.finding_id,
            language=request.language
        )

        return refactored

    except Exception as e:
        logger.error(f"Refactor error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Refactoring failed: {str(e)}")


@router.post("/score", response_model=ScoreResponse)
async def get_security_score(request: ScoreRequest):
    """
    Get security score for code without detailed findings.
    Faster alternative to full analysis.
    """
    try:
        logger.info(f"Computing security score for {request.language} code")

        # Quick static analysis + scoring
        findings = static_analyzer.analyze(request.code, request.language)
        score = risk_scorer.compute_score(findings)

        summary_map = {
            "A": "Excellent security posture",
            "B": "Good security with minor issues",
            "C": "Moderate security concerns",
            "D": "Significant security issues",
            "F": "Critical security vulnerabilities"
        }

        return ScoreResponse(
            score=score.overall,
            grade=score.grade,
            summary=summary_map.get(score.grade, "Security analysis complete"),
            breakdown={
                "critical": score.critical_count,
                "high": score.high_count,
                "medium": score.medium_count,
                "low": score.low_count
            }
        )

    except Exception as e:
        logger.error(f"Scoring error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Scoring failed: {str(e)}")
