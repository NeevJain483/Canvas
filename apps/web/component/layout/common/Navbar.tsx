"use client"
import Image from "next/image";
import React from "react";
import { CgProfile } from "react-icons/cg";
import { IoIosSearch } from "react-icons/io";
import "@style/component/layout/dashboard/navbar.css";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  return (
    <>
      <nav className="dashboard-navigation">
        <div className="dashboard-navigation-logo">
          <Image src={"/logo.svg"} alt="logo" width={60} height={60}></Image>
        </div>
        <div className="dashboard-navigation-quick-action">
          <button onClick={()=>router.push("/dashboard")}>Home</button>
          <button onClick={()=>router.push("/marketplace")}>Market Place</button>
          <button onClick={()=>router.push("/gallery")}>Gallery</button>
        </div>
        <div className="dashboard-navigation-search-container">
          <IoIosSearch size={32}></IoIosSearch>
          <CgProfile size={48}></CgProfile>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
