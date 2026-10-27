'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/api';
import { isAdminRole, UserRole } from '@/lib/roles';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const persistUser = (userData: User) => {
  localStorage.setItem('user', JSON.stringify(userData));
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      setToken(storedToken);

      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser) as User;
          setUser({
            ...parsed,
            role: parsed.role ?? 'general',
          });
        } catch {
          localStorage.removeItem('user');
        }
      }

      try {
        const response = await api.get('/auth/me');
        const userData = response.data.data.user as User;
        const normalized: User = {
          ...userData,
          role: userData.role ?? 'general',
        };
        setUser(normalized);
        persistUser(normalized);
      } catch {
        // Keep stored user if /me fails transiently; 401 handled by api interceptor
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    const { user: userData, token: authToken } = response.data.data;
    const normalized: User = {
      ...userData,
      role: userData.role ?? 'general',
    };

    localStorage.setItem('token', authToken);
    persistUser(normalized);
    setToken(authToken);
    setUser(normalized);
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { name, email, password });
    const { user: userData, token: authToken } = response.data.data;
    const normalized: User = {
      ...userData,
      role: userData.role ?? 'general',
    };

    localStorage.setItem('token', authToken);
    persistUser(normalized);
    setToken(authToken);
    setUser(normalized);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isLoading,
        isAuthenticated: !!token,
        isAdmin: isAdminRole(user?.role),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
