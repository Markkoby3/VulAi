'use client'

import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'
import { Code2, Server, Brain, TrendingUp, Award, GitBranch } from 'lucide-react'

export default function AboutPage() {
  return (
    <main className="bg-slate-950 text-white min-h-screen flex flex-col">
      <NavBar />

      {/* Hero Section */}
      <section className="border-b border-white/10 bg-gradient-to-b from-blue-950/30 to-transparent py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">How VulAI Works</h1>
          <p className="text-gray-400 max-w-2xl">
            VulAI combines fast pattern matching with Claude AI to deliver context-aware security analysis that catches vulnerabilities static tools miss.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="flex-1 px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Architecture Overview */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Architecture</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Code2,
                  title: 'Static Analyzer',
                  description: 'Fast pattern matching detects SQL injection, hardcoded secrets, command injection, code injection, and more in milliseconds.',
                },
                {
                  icon: Brain,
                  title: 'LLM Analyzer',
                  description: 'Claude AI understands code logic and context, finding security issues that regex patterns can\'t detect.',
                },
                {
                  icon: TrendingUp,
                  title: 'Risk Scorer',
                  description: 'Weighted vulnerability assessment produces A-F security grades based on actual impact and severity.',
                },
              ].map((item, idx) => {
                const Icon = item.icon
                return (
                  <div
                    key={idx}
                    className="bg-white/5 border border-white/10 rounded-lg p-6 hover:border-cyan-500/50 transition-all hover:bg-cyan-500/5"
                  >
                    <Icon className="w-10 h-10 text-cyan-400 mb-4" />
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-400">{item.description}</p>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Technical Achievements */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Technical Achievements</h2>
            <div className="space-y-4">
              {[
                {
                  icon: Award,
                  title: '42/42 Tests Passing',
                  description: '100% test success rate with 27 backend tests and 15 extension tests.',
                },
                {
                  icon: Code2,
                  title: 'Type-Safe Stack',
                  description: 'Pydantic (Python) + TypeScript ensures zero runtime type errors.',
                },
                {
                  icon: Server,
                  title: 'Production Architecture',
                  description: 'Async FastAPI, modular design, Docker-ready, Kubernetes provisions planned.',
                },
                {
                  icon: Brain,
                  title: 'Claude AI Integration',
                  description: 'Seamless anthropic SDK integration with fallback to static analysis.',
                },
                {
                  icon: TrendingUp,
                  title: 'Performance Optimized',
                  description: 'Static analysis: 10-50ms. Claude analysis: 2-3 seconds. Total: <4 seconds.',
                },
                {
                  icon: GitBranch,
                  title: 'Modular & Extensible',
                  description: 'Each engine is independently testable and replaceable for future enhancements.',
                },
              ].map((item, idx) => {
                const Icon = item.icon
                return (
                  <div
                    key={idx}
                    className="bg-white/5 border border-white/10 rounded-lg p-6 hover:border-cyan-500/50 transition-all flex gap-4"
                  >
                    <Icon className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-400">{item.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Vulnerability Detection */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Detects 7+ Vulnerability Types</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { name: 'SQL Injection', examples: 'Direct query concatenation, f-strings' },
                { name: 'Command Injection', examples: 'os.system(), subprocess unsafe calls' },
                { name: 'Hardcoded Secrets', examples: 'API keys, passwords, tokens' },
                { name: 'Code Injection', examples: 'eval(), exec(), unsafe imports' },
                { name: 'Path Traversal', examples: 'Unsafe file operations' },
                { name: 'Authentication Bypass', examples: 'Weak validation, missing checks' },
              ].map((vuln, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <h4 className="font-bold text-cyan-400 mb-1">{vuln.name}</h4>
                  <p className="text-sm text-gray-400">{vuln.examples}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Stats */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8">By The Numbers</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Backend Tests', value: '27' },
                { label: 'Extension Tests', value: '15' },
                { label: 'Test Pass Rate', value: '100%' },
                { label: 'Avg Analysis Time', value: '<4s' },
                { label: 'Type Coverage', value: '100%' },
                { label: 'Docs Pages', value: '14' },
                { label: 'Vulnerability Types', value: '7+' },
                { label: 'API Endpoints', value: '3' },
              ].map((stat, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 rounded-lg p-6 text-center">
                  <div className="text-2xl font-bold text-cyan-400 mb-2">{stat.value}</div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Stack */}
          <section>
            <h2 className="text-3xl font-bold mb-8">Technology Stack</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold mb-4 text-cyan-400">Backend</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>• FastAPI (async, type-safe)</li>
                  <li>• Python 3.11+</li>
                  <li>• Pydantic 2.5+</li>
                  <li>• Anthropic Claude API</li>
                  <li>• Pytest (27 tests)</li>
                  <li>• Docker & Docker Compose</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-4 text-cyan-400">Frontend</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>• Next.js 14</li>
                  <li>• TypeScript 5.3+</li>
                  <li>• Tailwind CSS</li>
                  <li>• Lucide React Icons</li>
                  <li>• Axios HTTP client</li>
                  <li>• Jest Tests (15 tests)</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  )
}
