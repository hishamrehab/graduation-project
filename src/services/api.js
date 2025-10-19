import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
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

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
};

// Chat APIs
export const chatAPI = {
  startSession: () => api.post('/chat/session/start'),
  sendMessage: (sessionId, message) =>
    api.post('/chat/message', { session_id: sessionId, message }),
  getHistory: (sessionId) => api.get(`/chat/session/${sessionId}/history`),
  endSession: (sessionId) => api.post(`/chat/session/${sessionId}/end`),
  getUserSessions: () => api.get('/chat/sessions'),
  deleteSession: (sessionId) => api.delete(`/chat/session/${sessionId}`),
};

// Health check
export const healthCheck = () => api.get('/health');

export default api;
