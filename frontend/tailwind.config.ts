// NOTE: With Tailwind CSS v4, this file is not used for theme configuration.
// Theme is configured via CSS-first approach in src/index.css using @theme directive.
// This file is kept for reference and tooling compatibility.

import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3713ec',
        accent: '#00f2ff',
        dark: {
          bg: '#131022',
          surface: '#1d1c27',
          surface2: '#1c1930',
          border: '#2b2839',
        },
      },
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
      },
    },
  },
  plugins: [],
} satisfies Config
