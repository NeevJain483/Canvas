"use client";
import Loading from "@component/common/Loading";
import { useAuthStore } from "@lib/store/authStore";
import React, { useEffect } from "react";
import { useShallow } from "zustand/shallow";
import { useRouter } from "next/navigation";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isLoading, user } = useAuthStore(
    useShallow((state) => ({
      isLoading: state.isLoading,
      user: state.user,
    })),
  );

  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login");
    }
  }, [isLoading, user, router]);

  if (isLoading) return <Loading />;
  return <>{children}</>;
}
