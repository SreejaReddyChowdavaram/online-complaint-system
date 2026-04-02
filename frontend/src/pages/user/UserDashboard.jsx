import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import UserSidebar from "./UserSidebar";
import UserNavbar from "./UserNavbar";

const UserDashboard = () => {

  return (
    <div className="flex flex-col h-screen bg-light-bg dark:bg-[#0B1120] text-light-text dark:text-dark-text overflow-hidden transition-all duration-300">

      {/* 🚀 TOP NAVBAR (Fixed) */}
      <div className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-[#0B1120] border-b border-light-border dark:border-dark-border shadow-sm">
        <UserNavbar />
      </div>

      {/* 📦 BOTTOM CONTAINER (Sidebar + Content) */}
      <div className="flex flex-1 overflow-hidden relative pt-16">

        {/* SIDEBAR (Desktop Fixed, Mobile Disabled) */}
        <aside className="hidden lg:block relative w-64 h-full bg-[#0f172a] dark:bg-dark-card border-r border-light-border dark:border-dark-border lg:z-30 transition-transform duration-300 ease-in-out overflow-y-auto">
          <UserSidebar />
        </aside>

        {/* MAIN CONTENT Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-[#0B1120] overflow-auto transition-all duration-300">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>

      </div>

    </div>
  );
};

export default UserDashboard;