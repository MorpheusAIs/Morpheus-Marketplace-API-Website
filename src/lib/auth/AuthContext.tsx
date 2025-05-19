'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiPost, apiGet } from '@/lib/api/apiService';

interface User {
  id: number;
  email: string;
  name: string;
  is_active: boolean;
}

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  useEffect(() => {
    // Check for stored tokens on mount
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    if (storedAccessToken && storedRefreshToken) {
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
      // TODO: Fetch user data using the stored token
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('Login attempt with:', { email });
      const response = await apiPost<LoginResponse>('https://api.mor.org/api/v1/auth/login', { email, password });
      
      if (response.error) {
        throw new Error(response.error);
      }

      const data = response.data;
      if (!data) {
        throw new Error('No data received from login');
      }
      
      setAccessToken(data.access_token);
      setRefreshToken(data.refresh_token);
      localStorage.setItem('accessToken', data.access_token);
      localStorage.setItem('refreshToken', data.refresh_token);
      
      // TODO: Fetch user data using the new token
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, name: string, password: string) => {
    try {
      console.log('Registration attempt with:', { email, name });
      const response = await apiPost<User>('https://api.mor.org/api/v1/auth/register', { 
        email, 
        name, 
        password, 
        is_active: true 
      });
      
      if (response.error) {
        throw new Error(response.error);
      }

      // After successful registration, log the user in
      await login(email, password);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    console.log('Logging out user');
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  const value = {
    user,
    accessToken,
    refreshToken,
    login,
    register,
    logout,
    isAuthenticated: !!accessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 