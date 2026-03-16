// API service – centralises all HTTP calls to the SharkHire backend
// TODO: Set VITE_API_URL in a .env file at the frontend root if needed
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Attach JWT token to every request if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Auth ---
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

// --- Jobs ---
export const getJobs = () => API.get('/jobs');
export const getJobById = (id) => API.get(`/jobs/${id}`);
export const createJob = (data) => API.post('/jobs', data);
export const updateJob = (id, data) => API.put(`/jobs/${id}`, data);
export const deleteJob = (id) => API.delete(`/jobs/${id}`);

// --- Applications ---
export const getApplications = () => API.get('/applications');
export const getApplicationById = (id) => API.get(`/applications/${id}`);
export const createApplication = (data) => API.post('/applications', data);
export const updateApplication = (id, data) => API.put(`/applications/${id}`, data);
export const deleteApplication = (id) => API.delete(`/applications/${id}`);

export default API;
