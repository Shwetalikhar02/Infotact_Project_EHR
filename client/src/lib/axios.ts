import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// Create a custom axios instance
const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || 'https://infotact-project-ehr.onrender.com') + '/api', // Backend base URL
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Required when server uses credentials: true in CORS
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
