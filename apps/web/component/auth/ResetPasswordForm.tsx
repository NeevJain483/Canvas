"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useShallow } from "zustand/shallow";

import "@style/component/auth/index.css";
import "@style/component/auth/resetPassword.css";
import { useAuthStore } from "@lib/store/authStore";
import Toast from "@component/common/Toast";
import Loading from "@component/common/Loading";

const ResetPasswordForm = () => {
  const [data, setData] = React.useState<{ newPassword: string; code: string }>(
    {
      newPassword: "",
      code: "",
    },
  );

  const { isLoading, resetPassword, success, clearMessage } = useAuthStore(
    useShallow((state) => ({
      isLoading: state.isLoading,
      resetPassword: state.resetPassword,
      success: state.success,
      clearMessage: state.clearMessage,
    })),
  );

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetPassword(data.newPassword, data.code);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { name, value } = e.target;
    setData((el) => ({ ...el, [name]: value }));
  };

  if (isLoading) {
    return <Loading />;
  }

  if (success && success.status === 200) {
    setTimeout(() => {
      clearMessage();
      router.push("/auth/login");
    }, 2000);
  }

  return (
    <>
      <div className="auth-form-container reset-password-form-container">
        <form onSubmit={handleSubmit}>
          <h1>New Password</h1>
          <input
            type="password"
            placeholder="New Password"
            name="newPassword"
            value={data.newPassword}
            onChange={handleChange}
          />
          <input
            type="number"
            placeholder="Verification Code"
            name="code"
            value={data.code}
            onChange={handleChange}
          />
          <div className="auth-form-submit-button-container reset-password-form-submit-button-container">
            <button className="sm-btn">Submit</button>
          </div>
        </form>
        <Toast />
      </div>
    </>
  );
};

export default ResetPasswordForm;
