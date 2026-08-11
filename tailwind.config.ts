import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Very dark neutral base (not pure black), faint cool tint.
        base: "#0B0B10",
        surface: "#131319",
        raised: "#1A1A22",
        border: "#282833",
        line: "#20202a",
        text: "#E9E9EE",
        muted: "#A7A7B4",
        faint: "#6E6E7C",
        // Single accent: violet.
        accent: "#7C3AED",
        "accent-bright": "#A78BFA",
        "accent-soft": "#C4B5FD",
        live: "#4ADE80",
        progress: "#FBBF24",
        client: "#C4B5FD",
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      maxWidth: {
        content: "72rem",
      },
      keyframes: {
        "term-line": {
          "0%": { opacity: "0", transform: "translateY(3px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        blink: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
        "rise-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        blink: "blink 1.1s step-end infinite",
        "rise-in": "rise-in 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
