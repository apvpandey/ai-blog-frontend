/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        'deep-navy': '#0d1117',
        'card-dark': '#1a2035',
      },
      keyframes: {
        'spin-slow': {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':      { opacity: '0.3', transform: 'scale(0.7)' },
        },
        fadein: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'spin-slow':  'spin-slow 18s linear infinite',
        'twinkle1':   'twinkle 2.1s ease-in-out infinite',
        'twinkle2':   'twinkle 2.8s ease-in-out 0.6s infinite',
        'twinkle3':   'twinkle 2.4s ease-in-out 1.2s infinite',
        'fadein1':    'fadein 0.6s ease both',
        'fadein2':    'fadein 0.6s ease 0.15s both',
        'fadein3':    'fadein 0.6s ease 0.30s both',
        'fadein4':    'fadein 0.6s ease 0.45s both',
      },
    },
  },
  plugins: [],
}