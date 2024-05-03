/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // make sure your paths are correct
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
  ],
}

