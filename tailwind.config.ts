import type { Config } from "tailwindcss";

const config = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
    },
    extend: {
      colors: {
        "custom-black": "#000", // Define a custom black color if needed
      },
      screens: {
        "laptop-sm": "1024px", // Small laptops
        "laptop-md": "1280px", // Medium laptops
        "laptop-lg": "1440px", // Large laptops
        "desktop-sm": "1600px", // Small desktops
        "desktop-md": "1920px", // Medium desktops
        "desktop-lg": "2560px", // Large desktops
        "desktop-xl": "3840px", // Extra large desktops (4K)
      },
      body: {
        backgroundColor: "#000", // Set the background color to black
        color: "#fff", // Optional: set the default text color to white for better contrast
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },

      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
