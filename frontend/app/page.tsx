import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'
import { HeroSection } from '@/components/HeroSection'
import { ProblemSection } from '@/components/ProblemSection'
import { FeaturesSection } from '@/components/FeaturesSection'

export default function Home() {
  return (
    <main className="bg-slate-950 text-white">
      <NavBar />

      {/* Hero Section */}
      <HeroSection />

      {/* Problem Section */}
      <ProblemSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-950 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Secure Your Code?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Try VulAI now. It takes 30 seconds to get your first security analysis.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="/demo"
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-8 py-4 rounded-lg font-bold transition-all hover:shadow-lg hover:shadow-cyan-500/50"
            >
              Launch Live Demo →
            </a>
            <a
              href="https://github.com/Markkoby3/VulAi"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-cyan-500/50 hover:border-cyan-500 text-white px-8 py-4 rounded-lg font-bold transition-all hover:bg-cyan-500/10"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
