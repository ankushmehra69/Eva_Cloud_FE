/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#006BBF", 100: "#EDF2FB", 200: "#BAD4E8" },
        secondary: { DEFAULT: "#1C1D1F", 100: "#111015", 200: "#141416" },
        danger: { DEFAULT: "#CF3A3A" },
        grey: {
          50: "#FAFAFA",
          100: "#7B7B7B",
          200: "#E1E1E1",
          300: "#E7E7E7",
          400: "#E2E8F0",
          500: "#73839B",
          600: "#49454F",
          700: "#8D8D8D",
          800: "#DBDBDB",
        },
      },
      fontFamily: {
        sans: "Space Grotesk",
        spartan: "League Spartan",
      },
      backgroundImage: {
        "custom-radial":
          "radial-gradient(50% 50% at 50% 50%, #432C2C 0%, rgba(80, 28, 28, 0) 100%)",
        "gradient-transparent":
          "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #ffffff 100%)",
        "tab-gradient":
          "linear-gradient(180deg, rgba(255, 255, 255) 0%, #006BBF 362.5%)",
      },
      dropShadow: {
        "3xl": "0px 4px 5.8px -31.23px #0000000D",
        "4xl": "0px -2px 7px 0px #00000026",
      },
      boxShadow: {
        "3xl": "0px 15px 62.46px -31.23px #6625008F",
        "4xl": "0px 0px 2.56px 0px #000000CC",
        "5xl": "0px -2px 7px 0px #00000026",
        "6xl": "0px 1px 3px 0px #00000030",
      },
    },
  },
  plugins: [],
};
