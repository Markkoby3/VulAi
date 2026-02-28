'use client'

import { Sparkles, Zap, CheckCircle, Wand2 } from 'lucide-react'

export function FeaturesSection() {
  const features = [
    {
      icon: Sparkles,
      title: 'Dual Analysis Engine',
      description:
        'Combines fast pattern matching with Claude AI for context-aware vulnerability detection. No false positives.',
    },
    {
      icon: Zap,
      title: 'Real-Time Feedback',
      description:
        'Inline diagnostics in your editor. Security grade (A-F) with detailed breakdown. Instant insights.',
    },
    {
      icon: CheckCircle,
      title: 'Weighted Risk Scoring',
      description:
        'Not all vulnerabilities are equal. Smart scoring based on severity and impact gives you actual risk.',
    },
    {
      icon: Wand2,
      title: 'One-Click Fixes',
      description:
        'Generate secure code suggestions powered by Claude. Fix vulnerabilities with confidence in seconds.',
    },
  ]

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-slate-950 to-blue-950/20">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4">Why VulAI?</h2>
        <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
          Four things that make VulAI different from every other security tool.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <div
                key={idx}
                className="bg-white/5 border border-white/10 rounded-lg p-8 hover:border-cyan-500/50 transition-all hover:bg-cyan-500/5 group"
              >
                <Icon className="w-10 h-10 text-cyan-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            )
          })}
        </div>

        {/* Comparison Table */}
        <div className="mt-16 bg-white/5 border border-white/10 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-6 py-4 text-left font-bold">Feature</th>
                  <th className="px-6 py-4 text-center font-bold text-cyan-400">VulAI</th>
                  <th className="px-6 py-4 text-center font-bold">Static Tools</th>
                  <th className="px-6 py-4 text-center font-bold">Manual Review</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'AI-Powered', vulai: '✓', static: '', manual: '' },
                  { feature: 'IDE Integration', vulai: '✓', static: 'Partial', manual: '' },
                  { feature: 'Context Aware', vulai: '✓', static: '', manual: '✓' },
                  { feature: 'Refactor Suggestions', vulai: '✓', static: '', manual: '✓' },
                  { feature: 'Real-time Feedback', vulai: '✓', static: '✓', manual: '' },
                  { feature: 'Fast (<3 seconds)', vulai: '✓', static: '✓', manual: '' },
                ].map((row, idx) => (
                  <tr key={idx} className="border-b border-white/5">
                    <td className="px-6 py-4 font-medium">{row.feature}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-cyan-400">{row.vulai}</span>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-400">{row.static}</td>
                    <td className="px-6 py-4 text-center text-gray-400">{row.manual}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
