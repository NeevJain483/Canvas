"use client";
import React, { useState } from "react";
import { useShallow } from "zustand/shallow";
import { useAuthStore } from "@lib/store/authStore";
import Link from "next/link";
import Loading from "@component/common/Loading";
import ErrorLoginRegisterPage from "@component/MessagePages/ErrorLoginRegister";
import SuccessLoginRegister from "@component/MessagePages/SuccessAuth";

const Register = () => {
  const [data, setData] = useState<{
    username: string;
    email: string;
    password: string;
  }>({ username: "", email: "", password: "" });

  const { register, isLoading, success, error } = useAuthStore(
    useShallow((state) => ({
      login: state.login,
      register: state.register,
      isLoading: state.isLoading,
      error: state.error,
      success: state.success,
      clearMessage: state.clearMessage,
    })),
  );

  if (isLoading) return <Loading />;

  if (success) {
    return <SuccessLoginRegister type="register" />;
  }

  if (error) {
    return <ErrorLoginRegisterPage type="register" />;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (data) await register(data.email, data.password, data.username);
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <main className="w-screen min-h-screen flex flex-col md:flex-row">
      <section className="hidden w-full md:w-1/2 md:flex items-center justify-center p-xl overflow-hidden border-r border-white/5 bg-surface-container-lowest gap-4">
        <div className="relative z-10">
          <div className="flex items-center gap-sm mb-xl cursor-pointer">
            <span
              className="material-symbols-outlined text-primary-container"
              style={{ fontVariationSettings: "'FILL' 1", fontSize: "42px" }}
            >
              palette
            </span>
            <h1 className="font-sans text-[28px] font-bold text-on-surface tracking-tight">
              StudioCanvas
            </h1>
          </div>
          <h2 className="font-sans text-[48px] font-bold leading-tight text-white mb-md">
            Define the future of{" "}
            <span className="text-primary-container">digital art.</span>
          </h2>
          <img
            alt="Showcase"
            className="rounded-xl border border-white/10 shadow-2xl relative z-10 w-full object-cover aspect-video"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-Dk2XF9FKz-fqy78UMFqb8Ie7pd7-CJOGWJP6xO_Ah1QS9Ed5r_Xvzpda-t6cqaQUlwSh_YnvOA6MixIWSUUsWvPU4sRc2ZmS63i2DVzEZA1_12yi83SktPeJaq1p1-t1UhwJoMQAIJ0wNCgzmLt8GvSNPTpAjBDvDzkjdrqbRJiVuZLcOoPHjmnPl1NmfsJm-JHX8I_UcrGKXkT4DLICKfHV-zrNPXOR_X87A2h6-B7CW01fLULBypEoH4wfQ5rWpnspD3d6nP6h"
          />
        </div>
      </section>
      <section className="w-full md:w-1/2 flex items-center justify-center p-md md:p-xl bg-background/60">
        <div className="w-full border border-[rgba(255,255,255,0.08)] p-xl rounded-xl shadow-2xl">
          <div className="mb-xl text-white">
            <h3 className="font-sans text-headline-md mb-xs">
              Create your workspace
            </h3>
            <p className="font-body-md text-on-surface-variant">
              Start your 14-day Pro trial today.
            </p>
          </div>
          <form className="space-y-lg" onSubmit={handleSubmit}>
            <div className="space-y-xs">
              <label className="font-label-md text-label-md text-on-surface-variant uppercase px-1">
                User Name
              </label>
              <input
                className="w-full bg-surface-container-lowest border border-white/10 rounded-lg py-sm px-md text-body-md text-on-surface focus:border-primary-container outline-none"
                placeholder="Alex Smith"
                type="text"
                name="username"
                onChange={handleOnChange}
                value={data.username}
              />
            </div>
            <div className="space-y-xs">
              <label className="font-label-md text-label-md text-on-surface-variant uppercase px-1">
                Email Address
              </label>
              <input
                className="w-full bg-surface-container-lowest border border-white/10 rounded-lg py-sm px-md text-body-md text-on-surface focus:border-primary-container outline-none"
                placeholder="designer@studio.pro"
                type="email"
                name="email"
                onChange={handleOnChange}
                value={data.email}
              />
            </div>
            <div className="space-y-xs">
              <label className="font-label-md text-label-md text-on-surface-variant uppercase px-1">
                Password
              </label>
              <input
                className="w-full bg-surface-container-lowest border border-white/10 rounded-lg py-sm px-md text-body-md text-on-surface focus:border-primary-container outline-none"
                placeholder="••••••••"
                type="password"
                name="password"
                onChange={handleOnChange}
                value={data.password}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary-container text-on-primary py-md rounded-lg font-sans text-[16px] font-bold transition-all hover:scale-[1.02]"
            >
              Create Account
            </button>
          </form>
          <p className="mt-xl text-center font-body-md text-on-surface-variant">
            Already using StudioCanvas?{" "}
            <Link
              href={"/auth/login"}
              className="text-primary-container font-semibold hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default Register;
