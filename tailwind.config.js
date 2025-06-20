/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
      },
      boxShadow: {
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        input: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      },
      borderRadius: {
        xl: "1rem",
      },
      keyframes: {
        shine: {
          "0%": { left: "-100%" },
          "50%, 100%": { left: "100%" },
        },
      },
      animation: {
        shine: "shine 6s infinite",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
