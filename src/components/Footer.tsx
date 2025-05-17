// src/components/Footer.tsx
import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { useColorModeValue } from '@/components/ui/color-mode';

const Footer: React.FC = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.300');

  return (
    <Box
      as="footer"
      bg={bgColor}
      color={textColor}
      py={4}
      textAlign="center"
      position="relative"
      bottom={0}
      width="full"
    >
      <Text fontSize="sm" mb={1}>
        &copy; {new Date().getFullYear()} Pet Finder. Todos los derechos reservados.
      </Text>
      <Text fontSize="sm">
        <a
          href="https://github.com/JMorenoPicon"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'teal', textDecoration: 'underline' }}
        >
          Ver en GitHub
        </a>
      </Text>
    </Box>
  );
};

export default Footer;
