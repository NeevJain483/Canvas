import React from "react";
import Navbar from "@component/layout/Navbar";

const layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      <div className="layout">
        <Navbar></Navbar>
        {children}
      </div>
    </>
  );
};

export default layout;
