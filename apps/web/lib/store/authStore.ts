import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import apiClient from "../api/client";
import {
  AuthResponseSchema,
  ForgetPasswordSchema,
  LoginSchema,
  RefreshTokenResponseSchema,
  RegisterSchema,
  ResetPasswordSchema,
} from "@repo/common/schema";

export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  profilePicUrl?: string;
  createdAt: string;
}

interface AuthStore {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: null | any;
  sessionExpiresAt: number | null;
  accessToken: string | null;
  refreshToken: string | null;
  success: { status: number; message: string } | null;

  // // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    username: string,
    password: string,
  ) => Promise<void>;
  logout: () => void;
  resetPassword: (newPassword: string, code: string) => Promise<void>;
  forgetPassword: (email: string) => Promise<void>;
  refreshAccessToken: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  clearError: () => void;
  clearSuccess: () => void;
  clearMessage: () => void;

  // // Selectors
  isSessionValid: () => boolean;
  getUserInitials: () => string;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    immer<AuthStore>((set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      sessionExpiresAt: null,
      accessToken: null,
      refreshToken: null,
      success: null,

      login: async (email, password) => {
        set((state: AuthStore) => {
          state.isLoading = true;
          state.error = null;
          state.success = null;
        });
        try {
          const validatedData = LoginSchema.parse({ email, password });
          const response = await apiClient.post("/auth/login", validatedData);
          const { user, accessToken, refreshToken, expiresIn, message } =
            AuthResponseSchema.parse(response.data);

          set((state: AuthStore) => {
            state.user = user;
            state.accessToken = accessToken;
            state.refreshToken = refreshToken;
            state.isAuthenticated = true;
            state.sessionExpiresAt = Date.now() + expiresIn * 1000;
            state.isLoading = false;
            state.success = { status: response.status, message };
          });

          apiClient.defaults.headers.common["Authorization"] =
            `Bearer ${accessToken}`;
        } catch (error: any) {
          set((state: AuthStore) => {
            state.error = error || "Login Failed";
            state.isLoading = false;
          });
          throw error;
        }
      },

      register: async (email: string, password: string, username: string) => {
        set((state: AuthStore) => {
          state.isLoading = true;
          state.error = null;
          state.success = null;
        });
        try {
          const validatedData = RegisterSchema.parse({
            email,
            username,
            password,
          });

          const response = await apiClient.post(
            "/auth/register",
            validatedData,
          );

          const { user, accessToken, refreshToken, expiresIn, message } =
            AuthResponseSchema.parse(response.data);

          set((state: AuthStore) => {
            state.user = user;
            state.accessToken = accessToken;
            state.refreshToken = refreshToken;
            state.isAuthenticated = true;
            state.sessionExpiresAt = Date.now() + expiresIn * 1000;
            state.isLoading = false;
            state.success = { status: response.status, message };
          });

          apiClient.defaults.headers.common["Authorization"] =
            `Bearer ${accessToken}`;
        } catch (error: any) {
          set((state: AuthStore) => {
            state.error = error || "Registration failed";
            state.isLoading = false;
          });
          throw error;
        }
      },

      logout: () => {
        set((state) => {
          state.user = null;
          state.accessToken = null;
          state.refreshToken = null;
          state.sessionExpiresAt = null;
          state.error = null;
          state.success = null;
        });

        delete apiClient.defaults.headers.common["Authorization"];
      },

      resetPassword: async (newPassword: string, code: string) => {
        set((state) => {
          state.error = null;
          state.isLoading = true;
          state.success = null;
        });

        try {
          const validatedData = ResetPasswordSchema.parse({
            newPassword,
            code,
          });
          const response = await apiClient.post(
            "/auth/reset-password",
            validatedData,
          );
          const { message } = response.data;
          set((state) => {
            state.isLoading = false;
            state.success = {
              status: response.status,
              message: message,
            };
          });
        } catch (error) {
          set((state) => {
            state.isLoading = false;
            state.error = error;
          });
        }
      },

      forgetPassword: async (email: string) => {
        set((state) => {
          state.isLoading = true;
          state.error = null;
          state.success = null;
        });
        try {
          const validatedData = ForgetPasswordSchema.parse({ email });
          const response = await apiClient.post(
            "/auth/forget-password",
            validatedData,
          );
          set((state) => {
            state.isLoading = false;
            state.success = {
              status: 200,
              message: response.data.message || "Email is sent",
            };
          });
        } catch (error: any) {
          set((state) => {
            state.error = error;
            state.isLoading = false;
          });
        }
      },

      refreshAccessToken: async () => {
        try {
          const res = await apiClient.post("/auth/refresh-token");
          const { accessToken, expiresIn } = RefreshTokenResponseSchema.parse(
            res.data,
          );
          set((state: AuthStore) => {
            state.accessToken = accessToken;
            state.sessionExpiresAt = Date.now() + expiresIn * 1000;
          });

          apiClient.defaults.headers.common["Authorization"] =
            `Bearer ${accessToken}`;
        } catch (error) {
          get().logout();
          throw error;
        }
      },

      // TODO: complete this
      updateProfile: async (userData: Partial<User>) => {
        set((state: AuthStore) => {
          state.isLoading = true;
          state.error = null;
        });
        console.log(userData);
        try {
          // const res = await apiClient.put("");
        } catch (error) {
          console.log(error);
        }
      },

      clearError: () => {
        set((state) => {
          state.error = null;
        });
      },
      clearSuccess: () => {
        set((state) => {
          state.success = null;
        });
      },

      clearMessage: () => {
        get().clearError();
        get().clearSuccess();
      },

      isSessionValid: () => {
        const { isAuthenticated, sessionExpiresAt } = get();
        if (!isAuthenticated || !sessionExpiresAt) return false;
        return Date.now() < sessionExpiresAt;
      },

      getUserInitials: () => {
        const { user } = get();
        if (!user || !user.firstName || !user.lastName) return "";
        return `${user.firstName[0]}${user.lastName}`.toUpperCase();
      },
    })),
    {
      name: "auth-store",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        sessionExpiresAt: state.sessionExpiresAt,
      }),
    },
  ),
);
