/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cream': '#f5f0e8',
        'cream-dark': '#e8e0d5',
        'retro-green': '#4ade80',
        'retro-green-dark': '#22c55e',
        'retro-brown': '#c0b5a8',
        'retro-gold': '#fbbf24',
        'pixel-blue': '#3b82f6',
        'pixel-red': '#ef4444',
        'text-dark': '#1a1a1a',
        'text-muted': '#6b7280',
      },
      fontFamily: {
        'pixel': ['"Press Start 2P"', 'monospace'],
        'retro': ['"VT323"', 'monospace'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'float-slow': 'float 5s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'shake': 'shake 0.3s ease-in-out',
        'battle-shake': 'battle-shake 0.2s linear infinite',
        'fadeIn': 'fadeIn 1s ease-in-out', 
      },
    },
  },
  plugins: [],
}
