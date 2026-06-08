import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5002";

const axiosInstance = axios.create({
  baseURL: `${BACKEND_URL}/api`, // Proxy to backend server
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default axiosInstance;
