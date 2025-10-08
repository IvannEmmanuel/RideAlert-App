// utils/api.ts
import axios from 'axios';
import { getToken } from './authStorage'; // your existing token getter
import { BASE_URL } from '../config/apiConfig';

// Create an axios instance
const api = axios.create({
  baseURL: `${BASE_URL}`, // change to your FastAPI base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

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

// Optional: handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API error:', error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

export { api };