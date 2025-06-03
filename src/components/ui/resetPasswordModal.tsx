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

const API_URL = import.meta.env.VITE_API_URL;

interface ResetPasswordModalProps {
    open: boolean;
    onClose: () => void;
    email: string;
    code: string;
    onSuccess?: () => void;
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
    open,
    onClose,
    email,
    code,
    onSuccess,
}) => {
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const validate = () => {
        if (!password) return 'La contraseña es obligatoria';
        if (password.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
        if (!confirm) return 'Confirma tu contraseña';
        if (confirm !== password) return 'Las contraseñas no coinciden';
        return null;
    };

    const handleReset = async () => {
        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            await axios.post(`${API_URL}/auth/reset-password`, {
                email,
                token: code,
                newPassword: password,
            });
            toaster.create({ title: 'Contraseña actualizada', type: 'success' });
            setPassword('');
            setConfirm('');
            onClose();
            if (onSuccess) onSuccess();
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(
                    err.response?.data?.message ||
                    'Error al actualizar la contraseña'
                );
            } else {
                setError('Error al actualizar la contraseña');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <DialogRoot open={open} onOpenChange={d => !d.open && onClose()}>
            <DialogContent>
                <DialogHeader>Restablecer contraseña</DialogHeader>
                <DialogBody>
                    <Input
                        placeholder="Nueva contraseña"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        mb={2}
                        autoFocus
                    />
                    <Input
                        placeholder="Repite la contraseña"
                        type="password"
                        value={confirm}
                        onChange={e => setConfirm(e.target.value)}
                        mb={2}
                    />
                    {error && <Text color="red.500" fontSize="sm">{error}</Text>}
                </DialogBody>
                <DialogFooter>
                    <Button colorScheme="brand" onClick={handleReset} loading={loading}>
                        Guardar
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