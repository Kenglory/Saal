/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}", // <-- Aggiunto se mai userai /pages
  ],
  theme: {
    extend: {
      fontFamily: {
        cinzel: ['"Cinzel Decorative"', 'serif'],
      },
      colors: {
        text: "#000000",         // Testo nero
        background: "#ffffff",   // Sfondo bianco
        border: "#cccccc",       // Bordi grigio chiaro
        outline: "#999999",      // Outline grigio

        // Barre funzionali
        hp: "#dc2626",           // Rosso scuro
        focus: "#2563eb",        // Blu
        exp: "#16a34a",          // Verde
        karma: "#9333ea",        // Viola
      },
    },
  },
  plugins: [],
};