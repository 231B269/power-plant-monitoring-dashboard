/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        industrial: {
          50: '#eef6ff', 100: '#d9eaff', 200: '#bcd9ff', 300: '#8ec0ff',
          400: '#599cff', 500: '#3478f6', 600: '#2056e6', 700: '#1a44c4',
          800: '#1a3a9e', 900: '#1b337d', 950: '#0c1f4d',
        },
        surface: {
          light: '#f1f5f9', DEFAULT: '#0f172a', card: '#1e293b', border: '#334155',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      keyframes: {
        'pulse-ring': { '0%': { transform: 'scale(0.8)', opacity: '0.8' }, '100%': { transform: 'scale(2.2)', opacity: '0' } },
        'fade-in': { '0%': { opacity: '0', transform: 'translateY(8px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        'slide-in': { '0%': { opacity: '0', transform: 'translateX(-12px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
        'shimmer': { '0%': { backgroundPosition: '-1000px 0' }, '100%': { backgroundPosition: '1000px 0' } },
      },
      animation: {
        'pulse-ring': 'pulse-ring 1.8s cubic-bezier(0.215,0.61,0.355,1) infinite',
        'fade-in': 'fade-in 0.4s ease-out',
        'slide-in': 'slide-in 0.35s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [],
};
