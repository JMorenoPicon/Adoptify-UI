// src/views/auth/ForgotPassword.tsx
import React, { useState } from 'react';
import {
  Flex,
  Box,
  Heading,
  Input,
  Button,
  Text,
  Link,
  Field,
} from '@chakra-ui/react';
import axios from 'axios';
import { toaster, Toaster } from '@/components/ui/toaster';
import { Link as RouterLink } from 'react-router-dom';
import { forgotPassword as apiForgotPassword } from '@/api/auth';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ email?: string; general?: string }>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const validate = () => {
    const errs: typeof errors = {};
    if (!email) errs.email = 'El email es obligatorio';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Email no válido';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { message } = await apiForgotPassword({ email });
      toaster.create({
        title: 'Email enviado',
        description: message,
        type: 'success',
      });
      setSent(true);
    } catch (err: unknown) {
      let msg = 'Error al enviar el email';
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
      bg="gray.800"
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
        bg="gray.700"
      >
        <Heading mb={6} textAlign="center" color="white">
          ¿Olvidaste tu contraseña?
        </Heading>

        {errors.general && (
          <Text color="red.300" mb={4} textAlign="center">
            {errors.general}
          </Text>
        )}

        {sent ? (
          <Text color="green.300" textAlign="center">
            Revisa tu correo para el enlace de restablecimiento.
          </Text>
        ) : (
          <form onSubmit={handleSubmit}>
            <Field.Root invalid={!!errors.email} mb={6}>
              <Field.Label color="white">Email</Field.Label>
              <Input
                bg="gray.600"
                color="white"
                placeholder="tucorreo@ejemplo.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                w="full"
                _placeholder={{ color: 'gray.400' }}
              />
              <Field.ErrorText color="red.300">{errors.email}</Field.ErrorText>
            </Field.Root>

            <Button
              type="submit"
              colorScheme="teal"
              w="full"
              loading={loading}
              mb={4}
            >
              Enviar email
            </Button>
          </form>
        )}

        <Flex justify="center" mt={4}>
          <Link asChild>
            <RouterLink to="/auth/login" style={{ color: 'inherit' }}>
              Volver al login
            </RouterLink>
          </Link>
        </Flex>
      </Box>

      <Toaster />
    </Flex>
  );
};

export default ForgotPassword;
