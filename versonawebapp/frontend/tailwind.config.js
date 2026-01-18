/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'jet-black': '#0B0B0B',
        'metallic-gold': '#D4AF37',
        'electric-purple': '#6C4DFF',
        'muted-cyan': '#4ECDC4',
        'warm-orange': '#FF8A65',
        'dark-gray': '#1A1A1A',
        'medium-gray': '#2A2A2A',
        'light-gray': '#3A3A3A',
        // Premium purple palette for dark UI
        iris: {
        300: "#C4B5FD", // soft highlight
        400: "#A78BFA",
        500: "#8B5CF6", // main accent
        600: "#7C3AED",
        700: "#6D28D9", // depth
      },
      "cyan-glow": "#22D3EE",
      
      
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'urdu': ['Noto Nastaliq Urdu', 'serif']
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'orbit': 'orbit 20s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(108, 77, 255, 0.5)' },
          '100%': { boxShadow: '0 0 30px rgba(108, 77, 255, 0.8)' }
        },
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(150px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(150px) rotate(-360deg)' }
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
