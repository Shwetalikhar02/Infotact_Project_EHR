import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// Create a custom axios instance
const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || 'https://infotact-project-ehr-1.onrender.com') + '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Interceptor to automatically attach the token to all outgoing requests
api.interceptors.request.use(
  (config) => {
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