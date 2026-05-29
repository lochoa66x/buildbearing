import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#202532",
        field: "#f6f0e5",
        paper: "#fffaf0",
        "bearing-blue": "#426b87",
        "bearing-gold": "#c68619",
        "bearing-rust": "#a95d3f",
      },
      boxShadow: {
        soft: "0 18px 50px -30px rgba(32, 37, 50, 0.32)",
      },
    },
  },
  plugins: [],
};

export default config;
