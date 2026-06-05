import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg:      '#0a0704',
        surface: '#1a1008',
        'surface-alt': '#231508',
        muted:   '#c4a896',
        accent:  '#ff9a3c',
        'accent-2': '#ff6b9d',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        brand: '0 24px 80px rgba(0,0,0,0.3)',
        modal: '0 32px 100px rgba(0,0,0,0.5)',
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #ff9a3c, #ff6b9d)',
        'gradient-page':  'radial-gradient(circle at top, rgba(255,154,60,0.1), transparent 36%), linear-gradient(180deg,#0d0908 0%,#08060400 100%)',
      },
      animation: {
        'slide-up':   'slideUp 0.25s ease',
        'fade-in':    'fadeIn 0.2s ease',
        'scale-in':   'scaleIn 0.25s ease',
      },
      keyframes: {
        slideUp:  { from: { transform: 'translateY(40px)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } },
        fadeIn:   { from: { opacity: '0' }, to: { opacity: '1' } },
        scaleIn:  { from: { transform: 'scale(0.95) translateY(20px)', opacity: '0' }, to: { transform: 'scale(1) translateY(0)', opacity: '1' } },
      },
    },
  },
  plugins: [],
}
export default config
