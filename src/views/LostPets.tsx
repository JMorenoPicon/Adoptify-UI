import React, { useEffect, useState } from 'react';
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
import { NativeSelectRoot, NativeSelectField } from '@/components/ui/native-select';
import { useColorModeValue } from '@/components/ui/color-mode';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Pet {
    _id: string;
    name: string;
    species: string;
    breed: string;
    birthDate: string;
    city: string;
    image: string;
    status: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333/api/v1';

const LostPets: React.FC = () => {
    const bg = useColorModeValue('pastelBlue.50', 'gray.800');
    const color = useColorModeValue('gray.800', 'gray.100');
    const navigate = useNavigate();

    const [pets, setPets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState(true);

    // Filtros
    const [species, setSpecies] = useState('');
    const [breed, setBreed] = useState('');
    const [age, setAge] = useState('');
    const [city, setCity] = useState('');
    const [cityOptions, setCityOptions] = useState<string[]>([]);

    // Opciones dinámicas
    const [speciesOptions, setSpeciesOptions] = useState<string[]>([]);
    const [breedOptions, setBreedOptions] = useState<string[]>([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        setLoading(true);
        axios
            .get(`${API_URL}/pets/lost`, { headers })
            .then(res => {
                setPets(res.data);

                // Agrupar especies ignorando mayúsculas/minúsculas y capitalizar
                const uniqueSpecies = [
                    ...new Set(res.data.map((p: Pet) => p.species.trim().toLowerCase()))
                ] as string[];
                setSpeciesOptions(
                    uniqueSpecies.map(
                        (s) => s.charAt(0).toUpperCase() + s.slice(1)
                    )
                );

                // Agrupar razas ignorando mayúsculas/minúsculas y capitalizar
                const uniqueBreeds = [
                    ...new Set(res.data.map((p: Pet) => p.breed.trim().toLowerCase()))
                ] as string[];
                setBreedOptions(
                    uniqueBreeds.map(
                        (b: string) => b.charAt(0).toUpperCase() + b.slice(1)
                    )
                );
                // Opciones de ciudad
                setCityOptions([...new Set(res.data.map((p: Pet) => p.city))] as string[]);
            })
            .catch(err => {
                console.error('Error al cargar mascotas perdidas:', err);
            })
            .finally(() => setLoading(false));
    }, []);

    // Filtros aplicados
    const filteredPets = pets.filter(pet => {
        const birth = new Date(pet.birthDate);
        const now = new Date();
        const petAge = now.getFullYear() - birth.getFullYear();
        return (
            (species ? pet.species.trim().toLowerCase() === species.toLowerCase() : true) &&
            (breed ? pet.breed.trim().toLowerCase() === breed.toLowerCase() : true) &&
            (age ? String(petAge) === age : true) &&
            (city ? pet.city === city : true)
        );
    });

    // Opciones de edad dinámicas
    const ageOptions = Array.from(
        new Set(pets.map(pet => (new Date().getFullYear() - new Date(pet.birthDate).getFullYear()).toString()))
    );

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
            <Box w="full" maxW="container.xl" mb={6}>
                <Heading mb={4} textAlign="center" color="brand.600">
                    Mascotas perdidas
                </Heading>
                <Box mb={6} display="flex" flexWrap="wrap" gap={4} justifyContent="center">
                    <NativeSelectRoot>
                        <NativeSelectField
                            items={speciesOptions.map(opt => ({ value: opt, label: opt }))}
                            value={species}
                            onChange={e => setSpecies(e.target.value)}
                            placeholder="Filtrar por especie"
                        />
                    </NativeSelectRoot>
                    <NativeSelectRoot>
                        <NativeSelectField
                            items={breedOptions.map(opt => ({ value: opt, label: opt }))}
                            value={breed}
                            onChange={e => setBreed(e.target.value)}
                            placeholder="Filtrar por raza"
                        />
                    </NativeSelectRoot>
                    <NativeSelectRoot>
                        <NativeSelectField
                            items={ageOptions.map(opt => ({ value: opt, label: `${opt} años` }))}
                            value={age}
                            onChange={e => setAge(e.target.value)}
                            placeholder="Filtrar por edad"
                        />
                    </NativeSelectRoot>
                    <NativeSelectRoot>
                        <NativeSelectField
                            items={cityOptions.map(opt => ({ value: opt, label: opt }))}
                            value={city}
                            onChange={e => setCity(e.target.value)}
                            placeholder="Filtrar por ciudad"
                        />
                    </NativeSelectRoot>
                </Box>
                {loading ? (
                    <Spinner />
                ) : (
                    <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} gap={6}>
                        {filteredPets.map(({ _id, name, breed, birthDate, image, city }) => {
                            const birth = new Date(birthDate);
                            const now = new Date();
                            let ageText = "";
                            const years = now.getFullYear() - birth.getFullYear();
                            const months = now.getMonth() - birth.getMonth() + years * 12;
                            const days = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
                            if (years > 0) {
                                ageText = `Edad: ${years} año${years > 1 ? "s" : ""}`;
                            } else if (months > 0) {
                                ageText = `Edad: ${months} mes${months > 1 ? "es" : ""}`;
                            } else {
                                ageText = `Edad: ${days} día${days !== 1 ? "s" : ""}`;
                            }
                            return (
                                <Box
                                    key={_id}
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
                                        objectFit="contain"
                                    />
                                    <Box p={4}>
                                        <Heading size="sm" mb={1} color="brand.600">
                                            {name}
                                        </Heading>
                                        <Text fontSize="sm" color="gray.600">
                                            {breed}
                                        </Text>
                                        <Text fontSize="sm" color="gray.600">
                                            {ageText}
                                        </Text>
                                        <Text fontSize="sm" color="gray.600">
                                            Ciudad: {city}
                                        </Text>
                                        <Button
                                            mt={3}
                                            colorScheme="brand"
                                            size="sm"
                                            w="full"
                                            onClick={() => navigate(`/pets/${_id}`)}
                                        >
                                            Ver detalles
                                        </Button>
                                    </Box>
                                </Box>
                            );
                        })}
                    </SimpleGrid>
                )}
            </Box>
        </Flex>
    );
};

export default LostPets;