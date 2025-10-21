/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#6366f1', // Your primary color
          600: '#4f46e5', // primary-dark
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        secondary: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981', // Your secondary color
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        accent: '#f59e0b', // amber-500
        danger: '#ef4444', // red-500
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a', // Your dark color
        },
        darker: '#020617', // gray-950
      },
      backgroundColor: {
        'card': 'rgba(255, 255, 255, 0.05)',
        'glass': 'rgba(255, 255, 255, 0.1)',
      },
      borderColor: {
        'glass': 'rgba(255, 255, 255, 0.1)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(99, 102, 241, 0.3)',
        'glow-primary': '0 0 20px rgba(99, 102, 241, 0.4)',
        'glow-secondary': '0 0 20px rgba(16, 185, 129, 0.4)',
      },
      animation: {
        'glow-move': 'glowMove 3s ease-in-out infinite',
        'pulse-ring': 'pulseRing 2s linear infinite',
        'wave': 'wave 1.5s ease-in-out infinite',
        'voice-wave': 'voiceWave 1s ease-in-out infinite',
        'slide-in': 'slideIn 0.3s ease',
        'slide-out': 'slideOut 0.3s ease',
        'rotate': 'rotate 3s linear infinite',
      },
      keyframes: {
        glowMove: {
          '0%, 100%': { transform: 'translateX(-100%)' },
          '50%': { transform: 'translateX(100%)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(1.4)', opacity: '0' },
        },
        wave: {
          '0%, 100%': { transform: 'scaleX(0.5)', opacity: '0.5' },
          '50%': { transform: 'scaleX(1)', opacity: '1' },
        },
        voiceWave: {
          '0%, 100%': { transform: 'scaleY(0.5)' },
          '50%': { transform: 'scaleY(2)' },
        },
        slideIn: {
          'from': { transform: 'translateX(100%)', opacity: '0' },
          'to': { transform: 'translateX(0)', opacity: '1' },
        },
        slideOut: {
          'from': { transform: 'translateX(0)', opacity: '1' },
          'to': { transform: 'translateX(100%)', opacity: '0' },
        },
        rotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #6366f1 0%, #10b981 100%)',
        'gradient-primary-dark': 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, transparent 100%)',
        'gradient-dark': 'linear-gradient(135deg, #020617 0%, #0f172a 100%)',
      },
    },
  },
  plugins: [],
}