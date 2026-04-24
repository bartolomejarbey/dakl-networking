import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          deep: '#0F2926',
          DEFAULT: '#163933',
          lighter: '#1F4A42',
          glow: '#2A6B5F',
        },
        teal: {
          DEFAULT: '#1E8B85',
          dark: '#16665F',
        },
        orange: {
          DEFAULT: '#E97940',
          dark: '#C65A22',
        },
        cream: '#F5EFE2',
        ink: {
          DEFAULT: '#12201F',
          soft: '#2A3838',
        },
        charcoal: '#0A1514',
      },
      fontFamily: {
        serif: ['var(--font-instrument-serif)', 'serif'],
        sans: ['var(--font-inter-tight)', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      maxWidth: {
        container: '1440px',
      },
      fontSize: {
        // Base from HTML mockup: 18px / 1.55
        base: ['18px', { lineHeight: '1.55' }],
      },
      letterSpacing: {
        label: '0.14em',
        'label-sm': '0.18em',
        'label-md': '0.1em',
      },
    },
  },
  plugins: [],
}

export default config
