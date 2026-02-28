'use client'

import Link from 'next/link'
import { ArrowRight, Code2, Shield } from 'lucide-react'

export function HeroSection() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950/20 to-slate-950 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/20 blur-3xl rounded-full"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10 text-center py-20">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full px-4 py-2 mb-6 hover:border-cyan-500/50 transition-colors">
          <Shield className="w-4 h-4 text-cyan-400" />
          <span className="text-sm text-cyan-400 font-medium">
            AI-Powered Security Analysis
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            VulAI
          </span>
          <br />
          <span className="text-white">The AI That Audits AI</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
          Real-time security analysis for AI-generated code. Catch vulnerabilities before they reach production.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-12 max-w-2xl mx-auto">
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold text-cyan-400">42/42</div>
            <div className="text-xs text-gray-400">Tests Passing</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold text-cyan-400">2-3s</div>
            <div className="text-xs text-gray-400">Analysis Time</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold text-cyan-400">7+</div>
            <div className="text-xs text-gray-400">Vuln Types</div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/demo"
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-8 py-4 rounded-lg font-bold transition-all hover:shadow-lg hover:shadow-cyan-500/50 flex items-center justify-center gap-2 group"
          >
            Try Live Demo
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="https://github.com/Markkoby3/VulAi"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-cyan-500/50 hover:border-cyan-500 text-white px-8 py-4 rounded-lg font-bold transition-all hover:bg-cyan-500/10 flex items-center justify-center gap-2"
          >
            <Code2 className="w-5 h-5" />
            View on GitHub
          </a>
        </div>

        {/* Demo preview */}
        <div className="bg-gradient-to-b from-white/5 to-white/0 border border-white/10 rounded-lg p-1 overflow-hidden">
          <div className="bg-black rounded-lg p-6 border border-white/10">
            <div className="space-y-4 font-mono text-sm text-gray-400">
              <div className="text-cyan-400"># VulAI Security Analysis in Action</div>
              <div>
                <span className="text-red-400">user_id</span> = request.args.get(&apos;id&apos;)
              </div>
              <div>
                query = <span className="text-yellow-400">f&quot;SELECT * FROM users WHERE id={'{user_id}'}&quot;</span>
              </div>
              <div className="text-red-500 font-bold">↑ SQL Injection Detected! Grade: F</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
