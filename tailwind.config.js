/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Paleta Dupla Do Açaí - inspirada na identidade roxo/amarelo/verde
        acai: {
          950: "#2B0A3D", // roxo quase preto, fundo de seções escuras
          900: "#3A0F52",
          800: "#4B1568",
          700: "#5E1D80",
          600: "#7A2BA3", // roxo principal
          500: "#9440C0",
          400: "#B26AD4",
          300: "#D19EE6",
          200: "#E4C2F1",
          100: "#F3E6FA",
        },
        sun: {
          600: "#E8A400",
          500: "#FFC933", // amarelo de destaque / CTA
          400: "#FFD966",
          300: "#FFE9A3",
        },
        berry: {
          600: "#B01458", // rosa/pink da fita "DO" e do banner do cardápio
          500: "#D91C6E",
          400: "#F0468F",
        },
        leaf: {
          700: "#2F6B3A",
          500: "#4C9A4A", // verde das folhas
          300: "#8FC98D",
        },
        cream: "#FFFBF3",
        ink: "#241033",
      },
      fontFamily: {
        display: ["'Baloo 2'", "cursive"],
        body: ["'Nunito Sans'", "sans-serif"],
      },
      fontWeight: {
        400: "400",
        600: "600",
        700: "700",
        800: "800",
      },
      boxShadow: {
        soft: "0 10px 30px -10px rgba(43, 10, 61, 0.25)",
        card: "0 8px 24px -8px rgba(43, 10, 61, 0.35)",
      },
      borderRadius: {
        blob: "63% 37% 54% 46% / 45% 41% 59% 55%",
      },
      keyframes: {
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-14px) rotate(4deg)" },
        },
        popIn: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        floatSlow: "floatSlow 6s ease-in-out infinite",
        popIn: "popIn 0.25s ease-out",
        slideInRight: "slideInRight 0.3s ease-out",
      },
    },
  },
  plugins: [],
};
