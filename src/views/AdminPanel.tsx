import React, { useEffect, useState, useMemo } from 'react';
import { Box, Heading, Spinner, Button, Flex } from '@chakra-ui/react';
import {
  TabsRoot,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@/components/ui/tabs';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@/components/ui/simple-table';
import axios from 'axios';
import { toaster } from '@/components/ui/toaster';
import { useColorModeValue } from '@/components/ui/color-mode';
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogCloseTrigger,
} from '@/components/ui/dialog';

const API_URL = import.meta.env.VITE_API_URL;

type User = {
  _id: string;
  username: string;
  email: string;
  role: string;
};

type Pet = {
  _id: string;
  name: string;
  species: string;
  owner: { username?: string } | string;
};

type Comment = {
  _id: string;
  content: string;
  author: { username?: string } | string;
  pet: { _id: string; name?: string } | string;
};

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [petToDelete, setPetToDelete] = useState<Pet | null>(null);
  const [petDeleteModalOpen, setPetDeleteModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<Comment | null>(null);
  const [commentDeleteModalOpen, setCommentDeleteModalOpen] = useState(false);

  const bg = useColorModeValue('pastelBlue.50', 'gray.800');
  const color = useColorModeValue('gray.800', 'gray.100');

  const token = localStorage.getItem('token');
  const headers = useMemo(
    () => ({ Authorization: `Bearer ${token}` }),
    [token]
  );

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [usersRes, petsRes, commentsRes] = await Promise.all([
        axios.get(`${API_URL}/users`, { headers }),
        axios.get(`${API_URL}/pets`, { headers }),
        axios.get(`${API_URL}/comments`, { headers }),
      ]);
      setUsers(usersRes.data);
      setPets(petsRes.data);
      setComments(commentsRes.data);
    } catch {
      toaster.create({ title: 'Error loading admin data', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headers]);

  const handleDeleteUser = async (id: string) => {
    await axios.delete(`${API_URL}/users/${id}`, { headers });
    toaster.create({ title: 'Usuario eliminado', type: 'success' });
    fetchAdminData();
  };
  const handleDeletePet = async (id: string) => {
    await axios.delete(`${API_URL}/pets/${id}`, { headers });
    toaster.create({ title: 'Mascota eliminada', type: 'success' });
    fetchAdminData();
  };
  const handleDeleteComment = async (petId: string, commentId: string) => {
    await axios.delete(`${API_URL}/comments/${petId}/${commentId}`, { headers });
    toaster.create({ title: 'Comentario eliminado', type: 'success' });
    fetchAdminData();
  };

  const openDeleteModal = (user: User) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setUserToDelete(null);
    setDeleteModalOpen(false);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    await handleDeleteUser(userToDelete._id);
    closeDeleteModal();
  };

  // Funciones para abrir/cerrar modales:
  const openDeletePetModal = (pet: Pet) => {
    setPetToDelete(pet);
    setPetDeleteModalOpen(true);
  };
  const closeDeletePetModal = () => {
    setPetToDelete(null);
    setPetDeleteModalOpen(false);
  };
  const confirmDeletePet = async () => {
    if (!petToDelete) return;
    await handleDeletePet(petToDelete._id);
    closeDeletePetModal();
  };

  const openDeleteCommentModal = (comment: Comment) => {
    setCommentToDelete(comment);
    setCommentDeleteModalOpen(true);
  };
  const closeDeleteCommentModal = () => {
    setCommentToDelete(null);
    setCommentDeleteModalOpen(false);
  };
  const confirmDeleteComment = async () => {
    if (!commentToDelete) return;
    const petId = typeof commentToDelete.pet === 'object'
      ? commentToDelete.pet._id
      : commentToDelete.pet;
    await handleDeleteComment(petId, commentToDelete._id);
    closeDeleteCommentModal();
  };

  if (loading) return (
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
      <Spinner />
    </Flex>
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
      <Box
        w="full"
        maxW="container.xl"
        bg="white"
        borderRadius="md"
        boxShadow="md"
        p={6}
        mb={6}
      >
        <Heading mb={6} color="brand.600" textAlign="center">
          Admin Panel
        </Heading>
        <TabsRoot>
          <TabList>
            <Tab selected={tab === 0} onClick={() => setTab(0)}>Usuarios</Tab>
            <Tab selected={tab === 1} onClick={() => setTab(1)}>Mascotas</Tab>
            <Tab selected={tab === 2} onClick={() => setTab(2)}>Comentarios</Tab>
          </TabList>
          <TabPanels>
            <TabPanel hidden={tab !== 0}>
              <Table>
                <Thead>
                  <Tr>
                    <Th>Username</Th>
                    <Th>Email</Th>
                    <Th>Role</Th>
                    <Th>Acciones</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {users.map(user => (
                    <Tr key={user._id}>
                      <Td>{user.username}</Td>
                      <Td>{user.email}</Td>
                      <Td>{user.role}</Td>
                      <Td>
                        {user.role !== 'admin' && (
                          <Button
                            colorScheme="red"
                            size="sm"
                            onClick={() => openDeleteModal(user)}
                          >
                            Eliminar
                          </Button>
                        )}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TabPanel>
            <TabPanel hidden={tab !== 1}>
              <Table>
                <Thead>
                  <Tr>
                    <Th>Nombre</Th>
                    <Th>Especie</Th>
                    <Th>Dueño</Th>
                    <Th>Acciones</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {pets.map(pet => (
                    <Tr key={pet._id}>
                      <Td>{pet.name}</Td>
                      <Td>{pet.species}</Td>
                      <Td>{typeof pet.owner === 'object' ? pet.owner.username : pet.owner}</Td>
                      <Td>
                        <Button colorScheme="red" size="sm" onClick={() => openDeletePetModal(pet)}>
                          Eliminar
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TabPanel>
            <TabPanel hidden={tab !== 2}>
              <Table>
                <Thead>
                  <Tr>
                    <Th>Comentario</Th>
                    <Th>Autor</Th>
                    <Th>Mascota</Th>
                    <Th>Acciones</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {comments.map(comment => (
                    <Tr key={comment._id}>
                      <Td>{comment.content}</Td>
                      <Td>{typeof comment.author === 'object' ? comment.author.username : comment.author}</Td>
                      <Td>{typeof comment.pet === 'object' ? comment.pet.name : comment.pet}</Td>
                      <Td>
                        <Button
                          colorScheme="red"
                          size="sm"
                          onClick={() => openDeleteCommentModal(comment)}
                        >
                          Eliminar
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TabPanel>
          </TabPanels>
        </TabsRoot>
        {/* Modal de confirmación de borrado de usuario */}
        <DialogRoot open={deleteModalOpen} onOpenChange={d => setDeleteModalOpen(d.open)}>
          <DialogContent>
            <DialogHeader color="red.600">Eliminar usuario</DialogHeader>
            <DialogBody>
              ¿Seguro que quieres eliminar a <strong>{userToDelete?.username}</strong>?<br />
              <span style={{ color: "#E53E3E" }}>
                Esta acción eliminará también todas sus mascotas y comentarios. Esta acción no se puede deshacer.
              </span>
            </DialogBody>
            <DialogFooter>
              <Button colorScheme="red" mr={3} onClick={confirmDeleteUser}>
                Eliminar
              </Button>
              <DialogCloseTrigger asChild>
                <Button variant="ghost" onClick={closeDeleteModal}>
                  Cancelar
                </Button>
              </DialogCloseTrigger>
            </DialogFooter>
          </DialogContent>
        </DialogRoot>

        {/* Modal de confirmación de borrado de mascota */}
        <DialogRoot open={petDeleteModalOpen} onOpenChange={d => setPetDeleteModalOpen(d.open)}>
          <DialogContent>
            <DialogHeader color="red.600">Eliminar mascota</DialogHeader>
            <DialogBody>
              ¿Seguro que quieres eliminar a <strong>{petToDelete?.name}</strong>?<br />
              <span style={{ color: "#E53E3E" }}>
                Esta acción eliminará la mascota de la base de datos. Esta acción no se puede deshacer.
              </span>
            </DialogBody>
            <DialogFooter>
              <Button colorScheme="red" mr={3} onClick={confirmDeletePet}>
                Eliminar
              </Button>
              <DialogCloseTrigger asChild>
                <Button variant="ghost" onClick={closeDeletePetModal}>
                  Cancelar
                </Button>
              </DialogCloseTrigger>
            </DialogFooter>
          </DialogContent>
        </DialogRoot>

        {/* Modal de confirmación de borrado de comentario */}
        <DialogRoot open={commentDeleteModalOpen} onOpenChange={d => setCommentDeleteModalOpen(d.open)}>
          <DialogContent>
            <DialogHeader color="red.600">Eliminar comentario</DialogHeader>
            <DialogBody>
              ¿Seguro que quieres eliminar este comentario?<br />
              <span style={{ color: "#E53E3E" }}>
                Esta acción eliminará el comentario de la base de datos. Esta acción no se puede deshacer.
              </span>
            </DialogBody>
            <DialogFooter>
              <Button colorScheme="red" mr={3} onClick={confirmDeleteComment}>
                Eliminar
              </Button>
              <DialogCloseTrigger asChild>
                <Button variant="ghost" onClick={closeDeleteCommentModal}>
                  Cancelar
                </Button>
              </DialogCloseTrigger>
            </DialogFooter>
          </DialogContent>
        </DialogRoot>
      </Box>
    </Flex>
  );
};

export default AdminPanel;