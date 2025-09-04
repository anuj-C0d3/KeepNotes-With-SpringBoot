import axios from "axios";

// Use VITE_API_URL from environment variables
const Request_URL = import.meta.env.VITE_API_URL;

export const axiosInstance = axios.create({
  baseURL: Request_URL,
});

// Add Authorization header if token exists
axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
