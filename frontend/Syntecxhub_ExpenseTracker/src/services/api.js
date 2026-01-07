import axios from 'axios';

/**
 * Axios Instance Configuration
 * Centralizes the backend URL and manages authentication headers.
 */
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Ensure this matches your backend port
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