import axios from 'axios';

const API_BASE_URL = 'https://keyshield.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getStats = () => api.get('/stats');
export const getProcesses = (search = '') => api.get(`/processes?search=${search}`);
export const getThreats = () => api.get('/threats');
export const runScan = () => api.post('/scan');
export const terminateProcess = (pid: number) => api.post(`/terminate/${pid}`);
export const getLogs = () => api.get('/logs');
export const toggleSimulation = (enabled: boolean) => api.post('/simulation', { enabled });

export default api;
