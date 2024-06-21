/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xsm': '425px',
        '2xsm': '320px',
      },
      maxWidth: {
        'screen-3xl': '1900px'
      },

      backgroundImage: {
        'main-page': "url('./src/assets/bg-main.jpeg')",
      }
    },
  },
  plugins: [],
}

