// src/utils/api.ts
import axios from "axios";
const BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://swiftpay-backend-djp0.onrender.com/api"
const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "https://swiftpay-backend-djp0.onrender.com/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("swiftpay_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));
// Add token dynamically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("swiftpay_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Optional: handle 401 / token expired
API.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      console.error("Unauthorized, please login again.");
    }
    return Promise.reject(err);
  }
);

export default API;
