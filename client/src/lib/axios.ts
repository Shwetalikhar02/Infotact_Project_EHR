import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// In development: VITE_API_URL is unset → baseURL is '/api' (relative)
//   → Vite dev server proxies /api → http://localhost:5000/api  (no CORS issues)
// In production: VITE_API_URL is set via Vercel env vars → full Render URL used
const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

// Create a custom axios instance
const api = axios.create({
  baseURL: BASE_URL,
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