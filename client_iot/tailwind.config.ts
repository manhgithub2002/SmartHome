import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        tempProgress: "",
      },
      boxShadow: {
        one: "0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15)",
        two: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
      },
      fontFamily: {
        nunito: "Nunito , sans-serif",
      },
      colors: {
        temp: "#4e73df",
        hum: "#1cc88a",
        light: "#f6c23e",
      },
      Input: {
        activeBg: {
          colorPrimary: "#fdba74",
          colorBgContainer: '#f6ffed',
        }
      }
    },
  },
  plugins: [],
};
export default config;
