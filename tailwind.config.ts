import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold:         '#C9A84C',
        'gold-light': '#E8C97A',
        'gold-pale':  '#F5E6C0',
        charcoal:     '#0D0D0D',
        'warm-white': '#F8F4EE',
        cream:        '#EDE8DF',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Playfair Display', 'Georgia', 'serif'],
        body:    ['Montserrat', 'Helvetica Neue', 'sans-serif'],
      },
      animation: {
        'fade-in-up': 'fade-in-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        marquee:      'marquee 28s linear infinite',
      },
      keyframes: {
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(32px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
