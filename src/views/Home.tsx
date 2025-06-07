// src/views/Home.tsx
import React from 'react';
import {
    Box,
    Flex,
    Heading,
    Text,
    Button,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useColorModeValue } from '@/components/ui/color-mode';

const Home: React.FC = () => {
    // Capa de superposición más clara en light y dark modes
  const overlayBg = useColorModeValue(
    'rgba(255, 255, 255, 0.3)',
    'rgba(0,0,0,0.4)'
  );
  // Título en naranja de brand, texto en gris oscuro o claro
  const headingColor = useColorModeValue('brand.600', 'brand.200');
  const textColor = useColorModeValue('gray.800', 'gray.200');

    return (
        <Box position="relative" h="100vh" w="full" overflow="hidden">
            {/* Imagen de fondo */}
            <Box
                position="absolute"
                top={0}
                left={0}
                w="full"
                h="full"
                backgroundImage="url('https://res.cloudinary.com/dvgooco4p/image/upload/homeImage_daqapm.png')"
                backgroundRepeat="no-repeat"
                backgroundPosition="left-center"
                backgroundSize="auto 100%"
                zIndex={0}
            />

            {/* Capa de superposición para contraste */}
            <Box
                position="absolute"
                top={0}
                left={0}
                w="full"
                h="full"
                bg={overlayBg}
                zIndex={1}
            />

            {/* Contenido centrado */}
            <Flex
                position="relative"
                zIndex={2}
                direction="column"
                align="center"
                justify="center"
                textAlign="center"
                px={4}
                h="full"
            >
                <Heading color={headingColor} size="2xl" mb={4}>
                    Bienvenido a Pet Finder
                </Heading>
                <Text color={textColor} fontSize="lg" maxW="lg" mb={8}>
                    Encuentra a tu compañero perfecto: explora perfiles de perros y gatos
                    en adopción, conecta con refugios locales y haz que cada patita encuentre
                    un hogar lleno de amor.
                </Text>
                <Flex gap={4}>
                    <RouterLink to="/auth/login">
                        <Button colorScheme="brand" size="lg">
                            Iniciar Sesión
                        </Button>
                    </RouterLink>
                    <RouterLink to="/auth/register">
                        <Button variant="outline" colorScheme="brand" size="lg">
                            Registrarse
                        </Button>
                    </RouterLink>
                </Flex>

            </Flex>
        </Box>
    );
};

export default Home;
