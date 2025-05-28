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
import News1 from './views/news/News1';
import News2 from './views/news/News2';
import News3 from './views/news/News3';
import Profile from './views/profile/Profile';
import PetDetail from '@/views/pets/PetDetail';

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
        <Route
          path="/news/news1"
          element={
            <ProtectedRoute>
              <News1 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/news/news2"
          element={
            <ProtectedRoute>
              <News2 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/news/news3"
          element={
            <ProtectedRoute>
              <News3 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pets/:petId"
          element={
            <ProtectedRoute>
              <PetDetail />
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
