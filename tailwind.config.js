/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        indigo: {
          950: '#0b102b',
        },
        slate: {
          850: '#111827',
        },
      },
      boxShadow: {
        glass: '0 10px 40px rgba(0,0,0,0.25)',
      },
    },
  },
  plugins: [],
}
