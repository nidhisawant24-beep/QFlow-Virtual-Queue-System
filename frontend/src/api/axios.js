import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://QFlow-env.eba-fkxskcpz.ap-south-1.elasticbeanstalk.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach Authorization Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('qflow_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle global errors (e.g. 401 unauthorized token expiration)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const token = localStorage.getItem('qflow_token');
      if (token && error.config.url !== '/auth/me') {
        localStorage.removeItem('qflow_token');
        localStorage.removeItem('qflow_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;