/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        beige: {
          50: '#fdfcfb',
          100: '#f9f6f3',
          200: '#f3ede7',
          300: '#e8ddd0',
          400: '#d4c4b0',
        },
        pink: {
          100: '#fce4ec',
          200: '#f8bbd0',
          300: '#f48fb1',
        }
      },
      fontFamily: {
        sans: ['"Noto Sans SC"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

