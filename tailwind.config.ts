import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Locdone warm-grays (NOT cool blue-grays)
        bg: {
          base: '#0E0E10',
          raised: '#16161A',
          elevated: '#1E1E23',
        },
        border: {
          subtle: '#26262D',
          DEFAULT: '#36363F',
        },
        text: {
          primary: '#F2F2F5',
          secondary: '#A8A8B3',
          tertiary: '#6E6E78',
        },
        // Signal Green — accent + trust color (same thing on purpose)
        accent: {
          DEFAULT: '#7CFFB2',
          dim: '#5ED99A',
        },
        warning: '#FFC368',
        error: '#FF6B6B',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.5rem', { lineHeight: '2rem' }],
        '2xl': ['2rem', { lineHeight: '2.5rem' }],
        '3xl': ['2.75rem', { lineHeight: '1.1' }],
        '4xl': ['4rem', { lineHeight: '1.05' }],
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '8px',
        lg: '12px',
        pill: '999px',
      },
      boxShadow: {
        glow: '0 0 32px rgba(124,255,178,0.15)',
        'glow-strong': '0 0 48px rgba(124,255,178,0.35)',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      animation: {
        'fade-up': 'fadeUp 400ms cubic-bezier(0.22, 1, 0.36, 1)',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'shake': 'shake 400ms cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '75%': { transform: 'translateX(4px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
