import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "@lib/store/authStore";

const apiClient = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4002/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

interface CustomAxiosConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// --- REQUEST INTERCEPTOR ---
apiClient.interceptors.request.use(
  (config: CustomAxiosConfig) => {
    const state = useAuthStore.getState();
    const accessToken = state.accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    } else {
      console.warn("[INTERCEPTOR] No access token found in Zustand");
    }

    if (process.env.NODE_ENV === "development") {
      console.log(
        `%c[API REQUEST] ${config.method?.toUpperCase()} ${config.url}`,
        `color: #0066cc; font-weight: bold;`,
      );
    }

    return config;
  },
  (error) => {
    console.error("[REQUEST ERROR]", error);
    return Promise.reject(error);
  },
);

// --- RESPONSE INTERCEPTOR ---
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `%c[API SUCCESS] ${response.status} ${response.config.url}`,
        "color: #00bb00; font-weight: bold",
      );
    }
    return response;
  },
  async (error: AxiosError<any>) => {
    const originalRequest = error.config as CustomAxiosConfig;
    const status = error.response?.status;
    const errorMessage = error.response?.data?.message || error.message;

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await useAuthStore.getState().refreshAccessToken();

        const state = useAuthStore.getState();
        const newAccessToken = state.accessToken;

        if (newAccessToken && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    if (process.env.NODE_ENV === "development") {
      const url = originalRequest?.url || "Unknown url";
      console.log(
        `%c[API ERROR] ${status} ${url}`,
        "color: #cc0000; font-weight: bold",
      );
      console.log("Error Message:", errorMessage);
    }

    if (status === 403) {
      console.error("[FORBIDDEN] Access denied.");
    }

    if (status === 422) {
      console.log("[VALIDATION ERROR]", error.response?.data.errors || {});
    }

    if (status === 429) {
      console.error("[RATE LIMITED] Slow down!");
    }

    if (status && status >= 500) {
      console.error("[SERVER ERROR] Something went wrong on our end.");
    }

    if (!error.response) {
      console.error("[NETWORK ERROR] Check your internet connection.");
    }

    return Promise.reject(error);
  },
);

export default apiClient;
