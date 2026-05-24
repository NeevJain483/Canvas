"use client";
import React from "react";

import Navbar from "@component/layout/common/Navbar";
import Sidebar from "@component/layout/dashboard/Sidebar";

import "@style/component/layout/index.css";
import "@style/component/layout/dashboard/index.css";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {


  return (
    <>
      <div className="layout">
        <Navbar />
        <div className="dashboard-layout-sidebar-main-container">
          <Sidebar />
          {children}
        </div>
      </div>
    </>
  );
}
