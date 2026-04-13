/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'brand-green': '#16a34a', // Xanh lá đậm cho nút, icon
        'brand-light': '#f0fdf4', // Xanh cực nhạt cho background hoặc card
        'brand-white': '#ffffff'  // Trắng tinh khiết
      },
    },
  },
  plugins: [],
}