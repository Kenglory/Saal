/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: "#f8f3e5",
      },
      fontFamily: {
        retro: ['"Press Start 2P"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};