"use client";
import axios from "axios";
import { BACKEND_URL, FRONTEND_URL } from "../../script/config";
import { useState } from "react";
import { ForgetPasswordSchema } from "@repo/common/schema";
import { useRouter } from "next/navigation";

import "../../style/component/auth/index.css"
import "../../style/component/auth/forgetPassword.css";

const ForgetPasswordForm = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parsedData = ForgetPasswordSchema.safeParse({ email });
    if (!parsedData.success) {
      alert(parsedData.error);
      setEmail("");
      return;
    }
    try {
      const response = await axios.post(
        `${BACKEND_URL}/auth/forget-password`,
        { email },
        { withCredentials: true },
      );
      if (response.status === 200) {
        router.push(`${FRONTEND_URL}/auth/reset-password`);
      }
    } catch (error) {
      console.log(error);
    }
  };
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
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default ForgetPasswordForm;
