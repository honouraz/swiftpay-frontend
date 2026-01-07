// src/utils/api.ts
import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL 
    || "https://swiftpay-backend-djp0.onrender.com/api",
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("swiftpay_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
