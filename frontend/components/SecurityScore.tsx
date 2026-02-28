'use client'

import { GRADE_CONFIG } from '@/lib/constants'
import { Grade, ScoreBreakdown } from '@/lib/types'

interface SecurityScoreProps {
  grade: Grade
  score: number
  breakdown: ScoreBreakdown
}

export function SecurityScore({ grade, score, breakdown }: SecurityScoreProps) {
  const config = GRADE_CONFIG[grade]

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-8">
      <h3 className="text-lg font-bold mb-6">Security Score</h3>

      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Grade Circle */}
        <div className="flex flex-col items-center justify-center">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center ${config.bg} border-4 ${config.color}`}>
            <div className={`text-5xl font-bold ${config.color}`}>{grade}</div>
          </div>
          <p className={`text-sm mt-2 ${config.color}`}>{config.label} - {score}/100</p>
        </div>

        {/* Score Bar */}
        <div className="flex flex-col justify-center">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-400">Risk Level</span>
              <span className="text-sm font-bold">{score}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full transition-all ${
                  score >= 80 ? 'bg-red-600' : score >= 60 ? 'bg-yellow-600' : 'bg-emerald-600'
                }`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-red-500/10 rounded-lg p-3 text-center border border-red-500/30">
          <div className="text-xl font-bold text-red-400">{breakdown.critical}</div>
          <div className="text-xs text-gray-400">Critical</div>
        </div>
        <div className="bg-orange-500/10 rounded-lg p-3 text-center border border-orange-500/30">
          <div className="text-xl font-bold text-orange-400">{breakdown.high}</div>
          <div className="text-xs text-gray-400">High</div>
        </div>
        <div className="bg-yellow-500/10 rounded-lg p-3 text-center border border-yellow-500/30">
          <div className="text-xl font-bold text-yellow-400">{breakdown.medium}</div>
          <div className="text-xs text-gray-400">Medium</div>
        </div>
        <div className="bg-blue-500/10 rounded-lg p-3 text-center border border-blue-500/30">
          <div className="text-xl font-bold text-blue-400">{breakdown.low}</div>
          <div className="text-xs text-gray-400">Low</div>
        </div>
      </div>
    </div>
  )
}
