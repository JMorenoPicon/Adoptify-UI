// src/views/Index.tsx
import React from 'react';
import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { useColorModeValue } from '@/components/ui/color-mode';

const Index: React.FC = () => {
  // Fondo suave para el área de contenido
  const bg = useColorModeValue('pastelBlue.50', 'gray.800');
  // Color de texto principal
  const color = useColorModeValue('gray.800', 'gray.100');

  return (
    <Flex
      direction="column"
      minH="100vh"
      bg={bg}
      color={color}
      align="center"
      pt={16}      // espacio para navbar fijo (cuando lo agregues)
      pb={16}      // espacio para footer fijo
    >
      <Box
        flex="1"
        w="full"
        maxW="container.xl"
        px={4}
        py={8}
      >
        {/* Aquí irá el contenido principal */}
        <Heading mb={4} textAlign="center" color="brand.600">
          Bienvenido de nuevo
        </Heading>
        <Text textAlign="center" color="gray.600">
          Esta es tu área privada. Pronto podrás ver aquí estadísticas, acceso rápido
          a tus mascotas, mensajes y mucho más.
        </Text>
      </Box>
      {/* Cuando añadas el footer fijo, lo puedes poner aquí */}
    </Flex>
  );
};

export default Index;
