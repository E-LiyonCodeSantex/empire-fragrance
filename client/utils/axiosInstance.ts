// utils/axiosInstance.ts
import axios from "axios";


interface RefreshResponse { 
  accessToken: string; 
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // ✅ allow cookies for refresh token
});

// Request interceptor: attach access token
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    if (token) {
      // Ensure headers object exists
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle expired tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const token = localStorage.getItem("authToken");
      if (token) {
        // Token existed but failed → force logout 
        localStorage.removeItem("authToken");
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
