import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { API_BASE_URL } from './api';

// Create a custom axios instance
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`, // Backend base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to automatically attach the token to all outgoing requests
api.interceptors.request.use(
  (config) => {
    // Get token from Zustand store
    const token = useAuthStore.getState().token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
