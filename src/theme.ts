// src/theme.ts
import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

// 1) Configuración global de CSS (reemplaza lo que antes ponías en styles.global)
const config = defineConfig({
  globalCss: {
    "html, body": {
      margin: 0,
      minWidth: "320px",
      minHeight: "100vh",
      bg: "white",
      color: "gray.800",
      fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif",
    },
    a: {
      fontWeight: 500,
      color: "accent.500",
      _hover: { color: "accent.600" },
    },
    button: {
      borderRadius: "8px",
      border: "1px solid transparent",
      padding: "0.6em 1.2em",
      fontSize: "1em",
      fontWeight: 500,
      fontFamily: "inherit",
      bg: "brand.500",
      color: "white",
      _hover: { bg: "brand.600" },
      _focus: { outline: "4px auto -webkit-focus-ring-color" },
    },
  },

  // 2) Definición de los tokens de color según tu paleta
  theme: {
    tokens: {
      colors: {
        brand: {
          50:  { value: "#FFF4E6" },
          100: { value: "#FFE5CC" },
          200: { value: "#FFD1A3" },
          300: { value: "#FFB97A" },
          400: { value: "#FF9F52" },
          500: { value: "#FF7F1E" }, // naranja principal
          600: { value: "#E66F1A" },
          700: { value: "#CC5F16" },
          800: { value: "#B34F13" },
          900: { value: "#993F10" },
        },
        pastelBlue: {
          50:  { value: "#E6F2F7" },
          100: { value: "#CCE6EF" },
          200: { value: "#99CDE0" },
          300: { value: "#66B5D1" },
          400: { value: "#339CC2" },
          500: { value: "#007FA8" }, // azul suave
        },
        accent: {
          500: { value: "#1E90FF" }, // enlaces, “Buscar”
          600: { value: "#0057E7" },
        },
        // Los grises y el resto de tokens que no personalices
        // seguirán viniendo de defaultConfig
      },
    },
  },
});

// 3) Crea el sistema y expórtalo al provider
export const system = createSystem(defaultConfig, config);
