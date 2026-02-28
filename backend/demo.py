"""
Demo script showing Claude-powered VulAI in action
"""

import asyncio
import json
from app.engines.static_analyzer import StaticAnalyzer
from app.engines.llm_analyzer import LLMAnalyzer
from app.scoring.risk_scorer import RiskScorer
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("vulai")


async def demo_vulnerability_analysis():
    """
    Demonstrate the full analysis pipeline:
    1. Static analysis (fast, pattern-based)
    2. LLM analysis (context-aware)
    3. Risk scoring
    """

    print("=" * 80)
    print("🔥 VulAI Claude Integration Demo")
    print("=" * 80)

    # Vulnerable code sample
    vulnerable_code = '''
import os
import sqlite3

def process_user_data(user_input):
    """Process user data - but insecurely!"""

    # Issue 1: SQL Injection
    db = sqlite3.connect(':memory:')
    query = f"SELECT * FROM users WHERE name = {user_input}"
    results = db.execute(query)

    # Issue 2: Command Injection
    system_command = f"file {user_input}"
    os.system(system_command)

    # Issue 3: Hardcoded Secret
    api_key = "sk-proj-1234567890abcdef"

    return results
    '''

    print("\n📝 Analyzing vulnerable code:")
    print("-" * 80)
    print(vulnerable_code)
    print("-" * 80)

    # Step 1: Static Analysis
    print("\n⚡ Step 1: Running Static Analysis...")
    static_analyzer = StaticAnalyzer()
    static_findings = static_analyzer.analyze(vulnerable_code, "python")

    print(f"✓ Found {len(static_findings)} issues:")
    for finding in static_findings:
        print(f"  - Line {finding.line}: {finding.vulnerability_type} ({finding.severity})")
        print(f"    {finding.message}")

    # Step 2: LLM Analysis
    print("\n🤖 Step 2: Running Claude-powered Analysis...")
    llm_analyzer = LLMAnalyzer()

    # Check if Claude is available
    if llm_analyzer.client is None:
        print("⚠️  Claude API not configured. Set LLM_API_KEY environment variable.")
        print("   Falling back to static analysis only.")
        all_findings = static_findings
    else:
        try:
            all_findings = await llm_analyzer.analyze(
                vulnerable_code,
                static_findings,
                "python"
            )

            additional = len(all_findings) - len(static_findings)
            print(f"✓ Claude found {additional} additional issues:")
            for finding in all_findings[len(static_findings):]:
                print(f"  - {finding.vulnerability_type} ({finding.severity}): {finding.message}")
        except Exception as e:
            print(f"⚠️  Claude analysis skipped: {e}")
            all_findings = static_findings

    # Step 3: Risk Scoring
    print(f"\n📊 Step 3: Computing Risk Score...")
    risk_scorer = RiskScorer()
    score = risk_scorer.compute_score(all_findings)

    print(f"✓ Security Score: {score.overall}/100")
    print(f"  Grade: {score.grade}")
    print(f"  Breakdown:")
    print(f"    - Critical: {score.critical_count}")
    print(f"    - High:     {score.high_count}")
    print(f"    - Medium:   {score.medium_count}")
    print(f"    - Low:      {score.low_count}")

    # Step 4: Summary
    print("\n" + "=" * 80)
    print("📋 Summary")
    print("=" * 80)
    print(f"Total Issues Found: {len(all_findings)}")
    print(f"Static Issues:      {len(static_findings)}")
    if llm_analyzer.client:
        print(f"LLM Insights:       {len(all_findings) - len(static_findings)}")
    print(f"Overall Risk Grade:  {score.grade} ({score.overall}/100)")

    if score.grade in ["D", "F"]:
        print(f"\n🚨 This code has CRITICAL security issues and should NOT be deployed.")
    elif score.grade == "C":
        print(f"\n⚠️  This code has SIGNIFICANT security issues and needs review.")
    elif score.grade in ["A", "B"]:
        print(f"\n✅ This code has acceptable security posture.")

    print("\n" + "=" * 80)
    print("💡 Next Steps:")
    print("  1. Review the vulnerabilities identified above")
    print("  2. Use the refactor endpoint to get secure code suggestions")
    print("  3. Deploy with confidence after fixing issues")
    print("=" * 80)


async def demo_refactor_generation():
    """
    Demonstrate Claude-powered code refactoring
    """

    print("\n\n" + "=" * 80)
    print("🔧 Code Refactoring Demo")
    print("=" * 80)

    vulnerable_code = 'os.system(f"ls {user_id}")'

    print("\n❌ Vulnerable Code:")
    print(f"  {vulnerable_code}")

    llm_analyzer = LLMAnalyzer()

    if llm_analyzer.client is None:
        print("\n⚠️  Claude API not configured. Refactoring demo skipped.")
        return

    print("\n🤖 Generating secure refactor with Claude...")

    try:
        refactored = await llm_analyzer.generate_refactor(
            vulnerable_code,
            "CMD_001",
            "python"
        )

        print(f"\n✅ Refactored Code:")
        print(f"  {refactored['refactored_code']}")
        print(f"\n📖 Explanation:")
        print(f"  {refactored['explanation']}")
        print(f"\n🎯 Security Improvement:")
        print(f"  {refactored['security_improvement']}")

    except Exception as e:
        print(f"⚠️  Refactoring failed: {e}")


if __name__ == "__main__":
    # Run demos
    asyncio.run(demo_vulnerability_analysis())
    asyncio.run(demo_refactor_generation())
