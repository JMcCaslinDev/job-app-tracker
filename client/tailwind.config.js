module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",  // This should cover all your React components
    "./public/**/*.html"  // If you have any HTML files in your public directory
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
  ],
}
