"use client";
import { LoginSchema, RegisterSchema } from "@repo/common/schema";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FRONTEND_URL } from "../../script/config";

import "../../style/component/auth/index.css";
import "../../style/component/auth/loginRegisterForm.css";

type FormType = {
  type: "register" | "login";
};

const Form: React.FC<FormType> = ({ type }) => {
  const [data, setData] = useState<{
    username?: string;
    email: string;
    password: string;
  }>({ username: "", password: "", email: "" });
  const router = useRouter();

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    let parsedSchema;
    if (type == "login") {
      parsedSchema = LoginSchema.safeParse(data);
      if (!parsedSchema.success) {
        alert(parsedSchema.error);
        setData({ email: "", password: "" });
        return;
      }
    } else if (type == "register") {
      parsedSchema = RegisterSchema.safeParse(data);
      if (!parsedSchema.success) {
        alert(parsedSchema.error);
        setData({ email: "", password: "", username: "" });
        return;
      }
    }
    try {
      const response = await axios.post(`${backendUrl}/auth/${type}`, data);
      if (response.status === 201) {
        alert("user created");
        router.push(`${FRONTEND_URL}/auth/login`);
      } else if (response.status == 200) {
        alert("logged in");
        router.push(`${FRONTEND_URL}/dashboard`);
      }
    } catch (err: any) {
      if (err.response || err.response.status) {
        console.log(err.response.status);
      }
    }
  };

  return (
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
                router.push(`${FRONTEND_URL}/auth/forget-password`)
              }
            >
              Forget Password?
            </button>
          </div>
        )}
        <div className="auth-form-submit-button-container login-form-submit-button-container">
          <button type="submit">
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;
