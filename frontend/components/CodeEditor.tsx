'use client'

import { Copy, Trash2 } from 'lucide-react'

interface CodeEditorProps {
  value: string
  onChange: (code: string) => void
  language: string
  onLanguageChange: (lang: string) => void
}

export function CodeEditor({ value, onChange, language, onLanguageChange }: CodeEditorProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(value)
  }

  return (
    <div className="h-full flex flex-col bg-black border border-white/10 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-white/5 border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="bg-white/10 border border-white/20 rounded px-3 py-1 text-sm text-white hover:border-cyan-500/50 focus:outline-none focus:border-cyan-500"
        >
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="go">Go</option>
          <option value="java">Java</option>
        </select>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="p-2 hover:bg-white/10 rounded transition-colors text-gray-400 hover:text-white"
            title="Copy code"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={() => onChange('')}
            className="p-2 hover:bg-white/10 rounded transition-colors text-gray-400 hover:text-white"
            title="Clear code"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor */}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste your code here or try an example..."
        className="flex-1 bg-black text-white font-mono text-sm p-4 border-none focus:outline-none resize-none"
        spellCheck="false"
      />
    </div>
  )
}
