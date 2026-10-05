/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vana: {
          50: '#F4F8F3',
          100: '#E6F0E5',
          200: '#C7DEC4',
          300: '#A1C79D',
          400: '#75AB70',
          500: '#4F8F49',
          600: '#2D5A27', // Brand Forest Green
          700: '#23461E',
          800: '#1A3517',
          900: '#11230F',
          950: '#0B170A',
        },
        timber: {
          50: '#FBF9F7',
          100: '#F5EFEB',
          200: '#E6DCD4',
          300: '#CEBCAC',
          400: '#AB927A',
          500: '#8A6D53',
          600: '#6B4E36',
          700: '#4A3525', // Deep Timber
          800: '#382518',
          900: '#26190F',
        },
        sand: {
          50: '#FDFCF7',
          100: '#FAF7EE',
          200: '#F3EDDA',
          300: '#E8DDC1',
          400: '#D9C8A1',
          500: '#C5B080',
          base: '#FDFBF7',
          surface: '#F6F2E9',
          border: '#E8E1D3',
        },
        slate: {
          earth: '#1E293B',
          muted: '#64748B',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 24px -2px rgba(45, 90, 39, 0.08)',
        'card': '0 8px 30px rgba(74, 53, 37, 0.08)',
        'elevated': '0 20px 40px -15px rgba(26, 53, 23, 0.15)',
      },
    },
  },
  plugins: [],
}
