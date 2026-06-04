/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        base: "#080c14",
        surface: "#0d1322",
        card: "#111827",
        "card-hover": "#161f30",
        border: "#1e2d45",
        "border-subtle": "#172033",
        accent: {
          teal: "#00d4aa",
          violet: "#7c6ff7",
          blue: "#3b82f6",
          pink: "#f472b6",
        },
        text: {
          primary: "#f0f4ff",
          secondary: "#8b9cba",
          muted: "#4a5a76",
        },
      },
      backgroundImage: {
        "gradient-teal": "linear-gradient(135deg, #00d4aa, #0095ff)",
        "gradient-violet": "linear-gradient(135deg, #7c6ff7, #c471ed)",
        "gradient-card": "linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
      },
      boxShadow: {
        card: "0 4px 24px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.05) inset",
        "glow-teal": "0 0 40px rgba(0, 212, 170, 0.15)",
        "glow-violet": "0 0 40px rgba(124, 111, 247, 0.15)",
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "20px",
      },
      animation: {
        shimmer: "shimmer 2s infinite linear",
        "slide-in": "slideInRight 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "fade-in-up": "fadeInUp 0.4s ease forwards",
      },
    },
  },
  plugins: [],
};
