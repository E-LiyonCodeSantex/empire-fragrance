const { hover } = require('framer-motion');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        screens: {
        'xs': '550px',
        'md': '860px',
      },
       colors: {
        primary: '#2563EB',
        hoverPrimary: '#1D4ED8',
        secondary: '#d36e26ff',
        hoverSecondary: '#b44d04ff',
      },
    },
  },
  plugins: [],
}

