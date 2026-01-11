import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        'idam-navy': '#0B1B3A',
        'idam-gold': '#C9A227',
        'idam-plat': '#E7E7EA',
        'idam-ink': '#0A0A0B'
      },
      boxShadow: {
        soft: '0 12px 30px rgba(11,27,58,0.08)'
      }
    }
  },
  plugins: []
}

export default config
