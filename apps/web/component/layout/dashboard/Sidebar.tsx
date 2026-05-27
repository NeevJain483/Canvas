"use client";
import React from "react";
import { CgProfile } from "react-icons/cg";
import QuickActions from "../../dashboard/QuickActions";

import "@style/component/layout/dashboard/sidebar.css";
import { useRouter } from "next/navigation";

const Sidebar = () => {
  const router = useRouter();
  return (
    <aside className="dashboard-layout-sidebar">
      <section className="dashboard-layout-sidebar-profile">
        <CgProfile
          size={96}
          style={{ cursor: "pointer" }}
          onClick={() => router.push("/dashboard/profile")}
        ></CgProfile>
        <p className="dashboard-layout-sidebar-profie-name">Name</p>
      </section>
      <section>
        <QuickActions></QuickActions>
      </section>
    </aside>
  );
};

export default Sidebar;
