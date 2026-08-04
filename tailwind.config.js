/** @type {import('tailwindcss').Config} */

/**
 * KacherPonno colour system.
 *
 * Three hues, each with ONE job, so a shopper can read the meaning of a screen
 * without reading the words. Every ramp is deliberately low-chroma — this is an
 * app people open in a hurry, often outdoors, so it has to stay calm and
 * legible rather than shout.
 *
 *   jade      trust · primary actions · in stock · brand        (never commercial)
 *   marigold  sponsored placement · premium billing             (never anything else)
 *   clay      out of stock · wrong listing · lost customers
 *   ink/line  text, borders, surfaces
 */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Sylhet tea-garden green, desaturated a step so large fills stay soft.
        jade: {
          50: '#F1F7F4',
          100: '#DEEDE6',
          200: '#BFDCD0',
          300: '#95C5B3',
          400: '#66A992',
          500: '#428D77',
          600: '#307362',
          700: '#255D4E',
          800: '#1C483D',
          900: '#13322B',
          950: '#0D2420',
        },
        // Rickshaw-art marigold, warmed and dimmed so it reads as a label, not an alarm.
        marigold: {
          50: '#FFF9EC',
          100: '#FDEFCE',
          200: '#F9DFA3',
          300: '#F2C86B',
          400: '#E5AC3C',
          500: '#C98D1E',
          600: '#A06F16',
          700: '#7C5613',
        },
        // Brick terracotta — a warning, not a siren.
        clay: {
          50: '#FDF4F1',
          100: '#FAE1DA',
          200: '#F3C4B7',
          300: '#E69E8B',
          400: '#D4775F',
          500: '#BC5941',
          600: '#9E4632',
          700: '#7D3727',
        },
        ink: {
          DEFAULT: '#14241F',
          70: '#3D504A',
          50: '#667772',
          30: '#94A39E',
          20: '#B8C3BF',
        },
        canvas: '#F5F8F6',
        surface: '#FFFFFF',
        line: '#E6EDE9',
        'line-soft': '#F0F5F2',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        bn: ['"Hind Siliguri"', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        lg: '11px',
        xl: '14px',
        '2xl': '18px',
        '3xl': '26px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(20,36,31,.05), 0 1px 3px rgba(20,36,31,.035)',
        soft: '0 2px 10px -2px rgba(20,36,31,.07)',
        lift: '0 12px 30px -12px rgba(20,36,31,.20)',
        sheet: '0 -12px 48px rgba(20,36,31,.16)',
        frame: '0 50px 100px -40px rgba(0,0,0,.55), 0 0 0 1px rgba(255,255,255,.07)',
        'inset-line': 'inset 0 -1px 0 rgba(20,36,31,.05)',
      },
      transitionTimingFunction: {
        swift: 'cubic-bezier(.32,.72,0,1)',
      },
    },
  },
  plugins: [],
}
