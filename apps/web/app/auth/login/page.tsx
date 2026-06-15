"use client";

import Loading from "@component/common/Loading";
import ErrorLoginRegister from "@component/MessagePages/ErrorLoginRegister";
import SuccessLoginRegister from "@component/MessagePages/SuccessAuth";
import { useAuthStore } from "@lib/store/authStore";
import Link from "next/link";
import { useState } from "react";
import { useShallow } from "zustand/shallow";

const Login = () => {
  const [data, setData] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });

  const { login, isLoading, error, success } = useAuthStore(
    useShallow((state) => ({
      login: state.login,
      register: state.register,
      isLoading: state.isLoading,
      error: state.error,
      success: state.success,
      clearMessage: state.clearMessage,
    })),
  );
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await login(data.email, data.password);
  };
  if (isLoading) return <Loading />;

  if (success) {
    return <SuccessLoginRegister type={"login"} />;
  }

  if (error) {
    return <ErrorLoginRegister type="login" />;
  }

  return (
    <main className="min-h-screen flex flex-col md:flex-row overflow-hidden">
      <section className="relative hidden md:flex flex-1 items-center justify-center bg-surface-dim overflow-hidden p-xl">
        <div className="relative z-10 w-full max-w-2xl text-center">
          <div className="inline-flex items-center justify-center p-lg rounded-xl border border-[rgba(255,255,255,0.08)] mb-md">
            <span
              className="material-symbols-outlined text-primary-container"
              style={{
                fontVariationSettings: "'FILL' 1",
                fontSize: "64px",
                fontWeight: 700,
              }}
            >
              polyline
            </span>
          </div>
          <h1 className="font-sans text-[48px] font-medium text-primary-fixed mb-sm tracking-tighter">
            STUDIOCANVAS
          </h1>
        </div>
      </section>
      <section className="flex-1 flex flex-col justify-center items-center p-gutter md:p-xl bg-surface">
        <div className="w-full max-w-110 border border-[rgba(255,255,255,0.08)] p-xl rounded-xl shadow-2xl relative">
          <header className="mb-xl">
            <h2 className="font-sans text-[32px] tracking-tight font-medium mb-xs">
              Login - Pro
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Enter your credentials to access your studio.
            </p>
          </header>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-[14px] uppercase text-on-surface-variant font-mono font-semibold">
                Email
              </label>
              <input
                className="w-full h-12 px-md input-gradient border border-outline/20 rounded-lg text-on-surface outline-none"
                placeholder="Email"
                type="email"
                name="email"
                value={data.email}
                onChange={handleOnChange}
              />
            </div>
            <div>
              <label className="text-[14px] uppercase text-on-surface-variant font-mono font-semibold">
                Password
              </label>
              <input
                className="w-full h-12 px-md input-gradient border border-outline/20 rounded-lg text-on-surface outline-none"
                placeholder="Password"
                type="password"
                name="password"
                value={data.password}
                onChange={handleOnChange}
              />
              <div className="w-full flex justify-end">
                <Link
                  href={"/auth/forget-password"}
                  className="text-end text-on-surface-variant font-semibold font-mono hover:text-primary-fixed"
                >
                  Forget Password?
                </Link>
              </div>
            </div>
            <button
              type="submit"
              className="w-full h-14 bg-primary-container text-on-primary font-headline-md rounded-lg neon-glow hover:scale-[1.05] transition-all duration-300"
            >
              Login
            </button>
          </form>
          <footer className="mt-xl text-center">
            <p className="font-body-md text-body-md text-on-surface-variant">
              Don&#39;t have an account?{" "}
              <Link
                href={"/auth/register"}
                className="text-primary-container hover:underline"
              >
                Create workspace
              </Link>
            </p>
          </footer>
        </div>
      </section>
    </main>
  );
};

export default Login;
