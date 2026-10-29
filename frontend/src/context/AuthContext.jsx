import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Inicializar estado verificando si el token es válido
  const checkAuth = useCallback(async () => {
    const savedToken = localStorage.getItem('token');
    if (!savedToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const userData = await authApi.getMe();
      setUser(userData);
      setToken(savedToken);
    } catch (err) {
      console.warn('Sesión no válida o expirada:', err.message);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    const response = await authApi.login({ email, password });
    localStorage.setItem('token', response.token);
    const userData = {
      id: response.id,
      nombreCompleto: response.nombreCompleto,
      email: response.email,
      rol: response.rol,
      telefono: response.telefono
    };
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(response.token);
    setUser(userData);
    return response;
  };

  const register = async (formData) => {
    const response = await authApi.register(formData);
    localStorage.setItem('token', response.token);
    const userData = {
      id: response.id,
      nombreCompleto: response.nombreCompleto,
      email: response.email,
      rol: response.rol,
      telefono: response.telefono
    };
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(response.token);
    setUser(userData);
    return response;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignorar error de red al salir
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
    }
  };

  const refreshUser = async () => {
    try {
      const userData = await authApi.getMe();
      setUser(userData);
      return userData;
    } catch (err) {
      console.error('Error al refrescar usuario:', err);
      return null;
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.rol === 'ROLE_ADMIN',
    isCliente: user?.rol === 'ROLE_CLIENTE',
    login,
    register,
    logout,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};

