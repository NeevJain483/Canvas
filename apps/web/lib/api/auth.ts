import apiClient from "./client";
import {
  LoginSchema,
  RegisterSchema,
  ForgetPasswordSchema,
  ResetPasswordSchema,
  VerifyEmailSchema,
  AuthResponseSchema,
  RefreshTokenResponseSchema,
  AuthResponseType,
  RefreshTokenResponseType,
} from "@repo/common/schema";

export const authAPI = {
  login: async (email: string, password: string): Promise<AuthResponseType> => {
    try {
      const validatedData = LoginSchema.parse({ email, password });
      const response = await apiClient.post("/auth/login", validatedData);
      return AuthResponseSchema.parse(response.data);
    } catch (error) {
      throw new Error(`Login failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
  register: async (
    email: string,
    username: string,
    password: string,
    firstName?: string,
    lastName?: string,
  ): Promise<AuthResponseType> => {
    try {
      const validatedData = RegisterSchema.parse({
        email,
        username,
        password,
        first_name: firstName,
        last_name: lastName,
      });

      const response = await apiClient.post("/auth/register", validatedData);

      return AuthResponseSchema.parse(response.data);
    } catch (error) {
      throw new Error(`Register failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
  refreshToken: async (
    refreshToken: string,
  ): Promise<RefreshTokenResponseType> => {
    try {
      const response = await apiClient.post("/auth/refresh-token", {
        refreshToken,
      });

      return RefreshTokenResponseSchema.parse(response.data);
    } catch (error) {
      throw new Error(`Refresh token failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout");
  },
  forgotPassword: async (email: string): Promise<{ message: string }> => {
    try {
      const validatedData = ForgetPasswordSchema.parse({ email });

      const response = await apiClient.post(
        "/auth/forgot-password",
        validatedData,
      );
      return response.data;
    } catch (error) {
      throw new Error(`Forgot password failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
  resetPassword: async (
    newPassword: string,
    code: string,
  ): Promise<{ message: string }> => {
    try {
      const validatedData = ResetPasswordSchema.parse({
        newPass: newPassword,
        code,
      });

      const response = await apiClient.post(
        "/auth/reset-password",
        validatedData,
      );
      return response.data;
    } catch (error) {
      throw new Error(`Reset password failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
  verifyEmail: async (
    email: string,
    code?: string,
  ): Promise<{ message: string }> => {
    try {
      const validatedData = VerifyEmailSchema.parse({ email, code });

      const response = await apiClient.post("/auth/verify-email", validatedData);
      return response.data;
    } catch (error) {
      throw new Error(`Verify email failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
};

export default authAPI;
