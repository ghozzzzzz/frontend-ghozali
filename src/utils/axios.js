import axios from 'axios';
import { store } from '../pages/Redux/stores';
import { logout } from '../pages/Redux/authSlice';

const baseURL = import.meta.env.PROD 
  ? 'https://backend-ghozali-production.up.railway.app/api'
  : 'http://localhost:5000/api';

const api = axios.create({ baseURL });

// Request interceptor
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

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logout());
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;