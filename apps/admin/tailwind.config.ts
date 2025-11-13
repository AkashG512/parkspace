import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        border: "#333333",
        input: "#333333",
        ring: "#007AFF",
        background: "#111111",
        foreground: "#FAFAFA",
        card: {
          DEFAULT: "#1A1A1A",
          foreground: "#FAFAFA"
        },
        accent: {
          DEFAULT: "#007AFF",
          foreground: "#FAFAFA"
        },
        muted: {
          DEFAULT: "#2C2C2C",
          foreground: "#888888"
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"]
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.25rem"
      }
    }
  },
  plugins: [animate]
};

export default config;
