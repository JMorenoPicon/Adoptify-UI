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

export const login = (data: LoginData) =>
  axios.post<LoginResponse>(`${API_URL}/users/login`, data);
