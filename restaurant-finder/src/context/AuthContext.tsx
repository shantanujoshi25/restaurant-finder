import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, storageService } from '../services/api';
import { AuthResponse, User, LoginRequest } from '../types';
import { toast } from 'react-hot-toast';

interface AuthContextType {
  user: AuthResponse | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isBusinessOwner: boolean;
  isUser: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = storageService.getToken();
        if (token) {
          const currentUser = storageService.getUser();
          if (currentUser) {
            // Validate the token with the backend
            await authService.validateToken();
            setUser(currentUser);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);

        storageService.clearAll();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    try {
      const credentials: LoginRequest = { username, password };
      const response = await authService.login(credentials);
  
      storageService.setToken(response.token);
      storageService.setUser(response);
      setUser(response);
    } catch (error) {
      storageService.clearAll();
      setUser(null);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
      setUser(null);
      storageService.clearAll();
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);

      setUser(null);
      storageService.clearAll();
    }
  };

  // Compute auth state flags
  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'ROLE_ADMIN';
  const isBusinessOwner = user?.role === 'ROLE_BUSINESS_OWNER';
  const isUser = user?.role === 'ROLE_USER';

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    isAdmin,
    isBusinessOwner,
    isUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


export const useRequireAuth = (requiredRole?: string): { loading: boolean; authorized: boolean } => {
  const { user, loading } = useAuth();
  
  if (!loading && !user) {

    window.location.href = '/login';
  }

  if (requiredRole && user && user.role !== requiredRole) {

    window.location.href = '/';
  }

  return {
    loading,
    authorized: !!user && (!requiredRole || user.role === requiredRole)
  };
};