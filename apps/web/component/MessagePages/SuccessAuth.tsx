import { useAuthStore } from "@lib/store/authStore";
import Link from "next/link";
import React from "react";
import { useShallow } from "zustand/shallow";

const SuccessAuth = ({
  type,
}: {
  type: "login" | "register" | "reset-password" | "forget-password";
}) => {
  const { clearMessage } = useAuthStore(
    useShallow((state) => ({
      clearMessage: state.clearMessage,
    })),
  );

  const link = (): string => {
    switch (type) {
      case "forget-password":
        return "/auth/reset-password";
      case "reset-password":
        return "/auth/login";
      default:
        return "/dashboard";
    }
  };

  return (
    <main className="h-screen flex justify-center items-center">
      <section className="flex flex-col justify-center items-center p-6 max-w-95 border border-primary-fixed-dim/30 shadow-black shadow-md gap-6 rounded-2xl">
        <div className="flex justify-center items-center p-3 bg-primary-fixed-dim/40 rounded-full">
          <span
            className="flex justify-center items-center material-symbols-outlined text-on-tertiary bg-primary-fixed-dim rounded-full shadow-sm shadow-primary-fixed"
            style={{ fontSize: "32px" }}
          >
            check
          </span>
        </div>
        <h1 className="text-[24px] font-semibold bg-linear-to-b from-primary-fixed-dim to-[#00ccff] bg-clip-text text-transparent">
          {type === "register" && "Account Created"}
          {type === "login" && "Welcome back"}
          {type === "forget-password" && "Mail Sent"}
          {type === "reset-password" && "Password Updated"}
        </h1>
        <p className="text-tertiary-fixed-dim text-center mb-3">
          {type === "register" &&
            "Your workspace is ready. Experience the next generation of creative engineering with StudioCanvas Pro&#39;s advanced asset engine."}

          {type === "login" &&
            "Welcome Back. Your workspace is ready for the next iteration of brilliance."}
          {type === "reset-password" &&
            "Check your inbox for instructions to reset your password. The link expires in 20 minutes."}
          {type === "reset-password" &&
            "Your credentials have been securely updated. You can now log back into your professional creative workspace with your new password."}
        </p>
        <Link
          href={link()}
          onClick={() => clearMessage()}
          className="border border-[rgba(255,255,255,0.1)] w-full text-center py-3 mb-3 uppercase rounded-xl bg-primary-fixed-dim text-on-secondary font-semibold hover:scale-[1.03] transition-all duration-300"
        >
          {type === "register" || (type === "login" && "Get Started")}
          {type === "forget-password" && "Reset Password"}
        </Link>
      </section>
    </main>
  );
};

export default SuccessAuth;
