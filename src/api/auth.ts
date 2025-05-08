// src/api/auth.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333/api/v1';

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  // cualquier otro campo que devuelva tu backend (usuario, roles…)
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  data: {
    token: string;
  };
  // añade aquí cualquier otro campo que devuelva tu endpoint de registro
}

/**
 * Realiza el login de un usuario.
 */
export const login = (data: LoginData) =>
  axios.post<LoginResponse>(`${API_URL}/users/login`, data);

/**
 * Registra un nuevo usuario.
 * Lanza un Error con el mensaje devuelto por el servidor en caso de fallo.
 */
export const register = async (data: RegisterData): Promise<RegisterResponse> => {
  try {
    const response = await axios.post<RegisterResponse>(
      `${API_URL}/users/register`,
      data
    );
    return response.data;
  } catch (error: unknown) {
    // Si es un error de Axios, extraemos el mensaje
    if (axios.isAxiosError(error)) {
      const msg =
        (error.response?.data as { message?: string })?.message ||
        'Error en el registro';
      throw new Error(msg);
    }
    // Para cualquier otro tipo de error
    throw new Error('Error desconocido en el registro');
  }
};
