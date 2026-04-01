import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import OfficerSidebar from "./OfficerSidebar";
import OfficerNavbar from "./OfficerNavbar";

const OfficerLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex flex-col h-screen bg-light-bg dark:bg-[#0B1120] text-light-text dark:text-dark-text overflow-hidden transition-all duration-300">

      {/* 🚀 TOP NAVBAR (Full Width) */}
      <div className="relative z-40 bg-white dark:bg-[#0B1120] border-b border-light-border dark:border-dark-border shadow-sm">
        <OfficerNavbar onMenuClick={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      </div>

      {/* 📦 BOTTOM CONTAINER (Sidebar + Content) */}
      <div className="flex flex-1 overflow-hidden">

        {/* SIDEBAR (Below Nav) */}
        <aside className="w-64 h-full bg-slate-900 border-r border-light-border dark:border-dark-border z-30 transition-all duration-300 overflow-y-auto">
          <OfficerSidebar onClose={() => setIsSidebarOpen(false)} />
        </aside>

        {/* MAIN CONTENT Area */}
        <main className="flex-1 p-6 bg-gray-50 dark:bg-[#0B1120] overflow-auto">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default OfficerLayout;