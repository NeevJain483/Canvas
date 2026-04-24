"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useShallow } from "zustand/shallow";

import Loading from "../common/Loading";
import "../../style/component/auth/index.css";
import "../../style/component/auth/forgetPassword.css";
import { useAuthStore } from "../../lib/store/authStore";
import Toast from "../common/Toast";

const ForgetPasswordForm = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const { isLoading, forgetPassword, success, clearMessage } = useAuthStore(
    useShallow((state) => ({
      isLoading: state.isLoading,
      forgetPassword: state.forgetPassword,
      success: state.success,
      clearMessage: state.clearMessage,
    })),
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    forgetPassword(email);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (success && success.status === 200) {
    setTimeout(() => {
      clearMessage()
      router.push(`/auth/reset-password`);
    }, 2000);
  }

  return (
    <div className="auth-form-container forget-password-form-container">
      <form onSubmit={handleSubmit}>
        <h1>Forget Password?</h1>
        <input
          type="text"
          placeholder="Email"
          name="email"
          value={email}
          onChange={handleChange}
        />
        <div className="auth-form-submit-button-container forget-password-form-submit-button-container">
          <button className="sm-btn" type="submit">
            Submit
          </button>
        </div>
      </form>
      <Toast />
    </div>
  );
};

export default ForgetPasswordForm;
