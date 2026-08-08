/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0C0B10", // base background, warm charcoal not pure black
          soft: "#151420",
          raised: "#1D1B29",
        },
        paper: "#F5F1E8", // warm off-white text on dark
        muted: "#8B8794",
        marquee: {
          DEFAULT: "#FF5A36", // cinema accent — ember / film-title warmth
          dim: "#B23E22",
        },
        frequency: {
          DEFAULT: "#A78BFA", // music accent — violet / late-night signal
          dim: "#6D5AC4",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jbmono)", "monospace"],
      },
      backgroundImage: {
        "grain": "radial-gradient(circle at 20% 20%, rgba(255,90,54,0.08), transparent 40%), radial-gradient(circle at 80% 60%, rgba(167,139,250,0.08), transparent 45%)",
      },
      keyframes: {
        "sprocket-scroll": {
          "0%": { backgroundPositionX: "0" },
          "100%": { backgroundPositionX: "40px" },
        },
      },
      animation: {
        "sprocket-scroll": "sprocket-scroll 2s linear infinite",
      },
    },
  },
  plugins: [],
};
