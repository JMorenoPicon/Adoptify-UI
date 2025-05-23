// src/views/auth/Register.tsx
import React, { useState } from 'react';
import {
  Flex,
  Box,
  Heading,
  Input,
  IconButton,
  Button,
  Text,
  Link,
  Field,
} from '@chakra-ui/react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import axios from 'axios';
import { toaster, Toaster } from '@/components/ui/toaster';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { register as apiRegister } from '@/api/auth';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    confirm?: string;
    general?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const errs: typeof errors = {};
    if (!username) errs.username = 'El nombre es obligatorio';
    if (!email) errs.email = 'El email es obligatorio';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Email no válido';
    if (!password) errs.password = 'La contraseña es obligatoria';
    else if (password.length < 6) errs.password = 'Mínimo 6 caracteres';
    if (!confirm) errs.confirm = 'Confirma tu contraseña';
    else if (confirm !== password) errs.confirm = 'Las contraseñas no coinciden';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { data } = await apiRegister({ username, email, password });
      localStorage.setItem('token', data.token);
      const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hora
      localStorage.setItem('token_expires', expiresAt.toString());
      toaster.create({
        title: '¡Registro exitoso!',
        description: 'Ya puedes iniciar sesión.',
        type: 'success',
      });
      await new Promise(resolve => setTimeout(resolve, 3000));
      navigate('/auth/login');
    } catch (err: unknown) {
      let msg = `${err}`;
      if (axios.isAxiosError(err)) {
        msg = (err.response?.data as { message?: string })?.message ?? msg;
      }
      setErrors({ general: msg });
      toaster.create({
        title: 'Error',
        description: msg,
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex
      minH="100vh"
      w="full"
      bg="pastelBlue.50"
      align="center"
      justify="center"
      px={4}
    >
      <Box
        maxW="md"
        w="full"
        p={6}
        boxShadow="lg"
        borderRadius="md"
        bg="white"
      >
        <Heading mb={6} textAlign="center" color="brand.600">
          Registrarse
        </Heading>

        {errors.general && (
          <Text color="brand.500" mb={4} textAlign="center">
            {errors.general}
          </Text>
        )}

        <form onSubmit={handleSubmit}>
          <Field.Root invalid={!!errors.username} mb={4}>
            <Field.Label color="brand.700">Nombre de usuario</Field.Label>
            <Input
              bg="pastelBlue.100"
              color="gray.800"
              placeholder="Tu nombre de usuario"
              value={username}
              onChange={e => setUsername(e.target.value)}
              w="full"
              _placeholder={{ color: 'black' }}
            />
            <Field.ErrorText color="brand.500">
              {errors.username}
            </Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={!!errors.email} mb={4}>
            <Field.Label color="brand.700">Email</Field.Label>
            <Input
              bg="pastelBlue.100"
              color="gray.800"
              placeholder="tucorreo@ejemplo.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              w="full"
              _placeholder={{ color: 'black' }}
            />
            <Field.ErrorText color="brand.500">
              {errors.email}
            </Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={!!errors.password} mb={4}>
            <Field.Label color="brand.700">Contraseña</Field.Label>
            <Box w="full" position="relative">
              <Input
                bg="pastelBlue.100"
                color="gray.800"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                w="full"
                _placeholder={{ color: 'black' }}
              />
              <IconButton
                aria-label={
                  showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                }
                _hover={{ bg: 'pastelBlue.200' }}
                size="sm"
                variant="ghost"
                color="brand.600"
                position="absolute"
                top="50%"
                right="0.75rem"
                transform="translateY(-50%)"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </IconButton>
            </Box>
            <Field.ErrorText color="brand.500">
              {errors.password}
            </Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={!!errors.confirm} mb={6}>
            <Field.Label color="brand.700">Confirmar contraseña</Field.Label>
            <Box w="full" position="relative">
              <Input
                bg="pastelBlue.100"
                color="gray.800"
                type={showConfirm ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                w="full"
                _placeholder={{ color: 'black' }}
              />
              <IconButton
                aria-label={
                  showConfirm ? 'Ocultar contraseña' : 'Mostrar contraseña'
                }
                _hover={{ bg: 'pastelBlue.200' }}
                size="sm"
                variant="ghost"
                color="brand.600"
                position="absolute"
                top="50%"
                right="0.75rem"
                transform="translateY(-50%)"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <FiEyeOff /> : <FiEye />}
              </IconButton>
            </Box>
            <Field.ErrorText color="brand.500">
              {errors.confirm}
            </Field.ErrorText>
          </Field.Root>

          <Button
            type="submit"
            colorScheme="brand"
            w="full"
            loading={loading}
            mb={4}
          >
            Registrarse
          </Button>
        </form>

        <Flex justify="center">
          <Text color="gray.500" mr={2}>
            ¿Ya tienes cuenta?
          </Text>
          <Link asChild>
            <RouterLink to="/auth/login" style={{ color: 'accent.500' }}>
              Iniciar sesión
            </RouterLink>
          </Link>
        </Flex>
      </Box>

      <Toaster />
    </Flex>
  );
};

export default Register;
