import axios from 'axios';

/**
 * Axios Instance Configuration
 * Centralizes the backend URL and manages authentication headers.
 */
const api = axios.create({
  // ✅ Switch to live Render URL when VITE_API_URL is set, otherwise use localhost
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Request Interceptor: Automatically adds the JWT token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
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