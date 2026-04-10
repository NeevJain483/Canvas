"use client";
import axios from "axios";
import React from "react";
import { BACKEND_URL } from "../../script/config";
import { ResetPasswordSchema } from "@repo/common/schema";

import "../../style/component/auth/index.css"
import "../../style/component/auth/resetPassword.css" 
import { useRouter } from "next/navigation";
import { FRONTEND_URL } from "@repo/common/config";

const ResetPasswordForm = () => {
  const [data, setData] = React.useState<{ newPass: string; code: string }>({
    newPass: "",
    code: "",
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parsedData = ResetPasswordSchema.safeParse(data);
    if (!parsedData.success) {
      alert(parsedData.error);
      setData({
        newPass: "",
        code: "",
      });
      return;
    }
    try {
      const response = await axios.post(
        `${BACKEND_URL}/auth/reset-password`,
        data,
        { withCredentials: true },
      );
      router.push(`${FRONTEND_URL}/auth/login`)      
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { name, value } = e.target;
    setData((el) => ({ ...el, [name]: value }));
  };

  return (
    <>
      <div className="auth-form-container reset-password-form-container">
        <form onSubmit={handleSubmit}>
          <h1>New Password</h1>
          <input
            type="text"
            placeholder="New Password"
            name="newPass"
            value={data.newPass}
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
            <button>Submit</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ResetPasswordForm;
