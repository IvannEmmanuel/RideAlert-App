import axios from 'axios';
import { BASE_URL } from '../config/apiConfig';
import { getToken, getRefreshToken, refreshAccessToken, removeToken } from '../utils/authStorage';

// Create axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried refreshing yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, add to queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        
        if (newToken) {
          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          
          // Process queued requests
          processQueue(null, newToken);
          return apiClient(originalRequest);
        } else {
          // Refresh failed - clear tokens and redirect to login
          await removeToken();
          await AsyncStorage.multiRemove(['refresh_token', 'user']);
          
          // Redirect to login screen
          // You might need to use a navigation ref here
          processQueue(new Error('Refresh token failed'));
          throw error;
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        await removeToken();
        await AsyncStorage.multiRemove(['refresh_token', 'user']);
        throw refreshError;
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;