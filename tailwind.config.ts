import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        origo: {
          green: "#3D5449",
          peach: "#F25F4C",
          purple: "#A494C0",
          yellow: "#FBC67C",
          beige: "#F7F5F0",
          dark: "#3D5449",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        inter: ["var(--font-inter)", "Inter", "sans-serif"],
        cormorant: ["var(--font-cormorant)", "serif"],
        montserrat: ["var(--font-montserrat)", "sans-serif"],
      },
      boxShadow: {
        editorial: "0 4px 24px -8px rgba(0,0,0,0.04)",
        "editorial-hover": "0 16px 48px -12px rgba(0,0,0,0.08)",
      },
      animation: {
        "fade-up": "fadeUp 0.8s ease-out forwards",
        "fade-in": "fadeIn 1s ease-out forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
