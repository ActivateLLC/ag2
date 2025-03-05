import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle specific error cases here
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      // Handle auth token refresh or redirect to login
    }
    
    return Promise.reject(error);
  }
);

// Dashboard API
export const dashboardApi = {
  getSummary: () => api.get('/dashboard/summary'),
  getPerformanceMetrics: () => api.get('/metrics/performance'),
};

// Caregiver Metrics API
export const caregiverApi = {
  getAllCaregivers: () => api.get('/metrics/caregivers'),
  getCaregiverDetails: (id) => api.get(`/metrics/caregiver/${id}`),
};

// Workflow Management API
export const workflowApi = {
  getAllWorkflows: () => api.get('/workflows'),
  getWorkflowDetails: (id) => api.get(`/workflows/${id}`),
  triggerWorkflow: (id, payload) => api.post(`/workflows/${id}/trigger`, payload),
  createWorkflow: (workflowData) => api.post('/workflows', workflowData),
};

// Reports API
export const reportsApi = {
  generateReport: (reportData) => api.post('/reports/generate', reportData),
  getReportHistory: () => api.get('/reports/history'),
};

// Settings API
export const settingsApi = {
  getSettings: () => api.get('/settings'),
  updateSettings: (settings) => api.post('/settings', settings),
  testConnection: (url) => api.get(`/test-connection?url=${encodeURIComponent(url)}`),
};

export default api;
