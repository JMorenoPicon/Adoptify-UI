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

interface ResetCodeModalProps {
    open: boolean;
    onClose: () => void;
    email: string;
    onSuccess: (code: string) => void;
}

export const ResetCodeModal: React.FC<ResetCodeModalProps> = ({
    open,
    onClose,
    email,
    onSuccess,
}) => {
    const [code, setCode] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleVerify = () => {
        setError(null);
        if (!code || code.length !== 6) {
            setError('Introduce el código de 6 dígitos');
            return;
        }
        // No se hace petición al backend aquí, solo se pasa el código al siguiente modal
        onSuccess(code);
        setCode('');
    };

    return (
        <DialogRoot open={open} onOpenChange={d => !d.open && onClose()}>
            <DialogContent>
                <DialogHeader>Verifica tu código</DialogHeader>
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
                    <Button colorScheme="brand" onClick={handleVerify}>
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