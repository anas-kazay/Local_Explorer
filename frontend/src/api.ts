import axios from "axios";

// Create the axios instance without initial headers
const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
});

// Add an interceptor to dynamically set the token before each request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
