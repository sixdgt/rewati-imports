import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

const LIST_ENDPOINTS = [
  '/categories/',
  '/products/',
  '/wishlist/',
  '/settings/ads/',
  '/orders/',
  '/reviews/',
];

// Request interceptor to add the access token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => {
    const contentType = response.headers['content-type'];
    if (typeof contentType === 'string' && contentType.includes('text/html')) {
      console.error(`[API] ${response.config.url} returned HTML — check Django auth/permissions`);
      return Promise.reject(new Error('Received HTML instead of JSON. Possible auth redirect.'));
    }
    
    console.log(`[API] ${response.config.url}`, response.data);
    const url = response.config.url || '';
    const isListEndpoint = LIST_ENDPOINTS.some(endpoint => url.includes(endpoint));
    
    if (isListEndpoint) {
      const data = response.data;
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        const arrayValue = Object.values(data).find(val => Array.isArray(val));
        if (arrayValue) {
          response.data = arrayValue;
        }
      }
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = Cookies.get('refresh_token');
        if (refreshToken) {
          const response = await axios.post('http://localhost:8000/api/auth/refresh/', {
            refresh: refreshToken,
          });
          const { access } = response.data;
          Cookies.set('access_token', access);
          api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, logout user
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
