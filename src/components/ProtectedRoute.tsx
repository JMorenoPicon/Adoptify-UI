import React, { ReactNode, useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import {
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogRoot,
  DialogCloseTrigger,
} from "@/components/ui/dialog";
import { Button, Text } from "@chakra-ui/react";

const API_URL = import.meta.env.VITE_API_URL;

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [expired, setExpired] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    const checkExpiration = () => {
      const expires = localStorage.getItem('token_expires');
      if (expires) {
        const msLeft = Number(expires) - Date.now();
        setTimeLeft(msLeft);

        // Mostrar modal si quedan menos de 5 minutos y más de 0
        if (msLeft <= 5 * 60 * 1000 && msLeft > 0 && token) {
          setShowModal(true);
        } else {
          setShowModal(false);
        }

        // Expira
        if (msLeft <= 0) {
          localStorage.removeItem('token');
          localStorage.removeItem('token_expires');
          setToken(null);
          setExpired(true);
        }
      }
    };
    checkExpiration();
    const interval = setInterval(checkExpiration, 1000); // revisa cada segundo
    return () => clearInterval(interval);
  }, [token]);

  const renewSession = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.token);
  
        // Decodifica el token para obtener la expiración (opcional, si quieres precisión)
        // Si no, simplemente suma 1 hora como antes:
        const expiresAt = Date.now() + 60 * 60 * 1000;
        localStorage.setItem('token_expires', expiresAt.toString());
  
        setToken(data.token);
        setShowModal(false);
        setExpired(false);
        setTimeLeft(expiresAt - Date.now());
      } else {
        // Si falla, cerrar sesión
        localStorage.removeItem('token');
        localStorage.removeItem('token_expires');
        setToken(null);
        setExpired(true);
      }
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('token_expires');
      setToken(null);
      setExpired(true);
      console.error('Error al renovar la sesión:', error);
    }
  };

  if (!token || expired) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Formatea el tiempo restante en minutos y segundos
  const formatTime = (ms: number) => {
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {children}
      <DialogRoot open={showModal}>
        <DialogContent>
          <DialogHeader>Sesión a punto de expirar</DialogHeader>
          <DialogBody>
            <Text mb={2}>
              Tu sesión caducará en {timeLeft !== null ? formatTime(timeLeft) : '...'} minutos.
            </Text>
            <Text>¿Quieres mantenerte conectado?</Text>
          </DialogBody>
          <DialogFooter>
            <Button colorScheme="blue" mr={3} onClick={renewSession}>
              Mantener sesión iniciada
            </Button>
            <DialogCloseTrigger asChild>
              <Button variant="ghost">Cerrar</Button>
            </DialogCloseTrigger>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </>
  );
};

export default ProtectedRoute;