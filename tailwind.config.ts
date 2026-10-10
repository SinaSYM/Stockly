import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background) / <alpha-value>)", surface: "rgb(var(--surface) / <alpha-value>)", ink: "rgb(var(--ink) / <alpha-value>)",
        "accent-coral": "#FF6841", "accent-mint": "#5DD7C4",
        "accent-yellow": "#FFD84D", "accent-blue": "#74C9F8",
        "accent-lilac": "#C7B8F5",
      },
      borderRadius: { card: "22px", pill: "9999px" },
      fontFamily: { sans: ["Estedad", "Nunito Sans", "sans-serif"] },
    },
  },
  plugins: [],
};
export default config;
