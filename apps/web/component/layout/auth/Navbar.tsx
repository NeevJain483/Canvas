import React from "react";
import { useRouter } from "next/navigation";

import "@style/component/layout/auth/navbar.css"

const Navbar = () => {
  const router = useRouter();

  return (
    <>
      <nav>
        <div className="auth-layout-navbar">
          <button
            className="sm-btn"
            onClick={() => {
              router.push(`/auth/login`);
            }}
          >
            Login
          </button>
          <button
            className="sm-btn"
            onClick={() => {
              router.push(`/auth/register`);
            }}
          >
            Register
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
