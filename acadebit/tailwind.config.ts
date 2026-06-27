import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        card: "var(--card)",
        card2: "var(--card2)",
        border: "var(--border)",
        "ac-green": "var(--green)",
        "ac-blue": "var(--blue)",
        "ac-purple": "var(--purple)",
        "ac-teal": "var(--teal)",
        "ac-amber": "var(--amber)",
        "ac-red": "var(--red)",
        "ac-orange": "var(--orange)",
        "ac-pink": "var(--pink)",
        "ac-indigo": "var(--indigo)",
      },
      borderRadius: {
        card: "13px",
        pill: "100px",
      },
      boxShadow: {
        card: "0 8px 32px rgba(0,0,0,.4)",
        glow: "0 0 20px rgba(34,197,94,.3)",
      },
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
        mono: ["DM Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
