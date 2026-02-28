'use client'

import { useState, useCallback } from 'react'
import { apiClient } from '@/lib/api-client'
import { AnalysisResult } from '@/lib/types'

interface UseAnalysisState {
  isLoading: boolean
  results: AnalysisResult | null
  error: string | null
}

export function useAnalysis() {
  const [state, setState] = useState<UseAnalysisState>({
    isLoading: false,
    results: null,
    error: null,
  })

  const analyze = useCallback(async (code: string, language: string = 'python') => {
    setState({ isLoading: true, results: null, error: null })

    try {
      const startTime = Date.now()
      const results = await apiClient.analyzeCode(code, language)
      const analysisTimeMs = Date.now() - startTime

      setState({
        isLoading: false,
        results: {
          ...results,
          metadata: { ...results.metadata, analysisTimeMs },
        },
        error: null,
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setState({
        isLoading: false,
        results: null,
        error: errorMessage,
      })
    }
  }, [])

  const reset = useCallback(() => {
    setState({ isLoading: false, results: null, error: null })
  }, [])

  return { ...state, analyze, reset }
}
