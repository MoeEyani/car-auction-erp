// src/services/api.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging and auth
apiClient.interceptors.request.use(
  (config) => {
    console.log('API Request:', {
      method: config.method,
      url: config.url,
      baseURL: config.baseURL,
      data: config.data,
    });
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for debugging and auth errors
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error('API Response Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });

    // Handle authentication errors
    if (error.response?.status === 401) {
      // Clear auth data and redirect to login
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      delete apiClient.defaults.headers.common['Authorization'];
      
      // Only reload if we're not already on the login page
      if (!window.location.pathname.includes('/login')) {
        window.location.reload();
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;