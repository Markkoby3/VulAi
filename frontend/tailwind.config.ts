import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          950: '#0f172a',
        },
        cyan: {
          500: '#06b6d4',
        },
      },
      backgroundColor: {
        dark: '#0f172a',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
export default config
