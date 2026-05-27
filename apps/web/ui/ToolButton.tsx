import React, { ButtonHTMLAttributes, ReactNode } from "react";

interface ToolButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: ReactNode;
  onClick: () => void;
  isActive?: boolean;
}

const ToolButton: React.FC<ToolButtonProps> = ({
  label,
  onClick,
  isActive = false,
  className = "",
  style,
  ...props
}) => {
  return (
    <button
      onClick={onClick}
      className={`tool-btn ${isActive ? "active" : ""} ${className}`}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "36px",
        height: "36px",
        borderRadius: "6px",
        cursor: "pointer",
        transition: "all 0.1s ease",
        backgroundColor: isActive ? "#e2e8f0" : "transparent",
        border: isActive ? "1px solid #94a3b8" : "1px solid transparent",
        color: isActive ? "#0f172a" : "#475569",
        ...style,
      }}
      {...props}
    >
      {label}
    </button>
  );
};

export default ToolButton;
