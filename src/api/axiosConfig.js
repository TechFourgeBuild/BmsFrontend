import axios from "axios";
import { tokenRefreshed, logoutUser } from "../store/slices/authSlice";
import { store } from "../store";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor - Add token if exists
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// src/api/axiosConfig.js
// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ✅ Refresh endpoint khud 401 de toh turant logout
    if (originalRequest?.url?.includes("/refresh-token")) {
      
      await store.dispatch(logoutUser());
      window.location.href = "/login";
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axiosInstance.post(
          "/users/refresh-token",
          {},
          { withCredentials: true },
        );
        const newToken = res.data.accessToken;

        localStorage.setItem("token", newToken);
        store.dispatch(tokenRefreshed(newToken));

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        await store.dispatch(logoutUser());
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);
export default axiosInstance;