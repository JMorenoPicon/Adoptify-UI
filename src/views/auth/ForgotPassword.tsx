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
import { ResetCodeModal } from '@/components/ui/resetCodeModal';
import { ResetPasswordModal } from '@/components/ui/resetPasswordModal';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ email?: string; general?: string }>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');

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
      setResetEmail(email);
      setShowCodeModal(true);
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
          ¿Olvidaste tu contraseña?
        </Heading>

        {errors.general && (
          <Text color="brand.500" mb={4} textAlign="center">
            {errors.general}
          </Text>
        )}

        {/* Mensaje tras restablecimiento exitoso */}
        {sent && !showCodeModal && !showPasswordModal ? (
            <Box>
              <Text color="accent.500" textAlign="center" mb={2}>
                Tu contraseña ha sido restablecida correctamente.
              </Text>
              <Text color="accent.500" textAlign="center">
                Ya puedes iniciar sesión con tu nueva contraseña.
              </Text>
            </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            <Field.Root invalid={!!errors.email} mb={6}>
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
              <Field.ErrorText color="brand.500">{errors.email}</Field.ErrorText>
            </Field.Root>

            <Button
              type="submit"
              colorScheme="brand"
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
            <RouterLink to="/auth/login" style={{ color: 'accent.500' }}>
              Volver al login
            </RouterLink>
          </Link>
        </Flex>
      </Box>

      {/* MODAL: Código de verificación */}
      <ResetCodeModal
        open={showCodeModal}
        onClose={() => setShowCodeModal(false)}
        email={resetEmail}
        onSuccess={code => {
          setResetCode(code);
          setShowCodeModal(false);
          setShowPasswordModal(true);
        }}
      />

      {/* MODAL: Nueva contraseña */}
      <ResetPasswordModal
        open={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        email={resetEmail}
        code={resetCode}
        onSuccess={() => {
          setShowPasswordModal(false);
          setSent(true);
          toaster.create({ title: 'Contraseña restablecida', type: 'success' });
        }}
      />

      <Toaster />
    </Flex>
  );
};

export default ForgotPassword;
