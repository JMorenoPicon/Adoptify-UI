import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Spinner,
} from '@chakra-ui/react';
import { useColorModeValue } from '@/components/ui/color-mode';
import { Field } from '@/components/ui/field';
import { InputGroup } from '@/components/ui/input-group';
import { toaster, Toaster } from '@/components/ui/toaster';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333/api/v1';

interface User {
  username: string;
  email: string;
}

interface Pet {
  id: string | number;
  name: string;
  breed: string;
  age: number;
  image: string;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', currentPassword: '', password: '' });
  const [errors, setErrors] = useState<{ username?: string; email?: string; password?: string; currentPassword?: string }>({});
  const bg = useColorModeValue('pastelBlue.50', 'gray.800');

  // Cargar datos de usuario y mascotas
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    axios
      .get(`${API_URL}/users/profile`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setUser(res.data);
        setForm({ username: res.data.username, email: res.data.email, password: '', currentPassword: '' });
      });
    axios
      .get(`${API_URL}/pets/mine`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setPets(res.data))
      .finally(() => setLoading(false));
  }, []);

  // Validación similar a register
  const validate = async () => {
    const errs: typeof errors = {};
    if (!form.username) errs.username = 'El nombre es obligatorio';
    else if (form.username.length < 3) errs.username = 'Mínimo 3 caracteres';
    if (!form.email) errs.email = 'El email es obligatorio';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Email no válido';
    if (!form.currentPassword) errs.currentPassword = 'Debes ingresar tu contraseña actual';
    if (form.password && form.password.length < 6) errs.password = 'Mínimo 6 caracteres';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleEdit = () => setEditMode(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!(await validate())) return;
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `${API_URL}/users/profile`,
        {
          username: form.username,
          email: form.email,
          currentPassword: form.currentPassword,
          password: form.password || undefined
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toaster.create({ title: 'Perfil actualizado', type: 'success' });
      setEditMode(false);
      setUser({ username: form.username, email: form.email });
      setForm(f => ({ ...f, currentPassword: '', password: '' })); // Limpia contraseñas tras guardar
    } catch (err: unknown) {
      let msg = 'Error al actualizar';
      if (axios.isAxiosError(err)) {
        msg = (err.response?.data as { message?: string })?.message ?? msg;
      }
      toaster.create({ title: 'Error', description: msg, type: 'error' });
    }
  };

  if (loading) return <Spinner />;

  return (
    <Box maxW="container.md" mx="auto" mt={10} p={6} bg={bg} borderRadius="md" boxShadow="md">
      <Heading mb={6}>Mi Perfil</Heading>
      {/* Sección datos usuario */}
      <Box mb={8}>
        <Heading size="md" mb={4}>Datos de usuario</Heading>
        {editMode ? (
          <Box as="form" onSubmit={e => { e.preventDefault(); handleSave(); }}>
            <Field label="Usuario" mb={3}>
              <InputGroup>
                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  className="chakra-input"
                  autoComplete="off"
                  style={{ background: 'white', border: '1px solid #ccc' }}
                />
              </InputGroup>
              {errors.username && (
                <Text color="red.500" fontSize="sm" mt={1}>{errors.username}</Text>
              )}
            </Field>
            <Field label="Email" mb={3}>
              <InputGroup>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="chakra-input"
                  autoComplete="off"
                  style={{ background: 'white', border: '1px solid #ccc' }}
                />
              </InputGroup>
              {errors.email && (
                <Text color="red.500" fontSize="sm" mt={1}>{errors.email}</Text>
              )}
            </Field>
            <Field label="Contraseña actual" mb={3}>
              <InputGroup>
                <input
                  name="currentPassword"
                  type="password"
                  value={form.currentPassword}
                  onChange={handleChange}
                  className="chakra-input"
                  autoComplete="current-password"
                  style={{ background: 'white', border: '1px solid #ccc' }}
                  required
                />
              </InputGroup>
              {errors.currentPassword && (
                <Text color="red.500" fontSize="sm" mt={1}>{errors.currentPassword}</Text>
              )}
            </Field>
            <Field label="Nueva contraseña" mb={3}>
              <InputGroup>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  className="chakra-input"
                  autoComplete="new-password"
                  style={{ background: 'white', border: '1px solid #ccc' }}
                />
              </InputGroup>
              {errors.password && (
                <Text color="red.500" fontSize="sm" mt={1}>{errors.password}</Text>
              )}
            </Field>
            <Button colorScheme="brand" type="submit" mr={2}>Guardar</Button>
            <Button variant="ghost" onClick={() => setEditMode(false)}>Cancelar</Button>
          </Box>
        ) : (
          <Box>
            <Text><strong>Usuario:</strong> {user?.username}</Text>
            <Text><strong>Email:</strong> {user?.email}</Text>
            <Button mt={4} colorScheme="brand" onClick={handleEdit}>Editar perfil</Button>
          </Box>
        )}
      </Box>
      {/* Sección mascotas */}
      <Box>
        <Heading size="md" mb={4}>Mis mascotas</Heading>
        {pets.length === 0 ? (
          <Text color="gray.500">No tienes mascotas registradas.</Text>
        ) : (
          <SimpleGrid columns={{ base: 1, sm: 2 }} gap={6}>
            {pets.map((pet) => (
              <Box
                key={pet.id}
                bg="pastelBlue.100"
                borderRadius="md"
                boxShadow="md"
                p={4}
                display="flex"
                flexDirection="column"
                alignItems="center"
              >
                <img src={pet.image} alt={pet.name} style={{ width: '100%', borderRadius: '8px', marginBottom: 8 }} />
                <Heading size="sm" mb={1}>{pet.name}</Heading>
                <Text fontSize="sm" color="gray.600">{pet.breed}</Text>
                <Text fontSize="sm" color="gray.600">Edad: {pet.age} años</Text>
                <Button mt={3} colorScheme="brand" size="sm" w="full">
                  Ver detalles
                </Button>
              </Box>
            ))}
          </SimpleGrid>
        )}
      </Box>
      <Toaster />
    </Box>
  );
};

export default Profile;