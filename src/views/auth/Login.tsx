// src/views/auth/Login.tsx
import React, { useState } from 'react';
import {
  Box,
  Heading,
  Input,
  Button,
  Text,
  Flex,
  Link,
  Field,
} from '@chakra-ui/react';
import { toaster, Toaster } from '@/components/ui/toaster';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { login } from '@/api/auth';
import { AxiosError } from 'axios';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const errs: typeof errors = {};
    if (!email) errs.email = 'El email es obligatorio';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Email no válido';
    if (!password) errs.password = 'La contraseña es obligatoria';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { data } = await login({ email, password });
      localStorage.setItem('token', data.token);
      toaster.create({
        title: '¡Login correcto!',
        description: 'Has iniciado sesión satisfactoriamente.',
        type: 'success',
      });
      navigate('/');
    } catch (err: unknown) {
        const axiosError = err as AxiosError;
      const msg = (axiosError?.response?.data as { message?: string })?.message || 'Error en la autenticación';
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
    <Box maxW="md" mx="auto" mt={12} p={6} boxShadow="lg" borderRadius="md">
      <Heading mb={6} textAlign="center">Iniciar Sesión</Heading>

      {errors.general && (
        <Text color="red.500" mb={4} textAlign="center">
          {errors.general}
        </Text>
      )}

      <form onSubmit={handleSubmit}>
        <Field.Root invalid={!!errors.email} mb={4}>
          <Field.Label>Email</Field.Label>
          <Box>
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </Box>
          <Field.ErrorText>{errors.email}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.password} mb={6}>
          <Field.Label>Contraseña</Field.Label>
          <Box>
            <Input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </Box>
          <Field.ErrorText>{errors.password}</Field.ErrorText>
        </Field.Root>

        <Button
          type="submit"
          colorScheme="teal"
          width="full"
          loading={loading}
        >
          Entrar
        </Button>
      </form>

      <Flex justify="space-between" mt={4}>
        <Link as={RouterLink} color="teal.500" href="/auth/register">
          Registrarse
        </Link>
        <Link as={RouterLink} color="teal.500" href="/auth/forgot-password">
          ¿Olvidaste tu contraseña?
        </Link>
      </Flex>

      {/* Renderiza los toasts */}
      <Toaster />
    </Box>
  );
};

export default Login;
