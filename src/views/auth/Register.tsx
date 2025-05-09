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
                    Registrarse
                </Heading>

                {errors.general && (
                    <Text color="red.300" mb={4} textAlign="center">
                        {errors.general}
                    </Text>
                )}

                <form onSubmit={handleSubmit}>
                    <Field.Root invalid={!!errors.username} mb={4}>
                        <Field.Label color="white">Nombre de usuario</Field.Label>
                        <Input
                            bg="gray.600"
                            color="white"
                            placeholder="Tu nombre de usuario"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            w="full"
                            _placeholder={{ color: 'gray.400' }}
                        />
                        <Field.ErrorText color="red.300">
                            {errors.username}
                        </Field.ErrorText>
                    </Field.Root>

                    <Field.Root invalid={!!errors.email} mb={4}>
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
                        <Field.ErrorText color="red.300">
                            {errors.email}
                        </Field.ErrorText>
                    </Field.Root>

                    <Field.Root invalid={!!errors.password} mb={4}>
                        <Field.Label color="white">Contraseña</Field.Label>
                        <Box w="full" position="relative">
                            <Input
                                bg="gray.600"
                                color="white"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                w="full"
                                _placeholder={{ color: 'gray.400' }}
                            />
                            <IconButton
                                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                _hover={{ bg: 'gray.600' }}
                                size="sm"
                                variant="ghost"
                                color="white"
                                position="absolute"
                                top="50%"
                                right="0.75rem"
                                transform="translateY(-50%)"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FiEyeOff /> : <FiEye />}
                            </IconButton>
                        </Box>
                        <Field.ErrorText color="red.300">
                            {errors.password}
                        </Field.ErrorText>
                    </Field.Root>

                    <Field.Root invalid={!!errors.confirm} mb={6}>
                        <Field.Label color="white">Confirmar contraseña</Field.Label>
                        <Box w="full" position="relative">
                            <Input
                                bg="gray.600"
                                color="white"
                                type={showConfirm ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={confirm}
                                onChange={e => setConfirm(e.target.value)}
                                w="full"
                                _placeholder={{ color: 'gray.400' }}
                            />
                            <IconButton
                                aria-label={showConfirm ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                _hover={{ bg: 'gray.600' }}
                                size="sm"
                                variant="ghost"
                                color="white"
                                position="absolute"
                                top="50%"
                                right="0.75rem"
                                transform="translateY(-50%)"
                                onClick={() => setShowConfirm(!showConfirm)}
                            >
                                {showConfirm ? <FiEyeOff /> : <FiEye />}
                            </IconButton>
                        </Box>
                        <Field.ErrorText color="red.300">
                            {errors.confirm}
                        </Field.ErrorText>
                    </Field.Root>

                    <Button
                        type="submit"
                        colorScheme="teal"
                        w="full"
                        loading={loading}
                        mb={4}
                    >
                        Registrarse
                    </Button>
                </form>

                <Flex justify="center">
                    <Text color="gray.300" mr={2}>
                        ¿Ya tienes cuenta?
                    </Text>
                    <Link asChild>
                        <RouterLink to="/auth/login" style={{ color: 'inherit' }}>
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
