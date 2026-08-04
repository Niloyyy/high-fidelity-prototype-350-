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
        /* Darkened across the board: the previous ink-30 (#94A39E) was used for
           section labels and failed WCAG AA on white at ~2.8:1. Every step here
           now passes AA for its intended use. */
        ink: {
          DEFAULT: '#132420', //  15.1:1 on white — headings, primary text
          70: '#35473F', //   8.9:1 — body text
          50: '#556760', //   5.6:1 — secondary text, section labels
          30: '#7C8D86', //   3.5:1 — decorative/hint text only, never body
          20: '#AEBAB5', //   borders, disabled fills
        },
        /* Category wayfinding only. Never used for status — status is always
           jade / marigold / clay. */
        cat: {
          pharmacy: '#2E7160',
          'pharmacy-bg': '#DEEDE6',
          electronics: '#3D5A8C',
          'electronics-bg': '#E3E9F5',
          mobile: '#6B4A7C',
          'mobile-bg': '#EEE5F3',
          hardware: '#8A5C2B',
          'hardware-bg': '#F4E9DA',
        },
        canvas: '#F5F8F6',
        surface: '#FFFFFF',
        line: '#E6EDE9',
        'line-soft': '#F0F5F2',
      },
      fontFamily: {
        // Inter for UI and long text — it stays legible at 12px.
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        // Plus Jakarta Sans for headings, prices and numbers: rounder, warmer
        // and more confident at large sizes, which is what gives the screens
        // their retail feel without borrowing anyone's brand.
        display: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'sans-serif'],
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
