// src/views/auth/Login.tsx
import React, { useState } from 'react';
import {
  Flex,
  Box,
  Heading,
  Input,
  InputGroup,
  IconButton,
  Button,
  Text,
  Link,
  Field,
} from '@chakra-ui/react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { toaster, Toaster } from '@/components/ui/toaster';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { login } from '@/api/auth';
import axios from 'axios';
import { useEffect } from 'react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const expires = localStorage.getItem('token_expires');
    if (token && expires && Date.now() < Number(expires)) {
      navigate('/index', { replace: true });
    }
  }, [navigate]);

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
      const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour
      localStorage.setItem('token', data.token);
      localStorage.setItem('token_expires', expiresAt.toString());
      toaster.create({
        title: '¡Login correcto!',
        description: 'Has iniciado sesión satisfactoriamente.',
        type: 'success',
      });
      await new Promise(resolve => setTimeout(resolve, 3000));
      navigate('/index');
    } catch (err: unknown) {
      let msg = 'Error en la autenticación';
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
          Iniciar Sesión
        </Heading>

        {errors.general && (
          <Text color="brand.500" mb={4} textAlign="center">
            {errors.general}
          </Text>
        )}

        <form onSubmit={handleSubmit}>
          <Field.Root invalid={!!errors.email} mb={4}>
            <Field.Label color="brand.700">Email</Field.Label>
            <Input
              bg="pastelBlue.100"
              color="gray.800"
              placeholder="tucorreo@ejemplo.com"
              _placeholder={{ color: 'black' }}
              value={email}
              onChange={e => setEmail(e.target.value)}
              w="full"
            />
            <Field.ErrorText color="brand.500">
              {errors.email}
            </Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={!!errors.password} mb={6}>
            <Field.Label color="brand.700">Contraseña</Field.Label>
            <InputGroup w="full" position="relative">
              <Box w="full" position="relative">
                <Input
                  bg="pastelBlue.100"
                  color="gray.800"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  _placeholder={{ color: 'black' }}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  w="full"
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
            </InputGroup>
            <Field.ErrorText color="brand.500">
              {errors.password}
            </Field.ErrorText>
          </Field.Root>

          <Button
            type="submit"
            colorScheme="brand"
            w="full"
            loading={loading}
            mb={4}
          >
            Entrar
          </Button>
        </form>

        <Flex justify="space-between">
          <Link asChild>
            <RouterLink to="/auth/register" style={{ color: 'accent.500' }}>
              Registrarse
            </RouterLink>
          </Link>
          <Link asChild>
            <RouterLink
              to="/auth/forgot-password"
              style={{ color: 'accent.500' }}
            >
              ¿Olvidaste tu contraseña?
            </RouterLink>
          </Link>
        </Flex>
      </Box>

      <Toaster />
    </Flex>
  );
};

export default Login;
