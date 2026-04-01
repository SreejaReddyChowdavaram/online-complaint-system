import React from "react";

const WelcomeHeader = ({ userName, role }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 21) return "Good Evening";
    return "Good Night";
  };

  const getRoleColor = (userRole) => {
    const r = userRole?.toLowerCase();
    switch (r) {
      case "citizen":
        return "text-blue-500";
      case "officer":
        return "text-green-500";
      case "admin":
        return "text-orange-500";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="mb-8 ml-1 transition-all duration-300">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-dark-text">
        {getGreeting()}, <span className={getRoleColor(role)}>{userName}</span>
      </h1>
    </div>
  );
};

export default WelcomeHeader;
