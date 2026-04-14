import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./domain/**/*.{ts,tsx}", "./services/**/*.{ts,tsx}", "./data/**/*.{ts,tsx}", "./infra/**/*.{ts,tsx}", "./tests/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0b1020",
          900: "#131b2d",
          800: "#1d2940"
        },
        paper: {
          50: "#f7f4ee",
          100: "#efe8dd"
        },
        accent: {
          500: "#4f7cff",
          600: "#355ff3"
        }
      },
      boxShadow: {
        soft: "0 18px 50px rgba(11, 16, 32, 0.12)"
      },
      keyframes: {
        drift: {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "50%": { transform: "translate3d(0, -10px, 0) scale(1.03)" }
        },
        rise: {
          "0%": { opacity: "0", transform: "translate3d(0, 14px, 0)" },
          "100%": { opacity: "1", transform: "translate3d(0, 0, 0)" }
        }
      },
      animation: {
        drift: "drift 14s ease-in-out infinite",
        rise: "rise 700ms ease-out both"
      }
    }
  },
  plugins: []
};

export default config;
