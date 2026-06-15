"use client";
import ErrorGeneral from "@component/MessagePages/ErrorGeneral";
import SuccessAuth from "@component/MessagePages/SuccessAuth";
import { useAuthStore } from "@lib/store/authStore";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useShallow } from "zustand/shallow";

const ResetPassword = () => {
  const [data, setData] = useState({
    password: "",
    confirmPassword: "",
    code: "",
    togglePassword: false,
    toggleConfirmPassword: false,
  });

  const { resetPassword, error,success } = useAuthStore(
    useShallow((state) => ({
      resetPassword: state.resetPassword,
      success: state.success,
      error: state.error,
    })),
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (data.password === data.confirmPassword)
      resetPassword(data.password, data.code);
    else alert("password do not match");
  };

  if (error) {
    return <ErrorGeneral />;
  }

  if(success){
    return <SuccessAuth type="reset-password"/>
  }

  return (
    <main className="flex justify-center items-center p-6 min-h-screen">
      <section className="flex flex-col max-w-85 justify-center items-center">
        <h1 className="flex justify-center items-center gap-4 text-[24px] text-primary-fixed mb-8">
          <span className="material-symbols-outlined bg-primary-fixed-dim text-on-tertiary p-2 rounded-xl">
            brush
          </span>
          StudiosCanvasPro
        </h1>
        <div className="flex flex-col gap-3 justify-center items-center">
          <h2 className="text-[24px] font-semibold w-full">Reset Password</h2>
          <p className="text-[14px]">
            Secure your professional creative workspace by updating your
            credentials.
          </p>
          <form
            className="w-full border-b border-b-[rgba(255,255,255,0.08)]"
            onSubmit={handleSubmit}
          >
            <label className="text-[14px] uppercase font-mono font-semibold">
              Verification Code
            </label>
            <div className="relative w-full flex items-center group mb-3">
              <span className="material-symbols-outlined absolute left-2.5 text-white/40 transition-all duration-300 group-focus-within:text-primary-fixed-dim">
                dialpad
              </span>
              <input
                className="w-full px-12 py-3 outline-none border border-[rgba(255,255,255,0.08)] focus:border-primary-fixed-dim rounded-xl bg-on-tertiary-container/20"
                type={"text"}
                placeholder="6 Digit Code"
                value={data.code}
                onChange={(e) => {
                  setData({ ...data, code: e.target.value });
                }}
              />
            </div>
            <label className="text-[14px] uppercase font-mono font-semibold">
              New Password
            </label>
            <div className="relative w-full flex items-center group mb-3">
              <span className="material-symbols-outlined absolute left-2.5 text-white/40 transition-all duration-300 group-focus-within:text-primary-fixed-dim">
                lock
              </span>
              <input
                className="w-full px-12 py-3 outline-none border border-[rgba(255,255,255,0.08)] focus:border-primary-fixed-dim rounded-xl bg-on-tertiary-container/20"
                type={data.togglePassword ? "text" : "password"}
                placeholder="Min. 8 characters"
                value={data.password}
                onChange={(e) => {
                  setData({ ...data, password: e.target.value });
                }}
              />
              <button
                type="button"
                onClick={() =>
                  setData({ ...data, togglePassword: !data.togglePassword })
                }
                className="absolute right-2.5 flex justify-center items-center text-white/60 hover:text-white"
              >
                <span className="material-symbols-outlined">
                  {data.togglePassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>

            <label className="text-[14px] uppercase font-mono font-semibold">
              Confirm New Password
            </label>
            <div className="relative w-full flex items-center group mb-6">
              <span className="material-symbols-outlined absolute left-2.5 text-white/40 transition-all duration-300 group-focus-within:text-primary-fixed-dim">
                verified_user
              </span>
              <input
                className="w-full px-12 py-3 outline-none border border-[rgba(255,255,255,0.08)] focus:border-primary-fixed-dim rounded-xl bg-on-tertiary-container/20"
                type={data.toggleConfirmPassword ? "text" : "password"}
                placeholder="Re-enter password"
                value={data.confirmPassword}
                onChange={(e) => {
                  setData({ ...data, confirmPassword: e.target.value });
                }}
              />
              <button
                type="button"
                onClick={() =>
                  setData({
                    ...data,
                    toggleConfirmPassword: !data.toggleConfirmPassword,
                  })
                }
                className="absolute right-2.5 flex justify-center items-center text-white/60 hover:text-white"
              >
                <span className="material-symbols-outlined">
                  {data.toggleConfirmPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>

            <button
              type="submit"
              className="flex justify-center items-center w-full py-2 my-3 bg-primary-fixed-dim rounded-lg text-on-primary-fixed tracking-tight font-semibold font-mono uppercase hover:scale-[1.03] text-[17px] transition-transform duration-200 hover:cursor-pointer"
            >
              Update Password
              <span className="material-symbols-outlined ml-2">
                arrow_forward
              </span>
            </button>
          </form>

          <Link
            href="/auth/login"
            className="flex justify-center items-center mt-2 text-white/80 hover:text-white"
          >
            <span className="material-symbols-outlined mr-2">arrow_back</span>
            <span className="hover:underline">Back to Login</span>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default ResetPassword;
