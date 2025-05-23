// src/components/Navbar.tsx
import React from 'react'
import {
  Flex,
  HStack,
  Box,
  Button,
  IconButton,
  Text,
} from '@chakra-ui/react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { FiLogOut, FiUser } from 'react-icons/fi'
import { useColorModeValue } from '@/components/ui/color-mode'

const Navbar: React.FC = () => {
  const bg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/', { replace: true })
  }

  return (
    <Flex
      as="header"
      position="fixed"
      top={0}
      left={0}
      w="full"
      h="60px"
      px={8}
      align="center"
      justify="space-between"
      bg={bg}
      borderBottom="1px"
      borderColor={borderColor}
      zIndex={10}
    >
      {/* Logo o nombre de la app */}
      <Box>
        <RouterLink to="/index">
          <Text
            fontWeight="bold"
            fontSize="xl"
            color="brand.500"
            _hover={{ textDecoration: 'none', color: 'brand.600' }}
          >
            🐾 Pet Finder
          </Text>
        </RouterLink>
      </Box>

      {/* Links de navegación */}
      <HStack gap={4} display={{ base: 'none', md: 'flex' }}>
        <RouterLink to="/index">
          <Button
            variant="ghost"
            _hover={{ bg: 'pastelBlue.50' }}
            color="gray.600"
          >
            Inicio
          </Button>
        </RouterLink>
        {/* Añade más enlaces aquí: boton para adopcion y para reportes de mascotas perdidas */}
      </HStack>

      {/* Icono de usuario y cerrar sesión */}
      <HStack gap={2}>
        <IconButton
          aria-label="Perfil"
          variant="ghost"
          color="brand.500"
          _hover={{ bg: 'pastelBlue.50', color: 'brand.600' }}
          onClick={() => navigate('/profile')}
        >
          <FiUser />
        </IconButton>
      <IconButton
        aria-label="Cerrar sesión"
        variant="ghost"
        color="brand.500"
        _hover={{ bg: 'pastelBlue.50', color: 'brand.600' }}
        onClick={handleLogout}
      >
      <FiLogOut />
      </IconButton>
      </HStack>
    </Flex>
)
};

export default Navbar
