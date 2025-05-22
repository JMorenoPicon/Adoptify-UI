import React, { useEffect, useState } from 'react';
import CloudinaryImage from '@/components/multimedia/CloudinaryImage';
import {
  Box,
  Flex,
  Heading,
  Text,
  Image,
  Button,
  SimpleGrid,
  Spinner,
} from '@chakra-ui/react';
import Slider from 'react-slick';
import axios from 'axios';
import { useColorModeValue } from '@/components/ui/color-mode';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333/api/v1';


const news = [
  {
    id: 1,
    title: 'Consejos para cuidar a tu perro en verano',
    image: 'perro-verano_wpyhfb', //publicId de cloudinary
    url: '#',
  },
  {
    id: 2,
    title: 'Cómo preparar a tu gato para la llegada de un bebé',
    image: 'gato-bebe_yvkzsk',
    url: '#',
  },
  {
    id: 3,
    title: 'Beneficios de adoptar en lugar de comprar',
    image: 'adoptar-beneficios_owuem4',
    url: '#',
  },
];

const Index: React.FC = () => {
  const bg = useColorModeValue('pastelBlue.50', 'gray.800');
  const color = useColorModeValue('gray.800', 'gray.100');

  // Estado para datos reales
  const [adoptablePets, setAdoptablePets] = useState([]);
  const [lostPets, setLostPets] = useState([]);
  const [loadingAdoptable, setLoadingAdoptable] = useState(true);
  const [loadingLost, setLoadingLost] = useState(true);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    // Cargar mascotas adoptables
    axios.get(`${API_URL}/pets/adoptable`, { headers })
      .then(res => {
        setAdoptablePets(res.data);
      })
      .catch(err => {
        console.error('Error al cargar mascotas adoptables:', err);
      })
      .finally(() => {
        setLoadingAdoptable(false);
      });

    // Cargar mascotas perdidas
    axios.get(`${API_URL}/pets/lost`, { headers })
      .then(res => {
        setLostPets(res.data);
      })
      .catch(err => {
        console.error('Error al cargar mascotas perdidas:', err);
      })
      .finally(() => {
        setLoadingLost(false);
      });
  }, []);

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

        {/* Carrusel de noticias (fijo, frontend) */}
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
                w="100%"
                h={{ base: '200px', md: '300px' }} // Ajusta la altura según tu diseño
              >
                <CloudinaryImage
                  publicId={image}
                  width={800}
                  height={300}
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

          {loadingAdoptable ? (
            <Spinner />
          ) : (
            <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} gap={6}>
              {adoptablePets.map(({ id, name, breed, birthDate, image }) => {
                // Calcula edad (puedes adaptar según tu modelo)
                const birth = new Date(birthDate);
                const age = new Date().getFullYear() - birth.getFullYear();

                return (
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
                        Edad: {age} años
                      </Text>
                      <Button mt={3} colorScheme="brand" size="sm" w="full">
                        Ver detalles
                      </Button>
                    </Box>
                  </Box>
                );
              })}
            </SimpleGrid>
          )}
        </Box>

        {/* Avisos de mascotas perdidas */}
        <Box>
          <Heading size="md" mb={6}>
            Avisos de mascotas perdidas
          </Heading>

          {loadingLost ? (
            <Spinner />
          ) : (
            <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} gap={6}>
              {lostPets.map(({ id, name, lastSeen, dateReported, image }) => (
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
                      Fecha: {new Date(dateReported).toLocaleDateString()}
                    </Text>
                    <Button mt={3} colorScheme="brand" size="sm" w="full">
                      Más información
                    </Button>
                  </Box>
                </Box>
              ))}
            </SimpleGrid>
          )}
        </Box>
      </Box>
    </Flex>
  );
};

export default Index;
