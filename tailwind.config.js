/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        black: '#0a0a0a',
        steel: '#4a5568',
        amber: '#d4a574',
        gray: {
          900: '#111111',
          800: '#1a1a1a',
          700: '#2d2d2d',
          600: '#404040',
          500: '#595959',
          400: '#7a7a7a',
          300: '#a3a3a3',
          200: '#d1d5db',
          100: '#f3f4f6',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Garamond', 'serif'],
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
