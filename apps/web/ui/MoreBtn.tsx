"use client";

import React, { useState } from "react";
import { IconType } from "react-icons";

interface MoreBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconType;
}

export const MoreBtn: React.FC<MoreBtnProps> = ({ icon: Icon, ...props }) => {
  const [toggle, setToggle] = useState<boolean>(false);

  return (
    <>
      <button
        {...props}
        onClick={(e) => {
          setToggle(!toggle);
          if (props.onClick) props.onClick(e);
        }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "36px",
          height: "36px",
          borderRadius: "6px",
          border: "1px solid #cbd5e1",
          backgroundColor: toggle ? "#b8cae2" : "#e2e8f0",
          cursor: "pointer",
          color: "#475569",
          transform: toggle ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 0.2s ease, background-color 0.15s ease",
          ...props.style,
        }}
        title={props.title || "More Options"}
      >
        <Icon size={20} />
      </button>
    </>
  );
};

interface OptionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconType;
  format: {
    iconColor: string;
    label: string;
  };
}

export const OptionForMore: React.FC<OptionProps> = ({
  icon: Icon,
  format,
  ...props
}) => {
  return (
    <>
      <button
        {...props}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          width: "100%",
          padding: "8px 12px",
          backgroundColor: "transparent",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          textAlign: "left",
          fontSize: "14px",
          fontWeight: 500,
          color: "#334155",
          transition: "background-color 0.1s ease",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "#f1f5f9")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "transparent")
        }
      >
        <Icon size={18} style={{ color: format.iconColor }} />
        {format.label}
      </button>
    </>
  );
};
