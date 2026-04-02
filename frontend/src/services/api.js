/* frontend/src/services/api.js */
import axios from "axios";

/**
 * ⚡ CENTRALIZED AXIOS INSTANCE
 * Ensures all API calls are directed to the Backend server.
 */
export const BASE_URL = import.meta.env.VITE_API_URL || "";

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {},
  withCredentials: true,
});

// Request Interceptor: Optional (e.g. for dynamic token injection)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
