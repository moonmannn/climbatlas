import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        antiquegold: "#c79748",
        bark: "#2b2118",
        forest: "#1f4d36",
        ink: "#1b1611",
        moss: "#6f7f48",
        parchment: "#f4ead6",
        ridge: "#8c7357",
        stoneblue: "#3b6978",
        sunlit: "#f4b860"
      },
      boxShadow: {
        atlas: "0 24px 80px rgb(43 33 24 / 24%)",
        marker: "0 10px 24px rgb(31 77 54 / 35%)"
      }
    }
  },
  plugins: []
};

export default config;
