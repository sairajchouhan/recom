module.exports = {
  content: ['./app/**/*.tsx', './app/**/*.jsx'],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
    require('@tailwindcss/aspect-ratio'),
    require('tailwindcss-debug-screens'),
  ],
}
