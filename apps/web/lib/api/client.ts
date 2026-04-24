import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "../store/authStore";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4002/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

interface CustomAxiosConfig extends InternalAxiosRequestConfig {
  _retry?: number;
}

apiClient.interceptors.request.use(
  (config: CustomAxiosConfig) => {
    const accessToken = useAuthStore.getState().accessToken;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    if (process.env.NODE_ENV === "development") {
      console.log(
        `%c[API REQUESET] ${config.method?.toUpperCase()} ${config.url}`,
        `color: #0066cc; font-weight: bold;`,
      );
      console.log("Headers:", config.headers);
      console.log("Data:", config.data);
    }

    return config;
  },
  (error) => {
    console.error("[REQUEST ERROR]", error);
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (process.env.NODE_ENV == "development") {
      console.log(
        `%c[API SUCCESS] ${response.status} ${response.config.url}`,
        "color: #00aa00; font-weight: bold",
      );
      console.log("Response:", response.data);
    }
    return response;
  },
  (error: AxiosError<any>) => {
    const originalRequest = error.config as CustomAxiosConfig;
    const status = error.response?.status;
    const errorMessage = error.response?.data?.message || error.message;

    if (process.env.NODE_ENV === "development") {
      const url = originalRequest?.url || "Unknown url";
      console.log(
        `%c[API ERROR] ${status} ${url}`,
        "color: #cc0000; font-weight: bold",
      );
      console.log("Error:", errorMessage);
      console.log("Full error:", error.response?.data);
    }

    if (status === 403) {
      console.error("[FORBIDDEN] You do not have permission for this resource");
    }

    if (status === 422) {
      const validationErrors = error.response?.data.errors || {};
      console.log("[VALIDAION ERROR]", validationErrors);
    }

    if (status === 429) {
      console.error("[RATE LIMITED] Too many requests. Try again later.");
    }

    if (status && status >= 500) {
      console.error("[SERVER ERROR] Internal server error");
    }

    if (!error.response) {
      console.error("[NETWORK ERROR] No response form server");
    }
    return Promise.reject(error);
  },
);

export default apiClient;
