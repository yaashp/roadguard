/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        asphalt: {
          950: "#0B1120",
          900: "#101828",
          800: "#121A2B",
          700: "#1B2436",
          600: "#293349",
        },
        mist: {
          50: "#F5F7F6",
          100: "#EDF1EF",
          200: "#DFE6E3",
        },
        signal: {
          DEFAULT: "#17B890",
          dark: "#0F8F6E",
          light: "#5FDCB8",
        },
        hazard: {
          DEFAULT: "#E13B3B",
          dark: "#B92C2C",
        },
        warn: {
          DEFAULT: "#F2A93B",
          dark: "#C7841F",
        },
        route: {
          DEFAULT: "#2F6FED",
          dark: "#1F52BD",
        },
        violet: {
          DEFAULT: "#8B5CF6",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        sans: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        soft: "0 2px 20px -4px rgba(11, 17, 32, 0.12)",
        card: "0 4px 24px -6px rgba(11, 17, 32, 0.15)",
        glow: "0 0 0 1px rgba(23, 184, 144, 0.25), 0 8px 30px -8px rgba(23, 184, 144, 0.35)",
      },
      backgroundImage: {
        "dash-line": "repeating-linear-gradient(90deg, currentColor 0 24px, transparent 24px 40px)",
      },
      animation: {
        "dash-move": "dash-move 1.4s linear infinite",
        "float-slow": "float 6s ease-in-out infinite",
        "pulse-ring": "pulse-ring 2s cubic-bezier(0.4,0,0.6,1) infinite",
      },
      keyframes: {
        "dash-move": {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "64px 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.8" },
          "70%": { transform: "scale(1.6)", opacity: "0" },
          "100%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};
