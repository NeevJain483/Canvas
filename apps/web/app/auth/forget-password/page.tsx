"use client";
import Loading from "@component/common/Loading";
import ErrorGeneral from "@component/MessagePages/ErrorGeneral";
import SuccessAuth from "@component/MessagePages/SuccessAuth";
import { useAuthStore } from "@lib/store/authStore";
import Link from "next/link";
import React, { FormEvent, useState } from "react";
import { useShallow } from "zustand/shallow";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");

  const { isLoading, forgetPassword, success, clearMessage, error } =
    useAuthStore(
      useShallow((state) => ({
        error: state.error,
        success: state.success,
        isLoading: state.isLoading,
        clearMessage: state.clearMessage,
        forgetPassword: state.forgetPassword,
      })),
    );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    forgetPassword(email);
  };

  if (isLoading) return <Loading />;

  if (error) {
    return <ErrorGeneral />;
  }

  if (success) {
    return <SuccessAuth type="forget-password"/>
    return (
      <main className="flex justify-center items-center p-6 min-h-screen">
        <section className="flex flex-col justify-center items-center p-6 max-w-95 border border-primary-fixed-dim/30 shadow-black shadow-md gap-6 rounded-2xl">
          <div className="flex justify-center items-center p-3 bg-primary-fixed-dim/40 rounded-full">
            <span
              className="flex justify-center items-center material-symbols-outlined text-on-tertiary bg-primary-fixed-dim rounded-full shadow-sm shadow-primary-fixed"
              style={{ fontSize: "32px" }}
            >
              check
            </span>
          </div>
          <h1 className="text-[24px] font-semibold">Email Sent</h1>
          <p className="text-tertiary-fixed-dim text-center mb-3">
            
          </p>
          <Link
            href={"/auth/reset-password"}
            onClick={() => clearMessage()}
            className="border border-[rgba(255,255,255,0.1)] w-full text-center py-3 mb-3 uppercase rounded-xl"
          >
            Go to reset password
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full flex justify-center items-center px-6">
      <section className="max-w-112.5 flex flex-col justify-center items-center">
        <h1 className="flex justify-center items-center gap-4 text-[24px] text-primary-fixed mb-8">
          <span className="material-symbols-outlined bg-primary-fixed-dim text-on-tertiary p-2 rounded-xl">
            brush
          </span>
          StudiosCanvasPro
        </h1>
        <div className="flex flex-col justify-center p-6 border border-on-tertiary-container/40  border-t-4 border-t-primary-container rounded-2xl shadow-background">
          <h2 className="text-[24px] mb-2">Forgot Password?</h2>
          <p className="text-on-surface-variant/90 mb-8">
            Enter your verified email address to receive a secure recovery link
            for your StudioCanvas Pro account.
          </p>
          <form onSubmit={handleSubmit} className="w-full">
            <label className="uppercase font-mono text-[14px] text-on-surface-variant/90 mb-2">
              Email Address
            </label>
            <br />
            <div className="flex items-center relative group mb-4">
              <span className="material-symbols-outlined absolute left-3 text-on-surface-variant/90 group-focus-within:text-primary-fixed transition-all duration-300">
                alternate_email
              </span>
              <input
                className="w-full outline-none border px-12 py-4 text-[18px] rounded-xl bg-surface-container/40 border-[rgba(255,255,255,0.08)] focus:border-primary-fixed focus:shadow-primary-fixed shadow-sm transition-all duration-300"
                type="text"
                placeholder="designer@studiocanvas.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full p-4 flex items-center justify-center gap-2 bg-primary-fixed-dim text-on-tertiary-fixed font-bold tracking-wide rounded-lg hover:scale-[1.03] transition-all duration-300 mb-5"
            >
              Send OTP<span className="material-symbols-outlined">send</span>
            </button>
          </form>
          <Link
            className="w-full flex items-center justify-center p-4 gap-2 text-on-surface-variant/90 border-b border-b-on-tertiary-container/30 mb-3"
            href={"/auth/login"}
          >
            <span className="material-symbols-outlined">arrow_back</span>Back to
            Login
          </Link>
          <p className="text-center uppercase tracking-tight text-[12px] text-on-tertiary-fixed-variant">
            Protected by StudioShield<sup className="text-[8px]">TM</sup>
          </p>
        </div>
      </section>
    </main>
  );
};

export default ForgetPassword;
