import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
      },
      colors: {
        // Primary: trust-blue (warmer)
        primary: { DEFAULT: "#2563EB", foreground: "#ffffff", dark: "#1D4ED8", light: "#EFF6FF" },
        // Amber accent — warmth + CTAs
        amber: { DEFAULT: "#F59E0B", dark: "#D97706", light: "#FFFBEB" },
        // Neutrals — warm stone (not cold gray)
        background: "#F8F7F4",
        surface: "#FFFFFF",
        "surface-warm": "#FDFCFA",
        foreground: "#1C1917",
        "foreground-muted": "#6B7280",
        border: "#E7E5E4",
        "border-strong": "#D6D3D1",
        // Semantic
        success: { DEFAULT: "#16A34A", light: "#F0FDF4", fg: "#ffffff" },
        warning: { DEFAULT: "#D97706", light: "#FFFBEB" },
        destructive: { DEFAULT: "#DC2626", light: "#FEF2F2", foreground: "#ffffff" },
        // Component aliases
        card: { DEFAULT: "#FFFFFF", foreground: "#1C1917" },
        muted: { DEFAULT: "#F5F4F1", foreground: "#6B7280" },
        accent: { DEFAULT: "#EFF6FF", foreground: "#1E40AF" },
        input: "#E7E5E4",
        ring: "#2563EB",
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "14px",
        xl: "20px",
        "2xl": "24px",
        full: "9999px",
      },
      boxShadow: {
        soft: "0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px 0 rgba(0,0,0,0.04)",
        card: "0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -1px rgba(0,0,0,0.04)",
        hover: "0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -2px rgba(0,0,0,0.04)",
        warm: "0 4px 20px rgba(217,119,6,0.12)",
        blue: "0 4px 20px rgba(37,99,235,0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
