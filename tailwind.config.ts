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
        editorial: '720px',
      },
      fontSize: {
        base: ['18px', { lineHeight: '1.55' }],
        'display-mega': ['clamp(72px, 14vw, 220px)', { lineHeight: '0.92', letterSpacing: '-0.025em' }],
        'display-xl': ['clamp(56px, 9vw, 144px)', { lineHeight: '0.96', letterSpacing: '-0.022em' }],
        'display-lg': ['clamp(44px, 6vw, 96px)', { lineHeight: '1.02', letterSpacing: '-0.02em' }],
        'display-md': ['clamp(36px, 4.5vw, 64px)', { lineHeight: '1.05', letterSpacing: '-0.018em' }],
        editorial: ['28px', { lineHeight: '1.45' }],
        lede: ['22px', { lineHeight: '1.5' }],
        caption: ['13px', { lineHeight: '1.4', letterSpacing: '0.02em' }],
      },
      letterSpacing: {
        label: '0.14em',
        'label-sm': '0.18em',
        'label-md': '0.1em',
        folio: '0.22em',
      },
      boxShadow: {
        print: '0 4px 24px rgba(18, 32, 31, 0.08)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'curtain-down': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'curtain-up': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '0.4', transform: 'scale(0.94)' },
          '50%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        marquee: 'marquee 60s linear infinite',
        'marquee-fast': 'marquee 30s linear infinite',
        'pulse-dot': 'pulse-dot 1.8s cubic-bezier(0.22, 1, 0.36, 1) infinite',
      },
      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.22, 1, 0.36, 1)',
        'editorial-strong': 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
    },
  },
  plugins: [],
}

export default config
