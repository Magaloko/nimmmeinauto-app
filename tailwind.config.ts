import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#1a56db", foreground: "#ffffff" },
        secondary: { DEFAULT: "#f3f4f6", foreground: "#111827" },
        destructive: { DEFAULT: "#dc2626", foreground: "#ffffff" },
        card: { DEFAULT: "#ffffff", foreground: "#111827" },
        border: "#e5e7eb",
        input: "#e5e7eb",
        ring: "#1a56db",
        background: "#f9fafb",
        foreground: "#111827",
        muted: { DEFAULT: "#f3f4f6", foreground: "#6b7280" },
        accent: { DEFAULT: "#eff6ff", foreground: "#1e40af" },
      },
      borderRadius: { lg: "0.5rem", md: "0.375rem", sm: "0.25rem" },
    },
  },
  plugins: [],
};

export default config;
