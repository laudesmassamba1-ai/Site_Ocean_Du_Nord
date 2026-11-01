/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#182018',
        paper: '#f5f1e8',
        cream: '#fcfaf5',
        sand: '#e8ddc9',
        forest: '#1f4635',
        'forest-deep': '#123126',
        river: '#2f6e73',
        clay: '#c05b36',
        'clay-deep': '#9a4326',
        ochre: '#d3a04a',
        'ochre-light': '#dfb05a',
        sage: '#dce2d3',
        moss: '#4f6350',
        muted: '#6c6a5d',
      },
      fontFamily: {
        sans: ['Instrument Sans', 'system-ui', 'sans-serif'],
        serif: ['Instrument Serif', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(18, 49, 38, 0.05), 0 12px 32px -16px rgba(18, 49, 38, 0.22)',
        card: '0 1px 2px rgba(18, 49, 38, 0.06), 0 18px 40px -24px rgba(18, 49, 38, 0.28)',
        lift: '0 24px 60px -28px rgba(18, 49, 38, 0.35)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'modal-in': {
          from: { opacity: '0', transform: 'translateY(18px) scale(0.985)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 700ms cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 600ms ease-out both',
        'modal-in': 'modal-in 320ms cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [],
};
