// src/components/ui/provider.tsx
import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { system } from "@/theme";

export const Provider: React.FC<{children: React.ReactNode}> = ({ children }) => (
  <ChakraProvider value={system}>
    {children}
  </ChakraProvider>
);
