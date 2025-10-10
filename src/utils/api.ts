// utils/api.ts
import axios from 'axios';
import { getToken, getRefreshToken, refreshAccessToken, removeToken } from './authStorage';
import { BASE_URL } from '../config/apiConfig';

// Create an axios instance
const api = axios.create({
  baseURL: `${BASE_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Attach token before each request
api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 errors and refresh token automatically
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await getRefreshToken();
        
        if (!refreshToken) {
          console.log('❌ No refresh token available');
          await removeToken();
          processQueue(new Error('No refresh token'), null);
          // You might want to trigger logout here
          return Promise.reject(error);
        }

        console.log('🔄 Attempting to refresh access token...');
        const newAccessToken = await refreshAccessToken();

        if (newAccessToken) {
          console.log('✅ Access token refreshed successfully');
          processQueue(null, newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } else {
          console.log('❌ Failed to refresh token');
          await removeToken();
          processQueue(new Error('Refresh failed'), null);
          // You might want to trigger logout here
          return Promise.reject(error);
        }
      } catch (refreshError) {
        console.error('❌ Error during token refresh:', refreshError);
        await removeToken();
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    console.error('API error:', error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

export { api };