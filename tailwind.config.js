/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
        sm: "320px",
        md: "720px",
        lg: "1024px",
        xl: "1280px",
    },
    extend: {},
  },
  plugins: [],
};

