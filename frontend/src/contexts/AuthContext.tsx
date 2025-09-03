import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'student' | 'teacher' | 'admin';
  profile_picture?: string;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  backendUrl: string;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
  updateProfilePicture: (formData: FormData) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'student' | 'teacher';
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  backendUrl: '',
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateUser: async () => {},
  updateProfilePicture: async () => {},
  changePassword: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const backendUrl = apiUrl.endsWith('/api') ? apiUrl.slice(0, -4) : apiUrl;

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${token}`
            }
          };
          
          const res = await axios.get(`${apiUrl}/auth/me`, config);
          setUser(res.data.data);
        } catch (error) {
          console.error('Error loading user:', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      
      setIsLoading(false);
    };

    loadUser();
  }, [token, apiUrl]);

  // Set auth token for all axios requests
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post(`${apiUrl}/auth/login`, { email, password });
      
      const { token: authToken, user: userData } = res.data;
      
      localStorage.setItem('token', authToken);
      setToken(authToken);
      setUser(userData);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const res = await axios.post(`${apiUrl}/auth/register`, userData);
      
      const { token: authToken, user: newUser } = res.data;
      
      localStorage.setItem('token', authToken);
      setToken(authToken);
      setUser(newUser);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      
      const res = await axios.put(`${apiUrl}/users/profile`, userData, config);
      setUser(res.data.data);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const updateProfilePicture = async (formData: FormData) => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      };
      
      const res = await axios.put(`${apiUrl}/users/profile-picture`, formData, config);
      setUser(res.data.data);
    } catch (error) {
      console.error('Error updating profile picture:', error);
      throw error;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      const passwordData = { currentPassword, newPassword };
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      
      await axios.put(`${apiUrl}/users/change-password`, passwordData, config);
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        backendUrl,
        login,
        register,
        logout,
        updateUser,
        updateProfilePicture,
        changePassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};