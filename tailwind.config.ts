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
          green: "#3D5449",  // Forest Green from logo
          peach: "#F25F4C",  // Definitive Red from logo
          purple: "#A494C0", // Lavender from logo
          yellow: "#FBC67C", // Golden Yellow from logo
          beige: "#F7F5F0",  
          dark: "#3D5449",   
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "serif"],
        instrument: ["var(--font-instrument)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
        roboto: ["var(--font-roboto-flex)", "sans-serif"],
        arvo: ["var(--font-arvo)", "serif"],
        cormorant: ["var(--font-cormorant)", "serif"],
        montserrat: ["var(--font-montserrat)", "sans-serif"],
      },
      animation: {
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'fade-in': 'fadeIn 1s ease-out forwards',
        'draw': 'draw 2s ease-in-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
