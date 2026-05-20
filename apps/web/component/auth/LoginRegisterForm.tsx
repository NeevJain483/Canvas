"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import "@style/component/auth/index.css";
import "@style/component/auth/loginRegisterForm.css";
import { useAuthStore } from "@lib/store/authStore";
import { useShallow } from "zustand/shallow";
import Toast from "@component/common/Toast";
import Loading from "@component/common/Loading";

type FormType = {
  type: "register" | "login";
};

const Form: React.FC<FormType> = ({ type }) => {
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const { login, register, isLoading, success, clearMessage } = useAuthStore(
    useShallow((state) => ({
      login: state.login,
      register: state.register,
      isLoading: state.isLoading,
      error: state.error,
      success: state.success,
      clearMessage: state.clearMessage,
    })),
  );
  const router = useRouter();

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (type === "login") {
      login(data.email, data.password);
    } else if (type === "register") {
      const username = data.username || ".";
      register(data.email, data.password, username);
    }
  };
  if (isLoading) return <Loading />;

  if (success) {
    if (success.status === 201) {
      setTimeout(() => {
        clearMessage();
        router.push(`/auth/login`);
      }, 2000);
    } else if (success.status === 200) {
      setTimeout(() => {
        clearMessage();
        router.push(`/dashboard`);
      }, 2000);
    }
  }
  return (
    <>
      <div className="auth-form-container login-form-container">
        <form className="login-form-form" onSubmit={handleSubmit}>
          <h1>{type.charAt(0).toUpperCase() + type.slice(1)}</h1>
          {type === "register" && (
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={data.username}
              onChange={handleOnChange}
            />
          )}
          <input
            type="text"
            name="email"
            placeholder="Email"
            value={data.email}
            onChange={handleOnChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={data.password}
            onChange={handleOnChange}
          />
          {type === "login" && (
            <div className="login-form-forget-password-button-container">
              <button
                type="button"
                onClick={() =>
                  router.push(`/auth/forget-password`)
                }
              >
                Forget&nbsp;Password?
              </button>
            </div>
          )}
          <div className="auth-form-submit-button-container login-form-submit-button-container">
            <button className="sm-btn" type="submit">
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          </div>
        </form>
      </div>
      <Toast></Toast>
    </>
  );
};

export default Form;
