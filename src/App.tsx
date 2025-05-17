// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Provider } from './components/ui/provider';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Login from './views/auth/Login';
import Register from './views/auth/Register';
import ForgotPassword from './views/auth/ForgotPassword';
import Home from './views/Home';
import Index from './views/Index';
import ProtectedRoute from './components/ProtectedRoute';

const NoNavBarRoutes = [
  '/',
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
];

const AppContent: React.FC = () => {
  const { pathname } = useLocation();
  const showNavbar = !NoNavBarRoutes.includes(pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        {/* Public landing */}
        <Route path="/" element={<Home />} />

        {/* Auth */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />

        {/* Protected */}
        <Route
          path="/index"
          element={
            <ProtectedRoute>
              <Index />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {showNavbar && <Footer />}
    </>
  );
};

const App: React.FC = () => (
  <Provider>
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  </Provider>
);

export default App;
