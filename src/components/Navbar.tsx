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
import { FiLogOut, FiUser, FiMenu } from 'react-icons/fi'
import { useColorModeValue } from '@/components/ui/color-mode'
import {
  MenuRoot,
  MenuTrigger,
  MenuContent,
  MenuItem,
} from '@/components/ui/menu'
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

const Navbar: React.FC = () => {
  const bg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const navigate = useNavigate()
  const [isAdmin, setIsAdmin] = useState(false)

  type JwtPayload = {
    role?: string;
    [key: string]: unknown;
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = jwtDecode<JwtPayload>(token);
        setIsAdmin(payload.role === 'admin');
      } catch {
        setIsAdmin(false);
      }
    } else {
      setIsAdmin(false);
    }
  }, []);

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

      {/* Links de navegación (desktop) */}
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
        <RouterLink to="/adopt">
          <Button
            variant="ghost"
            _hover={{ bg: 'pastelBlue.50' }}
            color="gray.600"
          >
            Animales en adopción
          </Button>
        </RouterLink>
        <RouterLink to="/lost">
          <Button
            variant="ghost"
            _hover={{ bg: 'pastelBlue.50' }}
            color="gray.600"
          >
            Mascotas perdidas
          </Button>
        </RouterLink>
        {isAdmin && (
          <RouterLink to="/admin">
            <Button
              variant="ghost"
              _hover={{ bg: 'pastelBlue.50' }}
              color="gray.600"
            >
              Administrador
            </Button>
          </RouterLink>
        )}
      </HStack>

      {/* Iconos y menú hamburguesa */}
      <HStack gap={2}>
        {/* Menú hamburguesa solo en mobile */}
        <Box display={{ base: 'block', md: 'none' }}>
          <MenuRoot>
            <MenuTrigger asChild>
              <IconButton
                aria-label="Abrir menú"
                variant="ghost"
                color="brand.500"
                _hover={{ bg: 'pastelBlue.50', color: 'brand.600' }}
              >
                <FiMenu />
              </IconButton>
            </MenuTrigger>
            <MenuContent>
              <RouterLink to="/index">
                <MenuItem value="inicio">Inicio</MenuItem>
              </RouterLink>
              <RouterLink to="/adopt">
                <MenuItem value="adopt">Animales en adopción</MenuItem>
              </RouterLink>
              <RouterLink to="/lost">
                <MenuItem value="lost">Mascotas perdidas</MenuItem>
              </RouterLink>
              {isAdmin && (
                <RouterLink to="/admin">
                  <MenuItem value="admin">Administrador</MenuItem>
                </RouterLink>
              )}
            </MenuContent>
          </MenuRoot>
        </Box>
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
