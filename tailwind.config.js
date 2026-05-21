
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        shine: {
          '0%': { 'background-position': '100%' },
          '100%': { 'background-position': '-100%' },
        },
      },
      animation: {
        shine: 'shine 5s linear infinite',
      },
      fontFamily: {
        sans: ['Lato', 'system-ui', 'sans-serif'],
        mono: ['"PT Mono"', 'monospace'],
        shanti: ['Shanti', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f5f8fa',
          100: '#eaf0f4',
          200: '#cbdae4',
          300: '#a7bfd0',
          400: '#7ea1b7',
          500: '#396680',
          600: '#2d5166',
          700: '#223d4c',
          800: '#172933',
          900: '#0c141a',
          950: '#060a0d',
        },
        accent: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        }
      },
    },
  },
  plugins: [],
}
