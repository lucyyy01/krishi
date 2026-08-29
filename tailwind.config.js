/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        krishi: {
          50: '#f2f9f4',
          100: '#e1f3e7',
          200: '#c5e7d1',
          300: '#99d4b0',
          400: '#64b988',
          500: '#3c9e67',
          600: '#2c7f51',
          700: '#256543',
          800: '#205137',
          900: '#1c432f',
          950: '#0b2519',
        },
        soil: {
          50: '#fbf7f4',
          100: '#f4ede6',
          200: '#e8dcce',
          300: '#d7c2ad',
          400: '#c2a188',
          500: '#b18669',
          600: '#9d6f55',
          700: '#835946',
          800: '#6c4a3c',
          900: '#5a3f34',
        },
        harvest: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        }
      },
      keyframes: {
        pulseSlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        wave: {
          '0%': { transform: 'scaleY(0.4)' },
          '50%': { transform: 'scaleY(1)' },
          '100%': { transform: 'scaleY(0.4)' },
        }
      },
      animation: {
        'pulse-slow': 'pulseSlow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wave-1': 'wave 1.2s ease-in-out infinite',
        'wave-2': 'wave 1.2s ease-in-out 0.2s infinite',
        'wave-3': 'wave 1.2s ease-in-out 0.4s infinite',
        'wave-4': 'wave 1.2s ease-in-out 0.6s infinite',
      }
    },
  },
  plugins: [],
}
