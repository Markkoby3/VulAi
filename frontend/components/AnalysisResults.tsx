'use client'

import { AnalysisResult, Finding } from '@/lib/types'
import { SecurityScore } from './SecurityScore'
import { VulnerabilityCard } from './VulnerabilityCard'
import { Loader, AlertTriangle } from 'lucide-react'

interface AnalysisResultsProps {
  result: AnalysisResult | null
  isLoading: boolean
  error: string | null
  onRefactor?: (finding: Finding) => void
}

export function AnalysisResults({ result, isLoading, error, onRefactor }: AnalysisResultsProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-400">
        <Loader className="w-8 h-8 animate-spin text-cyan-400" />
        <p>Analyzing your code...</p>
        <p className="text-xs text-gray-500">This usually takes 2-3 seconds</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-6">
        <AlertTriangle className="w-8 h-8 text-red-400" />
        <p className="text-red-400">{error}</p>
        <p className="text-xs text-gray-400 text-center">
          Make sure the backend is running. Check your API configuration.
        </p>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-500">
        <p>Paste code and click Analyze to get started →</p>
      </div>
    )
  }

  const { findings, score, metadata } = result

  return (
    <div className="flex flex-col gap-6 h-full overflow-y-auto">
      {/* Score Summary */}
      <SecurityScore grade={score.grade} score={score.value} breakdown={score.breakdown} />

      {/* Findings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">
            Vulnerabilities Found ({findings.length})
          </h3>
          <span className="text-xs text-gray-400 bg-white/5 px-3 py-1 rounded">
            {metadata.analysisTimeMs}ms
          </span>
        </div>

        {findings.length === 0 ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-6 text-center">
            <p className="text-emerald-400 font-bold">No vulnerabilities found!</p>
            <p className="text-sm text-gray-400 mt-2">
              This code looks clean. Grade: {score.grade}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {findings.map((finding) => (
              <VulnerabilityCard
                key={finding.id}
                finding={finding}
                onRefactor={onRefactor}
              />
            ))}
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className="text-xs text-gray-500 pt-4 border-t border-white/10">
        <p>Analysis completed in {metadata.analysisTimeMs}ms using {metadata.modelUsed}</p>
      </div>
    </div>
  )
}
