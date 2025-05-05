// src/App.tsx
import React from 'react';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './views/auth/Login';
// import Register from './views/auth/Register';
// import ForgotPassword from './views/auth/ForgotPassword';
// import Home from './views/Home';

const App: React.FC = () => {
  return (
    <ChakraProvider value={defaultSystem}>
      <BrowserRouter>
        <Routes>
          {/* Auth */}
          <Route path="/auth/login" element={<Login />} />
          {/* <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} /> */}

          {/* Vista principal */}
          {/* <Route path="/" element={<Home />} /> */}

          {/* Catch-all: redirige a inicio */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
};

export default App;
