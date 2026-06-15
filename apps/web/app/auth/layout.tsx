"use client";
import Loading from "@component/common/Loading";
import { useAuthStore } from "@lib/store/authStore";
import React from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isLoading = useAuthStore((state) => state.isLoading);
  if (isLoading) return <Loading />;
  return <>{children}</>;
}
