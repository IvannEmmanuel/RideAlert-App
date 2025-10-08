// contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getToken, getRefreshToken, saveToken, removeToken, getUser } from '../utils/authStorage';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  login: (accessToken: string, refreshToken: string, user: any) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateUser: (user: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);

  const checkAuth = async () => {
    try {
      const accessToken = await getToken();
      const refreshToken = await getRefreshToken();
      const userData = await getUser();

      console.log('🔐 Auth Check:', { 
        hasAccessToken: !!accessToken, 
        hasRefreshToken: !!refreshToken, 
        hasUserData: !!userData 
      });

      if (accessToken && refreshToken && userData) {
        setIsAuthenticated(true);
        setUser(userData);
        console.log('✅ User is authenticated with valid tokens');
      } else {
        // Clear any partial auth data
        await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'user']);
        setIsAuthenticated(false);
        setUser(null);
        console.log('❌ User is not authenticated - missing tokens');
      }
    } catch (error) {
      console.error('❌ Auth check error:', error);
      await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'user']);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (accessToken: string, refreshToken: string, userData: any) => {
    try {
      await saveToken(accessToken);
      await AsyncStorage.setItem("refresh_token", refreshToken);
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      
      setIsAuthenticated(true);
      setUser(userData);
      console.log('✅ Login successful - auth state updated');
    } catch (error) {
      console.error('❌ Error during login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await removeToken();
      await AsyncStorage.multiRemove(['refresh_token', 'user']);
      
      setIsAuthenticated(false);
      setUser(null);
      console.log('✅ Logout successful - auth state cleared');
    } catch (error) {
      console.error('❌ Error during logout:', error);
    }
  };

  const updateUser = async (updatedUser: any) => {
    try {
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      console.log('✅ User data updated');
    } catch (error) {
      console.error('❌ Error updating user:', error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isLoading, 
      user,
      login, 
      logout, 
      checkAuth,
      updateUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};