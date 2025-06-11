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

const API_URL = import.meta.env.VITE_API_URL;

type User = { _id: string; username: string; email: string; role: string };
type Pet = { _id: string; name: string; species: string; owner: { username?: string } | string };
type Comment = { _id: string; content: string; author: { username?: string } | string; pet: { name?: string } | string };

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);
  const bg = useColorModeValue('pastelBlue.50', 'gray.800');
  const color = useColorModeValue('gray.800', 'gray.100');

  const token = localStorage.getItem('token');
  const headers = useMemo(
    () => ({ Authorization: `Bearer ${token}` }),
    [token]
  );

  useEffect(() => {
    setLoading(true);
    Promise.all([
      axios.get(`${API_URL}/admin/users`, { headers }),
      axios.get(`${API_URL}/admin/pets`, { headers }),
      axios.get(`${API_URL}/admin/comments`, { headers }),
    ])
      .then(([usersRes, petsRes, commentsRes]) => {
        setUsers(usersRes.data);
        setPets(petsRes.data);
        setComments(commentsRes.data);
      })
      .catch(() => toaster.create({ title: 'Error loading admin data', type: 'error' }))
      .finally(() => setLoading(false));
  }, [headers]);

  const handleDeleteUser = async (id: string) => {
    await axios.delete(`${API_URL}/admin/users/${id}`, { headers });
    setUsers(users.filter(u => u._id !== id));
    toaster.create({ title: 'User deleted', type: 'success' });
  };
  const handleDeletePet = async (id: string) => {
    await axios.delete(`${API_URL}/admin/pets/${id}`, { headers });
    setPets(pets.filter(p => p._id !== id));
    toaster.create({ title: 'Pet deleted', type: 'success' });
  };
  const handleDeleteComment = async (id: string) => {
    await axios.delete(`${API_URL}/admin/comments/${id}`, { headers });
    setComments(comments.filter(c => c._id !== id));
    toaster.create({ title: 'Comment deleted', type: 'success' });
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
                        <Button colorScheme="red" size="sm" onClick={() => handleDeleteUser(user._id)}>Eliminar</Button>
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
                        <Button colorScheme="red" size="sm" onClick={() => handleDeletePet(pet._id)}>Eliminar</Button>
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
                        <Button colorScheme="red" size="sm" onClick={() => handleDeleteComment(comment._id)}>Eliminar</Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TabPanel>
          </TabPanels>
        </TabsRoot>
      </Box>
    </Flex>
  );
};

export default AdminPanel;