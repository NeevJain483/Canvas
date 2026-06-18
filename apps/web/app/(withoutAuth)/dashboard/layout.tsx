"use client";
import Sidebar from "@component/layout/Sidebar";
import { usePathname } from "next/navigation";
import React from "react";

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const pathname = usePathname();
  const isSidebar =
    pathname.split("/").includes("edit") ||
    pathname.split("/").includes("review");
  return (
    <div className="flex h-screen">
      {!isSidebar && <Sidebar />}
      {children}
    </div>
  );
};

export default Layout;
