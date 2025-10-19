// contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getToken,
  getRefreshToken,
  saveToken,
  removeToken,
  getUser,
  refreshAccessToken
} from '../utils/authStorage';

// Make logout callable from other modules (e.g. axios interceptor)
export let globalLogout: (() => Promise<void>) | null = null;

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

// Safe base64 decode for RN environment (supports atob or Buffer)
const base64UrlDecode = (str: string) => {
  try {
    // Replace URL-safe characters
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);

    if (typeof atob === 'function') {
      return atob(padded);
    }

    // Node/React Native fallback
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { Buffer } = require('buffer');
    return Buffer.from(padded, 'base64').toString('utf8');
  } catch (e) {
    console.error('base64UrlDecode error:', e);
    return '';
  }
};

// Helper to decode JWT and check if expired
export const isTokenExpired = (token: string): boolean => {
  try {
    if (!token) return true;
    const parts = token.split('.');
    if (parts.length !== 3) return true;

    const payload = parts[1];
    const decodedStr = base64UrlDecode(payload);
    if (!decodedStr) return true;

    const decoded = JSON.parse(decodedStr);
    if (!decoded.exp) return true;

    // exp is in seconds
    return decoded.exp < Date.now() / 1000;
  } catch (e) {
    console.error('Error decoding token:', e);
    return true;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);

  const logout = useCallback(async () => {
    try {
      await removeToken(); // remove access token via your util
      await AsyncStorage.multiRemove(['refresh_token', 'user']);
      setIsAuthenticated(false);
      setUser(null);
      console.log('✅ Logout successful - auth state cleared');
    } catch (error) {
      console.error('❌ Error during logout:', error);
    }
  }, []);

  // Expose globally so other files (axios interceptor) can call it
  useEffect(() => {
    globalLogout = logout;
    return () => {
      // clear reference on unmount
      globalLogout = null;
    };
  }, [logout]);

  const checkAuth = useCallback(async () => {
    try {
      let accessToken = await getToken();
      const refreshToken = await getRefreshToken();
      const userData = await getUser();

      console.log('🔐 Auth Check:', {
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken,
        hasUserData: !!userData
      });

      // If we have refresh token but no access token, try to refresh
      if (!accessToken && refreshToken) {
        console.log('🔄 No access token but refresh token exists, attempting refresh...');
        // If refresh token expired, force logout
        if (isTokenExpired(refreshToken)) {
          console.warn('❌ Refresh token expired during auth check - forcing logout');
          await logout();
          setIsLoading(false);
          return;
        }

        accessToken = await refreshAccessToken();
      }

      // If refresh token exists but is expired => force logout
      if (refreshToken && isTokenExpired(refreshToken)) {
        console.warn('❌ Refresh token expired - forcing logout');
        await logout();
        setIsLoading(false);
        return;
      }

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
  }, [logout]);

  // Validate and refresh tokens periodically
  const validateAndRefreshTokens = useCallback(async () => {
    try {
      const accessToken = await getToken();
      const refreshToken = await getRefreshToken();

      // Nothing to do if missing tokens
      if (!accessToken || !refreshToken) {
        return;
      }

      // If refresh token expired => force logout immediately
      if (isTokenExpired(refreshToken)) {
        console.warn('❌ Refresh token expired - force logout');
        await logout();
        return;
      }

      // If access token expired, try refresh
      if (isTokenExpired(accessToken)) {
        console.warn('⏰ Access token expired, attempting to refresh with valid refresh token');

        try {
          const newAccessToken = await refreshAccessToken();
          if (newAccessToken) {
            console.log('✅ Access token refreshed successfully');
            // Optionally update stored access token via saveToken util
            await saveToken(newAccessToken);
            return;
          } else {
            console.warn('❌ refreshAccessToken returned null - logging out');
            await logout();
          }
        } catch (err) {
          console.error('❌ Token refresh failed:', err);
          await logout();
        }
      }
    } catch (err) {
      console.error('validateAndRefreshTokens error:', err);
      // Be conservative and logout on unexpected failures that might indicate token issues
      // (optional) await logout();
    }
  }, [logout]);

  const login = async (accessToken: string, refreshToken: string, userData: any) => {
    try {
      await saveToken(accessToken);
      await AsyncStorage.setItem('refresh_token', refreshToken);
      await AsyncStorage.setItem('user', JSON.stringify(userData));

      setIsAuthenticated(true);
      setUser(userData);
      console.log('✅ Login successful - auth state updated');
    } catch (error) {
      console.error('❌ Error during login:', error);
      throw error;
    }
  };

  const updateUser = async (updatedUser: any) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      console.log('✅ User data updated');
    } catch (error) {
      console.error('❌ Error updating user:', error);
    }
  };

  // Check auth on app startup
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Poll to validate tokens. You may increase interval (e.g. 30s) to reduce battery/network usage.
  useEffect(() => {
    const tokenCheckInterval = setInterval(() => {
      validateAndRefreshTokens();
    }, 5000); // keep as 5s for active checking; change if you want less frequent checks

    return () => clearInterval(tokenCheckInterval);
  }, [validateAndRefreshTokens]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        login,
        logout,
        checkAuth,
        updateUser
      }}
    >
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
