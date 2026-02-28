'use client'

import { EXAMPLE_CODE_PYTHON, EXAMPLE_CODE_JAVASCRIPT } from '@/lib/constants'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

interface ExamplesDropdownProps {
  onSelect: (code: string, language: string) => void
}

export function ExamplesDropdown({ onSelect }: ExamplesDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  const examples = [
    { label: 'Python Vulnerable Code', code: EXAMPLE_CODE_PYTHON, language: 'python' },
    { label: 'JavaScript Vulnerable Code', code: EXAMPLE_CODE_JAVASCRIPT, language: 'javascript' },
  ]

  const handleSelect = (code: string, language: string) => {
    onSelect(code, language)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded hover:border-cyan-500/50 transition-colors text-white text-sm font-medium"
      >
        Load Example
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-slate-900 border border-white/20 rounded-lg shadow-lg z-50 min-w-[200px]">
          {examples.map((example, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(example.code, example.language)}
              className="w-full text-left px-4 py-3 hover:bg-cyan-500/20 border-b border-white/10 last:border-0 transition-colors"
            >
              <p className="font-medium">{example.label}</p>
              <p className="text-xs text-gray-400 mt-1">
                {example.language === 'python' ? '8 vulnerabilities' : '13 vulnerabilities'}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
