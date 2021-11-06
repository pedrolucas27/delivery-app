module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
   extend: {
    colors: {
      red: '#d51b1b',
      yellow: '#f4a405',
      green: '#118C4F',
      orange: '#FB6107',
      whitecard: '#EEF5DB'
    }
   },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
