/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#05070c',
          card: '#0a0e17',
          surface: '#101624',
          border: '#1b2438',
          cyan: '#00f3ff',
          'cyan-dim': 'rgba(0, 243, 255, 0.2)',
          blue: '#0066ff',
          'blue-dim': 'rgba(0, 102, 255, 0.2)',
          neon: '#0df',
          red: '#ff2a5f',
          green: '#00ff88'
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'Consolas', 'monospace'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', '"Outfit"', 'sans-serif'],
      },
      boxShadow: {
        'neon-cyan': '0 0 15px rgba(0, 243, 255, 0.45)',
        'neon-blue': '0 0 15px rgba(0, 102, 255, 0.45)',
        'neon-glow': '0 0 25px rgba(0, 243, 255, 0.3), 0 0 50px rgba(0, 102, 255, 0.2)',
      }
    },
  },
  plugins: [],
}
