/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#15120f',
        smoke: '#6f675f',
        pearl: '#fbf8f2',
        bone: '#eee6d9',
        silk: '#f6efe5',
        moss: '#66715b',
        clove: '#6b3f31',
        gold: '#b88a45',
        night: '#211a17',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        perfume: '0 24px 80px rgba(45, 31, 22, 0.16)',
        soft: '0 16px 48px rgba(64, 45, 35, 0.10)',
      },
      backgroundImage: {
        grain:
          'radial-gradient(circle at 20% 10%, rgba(184,138,69,.14), transparent 28%), radial-gradient(circle at 85% 0%, rgba(102,113,91,.16), transparent 26%)',
      },
    },
  },
  plugins: [],
}
