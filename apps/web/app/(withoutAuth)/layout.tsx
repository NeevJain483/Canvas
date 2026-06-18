"use client";
import Loading from "@component/common/Loading";
import { useAuthStore } from "@lib/store/authStore";
import React, { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "@component/layout/Navbar";
import ErrorGeneral from "@component/MessagePages/ErrorGeneral";
import { useProjectStore } from "@lib/store/projectStore";

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
  const { error, projectsLoading } = useProjectStore(
    useShallow((state) => ({
      createProject: state.createProject,
      error: state.projectError,
      projectsLoading: state.projectsLoading,
    })),
  );

  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isNavbar = pathname.split("/").includes("edit") || pathname.split("/").includes("review");

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isLoading && !user && _hasHydrated) {
      router.push("/auth/login");
    }
  }, [isLoading, user, router, _hasHydrated]);

  if (error) return <ErrorGeneral />;
  if (isLoading || !isClient || !_hasHydrated || projectsLoading) return <Loading />;
  return (
    <>
      {!isNavbar && <Navbar />}
      {children}
    </>
  );
}
