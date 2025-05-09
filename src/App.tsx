// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from './components/ui/provider';

import Login from './views/auth/Login';
import Register from './views/auth/Register';
import ForgotPassword from './views/auth/ForgotPassword';
import Home from './views/Home';

const App: React.FC = () => (
  <Provider>
    <BrowserRouter>
      <Routes>
        {/* Redirige la raíz al login */}
        <Route path="/" element={<Home />} />

        {/* Auth */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />

        {/* Catch-all: redirige al login */}
        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </BrowserRouter>
  </Provider>
);

export default App;
