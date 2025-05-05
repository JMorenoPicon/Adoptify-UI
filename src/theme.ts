// src/theme.ts
import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const customConfig = defineConfig({
  // Definimos estilos globales aquí
  globalCss: {
    "html, body": {
      margin: 0,
      minWidth: "320px",
      minHeight: "100vh",
      bg: "#242424",       // fondo oscuro por defecto
      color: "rgba(255,255,255,0.87)",
      fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif",
    },
    a: {
      fontWeight: 500,
      color: "#646cff",
      _hover: { color: "#535bf2" },
    },
    button: {
      borderRadius: "8px",
      border: "1px solid transparent",
      padding: "0.6em 1.2em",
      fontSize: "1em",
      fontWeight: 500,
      fontFamily: "inherit",
      bg: "#1a1a1a",
      _hover: { borderColor: "#646cff" },
      _focus: { outline: "4px auto -webkit-focus-ring-color" },
    },
  },
});

export const system = createSystem(defaultConfig, customConfig);
