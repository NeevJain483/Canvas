"use client";
import React from "react";
import Navbar from "@component/layout/auth/Navbar";

import "@style/component/layout/auth/index.css";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="auth-layout">
          <Navbar></Navbar>
          {children}
      </div>
    </>
  );
}
