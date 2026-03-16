/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'tac-dark': '#044C60',
        'tac-teal': '#A7D7DA',
        'tac-cream': '#F7DBAD',
        'tac-yellow': '#EFB023',
        'tac-red': '#C93A3A',
        'tac-cyan': '#18787F',
        'tac-light': '#F5F5F5',
        'tac-blue17': '#2F6A7B',
        'tac-blue85': '#D9E4E7',
        'tac-grey': '#626262',
        'tac-shade30': '#033543',
        'tac-shade40': '#022E3A',
        'tac-blue59': '#98B6BE',
        'tac-blue42': '#6D97A3',
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
        display: ['"Poltawski Nowy"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
