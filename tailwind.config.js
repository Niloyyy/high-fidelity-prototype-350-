/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Sylhet tea-garden jade — the trust colour. Primary actions, in-stock, brand.
        jade: {
          50: '#F0F7F4',
          100: '#D8EDE5',
          200: '#B2DCCC',
          300: '#7FC3AC',
          400: '#3EA184',
          500: '#17836A',
          600: '#0E6552',
          700: '#0B4E3F',
          800: '#093C31',
          900: '#072B23',
        },
        // Rickshaw-art marigold — reserved strictly for Sponsored + Premium.
        marigold: {
          50: '#FFF8E9',
          100: '#FCEBC2',
          200: '#F8D68A',
          300: '#F3BE4E',
          400: '#EDA71F',
          500: '#D98C08',
          600: '#B06D05',
          700: '#8A5406',
        },
        // Terracotta-brick clay — out of stock, errors, "wrong listing".
        clay: {
          50: '#FDF1EE',
          100: '#F9DCD5',
          300: '#E9A08D',
          500: '#C4432B',
          600: '#A63620',
          700: '#832A19',
        },
        ink: {
          DEFAULT: '#0B1F1A',
          70: '#3A4C46',
          50: '#5C6B66',
          30: '#8A9A94',
        },
        canvas: '#F2F6F4',
        surface: '#FFFFFF',
        line: '#E3ECE8',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        bn: ['"Hind Siliguri"', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        xl: '14px',
        '2xl': '18px',
        '3xl': '24px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(11,31,26,.06), 0 1px 1px rgba(11,31,26,.04)',
        lift: '0 10px 28px -10px rgba(11,31,26,.22)',
        sheet: '0 -10px 44px rgba(11,31,26,.18)',
        frame: '0 40px 90px -30px rgba(7,43,35,.45), 0 0 0 1px rgba(11,31,26,.06)',
      },
      transitionTimingFunction: {
        swift: 'cubic-bezier(.32,.72,0,1)',
      },
    },
  },
  plugins: [],
}
