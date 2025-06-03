import React, { useState } from 'react';
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogCloseTrigger,
} from '@/components/ui/dialog';
import { Input, Button, Text } from '@chakra-ui/react';
import axios from 'axios';
import { toaster } from '@/components/ui/toaster';

const API_URL = import.meta.env.VITE_API_URL

interface VerifyCodeModalProps {
  open: boolean;
  onClose: () => void;
  email: string;
  onSuccess?: () => void;
}

export const VerifyCodeModal: React.FC<VerifyCodeModalProps> = ({
  open,
  onClose,
  email,
  onSuccess,
}) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(`${API_URL}/users/verify`, {
        email,
        verificationCode: code,
      });
      toaster.create({ title: '¡Verificado!', type: 'success' });
      setCode('');
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      interface AxiosError {
        response?: {
          data?: {
            message?: string;
          };
        };
      }
      const error = err as AxiosError;
      if (
        typeof err === 'object' &&
        err !== null &&
        error.response &&
        typeof error.response === 'object' &&
        error.response.data &&
        typeof error.response.data === 'object' &&
        error.response.data.message
      ) {
        setError(error.response.data.message as string);
      } else {
        setError('Error al verificar el código');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogRoot open={open} onOpenChange={d => !d.open && onClose()}>
      <DialogContent>
        <DialogHeader>Verifica tu correo</DialogHeader>
        <DialogBody>
          <Text mb={2}>
            Ingresa el código de 6 dígitos que hemos enviado a <b>{email}</b>
          </Text>
          <Input
            placeholder="Código de verificación"
            value={code}
            onChange={e => setCode(e.target.value)}
            maxLength={6}
            mb={2}
            autoFocus
          />
          {error && <Text color="red.500" fontSize="sm">{error}</Text>}
        </DialogBody>
        <DialogFooter>
          <Button colorScheme="brand" onClick={handleVerify} loading={loading}>
            Verificar
          </Button>
          <DialogCloseTrigger asChild>
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
          </DialogCloseTrigger>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};