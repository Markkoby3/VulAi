'use client'

import { useState } from 'react'
import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'
import { CodeEditor } from '@/components/CodeEditor'
import { AnalysisResults } from '@/components/AnalysisResults'
import { ExamplesDropdown } from '@/components/ExamplesDropdown'
import { useAnalysis } from '@/hooks/useAnalysis'
import { Finding } from '@/lib/types'
import { Play, Zap } from 'lucide-react'

export default function DemoPage() {
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('python')
  const { isLoading, results, error, analyze, reset } = useAnalysis()

  const handleAnalyze = async () => {
    if (!code.trim()) {
      alert('Please paste or write some code to analyze.')
      return
    }
    await analyze(code, language)
  }

  const handleLoadExample = (exampleCode: string, exampleLanguage: string) => {
    setCode(exampleCode)
    setLanguage(exampleLanguage)
    reset()
  }

  const handleRefactor = async (finding: Finding) => {
    // This would call a refactor endpoint
    alert(`Generate refactor for: ${finding.type}\\n\\nThis feature is coming soon!`)
  }

  return (
    <main className="bg-slate-950 text-white min-h-screen flex flex-col">
      <NavBar />

      {/* Page Header */}
      <div className="border-b border-white/10 bg-gradient-to-b from-blue-950/30 to-transparent py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Live Demo</h1>
          <p className="text-gray-400">
            Paste your code and watch VulAI analyze it for security vulnerabilities in real-time.
          </p>
        </div>
      </div>

      {/* Demo Interface */}
      <div className="flex-1 px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: Code Editor */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Your Code</h2>
                <ExamplesDropdown onSelect={handleLoadExample} />
              </div>

              <div className="flex-1 min-h-[500px] lg:min-h-full">
                <CodeEditor
                  value={code}
                  onChange={setCode}
                  language={language}
                  onLanguageChange={setLanguage}
                />
              </div>

              {/* Analyze Button */}
              <button
                onClick={handleAnalyze}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-600 text-white px-6 py-4 rounded-lg font-bold transition-all hover:shadow-lg hover:shadow-cyan-500/50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Zap className="w-5 h-5 animate-pulse" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Analyze Code
                  </>
                )}
              </button>
            </div>

            {/* Right: Analysis Results */}
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-bold">Security Analysis</h2>
              <div className="flex-1 min-h-[500px] lg:min-h-full bg-white/5 border border-white/10 rounded-lg p-6 overflow-y-auto">
                <AnalysisResults
                  result={results}
                  isLoading={isLoading}
                  error={error}
                  onRefactor={handleRefactor}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
