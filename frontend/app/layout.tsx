import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'VulAI - The AI That Audits AI',
  description: 'Real-time security analysis for AI-generated code. Catch vulnerabilities before they reach production.',
  keywords: ['security', 'code analysis', 'AI', 'vulnerability detection', 'DevSecOps'],
  metadataBase: new URL('https://vulai.web.app'),
  openGraph: {
    title: 'VulAI - The AI That Audits AI',
    description: 'Real-time security analysis for AI-generated code. Catch vulnerabilities before they reach production.',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'VulAI - AI Security Analysis',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VulAI - The AI That Audits AI',
    description: 'Real-time security analysis for AI-generated code',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  )
}
