/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cottage: {
          cream: '#F7F3EC',
          'cream-alt': '#FAF7F2',
          white: '#FFFFFF',
          sand: '#E7DED3',
          charcoal: '#1F2937',
          gray: '#6B7280',
          green: '#1F6F4A',
          tan: '#C9A66B',
          red: '#B5483A',
          amber: '#D7A33A',
        },
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
    },
  },
  plugins: [],
}
