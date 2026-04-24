"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { FRONTEND_URL } from "../../lib/config";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const headerHeight = 50;
  const headerStyle: React.CSSProperties = {
    display: "flex",
    backgroundColor: "rgba(0,0,0,0)",
    justifyContent: "end",
    height: `${headerHeight}px`,
    alignItems: "center",
    paddingRight: "10px",
    gap: "10px",
  };
  const mainStyle: React.CSSProperties = {
    height: `calc(100vh - ${headerHeight}px)`,
    width: "100vw",
  };
  return (
    <>
      <header>
        <div style={headerStyle}>
          <button className="sm-btn"
            onClick={() => {
              router.push(`${FRONTEND_URL}/auth/login`);
            }}
          >
            Login
          </button>
          <button className="sm-btn"
            onClick={() => {
              router.push(`${FRONTEND_URL}/auth/register`);
            }}
          >
            Register
          </button>
        </div>
      </header>
      <main style={mainStyle}>{children}</main>
    </>
  );
}
