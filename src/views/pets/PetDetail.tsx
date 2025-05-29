import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Heading,
  Text,
  Spinner,
  Button,
  Input,
  Flex
} from '@chakra-ui/react';
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogCloseTrigger,
} from '@/components/ui/dialog';
import { Field } from '@/components/ui/field';
import { InputGroup } from '@/components/ui/input-group';
import { toaster, Toaster } from '@/components/ui/toaster';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useColorModeValue } from '@/components/ui/color-mode';
import { MenuRoot, MenuTrigger, MenuContent, MenuItem } from '@/components/ui/menu';
import { FiMoreVertical, FiEdit2, FiTrash2 } from 'react-icons/fi';


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333/api/v1';

const initialEditForm = {
  name: '',
  species: '',
  breed: '',
  birthDate: '',
  description: '',
  image: null as File | string | null,
  status: 'available',
  lastSeen: '',
  reservedAt: '',
};

interface Pet {
  _id: string;
  name: string;
  species: string;
  breed: string;
  birthDate: string;
  description: string;
  image: string;
  status: string;
  lastSeen?: string;
  reservedAt?: string;
  owner: { _id: string } | string;
}

const PetDetail: React.FC = () => {
  const { petId } = useParams<{ petId: string }>();
  const navigate = useNavigate();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState<typeof initialEditForm>(initialEditForm);
  const [editFormErrors, setEditFormErrors] = useState<{ [k: string]: string }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bg = useColorModeValue('pastelBlue.50', 'gray.800');
  const [comments, setComments] = useState<{ _id: string; author: { _id: string; username: string }; content: string; createdAt: string }[]>([]);
  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [editingComment, setEditingComment] = useState<{ _id: string; content: string } | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [commentToDelete, setCommentToDelete] = useState<{ _id: string; content: string } | null>(null);



  // Obtener comentarios de la mascota
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    axios
      .get(`${API_URL}/comments/${petId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setComments(res.data))
      .catch(() => toaster.create({ title: 'Error al cargar comentarios', type: 'error' }));
  }, [petId]);

  // Obtener datos de la mascota y del usuario logueado
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserId(payload.id || payload._id || payload.userId);
    } catch {
      setUserId(null);
    }
    axios
      .get(`${API_URL}/pets/${petId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setPet(res.data))
      .finally(() => setLoading(false));
  }, [petId]);

  // Añadir comentario
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setCommentLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post(
        `${API_URL}/comments/${petId}`,
        { content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments(prev => [res.data, ...prev]);
      setNewComment('');
      toaster.create({ title: 'Comentario publicado', type: 'success' });
    } catch {
      toaster.create({ title: 'Error al comentar', type: 'error' });
    } finally {
      setCommentLoading(false);
    }
  };

  // Editar comentario
  const handleEditComment = (comment: { _id: string; content: string }) => {
    setEditingComment(comment);
    setEditContent(comment.content);
  };

  const handleEditCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingComment || !editContent.trim()) return;
    setEditLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await axios.put(
        `${API_URL}/comments/${petId}/${editingComment._id}`,
        { content: editContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments(prev =>
        prev.map(c => (c._id === editingComment._id ? res.data : c))
      );
      toaster.create({ title: 'Comentario editado', type: 'success' });
      setEditingComment(null);
      setEditContent('');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toaster.create({ title: err.response?.data?.message || 'Error al editar', type: 'error' });
      } else {
        toaster.create({ title: 'Error al editar', type: 'error' });
      }
    }
  };

  // Borrar comentario
  const handleDeleteComment = async () => {
    if (!commentToDelete) return;
    setDeleteLoading(commentToDelete._id);
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${API_URL}/comments/${petId}/${commentToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(prev => prev.filter(c => c._id !== commentToDelete._id));
      toaster.create({ title: 'Comentario eliminado', type: 'success' });
      setCommentToDelete(null);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toaster.create({ title: err.response?.data?.message || 'Error al eliminar', type: 'error' });
      } else {
        toaster.create({ title: 'Error al eliminar', type: 'error' });
      }
    } finally {
      setDeleteLoading(null);
    }
  };

  // Calcular edad
  const getAgeText = (birthDate: string) => {
    const birth = new Date(birthDate);
    const now = new Date();
    const years = now.getFullYear() - birth.getFullYear();
    const months = now.getMonth() - birth.getMonth() + years * 12;
    const days = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    if (years > 0) return `${years} año${years > 1 ? 's' : ''}`;
    if (months > 0) return `${months} mes${months > 1 ? 'es' : ''}`;
    return `${days} día${days !== 1 ? 's' : ''}`;
  };

  // Eliminar mascota
  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    if (!token || !pet) return;
    try {
      await axios.delete(`${API_URL}/pets/${pet._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toaster.create({ title: 'Mascota eliminada', type: 'success' });
      navigate('/profile');
    } catch {
      toaster.create({ title: 'Error al eliminar', type: 'error' });
    }
  };

  // Abrir modal de edición y rellenar datos
  const openEditModal = () => {
    if (!pet) return;
    setEditForm({
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      birthDate: pet.birthDate?.slice(0, 10) || '',
      description: pet.description,
      image: '', // No rellenar por seguridad, solo si se sube una nueva
      status: pet.status,
      lastSeen: pet.lastSeen || '',
      reservedAt: pet.reservedAt ? pet.reservedAt.slice(0, 10) : '',
    });
    setEditFormErrors({});
    setShowEditModal(true);
  };

  // Validación del formulario de edición
  const validateEditForm = () => {
    const errs: { [k: string]: string } = {};
    if (!editForm.name) errs.name = 'El nombre es obligatorio';
    if (!editForm.species) errs.species = 'La especie es obligatoria';
    if (!editForm.breed) errs.breed = 'La raza es obligatoria';
    if (!editForm.birthDate) errs.birthDate = 'La fecha de nacimiento es obligatoria';
    else if (new Date(editForm.birthDate) > new Date()) errs.birthDate = 'La fecha no puede ser futura';
    if (!editForm.description) errs.description = 'La descripción es obligatoria';
    if (editForm.status === 'lost' && !editForm.lastSeen) errs.lastSeen = 'Este campo es obligatorio';
    if (editForm.status === 'reserved' && !editForm.reservedAt) errs.reservedAt = 'Este campo es obligatorio';
    setEditFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Cambios en el formulario de edición
  const handleEditFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    const name = target.name;
    if (target instanceof HTMLInputElement && target.type === 'file') {
      const file = target.files && target.files[0] ? target.files[0] : null;
      setEditForm(f => ({ ...f, [name]: file }));
    } else {
      setEditForm(f => ({ ...f, [name]: target.value }));
    }
  };

  // Guardar cambios de edición
  const handleEditFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEditForm()) return;
    const token = localStorage.getItem('token');
    if (!token || !pet) return;

    let imageBase64: string | undefined = undefined;
    // Solo convertir si es un archivo nuevo
    if (editForm.image && typeof editForm.image !== 'string') {
      imageBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(editForm.image as File);
      });
    }

    try {
      await axios.put(`${API_URL}/pets/${pet._id}`, {
        name: editForm.name,
        species: editForm.species,
        breed: editForm.breed,
        birthDate: editForm.birthDate,
        description: editForm.description,
        // Solo envía image si hay una nueva imagen
        ...(imageBase64 ? { image: imageBase64 } : {}),
        status: editForm.status,
        lastSeen: editForm.status === 'lost' ? editForm.lastSeen : undefined,
        reservedAt: editForm.status === 'reserved' ? editForm.reservedAt : undefined,
      }, { headers: { Authorization: `Bearer ${token}` } });
      toaster.create({ title: 'Mascota actualizada', type: 'success' });
      await new Promise(resolve => setTimeout(resolve, 3000));
      setShowEditModal(false);
      setLoading(true);
      const res = await axios.get(`${API_URL}/pets/${petId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPet(res.data);
      setLoading(false);
    } catch {
      toaster.create({ title: 'Error al actualizar', type: 'error' });
    }
  };

  if (loading) return <Spinner />;

  if (!pet) return <Text>No se encontró la mascota.</Text>;

  const isOwner =
    pet.owner &&
    userId &&
    (typeof pet.owner === 'string'
      ? pet.owner === userId
      : pet.owner._id === userId);

  return (
    <Flex
      direction="column"
      minH="100vh"
      bg={bg}
      align="center"
      pt={16}
      pb={16}
      px={4}
    >
      <Box minH="100vh" bg={bg}>
        <Box maxW="md" mx="auto" mt={10} p={6} bg={'white'} borderRadius="md" boxShadow="md">
          <Button mb={4} onClick={() => navigate(-1)} colorScheme="brand">
            Volver
          </Button>
          <Box display="flex" flexDirection="column" alignItems="center">
            <img
              src={pet.image}
              alt={pet.name}
              style={{
                width: '100%',
                maxWidth: 300,
                height: 200,
                objectFit: 'contain',
                borderRadius: 8,
                marginBottom: 16,
              }}
            />
            <Heading size="lg" mb={2}>{pet.name}</Heading>
            <Text><strong>Especie:</strong> {pet.species}</Text>
            <Text><strong>Raza:</strong> {pet.breed}</Text>
            <Text><strong>Cumpleaños:</strong> {new Date(pet.birthDate).toLocaleDateString()}</Text>
            <Text><strong>Edad:</strong> {getAgeText(pet.birthDate)}</Text>
            <Text><strong>Descripción:</strong> {pet.description}</Text>
            <Text><strong>Estado:</strong> {pet.status === 'available' ? 'Disponible' : pet.status === 'reserved' ? 'En proceso de adopción' : 'Perdida'}</Text>
            {pet.status === 'reserved' && pet.reservedAt && (
              <Text><strong>Fecha de inicio del proceso:</strong> {new Date(pet.reservedAt).toLocaleDateString()}</Text>
            )}
            {pet.status === 'lost' && pet.lastSeen && (
              <Text><strong>Última vez vista:</strong> {pet.lastSeen}</Text>
            )}
            {isOwner && (
              <Box mt={6} display="flex" gap={3}>
                <Button colorScheme="brand" onClick={openEditModal}>
                  Actualizar mascota
                </Button>
                <Button colorScheme="red" onClick={() => setShowDeleteModal(true)}>
                  Eliminar mascota
                </Button>
              </Box>
            )}
          </Box>

          {/* Modal de confirmación de borrado */}
          <DialogRoot open={showDeleteModal} onOpenChange={d => setShowDeleteModal(d.open)}>
            <DialogContent>
              <DialogHeader>Eliminar mascota</DialogHeader>
              <DialogBody>
                ¿Seguro que quieres eliminar a <strong>{pet?.name}</strong>? Esta acción no se puede deshacer.
              </DialogBody>
              <DialogFooter>
                <Button colorScheme="red" mr={3} onClick={handleDelete}>
                  Eliminar
                </Button>
                <DialogCloseTrigger asChild>
                  <Button variant="ghost"
                    bg="brand.500"
                    color="white"
                    _hover={{ bg: "white", color: "brand.500", border: "1px solid", borderColor: "brand.500" }}
                    onClick={() => setShowDeleteModal(false)}>
                    Cancelar
                  </Button>
                </DialogCloseTrigger>
              </DialogFooter>
            </DialogContent>
          </DialogRoot>

          {/* Modal de edición */}
          <DialogRoot open={showEditModal} onOpenChange={d => setShowEditModal(d.open)}>
            <DialogContent>
              <DialogHeader>Actualizar mascota</DialogHeader>
              <DialogBody>
                <form id="edit-pet-form" onSubmit={handleEditFormSubmit}>
                  <Field label="Nombre" mb={2}>
                    <InputGroup>
                      <Input
                        name="name"
                        value={editForm.name}
                        onChange={handleEditFormChange}
                        autoComplete="off"
                      />
                    </InputGroup>
                    {editFormErrors.name && <Text color="red.500" fontSize="sm">{editFormErrors.name}</Text>}
                  </Field>
                  <Field label="Especie" mb={2}>
                    <InputGroup>
                      <Input
                        name="species"
                        value={editForm.species}
                        onChange={handleEditFormChange}
                        autoComplete="off"
                      />
                    </InputGroup>
                    {editFormErrors.species && <Text color="red.500" fontSize="sm">{editFormErrors.species}</Text>}
                  </Field>
                  <Field label="Raza" mb={2}>
                    <InputGroup>
                      <Input
                        name="breed"
                        value={editForm.breed}
                        onChange={handleEditFormChange}
                        autoComplete="off"
                      />
                    </InputGroup>
                    {editFormErrors.breed && <Text color="red.500" fontSize="sm">{editFormErrors.breed}</Text>}
                  </Field>
                  <Field label="Cumpleaños" mb={2}>
                    <InputGroup>
                      <Input
                        name="birthDate"
                        type="date"
                        value={editForm.birthDate}
                        onChange={handleEditFormChange}
                        max={new Date().toISOString().split('T')[0]}
                      />
                    </InputGroup>
                    {editFormErrors.birthDate && <Text color="red.500" fontSize="sm">{editFormErrors.birthDate}</Text>}
                  </Field>
                  <Field label="Descripción" mb={2}>
                    <InputGroup>
                      <textarea
                        name="description"
                        value={editForm.description}
                        onChange={handleEditFormChange}
                        className="chakra-input"
                        rows={2}
                        style={{ background: 'white', border: '1px solid #ccc' }}

                      />
                    </InputGroup>
                    {editFormErrors.description && <Text color="red.500" fontSize="sm">{editFormErrors.description}</Text>}
                  </Field>
                  <Field label="Imagen (deja vacío para no cambiar)" mb={2}>
                    <InputGroup>
                      <input
                        name="image"
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleEditFormChange}
                        className="chakra-input"
                      />
                    </InputGroup>
                  </Field>
                  <Field label="Estado" mb={2}>
                    <InputGroup>
                      <select
                        name="status"
                        value={editForm.status}
                        onChange={handleEditFormChange}
                        className="chakra-input"
                        style={{ background: 'white', border: '1px solid #ccc' }}

                      >
                        <option value="available">Disponible</option>
                        <option value="reserved">En proceso de adopción</option>
                        <option value="lost">Perdida</option>
                      </select>
                    </InputGroup>
                    {editFormErrors.status && <Text color="red.500" fontSize="sm">{editFormErrors.status}</Text>}
                  </Field>
                  {editForm.status === 'lost' && (
                    <Field label="Última vez vista" mb={2}>
                      <InputGroup>
                        <Input
                          name="lastSeen"
                          value={editForm.lastSeen}
                          onChange={handleEditFormChange}
                          autoComplete="off"
                        />
                      </InputGroup>
                      {editFormErrors.lastSeen && <Text color="red.500" fontSize="sm">{editFormErrors.lastSeen}</Text>}
                    </Field>
                  )}
                  {editForm.status === 'reserved' && (
                    <Field label="Fecha de inicio del proceso" mb={2}>
                      <InputGroup>
                        <Input
                          name="reservedAt"
                          type="date"
                          value={editForm.reservedAt}
                          onChange={handleEditFormChange}
                          max={new Date().toISOString().split('T')[0]}
                        />
                      </InputGroup>
                      {editFormErrors.reservedAt && <Text color="red.500" fontSize="sm">{editFormErrors.reservedAt}</Text>}
                    </Field>
                  )}
                </form>
              </DialogBody>
              <DialogFooter>
                <Button
                  colorScheme="brand"
                  type="submit"
                  loading={editLoading}
                  disabled={!editContent.trim()}
                >
                  Guardar cambios
                </Button>
                <DialogCloseTrigger asChild>
                  <Button variant="ghost"
                    bg="brand.500"
                    color="white"
                    _hover={{ bg: "white", color: "brand.500", border: "1px solid", borderColor: "brand.500" }}
                    onClick={() => setShowEditModal(false)}>
                    Cancelar
                  </Button>
                </DialogCloseTrigger>
              </DialogFooter>
            </DialogContent>
          </DialogRoot>

          {/* Modal de confirmacion de eliminacion de comentario */}
          <DialogRoot open={!!commentToDelete} onOpenChange={d => !d.open && setCommentToDelete(null)}>
            <DialogContent>
              <DialogHeader>Eliminar comentario</DialogHeader>
              <DialogBody>
                ¿Seguro que quieres eliminar este comentario?
                <Box mt={2} p={2} bg="gray.50" borderRadius="md">
                  <Text fontSize="sm">{commentToDelete?.content}</Text>
                </Box>
              </DialogBody>
              <DialogFooter>
                <Button
                  colorScheme="red"
                  mr={3}
                  onClick={handleDeleteComment}
                  loading={deleteLoading === commentToDelete?._id}
                >
                  Eliminar
                </Button>
                <DialogCloseTrigger asChild>
                  <Button
                    variant="ghost"
                    bg="brand.500"
                    color="white"
                    _hover={{ bg: "white", color: "brand.500", border: "1px solid", borderColor: "brand.500" }}
                    onClick={() => setCommentToDelete(null)}
                  >
                    Cancelar
                  </Button>
                </DialogCloseTrigger>
              </DialogFooter>
            </DialogContent>
          </DialogRoot>
          {/* Modal de edicion de comentario */}
          <DialogRoot open={!!editingComment} onOpenChange={d => !d.open && setEditingComment(null)}>
            <DialogContent>
              <DialogHeader>Editar comentario</DialogHeader>
              <DialogBody>
                <form onSubmit={handleEditCommentSubmit}>
                  <InputGroup mb={2}>
                    <Input
                      value={editContent}
                      onChange={e => setEditContent(e.target.value)}
                      autoFocus
                    />
                  </InputGroup>
                  <Button
                    colorScheme="brand"
                    type="submit"
                    loading={editLoading}
                    disabled={!editContent.trim()}
                  >
                    Guardar cambios
                  </Button>
                </form>
              </DialogBody>
            </DialogContent>
          </DialogRoot>
          <Toaster />
        </Box>
        {/* Comentarios flotantes */}
        <Box
          maxW="md"
          mx="auto"
          mt={6}
          mb={10}
          p={0}
          position="relative"
          zIndex={1}
          display="flex"
          flexDirection="column"
          alignItems="stretch"
        >
          <Box
            bg="white"
            borderRadius="md"
            boxShadow="lg"
            p={4}
            w="100%"
            minH="200px"
            display="flex"
            flexDirection="column"
            gap={3}
          >
            <Heading size="sm" mb={3}>Comentarios</Heading>
            <form onSubmit={handleAddComment} style={{ marginBottom: 12 }}>
              <InputGroup mb={2}>
                <Input
                  placeholder="Escribe un comentario..."
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  disabled={commentLoading}
                  bg="pastelBlue.100"
                />
              </InputGroup>
              <Button
                colorScheme="brand"
                type="submit"
                loading={commentLoading}
                disabled={!newComment.trim()}
              >
                Comentar
              </Button>
            </form>
            <Box mt={2} display="flex" flexDirection="column" gap={2}>
              {comments.length === 0 && (
                <Text color="gray.500" fontSize="sm">No hay comentarios aún.</Text>
              )}
              {comments.map(comment => (
                <Box
                  key={comment._id}
                  bg="white"
                  borderRadius="lg"
                  boxShadow="sm"
                  px={3}
                  py={2}
                  maxW="80%"
                  border="1px solid"
                  borderColor="pastelBlue.100"
                  position="relative"
                >
                  {comment.author?._id === userId && (
                    <Box position="absolute" top={2} right={2} zIndex={2}>
                      <MenuRoot>
                        <MenuTrigger asChild>
                          <Button variant="ghost" size="xs" p={1} minW={0}>
                            <FiMoreVertical />
                          </Button>
                        </MenuTrigger>
                        <MenuContent>
                          <MenuItem value="edit" onClick={() => handleEditComment(comment)}>
                            <FiEdit2 style={{ marginRight: 8 }} />
                            Editar
                          </MenuItem>
                          <MenuItem
                            value="delete"
                            onClick={() => setCommentToDelete(comment)}
                            disabled={deleteLoading === comment._id}
                          >
                            <FiTrash2 style={{ marginRight: 8 }} />
                            {deleteLoading === comment._id ? 'Borrando...' : 'Borrar'}
                          </MenuItem>
                        </MenuContent>
                      </MenuRoot>
                    </Box>
                  )}
                  <Text fontWeight="bold" fontSize="sm" mb={1}>{comment.author?.username || 'Usuario'}</Text>
                  <Text fontSize="sm">{comment.content}</Text>
                  <Text fontSize="xs" color="gray.500" mt={1}>{new Date(comment.createdAt).toLocaleString()}</Text>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Flex>
  );
};

export default PetDetail;