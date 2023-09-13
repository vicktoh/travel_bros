/** @type {import('tailwindcss').Config} */
const {fontFamily}  = require('tailwindcss/defaultTheme');
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        wfont: ["var(--font-wfont)", ...fontFamily.sans],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "hero-image": "url('/images/hero.jpg')",
      },
      colors: {
        primary: "#672D2D",
        "primary-light": "#F6E4E4",
      },
      keyframes: {
        "slide-down": {
          from: {
            transform: "translateY(-100%)",
          },
          to: {
            transform: "translateY(0)",
          },
        },
        "slide-up": {
          from: {
            transform: "translateY(100%)",
          },
          to: {
            transform: "translateY(0)",
          },
        },
      },
      animation:{
        "slide-up": "slide-up 1s ease-in",
        "slide-down": "slide-down 1s ease-in"
      }
    },
  },
  plugins: [],
};
