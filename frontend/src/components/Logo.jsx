import React from "react";
import logo from "../assets/logo.png"; // ✅ update path if needed

const sizes = {
  sm: "h-8",   // 32px
  md: "h-16",  // 44px (DEFAULT – best for navbar)
  lg: "h-20",  // 56px
};

const Logo = ({ size = "md", showText = true }) => {
  return (
    <div className="flex items-center gap-3 select-none">
      <img
        src={logo}
        alt="Jan Suvidha Logo"
        className={`${sizes[size]} w-auto object-contain`}
        loading="eager"
        decoding="async"
      />

      {showText && (
        <span className="text-xl font-bold tracking-wide text-blue-700">
          JAN SUVIDHA
        </span>
      )}
    </div>
  );
};

export default Logo;
