/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0A0C12",
        surface: "#12151C",
        "surface-elevated": "#1A1E28",
        accent: "#5B8FFF",
        "accent-glow": "#7BA3FF",
        "accent-dark": "#3B6FD9",
        highlight: "#DFE8F5",
        cta: "#F2A93B",
        "cta-hover": "#D98A2E",
        primary: "#F0F2F6",
        secondary: "#A4AEB8",
        disabled: "#7A8491",
        subtle: "#2A2E3A",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      boxShadow: {
        "glow-sm": "0 0 12px rgba(91,143,255,0.25)",
        "glow-md": "0 0 24px rgba(91,143,255,0.4)",
        "glow-lg": "0 0 48px rgba(91,143,255,0.6)",
        card: "0 4px 24px rgba(0,0,0,0.4)",
        pressed: "inset 0 2px 8px rgba(0,0,0,0.6)",
      },
      animation: {
        "star-pulse": "starPulse 2s ease-in-out infinite",
      },
      keyframes: {
        starPulse: {
          "0%, 100%": { boxShadow: "0 0 6px rgba(91,143,255,0.4)", transform: "scale(1)" },
          "50%": { boxShadow: "0 0 18px rgba(91,143,255,0.8)", transform: "scale(1.15)" },
        },
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
        full: "9999px",
      },
      spacing: {
        // Custom scale steps matching Design_System.md §4
        // Tailwind defaults already cover most (4,8,12,16,24,32,48,64)
        // Documenting here for completeness:
        // space-1 = 4px, space-2 = 8px, space-3 = 12px, space-4 = 16px,
        // space-6 = 24px, space-8 = 32px, space-12 = 48px, space-16 = 64px
      },
    },
  },
  plugins: [],
};
