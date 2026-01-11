import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,tsx,mdx}",
    "./src/components/**/*.{js,ts,tsx,mdx}",
    "./src/app/**/*.{js,ts,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;

