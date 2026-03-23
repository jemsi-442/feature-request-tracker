import axios from "axios";

const PRODUCTION_API_URL = "http://localhost:5001/api";
const baseURL = import.meta.env.VITE_API_URL || PRODUCTION_API_URL;

const instance = axios.create({
  baseURL,
  withCredentials: true, // optional if backend uses cookies
});

// Request interceptor: attach token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // JWT stored in localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (optional: handle errors globally)
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default instance;
