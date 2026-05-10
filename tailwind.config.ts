import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["Courier New", "monospace"],
      },
      colors: {
        bg: {
          primary:   "#0D1117",
          secondary: "#161B22",
          tertiary:  "#1C2128",
          overlay:   "#21262D",
        },
        text: {
          primary:   "#E6EDF3",
          secondary: "#8B949E",
          tertiary:  "#484F58",
        },
        accent: {
          green:      "#238636",
          greenDark:  "#1a6128",
          greenDim:   "rgba(35,134,54,0.15)",
          amber:      "#9e6a03",
          amberDim:   "rgba(158,106,3,0.12)",
        },
        border: {
          subtle:   "rgba(240,246,252,0.07)",
          default:  "rgba(240,246,252,0.12)",
          emphasis: "rgba(240,246,252,0.22)",
        },
      },
    },
  },
  plugins: [],
};

export default config;
