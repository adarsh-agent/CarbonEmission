/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        forest: {
          50: "#eef7f1",
          100: "#d6ecdd",
          200: "#aed9bd",
          300: "#7dbf98",
          400: "#4d9f74",
          500: "#2f9e44",
          600: "#237a37",
          700: "#1c5f2c",
          800: "#154522",
          900: "#0b3d2e",
          950: "#072a20",
        },
        mint: {
          50: "#f4fbf6",
          100: "#e6f6ea",
          200: "#cbecd4",
          300: "#b7e4c7",
          400: "#93d3ab",
        },
        canvas: "#f7faf7",
        ink: "#1b1f1d",
        amber: {
          400: "#e8a33d",
          500: "#d98d1f",
        },
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(11, 61, 46, 0.12)",
        card: "0 4px 24px -4px rgba(11, 61, 46, 0.10)",
      },
      backgroundImage: {
        "leaf-grad": "linear-gradient(135deg, #2f9e44 0%, #1c5f2c 100%)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        drift: {
          "0%": { transform: "translate(0,0) rotate(0deg)" },
          "50%": { transform: "translate(20px,-15px) rotate(8deg)" },
          "100%": { transform: "translate(0,0) rotate(0deg)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        drift: "drift 10s ease-in-out infinite",
      },
    },
  },
  plugins: [],
}
