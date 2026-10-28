/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FBF8F2',
          bg: '#FBF8F2',
          surface: '#F6F1E7',
          card: '#FFFFFF',
          border: '#EDE4D6',
          dark: '#E2D6C3',
          100: '#FAF6F0',
          200: '#F5EFE4',
          300: '#EFE5D5',
        },
        plum: {
          950: '#170E16',
          900: '#231522', // Deep Plum / Dark Burgundy
          800: '#2D1B2C',
          700: '#3D263A',
          600: '#553A51',
          muted: '#7A6777',
          light: '#9E8C9B',
          border: '#3D2539',
        },
        terracotta: {
          muted: '#D87D50', // Muted Orange Primary Accent
          burnt: '#C3532B', // Burnt Orange Secondary Accent
          dark: '#A43F1B',
          soft: '#F4CEBC',
          peach: '#F7D7C4',
          light: '#FAF1EB',
        },
        sage: {
          50: '#F4F7F3',
          100: '#E4EBE3',
          200: '#CAD8C8',
          500: '#8FA88D', // Muted Sage Green
          600: '#738F71',
          700: '#587356',
        },
        // Mapped brand aliases for luxury palette compatibility
        brand: {
          50: '#FAF6F0',
          100: '#F5EBE1',
          200: '#EAD6C4',
          300: '#F4CEBC',
          400: '#E28555', // Muted Orange
          500: '#D87D50', // Primary Accent
          600: '#C3532B', // Burnt Orange
          700: '#A43F1B',
          800: '#3D263A',
          900: '#2D1B2C',
          950: '#231522', // Deep Plum
        },
        dark: {
          bg: '#170E16',
          card: '#231522',
          surface: '#2D1B2C',
          border: '#3D263A',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Satoshi"', '"General Sans"', '"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        display: ['"Cabinet Grotesk"', '"Satoshi"', '"Playfair Display"', 'sans-serif'],
      },
      borderRadius: {
        '28': '28px',
        '32': '32px',
        '36': '36px',
        '40': '40px',
      },
      boxShadow: {
        'soft-sm': '0 1px 3px 0 rgba(35, 21, 34, 0.04)',
        'soft': '0 8px 30px -4px rgba(35, 21, 34, 0.06)',
        'soft-lg': '0 20px 45px -8px rgba(35, 21, 34, 0.09)',
        'card': '0 4px 24px -2px rgba(35, 21, 34, 0.05)',
      },
    },
  },
  plugins: [],
}
