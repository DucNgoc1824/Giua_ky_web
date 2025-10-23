import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: localStorage.getItem('token') || null,
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const user = authService.getCurrentUser();
    
    if (user && authState.token) {
      setAuthState({
        token: authState.token,
        user: user,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      setAuthState({
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, [authState.token]);

  const login = async (username, password) => {
    try {
      const data = await authService.login(username, password);
      setAuthState({
        token: data.token,
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return data;
    } catch (error) {
      setAuthState({
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    
    setAuthState({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {!authState.isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};