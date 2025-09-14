import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light mode pastels
        primary: {
          50: "#fef7ff",
          100: "#fdeeff",
          200: "#fdd5ff",
          300: "#fcb3ff",
          400: "#f881ff",
          500: "#f24ff0", // Main pink
          600: "#e02ed4",
          700: "#c41fb1",
          800: "#a01b91",
          900: "#841a77",
        },
        secondary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9", // Main blue
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        // Neumorphic grays
        neu: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          800: "#1e293b",
          900: "#0f172a",
        },
      },
      fontFamily: {
        display: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "neu-light": "8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff",
        "neu-dark": "8px 8px 16px #0a0f1a, -8px -8px 16px #1a2332",
        "neu-inset": "inset 8px 8px 16px #d1d9e6, inset -8px -8px 16px #ffffff",
        "neu-inset-dark":
          "inset 8px 8px 16px #0a0f1a, inset -8px -8px 16px #1a2332",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
    },
  },
  plugins: [],
  darkMode: "class",
};

export default config;
