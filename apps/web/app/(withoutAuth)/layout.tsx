"use client";
import Loading from "@component/common/Loading";
import { useAuthStore } from "@lib/store/authStore";
import React, { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";
import { useRouter } from "next/navigation";
import Navbar from "@component/layout/Navbar";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isLoading, user, _hasHydrated } = useAuthStore(
    useShallow((state) => ({
      isLoading: state.isLoading,
      user: state.user,
      _hasHydrated: state._hasHydrated,
    })),
  );

  const [isClient, setIsClient] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isLoading && !user && _hasHydrated) {
      router.push("/auth/login");
    }
  }, [isLoading, user, router, _hasHydrated]);

  if (isLoading || !isClient || !_hasHydrated) return <Loading />;
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
