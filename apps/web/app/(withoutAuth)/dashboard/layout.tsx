import Sidebar from "@component/layout/Sidebar";
import React from "react";

const layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      {children}
    </div>
  );
};

export default layout;
