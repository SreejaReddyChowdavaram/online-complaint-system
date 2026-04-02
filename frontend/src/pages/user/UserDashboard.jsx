import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import UserSidebar from "./UserSidebar";
import UserNavbar from "./UserNavbar";

const UserDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex flex-col h-screen bg-light-bg dark:bg-[#0B1120] text-light-text dark:text-dark-text overflow-hidden transition-all duration-300">

      {/* 🚀 TOP NAVBAR (Fixed) */}
      <div className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-[#0B1120] border-b border-light-border dark:border-dark-border shadow-sm">
        <UserNavbar onMenuClick={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      </div>

      {/* 📦 BOTTOM CONTAINER (Sidebar + Content) */}
      <div className="flex flex-1 overflow-hidden relative pt-16">
        
        {/* MOBILE OVERLAY (Below Navbar) */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-x-0 bottom-0 top-16 bg-slate-900/60 backdrop-blur-sm z-45 lg:hidden transition-opacity duration-300"
            onClick={toggleSidebar}
          />
        )}

        {/* SIDEBAR (Drawer on mobile, Fixed on Desktop) */}
        <aside className={`fixed lg:relative lg:translate-x-0 top-16 lg:top-0 left-0 w-64 h-[calc(100vh-4rem)] lg:h-full bg-[#0f172a] dark:bg-dark-card border-r border-light-border dark:border-dark-border z-48 lg:z-30 transition-transform duration-300 ease-in-out overflow-y-auto ${
          isSidebarOpen ? "translate-x-0 shadow-2xl lg:shadow-none" : "-translate-x-full"
        }`}>
          <UserSidebar onClose={() => setIsSidebarOpen(false)} />
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