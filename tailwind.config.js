/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: ['translate-x-0', 'translate-x-full'],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#162C43",
        secondary: "#1a1a1a",
      },
      container: {
        center: true,
        padding: { DEFAULT: "1rem", sm: "3rem" },
      },
      animation: {
        'gradient-x': 'gradient-x 8s ease infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
      },
    },
  },
  plugins: [],
};
