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
            let msg = 'Error en la autenticación';
            if (axios.isAxiosError(err)) {
                // AxiosError inferido correctamente
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
                    Iniciar Sesión
                </Heading>

                {errors.general && (
                    <Text color="red.300" mb={4} textAlign="center">
                        {errors.general}
                    </Text>
                )}

                <form onSubmit={handleSubmit}>
                    <Field.Root invalid={!!errors.email} mb={4}>
                        <Field.Label color="white">Email</Field.Label>
                        <Input
                            bg="gray.600"
                            color="white"
                            placeholder="tucorreo@ejemplo.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            w="full"
                        />
                        <Field.ErrorText color="red.300">
                            {errors.email}
                        </Field.ErrorText>
                    </Field.Root>

                    <Field.Root invalid={!!errors.password} mb={6}>
                        <Field.Label color="white">Contraseña</Field.Label>
                        <InputGroup w="full" position="relative">
                            <Box w="full" position="relative">
                                <Input
                                    bg="gray.600"
                                    color="white"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    w="full"
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
                        </InputGroup>
                        <Field.ErrorText color="red.300">
                            {errors.password}
                        </Field.ErrorText>
                    </Field.Root>

                    <Button
                        type="submit"
                        colorScheme="teal"
                        w="full"
                        loading={loading}
                        mb={4}
                    >
                        Entrar
                    </Button>
                </form>

                <Flex justify="space-between">
                    <Link as={RouterLink} href="/auth/register" color="teal.300">
                        Registrarse
                    </Link>
                    <Link as={RouterLink} href="/auth/forgot-password" color="teal.300">
                        ¿Olvidaste tu contraseña?
                    </Link>
                </Flex>
            </Box>

            <Toaster />
        </Flex>
    );
};

export default Login;
