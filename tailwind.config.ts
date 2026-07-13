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
        brandforest: "#10382E",
        pine: "#1F3B2E",
        cream: "#F3EEE2",
        charcoal: "#1B2823",
        sand: "#D9CCB6",
        terracotta: "#CB6038",
        sky: "#91ADB3",
        antiquegold: "#C79748",
        bark: "#2B2118",
        forest: "#1F4D36",
        ink: "#1B1611",
        moss: "#6F7F48",
        parchment: "#F4EAD6",
        ridge: "#8C7357",
        stoneblue: "#3B6978",
        sunlit: "#F4B860"
      },
      boxShadow: {
        atlas: "0 8px 30px rgb(16 56 46 / 6%)",
        marker: "0 8px 20px rgb(16 56 46 / 18%)",
        editorial: "0 8px 30px rgb(16 56 46 / 6%)"
      }
    }
  },
  plugins: []
};

export default config;
