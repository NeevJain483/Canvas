"use client";
import { useAuthStore } from "@lib/store/authStore";
import React from "react";
import { useShallow } from "zustand/shallow";

const SuccessGeneral = () => {
  const { clearMessage, success } = useAuthStore(
    useShallow((state) => ({
      clearMessage: state.clearMessage,
      success: state.success,
    })),
  );
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
          Success
        </h1>
        <p className="text-tertiary-fixed-dim text-center mb-3">
          {success?.message || ""}
        </p>
        <button
          onClick={() => {
            clearMessage();
          }}
          className="border border-[rgba(255,255,255,0.1)] w-full text-center py-3 mb-3 uppercase rounded-xl bg-primary-fixed-dim text-on-secondary font-semibold hover:scale-[1.03] transition-all duration-300"
        >
          Go Back
        </button>
      </section>
    </main>
  );
};

export default SuccessGeneral;
