import React from "react";
import logo from "../assets/logo.png"; // ✅ update path if needed

const sizes = {
  sm: 32,
  md: 44,
  lg: 56,
};

const Logo = ({ size = "md", showText = false }) => {
  return (
    <div className="logo-container" style={{ display: "flex", alignItems: "center", gap: "12px", userSelect: "none" }}>
      <img
        src={logo}
        alt="Jan Suvidha Logo"
        style={{ height: `${sizes[size]}px`, width: "auto", objectFit: "contain" }}
        loading="eager"
        decoding="async"
      />


    </div>
  );
};

export default Logo;
