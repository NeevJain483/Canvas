"use client";
import React from "react";
import axios from "axios";
import { ZodError } from "zod";
import { useShallow } from "zustand/shallow";

import { useAuthStore } from "@lib/store/authStore";
import "@style/component/common/toast.css";

const Toast = () => {
  const { error, success } = useAuthStore(
    useShallow((state) => ({
      error: state.error,
      success: state.success,
    })),
  );

  if (!error && !success) {
    return null;
  }

  if (error && error instanceof ZodError) {
    return (
      <>
        <Skeleton>
          <span className="message">
            {error.issues.map((el, idx) => {
              return (
                <>
                  <p key={idx}>
                    {el.path.join(".")}:{el.message}
                  </p>
                </>
              );
            })}
          </span>
        </Skeleton>
      </>
    );
  }

  return (
    <Skeleton>
      {error && typeof error === "string" && (
        <span className="message">{error}</span>
      )}

      {error && axios.isAxiosError(error) && (
        <span className="message">{error.response?.data.message || error.message}</span>
      )}

      {success && (
        <span className="message">{success.message} Redirecting page.....</span>
      )}

    </Skeleton>
  );
};

const Skeleton = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const { clearError, error } = useAuthStore(
    useShallow((state) => ({
      clearError: state.clearError,
      error: state.error,
      success: state.success,
    })),
  );

  const handleClose = () => {
    clearError();
  };

  return (
    <>
      <div
        style={{ background: error ? "rgb(166, 0, 0)" : "rgb(0, 152, 0)" }}
        className="container"
      >
        {children}
        <button className="close-btn" onClick={handleClose}>
          X
        </button>
      </div>
    </>
  );
};

export default Toast;
