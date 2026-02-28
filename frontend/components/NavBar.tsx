'use client'

import Link from 'next/link'
import { Github } from 'lucide-react'

export function NavBar() {
  return (
    <nav className="sticky top-0 z-50 bg-slate-950 border-b border-cyan-500/20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center font-bold text-white group-hover:shadow-lg group-hover:shadow-cyan-500/50 transition-shadow">
              V
            </div>
            <span className="font-bold text-lg hidden sm:inline bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              VulAI
            </span>
          </Link>

          {/* Center: Navigation Links */}
          <div className="hidden md:flex gap-8">
            <Link
              href="/demo"
              className="text-sm font-medium hover:text-cyan-400 transition-colors"
            >
              Demo
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium hover:text-cyan-400 transition-colors"
            >
              About
            </Link>
          </div>

          {/* Right: CTA & GitHub */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Markkoby3/VulAi"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-cyan-500/10 rounded-lg transition-colors"
              title="View on GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <Link
              href="/demo"
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-all hover:shadow-lg hover:shadow-cyan-500/50"
            >
              Try Demo
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
