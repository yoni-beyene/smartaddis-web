/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary-green': '#0F7A4A',
        'dark-forest': '#0A4D30',
        'forest-ink': '#082018',
        'light-green': '#22C55E',
        'off-white': '#F8FAFC',
        'accent-gold': '#F4B400',
        'cotton': '#F5F1E4',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}

