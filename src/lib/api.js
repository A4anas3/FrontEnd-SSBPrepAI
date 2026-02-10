import axios from "axios";
import {
  getAccessToken,
  login,
  refreshAccessToken,
  isTokenExpiringSoon,
} from "@/lib/authApi";

// ✅ Use environment variables for API base URL
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// 🔄 Flag to prevent multiple refresh attempts
let isRefreshing = false;
let refreshPromise = null;

// ✅ Request interceptor: Attach access token & proactive refresh
api.interceptors.request.use(
  async (config) => {
    // Only proactively refresh if we have a token that's expiring
    if (isTokenExpiringSoon() && !isRefreshing) {
      isRefreshing = true;
      try {
        refreshPromise = refreshAccessToken();
        await refreshPromise;
      } catch (err) {
        if (import.meta.env.DEV) {
          console.warn("Proactive token refresh failed:", err.message);
        }
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    }

    // Wait for ongoing refresh if any
    if (isRefreshing && refreshPromise) {
      await refreshPromise;
    }

    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ✅ Response interceptor: Handle 401 with refresh token retry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // If already refreshing, wait for it
      if (isRefreshing) {
        try {
          await refreshPromise;
          originalRequest.headers.Authorization = `Bearer ${getAccessToken()}`;
          return api(originalRequest);
        } catch {
          login();
          return Promise.reject(error);
        }
      }

      // Try to refresh token
      isRefreshing = true;
      try {
        refreshPromise = refreshAccessToken();
        await refreshPromise;
        isRefreshing = false;
        refreshPromise = null;

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${getAccessToken()}`;
        return api(originalRequest);
      } catch {
        isRefreshing = false;
        refreshPromise = null;
        // Clear only tokens, not return_url
        localStorage.removeItem("access_token");
        localStorage.removeItem("id_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("token_expires_at");
        login();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
