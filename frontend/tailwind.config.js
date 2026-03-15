// /** @type {import('tailwindcss').Config} */
// export default {
//   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
//   theme: {
//     extend: {
//       keyframes: {
//         "fade-in-down": {
//           "0%": { opacity: "0", transform: "translateY(-20px)" },
//           "100%": { opacity: "1", transform: "translateY(0)" },
//         },
//         "fade-in-up": {
//           "0%": { opacity: "0", transform: "translateY(20px)" },
//           "100%": { opacity: "1", transform: "translateY(0)" },
//         },
//         "slide-in-left": {
//           "0%": { opacity: "0", transform: "translateX(-50px)" },
//           "100%": { opacity: "1", transform: "translateX(0)" },
//         },
//         "slide-in-right": {
//           "0%": { opacity: "0", transform: "translateX(50px)" },
//           "100%": { opacity: "1", transform: "translateX(0)" },
//         },
//         "slide-up": {
//           "0%": { opacity: "0", transform: "translateY(30px)" },
//           "100%": { opacity: "1", transform: "translateY(0)" },
//         },
//         "slide-up-delay": {
//           "0%": { opacity: "0", transform: "translateY(30px)" },
//           "100%": { opacity: "1", transform: "translateY(0)" },
//         },
//         "fade-in": {
//           "0%": { opacity: "0" },
//           "100%": { opacity: "1" },
//         },
//       },
//       animation: {
//         "fade-in-down": "fade-in-down 0.8s ease-out",
//         "fade-in-up": "fade-in-up 0.8s ease-out 0.2s backwards",
//         "float-slow": "float-slow 6s ease-in-out infinite",
//         "float-medium": "float-medium 5s ease-in-out infinite",
//         "float-fast": "float-fast 4s ease-in-out infinite",
//         slowspin: "spin 15s linear infinite",
//         "bounce-in": "bounce-in 0.8s ease-out",
//         "slide-in-left": "slide-in-left 0.6s ease-out",
//         "slide-in-right": "slide-in-right 0.6s ease-out 0.2s backwards",
//         "pop-up": "pop-up 0.5s ease-out 0.4s backwards",
//         "spin-slow": "spin-slow 8s linear infinite",
//         "gradient-x": "gradient-x 3s ease infinite",
//         "bounce-small": "bounce-small 0.5s ease-in-out",
//         "float-gentle": "float-gentle 3s ease-in-out infinite",
//         "slide-down": "slide-down 0.6s ease-out",
//         "slide-up": "slide-up 0.6s ease-out 0.2s backwards",
//         "slide-up-delay": "slide-up-delay 0.6s ease-out 0.4s backwards",
//         "fade-in": "fade-in 0.6s ease-out 0.6s backwards",
//         "fade-in-delay": "fade-in-delay 0.6s ease-out 0.8s backwards",
//       },
//       backgroundSize: {
//         "200%": "200%",
//       },

//       fontFamily: {
//         poppins: ["Poppins", "sans-serif"],
//       },
//       colors: {
//         "primary-orange": "#FF6B35", // vibrant orange for headings/buttons
//         "peach-light": "#FFF5EE",
//         "peach-medium": "#FFE4D9",
//         "accent-orange": "#FF4500",
//         primary: "#D04500",
//       },
//       backgroundImage: {
//         "page-gradient":
//           "linear-gradient(to bottom right, #fffaf5, #ffe8d6, #ffd9c2)",
//         "gradient-primary": "linear-gradient(to right, #F9F7F3, #FFF5EE)",
//       },
//     },
//   },
//   plugins: [],
// };
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "fade-in-down": {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-left": {
          "0%": { opacity: "0", transform: "translateX(-50px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(50px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up-delay": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-in-delay": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "float-medium": {
          "0%, 100%": { transform: "translateY(0px) translateX(0px)" },
          "50%": { transform: "translateY(-15px) translateX(10px)" },
        },
        "float-fast": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-25px)" },
        },
        "bounce-in": {
          "0%": { opacity: "0", transform: "scale(0.3)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
          "70%": { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)" },
        },
        "pop-up": {
          "0%": { opacity: "0", transform: "translateY(30px) scale(0.8)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "gradient-x": {
          "0%, 100%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" },
        },
        "bounce-small": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        "float-gentle": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "slide-down": {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "bounce-gentle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-3px)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.5)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        blob: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
        },
        "scale-in-popup": {
          "0%": { opacity: "0", transform: "scale(0.88)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-in-down": "fade-in-down 0.8s ease-out",
        "fade-in-up": "fade-in-up 0.8s ease-out 0.2s backwards",
        "slide-in-left": "slide-in-left 0.6s ease-out",
        "slide-in-right": "slide-in-right 0.6s ease-out 0.2s backwards",
        "slide-up": "slide-up 0.6s ease-out 0.2s backwards",
        "slide-up-delay": "slide-up-delay 0.6s ease-out 0.4s backwards",
        "slide-down": "slide-down 0.6s ease-out",
        "fade-in": "fade-in 0.6s ease-out 0.6s backwards",
        "fade-in-delay": "fade-in-delay 0.6s ease-out 0.8s backwards",
        "float-slow": "float-slow 6s ease-in-out infinite",
        "float-medium": "float-medium 5s ease-in-out infinite",
        "float-fast": "float-fast 4s ease-in-out infinite",
        "float-gentle": "float-gentle 3s ease-in-out infinite",
        "bounce-in": "bounce-in 0.8s ease-out",
        "bounce-small": "bounce-small 0.5s ease-in-out",
        "bounce-gentle": "bounce-gentle 2s ease-in-out infinite",
        "pop-up": "pop-up 0.5s ease-out 0.4s backwards",
        "spin-slow": "spin-slow 20s linear infinite",
        "gradient-x": "gradient-x 3s ease infinite",
        "scale-in": "scale-in 0.5s ease-out",
        blob: "blob 7s infinite",
        slowspin: "spin 15s linear infinite",
        "scale-in-popup":
          "scale-in-popup 0.22s cubic-bezier(0.22,1,0.36,1) both",
      },
      backgroundSize: {
        "200%": "200%",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        "primary-orange": "#FF6B35",
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
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".animation-delay-200": {
          "animation-delay": "0.2s",
        },
        ".animation-delay-2000": {
          "animation-delay": "2s",
        },
        ".animation-delay-100": { "animation-delay": "0.1s" },
        ".animation-delay-300": { "animation-delay": "0.3s" },
        ".animation-delay-400": { "animation-delay": "0.4s" },
        ".animation-delay-500": { "animation-delay": "0.5s" },
      };
      addUtilities(newUtilities);
    },
  ],
};
