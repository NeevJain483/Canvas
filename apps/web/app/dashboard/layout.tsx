"use client";
import React from "react";
import { usePathname } from "next/navigation";

import Navbar from "../../component/layout/common/Navbar";
import Sidebar from "../../component/layout/dashboard/Sidebar";

import "../../style/component/layout/index.css";
import "../../style/component/layout/dashboard/index.css";
import { useCanvasStore } from "../../lib/store/canvasStore";
import { useShallow } from "zustand/shallow";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();

  const noLayoutRoutes = [
    "/dashboard",
    "/dashboard/artworks",
    "/dashboard/projects",
    "/dashboard/favorites",
  ];

  
  const { fullScreenMode } = useCanvasStore(
    useShallow((state) => ({
      fullScreenMode: state.fullScreenMode,
    })),
  );

  return (
    <>
      <div className="layout">
        {!fullScreenMode && <Navbar></Navbar>}
        {noLayoutRoutes.includes(pathname) && (
          <div className="dashboard-layout-sidebar-main-container">
            <Sidebar></Sidebar>
            {children}
          </div>
        )}
        {!noLayoutRoutes.includes(pathname) && <>{children}</>}
      </div>
    </>
  );
}
