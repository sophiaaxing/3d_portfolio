/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        primary: "#fff8f5",
        accent: "#a34464",
        ink: "#49313e",
        secondary: "#735d68",
        tertiary: "#f7e8ec",
        "black-100": "#fffdfb",
        "black-200": "#f3dde3",
        "white-100": "#49313e",
      },
      boxShadow: {
        card: "0px 35px 120px -15px #07111f",
      },
      screens: {
        xs: "450px",
      },
      backgroundImage: {
        "hero-pattern": "url('/src/assets/herobg.png')",
      },
    },
  },
  plugins: [],
};