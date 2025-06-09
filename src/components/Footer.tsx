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
      h='64px'
      minH='64px'
      py={0}
      textAlign="center"
      position="relative"
      width="100vw"
      zIndex={10}
      boxShadow="0 -2px 8px rgba(0,0,0,0.04)"
      display="flex"
      flexDirection="column"
      justifyContent="center"
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
        <span style={{ margin: '0 12px' }}>|</span>
        <a
          href="https://petfinder-backend-nse4.onrender.com/api-docs"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'teal', textDecoration: 'underline' }}
        >
          API (Swagger)
        </a>
      </Text>
    </Box>
  );
};

export default Footer;
