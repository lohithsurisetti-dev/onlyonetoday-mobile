/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors from web
        primary: '#8242f0',
        'background-light': '#f7f6f8',
        'background-dark': '#0A0A2A',
        'accent-blue': '#00BFFF',
        'accent-green': '#39FF14',
        'accent-gold': '#FFD700',
        
        // Semantic colors
        surface: {
          light: '#ffffff',
          dark: '#1a1a3a',
        },
        text: {
          primary: '#ffffff',
          secondary: 'rgba(255, 255, 255, 0.7)',
          tertiary: 'rgba(255, 255, 255, 0.5)',
        },
      },
      fontFamily: {
        display: ['SplineSans', 'sans-serif'],
        serif: ['Lora', 'serif'],
      },
      borderRadius: {
        DEFAULT: '12px',
        lg: '16px',
        xl: '24px',
      },
      boxShadow: {
        'glow-white': '0 0 15px rgba(255, 255, 255, 0.3)',
        'glow-gold': '0 0 15px rgba(255, 215, 0, 0.4)',
        'glow-blue': '0 0 15px rgba(0, 191, 255, 0.5)',
        'glow-green': '0 0 15px rgba(57, 255, 20, 0.5)',
      },
    },
  },
  plugins: [],
}

