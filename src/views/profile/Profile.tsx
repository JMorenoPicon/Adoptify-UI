import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Spinner,
} from '@chakra-ui/react';
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogCloseTrigger,
} from '@/components/ui/dialog';
import { useColorModeValue } from '@/components/ui/color-mode';
import { Field } from '@/components/ui/field';
import { InputGroup } from '@/components/ui/input-group';
import { toaster, Toaster } from '@/components/ui/toaster';
import axios from 'axios';

const initialPetForm = {
  name: '',
  species: '',
  breed: '',
  birthDate: '',
  description: '',
  image: null as File | null,
  status: 'available',
  lastSeen: '',
  reservedAt: '',
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333/api/v1';

interface User {
  username: string;
  email: string;
}

interface Pet {
  _id: string;
  name: string;
  breed: string;
  birthDate: Date;
  age: number;
  image: string;
  status?: string;
  lastSeen?: string;
  reservedAt?: string;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', currentPassword: '', password: '' });
  const [errors, setErrors] = useState<{ username?: string; email?: string; password?: string; currentPassword?: string }>({});
  const bg = useColorModeValue('pastelBlue.50', 'gray.800');
  const [showPetModal, setShowPetModal] = useState(false);
  const [petForm, setPetForm] = useState(initialPetForm);
  const [petFormErrors, setPetFormErrors] = useState<{ [k: string]: string }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [petToDelete, setPetToDelete] = useState<Pet | null>(null);

  const openDeleteModal = (pet: Pet) => {
    setPetToDelete(pet);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setPetToDelete(null);
    setDeleteModalOpen(false);
  };

  const confirmDeletePet = async () => {
    if (petToDelete) {
      await handleDeletePet(petToDelete._id);
      closeDeleteModal();
    }
  };

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

  // --- Mascotas ---

  const handlePetFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target;
    const name = target.name;
    let value: string | File | null = '';
    if (target instanceof HTMLInputElement && target.type === 'file') {
      value = target.files && target.files[0] ? target.files[0] : null;
      setPetForm(f => ({ ...f, [name]: value }));
    } else {
      value = target.value;
      setPetForm(f => ({ ...f, [name]: value }));
    }
  };

  const validatePetForm = () => {
    const errs: { [k: string]: string } = {};
    if (!petForm.name) errs.name = 'El nombre es obligatorio';
    if (!petForm.species) errs.species = 'La especie es obligatoria';
    if (!petForm.breed) errs.breed = 'La raza es obligatoria';
    else if (new Date(petForm.birthDate) > new Date()) errs.birthDate = 'La fecha no puede ser futura';
    if (!petForm.birthDate) errs.birthDate = 'La fecha de nacimiento es obligatoria';
    if (!petForm.description) errs.description = 'La descripción es obligatoria';
    if (!petForm.image) errs.image = 'La imagen es obligatoria';
    if (!petForm.status) errs.status = 'El estado es obligatorio';
    if (petForm.status === 'lost' && !petForm.lastSeen) errs.lastSeen = 'Este campo es obligatorio';
    if (petForm.status === 'reserved' && !petForm.reservedAt) errs.reservedAt = 'Este campo es obligatorio';
    setPetFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePetFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePetForm()) return;
    const token = localStorage.getItem('token');
    if (!token) return;

    let imageBase64 = '';
    if (petForm.image) {
      imageBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(petForm.image as File);
      });
    }

    try {
      await axios.post(`${API_URL}/pets`, {
        name: petForm.name,
        species: petForm.species,
        breed: petForm.breed,
        birthDate: petForm.birthDate,
        description: petForm.description,
        image: imageBase64,
        status: petForm.status === 'reserved' ? 'reserved' : petForm.status,
        lastSeen: petForm.status === 'lost' ? petForm.lastSeen : undefined,
        reservedAt: petForm.status === 'reserved' ? petForm.reservedAt : undefined,
      }, { headers: { Authorization: `Bearer ${token}` } });
      toaster.create({ title: 'Mascota registrada', type: 'success' });
      setShowPetModal(false);
      setPetForm(initialPetForm);
      // Recarga mascotas
      const petsRes = await axios.get(`${API_URL}/pets/mine`, { headers: { Authorization: `Bearer ${token}` } });
      setPets(petsRes.data);
    } catch (err: unknown) {
      toaster.create({ title: 'Error', description: 'No se pudo registrar la mascota', type: `error: ${err}` });
    }
  };

  const handleDeletePet = async (petId: string | number) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      await axios.delete(`${API_URL}/pets/${petId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toaster.create({ title: 'Mascota eliminada', type: 'success' });
      // Recarga mascotas
      const petsRes = await axios.get(`${API_URL}/pets/mine`, { headers: { Authorization: `Bearer ${token}` } });
      setPets(petsRes.data);
    } catch (err) {
      toaster.create({ title: 'Error', description: `No se pudo eliminar la mascota: ${err}, ${petId}`, type: 'error' });
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
            <Button variant="ghost"
              bg="brand.500"
              color="white"
              _hover={{ bg: "white", color: "brand.500", border: "1px solid", borderColor: "brand.500" }}
              onClick={() => setEditMode(false)}>Cancelar</Button>
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
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
          <Heading size="md">Mis mascotas</Heading>
          <Button colorScheme="brand" size="sm" onClick={() => setShowPetModal(true)}>
            Añadir mascota
          </Button>
        </Box>
        {/* Modal para añadir mascota */}
        {showPetModal && (
          <Box
            pos="fixed"
            top={0}
            left={0}
            w="100vw"
            h="100vh"
            bg="blackAlpha.600"
            display="flex"
            alignItems="center"
            justifyContent="center"
            zIndex={1000}
          >
            <Box bg="white" p={6} borderRadius="md" minW="350px" maxW="90vw">
              <Heading size="md" mb={4}>Registrar nueva mascota</Heading>
              <form onSubmit={handlePetFormSubmit}>
                <Field label="Nombre" mb={2}>
                  <InputGroup>
                    <input
                      name="name"
                      value={petForm.name}
                      onChange={handlePetFormChange}
                      className="chakra-input"
                      autoComplete="off"
                      style={{ background: 'white', border: '1px solid #ccc' }}
                    />
                  </InputGroup>
                  {petFormErrors.name && <Text color="red.500" fontSize="sm">{petFormErrors.name}</Text>}
                </Field>
                <Field label="Especie" mb={2}>
                  <InputGroup>
                    <input
                      name="species"
                      value={petForm.species}
                      onChange={handlePetFormChange}
                      className="chakra-input"
                      autoComplete="off"
                      style={{ background: 'white', border: '1px solid #ccc' }}
                    />
                  </InputGroup>
                  {petFormErrors.species && <Text color="red.500" fontSize="sm">{petFormErrors.species}</Text>}
                </Field>
                <Field label="Raza" mb={2}>
                  <InputGroup>
                    <input
                      name="breed"
                      value={petForm.breed}
                      onChange={handlePetFormChange}
                      className="chakra-input"
                      autoComplete="off"
                      style={{ background: 'white', border: '1px solid #ccc' }}
                    />
                  </InputGroup>
                  {petFormErrors.breed && <Text color="red.500" fontSize="sm">{petFormErrors.breed}</Text>}
                </Field>
                <Field label="Cumpleaños" mb={2}>
                  <InputGroup>
                    <input
                      name="birthDate"
                      type="date"
                      value={petForm.birthDate}
                      onChange={handlePetFormChange}
                      className="chakra-input"
                      style={{ background: 'white', border: '1px solid #ccc' }}
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </InputGroup>
                  {petFormErrors.birthDate && <Text color="red.500" fontSize="sm">{petFormErrors.birthDate}
                  </Text>}
                </Field>
                <Field label="Descripción" mb={2}>
                  <InputGroup>
                    <textarea
                      name="description"
                      value={petForm.description}
                      onChange={handlePetFormChange}
                      className="chakra-input"
                      rows={2}
                      style={{ background: 'white', border: '1px solid #ccc' }}
                    />
                  </InputGroup>
                  {petFormErrors.description && <Text color="red.500" fontSize="sm">{petFormErrors.description}</Text>}
                </Field>
                <Field label="Imagen" mb={2}>
                  <InputGroup>
                    <input
                      name="image"
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handlePetFormChange}
                      className="chakra-input"
                    />
                  </InputGroup>
                  {petFormErrors.image && <Text color="red.500" fontSize="sm">{petFormErrors.image}</Text>}
                </Field>
                <Field label="Estado" mb={2}>
                  <InputGroup>
                    <select
                      name="status"
                      value={petForm.status}
                      onChange={handlePetFormChange}
                      className="chakra-input"
                      style={{ background: 'white', border: '1px solid #ccc' }}
                    >
                      <option value="available">Disponible</option>
                      <option value="reserved">En proceso de adopción</option>
                      <option value="lost">Perdida</option>
                    </select>
                  </InputGroup>
                  {petFormErrors.status && <Text color="red.500" fontSize="sm">{petFormErrors.status}</Text>}
                </Field>
                {petForm.status === 'lost' && (
                  <Field label="Última vez vista" mb={2}>
                    <InputGroup>
                      <input
                        name="lastSeen"
                        value={petForm.lastSeen}
                        onChange={handlePetFormChange}
                        className="chakra-input"
                        autoComplete="off"
                        style={{ background: 'white', border: '1px solid #ccc' }}
                      />
                    </InputGroup>
                    {petFormErrors.lastSeen && <Text color="red.500" fontSize="sm">{petFormErrors.lastSeen}</Text>}
                  </Field>
                )}
                {petForm.status === 'reserved' && (
                  <Field label="Fecha de inicio del proceso" mb={2}>
                    <InputGroup>
                      <input
                        name="reservedAt"
                        type="date"
                        value={petForm.reservedAt}
                        onChange={handlePetFormChange}
                        className="chakra-input"
                        style={{ background: 'white', border: '1px solid #ccc' }}
                      />
                    </InputGroup>
                    {petFormErrors.reservedAt && <Text color="red.500" fontSize="sm">{petFormErrors.reservedAt}</Text>}
                  </Field>
                )}
                <Box mt={4} display="flex" gap={2}>
                  <Button colorScheme="brand" type="submit">Guardar</Button>
                  <Button variant="ghost"
                    bg="brand.500"
                    color="white"
                    _hover={{ bg: "white", color: "brand.500", border: "1px solid", borderColor: "brand.500" }}
                    onClick={() => setShowPetModal(false)}>Cancelar</Button>
                </Box>
              </form>
            </Box>
          </Box>
        )}
        {pets.length === 0 ? (
          <Text color="gray.500">No tienes mascotas registradas.</Text>
        ) : (
          <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} gap={6}>
            {pets.map((pet) => {
              const birth = new Date(pet.birthDate);
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
                  key={pet._id}
                  bg="white"
                  borderRadius="md"
                  boxShadow="md"
                  overflow="hidden"
                  _hover={{ boxShadow: 'xl' }}
                  maxW="250px"
                  w="100%"
                  mx="auto"
                  p={0}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                >
                  <Box w="full" h="200px" bg="gray.50">
                    <img
                      src={pet.image}
                      alt={pet.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        borderRadius: '0',
                        display: 'block',
                      }}
                    />
                  </Box>
                  <Box p={4} w="full">
                    <Heading size="sm" mb={1} color="brand.600">
                      {pet.name}
                    </Heading>
                    <Text fontSize="sm" color="gray.600">
                      {pet.breed}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {ageText}
                    </Text>
                    <Button mt={3} colorScheme="brand" size="sm" w="full">
                      Ver detalles
                    </Button>
                    <Button
                      mt={2}
                      colorScheme="red"
                      size="sm"
                      w="full"
                      onClick={() => openDeleteModal(pet)}
                    >
                      Eliminar
                    </Button>
                  </Box>
                </Box>
              );
            })}
          </SimpleGrid>
        )}
      </Box>
      <DialogRoot
        open={deleteModalOpen} onOpenChange={details => setDeleteModalOpen(details.open)}>
        <DialogContent>
          <DialogHeader>Eliminar mascota</DialogHeader>
          <DialogBody>
            ¿Seguro que quieres eliminar a <strong>{petToDelete?.name}</strong>? Esta acción no se puede deshacer.
          </DialogBody>
          <DialogFooter>
            <Button colorScheme="red" mr={3} onClick={confirmDeletePet}>
              Eliminar
            </Button>
            <DialogCloseTrigger asChild>
              <Button variant="ghost"
                bg="brand.500"
                color="white"
                _hover={{ bg: "white", color: "brand.500", border: "1px solid", borderColor: "brand.500" }}
                onClick={closeDeleteModal}>
                Cancelar
              </Button>
            </DialogCloseTrigger>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
      <Toaster />
    </Box>
  );
};

export default Profile;