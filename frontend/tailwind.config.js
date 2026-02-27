/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        slowspin: "spin 15s linear infinite",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        "primary-orange": "#FF6B35", // vibrant orange for headings/buttons
        "peach-light": "#FFF5EE",
        "peach-medium": "#FFE4D9",
        "accent-orange": "#FF4500",
        primary: "#D04500",
      },
      backgroundImage: {
        "page-gradient":
          "linear-gradient(to bottom right, #fffaf5, #ffe8d6, #ffd9c2)",
        "gradient-primary": "linear-gradient(to right, #F9F7F3, #FFF5EE)",
      },
    },
  },
  plugins: [],
};
