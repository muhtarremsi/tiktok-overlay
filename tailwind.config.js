/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'arc-yellow': '#FFD000',     /* Das typische leuchtende Gelb */
        'arc-bg': '#0B0C0E',         /* Ganz dunkler Hintergrund */
        'arc-panel': '#15171B',      /* Karten Hintergrund */
        'arc-border': '#2A2D35',     /* Rahmen */
        'arc-text': '#E1E1E1',       /* Heller Text */
        'arc-muted': '#8A8D96',      /* Grauer Text */
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
