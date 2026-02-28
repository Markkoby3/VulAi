'use client'

import { AlertCircle, Code, Zap } from 'lucide-react'

export function ProblemSection() {
  return (
    <section className="py-20 px-4 bg-slate-950">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-center">The Problem</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Problem 1 */}
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 hover:border-red-500/40 transition-colors">
            <AlertCircle className="w-8 h-8 text-red-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Trust It Blindly</h3>
            <p className="text-gray-400 text-sm">
              Deploy AI-generated code as-is. Fast shipping, but vulnerable to breaches.
            </p>
          </div>

          {/* Problem 2 */}
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-6 hover:border-orange-500/40 transition-colors">
            <Code className="w-8 h-8 text-orange-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Review Manually</h3>
            <p className="text-gray-400 text-sm">
              Spend hours in code review. Exhausting, slow, and human error-prone.
            </p>
          </div>

          {/* Problem 3 */}
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6 hover:border-yellow-500/40 transition-colors">
            <Zap className="w-8 h-8 text-yellow-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Use Basic Tools</h3>
            <p className="text-gray-400 text-sm">
              Static analysis catches obvious bugs. But it misses logic flaws and context.
            </p>
          </div>
        </div>

        <div className="mt-12 bg-white/5 border border-white/10 rounded-lg p-8 text-center">
          <p className="text-2xl font-bold mb-2">50M+ developers</p>
          <p className="text-gray-400">
            30% use AI code generators. <span className="text-cyan-400">0%</span> have integrated security.
          </p>
        </div>
      </div>
    </section>
  )
}
