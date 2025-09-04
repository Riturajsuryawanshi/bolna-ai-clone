import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const message = error.response?.data?.error || 'An error occurred';
    toast.error(message);
    return Promise.reject(error);
  }
);

// Agent API
export const agentAPI = {
  getTemplates: () => api.get('/agent/templates'),
  create: (data) => api.post('/agent/create', data),
  list: () => api.get('/agent/list'),
  get: (id) => api.get(`/agent/${id}`),
  update: (id, data) => api.put(`/agent/${id}`, data),
  delete: (id) => api.delete(`/agent/${id}`)
};

// Call API
export const callAPI = {
  start: (data) => api.post('/call/start', data),
  batch: (data) => api.post('/call/batch', data),
  getStatus: (id) => api.get(`/call/status/${id}`),
  list: (params) => api.get('/call/list', { params }),
  end: (id) => api.post(`/call/${id}/end`)
};

// Analytics API
export const analyticsAPI = {
  getOverview: () => api.get('/analytics/overview'),
  getTranscripts: (params) => api.get('/analytics/transcripts', { params }),
  getPerformance: (params) => api.get('/analytics/performance', { params })
};

export default api;