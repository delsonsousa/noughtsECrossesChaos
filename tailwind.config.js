/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#1A1A1A',
        surface: '#262626',
        playerX: '#00E5FF',
        playerO: '#FF4081',
        accent: '#00E5FF',
        textMuted: '#888888',
      },
    },
  },
  plugins: [],
};
