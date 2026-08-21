/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0a0a0a',
          800: '#1a1a1a',
          700: '#2a2a2a',
          600: '#3a3a3a',
        },
        steel: '#8b9dc3',
        amber: '#d4a574',
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],
        condensed: ['Courier New', 'monospace'],
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#e5e5e5',
            a: {
              color: '#d4a574',
              '&:hover': {
                color: '#e5a580',
              },
            },
            strong: {
              color: '#f5f5f5',
            },
            code: {
              color: '#d4a574',
            },
          },
        },
      },
    },
  },
  plugins: [],
};
