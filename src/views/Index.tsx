// src/views/Index.tsx
import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Image,
  Button,
  SimpleGrid,
} from '@chakra-ui/react';
import Slider from 'react-slick';
import { useColorModeValue } from '@/components/ui/color-mode';


// Datos de ejemplo (más adelante reemplaza con fetch/axios)
const news = [
  {
    id: 1,
    title: 'Consejos para cuidar a tu perro en verano',
    image: '/images/news1.jpg',
    url: '#',
  },
  {
    id: 2,
    title: 'Cómo preparar a tu gato para la llegada de un bebé',
    image: '/images/news2.jpg',
    url: '#',
  },
  {
    id: 3,
    title: 'Beneficios de adoptar en lugar de comprar',
    image: '/images/news3.jpg',
    url: '#',
  },
];

const adoptablePets = [
  { id: 1, name: 'Max', breed: 'Labrador', age: '3 años', image: '/images/dog1.jpg' },
  { id: 2, name: 'Luna', breed: 'Siamés', age: '2 años', image: '/images/cat1.jpg' },
  { id: 3, name: 'Rocky', breed: 'Bulldog', age: '4 años', image: '/images/dog2.jpg' },
  { id: 4, name: 'Mia', breed: 'Persa', age: '1 año', image: '/images/cat2.jpg' },
];

const lostPets = [
  { id: 1, name: 'Toby', lastSeen: 'Parque Central', date: '2025-05-10', image: '/images/dog3.jpg' },
  { id: 2, name: 'Nina', lastSeen: 'Barrio Norte', date: '2025-05-12', image: '/images/cat3.jpg' },
];

const Index: React.FC = () => {
  const bg = useColorModeValue('pastelBlue.50', 'gray.800');
  const color = useColorModeValue('gray.800', 'gray.100');

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
  };

  return (
    <Flex
      direction="column"
      minH="100vh"
      bg={bg}
      color={color}
      align="center"
      pt={16}
      pb={16}
      px={4}
    >
      <Box w="full" maxW="container.xl" mb={12}>
        <Heading mb={4} textAlign="center" color="brand.600">
          Bienvenido a Pet Finder
        </Heading>
        <Text mb={8} textAlign="center" color="gray.600">
          Explora las últimas noticias, mascotas en adopción y avisos de mascotas perdidas.
        </Text>

        {/* Carrusel de noticias */}
        <Box mb={12}>
          <Slider {...sliderSettings}>
            {news.map(({ id, title, image, url }) => (
              <Box
                key={id}
                pos="relative"
                borderRadius="md"
                overflow="hidden"
                cursor="pointer"
                onClick={() => window.open(url, '_blank')}
              >
                <Image
                  src={image}
                  alt={title}
                  w="full"
                  h={{ base: '200px', md: '300px' }}
                  objectFit="cover"
                />
                <Box
                  pos="absolute"
                  bottom={0}
                  left={0}
                  right={0}
                  bg="rgba(0,0,0,0.5)"
                  color="white"
                  p={4}
                  fontSize={{ base: 'sm', md: 'md' }}
                >
                  {title}
                </Box>
              </Box>
            ))}
          </Slider>
        </Box>

        {/* Últimas mascotas en adopción */}
        <Box mb={12}>
          <Heading size="md" mb={6}>
            Últimas mascotas en adopción
          </Heading>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} gap={6}>
            {adoptablePets.map(({ id, name, breed, age, image }) => (
              <Box
                key={id}
                bg="white"
                borderRadius="md"
                boxShadow="md"
                overflow="hidden"
                _hover={{ boxShadow: 'xl' }}
              >
                <Image
                  src={image}
                  alt={name}
                  w="full"
                  h="200px"
                  objectFit="cover"
                />
                <Box p={4}>
                  <Heading size="sm" mb={1} color="brand.600">
                    {name}
                  </Heading>
                  <Text fontSize="sm" color="gray.600">
                    {breed}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Edad: {age}
                  </Text>
                  <Button mt={3} colorScheme="brand" size="sm" w="full">
                    Ver detalles
                  </Button>
                </Box>
              </Box>
            ))}
          </SimpleGrid>
        </Box>

        {/* Avisos de mascotas perdidas */}
        <Box>
          <Heading size="md" mb={6}>
            Avisos de mascotas perdidas
          </Heading>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} gap={6}>
            {lostPets.map(({ id, name, lastSeen, date, image }) => (
              <Box
                key={id}
                bg="white"
                borderRadius="md"
                boxShadow="md"
                overflow="hidden"
                _hover={{ boxShadow: 'xl' }}
              >
                <Image
                  src={image}
                  alt={name}
                  w="full"
                  h="200px"
                  objectFit="cover"
                />
                <Box p={4}>
                  <Heading size="sm" mb={1} color="brand.600">
                    {name}
                  </Heading>
                  <Text fontSize="sm" color="gray.600">
                    Última vez visto: {lastSeen}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Fecha: {new Date(date).toLocaleDateString()}
                  </Text>
                  <Button mt={3} colorScheme="brand" size="sm" w="full">
                    Más información
                  </Button>
                </Box>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      </Box>
    </Flex>
  );
};

export default Index;
