import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, User, RegisterRequest } from '../types/auth.types';
import { authService } from 'services/AuthService';
import { saveToken, getToken, removeToken, saveUser, getUser } from '../utils/tokenStorage';
import { showErrorToast, showSuccessToast } from '../utils/errorHandler';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    const storedToken = getToken();
    const storedUser = getUser();

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      
      const userData: User = {
        userId: response.userId,
        username: response.username,
        email: response.email,
      };

      saveToken(response.token);
      saveUser(userData);
      setToken(response.token);
      setUser(userData);
      
      showSuccessToast('Login successful!');
    } catch (error) {
      showErrorToast(error);
      throw error;
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      const response = await authService.register(data);
      
      const userData: User = {
        userId: response.userId,
        username: response.username,
        email: response.email,
      };

      saveToken(response.token);
      saveUser(userData);
      setToken(response.token);
      setUser(userData);
      
      showSuccessToast('Registration successful!');
    } catch (error) {
      showErrorToast(error);
      throw error;
    }
  };

  const logout = () => {
    removeToken();
    setToken(null);
    setUser(null);
    showSuccessToast('Logged out successfully');
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!token,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};