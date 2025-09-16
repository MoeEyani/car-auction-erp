/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6', // blue-500
          hover: '#2563EB',   // blue-600
        },
        secondary: {
          DEFAULT: '#6B7280', // gray-500
          hover: '#4B5563',   // gray-600
        },
        success: '#10B981', // green-500
        error: '#EF4444',   // red-500
      },
      fontFamily: {
        'arabic': ['Cairo', 'Noto Sans Arabic', 'sans-serif'],
      }
    },
  },
  plugins: [require('tailwindcss-rtl')],
}