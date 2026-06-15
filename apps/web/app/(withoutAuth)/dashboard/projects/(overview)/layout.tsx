"use client";
import React from "react";

import Navbar from "@component/layout/common/Navbar";
import Sidebar from "@component/layout/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Navbar></Navbar>
      <div className="dashboard-layout-sidebar-main-container">
        <Sidebar></Sidebar>
        {children}
      </div>
    </>
  );
}
