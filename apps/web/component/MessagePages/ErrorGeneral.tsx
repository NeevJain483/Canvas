"use client";
import { useAuthStore } from "@lib/store/authStore";
import { handleApiError } from "@lib/utils";
import Link from "next/link";
import React from "react";
import { useShallow } from "zustand/shallow";

const ErrorGeneral = () => {
  const { error, clearError } = useAuthStore(
    useShallow((state) => ({
      error: state.error,
      clearError: state.clearError,
    })),
  );

  const handleTryAgain = () => {
    clearError();
  };

  return (
    <main className="h-screen w-screen flex items-center justify-center p-2">
      <section className="max-w-120 flex flex-col justify-center items-center gap-4 p-6 border border-[rgba(255,255,255,0.08)] rounded-xl shadow-2xl bg-linear-300 from-primary-container/20 to-on-primary-container/20">
        <span className="border p-2 flex border-[rgba(255,255,255,0.08)] justify-center items-center rounded-full shadow-md">
          <span
            className="material-symbols-outlined"
            style={{ color: "rgba(255,0,0,0.5)", fontSize: "32px" }}
          >
            cloud_off
          </span>
        </span>
        <h3 className="font-snas font-bold tracking-tight text-[24px] text-tertiary">
          Something Went Wrong
        </h3>
        <p className="font-sans font-medium text-[14px] text-center text-tertiary-fixed">
          StudioCanvas Pro encountered an unexpected <br /> interruption. We
          couldn&#39;t sync your current session <br /> with the cloud.
        </p>
        <div className="w-full">
          <p className="font-mono tracking-tight text-[10px]">ERROR CONTEXT</p>
          <div className="grid grid-cols-12 p-2 bg-on-primary-fixed/80 text-[12px] font-extralight">
            <span className="col-span-11 text-wrap px-1">
              {handleApiError(error)}
            </span>
            <span
              className="material-symbols-outlined col-span-1"
              style={{ fontSize: "16px" }}
            >
              error
            </span>
          </div>
        </div>
        <div className="flex gap-4 w-full">
          <button
            className="flex-1 bg-primary-fixed-dim text-on-primary py-2 text-[14px] font-bold text-center flex justify-center items-center mb-1  hover:scale-[1.02] hover:shadow-sm rounded-sm transition-all duration-300"
            onClick={handleTryAgain}
          >
            <span className="material-symbols-outlined mr-1">refresh</span>
            Refresh
          </button>
          <Link
            href={"/dashboard"}
            className="flex-1 p-2 border-2 border-primary text-primary rounded-sm text-[14px] tracking-tight flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all duration-300"
          >
            Go to Dashboard
          </Link>
        </div>
        <div>
          <p className="flex justify-center items-center text-[12px] text-tertiary-fixed-dim">
            Contact System Administrator
            <span
              className="material-symbols-outlined ml-1"
              style={{ fontSize: "16px" }}
            >
              open_in_new
            </span>
          </p>
        </div>
      </section>
    </main>
  );
};

export default ErrorGeneral;
